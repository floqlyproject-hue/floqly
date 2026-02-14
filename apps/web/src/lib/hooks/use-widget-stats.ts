'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface WidgetStats {
  views_count: number
  interactions_count: number
}

/**
 * Fetches widget stats (views, interactions) from the widgets table.
 * Uses the client-side Supabase client (RLS-protected).
 * Polls every 30 seconds when widget is active.
 */
export function useWidgetStats(widgetId: string | null | undefined) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['widget-stats', widgetId],
    queryFn: async (): Promise<WidgetStats> => {
      if (!widgetId) return { views_count: 0, interactions_count: 0 }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('widgets')
        .select('views_count, interactions_count')
        .eq('id', widgetId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return { views_count: 0, interactions_count: 0 }
        throw error
      }

      return {
        views_count: data?.views_count ?? 0,
        interactions_count: data?.interactions_count ?? 0,
      }
    },
    enabled: !!widgetId,
    refetchInterval: 30_000, // Poll every 30 seconds
    staleTime: 10_000,
  })
}

/**
 * Fetches detailed analytics breakdown from analytics_events table.
 * Returns counts of cookie_accept / cookie_decline events.
 */
export function useWidgetAnalytics(widgetId: string | null | undefined) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['widget-analytics', widgetId],
    queryFn: async () => {
      if (!widgetId) return { accepts: 0, declines: 0 }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('analytics_events')
        .select('event_type')
        .eq('widget_id', widgetId)
        .in('event_type', ['cookie_accept', 'cookie_decline'])

      if (error) return { accepts: 0, declines: 0 }

      const accepts = data?.filter((e: { event_type: string }) => e.event_type === 'cookie_accept').length ?? 0
      const declines = data?.filter((e: { event_type: string }) => e.event_type === 'cookie_decline').length ?? 0

      return { accepts, declines }
    },
    enabled: !!widgetId,
    refetchInterval: 30_000,
    staleTime: 10_000,
  })
}
