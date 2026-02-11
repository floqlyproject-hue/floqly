'use client'

import type { BannerStyleProps } from './types'

/* ── Helpers (shared logic with classic) ── */

function perceivedBrightness(hex: string): number {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000
}

function isDark(hex: string): boolean {
  return perceivedBrightness(hex) < 128
}

function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/* ── Shadow presets — softer for glass to keep airiness ── */
const SHADOW_MAP = {
  none: 'none',
  soft: '0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
  strong: '0 8px 32px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
} as const

/* ── Cookie Icon — frosted variant ── */
function CookieIcon({ color }: { color: string }) {
  return (
    <div
      className="flex size-7 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: hexToRgba(color, 0.1) }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-.34-.018-.675-.052-1.005a3 3 0 0 1-2.948-2.948A10.014 10.014 0 0 0 12 2Z"
          fill={hexToRgba(color, 0.08)}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="9.5" r="1.25" fill={color} />
        <circle cx="14" cy="8" r="1" fill={color} />
        <circle cx="10" cy="14.5" r="1" fill={color} />
        <circle cx="15.5" cy="13.5" r="1.25" fill={color} />
      </svg>
    </div>
  )
}

/* ── Glass Banner ── */
export function GlassBanner({
  title,
  description,
  acceptText,
  declineText,
  settingsText,
  showDecline,
  showSettings,
  backgroundColor,
  textColor,
  buttonColor,
  borderRadius,
  shadow,
}: BannerStyleProps) {
  const bgDark = isDark(backgroundColor)
  const btnDark = isDark(buttonColor)

  /* ── Adaptive palette ── */
  const titleColor = bgDark ? '#F9FAFB' : textColor
  const descColor = bgDark ? 'rgba(249,250,251,0.55)' : hexToRgba(textColor, 0.45)
  const iconColor = bgDark ? '#E5E7EB' : textColor

  /* Glass surface */
  const tintColor = bgDark
    ? hexToRgba(backgroundColor, 0.35)
    : hexToRgba(backgroundColor, 0.45)
  const borderColor = bgDark
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(255,255,255,0.55)'
  const innerBorderColor = bgDark
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.04)'

  /* Shine — inset highlight mimicking light refraction */
  const shineTop = bgDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(255,255,255,0.65)'
  const shineBottom = bgDark
    ? 'rgba(255,255,255,0.03)'
    : 'rgba(255,255,255,0.35)'

  /* Button colors */
  const btnText = btnDark ? '#FFFFFF' : '#111111'
  const btnBgAlpha = bgDark ? 0.85 : 0.9

  /* Ghost button (decline) */
  const ghostColor = bgDark ? 'rgba(249,250,251,0.4)' : hexToRgba(textColor, 0.35)
  const ghostHoverColor = bgDark ? 'rgba(249,250,251,0.7)' : hexToRgba(textColor, 0.6)

  /* Outlined button (settings) */
  const outlinedBorder = bgDark ? 'rgba(255,255,255,0.15)' : hexToRgba(textColor, 0.1)
  const outlinedText = bgDark ? 'rgba(249,250,251,0.7)' : hexToRgba(textColor, 0.6)
  const outlinedHoverBg = bgDark ? 'rgba(255,255,255,0.08)' : hexToRgba(textColor, 0.04)

  const shadowValue = SHADOW_MAP[shadow]
  const radius = `${borderRadius}px`

  return (
    <div
      className="relative overflow-hidden"
      style={{ borderRadius: radius }}
    >
      {/* Layer 1: Backdrop blur — the core glass effect */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          borderRadius: 'inherit',
        }}
      />

      {/* Layer 2: Tinted surface — picks up backgroundColor as a wash */}
      <div
        className="absolute inset-0"
        style={{
          background: tintColor,
          borderRadius: 'inherit',
        }}
      />

      {/* Layer 3: Shine — inset highlight for depth */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: 'inherit',
          boxShadow: `inset 1px 1px 0 0 ${shineTop}, inset -1px -1px 0 0 ${shineBottom}`,
        }}
      />

      {/* Layer 4: Outer border + shadow */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: 'inherit',
          border: `1px solid ${borderColor}`,
          boxShadow: shadowValue,
          pointerEvents: 'none',
        }}
      />

      {/* Layer 5: Inner subtle border for premium feel */}
      <div
        className="absolute inset-px"
        style={{
          borderRadius: `${Math.max(borderRadius - 1, 0)}px`,
          border: `1px solid ${innerBorderColor}`,
          pointerEvents: 'none',
        }}
      />

      {/* Content — above all glass layers */}
      <div
        className="relative z-10 mx-auto flex items-center gap-3"
        style={{ padding: '10px 16px' }}
      >
        {/* Left: Icon + Text */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <CookieIcon color={iconColor} />

          <div className="min-w-0 flex-1">
            <p
              className="text-[12px] font-semibold leading-tight tracking-[-0.01em]"
              style={{ color: titleColor }}
            >
              {title}
            </p>
            <p
              className="mt-px text-[10.5px] leading-snug"
              style={{ color: descColor }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Decline — ghost */}
          {showDecline && (
            <button
              type="button"
              className="group relative px-2.5 py-[5px] text-[11px] font-medium transition-colors duration-200"
              style={{
                color: ghostColor,
                borderRadius: `${Math.min(borderRadius, 10)}px`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = ghostHoverColor }}
              onMouseLeave={(e) => { e.currentTarget.style.color = ghostColor }}
            >
              {declineText}
              <span
                className="absolute bottom-[4px] left-2.5 right-2.5 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                style={{ backgroundColor: ghostHoverColor }}
              />
            </button>
          )}

          {/* Settings — outlined, glass-aware */}
          {showSettings && (
            <button
              type="button"
              className="px-3 py-[5px] text-[11px] font-medium transition-all duration-200"
              style={{
                color: outlinedText,
                border: `1px solid ${outlinedBorder}`,
                borderRadius: `${Math.min(borderRadius, 10)}px`,
                backgroundColor: 'transparent',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = outlinedHoverBg }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {settingsText}
            </button>
          )}

          {/* Accept — frosted primary CTA */}
          <button
            type="button"
            className="px-4 py-[5px] text-[11px] font-semibold transition-all duration-200"
            style={{
              backgroundColor: hexToRgba(buttonColor, btnBgAlpha),
              color: btnText,
              borderRadius: `${Math.min(borderRadius, 10)}px`,
              boxShadow: `0 1px 3px ${hexToRgba(buttonColor, 0.12)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', btnDark ? 0.1 : 0.2)}`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-0.5px)'
              e.currentTarget.style.boxShadow = `0 3px 8px ${hexToRgba(buttonColor, 0.18)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', btnDark ? 0.12 : 0.25)}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 1px 3px ${hexToRgba(buttonColor, 0.12)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', btnDark ? 0.1 : 0.2)}`
            }}
          >
            {acceptText}
          </button>
        </div>
      </div>
    </div>
  )
}
