# План: Embed-система Floqly — от прототипа к рабочему продакшену

## Контекст

Embed-код (`<script src="https://cdn.floqly.ru/cookie.js" data-id="...">`) сейчас — заглушка. Ни скрипт, ни API, ни CDN не существуют. Нужно построить полную цепочку: **build → serve → config API → event tracking → dashboard stats** — чтобы клиент мог скопировать одну строку кода и виджет работал на его сайте.

### Ключевые требования пользователя:
- **Отдельный embed-код на каждый виджет** (рекомендуемый подход, см. обоснование ниже)
- **Множество виджетов одновременно**: cookie + simple/smart + будущие (обратный звонок и др.) — все работают параллельно, без конфликтов
- **Upgrade-path**: ТОЛЬКО Simple → Smart виджет (замена, один и тот же `data-widget-id`). Cookie, обратный звонок и другие инструменты — остаются независимо
- **Дизайн из ЛК** отражается на сайте клиента в реальном времени (после обновления страницы)
- **Статистика** (просмотры, взаимодействия) видна в дашборде
- **Илья** (партнёр) запускает AI backend на отдельном Python-сервисе — нужна точка интеграции

### Архитектурное решение: per-widget embed vs project-wide loader

**Выбран: per-widget embed** (каждый виджет — отдельный `<script data-widget-id="...">`)

| Критерий | Per-widget (✅ выбрано) | Project-wide loader |
|----------|------------------------|---------------------|
| Bundle size | Cookie ~5KB, Smart ~50-100KB — грузим только нужное | Один bundle со всем = тяжелее |
| Изоляция ошибок | Поломка Smart не ломает Cookie | Одна ошибка → всё падает |
| Скорость cookie | Мгновенная (маленький скрипт) | Ждёт загрузки общего bundle |
| Продажа по отдельности | Легко — каждый инструмент независим | Сложнее разделить |
| Simple → Smart | `data-widget-id` тот же, тип меняется на сервере | Так же |
| UX клиента | 2-3 script тега | 1 script тег |
| Переход к project-wide | Легко добавить loader позже | — |

**Embed-формат:**
```html
<!-- Cookie баннер -->
<script src="https://floqly.ru/embed/fl-helper.iife.js" data-widget-id="abc123"></script>

<!-- Виджет (simple → smart upgrade автоматически) -->
<script src="https://floqly.ru/embed/fl-helper.iife.js" data-widget-id="xyz789"></script>
```

**Один скрипт** (`fl-helper.iife.js`) для всех типов — но `data-widget-id` определяет конкретный виджет. Скрипт загружает конфиг одного виджета и создаёт только его.

**Если Илья скажет по-другому:** достаточно поменять `main.ts` (один файл) — вместо fetch одного виджета → fetch по project_id. Сервисный слой поддержит оба варианта. См. секцию "Обратимость решения" в конце.

### Что уже есть (можно переиспользовать):
- `apps/widget/` — Vite + TypeScript, Shadow DOM, IIFE build → `fl-helper.iife.js`
- `apps/widget/src/main.ts` — auto-init по `data-widget-id`, fetch конфига
- `apps/widget/src/core/widget.ts` — полный Widget class (mount/destroy/open/close/events)
- `apps/widget/src/core/types.ts` — WidgetConfig, WidgetType, WidgetState
- DB: `widgets` (с `embed_key`, `config` JSONB, `views_count`, `interactions_count`)
- DB: `analytics_events` (event_type, event_data, visitor_id, page_url...)
- DB: SQL функции `increment_widget_views()`, `increment_widget_interactions()`
- DB: RLS — public SELECT active widgets, public INSERT analytics_events
- `createAdminClient()` в `apps/web/src/lib/supabase/server.ts` — service role
- Middleware исключает `/api/widgets/public` из auth

---

## Фаза 1: Widget Build Pipeline + Static Serving (~8 файлов)

### 1.1 MODIFY: `apps/widget/vite.config.ts`
- Добавить `define: { 'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://floqly.ru') }`
- Убедиться, что env подставляется при build (не runtime)

