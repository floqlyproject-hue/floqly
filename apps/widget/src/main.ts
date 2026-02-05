/**
 * Floqly Widget - Main Entry Point
 *
 * This script initializes the widget and attaches it to the DOM
 * using Shadow DOM for style isolation.
 */

import { Widget } from './core/widget'
import type { WidgetConfig } from './core/types'

// Global namespace for widget
declare global {
  interface Window {
    Floqly?: {
      init: (config: WidgetConfig) => Widget
      destroy: () => void
      _instance?: Widget
    }
  }
}

// Initialize widget API
window.Floqly = {
  /**
   * Initialize the widget with given configuration
   */
  init(config: WidgetConfig): Widget {
    // Destroy existing instance if any
    if (window.Floqly?._instance) {
      window.Floqly._instance.destroy()
    }

    // Create new instance
    const widget = new Widget(config)
    window.Floqly!._instance = widget

    // Mount to DOM
    widget.mount()

    return widget
  },

  /**
   * Destroy the widget instance
   */
  destroy(): void {
    if (window.Floqly?._instance) {
      window.Floqly._instance.destroy()
      window.Floqly._instance = undefined
    }
  },
}

// Auto-initialize if config is present in script tag
const script = document.currentScript as HTMLScriptElement | null
if (script) {
  const widgetId = script.getAttribute('data-widget-id')
  if (widgetId) {
    // Fetch config from API and initialize
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/widgets/${widgetId}/config`)
      .then((res) => res.json())
      .then((config: WidgetConfig) => {
        window.Floqly?.init(config)
      })
      .catch((error) => {
        console.error('[Floqly] Failed to load widget config:', error)
      })
  }
}
