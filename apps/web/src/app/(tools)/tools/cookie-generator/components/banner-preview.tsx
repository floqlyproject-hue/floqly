'use client'

import { useMemo, useRef, useState, useCallback } from 'react'
import type { CookieConfig } from '../types'
import { LiquidGlassIsland, type BannerCustomization } from './liquid-glass-island'
import { BackgroundSwitcherIsland, type PreviewBackground } from './background-switcher-island'
import { ClassicBanner, GlassBanner } from './banner-styles'
import { BG_COLORS, BTN_COLORS, TONE_TEXTS, type ShadowLabel, type PositionState } from './island-panels'
import type { BannerStyleProps } from './banner-styles/types'

/* ── Color resolution: preset ID → hex ── */

const BG_COLOR_MAP = Object.fromEntries(BG_COLORS.map((c) => [c.id, c.color]))
const BTN_COLOR_MAP = Object.fromEntries(BTN_COLORS.map((c) => [c.id, c.color]))

const SHADOW_MAP: Record<ShadowLabel, BannerStyleProps['shadow']> = {
  'Нет': 'none',
  'Мягкая': 'soft',
  'Сильная': 'strong',
}

function resolveBgColor(bgColor: string, bgCustom: string): string {
  if (bgColor === 'custom') return bgCustom
  return BG_COLOR_MAP[bgColor] ?? '#FFFFFF'
}

function resolveBtnColor(btnColor: string, btnCustom: string): string {
  if (btnColor === 'custom') return btnCustom
  return BTN_COLOR_MAP[btnColor] ?? '#000000'
}

/* ── Position → CSS style ── */

function computeBannerContainerStyle(pos: PositionState): React.CSSProperties {
  const style: React.CSSProperties = {
    position: 'absolute',
    transition: 'all 0.3s ease',
    scale: '0.75',
  }

  // Vertical
  if (pos.vert === 'Сверху') {
    style.top = pos.offsetY
    style.bottom = 'auto'
    style.transformOrigin = 'top center'
  } else if (pos.vert === 'Центр') {
    style.top = '50%'
    style.bottom = 'auto'
    style.transform = 'translateY(-50%)'
    style.transformOrigin = 'center center'
  } else {
    // 'Снизу' (default)
    style.bottom = pos.offsetY
    style.top = 'auto'
    style.transformOrigin = 'bottom center'
  }

  // Width + Horizontal
  if (pos.width === 'Вытянутый') {
    style.left = pos.offsetX
    style.right = pos.offsetX
  } else if (pos.width === 'Обычный') {
    style.maxWidth = '75%'
    if (pos.horiz === 'Слева') {
      style.left = pos.offsetX
      style.right = 'auto'
    } else if (pos.horiz === 'Справа') {
      style.right = pos.offsetX
      style.left = 'auto'
    } else {
      // Центр
      style.left = '50%'
      style.right = 'auto'
      style.transform = (style.transform ? style.transform + ' ' : '') + 'translateX(-50%)'
    }
  } else {
    // 'Компакт'
    style.maxWidth = 540
    if (pos.horiz === 'Слева') {
      style.left = pos.offsetX
      style.right = 'auto'
    } else if (pos.horiz === 'Справа') {
      style.right = pos.offsetX
      style.left = 'auto'
    } else {
      // Центр
      style.left = '50%'
      style.right = 'auto'
      style.transform = (style.transform ? style.transform + ' ' : '') + 'translateX(-50%)'
    }
  }

  return style
}

/* ── Default customization state ── */

const DEFAULT_CUSTOMIZATION: BannerCustomization = {
  text: {
    tone: 'friendly',
    title: TONE_TEXTS.friendly.title,
    desc: TONE_TEXTS.friendly.desc,
    accept: TONE_TEXTS.friendly.accept,
    decline: TONE_TEXTS.friendly.decline,
  },
  design: {
    bannerStyle: 'classic',
    bgColor: 'white',
    bgCustom: '#FFFFFF',
    btnColor: 'black',
    btnCustom: '#000000',
    radius: 12,
    shadow: 'Мягкая',
  },
  position: {
    width: 'Обычный',
    vert: 'Снизу',
    horiz: 'Центр',
    offsetX: 0,
    offsetY: 16,
  },
  animation: {
    anim: 'slide',
    trigger: 'time',
    delay: 2,
    scrollPx: 300,
    backdrop: 'Выкл',
    speed: 0.3,
  },
}

/* ── Component ── */

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

  // Banner customization — lifted state from island panels
  const [customization, setCustomization] = useState<BannerCustomization>(DEFAULT_CUSTOMIZATION)

  // Resolve customization → BannerStyleProps
  const bannerProps: BannerStyleProps = useMemo(() => ({
    title: customization.text.title,
    description: customization.text.desc || `${companyName} использует файлы cookie для улучшения работы сайта и анализа трафика.`,
    acceptText: customization.text.accept,
    declineText: customization.text.decline,
    settingsText: 'Настроить',
    showDecline: true,
    showSettings: true,
    backgroundColor: resolveBgColor(customization.design.bgColor, customization.design.bgCustom),
    textColor: '#111111',
    buttonColor: resolveBtnColor(customization.design.btnColor, customization.design.btnCustom),
    borderRadius: customization.design.radius,
    shadow: SHADOW_MAP[customization.design.shadow],
  }), [customization.text, customization.design, companyName])

  // Position style
  const bannerContainerStyle = useMemo(
    () => computeBannerContainerStyle(customization.position),
    [customization.position],
  )

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

            {/* Cookie Banner Overlay — dynamic position from island panels */}
            <div style={bannerContainerStyle}>
              {customization.design.bannerStyle === 'glass'
                ? <GlassBanner {...bannerProps} />
                : <ClassicBanner {...bannerProps} />
              }
            </div>
          </div>
        </div>

        {/* Editing Island — outside Browser Frame so tooltips aren't clipped */}
        <LiquidGlassIsland
          containerRef={previewRef}
          customization={customization}
          onCustomizationChange={setCustomization}
        />
      </div>

      {/* Info */}
      <p className="text-center text-xs text-muted-foreground">
        Настройте баннер через панель инструментов слева
      </p>
    </div>
  )
}