### 1.2 MODIFY: `apps/widget/src/main.ts`
- Оставить `data-widget-id` (per-widget подход)
- Fetch: `${API_URL}/api/v1/embed/${widgetId}` → получает конфиг **одного** виджета
- По `type` из конфига → создать соответствующий виджет (cookie/simple/smart)
- `window.Floqly._instances = new Map<string, BaseWidget>()` — множество экземпляров (несколько script тегов на странице)
- Каждый `<script>` тег инициализирует свой виджет, не конфликтует с другими
- Добавить shared `reportEvent(widgetId, eventType, eventData)` → POST в API
- Добавить проверку домена: `window.location.hostname` vs `allowedDomains` из конфига

### 1.3 MODIFY: `apps/widget/src/core/widget.ts`
- Добавить метод `reportEvent(type, data)` — POST в `/api/v1/embed/events`
- При mount → автоматически `reportEvent('view', { page_url, referrer })`
- При interaction (клик по баннеру, accept/decline) → `reportEvent('interaction', { action })`
- Реализовать cookie-специфичную логику:
  - Показ баннера (из config.bannerCustomization)
  - Кнопки accept/decline
  - Запись согласия в localStorage + cookie

### 1.4 CREATE: `apps/widget/src/widgets/cookie-widget.ts`
- Специализированный виджет для cookie consent
- Рендерит баннер с кастомизацией из конфига (position, colors, text, backdrop)
- Логика: показать → accept/decline → сохранить → скрыть на N дней
- Использует styles из `config.bannerCustomization` (LiquidGlassIsland стили или кастомные)

### 1.5 MODIFY: `apps/widget/src/core/types.ts`
- Добавить `CookieWidgetConfig` — extends WidgetConfig с cookie-specific полями
- Добавить `EmbedResponse` — `{ projectId, widgets: WidgetConfig[] }`
- Добавить `EventPayload` — `{ widget_id, event_type, event_data, visitor_id, page_url, referrer }`

### 1.6 MODIFY: `Dockerfile`
- Добавить стадию build widget: `RUN pnpm --filter @floqly/widget build`
- Копировать `apps/widget/dist/` в `apps/web/public/embed/` перед Next.js build
- Добавить `ARG VITE_API_URL` для build-time

### 1.7 MODIFY: `package.json` (root)
- Добавить скрипт: `"widget:build": "pnpm --filter @floqly/widget build"`
- Обновить `"build"`: сначала widget build, потом web build

### 1.8 MODIFY: `apps/web/next.config.ts`
- Добавить CORS headers для `/embed/*` и `/api/v1/embed/*`:
```ts
headers: async () => [{
  source: '/embed/:path*',
  headers: [
    { key: 'Access-Control-Allow-Origin', value: '*' },
    { key: 'Cache-Control', value: 'public, max-age=3600' },
  ]
}, {
  source: '/api/v1/embed/:path*',
  headers: [
    { key: 'Access-Control-Allow-Origin', value: '*' },
    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
    { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
  ]
}]
```

---

## Фаза 2: Public API Endpoints + Service Layer (~7 файлов)

### 2.0 CREATE: `apps/web/src/lib/services/embed-service.ts` ⭐ DB Abstraction
**Сервисный слой** — изолирует Supabase от route handlers (подготовка к миграции БД):
- `getWidgetConfig(widgetId: string): Promise<EmbedWidgetConfig | null>` — select widget by embed_key where status=active
- `getWidgetsByProject(projectId: string): Promise<EmbedWidgetConfig[]>` — для будущего project-wide loader
- `getProjectDomains(projectId: string): Promise<string[]>` — select project domains for Origin check
- `recordAnalyticsEvent(event: AnalyticsEventInput): Promise<void>` — insert + increment counters
- Внутри: `createAdminClient()` из `apps/web/src/lib/supabase/server.ts`
- **При миграции с Supabase:** меняем только этот файл

