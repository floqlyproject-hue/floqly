/**
 * Analytics event type
 */
export interface AnalyticsEvent {
  /** Event name */
  name: string
  /** Event properties */
  properties?: Record<string, unknown>
}

/**
 * User properties for identification
 */
export interface UserProperties {
  email?: string
  name?: string
  plan?: 'free' | 'pro' | 'enterprise'
  [key: string]: unknown
}

/**
 * Predefined event names
 */
export const Events = {
  // Widget events
  WIDGET_LOADED: 'widget_loaded',
  WIDGET_OPENED: 'widget_opened',
  WIDGET_CLOSED: 'widget_closed',
  WIDGET_MESSAGE_SENT: 'widget_message_sent',
  WIDGET_MESSAGE_RECEIVED: 'widget_message_received',

  // Auth events
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',

  // Dashboard events
  PROJECT_CREATED: 'project_created',
  WIDGET_CREATED: 'widget_created',
  WIDGET_CONFIGURED: 'widget_configured',
  CODE_COPIED: 'code_copied',

  // Conversion events
  LEAD_CAPTURED: 'lead_captured',
  CALLBACK_REQUESTED: 'callback_requested',
  UPGRADE_CLICKED: 'upgrade_clicked',
} as const

export type EventName = (typeof Events)[keyof typeof Events]
