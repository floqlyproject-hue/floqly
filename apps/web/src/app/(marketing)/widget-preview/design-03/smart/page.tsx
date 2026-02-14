'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

/* ═══════════════════════════════════════════════════════
   Design 03 — Smart Widget (Filled / Solid)

   Копия Terminal Boot из Design-02, но с ЗАЛИТЫМ фоном.
   Цветовая схема как Liquid Bloom:
     Light: bg #059669, icon/text #fff
     Dark:  bg #34D399, icon/text #18181b
   ═══════════════════════════════════════════════════════ */

const BUBBLE_PATH =
  'M3 33 V10 a7 7 0 0 1 7-7 h20 a7 7 0 0 1 7 7 v10 a7 7 0 0 1-7 7 H13 C9 27 5 30 3 33 Z'

type MorphState = 'idle' | 'animating' | 'expanded' | 'collapsing'

const MORPH_MESSAGE = 'Привет! Чем могу помочь?'
const MORPH_EXPANDED_WIDTH = 300
const MORPH_AUTO_COLLAPSE_DELAY = 10000

export default function Design03Smart() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const isDark = theme === 'dark'

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? 'bg-zinc-900' : 'bg-zinc-100'
      }`}
    >
      {/* Theme Toggle */}
      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`rounded-full p-3 transition-colors ${
            isDark
              ? 'bg-zinc-800 text-white hover:bg-zinc-700'
              : 'bg-white text-zinc-900 shadow-md hover:bg-zinc-200'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Back Link */}
      <div className="fixed left-4 top-4 z-50">
        <a
          href="/widget-preview"
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            isDark
              ? 'bg-zinc-800 text-white hover:bg-zinc-700'
              : 'bg-white text-zinc-900 shadow-md hover:bg-zinc-200'
          }`}
        >
          ← Назад
        </a>
      </div>

      {/* Instructions */}
      <div className="fixed left-4 bottom-4 z-50 flex flex-col gap-1">
        <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Триггер: 3 клика → 2с задержка → анимация
        </span>
        <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Клик в expanded → свернуть
        </span>
      </div>

      {/* ══════════════════════════════════════════════
         CENTER: Filled Smart Widget
         ══════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
        <div className="pointer-events-auto flex flex-col items-end gap-3" style={{ minWidth: 320 }}>
          <span className={`text-[11px] font-medium tracking-wider uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Design 03 — Filled
          </span>
          <FilledWidget isDark={isDark} />
        </div>
      </div>

      {/* ─── Styles ─── */}
      <style>{`
        /* ═══════════════════════════════════════
           FILLED WIDGET — Solid background variant

           Idle: залитый бренд-цвет, белая/тёмная иконка
           Expanded: тот же залитый фон, контрастный текст
           ═══════════════════════════════════════ */
        .fl-widget {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          outline: none; background: none; border: none; padding: 0;
        }
        .fl-widget:active:not(.fl-animating) .fl-box {
          transform: scale(0.93); transition-duration: 100ms;
        }
        .fl-box {
          width: 56px; height: 56px; border-radius: 16px;
          border: none; position: relative;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          transition: background-color 300ms ease;
          transform-origin: right center;
        }
        .fl-light .fl-box { background: #059669; }
        .fl-dark .fl-box  { background: #34D399; }

        /* Glow — от залитого фона, насыщенный */
        .fl-glow {
          position: absolute; inset: -2px; border-radius: 18px;
          opacity: 0.3; transition: opacity 400ms ease; pointer-events: none;
        }
        .fl-light .fl-glow {
          box-shadow: 0 0 20px rgba(5,150,105,0.3), 0 0 6px rgba(5,150,105,0.15);
        }
        .fl-dark .fl-glow {
          box-shadow: 0 0 20px rgba(52,211,153,0.3), 0 0 6px rgba(52,211,153,0.15);
        }
        .fl-widget:hover .fl-glow { opacity: 1; }
        .fl-dark:hover .fl-glow {
          box-shadow: 0 0 32px rgba(52,211,153,0.4), 0 0 10px rgba(52,211,153,0.25);
        }
        .fl-light:hover .fl-glow {
          box-shadow: 0 0 32px rgba(5,150,105,0.35), 0 0 10px rgba(5,150,105,0.2);
        }

        /* SVG icon — контрастный на залитом фоне */
        .fl-svg {
          width: 26px; height: 27px; position: relative; z-index: 1; margin-top: 4px;
        }
        .fl-light .fl-svg-path { stroke: #fff; stroke-width: 2.3; }
        .fl-dark .fl-svg-path  { stroke: #18181b; stroke-width: 2.3; }

        /* Dots — контрастные */
        .fl-dots {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          display: flex; align-items: center; gap: 3.5px; z-index: 2;
        }
        .fl-dot {
          display: block; width: 3.5px; height: 3.5px; border-radius: 50%;
          opacity: 0; transform: translateY(4px) scale(0.4);
          transition: opacity 300ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .fl-light .fl-dot { background: #fff; }
        .fl-dark .fl-dot  { background: #18181b; }
        .fl-widget:hover:not(.fl-animating) .fl-dot {
          opacity: 1; transform: translateY(0) scale(1);
          animation: fl-wave 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .fl-widget:hover:not(.fl-animating) .fl-dot:nth-child(1) { animation-delay: 0ms; }
        .fl-widget:hover:not(.fl-animating) .fl-dot:nth-child(2) { animation-delay: 180ms; }
        .fl-widget:hover:not(.fl-animating) .fl-dot:nth-child(3) { animation-delay: 360ms; }
        @keyframes fl-wave {
          0%, 100% { transform: translateY(0) scale(1); }
          18% { transform: translateY(-3.5px) scale(1.15); }
          36% { transform: translateY(0.5px) scale(0.95); }
          48% { transform: translateY(0) scale(1); }
        }

        /* Scanlines overlay */
        .fl-scanlines {
          position: absolute; inset: 0; opacity: 0; pointer-events: none; z-index: 5;
        }
        .fl-dark .fl-scanlines {
          background: repeating-linear-gradient(
            to bottom, transparent 0px, transparent 2px,
            rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px
          );
        }
        .fl-light .fl-scanlines {
          background: repeating-linear-gradient(
            to bottom, transparent 0px, transparent 2px,
            rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px
          );
        }

        /* Cursor blink — контрастный */
        .fl-cursor {
          display: inline-block; width: 2px; height: 14px;
          vertical-align: middle; margin-left: 1px;
        }
        .fl-light .fl-cursor { background: #fff; }
        .fl-dark .fl-cursor  { background: #18181b; }
        @keyframes fl-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .fl-cursor-blink { animation: fl-blink 530ms steps(1) infinite; }

        /* Terminal text container — контрастный */
        .fl-text-area {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          font-size: 13px; line-height: 1.4; white-space: nowrap;
          opacity: 0; pointer-events: none; z-index: 4;
        }
        .fl-light .fl-text-area { color: #fff; }
        .fl-dark .fl-text-area  { color: #18181b; }
      `}</style>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════
   Filled Widget — Terminal Boot с залитым фоном

   Отличия от Design-02 (outline):
   - Кнопка залита бренд-цветом (не прозрачная)
   - Иконка, точки, текст, курсор — контрастные (белый/тёмный)
   - При expand фон остаётся залитым (тот же бренд-цвет)
   - Collapse возвращает к залитому фону
   ═══════════════════════════════════════════════════════ */

