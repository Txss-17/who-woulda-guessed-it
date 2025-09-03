-- Add created_at column to questions table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'questions' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.questions 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Update existing rows to have created_at if null
UPDATE public.questions 
SET created_at = now() 
WHERE created_at IS NULL;