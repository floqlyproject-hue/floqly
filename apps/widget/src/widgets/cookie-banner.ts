/**
 * Cookie Banner Widget
 *
 * Renders a cookie consent banner in Shadow DOM.
 * Handles accept/decline, localStorage persistence,
 * and analytics event reporting.
 */

import type { CookieWidgetConfig, AnalyticsEventPayload } from '../core/types'
import { getCookieBannerStyles } from './cookie-styles'

const CONSENT_STORAGE_KEY = 'floqly_cookie_consent'

interface CookieBannerContext {
  visitorId: string
  sessionId: string
  reportEvent: (payload: AnalyticsEventPayload) => void
}

export class CookieBanner {
  private config: CookieWidgetConfig
  private ctx: CookieBannerContext
  private container: HTMLElement | null = null
  private shadowRoot: ShadowRoot | null = null

  constructor(config: CookieWidgetConfig, ctx: CookieBannerContext) {
    this.config = config
    this.ctx = ctx
  }

  /**
   * Mount the cookie banner to DOM
   */
  mount(): void {
    // Check if consent already given
    if (this.hasConsent()) return

    // Check trigger conditions
    const { animation } = this.config.cookieConfig
    if (animation.trigger === 'scroll') {
      this.setupScrollTrigger(animation.triggerValue)
      return
    }

    // Time-based trigger (default)
    const delay = animation.trigger === 'time' ? animation.triggerValue * 1000 : 0
    if (delay > 0) {
      setTimeout(() => this.show(), delay)
    } else {
      this.show()
    }
  }

