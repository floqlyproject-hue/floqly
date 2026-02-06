# Floqly

## О проекте

Floqly — экосистема виджетов для сайтов с AI-чатом. PLG-модель: бесплатные инструменты (Cookie Generator, Simple Widget) привлекают трафик, конвертируем в платный Умный виджет.

**Владелец:** Никита
**AI-партнёр:** Илья (Python backend для AI)
**Домен:** floqly.ru | CDN: cdn.floqly.ru

---

## Технологический стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Анимации | Framer Motion, GSAP (WebGL/Three.js — позже) |
| Backend | Node.js (Express/Fastify) |
| Database | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Widget | Vanilla TS, Shadow DOM, Vite |
| Хостинг | Timeweb Cloud (Docker) |
| CI/CD | GitHub Actions |

---

## Структура проекта

```
floqly/
├── apps/
│   ├── web/           # Next.js (лендинг + ЛК + генераторы)
│   ├── widget/        # Embed-скрипт виджета
│   └── admin/         # Админ-панель (базовая)
├── packages/
│   ├── ui/            # Shared UI компоненты
│   ├── config/        # ESLint, TS, Tailwind configs
│   ├── database/      # Supabase клиент, типы
│   └── analytics/     # Трекинг событий
├── design-references/ # Референсы дизайна
└── docs/              # Документация
```

---

## Команды

```bash
pnpm dev          # Запуск dev-сервера
pnpm build        # Production билд
pnpm test         # Запуск тестов
pnpm lint         # Линтинг
pnpm widget:build # Билд виджета
pnpm db:migrate   # Миграции Supabase
```

---

## Важные правила разработки

### Общие
- Язык интерфейса: **только русский** (i18n не нужен)
- Темы: светлая + тёмная **с первого дня**
- Mobile: desktop-first, но адаптив обязателен
- Accessibility: базовый уровень (клавиатура, aria-labels)

### Виджет (apps/widget)
- **Bundle size:** < 50kb gzipped (но не обязательно, можно и больше по весу, главное чтобы не очень долго грузилось)
- **Изоляция:** Shadow DOM обязателен
- **Работа в iframe:** да (Tilda, Wix)
- Нейтральные имена (избежать AdBlock): `fl-helper.js`, не `ad-widget.js`
- Загрузка: `defer` или `async`

### Безопасность
- CORS только для разрешённых доменов
- JWT для API
- Rate limiting
- Не хранить sensitive data в localStorage

### Код
- TypeScript strict mode
- Prefer функциональные компоненты
- Tailwind для стилей (не CSS-in-JS)
- Тесты для критических путей (auth, API)

---

## Дизайн

### Инструментальные страницы и ЛК (ВСЁ кроме главной)
**Обязательно следовать:** [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- Стиль: precision minimalism (Linear, Vercel, Raycast)
- Три инструмента: тонкие бордеры, белые поверхности, типографская иерархия
- Никаких backdrop-blur, inner-градиентов, shadow на статике, rounded-2xl
- Кнопки CTA: `bg-foreground text-background`, не `bg-primary`
- Анимации: только micro-interactions (transition 150ms), без entry-анимаций
- Правая часть экрана свободна — зарезервирована под Умный Виджет

### Главная страница (landing)
Отдельный дизайн — допускаются GSAP, Framer Motion, scroll-triggered анимации, creative layouts.
- Вдохновение: Locomotive, Cuberto, Unseen Studio
- Цель: Site of the Day на Awwwards
- Референсы: `/design-references/`

---

## Интеграции

| Сервис | Тип | Статус |
|--------|-----|--------|
| Supabase | Auth, DB, Storage | Настроен |
| AI (Илья) | REST API | Уточнить детали |
| OAuth | Yandex, VK, Google, Telegram | MVP |
| Telegram Bot | Уведомления | MVP |
| CRM | Webhook API | MVP |
| Sentry | Error tracking | MVP |
| Yandex Метрика | Analytics | MVP |

---

## Контакты и ресурсы

- **Спецификация:** `docs/SPECIFICATION.md`
- **PRD:** `docs/prd.md`
- **Прогресс:** `docs/PROGRESS.md`
- **План виджета:** `docs/WIDGET-CONSTRUCTOR-PLAN.md`
- **GitHub:** (настроить)
- **Supabase:** (настроить)

---

## Текущий фокус

> Обновляется по ходу разработки

**Фаза:** Подготовка
- [ ] Настройка монорепозитория
- [ ] Настройка Supabase
- [ ] Настройка CI/CD
- [ ] Базовый UI-кит
