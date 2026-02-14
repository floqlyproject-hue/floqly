/**
 * Floqly Widget - Main Entry Point
 *
 * This script initializes widgets and attaches them to the DOM
 * using Shadow DOM for style isolation.
 *
 * Each <script data-widget-id="..."> tag creates a separate widget instance.
 * Multiple widgets can coexist on the same page without conflicts.
 */

import { Widget } from './core/widget'
import { CookieBanner } from './widgets/cookie-banner'
import type { WidgetConfig, EmbedConfigResponse, AnalyticsEventPayload } from './core/types'

// Build-time API URL (injected by Vite define)
declare const __FLOQLY_API_URL__: string
const API_URL = typeof __FLOQLY_API_URL__ !== 'undefined' ? __FLOQLY_API_URL__ : 'https://floqly.ru'

// Base widget interface for all widget types
interface BaseWidget {
  destroy(): void
}

// Global namespace for widget management
declare global {
  interface Window {
    Floqly?: {
      init: (config: WidgetConfig) => Widget
      destroy: (widgetId?: string) => void
      _instances: Map<string, BaseWidget>
      _reportEvent: (payload: AnalyticsEventPayload) => void
    }
  }
}

// Generate a session ID (persists for page visit)
function getSessionId(): string {
  const key = 'floqly_session_id'
  let sessionId: string | null = null
  try { sessionId = sessionStorage.getItem(key) } catch { /* private mode */ }
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : generateUUID()
    try { sessionStorage.setItem(key, sessionId) } catch { /* private mode */ }
  }
  return sessionId
}

// Get or generate visitor ID (persists across visits)
function getVisitorId(): string {
  const key = 'floqly_visitor_id'
  let visitorId: string | null = null
  try { visitorId = localStorage.getItem(key) } catch { /* private mode */ }
  if (!visitorId) {
    visitorId = crypto.randomUUID ? crypto.randomUUID() : generateUUID()
    try { localStorage.setItem(key, visitorId) } catch { /* private mode */ }
  }
  return visitorId
}

// UUID fallback for older browsers
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Report analytics event to API
function reportEvent(payload: AnalyticsEventPayload): void {
  try {
    const url = `${API_URL}/api/v1/embed/events`
    const body = JSON.stringify(payload)
    // Use sendBeacon for fire-and-forget (won't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body)
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // Silently fail — analytics should never break the page
  }
}

// Initialize widget API
window.Floqly = {
  _instances: new Map(),

  /**
   * Initialize a widget with given configuration (manual API)
   */
  init(config: WidgetConfig): Widget {
    const existing = window.Floqly!._instances.get(config.id)
    if (existing) {
      existing.destroy()
    }

    const widget = new Widget(config)
    window.Floqly!._instances.set(config.id, widget)
    widget.mount()

    return widget
  },

  /**
   * Destroy widget instance(s)
   */
  destroy(widgetId?: string): void {
    if (widgetId) {
      const instance = window.Floqly!._instances.get(widgetId)
      if (instance) {
        instance.destroy()
        window.Floqly!._instances.delete(widgetId)
      }
    } else {
      // Destroy all
      window.Floqly!._instances.forEach((instance) => instance.destroy())
      window.Floqly!._instances.clear()
    }
  },

  /**
   * Report an analytics event (public API for external use)
   */
  _reportEvent: reportEvent,
}

// ════════════════════════════════════════════════
// Auto-initialization from <script data-widget-id="...">
// ════════════════════════════════════════════════

const script = document.currentScript as HTMLScriptElement | null
if (script) {
  const widgetId = script.getAttribute('data-widget-id')
  if (widgetId) {
    // Fetch config from embed API
    fetch(`${API_URL}/api/v1/embed/${widgetId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: EmbedConfigResponse) => {
        const { widget: widgetData } = data
        const visitorId = getVisitorId()
        const sessionId = getSessionId()

        // Report view event
        reportEvent({
          widget_id: widgetData.id,
          event_type: 'view',
          visitor_id: visitorId,
          session_id: sessionId,
          page_url: window.location.href,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
        })

        // Create widget based on type
        switch (widgetData.type) {
          case 'cookie': {
            const cookieBanner = new CookieBanner(
              widgetData.config as any,
              { visitorId, sessionId, reportEvent }
            )
            window.Floqly!._instances.set(widgetData.id, cookieBanner)
            cookieBanner.mount()
            break
          }

          case 'simple':
          case 'smart':
          default: {
            // Default: use base Widget class (future implementation)
            const widget = new Widget(widgetData.config as WidgetConfig)
            window.Floqly!._instances.set(widgetData.id, widget)
            widget.mount()
            break
          }
        }
      })
      .catch(() => {
        // Silently fail in production — don't pollute client's console
      })
  }
}