function FilledWidget({ isDark }: { isDark: boolean }) {
  const [morphState, setMorphState] = useState<MorphState>('idle')
  const clickCountRef = useRef(0)
  const triggerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoCollapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cooldownRef = useRef(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const textAreaRef = useRef<HTMLSpanElement>(null)
  const scanlineRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {}, containerRef)
    return () => ctx.revert()
  }, [])

  const expand = useCallback(() => {
    if (!boxRef.current || !svgRef.current || !dotsRef.current ||
        !buttonRef.current || !textAreaRef.current || !scanlineRef.current || !cursorRef.current) return
    if (morphState !== 'idle') return
    setMorphState('animating')
    buttonRef.current.classList.add('fl-animating')
    if (timelineRef.current) timelineRef.current.kill()

    const tl = gsap.timeline({
      onComplete: () => {
        setMorphState('expanded')
        autoCollapseTimerRef.current = setTimeout(() => collapse(), MORPH_AUTO_COLLAPSE_DELAY)
      }
    })
    timelineRef.current = tl

    const dots = dotsRef.current.querySelectorAll('.fl-dot')

    /*
      Filled Terminal Boot (expands LEFT via transform-origin: right center):
      0. DOTS: gentle wave pulse, then smooth fade out
      1. SVG fades out, scanlines appear
      2. Width expand LEFT — smooth
      3. Typewriter — char by char monowidth + cursor

      Ключевое отличие: фон УЖЕ залит — не нужно менять backgroundColor.
      Просто расширяем и показываем текст.
    */

    // 0. Force dots visible
    tl.set(dots, { opacity: 1, y: 0, scale: 1 })

    // Gentle wave — dots softly pulse up one by one
    tl.to(dots[0], { y: -3, scale: 1.3, duration: 0.15, ease: 'sine.inOut', yoyo: true, repeat: 1 })
    tl.to(dots[1], { y: -3, scale: 1.3, duration: 0.15, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '-=0.25')
    tl.to(dots[2], { y: -3, scale: 1.3, duration: 0.15, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '-=0.25')

    // Smooth fade out — dots gently shrink and disappear
    tl.to(dots, {
      scale: 0.5, opacity: 0,
      duration: 0.25, ease: 'power2.inOut', stagger: 0.04,
    })

    // 1. SVG fades out, scanlines appear
    tl.set(dotsRef.current, { opacity: 0 })
    tl.to(svgRef.current, { opacity: 0, scale: 0.85, duration: 0.2, ease: 'power2.inOut' })
    tl.to(scanlineRef.current, { opacity: 1, duration: 0.15, ease: 'power1.out' }, '-=0.1')

    // 2. Width expand LEFT — smooth
    tl.to(boxRef.current, {
      width: MORPH_EXPANDED_WIDTH,
      borderRadius: 16,
      duration: 0.5,
      ease: 'power3.out',
    })

    // 3. Show text area + typewriter
    tl.set(textAreaRef.current, { opacity: 1, pointerEvents: 'auto' })
    tl.set(cursorRef.current, { opacity: 1 })
    tl.call(() => { cursorRef.current!.classList.add('fl-cursor-blink') })
    tl.call(() => {
      const textEl = textAreaRef.current!
      const chars = MORPH_MESSAGE.split('')
      let idx = 0
      textEl.textContent = ''
      const type = () => {
        if (idx < chars.length) {
          textEl.textContent += chars[idx]
          textEl.appendChild(cursorRef.current!)
          idx++
          typingTimerRef.current = setTimeout(type, 40)
        }
      }
      type()
    })
    tl.to({}, { duration: 0.04 * MORPH_MESSAGE.length + 0.1 })

  }, [morphState])

  const collapse = useCallback(() => {
    if (!boxRef.current || !svgRef.current || !dotsRef.current ||
        !buttonRef.current || !textAreaRef.current || !scanlineRef.current || !cursorRef.current) return
    if (autoCollapseTimerRef.current) { clearTimeout(autoCollapseTimerRef.current); autoCollapseTimerRef.current = null }
    if (typingTimerRef.current) { clearTimeout(typingTimerRef.current); typingTimerRef.current = null }
    setMorphState('collapsing')
    if (timelineRef.current) timelineRef.current.kill()

    const tl = gsap.timeline({
      onComplete: () => {
        buttonRef.current?.classList.remove('fl-animating')
        setMorphState('idle')
        cooldownRef.current = true
        setTimeout(() => { cooldownRef.current = false }, 3000)
      }
    })
    timelineRef.current = tl

    const dots = dotsRef.current.querySelectorAll('.fl-dot')

    // Text + cursor fade smoothly
    cursorRef.current.classList.remove('fl-cursor-blink')
    tl.to(textAreaRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.2, ease: 'power2.inOut' })
    tl.set(cursorRef.current, { opacity: 0 })
    tl.to(scanlineRef.current, { opacity: 0, duration: 0.15, ease: 'power1.in' }, '-=0.1')

    // Shape shrinks back smoothly (фон остаётся залитым!)
    tl.to(boxRef.current, {
      width: 56, borderRadius: 16,
      duration: 0.45, ease: 'power3.inOut',
    })

    // SVG + dots restore gently
    tl.to(svgRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }, '-=0.15')
    tl.set(dotsRef.current, { opacity: 1 })
    // Clear ALL inline styles from dots so CSS :hover transitions work again
    tl.call(() => {
      dots.forEach((dot) => gsap.set(dot, { clearProps: 'all' }))
    })

    // Reset text content
    tl.call(() => { textAreaRef.current!.textContent = '' })
  }, [])

  const handleClick = useCallback(() => {
    if (morphState === 'expanded') { collapse(); return }
    if (morphState === 'idle' && !cooldownRef.current) {
      clickCountRef.current += 1
      if (clickCountRef.current >= 3) {
        clickCountRef.current = 0
        if (triggerTimerRef.current) clearTimeout(triggerTimerRef.current)
        triggerTimerRef.current = setTimeout(() => expand(), 2000)
      }
    }
  }, [morphState, expand, collapse])

  useEffect(() => {
    return () => {
      if (triggerTimerRef.current) clearTimeout(triggerTimerRef.current)
      if (autoCollapseTimerRef.current) clearTimeout(autoCollapseTimerRef.current)
      if (timelineRef.current) timelineRef.current.kill()
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    }
  }, [])

  const themeClass = isDark ? 'fl-dark' : 'fl-light'

  return (
    <div ref={containerRef}>
      <button ref={buttonRef} className={`fl-widget ${themeClass}`} onClick={handleClick} aria-label="Открыть чат">
        <div ref={boxRef} className="fl-box">
          <div className="fl-glow" />
          <div ref={scanlineRef} className="fl-scanlines" />
          <svg ref={svgRef} className="fl-svg" viewBox="0 0 40 38" fill="none">
            <path className="fl-svg-path" d={BUBBLE_PATH} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div ref={dotsRef} className="fl-dots">
            <span className="fl-dot" /><span className="fl-dot" /><span className="fl-dot" />
          </div>
          <span ref={textAreaRef} className="fl-text-area">
            <span ref={cursorRef} className="fl-cursor" style={{ opacity: 0 }} />
          </span>
        </div>
      </button>
    </div>
  )
}