### 2.1 CREATE: `apps/web/src/app/api/v1/embed/[widgetId]/route.ts`
**GET** `/api/v1/embed/{widgetId}` — **PUBLIC**, no auth
- Принимает `widgetId` — это `embed_key` из widgets table (8-byte hex)
- Вызывает `EmbedService.getWidgetConfig(widgetId)` ← **через сервисный слой**
- Опциональная проверка домена: `Origin` header vs project.domains
- Возвращает: `{ widget: { id, type, config } }` — один виджет
- Кеширование: `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- Zod-валидация widgetId format
- 404 если виджет не найден или status ≠ active

### 2.2 CREATE: `apps/web/src/app/api/v1/embed/events/route.ts`
**POST** `/api/v1/embed/events` — **PUBLIC**, no auth
- Принимает: `{ widget_id, event_type, event_data, visitor_id, session_id, page_url, referrer, user_agent }`
- Zod-валидация входящих данных (защита от спама: лимит размера event_data)
- Вызывает `EmbedService.recordAnalyticsEvent(...)` ← **через сервисный слой**
- IP-адрес из `request.headers.get('x-forwarded-for')`
- Ответ: `{ ok: true }` (минимальный, для скорости)
- Rate limiting: TODO — отметить для будущей реализации (Upstash Redis)

### 2.3 CREATE: `apps/web/src/app/api/v1/embed/events/route.ts` OPTIONS handler
- Возвращает CORS preflight ответ

### 2.4 MODIFY: `apps/web/src/middleware.ts`
- Добавить в matcher исключение: `api/v1/embed` — чтобы public endpoints не проходили через auth middleware
- Обновить regexp: `'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/health|api/widgets/public|api/v1/embed|embed).*)'`

### 2.5 MODIFY: `apps/web/src/lib/supabase/middleware.ts`
- НЕ нужно менять — middleware matcher уже исключит `/api/v1/embed`

---

## Фаза 3: Dashboard Integration — Stats & Embed Code (~4 файла)

### 3.1 MODIFY: `apps/web/src/components/dashboard/project-card.tsx`
- Заменить заглушку embed-кода:
  ```ts
  // Было:
  const code = `<script src="https://cdn.floqly.ru/cookie.js" data-id="${id}"></script>`
  // Стало (per-widget — используем embed_key виджета):
  const code = `<script src="https://floqly.ru/embed/fl-helper.iife.js" data-widget-id="${widget.embed_key}"></script>`
  ```
- Добавить отображение `views_count` / `interactions_count` из widget данных (уже есть в Widget type)

### 3.2 MODIFY: `apps/web/src/app/(tools)/tools/cookie-generator/components/result-step.tsx`
- Обновить preview embed-кода (строка ~189) на реальный формат
- Показывать `embed_key` или `project_id` как data-attribute

### 3.3 CREATE: `apps/web/src/lib/hooks/use-widget-stats.ts`
- Хук для получения статистики виджета из `analytics_events`
- Группировка по event_type, по дням (для графиков в будущем)
- `useQuery(['widget-stats', widgetId], ...)`

### 3.4 MODIFY: `apps/web/src/components/dashboard/project-card.tsx`
- Показывать реальные stats: просмотры, взаимодействия, конверсию (accepts/declines)
- Использовать `useWidgetStats()` или данные из `widget.views_count` / `widget.interactions_count`

---

## Фаза 4: Cookie Widget Implementation (~3 файла)

### 4.1 CREATE: `apps/widget/src/widgets/cookie-banner.ts`
- Рендер cookie баннера в Shadow DOM
- Парсит `bannerCustomization` из config: position, theme, colors, text, backdrop
- Кнопки: «Принять все» / «Отклонить» / «Настроить»
- При accept → `localStorage.setItem('floqly_cookie_consent', JSON.stringify({...}))`
- При accept → `document.cookie = 'floqly_consent=accepted; max-age=...; path=/; SameSite=Lax'`
- Проверяет при загрузке: если consent уже дан → не показывать баннер
- `reportEvent('cookie_accept')` / `reportEvent('cookie_decline')`

### 4.2 CREATE: `apps/widget/src/widgets/cookie-styles.ts`
- CSS-шаблон для cookie баннера
- Адаптация под LiquidGlassIsland стили из дашборда
- Responsive: mobile/desktop
- Dark/light theme support

### 4.3 MODIFY: `apps/widget/src/main.ts`
- Router: по `widget.type` создавать соответствующий виджет:
  - `'cookie'` → CookieBanner
  - `'simple'` → Widget (текущий класс) — будущее
  - `'ai_chat'` → SmartWidget — будущее (заглушка)

---

## Фаза 5: Publish Flow в Dashboard (~2 файла)

### 5.1 MODIFY: `apps/web/src/components/dashboard/project-card.tsx`
- Кнопка «Опубликовать» → меняет `widgets.status` на `'active'` + `published_at = now()`
- Кнопка «Приостановить» → `status = 'paused'`
- Embed-код доступен только когда `status = 'active'`

### 5.2 CREATE: `apps/web/src/app/(dashboard)/dashboard/tools/cookie-generator/publish/page.tsx` (OPTIONAL)
- Страница с инструкцией по установке
- Показывает embed-код с копированием
- Превью как будет выглядеть баннер
- Проверка статуса: «Виджет активен / не активен»

---

## Порядок реализации

**Этап A (MVP — делаем в первую очередь):**
1. Widget build pipeline (1.1, 1.6, 1.7) — чтобы `fl-helper.iife.js` попадал в `public/embed/`
2. CORS + Next.js config (1.8)
3. Middleware (2.4)
4. **Сервисный слой** (2.0) — `embed-service.ts` (абстракция от Supabase)
5. Public config API (2.1) — `/api/v1/embed/[widgetId]` → через сервис (per-widget)
6. Public events API (2.2) — `/api/v1/embed/events` → через сервис
7. Обновить main.ts (1.2) — `data-widget-id` + fetch config + multi-instance support
8. Обновить embed-код в UI (3.1, 3.2) — показывать `embed_key` виджета

**Этап B (Cookie Widget):**
8. Cookie banner widget (4.1, 4.2)
9. Router в main.ts (4.3)
10. Event tracking в widget (1.3)

**Этап C (Dashboard Stats):**
11. Publish flow (5.1)
12. Widget stats hook (3.3)
13. Stats display (3.4)

---

## Файлы, которые нужно изменить/создать (полный список)

| # | Действие | Файл | Фаза |
|---|----------|------|------|
| 1 | MODIFY | `apps/widget/vite.config.ts` | 1 |
| 2 | MODIFY | `apps/widget/src/main.ts` | 1, 4 |
| 3 | MODIFY | `apps/widget/src/core/widget.ts` | 1 |
| 4 | MODIFY | `apps/widget/src/core/types.ts` | 1 |
| 5 | CREATE | `apps/widget/src/widgets/cookie-banner.ts` | 4 |
| 6 | CREATE | `apps/widget/src/widgets/cookie-styles.ts` | 4 |
| 7 | MODIFY | `Dockerfile` | 1 |
| 8 | MODIFY | `package.json` (root) | 1 |
| 9 | MODIFY | `apps/web/next.config.ts` | 1 |
| 10 | CREATE | `apps/web/src/lib/services/embed-service.ts` ⭐ | 2 |
| 11 | CREATE | `apps/web/src/app/api/v1/embed/[widgetId]/route.ts` | 2 |
| 12 | CREATE | `apps/web/src/app/api/v1/embed/events/route.ts` | 2 |
| 13 | MODIFY | `apps/web/src/middleware.ts` | 2 |
| 14 | MODIFY | `apps/web/src/components/dashboard/project-card.tsx` | 3, 5 |
| 15 | MODIFY | `apps/web/src/app/(tools)/tools/cookie-generator/components/result-step.tsx` | 3 |
| 16 | CREATE | `apps/web/src/lib/hooks/use-widget-stats.ts` | 3 |
| 17 | CREATE | `apps/web/src/app/(dashboard)/dashboard/tools/cookie-generator/publish/page.tsx` | 5 (opt) |

⭐ = критически важный файл для будущей миграции с Supabase

---

## Существующие утилиты для переиспользования

| Что | Файл | Зачем |
|-----|------|-------|
| `createAdminClient()` | `apps/web/src/lib/supabase/server.ts` | Service role для public API (bypass RLS) |
| `createClient()` (server) | `apps/web/src/lib/supabase/server.ts` | Auth-protected API |
| `increment_widget_views()` | SQL function в Supabase | Инкремент просмотров |
| `increment_widget_interactions()` | SQL function в Supabase | Инкремент взаимодействий |
| `Widget` class | `apps/widget/src/core/widget.ts` | Базовый класс для всех виджетов |
| `useWidget()` | `apps/web/src/lib/hooks/use-widget.ts` | Загрузка виджета в дашборде |
| `useCurrentProject()` | `apps/web/src/lib/hooks/use-current-project.ts` | Текущий проект |
| `StoredWidgetConfig` | `apps/web/src/lib/hooks/use-widget.ts` | Типы конфига |
| `Project.domains[]` | `apps/web/src/lib/stores/project-store.ts` | Список доменов для проверки Origin |

---

## Архитектура (схема потока)

```
Клиентский сайт                          floqly.ru (Next.js)                    Supabase
─────────────────                         ──────────────────                     ─────────

