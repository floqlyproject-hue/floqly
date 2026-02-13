# Floqly — Прогресс разработки

> Последнее обновление: 2026-02-14
> Текущая фаза: **Embed System + Branding**
> Задачи: обсуждаются в сессии, история фиксируется ниже

---

## Текущий статус

| Компонент | Статус | Детали |
|-----------|--------|--------|
| Cookie Generator | 95% | Step 5 «Результат» готов. TODO: Step 4 auto-fill + Step 5 полировка |
| Парсер сайтов | MVP готов | 3-слойная архитектура, 16 сигнатур |
| Smart Widget UX Guide | Готов | `docs/SMART_WIDGET_UX_GUIDE.md` |
| Simple Widget дизайны | Design-01 ready | Sandbox: `widget-preview/design-XX/` |
| Smart Widget дизайны | Не начат | Ждёт утверждения Simple Widget |
| **Dashboard** | **Редизайн готов** | Sidebar + Header + Main + Cookie Gen tab + заглушки |
| **Embed-система** | **Спланировано** | План готов, реализация — следующая сессия |
| Supabase Auth | Настроен | Авторизация, автологин, баннер подтверждения email |
| Landing | Не начат | Ждёт дизайнов виджетов |

---

## TODO (отложенные доработки)

- **Cookie Generator Step 4:** auto-fill из парсера, финальная полировка UI
- **Cookie Generator Step 5:** финальная полировка (тексты, responsive, edge cases)
- **Логотип — альтернативный дизайн иконки:** попробовать вариант, где три точки скрыты в покое и появляются только при hover. Для этого внутренний элемент (speech bubble) сделать больше похожим на иконку диалога — вытянуть левый нижний угол вниз (как «хвостик» облачка), сохраняя уникальность. Саму иконку не менять — только border-radius нижнего левого угла

---

## Последние 5 сессий

### 2026-02-14 — Embed-система (план) + Логотип FloqlyLogo
- **Embed-система спланирована:** полный план из 5 фаз, 17 файлов, 3 этапа реализации
  - Per-widget embed: каждый виджет — отдельный `<script data-widget-id="...">`, один JS-файл для всех типов
  - Сервисный слой `embed-service.ts` для абстракции от Supabase (подготовка к миграции БД)
  - Shadow DOM изоляция, multi-widget без конфликтов
  - Документ для Никиты/Ильи: `docs/plans/PLAN-embed-system-setup.md`
  - Технический план: `docs/plans/PLAN-embed-system.md`
