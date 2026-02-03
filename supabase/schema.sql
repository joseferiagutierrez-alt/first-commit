-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ENUMS (Tipos de datos personalizados para integridad)
create type user_role as enum ('candidate', 'company');
create type tech_path as enum ('dev', 'infra', 'data', 'design', 'cyber', 'qa');
create type xp_level as enum ('no_experience', 'internship', 'junior');
create type location_type as enum ('remote', 'hybrid', 'onsite');

-- 2. TABLA PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  bio text,
  role user_role default 'candidate' not null,
  tech_path tech_path, -- Puede ser null al principio, se rellena en onboarding
  xp_level xp_level,
  github_url text,
  linkedin_url text,
  
  -- Flexible fields for path-specific data
  -- 'tools_used': Para Data (PowerBI, Python) o QA (Selenium, etc.)
  tools_used text[], 
  
  -- 'platform_handles': Para Cyber (HackTheBox user, TryHackMe), Design (Behance user), etc.
  -- Estructura esperada: { "hackthebox": "user123", "behance": "user.design" }
  platform_handles jsonb default '{}'::jsonb,

  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraint: Solo developers deberían tener github_url (opcional pero recomendada)
  constraint username_length check (char_length(full_name) >= 2)
);

-- 3. TABLA PORTFOLIO_PROJECTS (Homelab / Proyectos)
create table public.portfolio_projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  image_urls text[], -- Array de URLs de imágenes
  tech_stack text[], -- Array de tecnologías (ej: ['Docker', 'Proxmox', 'React'])
  live_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABLA CERTIFICATIONS
create table public.certifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  issuer text not null, -- Entidad emisora (AWS, Cisco, Google)
  issue_date date,
  credential_id text,
  is_verified boolean default false, -- Para futuro sistema de verificación
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TABLA JOBS (Ofertas de empleo)
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  salary_min integer,
  salary_max integer,
  currency text default 'EUR',
  location_type location_type not null,
  junior_friendly jsonb default '{}'::jsonb, -- Flags: { "mentorship": true, "training_budget": true }
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5.1 TABLA TEST_RESULTS
create table public.test_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  test_type text not null, -- 'quiz' or 'terminal'
  score integer not null,
  passed boolean default false,
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5.2 TABLA JOB_APPLICATIONS
create table public.job_applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  status text default 'pending',
  cover_letter text,
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, job_id)
);

-- 5.3 TABLA PROFILE_VIEWS (Notifications)
create table public.profile_views (
  id uuid default uuid_generate_v4() primary key,
  candidate_id uuid references public.profiles(id) on delete cascade not null,
  company_name text not null,
  viewer_id uuid references auth.users(id) on delete set null,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. CONFIGURACIÓN DE SEGURIDAD (RLS)

-- Habilitar RLS en todas las tablas
alter table public.profiles enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.certifications enable row level security;
alter table public.jobs enable row level security;
alter table public.test_results enable row level security;
alter table public.job_applications enable row level security;
alter table public.profile_views enable row level security;

-- Políticas para PROFILES
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Políticas para PORTFOLIO_PROJECTS
create policy "Portfolio projects are viewable by everyone"
  on public.portfolio_projects for select
  using ( true );

create policy "Users can manage their own portfolio projects"
  on public.portfolio_projects for all
  using ( auth.uid() = user_id );

-- Políticas para CERTIFICATIONS
create policy "Certifications are viewable by everyone"
  on public.certifications for select
  using ( true );

create policy "Users can manage their own certifications"
  on public.certifications for all
  using ( auth.uid() = user_id );

-- Políticas para JOBS
create policy "Jobs are viewable by everyone"
  on public.jobs for select
  using ( true );

create policy "Companies can insert jobs"
  on public.jobs for insert
  with check ( 
    auth.uid() = company_id 
    -- Idealmente verificaríamos también que el usuario tenga role='company'
    -- using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'company') )
  );

create policy "Companies can update their own jobs"
  on public.jobs for update
  using ( auth.uid() = company_id );

-- Políticas para TEST_RESULTS
create policy "Users can view their own test results"
  on public.test_results for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own test results"
  on public.test_results for insert
  with check ( auth.uid() = user_id );

-- Políticas para JOB_APPLICATIONS
create policy "Users can view their own applications"
  on public.job_applications for select
  using ( auth.uid() = user_id );

create policy "Users can apply to jobs"
  on public.job_applications for insert
  with check ( auth.uid() = user_id );

-- Políticas para PROFILE_VIEWS
create policy "Users can view their own profile views"
  on public.profile_views for select
  using ( auth.uid() = candidate_id );

create policy "Anyone can insert profile views"
  on public.profile_views for insert
  with check ( true );

-- TRIGGER AUTOMÁTICO PARA CREAR PERFIL AL REGISTRARSE
-- Esto asegura que cada usuario en auth.users tenga una entrada en public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'candidate')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