<!-- Cookie баннер -->
<script src="floqly.ru/embed/fl-helper.iife.js" data-widget-id="a1b2c3"></script>
<!-- Виджет чата (simple → smart автоматически) -->
<script src="floqly.ru/embed/fl-helper.iife.js" data-widget-id="x7y8z9"></script>

  1. Каждый скрипт загружается (один и тот же static file из /public/embed/)
  2. Читает свой data-widget-id (embed_key)
  3. GET /api/v1/embed/{embed_key}  ──────►  EmbedService    ─────►  widgets table
                                              (service role)         (by embed_key, status=active)
  4. Получает конфиг виджета        ◄─────   JSON response   ◄────   config JSONB

  5. По type создаёт нужный виджет:
     type='cookie'  → CookieBanner (Shadow DOM баннер)
     type='simple'  → SimpleWidget (кнопка + каналы связи)
     type='ai_chat' → SmartWidget (AI чат, Илья backend)

  6. POST /api/v1/embed/events     ──────►  EmbedService    ─────►  analytics_events
     { widget_id, event_type,                                       + increment_widget_views()
       visitor_id, page_url }                                       + increment_widget_interactions()

  7. Dashboard видит stats          ◄─────  useWidget()     ◄────   views_count, interactions_count
```

---

## Верификация

### После Этапа A:
1. `pnpm widget:build` — файл `apps/widget/dist/fl-helper.iife.js` создаётся
2. `pnpm build` — Next.js build без ошибок, `fl-helper.iife.js` в `/public/embed/`
3. `curl http://localhost:3000/embed/fl-helper.iife.js` — 200, JS-содержимое
4. `curl http://localhost:3000/api/v1/embed/{embed_key}` — 200, JSON с конфигом виджета
5. `curl -X POST http://localhost:3000/api/v1/embed/events -d '...'` — 200
6. Middleware: protected routes всё ещё требуют auth, embed endpoints — нет

