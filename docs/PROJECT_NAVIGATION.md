# Навигация по проекту Floqly

> Справочник путей и структуры. Правила → `DEVELOPMENT_RULES.md`, стили → `DESIGN_SYSTEM.md`

## Общая структура

```
floqly/
├── apps/
│   ├── web/                 # Next.js (лендинг + ЛК + инструменты)
│   ├── widget/              # Embed-скрипт виджета (Vite + Shadow DOM)
│   │   ├── simple/          # Simple Widget (FREE)
│   │   └── smart/           # Smart Widget (PAID)
│   └── admin/               # Админ-панель (заглушка)
├── packages/
│   ├── ui/                  # Shared UI (Button, Card, Modal, etc.)
│   ├── config/              # ESLint, TypeScript, Tailwind конфиги
│   ├── database/            # Supabase клиент, типы БД
│   └── analytics/           # Трекинг событий
├── docs/                    # Документация
└── design-references/       # Референсы дизайна
```

## apps/web — маршруты

### (marketing) — Публичные страницы
Путь: `apps/web/src/app/(marketing)/`

| Маршрут | Описание |
|---------|----------|
| `/` | Главная (лендинг) |
| `/widget-preview/` | Список дизайнов виджетов |
| `/widget-preview/design-XX/simple\|smart` | Sandbox дизайнов |

### (tools) — Бесплатные инструменты
Путь: `apps/web/src/app/(tools)/`

| Маршрут | Описание |
|---------|----------|
| `/tools/cookie-generator` | Cookie Generator (публичный) |

### (dashboard) — Личный кабинет
Путь: `apps/web/src/app/(dashboard)/`

| Маршрут | Описание |
|---------|----------|
| `/dashboard` | Главная ЛК |
| `/dashboard/company-data` | Данные компании |
| `/dashboard/sites` | Управление сайтами |
| `/dashboard/widget` | Настройка виджета |
| `/dashboard/dialogs` | История диалогов |
| `/dashboard/integrations` | Интеграции (CRM) |
| `/dashboard/tools` | Инструменты |
| `/dashboard/tools/cookie-generator/edit` | Cookie Generator (ЛК версия) |
| `/dashboard/settings` | Настройки аккаунта |
| `/dashboard/subscription` | Подписка |

### api/ — API Endpoints
Путь: `apps/web/src/app/api/`

| Endpoint | Описание |
|----------|----------|
| `GET /api/health` | Проверка здоровья |
| `GET/POST /api/widgets` | CRUD виджетов |
| `GET/PUT/DELETE /api/widgets/[id]` | Конкретный виджет |

### auth/ — Авторизация
Путь: `apps/web/src/app/auth/`
- OAuth callback, формы входа/регистрации
- Провайдеры: Yandex, VK, Google, Telegram

## Cookie Generator — детально

```
apps/web/src/app/(tools)/tools/cookie-generator/
├── page.tsx                    # Серверный компонент (обёртка)
├── cookie-generator-client.tsx # Главный клиентский компонент
├── types.ts                    # TypeScript типы
├── templates.ts                # Шаблоны текстов баннеров
├── document-generator.ts       # Генерация документа
└── components/
    ├── company-form.tsx         # Step 1: Данные компании
    ├── cookie-config-form.tsx   # Step 2: Настройка cookies
    ├── text-template-form.tsx   # Step 3: Текст документа
    ├── banner-settings-form.tsx # Step 4: Дизайн баннера
    ├── banner-preview.tsx       # Превью баннера
    ├── document-preview.tsx     # Step 5: Финальный документ
    ├── wizard-progress-card.tsx # Карточка прогресса (sidebar)
    ├── cookie-impact-card.tsx   # Влияние cookies (Step 2 sidebar)
    └── index.ts                 # Экспорты
```

Dashboard версия импортирует компоненты из (tools), не дублирует.

## Компоненты

| Путь | Назначение |
|------|-----------|
| `packages/ui/src/` | Shared UI — универсальные (Button, Card, Modal). Импорт: `@floqly/ui` |
| `apps/web/src/components/` | App-specific — header, footer, theme-toggle |
| `apps/web/src/components/ui/` | shadcn/ui компоненты. Импорт: `@/components/ui/` |

## Утилиты и хуки

| Файл | Назначение |
|------|-----------|
| `apps/web/src/lib/utils.ts` | `cn()` и утилиты |
| `apps/web/src/lib/hooks/use-site-screenshot.ts` | Скриншот сайта (Microlink API) |
| `apps/web/src/lib/hooks/use-theme.ts` | Управление темой |
| `apps/web/src/lib/supabase/client.ts` | Supabase для клиентских компонентов |
| `apps/web/src/lib/supabase/server.ts` | Supabase для серверных компонентов/API |

## packages/

| Пакет | Назначение | Импорт |
|-------|-----------|--------|
| `packages/ui` | Shared UI компоненты | `@floqly/ui` |
| `packages/database` | Supabase клиент, типы БД | `@floqly/database` |
| `packages/analytics` | Трекинг событий | `@floqly/analytics` |
| `packages/config` | ESLint, TS, Tailwind конфиги | `@floqly/config/*` |

## Ключевые файлы

| Файл | Описание |
|------|----------|
| `CLAUDE.md` | Инструкции проекта |
| `docs/PROGRESS.md` | История прогресса |
| `docs/DESIGN_SYSTEM.md` | Дизайн-система (Precision Minimalism) |
| `docs/DEVELOPMENT_RULES.md` | Правила и антипаттерны |
| `apps/web/src/app/globals.css` | Глобальные стили + Tailwind CSS v4 |
| `apps/web/next.config.ts` | Конфиг Next.js |
