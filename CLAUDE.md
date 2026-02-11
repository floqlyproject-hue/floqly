# Floqly

## Суть проекта

Floqly — экосистема виджетов для сайтов с AI-чатом. **Главный продукт — Умный виджет (Smart Widget)** — проактивный AI-агент, который сам инициирует диалог с посетителями сайта и закрывает сделки.

**Владелец:** Никита | **Партнёр:** Илья (Python AI backend) | **Домен:** floqly.ru

### Ключевые сущности

| Что | Суть | Статус |
|-----|------|--------|
| **Smart Widget** (PAID) | Проактивный AI-агент — сам заговаривает, знает контекст, закрывает сделки | Дизайн в процессе |
| **Simple Widget** (FREE) | Базовая кнопка-виджет — пользователь сам открывает, выбирает канал связи | Дизайн в процессе |
| **Cookie Generator** (FREE) | Генератор политики cookie — бесплатный инструмент, lead magnet | Работает |
| **Landing** | Красивая главная — презентация Smart Widget (цель: Awwwards) | Не начат |
| **Dashboard** | Личный кабинет — настройка виджетов, конструктор | Каркас готов |

### Воронка (PLG)
Бесплатные инструменты → на них демо Smart Widget → конверсия в PAID подписку.
Smart Widget встраивается на floqly.ru и демонстрирует свою силу прямо на страницах инструментов.

> Подробно: [`docs/BUSINESS_CONTEXT.md`](docs/BUSINESS_CONTEXT.md) | [`docs/PLG_STRATEGY.md`](docs/PLG_STRATEGY.md)

---

## Приоритеты разработки

**1. Дизайн виджетов** — ГЛАВНЫЙ приоритет. Сначала Simple Widget (дизайн), потом Smart Widget (дизайн + анимации + чат). Делаем в sandbox: `apps/web/src/app/(marketing)/widget-preview/design-XX/`

**2. Бесплатные инструменты** — Cookie Generator и будущие. Единый визуальный стиль (Precision Minimalism). На каждом инструменте потом будет демо Smart Widget.

**3. Landing** — красивая презентация Smart Widget. Framer Motion, GSAP, Three.js. По референсам.

---

## Технологический стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js 16.1.6 (App Router), React 19.2, TypeScript, Tailwind CSS v4 |
| UI библиотека | shadcn/ui (New York style) + Framer Motion (где обосновано) |
| Анимации | CSS transitions (базовые), Framer Motion (сложные UI-взаимодействия), GSAP/Three.js (landing) |
| Database | Supabase (PostgreSQL, Auth, Storage) |
| Widget | Vanilla TS, Shadow DOM, Vite |
| Хостинг | TimeWeb App Platform (Docker, автодеплой из GitHub) |

---

## Структура проекта

> Подробная навигация: [`docs/PROJECT_NAVIGATION.md`](docs/PROJECT_NAVIGATION.md)

```
floqly/
├── apps/
│   ├── web/                 # Next.js (лендинг + ЛК + инструменты)
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (marketing)/     # Публичные + widget-preview (sandbox дизайнов!)
│   │       │   ├── (tools)/         # Cookie Generator и др. инструменты
│   │       │   ├── (dashboard)/     # Личный кабинет
│   │       │   ├── api/             # API endpoints
│   │       │   └── globals.css      # Глобальные стили + Tailwind
│   │       ├── components/          # App-specific компоненты
│   │       └── lib/                 # Хуки, утилиты, Supabase
│   ├── widget/              # Embed-скрипты виджетов (Vite + Shadow DOM)
│   │   ├── simple/          # Simple Widget (FREE)
│   │   └── smart/           # Smart Widget (PAID)
│   └── admin/               # Админ-панель (заглушка)
├── packages/
│   ├── ui/                  # Shared UI (Button, Card, Modal)
│   ├── config/              # ESLint, TypeScript, Tailwind конфиги
│   ├── database/            # Supabase клиент, типы БД
│   └── analytics/           # Трекинг событий
├── docs/                    # Документация
└── design-references/       # Референсы дизайна
```

### Критические пути

**Дизайны виджетов (sandbox):**
- Sandbox: `apps/web/src/app/(marketing)/widget-preview/design-XX/simple|smart/`
- Инструкция: [`apps/web/src/app/(marketing)/widget-preview/README.md`](apps/web/src/app/(marketing)/widget-preview/README.md)
- Прогресс: [`docs/WIDGET_DESIGNS_PROGRESS.md`](docs/WIDGET_DESIGNS_PROGRESS.md)
- URL: `http://localhost:3000/widget-preview/design-01/simple`

**Cookie Generator:**
- Public: `apps/web/src/app/(tools)/tools/cookie-generator/`
- Dashboard: `apps/web/src/app/(dashboard)/dashboard/tools/cookie-generator/edit/`
- Компоненты: `.../(tools)/tools/cookie-generator/components/`

**UI:** `packages/ui/src/` (shared) | `apps/web/src/components/` (app-specific)
**Стили:** `apps/web/src/app/globals.css` | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)

---

## Команды

```bash
pnpm dev          # Dev-сервер → http://localhost:3000
pnpm build        # Production билд
pnpm lint         # Линтинг
pnpm widget:build # Билд виджета
```

---

## Правила (краткие запреты)

> Подробные объяснения + примеры: [`docs/DEVELOPMENT_RULES.md`](docs/DEVELOPMENT_RULES.md)

### Дизайн