### После Этапа B:
7. Создать HTML-файл с embed-кодом, открыть в браузере → cookie баннер появляется
8. Нажать «Принять» → баннер скрывается, localStorage записан
9. Обновить страницу → баннер НЕ появляется (consent уже дан)
10. В Supabase analytics_events → записи view и cookie_accept

### После Этапа C:
11. В дашборде ProjectCard → реальные цифры views/interactions
12. «Опубликовать» → `status = 'active'`, embed работает
13. «Приостановить» → `status = 'paused'`, виджет не загружается на сайте

---

## Что делает пользователь вручную (отдельный документ)

Отдельный документ `docs/plans/PLAN-embed-system-setup.md` с шагами:
1. **TimeWeb**: добавить env переменные в Docker (VITE_API_URL)
2. **DNS**: (опционально) создать `cdn.floqly.ru` как CNAME на floqly.ru — для будущего CDN
3. **Supabase**: проверить RLS policies, убедиться что SQL functions существуют
4. **GitHub**: просто push в main — autodeploy сделает остальное
5. **Тестирование**: создать тестовый HTML, вставить embed-код, проверить

---

## 🔮 Архитектурные решения на будущее (НЕ реализуем сейчас, но учитываем в коде)

### A. Множество виджетов на одной странице — без конфликтов

**Принцип:** API возвращает **массив** всех активных виджетов проекта. Загрузчик создаёт **отдельный Shadow DOM контейнер** для каждого. Каждый виджет:
- Имеет свой уникальный `widget_id` и `type`
- Рендерится в изолированном Shadow DOM (CSS не конфликтует)
- Управляет своей позицией (position из config)
- Отправляет свои события отдельно

**Upgrade-path Simple → Smart:**
- Когда пользователь активирует Smart Widget, его `type` меняется на `ai_chat`
- Загрузчик видит `type: 'ai_chat'` вместо `type: 'simple'` → создаёт SmartWidget вместо SimpleWidget
- Cookie, обратный звонок, и другие инструменты — **продолжают работать** рядом, у них свои type и свои Shadow DOM

