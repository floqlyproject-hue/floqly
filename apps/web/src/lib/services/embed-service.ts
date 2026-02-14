/**
 * Embed Service — абстракция от Supabase для embed-системы
 *
 * Все Supabase-запросы для embed API изолированы здесь.
 * При миграции с Supabase — меняем только этот файл.
 */

import { createServerClient } from '@supabase/ssr'

// Admin client without cookies (for API routes that don't have cookie context)
function createEmbedAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// ════════════════════════════════════════
// Types
// ════════════════════════════════════════

export interface EmbedWidgetConfig {
  id: string
  type: 'cookie' | 'simple' | 'ai_chat'
  config: Record<string, unknown>
  embed_key: string
  project_id: string
}

export interface AnalyticsEventInput {
  widget_id: string
  event_type: string
  visitor_id: string
  session_id: string
  page_url: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  event_data?: Record<string, unknown>
}

// ════════════════════════════════════════
// Widget Config
// ════════════════════════════════════════

/**
 * Get active widget config by embed_key
 */
export async function getWidgetConfig(embedKey: string): Promise<EmbedWidgetConfig | null> {
  const supabase = createEmbedAdminClient()

  const { data, error } = await supabase
    .from('widgets')
    .select('id, type, config, embed_key, project_id')
    .eq('embed_key', embedKey)
    .eq('status', 'active')
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    type: data.type as EmbedWidgetConfig['type'],
    config: (data.config as Record<string, unknown>) || {},
    embed_key: data.embed_key,
    project_id: data.project_id,
  }
}

/**
 * Get all active widgets for a project (for future project-wide loader)
 */
export async function getWidgetsByProject(projectId: string): Promise<EmbedWidgetConfig[]> {
  const supabase = createEmbedAdminClient()

  const { data, error } = await supabase
    .from('widgets')
    .select('id, type, config, embed_key, project_id')
    .eq('project_id', projectId)
    .eq('status', 'active')

  if (error || !data) return []

  return data.map((w) => ({
    id: w.id,
    type: w.type as EmbedWidgetConfig['type'],
    config: (w.config as Record<string, unknown>) || {},
    embed_key: w.embed_key,
    project_id: w.project_id,
  }))
}

// ════════════════════════════════════════
// Analytics Events
// ════════════════════════════════════════

/**
 * Record an analytics event + increment widget counters
 */
export async function recordAnalyticsEvent(event: AnalyticsEventInput): Promise<void> {
  const supabase = createEmbedAdminClient()

  // Insert event into analytics_events table
  await supabase.from('analytics_events').insert({
    widget_id: event.widget_id,
    event_type: event.event_type,
    visitor_id: event.visitor_id,
    session_id: event.session_id,
    page_url: event.page_url,
    referrer: event.referrer || null,
    user_agent: event.user_agent || null,
    ip_address: event.ip_address || null,
    event_data: event.event_data || null,
  })

  // Increment counters via SQL functions
  if (event.event_type === 'view') {
    await supabase.rpc('increment_widget_views', { widget_uuid: event.widget_id })
  } else {
    await supabase.rpc('increment_widget_interactions', { widget_uuid: event.widget_id })
  }
}

/**
 * Get widget stats (views, interactions) for dashboard
 */
export async function getWidgetStats(widgetId: string) {
  const supabase = createEmbedAdminClient()

  const { data } = await supabase
    .from('widgets')
    .select('views_count, interactions_count')
    .eq('id', widgetId)
    .single()

  return data || { views_count: 0, interactions_count: 0 }
}
