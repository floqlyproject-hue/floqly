# Smart Widget UX/UI Design Guide

> **Полное руководство по созданию проактивного AI-виджета с идеальным UX/UI**

---

## 📖 Содержание

1. [Контекст и цели](#контекст-и-цели)
2. [Анимация появления проактивного уведомления](#1-анимация-появления-проактивного-уведомления)
3. [Thinking Indicator (анимация "раздумий")](#2-thinking-indicator-анимация-раздумий)
4. [Дизайн диалогового окна (чат)](#3-дизайн-диалогового-окна-чат)
5. [Проактивные триггеры](#4-проактивные-триггеры-когда-виджет-заговаривает)
6. [Визуальные референсы](#5-визуальные-референсы-dribbble-awwwards)
7. [Opensource библиотеки](#6-opensource-библиотеки-react--typescript)
8. [Material Design Guidelines](#7-material-design-guidelines-google)
9. [Roadmap реализации](#roadmap-реализации-smart-widget)
10. [Финальные рекомендации](#финальные-рекомендации)

---

## Контекст и цели

### Проблема

Нужно создать **проактивный AI-виджет (Smart Widget)** который будет:
- Инициировать диалог с посетителями сайта
- Делать полезные замечания и рекомендации
- Выглядеть **не как все виджеты** — идеальный UX/UI, анимации, плавные переходы

### Что уже есть

- Simple Widget (design-01/Plasma) — базовая кнопка-виджет ✅ Утверждён
- Структура для 10 дизайнов (design-01 ... design-10)

### Что нужно

Референсы, паттерны UX/UI и технические рекомендации для создания Smart Widget, который визуально впечатляет и функционально превосходит конкурентов.

---

## 1. Анимация появления проактивного уведомления

### ✅ Паттерн: Slide-in + Fade-in

**Что делать:**

1. Уведомление появляется **снизу вверх** (bottom → top) из правого нижнего угла
2. Одновременно **fade-in** (opacity 0 → 1) + **slide** (translateY: 20px → 0)
3. **Scale** эффект (от 0.95 до 1) для "pop" ощущения

**Параметры:**

- Duration: **300-400ms** (не короче 200ms, не длиннее 500ms)
- Easing: **ease-out** → `cubic-bezier(0.4, 0, 0.2, 1)`
- Delay: **0-500ms** после триггера (не мгновенно, но и не долго)

**Почему ease-out?**

- Быстрый старт = ощущение отзывчивости
- Плавное замедление = естественное трение (как в реальном мире)
- **Избегай ease-in-out** для коротких уведомлений (медленный старт = тормоза)

### 📚 Референсы

- [Animate.css — библиотека готовых анимаций](https://animate.style/)
  - Классы: `fadeInUp`, `fadeInRight`, `bounceIn`
- [Timed Notifications with CSS Animations (Codrops)](https://tympanus.net/codrops/2012/06/25/timed-notifications-with-css-animations/)
  - Готовые примеры с таймерами автоскрытия
- [Choosing the right easing (web.dev)](https://web.dev/articles/choosing-the-right-easing)
  - Таблица: какой easing для какой задачи

### 💻 Пример кода (CSS)

```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.smart-notification {
  animation: slideInUp 350ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 🌊 Продвинутый уровень: Spring Physics

Если хочешь "живое" ощущение (как у Apple) — используй **spring animations**.

**Отличие от cubic-bezier:**

- Cubic-bezier: задаёшь `duration` + `curve`
- Spring: задаёшь `stiffness`, `damping`, `mass` (как физический объект)
- **Bounce эффект** — возможен только со spring (cubic-bezier ограничен 2 точками контроля)

**Библиотека: React Spring**

- [react-spring.dev](https://react-spring.dev/)
- [React Spring Visualizer](https://react-spring-visualizer.com/) — твикай параметры в реальном времени

**Пример кода (React Spring):**

```tsx
import { useSpring, animated } from '@react-spring/web'

function SmartNotification() {
  const springs = useSpring({
    from: { opacity: 0, y: 20, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: { tension: 170, friction: 26 } // spring physics
  })

  return (
    <animated.div style={springs} className="notification">
      Привет! Могу помочь?
    </animated.div>
  )
}
```

### 📖 Ресурсы для изучения

- [A Friendly Introduction to Spring Physics Animation (Josh Comeau)](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/)
- [Springs and Bounces in Native CSS](https://www.joshwcomeau.com/animation/linear-timing-function/)
- [The physics behind spring animations](https://blog.maximeheckel.com/posts/the-physics-behind-spring-animations/)

---

## 2. Thinking Indicator (анимация "раздумий")

### ✅ Паттерн: Three Dots (Ellipsis)

**Самый популярный и проверенный временем паттерн.**

**Как выглядит:**

- 3 точки (кружочка)
- Анимация: точки "прыгают" по очереди (вверх-вниз)
- Staggered delays: 0.2s, 0.4s, 0.6s (каждая точка начинает чуть позже)

**Параметры:**

- Duration: **1-1.5s infinite**
- Border-radius: **15px** (круглые точки)
- Color: **приглушённый серый** (`#90949c` или `bg-muted`)
- Size: **8-10px** диаметр каждой точки

### 💻 Готовые примеры с CodePen

**1. Chat Typing Indicator**

- [https://codepen.io/sitesplat/pen/JjGLBQx](https://codepen.io/sitesplat/pen/JjGLBQx)
- Простой и чистый код, 1.5s animation

**2. Facebook Typing Indicator**

- [https://codepen.io/arthak/pen/rmqvgo](https://codepen.io/arthak/pen/rmqvgo)
- Точная копия индикатора Facebook Messenger
- Staggered delays: 200ms, 300ms, 400ms

**3. CSS iMessage Typing Indicator**

- [https://codepen.io/fusco/pen/XbpaYv](https://codepen.io/fusco/pen/XbpaYv)
- Как у Apple iMessage
- `blink` анимация 1s infinite

**4. Chat Typing Bubbles (animated)**

- [https://codepen.io/matthewfortier/pen/JNQwGQ](https://codepen.io/matthewfortier/pen/JNQwGQ)
- Комбинация `scale` + `translateY`
- Самый "живой" вариант

### 💻 Пример кода (CSS)

```css
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: var(--muted);
  border-radius: 15px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #90949c;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}
```

### 🎨 Альтернативы (если хочешь выделиться)

**Pulse Animation (как у Claude.ai):**

- Мягкий пульсирующий кружок
- Меняется `opacity` и `scale`
- Более спокойный, менее навязчивый

**Loading Spinner:**

- Круглый индикатор загрузки
- Подходит для длинных операций (генерация контента)
- **Минус:** может создавать тревожность ("как долго ещё?")

---

## 3. Дизайн диалогового окна (чат)

### ✅ Структура Layout

**Классическая трёхчастная структура:**

```
┌─────────────────────────────┐
│ HEADER                      │ ← Аватар, название, кнопки (minimize, close)
├─────────────────────────────┤
│ MESSAGES CONTAINER          │ ← Auto-scroll к последнему сообщению
│ (user/bot чередуются)       │   Timestamps опционально
│                             │
│  User: Вопрос               │
│  Bot: Ответ                 │
│  Typing indicator...        │
│                             │
├─────────────────────────────┤
│ INPUT AREA                  │ ← Textarea + кнопка отправки
└─────────────────────────────┘
```

### 📐 Размеры и Spacing

**Рекомендации:**

- Width: **400-500px** на десктопе (не уже, не шире)
- Height: **600-700px** (или 70-80% viewport height)
- Spacing между сообщениями: **12-16px**
- Padding внутри сообщений: **12-16px**
- Border-radius: **12px** для сообщений (не слишком круглые, не квадратные)

### 📝 Типографика

**Font:**

Используй **системные шрифты** (быстрая загрузка):

- macOS/iOS: `-apple-system, BlinkMacSystemFont, "SF Pro Text"`
- Windows: `"Segoe UI"`
- Android: `"Roboto"`
- Fallback: `"Helvetica Neue", Arial, sans-serif`

**Sizes:**

- Основной текст: **14-16px**
- Timestamps: **12px**
- Input placeholder: **14px**

**Line-height:**

- **1.5-1.6** для читабельности (не меньше!)

### 📜 Scroll Behavior

**CSS (простой способ):**

```css
.chat-container {
  overflow-y: auto;
  scroll-behavior: smooth; /* Плавный скролл */
}
```

**JavaScript (для автоскролла к последнему сообщению):**

```tsx
import { useEffect, useRef } from 'react'

function ChatMessages({ messages }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll к последнему сообщению
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-container">
      {messages.map((msg) => (
        <div key={msg.id}>{msg.text}</div>
      ))}
      <div ref={bottomRef} /> {/* Якорь для скролла */}
    </div>
  )
}
```

### 🤖 Примеры от лидеров индустрии

**ChatGPT:**

- Минималистичный чёрно-белый интерфейс
- Широкий spacing (легко сканировать)
- Bullet points и таблицы для быстрого потребления
- Single-column layout

**Claude:**

- Тёплые sepia тона + serif шрифты (книжная атмосфера)
- Rich formatting в вопросах (bullet points, emphasis)
- Минималистичный, но уютный

**Perplexity:**

- Серый фон + цитаты с hover state
- Footnote citations (академическая атмосфера)
- Гибрид поисковика и чата

### 📚 Референсы

- [40 Chatbot UI Examples from Product Designers](https://arounda.agency/blog/chatbot-ui-examples)
- [The 20 best looking chatbot UIs in 2026](https://www.jotform.com/ai/agents/best-chatbot-ui/)
- [AI Models as Products: Why ChatGPT, Claude, and Perplexity Feel So Different](https://medium.com/@nhungphnguyen/ai-models-as-products-why-chatgpt-claude-and-perplexity-feel-so-different-7b0857609293)

---

## 4. Проактивные триггеры (когда виджет "заговаривает")

### ✅ Популярные триггеры (вдохновение: Drift, Intercom)

**1. Exit Intent**

- Курсор движется к верхней границе окна (хочет закрыть вкладку)
- **Сообщение:** "Остались вопросы перед уходом?"
- **Timing:** Мгновенно при детекции

**2. Время на странице**

- Пользователь 60 секунд на странице Pricing
- **Сообщение:** "Помочь с выбором тарифа?"
- **Timing:** Через 60 секунд

**3. Scroll Depth**

- Пользователь проскроллил 80% страницы
- **Сообщение:** "Нашли всё что искали?"
- **Timing:** Сразу после достижения 80%

**4. Повторный визит**

- Пользователь вернулся на сайт (cookie определяет returning visitor)
- **Сообщение:** "Рады видеть снова! Продолжим с того места?"
- **Timing:** Через 3-5 секунд после загрузки

**5. Конкретная рекламная кампания**

- Пришёл с Google Ads / Яндекс.Директ
- **Сообщение:** "Интересует [продукт из рекламы]? Могу рассказать подробнее!"
- **Timing:** Через 5 секунд

### 📚 Как это делают конкуренты

**Intercom:**

- In-app messages для onboarding
- Tooltips для новых фичей
- Product tours (modals + tooltips + microvideos)
- Confetti animation на высоком z-index (празднование успеха!)

**Drift:**

- "Playbooks" — custom chat flows по триггерам
- Quick reply buttons (быстрые ответы)
- Фокус на lead generation

### 📖 Ресурсы

- [Intercom for In-app messaging](https://userpilot.com/blog/intercom-in-app-messaging/)
- [Drift vs Intercom](https://www.socialintents.com/blog/drift-vs-intercom/)

---

## 5. Визуальные референсы (Dribbble, Awwwards)

### 🎨 Dribbble (тысячи примеров дизайнов)

**Поиск по тегам:**

- [AI Chat Widget](https://dribbble.com/search/ai-chat-widget) — виджеты с AI
- [AI Chat UI](https://dribbble.com/search/ai-chat-ui) — интерфейсы чатов
- [AI Chat](https://dribbble.com/tags/ai-chat) — общая коллекция

**Что искать:**

- Цветовые схемы (светлые/тёмные темы)
- Формы кнопок и сообщений (rounded, sharp, asymmetric)
- Расположение элементов (header, footer, sidebar)
- Анимированные прототипы (GIF/видео)

### 🏆 Awwwards (сайты-победители с премиальным дизайном)

**Коллекции:**

- [Chat UI](https://www.awwwards.com/inspiration/chat-ui) — конверсационные интерфейсы
- [Chat Box](https://www.awwwards.com/inspiration/chat-box) — элементы с необычной навигацией
- [Animation Libraries](https://www.awwwards.com/awwwards/collections/animation-libraries-examples-inspiration/) — GSAP, Three.js примеры
- [UI Animation and Microinteractions](https://www.awwwards.com/awwwards/collections/animation/)

**Что искать:**

- Необычные transitions между состояниями
- Scroll-triggered анимации
- Parallax эффекты (если подходит для виджета)
- WebGL/Canvas анимации (для wow-эффекта, но осторожно с performance!)

### 💡 Как использовать референсы

**Шаг 1: Создать мудборд**

- Скачай 10-15 скриншотов понравившихся дизайнов
- Сохрани в `design-XX/simple/references/` или `design-XX/smart/references/`

**Шаг 2: Выдели общие паттерны**

- Какие цвета повторяются? (blue, purple, green для AI-тематики)
- Какие формы? (rounded corners, sharp edges, glassmorphism)
- Какие анимации? (fade-in, slide-in, scale)

**Шаг 3: Скажи Claude:**

```
Claude, реализуй Smart Widget для design-02 на основе референсов.

Стиль: Glassmorphism (как референс glass-ref-1.png)
Анимация появления: Slide-in + fade-in (duration 350ms, ease-out)
Thinking indicator: Three dots с bounce (как CodePen arthak/pen/rmqvgo)
Цветовая схема: Blue gradient (#667eea → #764ba2)
```

---

## 6. Opensource библиотеки (React + TypeScript)

Если не хочешь писать с нуля — можно взять готовую основу и кастомизировать.

### ⚛️ Рекомендации

**1. Assistant UI** (самый современный, 2026)

- [GitHub](https://github.com/assistant-ui/assistant-ui)
- Production-grade AI chat experiences
- Streaming, auto-scrolling, accessibility
- Composable primitives (как shadcn/ui)
- ✅ TypeScript out-of-box

**2. Chat UI Kit (chatscope)**

- [GitHub](https://github.com/chatscope/chat-ui-kit-react)
- Build chat UI in few minutes
- TypeScript typings (v1.9.3+)
- Много готовых компонентов

**3. React Chat Widget (Wolox)**

- [GitHub](https://github.com/Wolox/react-chat-widget)
- Простой import, кастомизация аватаров/titles
- `handleNewUserMessage` prop для обработки сообщений

### 🎨 Animation Libraries

**React Spring** (physics-based)

- [react-spring.dev](https://react-spring.dev/)
- Spring physics вместо duration+curve
- 60fps на отдельном thread (без React re-renders)
- ✅ TypeScript + малый bundle size

**Popmotion** (для сложных анимаций)

- [popmotion.io](https://popmotion.io/)
- Spring animations based on stiffness, damping, mass
- Keyframe и spring для numbers, colors, complex strings

---

## 7. Material Design Guidelines (Google)

### 📏 Принципы Motion Design

**Три принципа:**

1. **Informative** — подсвечивает связи между элементами
2. **Focused** — фокусирует внимание на ключевом действии
3. **Expressive** — добавляет personality (но не отвлекает!)

**Вдохновение:** Реальные физические силы (gravity, friction, momentum)

### ⏱️ Duration Guidelines

**Мобильные устройства:**

- Большие анимации: **300-400ms**
- Маленькие анимации: **150-200ms**
- ⚠️ Слишком длинные → тормоза, слишком короткие → мерцание

**Уведомления:**

- Slide up/down from edge: с partial scrim
- Fade in to center: с full scrim (для критичных действий)

### 🔄 Transition Patterns

**Четыре паттерна:**

1. **Container transform** — контейнер трансформируется в новый элемент
2. **Shared axis** — элементы двигаются по общей оси (X/Y/Z)
3. **Fade through** — старый исчезает, новый появляется
4. **Fade** — простое затухание/появление

### 📖 Ресурсы

- [Material Design: Understanding Motion](https://m2.material.io/design/motion/understanding-motion.html)
- [Motion Design - Make Interfaces Meaningful (Google Design)](https://design.google/library/making-motion-meaningful)
- [Motion – Material Design 3](https://m3.material.io/styles/motion/overview/how-it-works)

---

## Roadmap реализации Smart Widget

### Phase 1: Базовая структура (копия Simple Widget)

1. Скопировать утверждённый Simple Widget в `design-XX/smart/page.tsx`
2. Убедиться что базовая кнопка работает (раскрытие/закрытие)
3. **Время:** 30 минут

### Phase 2: Проактивное уведомление

1. Добавить компонент `<ProactiveNotification />`
2. Реализовать slide-in + fade-in анимацию (CSS или React Spring)
3. Добавить триггер (например, через 5 секунд после загрузки)
4. Кнопка закрытия + кнопка "Открыть чат"
5. **Время:** 1-2 часа

### Phase 3: Диалоговое окно

1. Создать компонент `<ChatDialog />`
2. Layout: Header + Messages Container + Input Area
3. State management: `messages` массив
4. Auto-scroll к последнему сообщению
5. **Время:** 2-3 часа

### Phase 4: Thinking Indicator

1. Добавить компонент `<TypingIndicator />`
2. Three dots с bounce анимацией (CSS)
3. Показывать когда бот "думает" (перед ответом)
4. **Время:** 30 минут - 1 час

### Phase 5: AI Integration (будущее)

1. Подключить API Ильи (Python backend)
2. Обработка запросов пользователя
3. Streaming ответов (если API поддерживает)
4. **Время:** 4-6 часов (зависит от API)

### Phase 6: Полировка

1. Светлая/тёмная тема
2. Адаптив (мобильные устройства)
3. Accessibility (keyboard navigation, aria-labels)
4. Performance optimization
5. **Время:** 2-4 часа

---

## Финальные рекомендации

### ✅ Что делать

1. **Начни с референсов** — скачай 10-15 примеров с Dribbble/Awwwards
2. **Используй готовые паттерны** — не изобретай велосипед (three dots, slide-in, ease-out)
3. **Тестируй на реальных пользователях** — что кажется красивым, может быть неудобным
4. **Итерируй быстро** — лучше 5 итераций за неделю, чем 1 за месяц
5. **Копируй лучших** — ChatGPT, Intercom, Drift делают это годами, учись у них

### ❌ Чего избегать

1. **Слишком длинные анимации** (>500ms) — пользователи нетерпеливы
2. **Слишком много movement** — головокружение и отвлечение
3. **Яркие цвета без контекста** — red для AI-чата странный выбор (blue/purple/green лучше)
4. **Автоматическое воспроизведение звуков** — раздражает 99% пользователей
5. **Блокирующие модалы** — если виджет перекрывает весь экран = плохой UX

### 🎯 Ключевые метрики успеха

1. **Engagement Rate** — сколько пользователей кликает на уведомление
2. **Completion Rate** — сколько завершают диалог (не закрывают сразу)
3. **Response Time** — как быстро бот отвечает (или показывает typing indicator)
4. **User Satisfaction** — опросы после диалога (thumbs up/down)

---

## Ресурсы для дальнейшего изучения

### 📚 Статьи и гайды

- [Choosing the right easing — web.dev](https://web.dev/articles/choosing-the-right-easing)
- [A Friendly Introduction to Spring Physics Animation](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/)
- [Handling scroll behavior for AI Chat Apps](https://jhakim.com/blog/handling-scroll-behavior-for-ai-chat-apps)
- [Material Design: Understanding Motion](https://m2.material.io/design/motion/understanding-motion.html)

### 🎨 Визуальные примеры

- [Dribbble: AI Chat Widget](https://dribbble.com/search/ai-chat-widget)
- [Awwwards: Chat UI](https://www.awwwards.com/inspiration/chat-ui)
- [40 Chatbot UI Examples](https://arounda.agency/blog/chatbot-ui-examples)

### 💻 Код и библиотеки

- [Animate.css](https://animate.style/) — готовые CSS анимации
- [React Spring](https://react-spring.dev/) — physics-based анимации
- [CodePen: Chat Typing Indicator](https://codepen.io/sitesplat/pen/JjGLBQx)
- [CodePen: Facebook Typing Indicator](https://codepen.io/arthak/pen/rmqvgo)
- [GitHub: Assistant UI](https://github.com/assistant-ui/assistant-ui)
- [GitHub: Chat UI Kit](https://github.com/chatscope/chat-ui-kit-react)

### 🏢 Конкуренты (для вдохновения)

- [Intercom](https://www.intercom.com/) — лидер в проактивных сообщениях
- [Drift](https://www.drift.com/) — conversational marketing
- [Crisp](https://crisp.chat/) — современный минималистичный дизайн
- [ChatGPT](https://chat.openai.com/) — эталон AI-чата
- [Claude.ai](https://claude.ai/) — warm & minimal design

---

**Готово!** Все референсы, паттерны и рекомендации собраны. Можно начинать реализацию Smart Widget! 🚀
