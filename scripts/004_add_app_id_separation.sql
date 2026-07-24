-- Add app_source column to tables that don't have it for multi-app separation
-- This allows separating data between: app_pionieri, chat_pionieri, marketplace, chat_bot_develop

-- Note: The following tables already have app_source:
-- - pi_users (has app_source, default 'unknown')
-- - banned_users (has app_source, default 'marketplace')
-- - daily_access_log (has app_source, default 'chat_pionieri')

-- Add app_source to messages (for chat messages in this app)
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS app_source TEXT DEFAULT 'app_pionieri';

-- Add app_source to pi_payments (for tracking payments per app)
ALTER TABLE public.pi_payments ADD COLUMN IF NOT EXISTS app_source TEXT DEFAULT 'app_pionieri';

-- Add app_source to chat_messages (if used)
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS app_source TEXT DEFAULT 'app_pionieri';

-- Add app_source to access_logs
ALTER TABLE public.access_logs ADD COLUMN IF NOT EXISTS app_source TEXT DEFAULT 'app_pionieri';

-- Add app_source to app_visits
ALTER TABLE public.app_visits ADD COLUMN IF NOT EXISTS app_source TEXT DEFAULT 'app_pionieri';

-- Add app_source to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS app_source TEXT DEFAULT 'app_pionieri';

-- Create indexes for faster queries by app_source
CREATE INDEX IF NOT EXISTS idx_messages_app_source ON public.messages(app_source);
CREATE INDEX IF NOT EXISTS idx_pi_payments_app_source ON public.pi_payments(app_source);
CREATE INDEX IF NOT EXISTS idx_chat_messages_app_source ON public.chat_messages(app_source);
CREATE INDEX IF NOT EXISTS idx_access_logs_app_source ON public.access_logs(app_source);
CREATE INDEX IF NOT EXISTS idx_app_visits_app_source ON public.app_visits(app_source);
CREATE INDEX IF NOT EXISTS idx_profiles_app_source ON public.profiles(app_source);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_messages_app_created ON public.messages(app_source, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pi_payments_app_status ON public.pi_payments(app_source, status);
CREATE INDEX IF NOT EXISTS idx_access_logs_app_logged ON public.access_logs(app_source, logged_at DESC);
