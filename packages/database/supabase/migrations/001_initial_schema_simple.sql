-- ============================================
-- Floqly Database Schema (без vector extension)
-- Выполни этот SQL в Supabase SQL Editor
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (расширение auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'Europe/Moscow',
  language TEXT DEFAULT 'ru',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  plan_expires_at TIMESTAMPTZ,
  widgets_limit INTEGER DEFAULT 1,
  projects_limit INTEGER DEFAULT 1,
  messages_limit INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT,
  description TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- ============================================
-- WIDGETS
-- ============================================
DO $$ BEGIN
  CREATE TYPE widget_type AS ENUM ('cookie', 'simple', 'ai_chat');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE widget_status AS ENUM ('draft', 'active', 'paused', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type widget_type NOT NULL,
  status widget_status DEFAULT 'draft',
  config JSONB NOT NULL DEFAULT '{}',
  styles JSONB DEFAULT '{}',
  embed_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  views_count INTEGER DEFAULT 0,
  interactions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_widgets_project_id ON public.widgets(project_id);
CREATE INDEX IF NOT EXISTS idx_widgets_user_id ON public.widgets(user_id);
CREATE INDEX IF NOT EXISTS idx_widgets_embed_key ON public.widgets(embed_key);

-- ============================================
-- CONVERSATIONS
-- ============================================
DO $$ BEGIN
  CREATE TYPE conversation_status AS ENUM ('active', 'closed', 'handed_off');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  visitor_metadata JSONB DEFAULT '{}',
  status conversation_status DEFAULT 'active',
  is_lead BOOLEAN DEFAULT false,
  messages_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_conversations_widget_id ON public.conversations(widget_id);

-- ============================================
-- MESSAGES
-- ============================================
DO $$ BEGIN
  CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);

-- ============================================
-- LEADS
-- ============================================
DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  widget_id UUID REFERENCES public.widgets(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  message TEXT,
  source TEXT,
  status lead_status DEFAULT 'new',
  metadata JSONB DEFAULT '{}',
  external_id TEXT,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_project_id ON public.leads(project_id);

-- ============================================
-- ANALYTICS_EVENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID REFERENCES public.widgets(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  visitor_id TEXT,
  session_id TEXT,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_widget_id ON public.analytics_events(widget_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_widgets_updated_at ON public.widgets;
CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON public.widgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- PROJECTS
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- WIDGETS
DROP POLICY IF EXISTS "Users can view own widgets" ON public.widgets;
CREATE POLICY "Users can view own widgets" ON public.widgets FOR SELECT USING (auth.uid() = user_id OR status = 'active');
DROP POLICY IF EXISTS "Users can create widgets" ON public.widgets;
CREATE POLICY "Users can create widgets" ON public.widgets FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own widgets" ON public.widgets;
CREATE POLICY "Users can update own widgets" ON public.widgets FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own widgets" ON public.widgets;
CREATE POLICY "Users can delete own widgets" ON public.widgets FOR DELETE USING (auth.uid() = user_id);

-- CONVERSATIONS (public insert for visitors)
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.widgets WHERE widgets.id = conversations.widget_id AND widgets.user_id = auth.uid())
);
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.conversations;
CREATE POLICY "Anyone can create conversations" ON public.conversations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can update conversations" ON public.conversations;
CREATE POLICY "Anyone can update conversations" ON public.conversations FOR UPDATE USING (true);

-- MESSAGES (public insert for chat)
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    JOIN public.widgets w ON w.id = c.widget_id
    WHERE c.id = messages.conversation_id AND w.user_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "Anyone can create messages" ON public.messages;
CREATE POLICY "Anyone can create messages" ON public.messages FOR INSERT WITH CHECK (true);

-- LEADS
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
CREATE POLICY "Users can view own leads" ON public.leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = leads.project_id AND projects.user_id = auth.uid())
);
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
CREATE POLICY "Anyone can create leads" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
CREATE POLICY "Users can update own leads" ON public.leads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = leads.project_id AND projects.user_id = auth.uid())
);

-- ANALYTICS (public insert for tracking)
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics_events;
CREATE POLICY "Users can view own analytics" ON public.analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = analytics_events.project_id AND projects.user_id = auth.uid())
);
DROP POLICY IF EXISTS "Anyone can create analytics events" ON public.analytics_events;
CREATE POLICY "Anyone can create analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- ============================================
-- DONE!
-- ============================================
