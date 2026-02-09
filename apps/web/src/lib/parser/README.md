# Парсер сайтов для Floqly

Модульная система детекции виджетов, аналитики и мессенджеров на сайтах клиентов.

## Назначение

**PLG-стратегия:** Парсер — критический компонент для демонстрации силы Smart Widget через проактивное поведение.

**Сценарий использования:**
1. Пользователь вводит URL сайта в Cookie Generator
2. Парсер анализирует HTML и детектирует установленные сервисы
3. Smart Widget **проактивно вмешивается** с предложением автозаполнения
4. WOW-эффект → конверсия в платную подписку

## Архитектура

```
useSiteParser (hook) → /api/parser (route) → parseWebsite (core)
```

### Layer 1: Client Hook
**Файл:** `apps/web/src/lib/hooks/use-site-parser.ts`

```typescript
const { parserData, isLoading } = useSiteParser('https://example.ru', {
  mode: 'widgets' // 'all' | 'widgets' | 'analytics' | 'messengers'
})
```

**Функции:**
- Debounce 800ms (пользователь завершит ввод)
- localStorage кеш с TTL 24 часа
- Request cancellation (при быстром вводе)
- Событие `floqly:parser-complete` для Smart Widget

### Layer 2: API Route
**Файл:** `apps/web/src/app/api/parser/route.ts`

```bash
POST /api/parser
Content-Type: application/json

{
  "url": "https://example.ru",
  "mode": "all"  # optional: 'all' | 'widgets' | 'analytics' | 'messengers'
}
```

**Функции:**
- Zod валидация запроса
- Graceful fallback (всегда 200, даже при ошибках)
- Cache-Control headers (24 часа для успешных, 1 час для ошибок)

### Layer 3: Parser Core
**Файл:** `parser.ts`

```typescript
import { parseWebsite } from '@/lib/parser/parser'

const result = await parseWebsite('https://example.ru', {
  mode: 'widgets',
  timeout: 5000
})

if (result.success) {
  console.log(result.data.chatWidgets) // ['jivo', 'bitrix24']
}
```

**Функции:**
- Pure functions (НЕТ зависимостей от Next.js/React)
- Pattern matching по regex
- HTML parsing с ограничением 500KB
- AbortController для таймаута

## База сигнатур

**Файл:** `signatures.ts`

### Виджеты и чаты (7)
- JivoSite (`jivo`)
- Битрикс24 (`bitrix24`)
- Carrot Quest (`carrotquest`)
- Intercom (`intercom`)
- Drift (`drift`)
- Zendesk Chat (`zendesk`)
- Tawk.to (`tawk`)

### Аналитика (5)
- Яндекс.Метрика (`yandexMetrika`)
- Google Analytics (`googleAnalytics`)
- VK Pixel (`vkPixel`)
- Facebook Pixel (`facebookPixel`)
- Top@Mail.ru (`topMail`)

### Мессенджеры (4)
- WhatsApp (`whatsapp`)
- Telegram (`telegram`)
- Viber (`viber`)
- VK Мессенджер (`vk`)

### Добавить новый сервис

```typescript
// signatures.ts
export const PARSER_SIGNATURES = {
  myService: {
    pattern: /myservice\.com|cdn\.myservice\./i,
    category: 'chat' as const,
    name: 'My Service',
    jurisdiction: 'RU',
    requiresCrossBorder: false,
  },
  // ...
}
```

## TypeScript типы

**Файл:** `types.ts`

```typescript
interface ParserResult {
  url: string
  detected: DetectedService[]        // Все сервисы
  chatWidgets: DetectedService[]     // Только виджеты
  analytics: DetectedService[]       // Только аналитика
  messengers: DetectedService[]      // Только мессенджеры
  timestamp: number
  _error?: string                    // Опциональный код ошибки
}

interface DetectedService {
  id: ServiceId
  name: string
  category: 'chat' | 'analytics' | 'messenger'
  jurisdiction: 'RU' | 'US' | 'EU' | 'LU'
  requiresCrossBorder: boolean       // Для Cookie Generator
}
```