**В коде учитываем:**
- `main.ts`: цикл по `widgets[]`, не singleton
- `window.Floqly._instances: Map<string, BaseWidget>` вместо `_instance`
- Каждый виджет знает свой `position` → не перекрывают друг друга
- Деструктор чистит только свой контейнер

### B. Визуальный редактор позиционирования (💡 идея Никиты)

**Концепция:** Когда у клиента несколько наших виджетов (cookie + smart + обратный звонок), открывается визуальный редактор в ЛК:
- Превью страницы клиента (скриншот через `useSiteScreenshot`)
- На превью виджеты показаны как draggable элементы
- Клиент может перетащить cookie баннер влево, чтобы не мешал Smart Widget справа
- Позиции сохраняются в `config.position` каждого виджета

**В коде учитываем:**
- `WidgetConfig.position` уже есть (bottom-right/bottom-left/top-right/top-left)
- Добавить `position.offsetX`, `position.offsetY` для fine-tuning
- Каждый виджет уважает свою позицию из конфига — изменения в ЛК отражаются на сайте
- **НЕ реализуем** drag-and-drop редактор сейчас — только data model готовим

### C. Абстракция от Supabase — подготовка к миграции БД

**Контекст:** После MVP планируется переход с Supabase на другую БД. Чтобы не переписывать всё:

**В коде учитываем:**
- Все Supabase-запросы в API routes делаем через **сервисный слой** (не напрямую в route handler):
  ```
  apps/web/src/lib/services/widget-service.ts  — getActiveWidgets(projectId), recordEvent(...)
  apps/web/src/lib/services/analytics-service.ts — getStats(widgetId), recordEvent(...)
  ```
- Route handler вызывает `WidgetService.getActiveWidgets(projectId)` — не знает про Supabase
- Сервисный слой внутри использует Supabase client — но это единственное место, где меняем при миграции
- **Паттерн:** Repository pattern light — не over-engineer, но изолировать DB-слой
- Типы (`Widget`, `AnalyticsEvent`) — определяем отдельно от Supabase Database types
- RLS policies заменятся на application-level checks в сервисном слое при миграции

**При миграции нужно будет заменить:**
1. `lib/services/*.ts` — реализация запросов (SQL/ORM вместо Supabase client)
2. `lib/supabase/` → `lib/db/` — новый DB client
3. Auth — с Supabase Auth на альтернативу (NextAuth, custom JWT)
4. Realtime — если использовался Supabase Realtime

### D. Админ-панель Floqly — внутренняя аналитика (🔜 будущее)

**Контекст:** Нужно видеть всю статистику по всем клиентам — то же, что клиент видит в своём дашборде, но aggregated + per-client.

**В коде учитываем:**
- `analytics_events` таблица уже содержит `project_id` и `widget_id` — можно фильтровать по любому клиенту
- SQL functions `increment_widget_views/interactions` уже инкрементируют — данные накапливаются
- API endpoint для событий (`/api/v1/embed/events`) записывает **все** данные (visitor_id, page_url, referrer, user_agent, IP)
- Для админки понадобится:
  - Отдельный middleware для `/admin/*` с проверкой `role = 'admin'` в profiles
  - Или Supabase Dashboard напрямую — для MVP достаточно
  - Или `apps/admin/` (уже есть заглушка в monorepo) с full read access к analytics_events, widgets, projects
- **Сейчас:** данные уже записываются правильно. Админка — отдельная задача, не блокирует embed-систему
- **Совет:** на первое время можно смотреть данные через Supabase Table Editor (бесплатно, уже работает)

---

### E. Обратимость решения per-widget → project-wide (для обсуждения с Ильёй)

**Текущее решение:** каждый виджет — отдельный `<script data-widget-id="embed_key">`.

**Если Илья попросит объединить в один код:**
Нужно изменить **2 файла**:
1. `apps/widget/src/main.ts` — читать `data-project-id` вместо `data-widget-id`, fetch `/api/v1/embed/project/{projectId}` → получать массив виджетов, создавать все
2. `apps/web/src/app/api/v1/embed/project/[projectId]/route.ts` — новый endpoint (сервисный слой уже имеет `getWidgetsByProject()`)

