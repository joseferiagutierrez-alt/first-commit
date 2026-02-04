-- Habilitar Row Level Security en las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA LA TABLA PROFILES
-- 1. Lectura pública: Cualquier usuario (incluso anónimo/reclutadores) puede ver los perfiles básicos
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- 2. Edición propia: Solo el usuario dueño del perfil puede editarlo
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- POLÍTICAS PARA LA TABLA TEST_RESULTS
-- 1. Lectura: El usuario puede ver sus notas, y los reclutadores (autenticados) también
CREATE POLICY "Users can view own results" 
ON test_results FOR SELECT 
USING (auth.uid() = user_id);

-- Nota: Si tuvieras un rol 'recruiter', añadirías: OR auth.jwt() ->> 'role' = 'recruiter'

-- 2. Inserción: El sistema (backend) o el usuario puede insertar su resultado una vez
CREATE POLICY "Users can insert own results" 
ON test_results FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Protección de integridad: Nadie puede editar un resultado una vez creado (inmutabilidad)
-- No creamos política de UPDATE para test_results

-- POLÍTICAS PARA JOB_APPLICATIONS
CREATE POLICY "Users can view own applications" 
ON job_applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" 
ON job_applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);
