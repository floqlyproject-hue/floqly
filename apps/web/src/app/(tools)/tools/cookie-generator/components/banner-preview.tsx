'use client'

import { useMemo } from 'react'
import type { CookieConfig } from '../types'
import { generateFromTemplate, type BannerTemplateId } from '../templates'

interface BannerPreviewProps {
  config: CookieConfig
  selectedTemplate: BannerTemplateId | 'custom'
  customText: string
}

export function BannerPreview({
  config,
  selectedTemplate,
  customText,
}: BannerPreviewProps) {
  const { banner, buttonText, company } = config

  const bannerText = useMemo(() => {
    if (selectedTemplate === 'custom') {
      return customText || 'Мы используем cookie для улучшения работы сайта.'
    }
    return generateFromTemplate(selectedTemplate, config)
  }, [selectedTemplate, customText, config])

  // Color scheme styles
  const colorStyles = useMemo(() => {
    switch (banner.colorScheme) {
      case 'dark':
        return {
          bg: 'bg-zinc-900',
          border: 'border-zinc-800',
          text: 'text-zinc-100',
          textMuted: 'text-zinc-400',
          buttonPrimary: 'bg-white text-zinc-900 hover:bg-zinc-100',
          buttonSecondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border-zinc-700',
        }
      case 'brand':
        return {
          bg: 'bg-primary',
          border: 'border-primary',
          text: 'text-primary-foreground',
          textMuted: 'text-primary-foreground/70',
          buttonPrimary: 'bg-white text-primary hover:bg-white/90',
          buttonSecondary: 'bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 border-primary-foreground/20',
        }
      default:
        return {
          bg: 'bg-white dark:bg-zinc-900',
          border: 'border-zinc-200 dark:border-zinc-800',
          text: 'text-zinc-900 dark:text-zinc-100',
          textMuted: 'text-zinc-500 dark:text-zinc-400',
          buttonPrimary: 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100',
          buttonSecondary: 'bg-transparent text-zinc-700 hover:bg-zinc-100 border-zinc-300 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:border-zinc-700',
        }
    }
  }, [banner.colorScheme])

  // Position styles
  const positionStyles = useMemo(() => {
    switch (banner.position) {
      case 'top':
        return {
          container: 'top-0 left-0 right-0',
          inner: 'border-b',
          animation: banner.animation === 'slide' ? 'animate-slide-down' : '',
        }
      case 'floating':
        return {
          container: 'bottom-4 left-4 right-4',
          inner: 'rounded-xl border shadow-lg max-w-2xl mx-auto',
          animation: banner.animation === 'slide' ? 'animate-slide-up' : '',
        }
      case 'corner':
        return {
          container: 'bottom-4 right-4 left-auto max-w-sm',
          inner: 'rounded-xl border shadow-lg',
          animation: banner.animation === 'slide' ? 'animate-slide-up' : '',
        }
      default:
        return {
          container: 'bottom-0 left-0 right-0',
          inner: 'border-t',
          animation: banner.animation === 'slide' ? 'animate-slide-up' : '',
        }
    }
  }, [banner.position, banner.animation])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Предпросмотр</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Масштаб: 80%</span>
        </div>
      </div>

      {/* Preview Container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted to-muted/50">
        {/* Fake website background */}
        <div className="absolute inset-0 p-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="size-8 rounded bg-muted-foreground/20" />
            <div className="h-3 w-20 rounded bg-muted-foreground/15" />
            <div className="ml-auto flex gap-2">
              <div className="h-3 w-12 rounded bg-muted-foreground/10" />
              <div className="h-3 w-12 rounded bg-muted-foreground/10" />
              <div className="h-3 w-12 rounded bg-muted-foreground/10" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-8">
            <div className="h-4 w-48 rounded bg-muted-foreground/20" />
            <div className="mt-4 space-y-2">
              <div className="h-2.5 w-full rounded bg-muted-foreground/10" />
              <div className="h-2.5 w-5/6 rounded bg-muted-foreground/10" />
              <div className="h-2.5 w-4/6 rounded bg-muted-foreground/10" />
            </div>
          </div>

          {/* Cards */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg bg-background/50 p-3">
                <div className="h-12 rounded bg-muted-foreground/10" />
                <div className="mt-2 h-2 w-3/4 rounded bg-muted-foreground/10" />
                <div className="mt-1 h-2 w-1/2 rounded bg-muted-foreground/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Backdrop blur overlay */}
        {banner.backdropBlur && (
          <div className="pointer-events-none absolute inset-0 bg-black/5 backdrop-blur-[2px]" />
        )}

        {/* Cookie Banner */}
        <div
          className={`absolute ${positionStyles.container} ${
            banner.animation === 'fade' ? 'animate-fade-in' : ''
          } ${positionStyles.animation}`}
          style={{ scale: '0.8', transformOrigin: banner.position === 'top' ? 'top' : 'bottom' }}
        >
          <div
            className={`${colorStyles.bg} ${positionStyles.inner} ${colorStyles.border} p-4 ${
              banner.backdropBlur ? 'backdrop-blur-md' : ''
            }`}
          >
            {banner.position === 'corner' ? (
              /* Corner layout - vertical */
              <div className="space-y-3">
                <p className={`text-xs leading-relaxed ${colorStyles.text}`}>
                  {bannerText}
                </p>
                {company.privacyPolicyUrl && (
                  <a
                    href="#"
                    className={`text-xs underline underline-offset-2 ${colorStyles.textMuted}`}
                  >
                    Подробнее
                  </a>
                )}
                <div className="flex flex-col gap-2">
                  <button
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${colorStyles.buttonPrimary}`}
                  >
                    {buttonText.accept}
                  </button>
                  {banner.showDeclineButton && (
                    <button
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${colorStyles.buttonSecondary}`}
                    >
                      {buttonText.decline}
                    </button>
                  )}
                  {banner.showSettingsButton && (
                    <button
                      className={`text-xs ${colorStyles.textMuted} hover:underline`}
                    >
                      {buttonText.settings}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Default layout - horizontal */
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <p className={`text-xs leading-relaxed ${colorStyles.text}`}>
                    {bannerText}
                  </p>
                  {company.privacyPolicyUrl && (
                    <a
                      href="#"
                      className={`mt-1 inline-block text-xs underline underline-offset-2 ${colorStyles.textMuted}`}
                    >
                      Политика конфиденциальности
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {banner.showSettingsButton && (
                    <button
                      className={`text-xs ${colorStyles.textMuted} hover:underline`}
                    >
                      {buttonText.settings}
                    </button>
                  )}
                  {banner.showDeclineButton && (
                    <button
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${colorStyles.buttonSecondary}`}
                    >
                      {buttonText.decline}
                    </button>
                  )}
                  <button
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${colorStyles.buttonPrimary}`}
                  >
                    {buttonText.accept}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Баннер адаптируется под размер экрана пользователя
      </p>
    </div>
  )
}