  /**
   * Show the banner
   */
  private show(): void {
    if (this.container) return // Already showing

    // Create container
    this.container = document.createElement('div')
    this.container.id = `floqly-cookie-${this.config.id}`
    this.shadowRoot = this.container.attachShadow({ mode: 'closed' })

    // Inject styles
    const { cookieConfig } = this.config
    const style = document.createElement('style')
    style.textContent = getCookieBannerStyles({
      backgroundColor: cookieConfig.design.backgroundColor,
      textColor: cookieConfig.design.textColor,
      buttonColor: cookieConfig.design.buttonColor,
      buttonTextColor: cookieConfig.design.buttonTextColor,
      borderRadius: cookieConfig.design.borderRadius,
      shadow: cookieConfig.design.shadow,
      opacity: cookieConfig.design.opacity,
      width: cookieConfig.position.width,
      vertical: cookieConfig.position.vertical,
      horizontal: cookieConfig.position.horizontal,
      offsetX: cookieConfig.position.offsetX,
      offsetY: cookieConfig.position.offsetY,
      animationType: cookieConfig.animation.type,
      animationSpeed: cookieConfig.animation.speed,
      backdrop: cookieConfig.animation.backdrop,
      backdropBlur: cookieConfig.animation.backdropBlur,
      backdropOpacity: cookieConfig.animation.backdropOpacity,
    })
    this.shadowRoot.appendChild(style)

    // Build HTML
    const { text } = cookieConfig
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
      ${cookieConfig.animation.backdrop ? '<div class="flc-backdrop"></div>' : ''}
      <div class="flc-banner" role="dialog" aria-label="Cookie consent">
        ${text.title ? `<div class="flc-title">${this.escapeHtml(text.title)}</div>` : ''}
        <div class="flc-description">${this.escapeHtml(text.description)}</div>
        <div class="flc-buttons">
          <button class="flc-btn flc-btn-accept" data-action="accept">${this.escapeHtml(text.acceptButton)}</button>
          <button class="flc-btn flc-btn-decline" data-action="decline">${this.escapeHtml(text.declineButton)}</button>
          ${text.settingsButton ? `<button class="flc-btn flc-btn-settings" data-action="settings">${this.escapeHtml(text.settingsButton)}</button>` : ''}
        </div>
        <div class="flc-branding">
          <a href="https://floqly.ru" target="_blank" rel="noopener noreferrer">Floqly</a>
        </div>
      </div>
    `
    this.shadowRoot.appendChild(wrapper)

    // Show backdrop
    const backdropEl = this.shadowRoot.querySelector('.flc-backdrop')
    if (backdropEl) {
      requestAnimationFrame(() => backdropEl.classList.add('flc-visible'))
    }

    // Attach event listeners
    this.shadowRoot.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const action = (e.currentTarget as HTMLElement).getAttribute('data-action')
        if (action === 'accept') this.handleAccept()
        else if (action === 'decline') this.handleDecline()
        else if (action === 'settings') this.handleSettings()
      })
    })

    // Append to DOM
    document.body.appendChild(this.container)
  }

  /**
   * Handle "Accept" click
   */
  private handleAccept(): void {
    this.saveConsent('accepted', {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    })

    // Report event
    this.ctx.reportEvent({
      widget_id: this.config.id,
      event_type: 'cookie_accept',
      visitor_id: this.ctx.visitorId,
      session_id: this.ctx.sessionId,
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      event_data: { consent: 'all' },
    })

    // Dispatch custom event for client's scripts
    window.dispatchEvent(new CustomEvent('floqly:consent', {
      detail: { action: 'accept', categories: ['necessary', 'analytics', 'marketing', 'functional'] },
    }))

    this.dismiss()
  }

  /**
   * Handle "Decline" click
   */
  private handleDecline(): void {
    this.saveConsent('declined', {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    })

    // Report event
    this.ctx.reportEvent({
      widget_id: this.config.id,
      event_type: 'cookie_decline',
      visitor_id: this.ctx.visitorId,
      session_id: this.ctx.sessionId,
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    })

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('floqly:consent', {
      detail: { action: 'decline', categories: ['necessary'] },
    }))

    this.dismiss()
  }

  /**
   * Handle "Settings" click (placeholder — opens detailed settings in future)
   */
  private handleSettings(): void {
    this.ctx.reportEvent({
      widget_id: this.config.id,
      event_type: 'cookie_settings',
      visitor_id: this.ctx.visitorId,
      session_id: this.ctx.sessionId,
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    })

    // For now, treat as accept (future: open settings panel)
    this.handleAccept()
  }

  /**
   * Dismiss banner with exit animation
   */
  private dismiss(): void {
    if (!this.shadowRoot) return

    const banner = this.shadowRoot.querySelector('.flc-banner')
    const backdrop = this.shadowRoot.querySelector('.flc-backdrop')

    if (banner) {
      banner.classList.add('flc-exiting')
    }
    if (backdrop) {
      backdrop.classList.remove('flc-visible')
    }

    // Remove after animation
    const speed = this.config.cookieConfig.animation.speed * 1000
    setTimeout(() => this.destroy(), speed + 50)
  }

  /**
   * Remove from DOM
   */
  destroy(): void {
    if (this.container) {
      this.container.remove()
      this.container = null
      this.shadowRoot = null
    }
  }

  /**
   * Check if consent was already given
   */
  private hasConsent(): boolean {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
      if (!stored) return false

      const data = JSON.parse(stored)
      // Check expiry
      const expiryDays = this.config.cookieConfig.consentExpiryDays || 365
      const expiryMs = expiryDays * 24 * 60 * 60 * 1000
      if (Date.now() - data.timestamp > expiryMs) {
        localStorage.removeItem(CONSENT_STORAGE_KEY)
        return false
      }

      return true
    } catch {
      return false
    }
  }

  /**
   * Save consent to localStorage + cookie
   */
  private saveConsent(action: string, categories: Record<string, boolean>): void {
    try {
      const data = {
        action,
        categories,
        timestamp: Date.now(),
        widget_id: this.config.id,
      }
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data))

      // Also set a cookie for server-side reading
      const expiryDays = this.config.cookieConfig.consentExpiryDays || 365
      const expires = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `floqly_consent=${action}; expires=${expires}; path=/; SameSite=Lax`
    } catch {
      // Private browsing mode — silently fail
    }
  }

  /**
   * Setup scroll-based trigger
   */
  private setupScrollTrigger(scrollPercent: number): void {
    const handler = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0

      if (percent >= scrollPercent) {
        window.removeEventListener('scroll', handler)
        this.show()
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(str: string): string {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }
}
