/**
 * Parser Signatures Database
 *
 * База данных сигнатур для детекции виджетов, аналитики и мессенджеров на сайтах клиентов.
 * Используется парсером для автоматического заполнения форм и демонстрации Smart Widget.
 */

export const PARSER_SIGNATURES = {
  // ===== Виджеты и чаты =====
  jivo: {
    pattern: /code\.jivosite\.com|jivo-api\.com/i,
    category: 'chat' as const,
    name: 'JivoSite',
    jurisdiction: 'RU',
    requiresCrossBorder: false,
  },
  bitrix24: {
    pattern: /bitrix24\.ru|b24-|cdn\.bitrix24\./i,
    category: 'chat' as const,
    name: 'Битрикс24',
    jurisdiction: 'RU',
    requiresCrossBorder: false,
  },
  carrotquest: {
    pattern: /carrotquest\.io|cdn\.carrotquest\./i,
    category: 'chat' as const,
    name: 'Carrot Quest',
    jurisdiction: 'US',
    requiresCrossBorder: true,
  },
  intercom: {
    pattern: /widget\.intercom\.io|intercom\.com/i,
    category: 'chat' as const,
    name: 'Intercom',
    jurisdiction: 'US',
    requiresCrossBorder: true,
  },
  drift: {
    pattern: /js\.driftt\.com|drift\.com/i,
    category: 'chat' as const,
    name: 'Drift',
    jurisdiction: 'US',
    requiresCrossBorder: true,
  },
  zendesk: {
    pattern: /static\.zdassets\.com|zendesk\.com/i,
    category: 'chat' as const,
    name: 'Zendesk Chat',
    jurisdiction: 'US',
    requiresCrossBorder: true,
  },
  tawk: {
    pattern: /embed\.tawk\.to|tawk\.to/i,
    category: 'chat' as const,
    name: 'Tawk.to',
    jurisdiction: 'US',
    requiresCrossBorder: true,
  },

  // ===== Аналитика =====
  yandexMetrika: {
    pattern: /mc\.yandex\.ru\/metrika|metrika\.yandex\./i,
    category: 'analytics' as const,
    name: 'Яндекс.Метрика',
    jurisdiction: 'RU',
    requiresCrossBorder: false,
  },
  googleAnalytics: {
    pattern: /google-analytics\.com|googletagmanager\.com|ga\.js|gtag\.js/i,
    category: 'analytics' as const,
    name: 'Google Analytics',
    jurisdiction: 'US',
    requiresCrossBorder: true,
  },
  vkPixel: {
    pattern: /vk\.com\/js\/api\/openapi\.js|top-fwz1\.mail\.ru/i,
    category: 'analytics' as const,
    name: 'VK Pixel',
    jurisdiction: 'RU',
    requiresCrossBorder: false,
  },
  facebookPixel: {
    pattern: /connect\.facebook\.net|fbevents\.js/i,
    category: 'analytics' as const,
    name: 'Facebook Pixel',
    jurisdiction: 'US',
    requiresCrossBorder: true,
  },
  topMail: {
    pattern: /top-fwz1\.mail\.ru|top\.mail\.ru/i,
    category: 'analytics' as const,
    name: 'Top@Mail.ru',
    jurisdiction: 'RU',
    requiresCrossBorder: false,
  },

  // ===== Мессенджеры =====
  whatsapp: {
    pattern: /wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com/i,
    category: 'messenger' as const,
    name: 'WhatsApp',
    jurisdiction: 'US',
    requiresCrossBorder: true,
  },
  telegram: {
    pattern: /t\.me|telegram\.org|telegram\.me/i,
    category: 'messenger' as const,
    name: 'Telegram',
    jurisdiction: 'RU',
    requiresCrossBorder: false,
  },
  viber: {
    pattern: /viber\.com\/add|chats\.viber\.com/i,
    category: 'messenger' as const,
    name: 'Viber',
    jurisdiction: 'LU', // Luxembourg
    requiresCrossBorder: true,
  },
  vk: {
    pattern: /vk\.com\/widget|vk\.com\/js\/api/i,
    category: 'messenger' as const,
    name: 'VK Мессенджер',
    jurisdiction: 'RU',
    requiresCrossBorder: false,
  },
} as const

export type ServiceId = keyof typeof PARSER_SIGNATURES
export type ServiceCategory = 'chat' | 'analytics' | 'messenger'

/**
 * Helper: Получить сервис по ID
 */
export function getServiceById(id: ServiceId) {
  return PARSER_SIGNATURES[id]
}

/**
 * Helper: Получить все сервисы определённой категории
 */
export function getServicesByCategory(category: ServiceCategory) {
  return Object.entries(PARSER_SIGNATURES)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([id, service]) => service.category === category)
    .map(([id, service]) => ({ id: id as ServiceId, ...service }))
}
