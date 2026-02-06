'use client'

import { useMemo, useState } from 'react'
import type { CookieConfig } from '../types'
import { generateFromTemplate, type BannerTemplateId } from '../templates'

type ViewMode = 'desktop' | 'mobile'

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
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const { banner, buttonText, company } = config
  const isMobile = viewMode === 'mobile'

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

  // Mobile position overrides — all positions become full-width bottom on mobile
  const mobilePositionStyles = useMemo(() => {
    switch (banner.position) {
      case 'top':
        return {
          container: 'top-0 left-0 right-0',
          inner: 'border-b',
          animation: banner.animation === 'slide' ? 'animate-slide-down' : '',
        }
      case 'corner':
        return {
          container: 'bottom-2 right-2 left-auto max-w-[140px]',
          inner: 'rounded-lg border shadow-lg',
          animation: banner.animation === 'slide' ? 'animate-slide-up' : '',
        }
      case 'floating':
        return {
          container: 'bottom-2 left-2 right-2',
          inner: 'rounded-lg border shadow-lg',
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

  const activePositionStyles = isMobile ? mobilePositionStyles : positionStyles

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

  // On mobile, use vertical layout for all positions (except corner keeps its own)
  const useVerticalLayout = isMobile || banner.position === 'corner'

  const bannerElement = (
    <div
      className={`absolute ${activePositionStyles.container} ${
        banner.animation === 'fade' ? 'animate-fade-in' : ''
      } ${activePositionStyles.animation}`}
      style={{
        scale: isMobile ? '0.85' : '0.75',
        transformOrigin: banner.position === 'top' ? 'top center' : 'bottom center',
      }}
    >
      <div
        className={`${colorStyles.bg} ${activePositionStyles.inner} ${colorStyles.border} p-3 ${
          banner.backdropBlur ? 'backdrop-blur-md bg-opacity-95' : ''
        }`}
      >
        {useVerticalLayout ? (
          /* Vertical layout — mobile or corner */
          <div className="space-y-2">
            <p className={`text-[9px] leading-relaxed ${colorStyles.text}`}>
              {bannerText.slice(0, isMobile && banner.position !== 'corner' ? 100 : 80)}…
            </p>
            {company.privacyPolicyUrl && (
              <span className={`text-[8px] underline underline-offset-2 ${colorStyles.textMuted}`}>
                Подробнее
              </span>
            )}
            <div className={`flex gap-1.5 ${banner.position === 'corner' ? 'flex-col' : 'flex-row'}`}>
              <button
                className={`rounded-md px-2 py-1.5 text-[8px] font-medium ${
                  banner.position !== 'corner' ? 'flex-1' : ''
                } ${colorStyles.buttonPrimary}`}
              >
                {buttonText.accept}
              </button>
              {banner.showDeclineButton && (
                <button
                  className={`rounded-md border px-2 py-1 text-[8px] font-medium ${
                    banner.position !== 'corner' ? 'flex-1' : ''
                  } ${colorStyles.buttonSecondary}`}
                >
                  {buttonText.decline}
                </button>
              )}
              {banner.showSettingsButton && (
                <span className={`text-center text-[7px] ${colorStyles.textMuted} ${
                  banner.position !== 'corner' ? 'flex-1 py-1' : ''
                }`}>
                  {buttonText.settings}
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Horizontal layout — desktop non-corner */
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
  )

  const screenshotBackground = screenshotUrl && (
    <img
      src={screenshotUrl}
      alt="Превью сайта"
      className="absolute inset-0 w-full h-full object-cover object-top"
    />
  )

  const skeletonFallback = !screenshotUrl && (
    <div className="absolute inset-0 p-4">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary/10">
          <div className="size-3 rounded-sm bg-primary/40" />
        </div>
        <div className="h-2 w-14 rounded-full bg-muted-foreground/10" />
        {!isMobile && (
          <div className="ml-auto flex gap-3">
            <div className="h-2 w-8 rounded-full bg-muted-foreground/8" />
            <div className="h-2 w-8 rounded-full bg-muted-foreground/8" />
            <div className="h-2 w-8 rounded-full bg-muted-foreground/8" />
          </div>
        )}
        {isMobile && (
          <div className="ml-auto">
            <div className="flex flex-col gap-[3px]">
              <div className="h-[2px] w-4 rounded-full bg-muted-foreground/15" />
              <div className="h-[2px] w-4 rounded-full bg-muted-foreground/15" />
              <div className="h-[2px] w-3 rounded-full bg-muted-foreground/15" />
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className={`mt-6 flex flex-col items-center text-center ${isMobile ? 'mt-8' : ''}`}>
        <div className={`h-3 rounded-full bg-muted-foreground/15 ${isMobile ? 'w-24' : 'w-32'}`} />
        <div className={`mt-2 h-2 rounded-full bg-muted-foreground/8 ${isMobile ? 'w-32' : 'w-48'}`} />
        <div className={`mt-1 h-2 rounded-full bg-muted-foreground/8 ${isMobile ? 'w-28' : 'w-40'}`} />
        <div className="mt-4 h-5 w-20 rounded-md bg-primary/20" />
      </div>

      {/* Cards Grid */}
      <div className={`mt-6 grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
        {(isMobile ? [1, 2] : [1, 2, 3]).map((i) => (
          <div key={i} className="rounded-lg border border-border/30 bg-card/50 p-2">
            <div className="aspect-video rounded-md bg-muted-foreground/8" />
            <div className="mt-2 h-1.5 w-3/4 rounded-full bg-muted-foreground/10" />
            <div className="mt-1 h-1.5 w-1/2 rounded-full bg-muted-foreground/6" />
          </div>
        ))}
      </div>
    </div>
  )

  const loadingOverlay = isScreenshotLoading && !screenshotUrl && (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
      <div className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-2 shadow-sm">
        <div className="size-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-[10px] font-medium text-foreground/70">Загрузка превью…</span>
      </div>
    </div>
  )

  const loadingBadge = isScreenshotLoading && screenshotUrl && (
    <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-0.5 shadow-sm backdrop-blur-sm">
      <div className="size-2.5 animate-spin rounded-full border border-primary border-t-transparent" />
      <span className="text-[9px] font-medium text-foreground/70">Обновляется…</span>
    </div>
  )

  const backdropOverlay = banner.backdropBlur && (
    <div className="pointer-events-none absolute inset-0 bg-background/10" />
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Предпросмотр</h3>
        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center justify-center rounded-md p-1 transition-colors duration-150 ${
                !isMobile
                  ? 'bg-foreground/[0.05] text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Десктоп"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center justify-center rounded-md p-1 transition-colors duration-150 ${
                isMobile
                  ? 'bg-foreground/[0.05] text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Мобильный"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
            </button>
          </div>

          {/* Live Badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-2 py-0.5">
            <div className="size-1.5 rounded-full bg-success" />
            <span className="text-[10px] font-medium text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      {/* Desktop Preview */}
      {!isMobile && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-background px-3 py-2">
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
            {screenshotBackground}
            {skeletonFallback}
            {loadingOverlay}
            {loadingBadge}
            {backdropOverlay}
            {bannerElement}
          </div>
        </div>
      )}

      {/* Mobile Preview */}
      {isMobile && (
        <div className="flex justify-center py-2">
          <div className="w-[180px] overflow-hidden rounded-[20px] border-2 border-zinc-800 bg-zinc-900 shadow-xl dark:border-zinc-600">
            {/* Phone Status Bar */}
            <div className="flex items-center justify-between bg-zinc-900 px-3 py-1">
              <span className="text-[7px] font-medium text-zinc-400">9:41</span>
              <div className="mx-auto h-3 w-12 rounded-full bg-zinc-800" />
              <div className="flex items-center gap-1">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-400">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                </svg>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-400">
                  <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                </svg>
              </div>
            </div>

            {/* Mobile Browser Bar */}
            <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1">
              <div className="flex-1">
                <div className="flex h-4 items-center justify-center rounded-md bg-zinc-700/60 text-[7px] text-zinc-400">
                  {displayDomain}
                </div>
              </div>
            </div>

            {/* Mobile Screen Content */}
            <div className="relative aspect-[9/16] overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
              {screenshotBackground}
              {skeletonFallback}
              {loadingOverlay}
              {loadingBadge}
              {backdropOverlay}
              {bannerElement}
            </div>

            {/* Phone Home Indicator */}
            <div className="flex justify-center bg-zinc-900 py-1.5">
              <div className="h-1 w-10 rounded-full bg-zinc-600" />
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-center text-xs text-muted-foreground">
        {isMobile ? 'Мобильная версия баннера' : 'Баннер адаптируется под размер экрана'}
      </p>
    </div>
  )
}
