'use client'

import { useMemo } from 'react'
import type { CookieConfig } from '../types'
import { generateFromTemplate, type BannerTemplateId } from '../templates'

interface BannerPreviewProps {
  config: CookieConfig
  selectedTemplate: BannerTemplateId | 'custom'
  customText: string
  screenshotUrl: string | null
  isScreenshotLoading: boolean
}

export function BannerPreview({
  config,
  selectedTemplate,
  customText,
  screenshotUrl,
  isScreenshotLoading,
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
          container: 'bottom-3 left-3 right-3',
          inner: 'rounded-xl border shadow-lg max-w-2xl mx-auto',
          animation: banner.animation === 'slide' ? 'animate-slide-up' : '',
        }
      case 'corner':
        return {
          container: 'bottom-3 right-3 left-auto max-w-[200px]',
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

  const displayDomain = useMemo(() => {
    if (!company.website) return 'yoursite.ru'
    try {
      let url = company.website
      if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url
      return new URL(url).hostname
    } catch {
      return 'yoursite.ru'
    }
  }, [company.website])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Предпросмотр</h3>
        <div className="flex items-center gap-1.5 rounded-full bg-muted/60 px-2 py-0.5">
          <div className="size-1.5 rounded-full bg-success" />
          <span className="text-[10px] font-medium text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Preview Container - Premium Browser Frame */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30 shadow-sm">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 border-b border-border/40 bg-muted/50 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-400/60" />
            <div className="size-2.5 rounded-full bg-yellow-400/60" />
            <div className="size-2.5 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1">
            <div className="mx-auto flex h-5 w-48 items-center justify-center rounded-md bg-background/60 text-[9px] text-muted-foreground">
              {displayDomain}
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* Website Preview */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
          {/* Screenshot background */}
          {screenshotUrl && (
            <img
              src={screenshotUrl}
              alt="Превью сайта"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          )}

          {/* Skeleton fallback (когда скриншота ещё нет) */}
          {!screenshotUrl && (
            <div className="absolute inset-0 p-4">
              {/* Navigation */}
              <div className="flex items-center gap-3">
                <div className="flex size-6 items-center justify-center rounded-md bg-primary/10">
                  <div className="size-3 rounded-sm bg-primary/40" />
                </div>
                <div className="h-2 w-14 rounded-full bg-muted-foreground/10" />
                <div className="ml-auto flex gap-3">
                  <div className="h-2 w-8 rounded-full bg-muted-foreground/8" />
                  <div className="h-2 w-8 rounded-full bg-muted-foreground/8" />
                  <div className="h-2 w-8 rounded-full bg-muted-foreground/8" />
                </div>
              </div>

              {/* Hero Section */}
              <div className="mt-6 flex flex-col items-center text-center">
                <div className="h-3 w-32 rounded-full bg-muted-foreground/15" />
                <div className="mt-2 h-2 w-48 rounded-full bg-muted-foreground/8" />
                <div className="mt-1 h-2 w-40 rounded-full bg-muted-foreground/8" />
                <div className="mt-4 h-5 w-20 rounded-md bg-primary/20" />
              </div>

              {/* Cards Grid */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg border border-border/30 bg-card/50 p-2">
                    <div className="aspect-video rounded-md bg-muted-foreground/8" />
                    <div className="mt-2 h-1.5 w-3/4 rounded-full bg-muted-foreground/10" />
                    <div className="mt-1 h-1.5 w-1/2 rounded-full bg-muted-foreground/6" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading overlay (первая загрузка, скриншота ещё нет) */}
          {isScreenshotLoading && !screenshotUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <div className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-2 shadow-sm">
                <div className="size-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-[10px] font-medium text-foreground/70">Загрузка превью…</span>
              </div>
            </div>
          )}

          {/* Loading badge (обновление при смене URL) */}
          {isScreenshotLoading && screenshotUrl && (
            <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-0.5 shadow-sm backdrop-blur-sm">
              <div className="size-2.5 animate-spin rounded-full border border-primary border-t-transparent" />
              <span className="text-[9px] font-medium text-foreground/70">Обновляется…</span>
            </div>
          )}

          {/* Backdrop blur overlay */}
          {banner.backdropBlur && (
            <div className="pointer-events-none absolute inset-0 bg-background/10 backdrop-blur-[1px]" />
          )}

          {/* Cookie Banner */}
          <div
            className={`absolute ${positionStyles.container} ${
              banner.animation === 'fade' ? 'animate-fade-in' : ''
            } ${positionStyles.animation}`}
            style={{ scale: '0.75', transformOrigin: banner.position === 'top' ? 'top center' : 'bottom center' }}
          >
            <div
              className={`${colorStyles.bg} ${positionStyles.inner} ${colorStyles.border} p-3 ${
                banner.backdropBlur ? 'backdrop-blur-md bg-opacity-95' : ''
              }`}
            >
              {banner.position === 'corner' ? (
                /* Corner layout - vertical */
                <div className="space-y-2">
                  <p className={`text-[9px] leading-relaxed ${colorStyles.text}`}>
                    {bannerText.slice(0, 80)}…
                  </p>
                  {company.privacyPolicyUrl && (
                    <span className={`text-[8px] underline underline-offset-2 ${colorStyles.textMuted}`}>
                      Подробнее
                    </span>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <button
                      className={`rounded-md px-2 py-1.5 text-[8px] font-medium ${colorStyles.buttonPrimary}`}
                    >
                      {buttonText.accept}
                    </button>
                    {banner.showDeclineButton && (
                      <button
                        className={`rounded-md border px-2 py-1 text-[8px] font-medium ${colorStyles.buttonSecondary}`}
                      >
                        {buttonText.decline}
                      </button>
                    )}
                    {banner.showSettingsButton && (
                      <span className={`text-center text-[7px] ${colorStyles.textMuted}`}>
                        {buttonText.settings}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* Default layout - horizontal */
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`text-[9px] leading-relaxed ${colorStyles.text} truncate`}>
                      {bannerText.slice(0, 60)}…
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {banner.showSettingsButton && (
                      <span className={`text-[7px] ${colorStyles.textMuted}`}>
                        {buttonText.settings}
                      </span>
                    )}
                    {banner.showDeclineButton && (
                      <button
                        className={`rounded-md border px-2 py-1 text-[8px] font-medium ${colorStyles.buttonSecondary}`}
                      >
                        {buttonText.decline}
                      </button>
                    )}
                    <button
                      className={`rounded-md px-2 py-1 text-[8px] font-medium ${colorStyles.buttonPrimary}`}
                    >
                      {buttonText.accept}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <p className="text-center text-xs text-muted-foreground">
        Баннер адаптируется под размер экрана
      </p>
    </div>
  )
}
