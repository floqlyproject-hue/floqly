import type { AnalyticsEvent, UserProperties } from './types'

/**
 * Track an analytics event
 */
export function track(event: AnalyticsEvent) {
  // Yandex Metrika
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(
      Number(process.env.NEXT_PUBLIC_YM_ID),
      'reachGoal',
      event.name,
      event.properties
    )
  }

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Track:', event)
  }
}

/**
 * Identify a user
 */
export function identify(userId: string, properties?: UserProperties) {
  // Yandex Metrika user params
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(Number(process.env.NEXT_PUBLIC_YM_ID), 'userParams', {
      UserID: userId,
      ...properties,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Identify:', userId, properties)
  }
}

/**
 * Track a page view
 */
export function page(url: string, title?: string) {
  // Yandex Metrika hit
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(Number(process.env.NEXT_PUBLIC_YM_ID), 'hit', url, {
      title,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Page:', url, title)
  }
}

// Extend Window interface for Yandex Metrika
declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
  }
}
