-- TABLA COMPANY_ASSESSMENTS
-- Permite a las empresas guardar los tests generados por IA
create table if not exists public.company_assessments (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  tech_stack text not null, -- 'React', 'DevOps', etc.
  difficulty text not null, -- 'Junior', 'Senior'
  questions jsonb not null, -- Array de preguntas generadas
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Políticas RLS para Company Assessments
ALTER TABLE company_assessments ENABLE ROW LEVEL SECURITY;

-- 1. Lectura:
-- - Las empresas pueden ver sus propios tests.
-- - Los candidatos pueden ver tests activos (si implementáramos esa vista).
CREATE POLICY "Companies can view own assessments" 
ON company_assessments FOR SELECT 
USING (auth.uid() = company_id);

-- 2. Inserción: Las empresas pueden crear tests
CREATE POLICY "Companies can create assessments" 
ON company_assessments FOR INSERT 
WITH CHECK (auth.uid() = company_id);

-- 3. Actualización: Las empresas pueden activar/desactivar sus tests
CREATE POLICY "Companies can update own assessments" 
ON company_assessments FOR UPDATE 
USING (auth.uid() = company_id);