## Использование

### В React компонентах

```typescript
import { useSiteParser } from '@/lib/hooks/use-site-parser'

function MyComponent() {
  const [url, setUrl] = useState('https://example.ru')
  const { parserData, isLoading } = useSiteParser(url, { mode: 'widgets' })

  if (isLoading) return <Spinner />
  if (!parserData) return null

  return (
    <div>
      <p>Найдено виджетов: {parserData.chatWidgets.length}</p>
      <ul>
        {parserData.chatWidgets.map(widget => (
          <li key={widget.id}>{widget.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Подписка на события

```typescript
window.addEventListener('floqly:parser-complete', (e) => {
  const parserData = e.detail as ParserResult
  console.log('Parser found:', parserData.detected)

  // Триггер для Smart Widget
  if (parserData.chatWidgets.length > 0) {
    smartWidget.showProactiveMessage(
      `Нашёл на твоём сайте ${parserData.chatWidgets[0].name} — давай я дозаполню этот раздел?`
    )
  }
})
```

### Прямой вызов API

```bash
curl -X POST http://localhost:3000/api/parser \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.ru","mode":"all"}'
```

## Graceful Fallback

Парсер **никогда** не ломает UX:

```typescript
// Всегда возвращает 200, даже при ошибках
{
  "url": "https://blocked-site.ru/",
  "detected": [],
  "chatWidgets": [],
  "analytics": [],
  "messengers": [],
  "timestamp": 1770594610796,
  "_error": "FETCH_FAILED"  // Код ошибки для отладки
}
```

**Коды ошибок:**
- `TIMEOUT` — запрос превысил 5 секунд
- `INVALID_URL` — невалидный формат URL
- `FETCH_FAILED` — сайт недоступен (403, 401, CORS)
- `PARSE_ERROR` — неожиданная ошибка при парсинге

## Performance

- **Debounce:** 800ms (пользователь завершит ввод)
- **Timeout:** 5 секунд (AbortController)
- **Cache:** 24 часа (localStorage + HTTP cache)
- **HTML limit:** 500KB (защита от больших файлов)
- **Request cancellation:** Автоматически при новом вводе

## Миграция на микросервис

**Когда мигрировать:**
- Парсинг занимает > 20% CPU основного сервера
- > 100,000 парсов в месяц
- Нужны headless браузеры (Puppeteer)

**Как мигрировать:**

1. Создать микросервис `services/parser-service/`
2. Скопировать `parser.ts` (Layer 3) — код идентичен
3. Изменить 1 строку в API route:
```typescript
// БЫЛО:
const result = await parseWebsite(normalizedUrl, options)

// СТАЛО:
const PARSER_API_URL = process.env.PARSER_API_URL || 'http://parser:4000'
const response = await fetch(`${PARSER_API_URL}/parse`, {
  method: 'POST',
  body: JSON.stringify({ url: normalizedUrl, mode: options.mode })
})
```

**Время миграции:** 2-4 часа (не дней!)

## Тестирование

См. подробное руководство: `docs/drafts/parser-testing-guide.md`

**Быстрый тест:**
```bash
pnpm dev
# → http://localhost:3000/tools/cookie-generator
# Ввести URL: lamoda.ru, mvideo.ru, ozon.ru
# Проверить: индикатор парсинга + консоль браузера
```

## Roadmap

- [x] Базовая реализация (3-слойная архитектура)
- [x] База сигнатур (16 сервисов)
- [x] Интеграция в Cookie Generator (индикатор + badge)
- [ ] Auto-fill в Step 2 на основе `parserData`
- [ ] Smart Widget проактивные сценарии
- [ ] Расширение базы сигнатур (больше сервисов)
- [ ] Headless browser для обхода защит (Puppeteer, опционально)
- [ ] Миграция на микросервис (при масштабе)
