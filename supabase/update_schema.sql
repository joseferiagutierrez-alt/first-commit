-- Add is_verified column to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Ensure test_results table exists (as per user statement, but good to double check)
CREATE TABLE IF NOT EXISTS public.test_results (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  test_type text NOT NULL,
  score integer NOT NULL,
  passed boolean DEFAULT false,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on test_results if not already enabled
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own test results
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'test_results' AND policyname = 'Users can view own results'
    ) THEN
        CREATE POLICY "Users can view own results" 
        ON public.test_results FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Policy: Users can insert their own test results
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'test_results' AND policyname = 'Users can insert own results'
    ) THEN
        CREATE POLICY "Users can insert own results" 
        ON public.test_results FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;
