export type ToolStatus = 'active' | 'coming_soon' | 'premium' | 'beta'
export type ToolCategory = 'compliance' | 'engagement' | 'conversion' | 'analytics'

export interface Tool {
  id: string
  name: string
  description: string
  longDescription?: string
  status: ToolStatus
  category: ToolCategory
  icon: string
  href?: string
  isPremium?: boolean
  features?: string[]
}

export const TOOLS_REGISTRY: Tool[] = [
  // Compliance
  {
    id: 'cookie-generator',
    name: 'Плашка cookies',
    description: 'Уведомление о файлах cookie для вашего сайта',
    longDescription: 'Создайте красивую плашку согласия с cookies. Полностью соответствует 152-ФЗ.',
    status: 'active',
    category: 'compliance',
    icon: 'cookie',
    href: '/dashboard/tools/cookie-generator',
    features: ['Готовые тексты', 'Свой дизайн', 'Документ политики', 'Код для сайта'],
  },
  {
    id: 'privacy-policy',
    name: 'Политика конфиденциальности',
    description: 'Генератор политики конфиденциальности',
    status: 'coming_soon',
    category: 'compliance',
    icon: 'document',
    features: ['Шаблоны для разных бизнесов', 'Соответствие законам'],
  },
  {
    id: 'terms-generator',
    name: 'Пользовательское соглашение',
    description: 'Генератор условий использования сайта',
    status: 'coming_soon',
    category: 'compliance',
    icon: 'document-text',
  },

  // Engagement
  {
    id: 'simple-widget',
    name: 'Простой виджет',
    description: 'Кнопки для связи: WhatsApp, Telegram, телефон',
    longDescription: 'Добавьте на сайт удобные кнопки для быстрой связи с вами.',
    status: 'coming_soon',
    category: 'engagement',
    icon: 'chat',
    features: ['Кнопки мессенджеров', 'Настройка внешнего вида', 'Анимации'],
  },
  {
    id: 'feedback-widget',
    name: 'Сбор отзывов',
    description: 'Виджет для получения обратной связи',
    status: 'coming_soon',
    category: 'engagement',
    icon: 'star',
  },

  // Conversion
  {
    id: 'callback-widget',
    name: 'Обратный звонок',
    description: 'Форма заказа звонка от менеджера',
    longDescription: 'Клиент оставляет номер — вы перезваниваете. С уведомлениями в Telegram и CRM.',
    status: 'coming_soon',
    category: 'conversion',
    icon: 'phone',
    features: ['Форма заявки', 'Интеграция с CRM', 'Уведомления в Telegram'],
  },
  {
    id: 'popup-builder',
    name: 'Всплывающие окна',
    description: 'Конструктор попапов для акций и форм',
    status: 'coming_soon',
    category: 'conversion',
    icon: 'window',
    isPremium: true,
  },
  {
    id: 'exit-intent',
    name: 'Попап при уходе',
    description: 'Показываем предложение, когда посетитель уходит',
    status: 'coming_soon',
    category: 'conversion',
    icon: 'arrow-right',
    isPremium: true,
  },

  // Analytics
  {
    id: 'heatmap',
    name: 'Тепловая карта',
    description: 'Смотрите, куда кликают посетители',
    status: 'coming_soon',
    category: 'analytics',
    icon: 'fire',
    isPremium: true,
  },
  {
    id: 'session-recording',
    name: 'Запись сессий',
    description: 'Видео того, как пользователи ходят по сайту',
    status: 'coming_soon',
    category: 'analytics',
    icon: 'video',
    isPremium: true,
  },
]

export const TOOL_CATEGORIES: Record<ToolCategory, { name: string; description: string }> = {
  compliance: {
    name: 'Документы',
    description: 'Соответствие законодательству',
  },
  engagement: {
    name: 'Общение',
    description: 'Связь с посетителями',
  },
  conversion: {
    name: 'Конверсия',
    description: 'Сбор заявок и лидов',
  },
  analytics: {
    name: 'Аналитика',
    description: 'Отслеживание поведения',
  },
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS_REGISTRY.filter((tool) => tool.category === category)
}

export function getToolById(id: string): Tool | undefined {
  return TOOLS_REGISTRY.find((tool) => tool.id === id)
}

export function getActiveTools(): Tool[] {
  return TOOLS_REGISTRY.filter((tool) => tool.status === 'active')
}

export function getComingSoonTools(): Tool[] {
  return TOOLS_REGISTRY.filter((tool) => tool.status === 'coming_soon')
}
