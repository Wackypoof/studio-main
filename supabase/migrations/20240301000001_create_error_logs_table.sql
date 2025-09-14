-- Create error_logs table
CREATE TABLE IF NOT EXISTS public.error_logs (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  stack TEXT,
  code VARCHAR(50),
  status_code INTEGER,
  context JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  url TEXT,
  user_agent TEXT,
  component_stack TEXT,
  is_retryable BOOLEAN DEFAULT FALSE,
  original_error JSONB,
  environment VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON public.error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_code ON public.error_logs(code);
CREATE INDEX IF NOT EXISTS idx_error_logs_status_code ON public.error_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_error_logs_environment ON public.error_logs(environment);

-- Set up Row Level Security (RLS)
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to control access
CREATE POLICY "Enable read access for authenticated users" 
ON public.error_logs 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for service role"
ON public.error_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE public.error_logs IS 'Stores application error logs for debugging and monitoring';
COMMENT ON COLUMN public.error_logs.message IS 'The error message';
COMMENT ON COLUMN public.error_logs.name IS 'The name/type of the error';
COMMENT ON COLUMN public.error_logs.stack IS 'The error stack trace';
COMMENT ON COLUMN public.error_logs.code IS 'Custom error code';
COMMENT ON COLUMN public.error_logs.status_code IS 'HTTP status code associated with the error';
COMMENT ON COLUMN public.error_logs.context IS 'Additional context about the error';
COMMENT ON COLUMN public.error_logs.timestamp IS 'When the error occurred';
COMMENT ON COLUMN public.error_logs.url IS 'The URL where the error occurred';
COMMENT ON COLUMN public.error_logs.user_agent IS 'The user agent of the client';
COMMENT ON COLUMN public.error_logs.component_stack IS 'React component stack trace';
COMMENT ON COLUMN public.error_logs.is_retryable IS 'Whether the operation can be retried';
COMMENT ON COLUMN public.error_logs.original_error IS 'The original error object';
COMMENT ON COLUMN public.error_logs.environment IS 'The environment where the error occurred (development, production, etc.)';
COMMENT ON COLUMN public.error_logs.created_at IS 'When the error log was created in the database';
