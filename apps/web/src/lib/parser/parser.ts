/**
 * Parser Core Logic
 *
 * Основная логика парсера сайтов.
 * НЕТ зависимостей от Next.js/React — можно копировать 1:1 в микросервис.
 */

import { PARSER_SIGNATURES } from './signatures'
import type {
  ParserOptions,
  ParserResult,
  ParserError,
  DetectedService,
  ParserResponse,
} from './types'

/**
 * Парсит сайт и детектирует установленные виджеты, аналитику, мессенджеры
 *
 * @param url - URL сайта для парсинга
 * @param options - Опции парсинга (mode, timeout)
 * @returns Promise с результатом или ошибкой
 *
 * @example
 * const result = await parseWebsite('https://example.ru', { mode: 'widgets' })
 * if (result.success) {
 *   console.log(result.data.chatWidgets) // ['jivo', 'bitrix24']
 * }
 */
export async function parseWebsite(
  url: string,
  options: ParserOptions = {}
): Promise<ParserResponse> {
  const { mode = 'all', timeout = 5000 } = options

  try {
    // 1. Fetch HTML с таймаутом
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Floqly Parser/1.0 (+https://floqly.ru)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      }
    }

    // 2. Получить HTML (ограничить размер для безопасности)
    const html = await response.text()
    const htmlSample = html.slice(0, 500_000) // Первые 500KB

    // 3. Pattern matching по категориям
    const detected: DetectedService[] = []

    for (const [id, signature] of Object.entries(PARSER_SIGNATURES)) {
      // Пропускаем если mode не соответствует категории
      if (mode !== 'all') {
        if (mode === 'widgets' && signature.category !== 'chat') continue
        if (mode === 'analytics' && signature.category !== 'analytics') continue
        if (mode === 'messengers' && signature.category !== 'messenger') continue
      }

      // Проверяем pattern
      if (signature.pattern.test(htmlSample)) {
        detected.push({
          id: id as keyof typeof PARSER_SIGNATURES,
          name: signature.name,
          category: signature.category,
          jurisdiction: signature.jurisdiction,
          requiresCrossBorder: signature.requiresCrossBorder,
        })
      }
    }

    // 4. Группировка по категориям
    const result: ParserResult = {
      url,
      detected,
      chatWidgets: detected.filter((s) => s.category === 'chat'),
      analytics: detected.filter((s) => s.category === 'analytics'),
      messengers: detected.filter((s) => s.category === 'messenger'),
      timestamp: Date.now(),
    }

    return { success: true, data: result }
  } catch (error) {
    // Обработка ошибок
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: `Request timeout after ${timeout}ms`,
        },
      }
    }

    return {
      success: false,
      error: {
        code: 'PARSE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

/**
 * Нормализует URL (добавляет протокол, проверяет валидность)
 *
 * @param input - Введённый пользователем URL
 * @returns Нормализованный URL или null если невалиден
 *
 * @example
 * normalizeUrl('example.ru') // 'https://example.ru'
 * normalizeUrl('https://example.ru') // 'https://example.ru'
 * normalizeUrl('invalid') // null
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  let url = trimmed

  // Добавить протокол если отсутствует
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  // Проверить валидность URL
  try {
    const parsed = new URL(url)
    return parsed.href
  } catch {
    return null
  }
}
