// Шаблоны текстов для Cookie Generator

import type { CookieConfig, CookieType } from './types'

/**
 * Генерирует короткий текст для баннера
 */
export function generateBannerText(config: CookieConfig): string {
  const { company, cookieTypes } = config

  const enabledTypes = cookieTypes.filter(c => c.enabled && !c.required)
  const typesText = enabledTypes.length > 0
    ? ` (${enabledTypes.map(c => c.name.toLowerCase()).join(', ')})`
    : ''

  const companyName = company.name || 'Наш сайт'

  return `${companyName} использует файлы cookie для улучшения работы сайта${typesText}. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием.`
}

/**
 * Генерирует подробный текст для модального окна настроек
 */
export function generateDetailedText(config: CookieConfig): string {
  const { company, cookieTypes } = config
  const companyName = company.name || 'Наш сайт'
  const website = company.website || 'example.com'

  let text = `## Политика использования файлов cookie

${companyName} (${website}) использует файлы cookie и аналогичные технологии для обеспечения работы сайта, анализа трафика и персонализации контента.

### Что такое cookie?

Cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении веб-сайтов. Они помогают сайту запоминать информацию о вашем визите.

### Какие cookie мы используем?

`

  cookieTypes.forEach((cookieType) => {
    if (cookieType.enabled) {
      text += `**${cookieType.name}${cookieType.required ? ' (обязательные)' : ''}**
${cookieType.description}

`
    }
  })

  text += `### Управление cookie

Вы можете в любое время изменить свои предпочтения, нажав на кнопку «Настройки cookie» в нижней части страницы.`

  if (company.email) {
    text += `

### Контакты

По вопросам использования cookie вы можете связаться с нами: ${company.email}`
  }

  if (company.privacyPolicyUrl) {
    text += `

### Подробнее

Полную информацию вы можете найти в нашей [Политике конфиденциальности](${company.privacyPolicyUrl}).`
  }

  return text
}

/**
 * Шаблоны коротких текстов баннера
 */
export const BANNER_TEMPLATES = {
  minimal: {
    id: 'minimal',
    name: 'Минимальный',
    description: 'Краткое сообщение без деталей',
    generate: (config: CookieConfig) => {
      return 'Мы используем cookie для улучшения работы сайта.'
    },
  },
  standard: {
    id: 'standard',
    name: 'Стандартный',
    description: 'Упоминание компании и типов cookie',
    generate: generateBannerText,
  },
  detailed: {
    id: 'detailed',
    name: 'Подробный',
    description: 'Развёрнутое описание с перечислением целей',
    generate: (config: CookieConfig) => {
      const { company, cookieTypes } = config
      const companyName = company.name || 'Наш сайт'

      const purposes: string[] = []
      if (cookieTypes.find(c => c.id === 'necessary')?.enabled) {
        purposes.push('обеспечения работы сайта')
      }
      if (cookieTypes.find(c => c.id === 'analytics')?.enabled) {
        purposes.push('анализа посещаемости')
      }
      if (cookieTypes.find(c => c.id === 'marketing')?.enabled) {
        purposes.push('показа персонализированной рекламы')
      }
      if (cookieTypes.find(c => c.id === 'functional')?.enabled) {
        purposes.push('сохранения ваших предпочтений')
      }

      const purposesText = purposes.length > 1
        ? `${purposes.slice(0, -1).join(', ')} и ${purposes[purposes.length - 1]}`
        : purposes[0] || 'улучшения работы сайта'

      return `${companyName} использует файлы cookie для ${purposesText}. Нажимая «Принять все», вы соглашаетесь с использованием всех типов cookie. Вы можете изменить свои предпочтения в настройках.`
    },
  },
  legal: {
    id: 'legal',
    name: 'Юридический',
    description: 'С упоминанием 152-ФЗ',
    generate: (config: CookieConfig) => {
      const { company } = config
      const companyName = company.name || 'Мы'

      return `${companyName} обрабатываем файлы cookie в соответствии с Федеральным законом №152-ФЗ «О персональных данных». Продолжая использование сайта, вы даёте согласие на обработку cookie в соответствии с нашей Политикой конфиденциальности.`
    },
  },
} as const

export type BannerTemplateId = keyof typeof BANNER_TEMPLATES

/**
 * Генерирует текст на основе выбранного шаблона
 */
export function generateFromTemplate(
  templateId: BannerTemplateId,
  config: CookieConfig
): string {
  return BANNER_TEMPLATES[templateId].generate(config)
}
