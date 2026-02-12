'use client'

import { usePathname } from 'next/navigation'

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'Главная',
  '/dashboard/tools': 'Инструменты',
  '/dashboard/tools/cookie-generator': 'Плашка cookies',
  '/dashboard/tools/cookie-generator/edit': 'Редактирование',
  '/dashboard/tools/cookie-generator/edit/text': 'Текст',
  '/dashboard/tools/cookie-generator/edit/design': 'Дизайн',
  '/dashboard/widget': 'Умный виджет',
  '/dashboard/sites': 'Сайты',
  '/dashboard/sites/new': 'Новый сайт',
  '/dashboard/company-data': 'База знаний',
  '/dashboard/dialogs': 'Диалоги',
  '/dashboard/analytics': 'Аналитика',
  '/dashboard/integrations': 'Интеграции',
  '/dashboard/settings': 'Настройки',
  '/dashboard/subscription': 'Подписка',
}

export interface BreadcrumbItem {
  label: string
  href: string
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname()

  if (!pathname || pathname === '/dashboard') {
    return [{ label: 'Главная', href: '/dashboard' }]
  }

  // Build segments: /dashboard/tools/cookie-generator → ['/dashboard', '/dashboard/tools', '/dashboard/tools/cookie-generator']
  const parts = pathname.replace(/\/$/, '').split('/')
  const segments: string[] = []

  for (let i = 1; i <= parts.length - 1; i++) {
    segments.push(parts.slice(0, i + 1).join('/'))
  }

  // Filter to only known paths and build breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = []

  for (const segment of segments) {
    const label = BREADCRUMB_MAP[segment]
    if (label) {
      breadcrumbs.push({ label, href: segment })
    }
  }

  // Fallback: at least show "Главная"
  if (breadcrumbs.length === 0) {
    breadcrumbs.push({ label: 'Главная', href: '/dashboard' })
  }

  return breadcrumbs
}
