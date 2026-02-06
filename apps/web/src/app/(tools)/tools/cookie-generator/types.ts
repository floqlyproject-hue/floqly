// Типы данных для Cookie Generator

export type BannerPosition = 'bottom' | 'top' | 'floating' | 'corner'

export type ColorScheme = 'light' | 'dark' | 'brand' | 'custom'

export type DocumentTone = 'legal' | 'friendly' | 'minimal'

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

export interface BusinessScenario {
  ecommerce: boolean
  authService: boolean
  paidContent: boolean
}

export interface AnalyticsTool {
  id: string
  name: string
  enabled: boolean
  isCrossBorder: boolean
  country?: string
}

export interface MarketingSettings {
  showAds: boolean
  retargeting: boolean
}

export interface DocumentSettings {
  tone: DocumentTone
  businessScenario: BusinessScenario
  analyticsTools: AnalyticsTool[]
  marketing: MarketingSettings
  customAnalytics: string
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
  documentSettings: DocumentSettings
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

export const DEFAULT_ANALYTICS_TOOLS: AnalyticsTool[] = [
  {
    id: 'yandex-metrika',
    name: 'Яндекс.Метрика',
    enabled: true,
    isCrossBorder: false,
    country: 'RU',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    enabled: false,
    isCrossBorder: true,
    country: 'US',
  },
  {
    id: 'vk-pixel',
    name: 'VK Пиксель / myTarget',
    enabled: false,
    isCrossBorder: false,
    country: 'RU',
  },
]

export const DEFAULT_DOCUMENT_SETTINGS: DocumentSettings = {
  tone: 'friendly',
  businessScenario: {
    ecommerce: false,
    authService: false,
    paidContent: false,
  },
  analyticsTools: DEFAULT_ANALYTICS_TOOLS,
  marketing: {
    showAds: false,
    retargeting: false,
  },
  customAnalytics: '',
}

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
  documentSettings: DEFAULT_DOCUMENT_SETTINGS,
}
