-- CRITICAL SECURITY FIX: Enable RLS on agent_tool_usage table
-- This table has security policies but RLS is not enabled, creating a critical vulnerability

-- Enable Row Level Security on agent_tool_usage table
ALTER TABLE public.agent_tool_usage ENABLE ROW LEVEL SECURITY;

-- Verify the table now has RLS enabled
COMMENT ON TABLE public.agent_tool_usage IS 'Agent tool usage tracking table - RLS enabled to enforce access policies';