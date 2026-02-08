/**
 * Parser Types
 *
 * TypeScript типы для парсера сайтов.
 */

import type { ServiceId, ServiceCategory } from './signatures'

/**
 * Опции парсера
 */
export interface ParserOptions {
  /** Режим парсинга (что искать) */
  mode?: 'all' | 'widgets' | 'analytics' | 'messengers'
  /** Таймаут запроса в миллисекундах */
  timeout?: number
}

/**
 * Детектированный сервис
 */
export interface DetectedService {
  /** ID сервиса из базы сигнатур */
  id: ServiceId
  /** Название сервиса */
  name: string
  /** Категория сервиса */
  category: ServiceCategory
  /** Юрисдикция (откуда сервис) */
  jurisdiction: 'RU' | 'US' | 'EU' | 'LU'
  /** Требует ли трансграничную передачу данных */
  requiresCrossBorder: boolean
}

/**
 * Результат парсинга
 */
export interface ParserResult {
  /** URL который парсился */
  url: string
  /** Все детектированные сервисы */
  detected: DetectedService[]
  /** Только виджеты связи */
  chatWidgets: DetectedService[]
  /** Только аналитика */
  analytics: DetectedService[]
  /** Только мессенджеры */
  messengers: DetectedService[]
  /** Timestamp парсинга */
  timestamp: number
  /** Опциональный флаг ошибки (для graceful fallback) */
  _error?: string
}

/**
 * Коды ошибок парсера
 */
export type ParserErrorCode = 'TIMEOUT' | 'INVALID_URL' | 'FETCH_FAILED' | 'PARSE_ERROR'

/**
 * Ошибка парсера
 */
export interface ParserError {
  /** Код ошибки */
  code: ParserErrorCode
  /** Описание ошибки */
  message: string
}

/**
 * Результат выполнения парсера (success/error union type)
 */
export type ParserResponse =
  | { success: true; data: ParserResult }
  | { success: false; error: ParserError }
