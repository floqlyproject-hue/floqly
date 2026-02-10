# Floqly — Прогресс разработки

> Последнее обновление: 2026-02-10
> Текущая фаза: **Подготовка к разработке Smart Widget**
> Актуальные задачи: см. TODO в [CLAUDE.md](../CLAUDE.md)

---

## Текущий статус

| Компонент | Статус | Детали |
|-----------|--------|--------|
| Cookie Generator | 92% | Steps 1-5 дизайн унифицирован. Step 3 WYSIWYG. Нужно: доработать Step 2, auto-fill, тесты |
| Парсер сайтов | MVP готов | 3-слойная архитектура, 16 сигнатур, интеграция в Cookie Generator |
| Smart Widget UX Guide | Готов | `docs/SMART_WIDGET_UX_GUIDE.md` (гайд по анимациям, UI, триггерам) |
| Simple Widget дизайны | Design-01 ready | Sandbox: `widget-preview/design-XX/` |
| Smart Widget дизайны | Не начат | Ждёт утверждения Simple Widget дизайнов |
| Dashboard | Каркас | Базовая структура, импорт компонентов из (tools) |
| Landing | Не начат | Ждёт дизайнов виджетов |
| Supabase Auth | Не начат | Проект настроен, типы — placeholder |

---

## Последние 5 сессий

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

### 2026-02-09 — Smart Widget UX/UI Design Guide
- Создан `docs/SMART_WIDGET_UX_GUIDE.md` (10 разделов, 500+ строк)
- Анимации, thinking indicator, диалоговое окно, триггеры, референсы
- Opensource библиотеки, Material Design Guidelines, roadmap (6 фаз)

### 2026-02-08 — Cookie Generator Step 3 (полный редизайн)
- HTML preview вместо Markdown textarea (react-markdown)
- WYSIWYG редактирование (contentEditable) + кнопка "Сбросить"
- Seamless preview (документ сливается с фоном), решение двойных границ
- Упрощение UI (удалены кнопки режимов)

### 2026-02-08 — Cookie Generator: информационные блоки + PLG-стратегия
- Единый стиль информационных блоков для всех 5 шагов
- Создана PLG-стратегия: `docs/PLG_STRATEGY.md`
- Новый шаблон документа (`cookie-policy.ts`) с 4 блоками
- Git Recovery Guide

---

## Полная история (старше 5 сессий)

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
