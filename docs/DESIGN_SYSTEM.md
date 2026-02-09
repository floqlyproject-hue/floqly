# Floqly Design System

> Распространяется на ВСЕ страницы кроме главной (landing). Главная страница — отдельный дизайн с анимациями, GSAP и т.д.

## Философия

**Precision minimalism** — дизайн, который выглядит так, будто его сделал профессиональный frontend-дизайнер, а не AI. Вдохновение: Linear, Vercel, Raycast.

Три визуальных инструмента, и ТОЛЬКО они:
1. **Тонкие бордеры** — основной структурный элемент
2. **Фоновые поверхности** — белые карточки на тёплом фоне
3. **Типографская иерархия** — размер, вес и цвет создают глубину

### Чего НЕ делаем
- `backdrop-blur-sm` на карточках
- Внутренние градиенты (`bg-gradient-to-b from-primary/[0.02]`)
- `shadow-sm` / `shadow-md` на статичных элементах
- `rounded-2xl` (слишком "бабблгам")
- `ring-1 ring-border/50` (конкурирующие визуальные слои)
- Shine-анимации на кнопках (`via-white/10 translate-x-full`)
- Декоративные glow-эффекты (`blur-xl bg-primary/20`)
- Цветные иконочные контейнеры (`bg-primary/10 rounded-lg` с иконкой внутри)

---

## Цветовая палитра (OKLCH)

### Светлая тема
```
background:  oklch(97.5% 0.004 90)   — тёплый нейтральный фон
card:        oklch(100% 0 0)          — чистый белый (создаёт контраст)
foreground:  oklch(15% 0.02 264)      — почти чёрный
border:      oklch(90% 0.006 264)     — тонкие нейтральные линии
muted-fg:    oklch(46% 0.02 264)      — вторичный текст
primary:     oklch(55% 0.22 260)      — синий акцент (используется МИНИМАЛЬНО)
```

### Тёмная тема
```
background:  oklch(12% 0.02 260)      — глубокий синий
card:        oklch(15% 0.025 260)     — чуть светлее фона
foreground:  oklch(98% 0.01 264)      — почти белый
border:      oklch(22% 0.025 260)     — тонкие линии
```

### Правило использования primary
Primary (синий) — только для:
- Чекмарки завершённых шагов
- Ссылки (если нужно)
- Акцентные бейджи (редко)

Кнопки действия используют `bg-foreground text-background` — это сильнее и профессиональнее.

---

## Типографика

### Шрифт
- **Geist Sans** — основной (через `next/font/google`, подмножество `latin` + `cyrillic`)
- **Geist Mono** — для технических элементов (счётчики, код, `https://` в инпутах)

### Иерархия размеров (эталон: Cookie Generator Steps 1-2)
```
text-[28px] sm:text-[32px]  — заголовок страницы (h1), font-semibold, tracking-tight
text-[22px]                 — заголовок шага/секции (h2/h3), font-semibold, tracking-tight
text-[15px]                 — fieldset-заголовки, font-semibold
text-[14px]                 — подзаголовки шагов, FAQ вопросы, font-medium
text-[13px]                 — лейблы форм, кнопки, хелп-текст, font-medium
text-[12px]                 — тултипы, мелкие подписи
text-[11px]                 — uppercase-метки секций, tracking-[0.08em]
text-[10px]                 — мелкие бейджи ("Обязательно", "Рекомендуется")
```

### Цвета текста
```
text-foreground           — заголовки, активные элементы
text-foreground/70        — текст-подсказки средней важности
text-foreground/50        — приглушённый текст
text-muted-foreground     — вторичный текст
text-muted-foreground/70  — хелп-текст, подписи
text-muted-foreground/60  — uppercase-метки
text-muted-foreground/40  — плейсхолдеры
text-muted-foreground/50  — неактивные табы
```

---

## Компоненты (эталон: Cookie Generator Steps 1-2)

### Заголовок шага / секции формы
```jsx
<div className="mb-12 max-w-lg">
  <h3 className="text-[22px] font-semibold tracking-tight text-foreground">
    Заголовок
  </h3>
  <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground/70">
    Подзаголовок
  </p>
</div>
```
Контейнер `mb-12` создаёт воздух. `max-w-lg` ограничивает ширину текста.

### Инпут формы (underline-стиль)
```
border-b border-border bg-transparent px-0 py-3 text-[15px] text-foreground
transition-colors duration-200
placeholder:text-muted-foreground/40
focus:border-foreground/40 focus:outline-none
```
Без `rounded`, без бокса — только нижняя линия. Фокус усиливает border.

### Инпут формы (boxed, для dashboard)
```
rounded-lg border border-border bg-background px-3.5 py-2.5 text-[15px]
transition-colors duration-200
placeholder:text-muted-foreground/40
focus:border-foreground/40 focus:outline-none
```

### Лейбл формы
```
mb-3 block text-[13px] font-medium text-foreground
```

### Хелп-текст (под инпутом)
```
mt-2.5 text-[13px] leading-relaxed text-muted-foreground
```

### Fieldset-заголовок (группа полей)
```
text-[15px] font-semibold text-foreground
```

### Fieldset-подпись
```
text-[14px] font-medium text-foreground/90
```

