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