Остальной код (сервисный слой, Shadow DOM, event tracking, dashboard) — **не меняется**.

**Гибридный вариант:** можно поддерживать оба подхода одновременно — `data-widget-id` для per-widget, `data-project-id` для project-wide. Скрипт проверяет какой атрибут есть.

---

## Документ для пользователя

При реализации создать `docs/plans/PLAN-embed-system-setup.md` со следующим содержанием:

### 1. TimeWeb — Переменные окружения
Добавить в настройках Docker-приложения на TimeWeb:
- `VITE_API_URL=https://floqly.ru` — URL для виджет-скрипта (указывает куда слать запросы)
- Остальные env (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) — уже должны быть настроены

### 2. DNS (опционально, для будущего CDN)
- Создать CNAME запись: `cdn.floqly.ru` → `floqly.ru`
- Сейчас скрипт отдаётся с `floqly.ru/embed/fl-helper.iife.js`
- Когда понадобится CDN (Cloudflare, BunnyCDN) — переключим `cdn.floqly.ru` на CDN

### 3. Supabase — Проверить
- SQL функции `increment_widget_views()` и `increment_widget_interactions()` должны существовать
- RLS policy "Anyone can view active widgets by embed_key" — должна быть включена
- RLS policy "Anyone can create analytics events" — должна быть включена
- Всё это уже в миграции `001_initial_schema.sql` — если Supabase настроен по ней, то ОК

### 4. GitHub → TimeWeb Autodeploy
- Push в `main` → TimeWeb автоматически собирает Docker image → деплоит
- **Ничего дополнительного делать не нужно**

### 5. Тестирование
- Создать файл `test.html` на любом сервере или локально
- Вставить embed-код: `<script src="https://floqly.ru/embed/fl-helper.iife.js" data-widget-id="EMBED_KEY"></script>`
- Открыть в браузере → должен появиться cookie баннер
- Нажать «Принять» → проверить в Supabase Table Editor что в `analytics_events` появилась запись
- В дашборде Floqly → ProjectCard → счётчик просмотров увеличился

### 6. Для Ильи — что нужно знать

**Архитектура embed-скрипта:**
- Каждый виджет имеет свой отдельный `<script data-widget-id="...">` на сайте клиента
- Cookie баннер — отдельный скрипт, Simple/Smart виджет — отдельный скрипт
- Физически это **один и тот же JS-файл** (`fl-helper.iife.js`), но `data-widget-id` определяет какой виджет загрузить
- Simple → Smart: тип виджета (`type`) меняется на сервере → скрипт загружает новый конфиг → рендерит SmartWidget вместо SimpleWidget. Клиент НЕ меняет код на своём сайте.

**API endpoints для Smart Widget (AI чат):**
- Конфиг: `GET /api/v1/embed/{embed_key}` → возвращает `{ type: 'ai_chat', config: {...} }`
- События: `POST /api/v1/embed/events` → записывает view/interaction
- **Чат с AI:** нужен отдельный endpoint `POST /api/v1/chat/message` — это точка подключения Python backend Ильи
  - Floqly Next.js выступает прокси: принимает от виджета → перенаправляет в Python сервис Ильи → возвращает ответ
  - Формат: `{ widget_id, conversation_id, message, visitor_id }` → Python AI → `{ response, metadata }`
  - WebSocket или SSE для streaming ответов (когда AI "печатает")

**Если Илья захочет один код для всего проекта:**
- Поменять 2 файла (main.ts + добавить endpoint) — остальное не затронуто
- Можно поддержать оба варианта: `data-widget-id` per-widget и `data-project-id` all-in-one

**При переходе с Supabase на другую БД:**
- Весь код работы с БД изолирован в `lib/services/embed-service.ts`
- При миграции меняем только этот файл + auth layer
- API endpoints и виджет-скрипт НЕ затрагиваются

### 7. Где хранится технический план

Технический план реализации (для Claude на следующей сессии) сохранён в:
**`C:\Users\User\.claude\plans\misty-sparking-gem.md`**

Это файл в системе Claude Code, он автоматически подхватывается при следующей сессии.
Дополнительно копия будет в проекте: `docs/plans/PLAN-embed-system.md`
