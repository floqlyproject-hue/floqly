'use client'

import { useState } from 'react'

/* ═══════════════════════════════════════════════════════
   Design 02 — Floqly Brand (Material Design refined)
   ═══════════════════════════════════════════════════════ */

/* Speech bubble path — one continuous line,
   tail formed by bottom edge curving down to left edge.

   Geometry (SVG units, viewBox 0 0 40 38):
   - Top edge (top of round corners):  Y = 3
   - Bottom edge (bottom of round corners): Y = 27
   - Tail tip: Y = 33
   - Body height: 24 units (Y 3→27), body center: Y = 15
   - viewBox center: Y = 19
   - Optical shift to center body: 4 units → margin-top: +3px (down)
*/
const BUBBLE_PATH =
  'M3 33 V10 a7 7 0 0 1 7-7 h20 a7 7 0 0 1 7 7 v10 a7 7 0 0 1-7 7 H13 C9 27 5 30 3 33 Z'

export default function Design02Simple() {
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

      {/* Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Widget isDark={isDark} />
      </div>

      {/* ─── Styles ─── */}
      <style>{`
        .fw-widget {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          background: none;
          border: none;
          padding: 0;
        }

        .fw-widget:active .fw-box {
          transform: scale(0.93);
          transition-duration: 100ms;
        }

        .fw-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          border: 1.5px solid;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 500ms ease-out;
        }

        .fw-light .fw-box { border-color: #059669; }
        .fw-dark .fw-box  { border-color: #34D399; }

        /* Idle glow — always slightly visible for discoverability */
        .fw-glow {
          position: absolute; inset: -2px; border-radius: 18px;
          opacity: 0.35; transition: opacity 400ms ease; pointer-events: none;
        }
        .fw-light .fw-glow {
          box-shadow: 0 0 16px rgba(5,150,105,0.12), 0 0 4px rgba(5,150,105,0.08);
        }
        .fw-dark .fw-glow {
          box-shadow: 0 0 16px rgba(52,211,153,0.15), 0 0 4px rgba(52,211,153,0.1);
        }
        .fw-widget:hover .fw-glow {
          opacity: 1;
        }
        .fw-dark:hover .fw-glow {
          box-shadow: 0 0 28px rgba(52,211,153,0.25), 0 0 8px rgba(52,211,153,0.2);
        }
        .fw-light:hover .fw-glow {
          box-shadow: 0 0 28px rgba(5,150,105,0.2), 0 0 8px rgba(5,150,105,0.15);
        }

        /* Bubble SVG — optically centered by body (excluding tail)
           Body: Y 3→27 (center Y=15), viewBox center: Y=19
           Body center is 4 units ABOVE viewBox center
           → shift SVG DOWN so body center aligns with box center
           4px down = 3px calculated + 1px visual tweak */
        .fw-svg {
          width: 26px; height: 27px;
          position: relative; z-index: 1;
          margin-top: 4px;
        }
        .fw-light .fw-path { stroke: #059669; stroke-width: 2.3; }
        .fw-dark .fw-path  { stroke: #34D399; stroke-width: 2.3; }

        /* Dots — centered on bubble body visual center
           SVG shifted 4px down, body center is 3px above SVG center
           → dots at box center + 4px - 3px = +1px */
        .fw-dots {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          display: flex; align-items: center; gap: 3.5px; z-index: 2;
        }
        .fw-dot {
          display: block; width: 3.5px; height: 3.5px; border-radius: 50%;
          opacity: 0; transform: translateY(4px) scale(0.4);
          transition: opacity 300ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .fw-light .fw-dot { background: #059669; }
        .fw-dark .fw-dot  { background: #34D399; }
        .fw-widget:hover .fw-dot {
          opacity: 1; transform: translateY(0) scale(1);
          animation: fw-wave 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .fw-widget:hover .fw-dot:nth-child(1) { animation-delay: 0ms; }
        .fw-widget:hover .fw-dot:nth-child(2) { animation-delay: 180ms; }
        .fw-widget:hover .fw-dot:nth-child(3) { animation-delay: 360ms; }

        @keyframes fw-wave {
          0%, 100% { transform: translateY(0) scale(1); }
          18% { transform: translateY(-3.5px) scale(1.15); }
          36% { transform: translateY(0.5px) scale(0.95); }
          48% { transform: translateY(0) scale(1); }
        }
      `}</style>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════
   Widget Component
   ═══════════════════════════════════════════════════════ */

function Widget({ isDark }: { isDark: boolean }) {
  return (
    <button className={`fw-widget ${isDark ? 'fw-dark' : 'fw-light'}`} aria-label="Открыть чат">
      <div className="fw-box">
        <div className="fw-glow" />
        <svg className="fw-svg" viewBox="0 0 40 38" fill="none">
          <path className="fw-path" d={BUBBLE_PATH} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <div className="fw-dots">
          <span className="fw-dot" />
          <span className="fw-dot" />
          <span className="fw-dot" />
        </div>
      </div>
    </button>
  )
}