- **FloqlyLogo компонент:** анимированный логотип с двумя вариантами
  - `variant="line"` — линия + курсор, `variant="dots"` — прыгающие точки
  - Иконка (speech bubble) + шеврон (slide-in на hover) + "floqly" (JetBrains Mono)
  - Тёмная/светлая тема через CSS custom properties (#059669 / #34D399)
  - Pure CSS анимации, без Framer Motion
  - Заменён логотип во всех 4 лейаутах: sidebar, auth, marketing, tools

### 2026-02-13 — Полный редизайн дашборда + страница «Инструменты»
- **Sidebar полностью переписан:** Lucide icons, группы (Продукты/Данные), секции mt-auto (Settings/Subscription), Sheet mobile menu, убраны ВСЕ бейджи «Скоро»
- **Header переписан:** shadcn Breadcrumb (useBreadcrumbs хук), shadcn DropdownMenu (user menu с email из Supabase), компактный ThemeButton, MobileSidebar trigger
- **Главная страница:** DashboardGreeting (время суток + имя из Supabase), ProjectCard (cookie project с quick actions), DashboardStats (4 метрики), SmartWidgetUpsell (деликатный), ConnectMoreTools (тизеры)
- **Cookie Generator tab:** переписан — ProjectCard + DashboardStats, empty state, чистый layout
- **Заглушки:** Widget, Dialogs, Integrations, Analytics → InDevelopmentPage (без «Скоро» бейджей)
- **Новые компоненты (8):** in-development-page, dashboard-greeting, project-card, dashboard-stats, smart-widget-upsell, connect-more-tools, use-breadcrumbs hook
- **Новый роут:** /dashboard/analytics
- **Design system:** bg-foreground CTA, rounded-xl, text-[13px] typography, нейтральные active states
- **Удалены зависимости:** убраны экспорты BentoGrid, ActivityFeed, ComingSoonPage, ProjectSwitcher из index.ts
- **Страница «Инструменты» (tools/page.tsx):** полная переработка
  - Карточки компактные, 3 в ряд на десктопе, без цветных категорийных фонов
  - Lucide иконки (Shield, FileText, Sparkles и т.д.) вместо инлайн SVG
  - Убраны: PRO gradient badge, features pill badges, цветные status badges, footer с border-t
  - Фильтры: `bg-foreground text-background` для активного (как CTA), нейтральные неактивные
  - Hover: subtle `bg-muted/30` + "Открыть" с ArrowRight на карточках
- **Hydration fix:** `<li>` inside `<li>` в breadcrumbs → `React.Fragment` wrapping
- **Active status:** зелёная точка `bg-emerald-500` с `animate-ping` пульсацией для статуса «Активен»
- **dev.cmd:** скрипт для автоматического убийства порта 3000 + удаления lock файла перед запуском dev server
- **Tools registry:** Simple Widget → `coming_soon` (некликабельный), Smart Widget удалён из реестра (своя вкладка в сайдбаре)
- **Cleanup:** 4 скриншота из корня проекта перемещены в `.debug/screenshots/`
- **Тестовые данные:** проект `example-shop.ru` + cookie виджет вставлены в Supabase для `test@floqly.ru`
- **Редакторы текста и дизайна cookie (NEW):**
  - `use-widget.ts` — хук загрузки/сохранения виджета из Supabase (React Query + JSONB config)
  - `editor-header.tsx` — общий хедер с кнопками «Сбросить» и «Сохранить»
  - `/edit/text/page.tsx` — фокусированный редактор текста документа (DocumentPreview)
  - `/edit/design/page.tsx` — фокусированный редактор дизайна баннера (BannerPreview controlled mode)
  - `document-preview.tsx` — добавлен `onContentChange` callback (non-breaking)
  - `project-card.tsx` — ссылки обновлены: `edit/text`, `edit/design`
  - `use-breadcrumbs.ts` — добавлены роуты «Текст», «Дизайн»
- **TypeScript:** `tsc --noEmit` без ошибок
- **TODO (мелкие корректировки):** визуальная полировка редакторов текста/дизайна после тестирования
- **Embed-система — планирование (NEW):**
  - Полный технический план: `docs/plans/PLAN-embed-system.md` (17 файлов, 5 фаз, 3 этапа)
  - Руководство для пользователя: `docs/plans/PLAN-embed-system-setup.md` (TimeWeb, DNS, Supabase, для Ильи)
  - **Решение:** per-widget embed (каждый виджет — свой `<script data-widget-id>`), обратимо
  - **Архитектура:** сервисный слой `embed-service.ts` для абстракции от Supabase
  - **Учтено на будущее:** визуальный редактор позиционирования, админ-панель, миграция БД
  - **Реализация:** следующая сессия (этапы A → B → C)

### 2026-02-12 — Auth: автологин + email confirmation banner + premium redesign
- Премиальный редизайн формы авторизации (commit `3231d08`)
- Автологин после регистрации + баннер подтверждения email (commit `c01a86d`)

### 2026-02-12 — Step 5 «Результат» + интерактивный мокап дашборда
- **Step 5 создан с нуля:** embed code генератор + dashboard upsell карточка + инструкции по установке
  - `generate-embed-code.ts` — self-contained vanilla JS код (~120 строк) из всех настроек пользователя
  - `result-step.tsx` — двухколоночный layout (ЛК-карточка слева, код+инструкции справа)
  - State lifting: BannerCustomization поднят из banner-preview → cookie-generator-client (controlled/uncontrolled pattern)
  - Accordion с инструкциями для 5 платформ (HTML, WordPress, Tilda, Bitrix, другие CMS)
- **Мокап дашборда** стилизован как «окно ЛК» (три точки + заголовок + pointer-events контроль)
- **Тултипы по hover:** shadcn/ui Tooltip на CDN-коде и каждой метрике с информативными подсказками
- **Анимация чисел:** useCountUp хук (requestAnimationFrame + easeOutExpo) + useInView (IntersectionObserver) — числа набегают при попадании во viewport
- **Персонализация:** заголовок окна «Личный кабинет {company.name}» из шага 1
- **Метрики:** Показы / Приняли / Ср. время (вместо скучной «конверсии»)

### 2026-02-12 — Анимации cookie popup + фиксы UI + настройки Claude Code
- **Анимации баннера реализованы:** 5 типов (slide, fade, bounce, scale, none) через Framer Motion AnimatePresence
  - Направление slide/bounce автоматически зависит от позиции баннера (Сверху → сверху, Снизу → снизу)
  - Bounce использует spring transition (stiffness: 400, damping: 15)
  - Скорость управляется слайдером из панели Анимация
- **Backdrop overlay:** Выкл / Лёгкое (20%) / Сильное (50%) с плавным появлением
- **Кнопка «Воспроизвести»:** replay через AnimatePresence key increment + setBannerVisible toggle
- **Конфликт CSS transform и Framer Motion:** позиционирование баннера переведено на CSS `translate` и `scale` properties (не `transform`), чтобы Framer Motion мог свободно анимировать transform
- **Фикс видимости слайдеров:** `text-muted-foreground` → `text-foreground/60` во всех 3 панелях — теперь секунды/пиксели видны при тёмном фоне
- **Фикс ClassicBanner borderRadius:** добавлен `borderRadius` к внешнему контейнеру + `borderTop` → `border`
- **Настройки Claude Code:** `bypassPermissions: true` в `.claude/settings.local.json` — убраны все запросы подтверждений

### 2026-02-12 — Dynamic Island: CSS morph animation (Apple Dynamic Island style)
- **Полный рерайт анимации morphing:** убран Framer Motion `layout="size"` + `LayoutGroup` + spring physics
  - Причина: spring-based size interpolation вызывал overshoot (остров увеличивался и уменьшался дёргано)
  - Решение: чистые CSS transitions на `width`, `height`, `border-radius` с Apple easing `cubic-bezier(0.32, 0.72, 0, 1)`
  - Длительность: 380ms — баланс между плавностью и отзывчивостью
- **Два слоя контента (collapsed + expanded):** рендерятся одновременно, переключаются через `opacity` + `data-hidden` attr
  - Collapsed fade-out: 80ms, expanded fade-in: 200ms с задержкой 140ms (контент появляется после начала расширения)
  - При закрытии: expanded fade-out 100ms instant, collapsed fade-in 120ms
- **Динамическое измерение высоты:** `useLayoutEffect` + `ResizeObserver` на expanded ref
  - Корректная работа при переключении панелей (text/design/position/animation имеют разную высоту)
  - `lastPanel` state сохраняет контент для pre-measuring даже когда панель закрыта
- **Убрано:** `layout="size"`, `LayoutGroup`, `SMOOTH_SPRING`, `whileDrag={{ scale: 1.04 }}`
- **Сохранено:** `useDragControls` (drag по-прежнему работает через handle), `AnimatePresence mode="wait"` (crossfade между панелями)
- **Вдохновение:** Apple Dynamic Island, Material Design 3 Container Transform

### 2026-02-12 — Dynamic Island: drag fix, content clipping fix, design polish
- **Критический баг исправлен:** слайдеры (Скругление, Отступ X/Y и др.) двигали весь остров при перемещении
  - Причина: Framer Motion `drag` на motion.div ловил pointer events от shadcn Slider
  - Решение: `dragListener={false}` + `useDragControls` — drag только через header/handle
  - В collapsed state — кнопки stopPropagation, между ними — drag
  - В expanded state — GripVertical handle в заголовке, панель контента свободна
- **Обрезка контента исправлена:** `overflow-hidden` → `overflow-x-clip` — горизонтальная анимация скрыта, вертикальное содержимое не обрезается
- **Background Switcher Island:** тот же fix с dragControls
- **Дизайн-улучшения (по web-design-guidelines + Material Design 3 + frontend-design):**
  - `focus-visible:ring-1` на всех интерактивных элементах (кнопки, dots, close)
  - Ширина панели 240px → 260px для лучшего дыхания контента
  - Separator между header и контентом, spacing space-y-3.5 → space-y-4
  - `fontVariantNumeric: tabular-nums` на всех числовых значениях (по Vercel guidelines)
  - `select-none` на заголовке (drag handle)
  - GripVertical иконка — визуальная affordance для drag
- **CSS cleanup:** удалены 7 устаревших классов (island-segmented, island-segment, island-slider, tooltip-content-right/bottom/bottom-end)
- **Применённые гайдлайны:** Vercel Web Interface Guidelines, Material Design 3, frontend-design skill

### 2026-02-12 — Step 4 «Содержание»: полный редизайн для консистентности со Steps 1-3
- **Tailwind v4 баг:** `md:grid-cols-[260px,1fr]` не генерировал CSS — запятая → подчёркивание `_`
- **Полный рерайт step4-content-tab.tsx:** убраны Switch/Input/Label из shadcn, SLabel, bg-подложки
- **Паттерны из Step 2:** `.cb` чекбоксы, `expand-enter` + `border-l-2` для раскрытия, `group` hover
- **Паттерны из Step 1:** bottom-border инпуты (`border-b border-border bg-transparent`)
- **Секционные лейблы:** `text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground/50`
- **Превью баннера:** компактный с `scale(0.85)`, хедер с border-b разделителем, без градиентного фона
- **Layout:** `grid-cols-[280px_1fr]` с gap-8, настройки слева, sticky превью справа
- **Урок:** Tailwind CSS v4 arbitrary values: `_` вместо `,`

### 2026-02-12 — Step 4 редизайн: суб-табы + GlassBanner + ссылки
- **Step 4 разбит на два суб-таба:** «Содержание» (текст, кнопки, ссылки) и «Оформление» (визуальный редактор)
- **GlassBanner** — 5-слойный glass-эффект (backdrop blur, tint, shine, borders), адаптивные цвета
- **Суб-таб «Содержание»:** тон сообщения (5 шаблонов), toggle кнопок, ссылка-слово в тексте, отдельная строка-ссылка, popup/page target
- **Ссылки в баннере:** поддержка linkWordEnabled/linkLineEnabled в ClassicBanner и GlassBanner
- **Island обновлён:** hideTextPanel режим (3 панели вместо 4 на суб-табе Оформление)
- **banner-preview.tsx:** поддержка controlled state (внешний customization/onChange)
- TextState расширен: settings, showDecline, showSettings, link-поля
- Подсказка с прогрессивным раскрытием для пользователя
- План: `docs/plans/PLAN-step4-redesign.md`

### 2026-02-11 — ClassicBanner + ESLint fixes + liquid-glass restore
- **ClassicBanner** — премиальный стиль cookie-баннера для Step 4 preview
  - Extensible `BannerStyleProps` интерфейс для будущих стилей (glass, neo, minimal и др.)
  - Adaptive color system: `perceivedBrightness()` → авто light/dark адаптация
  - 3-tier button hierarchy: ghost (Отклонить) → outlined (Настроить) → solid (Принять все)
  - Custom cookie SVG icon с адаптивным акцентным цветом
  - Hover micro-interactions: underline animation, translateY lift + shadow
- **30 ESLint errors fixed** — разблокировали CI/CD (20 × unescaped entities, 2 × refs, 1 × setState-in-effect)
- **74 ESLint warnings fixed** — чистый lint output (0 errors, 0 warnings)
- **Liquid-glass restored** на background switcher island (без SVG feTurbulence filter)
- **Tooltip CSS fix** — Tailwind v4 name collision: `tooltip-content-bottom-end` → `tooltip-bottom-end`
- Commits: `0a85f20`, `393b0fa`, `a4ab814`, `6886fae`, `7542329`

### 2026-02-10 — Откат Step 4: 3 неудачные итерации → возврат к 5e3b32a
- **Итерация 1:** Премиальный конструктор (15 компонентов, 10 пресетов, SVG-позиции) — перегруз
- **Итерация 2:** UX-редизайн (3 Tabs, 5 пресетов, sticky preview) — preview слишком мал
- **Итерация 3:** Side-Editor-Pattern (Canva-стиль, 300px controls, breakout max-w-7xl) — всё ещё не устроило
- **Причина:** задачи ставились слишком обобщённо, без референсов и поэлементного утверждения
- **Решение:** полный откат к `5e3b32a`, чистый лист для правильного подхода
- **Урок:** дизайн-задачи → референсы → wireframe → утверждение каждого элемента → код

### 2026-02-10 — Cookie Generator Step 3 редизайн + WYSIWYG + unified headers
- Unified headers (text-[22px]) across all 5 steps
- Updated DESIGN_SYSTEM.md with concrete patterns from Steps 1-2
- Step 3 полный редизайн: WYSIWYG (contentEditable вместо Markdown textarea)
- Segmented control с Material Design sliding indicator animation
- Icon-only action buttons (32x32) с CSS tooltips
- Download dropdown (.md/.html) с dropdown-enter animation, Escape key
- Inline reset confirmation с expand-enter + 5s auto-dismiss
- Edit mode: border accent + ring + подсказка "Кликните на текст..."
- Удалён TurndownService dependency (~8kb saved)
- 2 новые CSS-анимации: .dropdown-enter, .mode-crossfade-enter
- Sidebar tips обновлены (4 контекстных подсказки)
- Light + dark themes verified, build passes clean

### 2026-02-09 — Реструктуризация CLAUDE.md + MCP/Skills
- CLAUDE.md сокращён с 938 до 226 строк
- Создано: `docs/BUSINESS_CONTEXT.md`, `docs/DEVELOPMENT_RULES.md`, `docs/INTEGRATIONS.md`
- Установлены MCP: Supabase, shadcn, Next.js DevTools, Sentry
- Добавлены skills: shadcn-ui, web-perf
- Глобальные MCP перенесены в проектный конфиг

### 2026-02-09 — Парсер сайтов для PLG-стратегии
- 3-слойная архитектура (hook → API route → parser core)
- 16 сигнатур: 7 виджетов, 5 аналитики, 4 мессенджера
- Интеграция в Cookie Generator (spinner + success badge)
- Событие `floqly:parser-complete` для Smart Widget
- Commit: `9873cf2`

---

## Полная история (старше 5 сессий)

<details>
<summary>2026-02-09 — Smart Widget UX/UI Design Guide</summary>

- Создан `docs/SMART_WIDGET_UX_GUIDE.md` (10 разделов, 500+ строк)
- Анимации, thinking indicator, диалоговое окно, триггеры, референсы
- Opensource библиотеки, Material Design Guidelines, roadmap (6 фаз)
</details>

<details>
<summary>2026-02-08 — Cookie Generator Step 3 (полный редизайн)</summary>

- HTML preview вместо Markdown textarea (react-markdown)
- WYSIWYG редактирование (contentEditable) + кнопка "Сбросить"
- Seamless preview (документ сливается с фоном), решение двойных границ
- Упрощение UI (удалены кнопки режимов)
</details>

<details>
<summary>2026-02-08 — Cookie Generator: информационные блоки + PLG-стратегия</summary>

- Единый стиль информационных блоков для всех 5 шагов
- Создана PLG-стратегия: `docs/PLG_STRATEGY.md`
- Новый шаблон документа (`cookie-policy.ts`) с 4 блоками
- Git Recovery Guide
</details>

<details>
<summary>2026-02-07 — Cookie Generator: Precision Minimalism</summary>

- Steps 1-5: typography (font-semibold, tracking-tight), spacing (+4-8px)
- Tooltips: семантические цвета, hit area 18px, :focus-visible
- A11y: aria-hidden, :focus-visible, visible focus ring
- Commits: `272ebd7`, `e19b924`, `2f5fd76`
</details>

<details>
<summary>2026-02-07 — Оптимизация для Claude Code</summary>

- `.claudeignore` + `.cursorignore` → экономия 95% токенов
- Перенос документации в `docs/`, архивирование в `docs/archived/`
- Commits: `54dd61c`, `253fc1c`, `b95f61d`
</details>

<details>
<summary>2026-02-06 — Cookie Generator: UX Redesign Steps 1-2</summary>

- Compact inline layout Step 1, two-column Step 2
- Live preview через Microlink API, hook `use-site-screenshot`
- Commit: `44791f6`
</details>

<details>
<summary>2026-02-05 и ранее — Фундамент</summary>

- Монорепозиторий (pnpm workspaces)
- Next.js 16.1.6 + React 19.2 + Tailwind CSS v4
- Маршруты: (marketing), (tools), (dashboard)
- Supabase проект + database schema
- UI-кит (packages/ui)
- Cookie Generator 5 шагов
- `docs/DESIGN_SYSTEM.md`
- Подробности: `docs/archived/PROGRESS-old.md`
</details>
