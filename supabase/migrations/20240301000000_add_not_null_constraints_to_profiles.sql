-- Add NOT NULL constraints to essential columns in the profiles table
ALTER TABLE public.profiles 
  ALTER COLUMN full_name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL;

-- Add a comment explaining the constraints
COMMENT ON COLUMN public.profiles.full_name IS 'User''s full name (required)';
COMMENT ON COLUMN public.profiles.email IS 'User''s email address (required, must be unique)';
COMMENT ON COLUMN public.profiles.created_at IS 'Timestamp when the profile was created (required)';
COMMENT ON COLUMN public.profiles.updated_at IS 'Timestamp when the profile was last updated (required)';

-- Update the trigger function to ensure required fields are set
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.email, ''), -- Ensure email is never null
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''), -- Default to empty string if not provided
    COALESCE(NEW.created_at, NOW()),
    COALESCE(NEW.updated_at, NOW())
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
