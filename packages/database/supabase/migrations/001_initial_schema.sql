-- ============================================
-- Floqly Database Schema
-- Version: 1.0.0
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS (расширение auth.users)
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

  -- Subscription
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  plan_expires_at TIMESTAMPTZ,

  -- Limits
  widgets_limit INTEGER DEFAULT 1,
  projects_limit INTEGER DEFAULT 1,
  messages_limit INTEGER DEFAULT 100,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECTS (сайты пользователей)
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  domain TEXT, -- example.com
  description TEXT,

  -- Settings
  settings JSONB DEFAULT '{}',

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_domain ON public.projects(domain);

-- ============================================
-- WIDGETS (конфигурации виджетов)
-- ============================================
CREATE TYPE widget_type AS ENUM ('cookie', 'simple', 'ai_chat');
CREATE TYPE widget_status AS ENUM ('draft', 'active', 'paused', 'archived');

CREATE TABLE IF NOT EXISTS public.widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Basic info
  name TEXT NOT NULL,
  type widget_type NOT NULL,
  status widget_status DEFAULT 'draft',

  -- Configuration (JSON для гибкости)
  config JSONB NOT NULL DEFAULT '{}',
  -- Пример config для cookie:
  -- {
  --   "position": "bottom",
  --   "text": "Мы используем cookies...",
  --   "policy_url": "/privacy",
  --   "theme": "light",
  --   "backdrop_blur": true,
  --   "hide_days": 365
  -- }

  -- Styling
  styles JSONB DEFAULT '{}',

  -- Embed code
  embed_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),

  -- Stats (денормализация для быстрого доступа)
  views_count INTEGER DEFAULT 0,
  interactions_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_widgets_project_id ON public.widgets(project_id);
CREATE INDEX idx_widgets_user_id ON public.widgets(user_id);
CREATE INDEX idx_widgets_embed_key ON public.widgets(embed_key);
CREATE INDEX idx_widgets_type ON public.widgets(type);

-- ============================================
-- CONVERSATIONS (диалоги с AI виджетом)
-- ============================================
CREATE TYPE conversation_status AS ENUM ('active', 'closed', 'handed_off');

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,

  -- Visitor info
  visitor_id TEXT NOT NULL, -- анонимный ID посетителя
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  visitor_metadata JSONB DEFAULT '{}', -- user agent, location, etc.

  -- Status
  status conversation_status DEFAULT 'active',
  is_lead BOOLEAN DEFAULT false,

  -- Stats
  messages_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_conversations_widget_id ON public.conversations(widget_id);
CREATE INDEX idx_conversations_visitor_id ON public.conversations(visitor_id);
CREATE INDEX idx_conversations_created_at ON public.conversations(created_at DESC);

-- ============================================
-- MESSAGES (сообщения в диалогах)
-- ============================================
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,

  role message_role NOT NULL,
  content TEXT NOT NULL,

  -- Metadata
  metadata JSONB DEFAULT '{}', -- tokens, model, etc.

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- ============================================
-- KNOWLEDGE_BASE (база знаний для AI)
-- ============================================
CREATE TYPE knowledge_type AS ENUM ('faq', 'document', 'url', 'manual');

CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,

  type knowledge_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,

  -- For vector search (embeddings)
  embedding vector(1536), -- OpenAI ada-002 dimensions

  -- Metadata
  source_url TEXT,
  metadata JSONB DEFAULT '{}',

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_base_project_id ON public.knowledge_base(project_id);

-- ============================================
-- ANALYTICS_EVENTS (события аналитики)
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID REFERENCES public.widgets(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,

  -- Event info
  event_type TEXT NOT NULL, -- 'view', 'click', 'submit', 'close', etc.
  event_data JSONB DEFAULT '{}',

  -- Visitor info
  visitor_id TEXT,
  session_id TEXT,

  -- Context
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_widget_id ON public.analytics_events(widget_id);
CREATE INDEX idx_analytics_project_id ON public.analytics_events(project_id);
CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON public.analytics_events(created_at DESC);

-- Партиционирование по месяцам (для больших объёмов данных)
-- CREATE TABLE public.analytics_events_partitioned (
--   LIKE public.analytics_events INCLUDING ALL
-- ) PARTITION BY RANGE (created_at);

-- ============================================
-- LEADS (собранные лиды)
-- ============================================
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  widget_id UUID REFERENCES public.widgets(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,

  -- Contact info
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,

  -- Lead data
  message TEXT,
  source TEXT, -- 'widget', 'callback', 'form'

  -- Status
  status lead_status DEFAULT 'new',

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- CRM integration
  external_id TEXT, -- ID в CRM
  synced_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_project_id ON public.leads(project_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

-- ============================================
-- WEBHOOKS (для интеграций)
-- ============================================
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  url TEXT NOT NULL,

  -- Events to trigger
  events TEXT[] DEFAULT '{}', -- ['lead.created', 'conversation.closed']

  -- Security
  secret TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),

  -- Status
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  last_status_code INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhooks_project_id ON public.webhooks(project_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON public.widgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON public.webhooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment widget views
CREATE OR REPLACE FUNCTION increment_widget_views(widget_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.widgets
  SET views_count = views_count + 1
  WHERE id = widget_uuid;
END;
$$ LANGUAGE plpgsql;

-- Increment widget interactions
CREATE OR REPLACE FUNCTION increment_widget_interactions(widget_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.widgets
  SET interactions_count = interactions_count + 1
  WHERE id = widget_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- PROJECTS policies
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- WIDGETS policies
CREATE POLICY "Users can view own widgets"
  ON public.widgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create widgets"
  ON public.widgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own widgets"
  ON public.widgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own widgets"
  ON public.widgets FOR DELETE
  USING (auth.uid() = user_id);

-- Public access to widgets by embed_key (for widget script)
CREATE POLICY "Anyone can view active widgets by embed_key"
  ON public.widgets FOR SELECT
  USING (status = 'active');

-- CONVERSATIONS policies
CREATE POLICY "Users can view conversations for own widgets"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.widgets
      WHERE widgets.id = conversations.widget_id
      AND widgets.user_id = auth.uid()
    )
  );

-- Public insert for visitors
CREATE POLICY "Anyone can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update conversations"
  ON public.conversations FOR UPDATE
  USING (true);

-- MESSAGES policies
CREATE POLICY "Users can view messages for own conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.widgets w ON w.id = c.widget_id
      WHERE c.id = messages.conversation_id
      AND w.user_id = auth.uid()
    )
  );

-- Public insert for chat
CREATE POLICY "Anyone can create messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);

-- KNOWLEDGE_BASE policies
CREATE POLICY "Users can manage own knowledge base"
  ON public.knowledge_base FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = knowledge_base.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ANALYTICS_EVENTS policies
CREATE POLICY "Users can view own analytics"
  ON public.analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = analytics_events.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Public insert for tracking
CREATE POLICY "Anyone can create analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

-- LEADS policies
CREATE POLICY "Users can manage own leads"
  ON public.leads FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = leads.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Public insert for lead capture
CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- WEBHOOKS policies
CREATE POLICY "Users can manage own webhooks"
  ON public.webhooks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = webhooks.project_id
      AND projects.user_id = auth.uid()
    )
  );
