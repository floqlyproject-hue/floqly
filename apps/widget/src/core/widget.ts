/**
 * Main Widget Class
 *
 * Handles widget lifecycle, Shadow DOM isolation,
 * and communication with the Floqly API.
 */

import type {
  WidgetConfig,
  WidgetState,
  WidgetEvent,
  WidgetEventHandler,
} from './types'

export class Widget {
  private config: WidgetConfig
  private state: WidgetState
  private container: HTMLElement | null = null
  private shadowRoot: ShadowRoot | null = null
  private eventHandlers: Map<string, WidgetEventHandler[]> = new Map()

  constructor(config: WidgetConfig) {
    this.config = config
    this.state = {
      isOpen: false,
      isMinimized: false,
      unreadCount: 0,
      isOnline: true,
      visitorId: this.getVisitorId(),
    }
  }

  /**
   * Mount the widget to the DOM
   */
  mount(): void {
    // Create container
    this.container = document.createElement('div')
    this.container.id = 'floqly-widget-container'

    // Create Shadow DOM for style isolation
    this.shadowRoot = this.container.attachShadow({ mode: 'open' })

    // Inject styles
    this.injectStyles()

    // Render widget
    this.render()

    // Append to body
    document.body.appendChild(this.container)

    // Setup behavior triggers
    this.setupTriggers()

    // Emit ready event
    this.emit({ type: 'ready' })
  }

  /**
   * Destroy the widget and clean up
   */
  destroy(): void {
    if (this.container) {
      this.container.remove()
      this.container = null
      this.shadowRoot = null
    }

    this.eventHandlers.clear()
  }

  /**
   * Open the widget
   */
  open(): void {
    this.state.isOpen = true
    this.state.unreadCount = 0
    this.render()
    this.emit({ type: 'open' })
  }

  /**
   * Close the widget
   */
  close(): void {
    this.state.isOpen = false
    this.render()
    this.emit({ type: 'close' })
  }

