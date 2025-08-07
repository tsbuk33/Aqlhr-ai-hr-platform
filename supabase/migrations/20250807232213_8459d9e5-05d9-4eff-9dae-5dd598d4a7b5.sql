-- Add git_commit_hash column to prompt_logs table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'prompt_logs' 
        AND column_name = 'git_commit_hash'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.prompt_logs 
        ADD COLUMN git_commit_hash TEXT;
        
        -- Add index for better performance on git commit queries
        CREATE INDEX IF NOT EXISTS idx_prompt_logs_git_commit 
        ON public.prompt_logs(git_commit_hash);
        
        -- Add index for export queries
        CREATE INDEX IF NOT EXISTS idx_prompt_logs_export 
        ON public.prompt_logs(user_id, created_at DESC, category, status);
    END IF;
END $$;