/**
 * Shared interface for all cookie banner style components.
 * Each style (classic, glass, neo, minimal, gradient, outlined) implements this contract.
 */

export interface BannerStyleProps {
  /* ── Text content ── */
  title: string
  description: string
  acceptText: string
  declineText: string
  settingsText: string

  /* ── Visibility ── */
  showDecline: boolean
  showSettings: boolean

  /* ── Colors ── */
  backgroundColor: string // hex
  textColor: string // hex
  buttonColor: string // hex

  /* ── Shape & Shadow ── */
  borderRadius: number // 0–24 px
  shadow: 'none' | 'soft' | 'strong'
}

/** Default values — used when island panels haven't emitted changes yet */
export const BANNER_DEFAULTS: BannerStyleProps = {
  title: 'Мы используем cookie',
  description: 'Для удобства работы сайт использует cookie.',
  acceptText: 'Принять',
  declineText: 'Отклонить',
  settingsText: 'Настроить',
  showDecline: true,
  showSettings: true,
  backgroundColor: '#FFFFFF',
  textColor: '#111111',
  buttonColor: '#111111',
  borderRadius: 12,
  shadow: 'soft',
}
