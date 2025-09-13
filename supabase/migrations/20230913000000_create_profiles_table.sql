-- First, drop the existing table if it exists to avoid conflicts
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create the profiles table with UUID type to match auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the foreign key for better performance
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles (id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
EXCEPTION WHEN OTHERS THEN
  -- Ignore errors if policies don't exist
  RAISE NOTICE 'Error dropping policies: %', SQLERRM;
END $$;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create or replace the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update the profile
  INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,  -- Using the BIGINT ID directly
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the user creation
  RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Create a function to manually create a profile if needed
CREATE OR REPLACE FUNCTION public.ensure_profile_exists(user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (user_id, '', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
