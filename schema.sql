-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create ENUM types for data integrity
create type user_role as enum ('candidate', 'company', 'admin');
create type specialty_path as enum ('dev', 'ops');
create type job_modality as enum ('remote', 'hybrid', 'onsite');
create type contract_type as enum ('full_time', 'part_time', 'internship', 'freelance');

-- PROFILES TABLE
-- Linked to auth.users. This table stores public profile information.
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  role user_role not null default 'candidate',
  specialty_path specialty_path, -- 'dev' for Developers, 'ops' for Infra/Support
  bio text,
  github_url text,
  linkedin_url text,
  
  constraint username_length check (char_length(username) >= 3)
);

-- PORTFOLIO_ITEMS TABLE
-- Critical for 'ops' path to showcase Homelabs/Projects. Also useful for 'dev'.
create table portfolio_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  image_urls text[], -- Array of image URLs
  technologies text[], -- Array of technologies used
  project_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CERTIFICATIONS TABLE
-- Important for the 'ops' path validation.
create table certifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  issuing_organization text not null,
  issue_date date,
  expiration_date date,
  credential_id text,
  credential_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOBS TABLE
-- Job postings by companies.
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references profiles(id) on delete cascade not null, -- Assumes profile with role 'company'
  title text not null,
  description text not null,
  salary_min integer,
  salary_max integer,
  contract_type contract_type not null,
  modality job_modality not null,
  location text,
  requirements text[],
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES
-- Secure the data by default.

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table portfolio_items enable row level security;
alter table certifications enable row level security;
alter table jobs enable row level security;

-- PROFILES POLICIES
-- Public profiles are viewable by everyone.
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Users can insert their own profile (usually handled via triggers on auth.signup, but good to have).
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- Users can update own profile.
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- PORTFOLIO_ITEMS POLICIES
-- Viewable by everyone.
create policy "Portfolio items are viewable by everyone."
  on portfolio_items for select
  using ( true );

-- Users can insert/update/delete their own portfolio items.
create policy "Users can manage own portfolio items."
  on portfolio_items for all
  using ( auth.uid() = user_id );

-- CERTIFICATIONS POLICIES
-- Viewable by everyone.
create policy "Certifications are viewable by everyone."
  on certifications for select
  using ( true );

-- Users can manage own certifications.
create policy "Users can manage own certifications."
  on certifications for all
  using ( auth.uid() = user_id );

-- JOBS POLICIES
-- Jobs are viewable by everyone.
create policy "Jobs are viewable by everyone."
  on jobs for select
  using ( true );

-- Only companies can manage jobs.
-- Note: Ideally we check if the user role is 'company' in the profile, 
-- but RLS recursive queries can be expensive. 
-- For simplicity here, we assume if you are the company_id owner, you can edit.
-- A stricter policy would join with profiles.
create policy "Companies can manage own jobs."
  on jobs for all
  using ( auth.uid() = company_id );

-- HELPER FUNCTIONS (Optional but recommended)

-- Function to handle new user signup (auto-create profile)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'candidate'); -- Default to candidate
  return new;
end;
$$;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