| Правило | Где запрещено | Где можно |
|---------|--------------|-----------|
| backdrop-blur, inner-градиенты | Инструменты, ЛК | Landing, виджеты |
| Fixed/sticky элементы справа | Инструменты | Виджеты |
| Хардкод цветов (bg-blue-500) | Инструменты, ЛК | Виджеты |

**shadcn/ui** — основа UI-компонентов. Использовать везде (инструменты, ЛК, landing, виджеты).
**Framer Motion** — допустим в инструментах/ЛК **только для обоснованных случаев** (визуальные редакторы, drag&drop, сложные переходы). Для простых hover/fade — CSS transitions.
**Стиль инструментов/ЛК:** Precision Minimalism (Linear, Vercel, Raycast) → [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
**Стиль виджетов/landing:** Креатив без ограничений (GSAP, градиенты, blur — всё можно)

### Код

- **Язык общения:** Claude ВСЕГДА отвечает на русском, включая при использовании Skills
- **Язык UI:** только русский (без i18n)
- **Темы:** светлая + тёмная с первого дня
- **Семантические цвета:** `bg-background`, `text-foreground`, `bg-primary` (не bg-blue-500)
- **Не дублировать код:** Dashboard импортирует из (tools), не копирует
- **packages/ui** — только универсальные компоненты (не app-specific)
- **API endpoints** — всегда валидация через zod
- **shadcn/ui** — для UI-компонентов. `cn()` из `@/lib/utils`. Компоненты в `@/components/ui/`
- **Нет CSS-in-JS** — только Tailwind
- **Нет тяжёлых библиотек** без обсуждения (> 50kb → спросить)
- **Нет sensitive data в localStorage** — использовать httpOnly cookies / Supabase Auth

---

## Разработка виджетов

> Инструкция: [`apps/web/src/app/(marketing)/widget-preview/README.md`](apps/web/src/app/(marketing)/widget-preview/README.md)
> UX/UI гайд: [`docs/SMART_WIDGET_UX_GUIDE.md`](docs/SMART_WIDGET_UX_GUIDE.md)

### Workflow
1. **Simple Widget** → дизайн в `design-XX/simple/` → утвердить
2. **Smart Widget** → копировать Simple как базу в `design-XX/smart/` → добавить AI-чат, проактивные уведомления, typing indicator → утвердить

### Правила
- Утверждённый Simple Widget **не менять** (если нужна доработка → Smart Widget)
- Не трогать `_templates/` (шаблон для новых дизайнов)
- Структура: `design-XX/simple/` и `design-XX/smart/` (не менять)
- После утверждения → обновить `notes.md` + `docs/WIDGET_DESIGNS_PROGRESS.md`

---

## Правила для Claude Code

### В начале сессии:
1. Спроси что нужно сделать
2. Прочитай `docs/PROGRESS.md` (первые 60 строк — таблица статуса + последние сессии)
3. Проверь MCP Memory (Knowledge Graph) на актуальный контекст
4. Начинай работу

### Во время работы:
- После КАЖДОЙ задачи → обнови `docs/PROGRESS.md` → коммит
- **Обновляй прогресс часто** — не копить, фиксировать каждое значимое изменение
- Обновляй MCP Memory (Knowledge Graph) при значимых изменениях в проекте
- Спроси: "Продолжаем или на этом всё?"

### В конце сессии:
- Обнови PROGRESS.md, предложи план на следующую сессию, финальный коммит

### Файловая организация:
- Скриншоты → `.debug/screenshots/имя.png`
- Временные файлы → `docs/drafts/`
- Планы фич → `docs/plans/PLAN-feature-name.md`

### Автогигиена проекта (делать автоматически):
- **Новые build/temp файлы** → сразу добавлять в `.claudeignore`
- **Новые docs-файлы** → добавлять в `.claudeignore` (секция "читать только по запросу")
- **PROGRESS.md** → держать максимум 5 последних сессий в основной секции, старые → в `<details>`
- **MCP Memory** → обновлять при значимых изменениях (новые компоненты, решения, статус)
- **CLAUDE.md** → не превышать ~250 строк. Если растёт — выносить в docs/
- **Крупные файлы** → если компонент > 500 строк, предложить рефакторинг

---

## Ссылки на документацию

| Документ | Описание |
|----------|----------|
| [`docs/BUSINESS_CONTEXT.md`](docs/BUSINESS_CONTEXT.md) | Бизнес-модель, ICP, Smart Widget, PLG |
| [`docs/DEVELOPMENT_RULES.md`](docs/DEVELOPMENT_RULES.md) | Антипаттерны, правила, чек-листы |
| [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md) | Текущие и планируемые интеграции |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Precision Minimalism дизайн-система |
| [`docs/PLG_STRATEGY.md`](docs/PLG_STRATEGY.md) | PLG-стратегия (полная) |
| [`docs/SMART_WIDGET_UX_GUIDE.md`](docs/SMART_WIDGET_UX_GUIDE.md) | UX/UI гайд Smart Widget |
| [`docs/WIDGET_DESIGNS_PROGRESS.md`](docs/WIDGET_DESIGNS_PROGRESS.md) | Прогресс дизайнов виджетов |
| [`docs/PROJECT_NAVIGATION.md`](docs/PROJECT_NAVIGATION.md) | Карта проекта |
| [`docs/PROGRESS.md`](docs/PROGRESS.md) | Полная история прогресса |
| [`docs/SPECIFICATION.md`](docs/SPECIFICATION.md) | Техническая спецификация |
| [`docs/prd.md`](docs/prd.md) | Product Requirements Document |