  /**
   * Toggle widget open/close
   */
  toggle(): void {
    if (this.state.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  /**
   * Subscribe to widget events
   */
  on(eventType: string, handler: WidgetEventHandler): void {
    const handlers = this.eventHandlers.get(eventType) || []
    handlers.push(handler)
    this.eventHandlers.set(eventType, handlers)
  }

  /**
   * Unsubscribe from widget events
   */
  off(eventType: string, handler: WidgetEventHandler): void {
    const handlers = this.eventHandlers.get(eventType) || []
    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
    }
  }

  /**
   * Emit a widget event
   */
  private emit(event: WidgetEvent): void {
    const handlers = this.eventHandlers.get(event.type) || []
    handlers.forEach((handler) => handler(event))
  }

  /**
   * Inject widget styles into Shadow DOM
   */
  private injectStyles(): void {
    if (!this.shadowRoot) return

    const style = document.createElement('style')
    style.textContent = this.getStyles()
    this.shadowRoot.appendChild(style)
  }

  /**
   * Get widget CSS styles
   */
  private getStyles(): string {
    const { appearance } = this.config

    return `
      :host {
        --fl-primary: ${appearance.primaryColor};
        --fl-text: ${appearance.textColor};
        --fl-bg: ${appearance.backgroundColor};
        --fl-radius: ${appearance.borderRadius}px;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .fl-widget {
        position: fixed;
        ${this.getPositionStyles()}
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.5;
      }

      .fl-launcher {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--fl-primary);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .fl-launcher:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .fl-launcher svg {
        width: 28px;
        height: 28px;
      }

      .fl-chat {
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 360px;
        height: 500px;
        background: var(--fl-bg);
        border-radius: var(--fl-radius);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.2s, transform 0.2s;
        pointer-events: none;
      }

      .fl-chat.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .fl-header {
        padding: 16px;
        background: var(--fl-primary);
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .fl-header-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
      }

      .fl-header-info {
        flex: 1;
      }

      .fl-header-title {
        font-weight: 600;
        font-size: 16px;
      }

      .fl-header-subtitle {
        font-size: 12px;
        opacity: 0.8;
      }

      .fl-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
      }

      .fl-body {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
      }

      .fl-input-area {
        padding: 16px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 8px;
      }

      .fl-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #ddd;
        border-radius: calc(var(--fl-radius) - 4px);
        font-size: 14px;
        outline: none;
      }

      .fl-input:focus {
        border-color: var(--fl-primary);
      }

      .fl-send {
        padding: 10px 16px;
        background: var(--fl-primary);
        color: white;
        border: none;
        border-radius: calc(var(--fl-radius) - 4px);
        cursor: pointer;
        font-weight: 500;
      }

      .fl-branding {
        text-align: center;
        padding: 8px;
        font-size: 11px;
        color: #999;
      }

      .fl-branding a {
        color: #666;
        text-decoration: none;
      }
    `
  }

  /**
   * Get position CSS based on config
   */
  private getPositionStyles(): string {
    const { position, offset } = this.config.appearance
    const x = offset?.x ?? 20
    const y = offset?.y ?? 20

    switch (position) {
      case 'bottom-right':
        return `bottom: ${y}px; right: ${x}px;`
      case 'bottom-left':
        return `bottom: ${y}px; left: ${x}px;`
      case 'top-right':
        return `top: ${y}px; right: ${x}px;`
      case 'top-left':
        return `top: ${y}px; left: ${x}px;`
      default:
        return `bottom: ${y}px; right: ${x}px;`
    }
  }

  /**
   * Render the widget UI
   */
  private render(): void {
    if (!this.shadowRoot) return

    // Clear existing content (except styles)
    const existingWidget = this.shadowRoot.querySelector('.fl-widget')
    if (existingWidget) {
      existingWidget.remove()
    }

    const widget = document.createElement('div')
    widget.className = 'fl-widget'
    widget.innerHTML = this.getTemplate()

    this.shadowRoot.appendChild(widget)

    // Attach event listeners
    this.attachEventListeners(widget)
  }

  /**
   * Get widget HTML template
   */
  private getTemplate(): string {
    const { content, appearance } = this.config
    const { isOpen } = this.state

    return `
      <div class="fl-chat ${isOpen ? 'open' : ''}">
        <div class="fl-header">
          <div class="fl-header-avatar"></div>
          <div class="fl-header-info">
            <div class="fl-header-title">${content.header?.title || 'Floqly'}</div>
            <div class="fl-header-subtitle">${content.header?.subtitle || 'Online'}</div>
          </div>
          <button class="fl-close" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="fl-body">
          ${content.welcomeMessage ? `<p>${content.welcomeMessage}</p>` : ''}
        </div>
        <div class="fl-input-area">
          <input type="text" class="fl-input" placeholder="Type a message..." />
          <button class="fl-send">Send</button>
        </div>
        ${appearance.showBranding ? '<div class="fl-branding">Powered by <a href="https://floqly.ru" target="_blank">Floqly</a></div>' : ''}
      </div>
      <button class="fl-launcher" aria-label="Open chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </button>
    `
  }

  /**
   * Attach event listeners to widget elements
   */
  private attachEventListeners(widget: HTMLElement): void {
    const launcher = widget.querySelector('.fl-launcher')
    const closeBtn = widget.querySelector('.fl-close')

    launcher?.addEventListener('click', () => this.toggle())
    closeBtn?.addEventListener('click', () => this.close())
  }

  /**
   * Setup behavior triggers (delay, scroll, exit-intent)
   */
  private setupTriggers(): void {
    const { behavior } = this.config

    if (behavior.trigger === 'delay' && behavior.delay > 0) {
      setTimeout(() => {
        if (behavior.autoOpen) {
          this.open()
        }
      }, behavior.delay)
    }

    // TODO: Implement scroll and exit-intent triggers
  }

  /**
   * Get or generate visitor ID
   */
  private getVisitorId(): string | null {
    const storageKey = 'floqly_visitor_id'
    let visitorId = localStorage.getItem(storageKey)

    if (!visitorId) {
      visitorId = this.generateId()
      localStorage.setItem(storageKey, visitorId)
    }

    return visitorId
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
