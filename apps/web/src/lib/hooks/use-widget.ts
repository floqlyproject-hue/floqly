'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_CONFIG, type CookieConfig } from '@/app/(tools)/tools/cookie-generator/types'
import { type CookiePolicyData } from '@/lib/templates/cookie-policy'
import { type BannerCustomization } from '@/app/(tools)/tools/cookie-generator/components/liquid-glass-island'
import { DEFAULT_CUSTOMIZATION } from '@/app/(tools)/tools/cookie-generator/components/banner-preview'

/** Shape of the `config` JSONB stored in the widgets table */
export interface StoredWidgetConfig {
  cookieConfig: CookieConfig
  cookiePolicyData: Partial<CookiePolicyData>
  bannerCustomization: BannerCustomization
  documentHtml?: string
  // Legacy fields from initial insert (flat config) — handled by migration
  [key: string]: unknown
}

const DEFAULT_COOKIE_POLICY_DATA: Partial<CookiePolicyData> = {
  technicalFeatures: {
    cart: false,
    auth: false,
    payment: false,
    preferences: false,
    security: false,
    externalServices: [],
  },
  analytics: {
    yandexMetrika: false,
    liveInternet: false,
    mailRu: false,
    customAnalytics: false,
    other: [],
  },
  crossBorder: {
    googleServices: false,
    facebookPixel: false,
    other: [],
  },
  marketing: {
    vkPixel: false,
    myTarget: false,
    yandexDirect: false,
    partnerNetworks: [],
    other: [],
  },
}

/** Merge loaded JSONB with defaults (handles missing/legacy keys) */
function parseWidgetConfig(raw: Record<string, unknown>): StoredWidgetConfig {
  return {
    cookieConfig: {
      ...DEFAULT_CONFIG,
      ...(raw.cookieConfig as Partial<CookieConfig> | undefined),
      company: {
        ...DEFAULT_CONFIG.company,
        ...((raw.cookieConfig as Record<string, unknown> | undefined)?.company as Partial<CookieConfig['company']> | undefined),
        // Also check legacy flat keys (from initial seed)
        ...(raw.company as Partial<CookieConfig['company']> | undefined),
      },
    },
    cookiePolicyData: {
      ...DEFAULT_COOKIE_POLICY_DATA,
      ...(raw.cookiePolicyData as Partial<CookiePolicyData> | undefined),
    },
    bannerCustomization: {
      ...DEFAULT_CUSTOMIZATION,
      ...(raw.bannerCustomization as Partial<BannerCustomization> | undefined),
    },
    documentHtml: (raw.documentHtml as string | undefined) ?? undefined,
  }
}

export interface Widget {
  id: string
  project_id: string
  user_id: string
  name: string
  type: 'cookie' | 'simple' | 'ai_chat'
  status: 'draft' | 'active' | 'paused' | 'archived'
  config: Record<string, unknown>
  styles: Record<string, unknown>
  embed_key: string
  views_count: number
  interactions_count: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export function useWidget(projectId: string | null) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const queryKey = ['widget', projectId, 'cookie']

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!projectId) return null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('widgets')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', 'cookie')
        .single()

      if (error) {
        // PGRST116 = no rows found — not an error, just no widget yet
        if (error.code === 'PGRST116') return null
        throw error
      }
      return data as Widget
    },
    enabled: !!projectId,
  })

  // Parse config with defaults
  const parsedConfig = query.data
    ? parseWidgetConfig(query.data.config as Record<string, unknown>)
    : null

  const updateConfigMutation = useMutation({
    mutationFn: async (configUpdates: Partial<StoredWidgetConfig>) => {
      if (!query.data) throw new Error('No widget to update')

      const currentConfig = parseWidgetConfig(query.data.config as Record<string, unknown>)
      const mergedConfig: StoredWidgetConfig = {
        ...currentConfig,
        ...configUpdates,
        // Deep merge nested objects
        cookieConfig: configUpdates.cookieConfig
          ? { ...currentConfig.cookieConfig, ...configUpdates.cookieConfig }
          : currentConfig.cookieConfig,
        cookiePolicyData: configUpdates.cookiePolicyData
          ? { ...currentConfig.cookiePolicyData, ...configUpdates.cookiePolicyData }
          : currentConfig.cookiePolicyData,
        bannerCustomization: configUpdates.bannerCustomization
          ? { ...currentConfig.bannerCustomization, ...configUpdates.bannerCustomization }
          : currentConfig.bannerCustomization,
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('widgets')
        .update({
          config: mergedConfig,
          updated_at: new Date().toISOString(),
        })
        .eq('id', query.data.id)
        .select()
        .single()

      if (error) throw error
      return data as Widget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    widget: query.data,
    config: parsedConfig,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateConfig: updateConfigMutation.mutateAsync,
    isSaving: updateConfigMutation.isPending,
  }
}
