# Правила разработки Floqly

> Этот документ содержит подробные правила, антипаттерны и объяснения.
> Краткая версия запретов — в [CLAUDE.md](../CLAUDE.md).

---

## Общие правила

- Язык интерфейса: **только русский** (i18n не нужен)
- Темы: светлая + тёмная **с первого дня**
- Mobile: desktop-first, но адаптив обязателен
- Accessibility: базовый уровень (клавиатура, aria-labels)
- TypeScript strict mode
- Функциональные компоненты (не классы)
- Tailwind для стилей (не CSS-in-JS)
- Тесты для критических путей (auth, API)

---

## Виджет (apps/widget)

- **Bundle size:** < 50kb gzipped (главное чтобы не очень долго грузилось)
- **Изоляция:** Shadow DOM обязателен
- **Работа в iframe:** да (Tilda, Wix)
- Нейтральные имена (избежать AdBlock): `fl-helper.js`, не `ad-widget.js`
- Загрузка: `defer` или `async`

---

## Безопасность

- CORS только для разрешённых доменов
- JWT для API
- Rate limiting
- Не хранить sensitive data в localStorage
- API endpoints — всегда валидация через zod
- Пароли НЕ хранить НИГДЕ (только на сервере)
- Токены — в httpOnly cookies (не localStorage)
- Использовать Supabase Auth

---

## Антипаттерны (с подробными объяснениями)

### Дизайн и UI

#### Framer Motion в apps/web (инструменты и ЛК) — ЗАПРЕЩЁН

**Почему:** Увеличивает размер страницы, противоречит precision minimalism, на инструментах нужна скорость.

**Где МОЖНО:** Landing, виджеты (apps/widget), Pop-up cookie на сайте клиента.
**Где НЕЛЬЗЯ:** Инструменты, ЛК, служебные страницы.
**Вместо этого:** CSS анимации (`transition-colors duration-150`).

---

#### backdrop-blur, rounded-2xl, inner-градиенты — ЗАПРЕЩЕНЫ в инструментах/ЛК

**Почему:** Не соответствует precision minimalism, выглядит "тяжело", отвлекает от задачи.
**Вместо этого:** `rounded-lg`, простые бордеры (`border`), однотонные цвета.
**Где можно:** Только landing и виджеты.

---

#### Статичные элементы справа в инструментах — ЗАПРЕЩЕНЫ

**Что НЕЛЬЗЯ:** Fixed sidebar, sticky элементы, постоянные баннеры справа.
**Что МОЖНО:** Модальные окна, tooltips, dropdown меню, toast уведомления (временные).

**Почему:** Правая часть зарезервирована под Smart Widget (он будет fixed, поверх контента). Статичные элементы справа будут конфликтовать с виджетом.

**Правило:** Дизайн должен оставлять "воздух" справа для Smart Widget.

---

### Код и архитектура

#### Дублирование кода между (tools) и (dashboard) — ЗАПРЕЩЕНО

Dashboard версия ИМПОРТИРУЕТ компоненты из публичной:
```tsx
// ❌ ПЛОХО: копировать компонент
export function CompanyForm() { /* дублированный код */ }

// ✅ ХОРОШО: импортировать
import { CompanyForm } from '@/app/(tools)/tools/cookie-generator/components'
```

---

#### Компоненты в packages/ui если специфичны для apps/web — ЗАПРЕЩЕНО

- `packages/ui` — УНИВЕРСАЛЬНЫЕ компоненты (Button, Card, Modal)
- `apps/web/components` — СПЕЦИФИЧНЫЕ для apps/web (Header, Footer, зависящие от Next.js роутинга)

---

#### Хардкод цветов (bg-blue-500, text-red-600) — ЗАПРЕЩЁН

Используй семантические цвета из globals.css:
- `bg-background`, `bg-foreground`, `bg-primary`, `bg-muted`, `border-border`
- `text-foreground`, `text-muted-foreground`, `text-primary-foreground`

```tsx
// ❌ ПЛОХО
<div className="bg-blue-500 text-white">

// ✅ ХОРОШО
<div className="bg-primary text-primary-foreground">
```

**Исключение:** Виджеты (apps/widget) — любые цвета разрешены.

---

#### CSS-in-JS (styled-components, emotion) — ЗАПРЕЩЁН

В проекте есть Tailwind CSS. Только его использовать.

---

#### Тяжёлые библиотеки без обсуждения — ЗАПРЕЩЕНЫ

- Сначала: "Можно ли обойтись без библиотеки?"
- Проверить размер на bundlephobia.com
- Обсудить с Никитой если > 50kb

---

## Дизайн — Зоны применения

### Precision Minimalism (строгие правила)

**Применяется к:** инструменты (Cookie Generator и др.), личный кабинет, служебные страницы.

Полная дизайн-система: [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)

**Правила:**
- Стиль: precision minimalism (Linear, Vercel, Raycast)
- Три инструмента: тонкие бордеры, белые поверхности, типографская иерархия
- Кнопки CTA: `bg-foreground text-background`, не `bg-primary`
- Анимации: только micro-interactions (transition 150ms)
- Правая часть экрана свободна для Smart Widget

### Креатив без ограничений

**Применяется к:** виджеты (Simple/Smart Widget), pop-up cookie, landing (главная страница).

- **Виджеты:** Любые техники — GSAP, custom animations, градиенты, shadows, blur
- **Landing:** Framer Motion, GSAP, Three.js, scroll-triggered анимации (цель: Awwwards)
- **Референсы:** `/design-references/`

### Шпаргалка

| Контекст | Минимализм? | Технологии |
|----------|-------------|------------|
| Инструменты / ЛК / служебные | ДА | Tailwind, CSS transitions |
| Виджеты (Simple/Smart) | НЕТ | Любые (GSAP, custom CSS) |
| Landing (главная) | НЕТ | Framer Motion, GSAP, Three.js |

---

## Чек-лист перед коммитом

- [ ] Прочитал файл перед редактированием (Read → Edit, не Write)
- [ ] Семантические цвета (не bg-blue-500) — только для инструментов/ЛК
- [ ] Framer Motion не добавлен в инструменты/ЛК
- [ ] Нет fixed sidebar справа в инструментах
- [ ] Компоненты не дублируются (Dashboard импортирует из public)
- [ ] API с валидацией zod
- [ ] Обновил PROGRESS.md
- [ ] Тесты пройдены (если менял критический код)

---

## Режим планирования (для новых фич)

**Когда:** Пользователь просит спланировать новую фичу / задача сложная.

**Процесс:**
1. EnterPlanMode → изучить кодовую базу
2. Создать `docs/plans/PLAN-feature-name.md` со структурой:
   - Цель, Технический подход, Файлы, Зависимости, Риски, Тестирование
3. Показать пользователю → дождаться одобрения
4. Работать по плану, обращаться к нему при необходимости
5. После завершения → отметить в PROGRESS.md

---

## Скиллы для дизайна

При работе с Precision Minimalism (инструменты/ЛК) **всегда используй**:
- `frontend-design` — создание новых UI компонентов
- `web-design-guidelines` — ревью и аудит существующего дизайна
