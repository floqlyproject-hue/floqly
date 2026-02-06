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

### Размеры и назначение
```
text-2xl / text-3xl  — заголовок страницы (h1), font-semibold, tracking-tight
text-[15px]          — заголовки секций (h2/h3), font-semibold или font-medium
text-[14px]          — подзаголовки, FAQ вопросы, font-medium
text-[13px]          — основной текст, лейблы форм, кнопки, font-medium
text-[12px]          — подписи, хелп-текст, тултипы
text-[11px]          — uppercase-метки секций, tracking-[0.1em] или tracking-[0.15em]
text-[10px]          — мелкие бейджи ("Обязательно", "Рекомендуется")
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

## Компоненты

### Карточка контента
```
rounded-xl border border-border bg-card p-6 sm:p-8
```
Никаких inner-градиентов, blur, теней. Чистая поверхность.

### Инпут формы
```
rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm
transition-colors duration-150
placeholder:text-muted-foreground/40
focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10
```
Фокус через foreground-тонировку, не через primary.

### Лейбл формы
```
text-[13px] font-medium text-foreground
```

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

### Кнопка с обводкой
```
rounded-lg border border-border px-3.5 py-2 text-[13px] font-medium text-foreground
transition-colors hover:bg-muted
```

### Табы (underline-стиль)
```
Контейнер:  -mb-px flex border-b border-border
Таб:        relative px-4 py-2.5 text-[13px] font-medium transition-colors duration-150
Активный:   text-foreground + <span absolute bottom line h-[2px] bg-foreground>
Завершённый: text-muted-foreground + чекмарк svg
Будущий:    text-muted-foreground/50
```

### Бейдж / метка
```
Обязательно: rounded-md bg-foreground/[0.06] px-1.5 py-px text-[10px] font-medium text-muted-foreground
Рекомендуется: rounded-md bg-amber-500/8 px-1.5 py-px text-[10px] font-medium text-amber-600
```

### Тултип
```
rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-[12px] text-zinc-300 shadow-xl
```
Всегда тёмный фон, независимо от темы — для максимальной читаемости.

### FAQ (2x2 cross-grid)
```
Контейнер: relative
Крестовые разделители: absolute positioned w-px / h-px bg-border
Ячейки: padding 7-8, без фона, без обводки
Мобильная: divide-y divide-border (вертикальный стек)
```

### Uppercase-метка секции
```
text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/60
```

### Разделитель секций
```
border-t border-border
```
Никаких градиентных разделителей (`via-border`).

---

## Анимации

### Принцип
Анимации — **только микро-взаимодействия**. Никаких entry-анимаций на секциях, staggered reveals, scroll-triggered появлений. Исключение — главная страница.

### Допустимые анимации
```
transition-colors duration-150   — hover/focus на кнопках, табах, ссылках
transition-all duration-150      — CTA кнопки (hover:opacity-80)
transition-all duration-500      — progress bar заполнение (если используется)
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
