# Интеграции Floqly

> Текущие и планируемые интеграции проекта.

---

## Работает сейчас

### Инфраструктура

- **Supabase:** PostgreSQL, авторизация, хранилище файлов
  - Remote проект: `rhdvlmhcfdqbqjgmcgcc`
  - **TODO:** Сгенерировать реальные типы БД (сейчас placeholder!)
  - Инструкции: `packages/database/README.md`

- **TimeWeb App Platform:** Production хостинг (РФ, автодеплой из GitHub)
  - Dockerfile + Docker Compose
  - 1 CPU x 3.3 ГГц, 2 GB RAM, 30 GB NVMe
  - Сеть: 192.168.0.0/24
  - Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NODE_ENV, NEXT_PUBLIC_SITE_URL

- **GitHub Actions:** CI/CD

### Внешние API

- **Microlink API:** Скриншоты сайтов для превью в Cookie Generator

---

## В планах

### High Priority
- **OAuth провайдеры:** Yandex, VK, Google, Telegram
- **AI API (Илья):** Python backend для Smart Widget
  - REST API (предположительно)
  - Функции: проактивные сообщения, анализ поведения, контекстные ответы
  - Статус: спецификация в разработке

### Medium Priority
- **Telegram Bot:** Уведомления о новых лидах
- **CRM интеграции:** Webhook API (AmoCRM, Битрикс24)
- **Yandex Метрика:** Аналитика

### Low Priority
- **Sentry:** Error tracking
- **CDN (Timeweb):** cdn.floqly.ru

---

## MCP серверы (для Claude Code)

- **Playwright** — автоматизация браузера (тестирование, скриншоты UI, дебаг)
- **Figma** (TODO) — импорт дизайнов из Figma (для landing page)

## Skills (Claude Code)

- `frontend-design` — дизайн-паттерны
- `web-design-guidelines` — гайдлайны по веб-дизайну
- `tailwind-design-system` — дизайн-система на Tailwind
- `gsap` — GSAP техники
- `threejs-animation` — 3D анимации
- `typescript-advanced-types` — продвинутые типы TS
- `vercel-react-best-practices` — Next.js/React best practices
- `better-auth-best-practices` — аутентификация
- `supabase-postgres-best-practices` — Supabase/PostgreSQL
- `seo-audit` — SEO
- `nextjs` — Next.js 16
- `api`, `component`, `widget-check` — шаблоны