### Кастомный чекбокс (.cb)
```css
/* globals.css — class="cb" на input[type="checkbox"] */
appearance: none; width: 1.125rem; height: 1.125rem;
border: 1.5px solid var(--color-border); border-radius: 0.3rem;
hover → border-color: var(--color-foreground)
checked → bg + border = var(--color-foreground), checkmark animation
active → scale(0.9) spring effect
```
Используется вместо стандартных чекбоксов. Без box-shadow на hover.

### Тултип (CSS-only)
```jsx
<span className="tooltip-trigger relative inline-flex">
  <svg /* (?) icon */ className="size-4 text-muted-foreground/45 hover:text-muted-foreground" />
  <span className="tooltip-content mb-2.5 w-60 rounded-lg bg-foreground px-3.5 py-2.5
    text-[12px] leading-relaxed text-background shadow-lg
    dark:bg-[oklch(25%_0.025_260)] dark:text-[oklch(90%_0.01_264)]">
    Текст тултипа
  </span>
</span>
```
CSS transitions в `globals.css`: `.tooltip-content` + `.tooltip-trigger:hover .tooltip-content`.

### Кнопка основная (CTA)
```
rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background
transition-all duration-150 hover:opacity-80
```
Чёрная в светлой теме, белая в тёмной. Никаких shine-анимаций.

### Кнопка вторичная / ghost
```
rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground
transition-colors duration-150 hover:text-foreground
```

### Кнопка inline (добавить)
```
text-[13px] font-medium text-foreground/60 hover:text-foreground
disabled:opacity-20 disabled:pointer-events-none
```
Без `cursor-not-allowed` — мягкий disabled через opacity + pointer-events-none.

### Табы (step-stepper)
```
Контейнер:  flex gap-1 (без border-b)
Таб:        px-4 py-2.5 text-[13px] font-medium rounded-lg transition-colors duration-150
Активный:   bg-foreground text-background
Завершённый: text-muted-foreground + чекмарк svg
Будущий:    text-muted-foreground/50
```

### Бейдж / метка
```
Обязательно: rounded-md bg-foreground/[0.06] px-1.5 py-px text-[10px] font-medium text-muted-foreground
Рекомендуется: rounded-md bg-amber-500/8 px-1.5 py-px text-[10px] font-medium text-amber-600
```

### Uppercase-метка секции
```
text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground/60
```

### Разделитель секций
```
border-t border-border
```
Никаких градиентных разделителей (`via-border`).

---

## Анимации (Material Design 3 motion)

### Принцип
Микро-взаимодействия с Material Design easing. Никаких декоративных entry-анимаций на секциях или scroll-triggered эффектов. Исключение — главная страница.

### Easing и timing
```
Standard decelerate:  cubic-bezier(0.0, 0.0, 0.2, 1)  — для появлений (step-enter, expand-enter)
Standard:             cubic-bezier(0.4, 0, 0.2, 1)     — для hover/transitions
Duration:             200ms (hover) / 250ms (appear) / 100ms (active press)
```

### CSS-классы анимаций (globals.css)
```
.step-enter    — появление контента при переключении шага (translateY 8px, 250ms)
.expand-enter  — раскрытие скрытой секции (translateY -4px, 250ms)
```

### Допустимые transition-ы
```
transition-colors duration-200   — hover/focus на кнопках, табах, ссылках
transition-all duration-150      — CTA кнопки (hover:opacity-80)
transition-colors duration-200   — инпуты (border-color при focus)
```

### Крупные анимации — НЕТ на инструментальных страницах
Wow-эффект обеспечивает Умный Виджет (будущий), а не декоративные анимации UI.

---

## Layout страницы инструмента

```
<main className="min-h-screen">
  <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <header className="mb-12">
      <h1 /> + <p /> + features list
    </header>
    <ToolClient />
    <section FAQ />
  </div>
</main>
```

### Заголовок страницы
```
h1: text-2xl sm:text-3xl font-semibold tracking-tight
p:  mt-2 max-w-lg text-[15px] text-muted-foreground
```
Без иконки, без glow. Чистая типографика.

### Features (под заголовком)
```
flex flex-wrap gap-x-5 gap-y-1.5
Каждый: flex items-center gap-1.5 text-[13px] text-muted-foreground
Чекмарк: size-3 text-foreground/30 strokeWidth={3}
```

### Правая часть экрана
На шагах инструментов, где это возможно — **оставлять правую часть свободной**.
Зарезервировано под Умный Виджет (проактивный чат, PLG-конверсия).

---

## Контрольный список ревью

Перед финализацией любой страницы (кроме главной) проверить:

- [ ] Нет `backdrop-blur-sm` на карточках
- [ ] Нет inner-градиентов в контейнерах
- [ ] Нет `shadow-sm/md` на статичных элементах
- [ ] Нет `rounded-2xl` (максимум `rounded-xl`)
- [ ] Кнопки CTA используют `bg-foreground`, не `bg-primary`
- [ ] Инпуты `rounded-lg`, фокус через foreground, не primary
- [ ] Типографская иерархия: точные px-размеры, не `text-sm/base/lg`
- [ ] Светлая + тёмная тема проверены
- [ ] Правая часть экрана свободна где возможно
