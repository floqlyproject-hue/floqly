/**
 * useSiteParser Hook
 *
 * Client-side хук для парсинга сайтов с debounce, кешированием и событиями.
 * Архитектура скопирована с useSiteScreenshot (проверенный паттерн).
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import type { ParserResult } from '@/lib/parser/types'

/** Debounce задержка (пользователь закончит ввод URL) */
const DEBOUNCE_MS = 800

/** Ключ для localStorage кеша */
const CACHE_KEY = 'floqly:parser-cache'

/** TTL кеша (24 часа) */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

/**
 * Интерфейс записи в кеше
 */
interface CacheEntry {
  data: ParserResult
  timestamp: number
}

/**
 * Опции хука
 */
interface UseParserOptions {
  /** Режим парсинга (что искать) */
  mode?: 'all' | 'widgets' | 'analytics' | 'messengers'
  /** Включён ли парсинг (для условного использования) */
  enabled?: boolean
}

/**
 * Получить весь кеш из localStorage
 */
function getCache(): Record<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * Получить закешированный результат для URL
 */
function getCached(url: string): ParserResult | null {
  const cache = getCache()
  const entry = cache[url]

  if (!entry) return null

  // Проверить TTL
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    // Удалить устаревшую запись
    delete cache[url]
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    } catch {
      // Игнорируем ошибки localStorage
    }
    return null
  }

  return entry.data
}

/**
 * Сохранить результат в кеш
 */
function setCache(url: string, data: ParserResult) {
  const cache = getCache()
  cache[url] = { data, timestamp: Date.now() }

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Игнорируем ошибки localStorage (quota exceeded и т.д.)
  }
}

/**
 * Нормализовать URL (добавить протокол, проверить валидность)
 */
function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed || !trimmed.includes('.')) return null

  let url = trimmed
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  try {
    new URL(url)
    return url
  } catch {
    return null
  }
}

/**
 * Хук для парсинга сайтов
 *
 * @param websiteInput - Введённый пользователем URL
 * @param options - Опции парсинга (mode, enabled)
 * @returns { parserData, isLoading }
 *
 * @example
 * const { parserData, isLoading } = useSiteParser(
 *   'https://example.ru',
 *   { mode: 'widgets' }
 * )
 *
 * if (parserData?.chatWidgets.length > 0) {
 *   console.log('Найдены виджеты:', parserData.chatWidgets)
 * }
 */
export function useSiteParser(websiteInput: string, options: UseParserOptions = {}) {
  const { mode = 'all', enabled = true } = options
  const [parserData, setParserData] = useState<ParserResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    // Если отключено — сбросить состояние
    if (!enabled) {
      setParserData(null)
      setIsLoading(false)
      return
    }

    // Нормализовать URL
    const url = normalizeUrl(websiteInput)
    if (!url) {
      setParserData(null)
      setIsLoading(false)
      return
    }

    // Проверить кеш
    const cached = getCached(url)
    if (cached) {
      setParserData(cached)
      setIsLoading(false)
      return
    }

    // Increment request ID для cancellation
    const currentId = ++requestIdRef.current
    setIsLoading(true)

    // Debounce запрос
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/parser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, mode }),
        })

        // Проверить что запрос не устарел
        if (currentId !== requestIdRef.current) return

        if (!response.ok) {
          // Graceful fallback — парсер не критичен
          setParserData(null)
          setIsLoading(false)
          return
        }

        const data: ParserResult = await response.json()

        // Кешировать только если есть результаты (не кешировать пустые ответы)
        if (data.detected.length > 0) {
          setCache(url, data)
        }

        setParserData(data)
        setIsLoading(false)

        // Эмитить событие для Smart Widget
        window.dispatchEvent(
          new CustomEvent('floqly:parser-complete', {
            detail: data,
          })
        )
      } catch {
        // Проверить что запрос не устарел
        if (currentId !== requestIdRef.current) return

        // Graceful fallback
        setParserData(null)
        setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    // Cleanup
    return () => clearTimeout(timer)
  }, [websiteInput, mode, enabled])

  return { parserData, isLoading }
}
