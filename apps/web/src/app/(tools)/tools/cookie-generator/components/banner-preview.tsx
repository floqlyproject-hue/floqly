'use client'

import { useMemo, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CookieConfig } from '../types'
import { LiquidGlassIsland, type BannerCustomization } from './liquid-glass-island'
import { BackgroundSwitcherIsland, type PreviewBackground } from './background-switcher-island'
import { ClassicBanner, GlassBanner } from './banner-styles'
import { BG_COLORS, BTN_COLORS, TONE_TEXTS, type ShadowLabel, type PositionState } from './island-panels'
import type { BannerStyleProps } from './banner-styles/types'
import type { AnimId, BackdropOption } from './island-panels'

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
    // Note: we use CSS 'scale' property (not transform) to shrink the preview
    // so it doesn't conflict with Framer Motion's transform-based animations
    scale: '0.75',
  }

  // We use CSS `translate` property (not `transform`) for centering,
  // so it doesn't conflict with Framer Motion's transform-based animations.
  let translateX = ''
  let translateY = ''

  // Vertical
  if (pos.vert === 'Сверху') {
    style.top = pos.offsetY
    style.bottom = 'auto'
    style.transformOrigin = 'top center'
  } else if (pos.vert === 'Центр') {
    style.top = '50%'
    style.bottom = 'auto'
    translateY = '-50%'
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
      style.left = '50%'
      style.right = 'auto'
      translateX = '-50%'
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
      style.left = '50%'
      style.right = 'auto'
      translateX = '-50%'
    }
  }

  // Apply CSS translate (separate from transform)
  if (translateX || translateY) {
    style.translate = `${translateX || '0'} ${translateY || '0'}`
  }

  return style
}

/* ── Default customization state ── */

export const DEFAULT_CUSTOMIZATION: BannerCustomization = {
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

/* ── Animation variants for cookie banner ── */

function getAnimationVariants(anim: AnimId, position: PositionState) {
  const isBottom = position.vert === 'Снизу'
  const isTop = position.vert === 'Сверху'

  switch (anim) {
    case 'slide': {
      const slideY = isTop ? -40 : isBottom ? 40 : 0
      return {
        initial: { opacity: 0, y: slideY },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: slideY },
      }
    }
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    case 'bounce': {
      const bounceY = isTop ? -50 : isBottom ? 50 : 0
      return {
        initial: { opacity: 0, y: bounceY, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: bounceY, scale: 0.9 },
      }
    }
    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.85 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.85 },
      }
    case 'none':
    default:
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
  }
}

function getBackdropOpacity(backdrop: BackdropOption): number {
  switch (backdrop) {
    case 'Лёгкое': return 0.2
    case 'Сильное': return 0.5
    case 'Выкл':
    default: return 0
  }
}

/* ── Component ── */

interface BannerPreviewProps {
  config: CookieConfig
  screenshotUrl: string | null
  isScreenshotLoading: boolean
  customization?: BannerCustomization
  onCustomizationChange?: (next: BannerCustomization) => void
}

export function BannerPreview({
  config,
  screenshotUrl,
  isScreenshotLoading,
  customization: controlledCustomization,
  onCustomizationChange,
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

  // Banner customization — supports controlled (from parent) and uncontrolled modes
  const [internalCustomization, setInternalCustomization] = useState<BannerCustomization>(DEFAULT_CUSTOMIZATION)
  const customization = controlledCustomization ?? internalCustomization
  const setCustomization = onCustomizationChange ?? setInternalCustomization

  // Animation state — key increments to replay animation
  const [animKey, setAnimKey] = useState(0)
  const [bannerVisible, setBannerVisible] = useState(true)

  // Replay animation: hide → wait frame → show with new key
  const handlePlayAnimation = useCallback(() => {
    setBannerVisible(false)
    // Small delay for exit animation, then re-enter
    setTimeout(() => {
      setAnimKey((k) => k + 1)
      setBannerVisible(true)
    }, 200)
  }, [])

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

            {/* Backdrop overlay — animated */}
            <AnimatePresence>
              {bannerVisible && getBackdropOpacity(customization.animation.backdrop) > 0 && (
                <motion.div
                  key={`backdrop-${animKey}`}
                  className="absolute inset-0 z-[1]"
                  style={{ backgroundColor: '#000' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: getBackdropOpacity(customization.animation.backdrop) }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: customization.animation.speed }}
                />
              )}
            </AnimatePresence>

            {/* Cookie Banner Overlay — animated with Framer Motion */}
            <AnimatePresence mode="wait">
              {bannerVisible && (
                <motion.div
                  key={`banner-${animKey}`}
                  style={{ ...bannerContainerStyle, zIndex: 2 }}
                  {...getAnimationVariants(customization.animation.anim, customization.position)}
                  transition={
                    customization.animation.anim === 'bounce'
                      ? { type: 'spring', stiffness: 400, damping: 15 }
                      : { duration: customization.animation.speed, ease: [0.4, 0, 0.2, 1] }
                  }
                >
                  {customization.design.bannerStyle === 'glass'
                    ? <GlassBanner {...bannerProps} />
                    : <ClassicBanner {...bannerProps} />
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Editing Island — outside Browser Frame so tooltips aren't clipped */}
        <LiquidGlassIsland
          containerRef={previewRef}
          customization={customization}
          onCustomizationChange={setCustomization}
          onPlayAnimation={handlePlayAnimation}
        />
      </div>

      {/* Info */}
      <p className="text-center text-xs text-muted-foreground">
        Настройте баннер через панель инструментов слева
      </p>
    </div>
  )
}
