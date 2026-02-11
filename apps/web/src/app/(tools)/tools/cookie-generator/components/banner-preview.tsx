'use client'

import { useMemo, useRef, useState, useCallback } from 'react'
import type { CookieConfig } from '../types'
import { LiquidGlassIsland } from './liquid-glass-island'
import { BackgroundSwitcherIsland, type PreviewBackground } from './background-switcher-island'
import { ClassicBanner, BANNER_DEFAULTS } from './banner-styles'

interface BannerPreviewProps {
  config: CookieConfig
  screenshotUrl: string | null
  isScreenshotLoading: boolean
}

export function BannerPreview({
  config,
  screenshotUrl,
  isScreenshotLoading,
}: BannerPreviewProps) {
  const { company } = config

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

  const previewRef = useRef<HTMLDivElement>(null)
  const companyName = company.name?.trim() || 'Наш сайт'

  // Background switcher state
  const [activeBackground, setActiveBackground] = useState<PreviewBackground>('screenshot')
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null)

  const handleCustomImageUpload = useCallback((url: string) => {
    setCustomImageUrl(url)
    setActiveBackground('custom')
  }, [])

  // Which image to display in the preview
  const displayImage = activeBackground === 'screenshot' ? screenshotUrl
    : activeBackground === 'custom' ? customImageUrl
    : null

  // Background class for solid backgrounds
  const solidBg = activeBackground === 'light'
    ? 'bg-white'
    : activeBackground === 'dark'
      ? 'bg-zinc-900'
      : ''

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div>
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">
          Предпросмотр баннера
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground/70">
          Так будет выглядеть баннер cookie на вашем сайте
        </p>
      </div>

      {/* Preview wrapper — relative for island positioning outside overflow:hidden */}
      <div ref={previewRef} className="relative">
        {/* Browser Frame */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-background px-3 py-2">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-red-400/60" />
              <div className="size-2.5 rounded-full bg-yellow-400/60" />
              <div className="size-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="flex-1">
              <div className="mx-auto flex h-5 w-48 items-center justify-center rounded-md bg-muted/60 text-[9px] text-muted-foreground">
                {displayDomain}
              </div>
            </div>
            <div className="w-12" />
          </div>

          {/* Website Preview — viewport-adaptive height so the entire browser frame fits on screen when scrolled to */}
          <div className={`relative h-[clamp(260px,calc(100dvh-14rem),800px)] ${solidBg || 'bg-gradient-to-b from-background via-background to-muted/20'}`}>
            {/* Background Switcher Island */}
            <BackgroundSwitcherIsland
              activeBackground={activeBackground}
              onBackgroundChange={setActiveBackground}
              onCustomImageUpload={handleCustomImageUpload}
              containerRef={previewRef}
            />

            {/* Screenshot / Custom image */}
            {displayImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayImage}
                alt="Превью сайта"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}

            {/* Skeleton Fallback — shown only when no image and not a solid background */}
            {!displayImage && !solidBg && (
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

            {/* Loading Overlay */}
            {isScreenshotLoading && activeBackground === 'screenshot' && !screenshotUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-2 shadow-sm">
                  <div className="size-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-[10px] font-medium text-foreground/70">Загрузка превью…</span>
                </div>
              </div>
            )}

            {/* Updating Badge */}
            {isScreenshotLoading && screenshotUrl && activeBackground === 'screenshot' && (
              <div className="absolute right-1.5 top-12 z-10 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-0.5 shadow-sm backdrop-blur-sm">
                <div className="size-2.5 animate-spin rounded-full border border-primary border-t-transparent" />
                <span className="text-[9px] font-medium text-foreground/70">Обновляется…</span>
              </div>
            )}

            {/* Cookie Banner Overlay — uses style component */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ scale: '0.75', transformOrigin: 'bottom center' }}
            >
              <ClassicBanner
                {...BANNER_DEFAULTS}
                description={`${companyName} использует файлы cookie для улучшения работы сайта и анализа трафика.`}
              />
            </div>
          </div>
        </div>

        {/* Editing Island — outside Browser Frame so tooltips aren't clipped */}
        <LiquidGlassIsland containerRef={previewRef} />
      </div>

      {/* Info */}
      <p className="text-center text-xs text-muted-foreground">
        Баннер отображается в нижней части страницы
      </p>
    </div>
  )
}
