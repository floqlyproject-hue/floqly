/**
 * Widget configuration types
 */

export type WidgetType = 'cookie' | 'simple' | 'smart'

export type WidgetPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'

export interface WidgetConfig {
  /** Unique widget ID */
  id: string

  /** Widget type */
  type: WidgetType

  /** Project ID this widget belongs to */
  projectId: string

  /** Allowed domains (for CORS) */
  allowedDomains: string[]

  /** Visual configuration */
  appearance: WidgetAppearance

  /** Behavior configuration */
  behavior: WidgetBehavior

  /** Content configuration */
  content: WidgetContent
}

export interface WidgetAppearance {
  /** Widget position on screen */
  position: WidgetPosition

  /** Custom offset from corner */
  offset?: {
    x: number
    y: number
  }

  /** Theme/skin name */
  theme: string

  /** Primary color */
  primaryColor: string

  /** Text color */
  textColor: string

  /** Background color */
  backgroundColor: string

  /** Border radius */
  borderRadius: number

  /** Show branding (Powered by Floqly) */
  showBranding: boolean
}

export interface WidgetBehavior {
  /** When to show the widget */
  trigger: WidgetTrigger

  /** Delay before showing (ms) */
  delay: number

  /** Scroll percentage trigger */
  scrollTrigger?: number

  /** Enable exit intent */
  exitIntent?: boolean

  /** Auto-open chat */
  autoOpen: boolean

  /** Remember user state */
  persistState: boolean
}

export type WidgetTrigger = 'immediate' | 'delay' | 'scroll' | 'exit-intent'

export interface WidgetContent {
  /** Launcher button config */
  launcher?: {
    icon?: string
    text?: string
  }

  /** Teaser message config */
  teaser?: {
    enabled: boolean
    message: string
    delay: number
  }

  /** Chat header config */
  header?: {
    title: string
    subtitle?: string
    avatar?: string
  }

  /** Welcome message */
  welcomeMessage?: string

  /** Quick replies */
  quickReplies?: string[]

  /** Offline message */
  offlineMessage?: string
}

/**
 * Widget state
 */
export interface WidgetState {
  isOpen: boolean
  isMinimized: boolean
  unreadCount: number
  isOnline: boolean
  visitorId: string | null
}

/**
 * Widget events
 */
export type WidgetEventType =
  | 'open'
  | 'close'
  | 'message'
  | 'ready'
  | 'error'

export interface WidgetEvent {
  type: WidgetEventType
  data?: unknown
}

export type WidgetEventHandler = (event: WidgetEvent) => void

// ════════════════════════════════════════
// Embed API types
// ════════════════════════════════════════

/** Response from GET /api/v1/embed/{widgetId} */
export interface EmbedConfigResponse {
  widget: {
    id: string
    type: WidgetType
    config: WidgetConfig | CookieWidgetConfig
  }
}

/** Cookie-specific widget configuration */
export interface CookieWidgetConfig extends WidgetConfig {
  type: 'cookie'
  /** Cookie banner customization from Dashboard */
  cookieConfig: {
    /** Banner text */
    text: {
      title: string
      description: string
      acceptButton: string
      declineButton: string
      settingsButton?: string
    }
    /** Banner design */
    design: {
      preset: string
      backgroundColor: string
      textColor: string
      buttonColor: string
      buttonTextColor: string
      borderRadius: number
      shadow: boolean
      opacity: number
    }
    /** Banner position */
    position: {
      vertical: 'top' | 'center' | 'bottom'
      horizontal: 'left' | 'center' | 'right'
      width: 'stretched' | 'normal' | 'compact'
      offsetX: number
      offsetY: number
    }
    /** Banner animation */
    animation: {
      type: 'slide' | 'fade' | 'bounce' | 'scale' | 'none'
      speed: number
      trigger: 'time' | 'scroll'
      triggerValue: number
      backdrop: boolean
      backdropBlur: number
      backdropOpacity: number
    }
    /** Cookie types to track */
    cookieTypes: Array<{
      id: string
      name: string
      required: boolean
      enabled: boolean
    }>
    /** Consent expiry in days */
    consentExpiryDays: number
  }
}

/** Analytics event payload sent from widget to API */
export interface AnalyticsEventPayload {
  widget_id: string
  event_type: 'view' | 'cookie_accept' | 'cookie_decline' | 'cookie_settings' | 'interaction' | 'open' | 'close'
  event_data?: Record<string, unknown>
  visitor_id: string
  session_id: string
  page_url: string
  referrer: string
  user_agent: string
}
