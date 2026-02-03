// Типы данных для Cookie Generator

export type BannerPosition = 'bottom' | 'top' | 'floating' | 'corner'

export type ColorScheme = 'light' | 'dark' | 'brand' | 'custom'

export interface CookieType {
  id: string
  name: string
  description: string
  required: boolean
  enabled: boolean
}

export interface CompanyInfo {
  name: string
  website: string
  email: string
  privacyPolicyUrl: string
}

export interface BannerSettings {
  position: BannerPosition
  colorScheme: ColorScheme
  customColors?: {
    background: string
    text: string
    buttonPrimary: string
    buttonSecondary: string
  }
  showDeclineButton: boolean
  showSettingsButton: boolean
  backdropBlur: boolean
  hideAfterDays: number
  animation: 'none' | 'slide' | 'fade'
}

export interface CookieConfig {
  company: CompanyInfo
  cookieTypes: CookieType[]
  banner: BannerSettings
  buttonText: {
    accept: string
    decline: string
    settings: string
    acceptAll: string
    saveSettings: string
  }
}

export const DEFAULT_COOKIE_TYPES: CookieType[] = [
  {
    id: 'necessary',
    name: 'Необходимые',
    description: 'Эти файлы cookie необходимы для работы сайта и не могут быть отключены.',
    required: true,
    enabled: true,
  },
  {
    id: 'analytics',
    name: 'Аналитические',
    description: 'Помогают нам понять, как посетители взаимодействуют с сайтом.',
    required: false,
    enabled: true,
  },
  {
    id: 'marketing',
    name: 'Маркетинговые',
    description: 'Используются для показа релевантной рекламы и отслеживания её эффективности.',
    required: false,
    enabled: false,
  },
  {
    id: 'functional',
    name: 'Функциональные',
    description: 'Позволяют запоминать ваши предпочтения и персонализировать сайт.',
    required: false,
    enabled: true,
  },
]

export const DEFAULT_CONFIG: CookieConfig = {
  company: {
    name: '',
    website: '',
    email: '',
    privacyPolicyUrl: '',
  },
  cookieTypes: DEFAULT_COOKIE_TYPES,
  banner: {
    position: 'bottom',
    colorScheme: 'light',
    showDeclineButton: true,
    showSettingsButton: true,
    backdropBlur: false,
    hideAfterDays: 365,
    animation: 'slide',
  },
  buttonText: {
    accept: 'Принять все',
    decline: 'Отклонить',
    settings: 'Настройки',
    acceptAll: 'Принять все',
    saveSettings: 'Сохранить настройки',
  },
}
