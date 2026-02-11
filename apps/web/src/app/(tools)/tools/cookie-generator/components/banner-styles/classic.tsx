'use client'

import type { BannerStyleProps } from './types'

/* ── Helpers ── */

/** Lighten/darken awareness: if bg is dark → light text, vice versa */
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

/** Create rgba from hex with alpha */
function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/* ── Shadow presets ── */
const SHADOW_MAP = {
  none: 'none',
  soft: '0 -1px 3px rgba(0,0,0,0.04), 0 -1px 2px rgba(0,0,0,0.02)',
  strong: '0 -4px 16px rgba(0,0,0,0.08), 0 -1px 3px rgba(0,0,0,0.04)',
} as const

/* ── Cookie Icon — warm, friendly, professional ── */
function CookieIcon({ accentColor }: { accentColor: string }) {
  const isAccentDark = isDark(accentColor)
  // Icon circle: if accent is dark, use it at low opacity. If light, use warm amber.
  const circleBg = isAccentDark
    ? hexToRgba(accentColor, 0.08)
    : hexToRgba('#D97706', 0.08)
  const iconColor = isAccentDark ? accentColor : '#B45309'

  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-xl"
      style={{ backgroundColor: circleBg }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cookie body — slightly irregular for warmth */}
        <path
          d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-.34-.018-.675-.052-1.005a3 3 0 0 1-2.948-2.948A10.014 10.014 0 0 0 12 2Z"
          fill={hexToRgba(iconColor, 0.12)}
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Chocolate chips */}
        <circle cx="8.5" cy="9.5" r="1.25" fill={iconColor} />
        <circle cx="14" cy="8" r="1" fill={iconColor} />
        <circle cx="10" cy="14.5" r="1" fill={iconColor} />
        <circle cx="15.5" cy="13.5" r="1.25" fill={iconColor} />
        {/* Crumble texture — tiny dots */}
        <circle cx="6.5" cy="13" r="0.5" fill={hexToRgba(iconColor, 0.4)} />
        <circle cx="12" cy="17" r="0.5" fill={hexToRgba(iconColor, 0.4)} />
        <circle cx="11" cy="6" r="0.5" fill={hexToRgba(iconColor, 0.3)} />
      </svg>
    </div>
  )
}

/* ── Classic Banner ── */
export function ClassicBanner({
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

  // Adaptive colors based on background
  const titleColor = bgDark ? '#F9FAFB' : textColor
  const descColor = bgDark
    ? 'rgba(249,250,251,0.6)'
    : hexToRgba(textColor, 0.5)
  const borderColor = bgDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const ghostColor = bgDark ? 'rgba(249,250,251,0.45)' : hexToRgba(textColor, 0.4)
  const ghostHoverColor = bgDark
    ? 'rgba(249,250,251,0.7)'
    : hexToRgba(textColor, 0.65)
  const outlinedBorder = bgDark
    ? 'rgba(255,255,255,0.12)'
    : hexToRgba(textColor, 0.12)
  const outlinedText = bgDark ? '#E5E7EB' : hexToRgba(textColor, 0.75)
  const outlinedHoverBg = bgDark
    ? 'rgba(255,255,255,0.06)'
    : hexToRgba(textColor, 0.03)

  // Button text: auto-contrast against button background
  const btnText = btnDark ? '#FFFFFF' : '#111111'

  const shadowValue = SHADOW_MAP[shadow]

  return (
    <div
      style={{
        backgroundColor: hexToRgba(
          backgroundColor,
          bgDark ? 0.95 : 0.97
        ),
        borderTop: `1px solid ${borderColor}`,
        boxShadow: shadowValue,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Inner container with max-width for very wide previews */}
      <div
        style={{ padding: '14px 24px' }}
        className="mx-auto flex items-center gap-4"
      >
        {/* Left: Icon + Text */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <CookieIcon accentColor={buttonColor} />

          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className="text-[13px] font-semibold leading-snug tracking-[-0.01em]"
              style={{ color: titleColor }}
            >
              {title}
            </p>
            <p
              className="mt-0.5 text-[11.5px] leading-relaxed"
              style={{ color: descColor }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Decline — ghost button, lowest visual weight */}
          {showDecline && (
            <button
              type="button"
              className="group relative px-3 py-[7px] text-[12px] font-medium transition-colors duration-200"
              style={{
                color: ghostColor,
                borderRadius: `${Math.min(borderRadius, 10)}px`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = ghostHoverColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = ghostColor
              }}
            >
              {declineText}
              {/* Subtle underline on hover */}
              <span
                className="absolute bottom-[6px] left-3 right-3 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                style={{ backgroundColor: ghostHoverColor }}
              />
            </button>
          )}

          {/* Settings — outlined, medium weight */}
          {showSettings && (
            <button
              type="button"
              className="px-3.5 py-[7px] text-[12px] font-medium transition-all duration-200"
              style={{
                color: outlinedText,
                border: `1px solid ${outlinedBorder}`,
                borderRadius: `${Math.min(borderRadius, 10)}px`,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = outlinedHoverBg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {settingsText}
            </button>
          )}

          {/* Accept — primary CTA, highest visual weight */}
          <button
            type="button"
            className="px-5 py-[7px] text-[12px] font-semibold transition-all duration-200"
            style={{
              backgroundColor: buttonColor,
              color: btnText,
              borderRadius: `${Math.min(borderRadius, 10)}px`,
              boxShadow: `0 1px 2px ${hexToRgba(buttonColor, 0.2)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', btnDark ? 0.06 : 0)}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-0.5px)'
              e.currentTarget.style.boxShadow = `0 2px 8px ${hexToRgba(buttonColor, 0.25)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', btnDark ? 0.08 : 0)}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 1px 2px ${hexToRgba(buttonColor, 0.2)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', btnDark ? 0.06 : 0)}`
            }}
          >
            {acceptText}
          </button>
        </div>
      </div>
    </div>
  )
}
