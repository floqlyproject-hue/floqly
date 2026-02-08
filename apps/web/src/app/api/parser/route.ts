/**
 * Parser API Route
 *
 * POST /api/parser
 * Валидация запроса, вызов парсера, graceful fallback при ошибках.
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { parseWebsite, normalizeUrl } from '@/lib/parser/parser'
import type { ParserOptions } from '@/lib/parser/types'

/**
 * Zod схема для валидации запроса
 */
const requestSchema = z.object({
  url: z.string().min(1, 'URL is required'),
  mode: z.enum(['all', 'widgets', 'analytics', 'messengers']).optional(),
})

/**
 * POST /api/parser
 * Парсит сайт и возвращает детектированные сервисы
 *
 * @body { url: string, mode?: 'all' | 'widgets' | 'analytics' | 'messengers' }
 * @returns ParserResult (всегда 200, даже при ошибках — graceful fallback)
 */
export async function POST(request: Request) {
  try {
    // 1. Валидация запроса
    const body = await request.json()
    const validated = requestSchema.parse(body)

    // 2. Нормализация URL
    const normalizedUrl = normalizeUrl(validated.url)
    if (!normalizedUrl) {
      return NextResponse.json(
        {
          error: 'Invalid URL format',
          details: 'URL must be a valid domain (e.g., example.ru or https://example.ru)',
        },
        { status: 400 }
      )
    }

    // 3. Вызов парсера (Layer 3)
    const options: ParserOptions = {
      mode: validated.mode || 'all',
      timeout: 5000,
    }

    const result = await parseWebsite(normalizedUrl, options)

    // 4. Обработка результата
    if (!result.success) {
      // Graceful fallback — возвращаем 200 с пустыми данными
      // (парсер не критичен, не должен ломать UX)
      return NextResponse.json(
        {
          url: normalizedUrl,
          detected: [],
          chatWidgets: [],
          analytics: [],
          messengers: [],
          timestamp: Date.now(),
          _error: result.error.code, // Сохраняем код ошибки для отладки
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=3600', // 1 час (короткий кеш для повторных попыток)
          },
        }
      )
    }

    // 5. Успех
    return NextResponse.json(result.data, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // 24 часа
        'X-Parser-Version': '1.0',
      },
    })
  } catch (error) {
    // Ошибка валидации
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    // Неожиданная ошибка — graceful fallback
    console.error('Parser API unexpected error:', error)
    return NextResponse.json(
      {
        url: '',
        detected: [],
        chatWidgets: [],
        analytics: [],
        messengers: [],
        timestamp: Date.now(),
        _error: 'UNEXPECTED_ERROR',
      },
      { status: 200 }
    )
  }
}
