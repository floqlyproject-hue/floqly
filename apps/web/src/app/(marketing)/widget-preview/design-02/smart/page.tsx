'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

/* ═══════════════════════════════════════════════════════
   Design 02 — Smart Widget (Floqly Brand)

   CENTER (new):  Variants 1–3 — radically different animations
   RIGHT COLUMN:  Old Variants 1–3 + A + B (archived for comparison)
   ═══════════════════════════════════════════════════════ */

const BUBBLE_PATH =
  'M3 33 V10 a7 7 0 0 1 7-7 h20 a7 7 0 0 1 7 7 v10 a7 7 0 0 1-7 7 H13 C9 27 5 30 3 33 Z'

type WidgetState = 'idle' | 'notification' | 'chat' | 'minimized'
type MorphState = 'idle' | 'animating' | 'expanded' | 'collapsing'

const MORPH_MESSAGE = 'Привет! Чем могу помочь?'
const MORPH_EXPANDED_WIDTH = 300
const MORPH_AUTO_COLLAPSE_DELAY = 10000

export default function Design02Smart() {
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
         CENTER COLUMN: NEW Variants 1, 2, 3
         ══════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-between py-[10vh]">
        {/* Variant 1 — Top */}
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          <span className={`text-[11px] font-medium tracking-wider uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Вариант 1 — Liquid Bloom
          </span>
          <LiquidBloomWidget isDark={isDark} />
        </div>

        {/* Variant 2 — Center */}
        <div className="pointer-events-auto flex flex-col items-end gap-3" style={{ minWidth: 320 }}>
          <span className={`text-[11px] font-medium tracking-wider uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Вариант 2 — Terminal Boot
          </span>
          <TerminalBootWidget isDark={isDark} />
        </div>

        {/* Variant 3 — Bottom */}
        <div className="pointer-events-auto flex flex-col items-end gap-3" style={{ minWidth: 320 }}>
          <span className={`text-[11px] font-medium tracking-wider uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Вариант 3 — Origami Unfold
          </span>
          <OrigamiUnfoldWidget isDark={isDark} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
         RIGHT COLUMN: Old variants (archived)
         ══════════════════════════════════════════════ */}
      <div className="fixed right-6 top-0 bottom-0 z-30 pointer-events-none flex flex-col items-end justify-between py-[8vh]">
        {/* Old Variant 1 — Clean Expand */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <span className={`text-[9px] tracking-wider uppercase ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
            old 1 — Clean
          </span>
          <OldMorphVariant isDark={isDark} variant="clean" />
        </div>

        {/* Old Variant 2 — Breathe */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <span className={`text-[9px] tracking-wider uppercase ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
            old 2 — Breathe
          </span>
          <OldMorphVariant isDark={isDark} variant="breathe" />
        </div>

        {/* Old Variant B — Original Morph */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <span className={`text-[9px] tracking-wider uppercase ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
            old B — Morph
          </span>
          <OldMorphVariant isDark={isDark} variant="morph" />
        </div>

        {/* Variant A: Bubble — bottom-right */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <span className={`text-[9px] tracking-wider uppercase ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
            A — Bubble
          </span>
          <SmartWidget isDark={isDark} />
        </div>
      </div>

      {/* ─── SVG Filters (for Liquid Bloom) ─── */}
      <svg className="absolute" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ─── Styles ─── */}
      <style>{`
        /* ═══════════════════════════════════════
           SHARED BUTTON STYLES (Variant A)
           ═══════════════════════════════════════ */
        .fw-widget-btn {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          outline: none; background: none; border: none; padding: 0;
        }
        .fw-widget-btn:active .fw-box {
          transform: scale(0.93); transition-duration: 100ms;
        }
        .fw-box {
          width: 56px; height: 56px; border-radius: 16px;
          border: 1.5px solid; position: relative;
          display: flex; align-items: center; justify-content: center;
          transition: all 500ms ease-out;
        }
        .fw-light .fw-box { border-color: #059669; }
        .fw-dark .fw-box  { border-color: #34D399; }
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
        .fw-widget-btn:hover .fw-glow { opacity: 1; }
        .fw-dark:hover .fw-glow {
          box-shadow: 0 0 28px rgba(52,211,153,0.25), 0 0 8px rgba(52,211,153,0.2);
        }
        .fw-light:hover .fw-glow {
          box-shadow: 0 0 28px rgba(5,150,105,0.2), 0 0 8px rgba(5,150,105,0.15);
        }
        .fw-notif-active .fw-glow {
          opacity: 1; animation: fw-pulse-glow 2s ease-in-out infinite;
        }
        @keyframes fw-pulse-glow {
          0%, 100% { opacity: 0.5; } 50% { opacity: 1; }
        }
        .fw-svg {
          width: 26px; height: 27px; position: relative; z-index: 1; margin-top: 4px;
        }
        .fw-light .fw-path { stroke: #059669; stroke-width: 2.3; }
        .fw-dark .fw-path  { stroke: #34D399; stroke-width: 2.3; }
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
        .fw-widget-btn:hover .fw-dot {
          opacity: 1; transform: translateY(0) scale(1);
          animation: fw-wave 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .fw-widget-btn:hover .fw-dot:nth-child(1) { animation-delay: 0ms; }
        .fw-widget-btn:hover .fw-dot:nth-child(2) { animation-delay: 180ms; }
        .fw-widget-btn:hover .fw-dot:nth-child(3) { animation-delay: 360ms; }
        @keyframes fw-wave {
          0%, 100% { transform: translateY(0) scale(1); }
          18% { transform: translateY(-3.5px) scale(1.15); }
          36% { transform: translateY(0.5px) scale(0.95); }
          48% { transform: translateY(0) scale(1); }
        }

        /* Notification Bubble (Variant A) */
        .fw-notification {
          position: absolute; bottom: calc(100% + 12px); right: 0;
          width: 260px; padding: 14px 16px; border-radius: 12px;
          border: 1.5px solid; font-size: 14px; line-height: 1.5;
          pointer-events: auto; opacity: 0; visibility: hidden;
        }
        .fw-light .fw-notification { background: rgba(255,255,255,0.98); border-color: #059669; color: #1a1a1a; }
        .fw-dark .fw-notification { background: rgba(24,24,27,0.98); border-color: #34D399; color: #f0f0f0; }
        .fw-notif-close {
          position: absolute; top: 8px; right: 8px;
          width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
          border: none; background: none; cursor: pointer; padding: 0; border-radius: 50%;
          font-size: 12px; line-height: 1; opacity: 0.4;
          transition: opacity 200ms ease, background-color 200ms ease;
        }
        .fw-notif-close:hover { opacity: 1; }
        .fw-light .fw-notif-close { color: #059669; }
        .fw-dark .fw-notif-close  { color: #34D399; }
        .fw-notif-pointer {
          position: absolute; bottom: -6px; right: 20px;
          width: 10px; height: 10px; transform: rotate(45deg);
          border-right: 1.5px solid; border-bottom: 1.5px solid;
        }
        .fw-light .fw-notif-pointer { background: rgba(255,255,255,0.98); border-color: #059669; }
        .fw-dark .fw-notif-pointer { background: rgba(24,24,27,0.98); border-color: #34D399; }

        /* ═══════════════════════════════════════
           MORPHING — SHARED (old variants + new)
           ═══════════════════════════════════════ */
        .fm-widget {
          cursor: pointer; -webkit-tap-highlight-color: transparent;
          outline: none; background: none; border: none; padding: 0;
        }
        .fm-widget:active .fm-box { transform: scale(0.93); transition-duration: 100ms; }
        .fm-box {
          width: 56px; height: 56px; border-radius: 16px;
          border: 1.5px solid; position: relative;
          display: flex; align-items: center; justify-content: center;
          transform-origin: center center; transition: border-color 300ms ease;
        }
        .fm-light .fm-box { border-color: #059669; background: transparent; }
        .fm-dark .fm-box  { border-color: #34D399; background: transparent; }
        .fm-light .fm-box.fm-has-bg { background: rgba(255,255,255,0.98); }
        .fm-dark .fm-box.fm-has-bg  { background: rgba(24,24,27,0.98); }
        .fm-glow {
          position: absolute; inset: -2px; border-radius: 18px;
          opacity: 0.35; transition: opacity 400ms ease; pointer-events: none;
        }
        .fm-light .fm-glow { box-shadow: 0 0 16px rgba(5,150,105,0.12), 0 0 4px rgba(5,150,105,0.08); }
        .fm-dark .fm-glow  { box-shadow: 0 0 16px rgba(52,211,153,0.15), 0 0 4px rgba(52,211,153,0.1); }
        .fm-widget:hover .fm-glow { opacity: 1; }
        .fm-dark:hover .fm-glow { box-shadow: 0 0 28px rgba(52,211,153,0.25), 0 0 8px rgba(52,211,153,0.2); }
        .fm-light:hover .fm-glow { box-shadow: 0 0 28px rgba(5,150,105,0.2), 0 0 8px rgba(5,150,105,0.15); }
        .fm-svg {
          width: 26px; height: 27px; position: relative; z-index: 1; margin-top: 4px;
        }
        .fm-light .fm-svg-path { stroke: #059669; stroke-width: 2.3; }
        .fm-dark .fm-svg-path  { stroke: #34D399; stroke-width: 2.3; }
        .fm-dots {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          display: flex; align-items: center; gap: 3.5px; z-index: 2;
        }
        .fm-icon-dot {
          display: block; width: 3.5px; height: 3.5px; border-radius: 50%;
          opacity: 0; transform: translateY(4px) scale(0.4);
          transition: opacity 300ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .fm-light .fm-icon-dot { background: #059669; }
        .fm-dark .fm-icon-dot  { background: #34D399; }
        .fm-widget:hover:not(.fm-animating) .fm-icon-dot {
          opacity: 1; transform: translateY(0) scale(1);
          animation: fw-wave 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .fm-widget:hover:not(.fm-animating) .fm-icon-dot:nth-child(1) { animation-delay: 0ms; }
        .fm-widget:hover:not(.fm-animating) .fm-icon-dot:nth-child(2) { animation-delay: 180ms; }
        .fm-widget:hover:not(.fm-animating) .fm-icon-dot:nth-child(3) { animation-delay: 360ms; }
        .fm-text-wrap {
          position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
          font-size: 14px; line-height: 1.4; white-space: nowrap;
          opacity: 0; pointer-events: none; z-index: 3;
        }
        .fm-light .fm-text-wrap { color: #1a1a1a; }
        .fm-dark .fm-text-wrap  { color: #f0f0f0; }
        .fm-text-wrap .fm-word { display: inline-block; opacity: 0; }
        .fm-divider {
          position: absolute; right: 57px; top: 50%; transform: translateY(-50%);
          width: 1px; height: 24px; opacity: 0; z-index: 3;
        }
        .fm-light .fm-divider { background: rgba(5,150,105,0.2); }
        .fm-dark .fm-divider  { background: rgba(52,211,153,0.2); }

        /* ═══════════════════════════════════════
           LIQUID BLOOM — Gooey filter variant
           ═══════════════════════════════════════ */
        .lb-wrap {
          filter: url(#gooey);
          position: relative;
          width: 300px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lb-blob {
          position: absolute;
          width: 56px; height: 56px;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .lb-light .lb-blob { background: #059669; }
        .lb-dark .lb-blob  { background: #34D399; }
        .lb-blob svg { width: 22px; height: 23px; }
        .lb-light .lb-blob svg path { stroke: #fff; stroke-width: 2.5; }
        .lb-dark .lb-blob svg path  { stroke: #18181b; stroke-width: 2.5; }
        .lb-text {
          position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
          font-size: 14px; line-height: 1.4; white-space: nowrap;
          opacity: 0; pointer-events: none; z-index: 2;
        }
        .lb-light .lb-text { color: #fff; }
        .lb-dark .lb-text  { color: #18181b; }
        .lb-char { display: inline-block; opacity: 0; }

        /* ═══════════════════════════════════════
           TERMINAL BOOT — CRT/hacker variant
           ═══════════════════════════════════════ */
        .tb-widget {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          outline: none; background: none; border: none; padding: 0;
        }
        .tb-widget:active:not(.tb-animating) .tb-box {
          transform: scale(0.93); transition-duration: 100ms;
        }
        .tb-box {
          width: 56px; height: 56px; border-radius: 16px;
          border: 1.5px solid; position: relative;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; transition: border-color 300ms ease;
          transform-origin: right center;
        }
        .tb-light .tb-box { border-color: #059669; background: transparent; }
        .tb-dark .tb-box  { border-color: #34D399; background: transparent; }
        .tb-glow {
          position: absolute; inset: -2px; border-radius: 18px;
          opacity: 0.35; transition: opacity 400ms ease; pointer-events: none;
        }
        .tb-light .tb-glow { box-shadow: 0 0 16px rgba(5,150,105,0.12); }
        .tb-dark .tb-glow  { box-shadow: 0 0 16px rgba(52,211,153,0.15); }
        .tb-widget:hover .tb-glow { opacity: 1; }
        .tb-svg {
          width: 26px; height: 27px; position: relative; z-index: 1; margin-top: 4px;
        }
        .tb-light .tb-svg-path { stroke: #059669; stroke-width: 2.3; }
        .tb-dark .tb-svg-path  { stroke: #34D399; stroke-width: 2.3; }
        .tb-dots {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          display: flex; align-items: center; gap: 3.5px; z-index: 2;
        }
        .tb-dot {
          display: block; width: 3.5px; height: 3.5px; border-radius: 50%;
          opacity: 0; transform: translateY(4px) scale(0.4);
          transition: opacity 300ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .tb-light .tb-dot { background: #059669; }
        .tb-dark .tb-dot  { background: #34D399; }
        .tb-widget:hover:not(.tb-animating) .tb-dot {
          opacity: 1; transform: translateY(0) scale(1);
          animation: fw-wave 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .tb-widget:hover:not(.tb-animating) .tb-dot:nth-child(1) { animation-delay: 0ms; }
        .tb-widget:hover:not(.tb-animating) .tb-dot:nth-child(2) { animation-delay: 180ms; }
        .tb-widget:hover:not(.tb-animating) .tb-dot:nth-child(3) { animation-delay: 360ms; }
        /* Scanlines overlay */
        .tb-scanlines {
          position: absolute; inset: 0; opacity: 0; pointer-events: none; z-index: 5;
        }
        .tb-dark .tb-scanlines {
          background: repeating-linear-gradient(
            to bottom, transparent 0px, transparent 2px,
            rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px
          );
        }
        .tb-light .tb-scanlines {
          background: repeating-linear-gradient(
            to bottom, transparent 0px, transparent 2px,
            rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px
          );
        }
        /* Cursor blink */
        .tb-cursor {
          display: inline-block; width: 2px; height: 14px;
          vertical-align: middle; margin-left: 1px;
        }
        .tb-light .tb-cursor { background: #059669; }
        .tb-dark .tb-cursor  { background: #34D399; }
        @keyframes tb-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .tb-cursor-blink { animation: tb-blink 530ms steps(1) infinite; }
        /* Terminal text container */
        .tb-text-area {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          font-size: 13px; line-height: 1.4; white-space: nowrap;
          opacity: 0; pointer-events: none; z-index: 4;
        }
        .tb-light .tb-text-area { color: #059669; }
        .tb-dark .tb-text-area  { color: #34D399; }

        /* ═══════════════════════════════════════
           ORIGAMI UNFOLD — 3D perspective variant
           ═══════════════════════════════════════ */
        .ou-container {
          perspective: 800px;
        }
        .ou-widget {
          cursor: pointer; -webkit-tap-highlight-color: transparent;
          outline: none; background: none; border: none; padding: 0;
        }
        .ou-widget:active:not(.ou-animating) .ou-box {
          transform: scale(0.93); transition-duration: 100ms;
        }
        .ou-box {
          width: 56px; height: 56px; border-radius: 16px;
          border: 1.5px solid; position: relative;
          display: flex; align-items: center; justify-content: center;
          transform-style: preserve-3d;
          transition: border-color 300ms ease;
          transform-origin: right center;
        }
        .ou-light .ou-box { border-color: #059669; background: transparent; }
        .ou-dark .ou-box  { border-color: #34D399; background: transparent; }
        .ou-light .ou-box.ou-has-bg { background: rgba(255,255,255,0.98); }
        .ou-dark .ou-box.ou-has-bg  { background: rgba(24,24,27,0.98); }
        .ou-glow {
          position: absolute; inset: -2px; border-radius: 18px;
          opacity: 0.35; transition: opacity 400ms ease; pointer-events: none;
        }
        .ou-light .ou-glow { box-shadow: 0 0 16px rgba(5,150,105,0.12); }
        .ou-dark .ou-glow  { box-shadow: 0 0 16px rgba(52,211,153,0.15); }
        .ou-widget:hover .ou-glow { opacity: 1; }
        .ou-svg {
          width: 26px; height: 27px; position: relative; z-index: 1; margin-top: 4px;
        }
        .ou-light .ou-svg-path { stroke: #059669; stroke-width: 2.3; }
        .ou-dark .ou-svg-path  { stroke: #34D399; stroke-width: 2.3; }
        .ou-dots {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          display: flex; align-items: center; gap: 3.5px; z-index: 2;
        }
        .ou-dot {
          display: block; width: 3.5px; height: 3.5px; border-radius: 50%;
          opacity: 0; transform: translateY(4px) scale(0.4);
          transition: opacity 300ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .ou-light .ou-dot { background: #059669; }
        .ou-dark .ou-dot  { background: #34D399; }
        .ou-widget:hover:not(.ou-animating) .ou-dot {
          opacity: 1; transform: translateY(0) scale(1);
          animation: fw-wave 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .ou-widget:hover:not(.ou-animating) .ou-dot:nth-child(1) { animation-delay: 0ms; }
        .ou-widget:hover:not(.ou-animating) .ou-dot:nth-child(2) { animation-delay: 180ms; }
        .ou-widget:hover:not(.ou-animating) .ou-dot:nth-child(3) { animation-delay: 360ms; }
        .ou-text-wrap {
          position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
          font-size: 14px; line-height: 1.4; white-space: nowrap;
          opacity: 0; pointer-events: none; z-index: 3;
          backface-visibility: hidden;
        }
        .ou-light .ou-text-wrap { color: #1a1a1a; }
        .ou-dark .ou-text-wrap  { color: #f0f0f0; }
        .ou-text-wrap .ou-word { display: inline-block; opacity: 0; }
      `}</style>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════
   Variant A: Smart Widget — Bubble Notification (archived)
   ═══════════════════════════════════════════════════════ */

function SmartWidget({ isDark }: { isDark: boolean }) {
  const [widgetState, setWidgetState] = useState<WidgetState>('idle')
  const clickCountRef = useRef(0)
  const triggerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {}, containerRef)
    return () => ctx.revert()
  }, [])

  const showNotification = useCallback(() => {
    if (!notificationRef.current) return
    setWidgetState('notification')
    gsap.set(notificationRef.current, { visibility: 'visible' })
    gsap.fromTo(notificationRef.current,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
    )
  }, [])

  const dismissNotification = useCallback(() => {
    if (!notificationRef.current || widgetState !== 'notification') return
    gsap.to(notificationRef.current, {
      opacity: 0, y: 10, scale: 0.95, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        gsap.set(notificationRef.current, { visibility: 'hidden' })
        setWidgetState('idle')
      },
    })
  }, [widgetState])

  const handleButtonClick = useCallback(() => {
    if (widgetState === 'notification') { dismissNotification(); return }
    if (widgetState === 'idle') {
      clickCountRef.current += 1
      if (clickCountRef.current >= 3) {
        clickCountRef.current = 0
        if (triggerTimerRef.current) clearTimeout(triggerTimerRef.current)
        triggerTimerRef.current = setTimeout(() => showNotification(), 2000)
      }
    }
  }, [widgetState, showNotification, dismissNotification])

  useEffect(() => {
    return () => { if (triggerTimerRef.current) clearTimeout(triggerTimerRef.current) }
  }, [])

  const themeClass = isDark ? 'fw-dark' : 'fw-light'
  const isNotifActive = widgetState === 'notification'

  return (
    <div ref={containerRef} className="relative">
      <div ref={notificationRef} className={`fw-notification ${themeClass}`}>
        <div className="fw-notif-pointer" />
        <button className="fw-notif-close" onClick={(e) => { e.stopPropagation(); dismissNotification() }} aria-label="Закрыть">✕</button>
        <span>Привет! Чем могу помочь?</span>
      </div>
      <button className={`fw-widget-btn ${themeClass} ${isNotifActive ? 'fw-notif-active' : ''}`} onClick={handleButtonClick} aria-label="Открыть чат">
        <div className="fw-box">
          <div className="fw-glow" />
          <svg className="fw-svg" viewBox="0 0 40 38" fill="none">
            <path className="fw-path" d={BUBBLE_PATH} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div className="fw-dots">
            <span className="fw-dot" /><span className="fw-dot" /><span className="fw-dot" />
          </div>
        </div>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Old Morph Variant — unified component (archived)
   ═══════════════════════════════════════════════════════ */

function OldMorphVariant({ isDark, variant }: { isDark: boolean; variant: 'clean' | 'breathe' | 'morph' }) {
  const [morphState, setMorphState] = useState<MorphState>('idle')
  const clickCountRef = useRef(0)
  const triggerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoCollapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cooldownRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const textWrapRef = useRef<HTMLSpanElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const splitRef = useRef<SplitText | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {}, containerRef)
    return () => ctx.revert()
  }, [])

  const expand = useCallback(() => {
    if (!boxRef.current || !textWrapRef.current || !dividerRef.current ||
        !svgRef.current || !dotsRef.current || !buttonRef.current) return
    if (morphState !== 'idle') return
    setMorphState('animating')
    buttonRef.current.classList.add('fm-animating')
    if (timelineRef.current) timelineRef.current.kill()
    const tl = gsap.timeline({
      onComplete: () => {
        setMorphState('expanded')
        autoCollapseTimerRef.current = setTimeout(() => collapse(), MORPH_AUTO_COLLAPSE_DELAY)
      }
    })
    timelineRef.current = tl
    const dots = dotsRef.current.querySelectorAll('.fm-icon-dot')
    const glowEl = boxRef.current.querySelector('.fm-glow')

    // All variants share: dots out → morph → text
    tl.to(dots, { opacity: 0, scale: 0.3, duration: 0.18, stagger: 0.03, ease: 'power2.in' })
    tl.set(dotsRef.current, { opacity: 0 })
    tl.to(svgRef.current, { scale: 0.75, opacity: 0.4, duration: 0.18, ease: 'power2.in' }, '-=0.15')
    tl.call(() => { boxRef.current!.classList.add('fm-has-bg') })
    tl.to(boxRef.current, { width: MORPH_EXPANDED_WIDTH, duration: 0.4, ease: 'power3.out' })
    tl.to(svgRef.current, { x: (MORPH_EXPANDED_WIDTH - 56) / 2, scale: 0.85, opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.3')
    if (glowEl) tl.to(glowEl, { borderRadius: 18, duration: 0.4, ease: 'power2.out' }, '-=0.4')
    tl.to(dividerRef.current, { opacity: 1, duration: 0.15, ease: 'power2.out' }, '-=0.1')
    tl.set(textWrapRef.current, { opacity: 1, pointerEvents: 'auto' })
    tl.call(() => {
      if (splitRef.current) splitRef.current.revert()
      splitRef.current = new SplitText(textWrapRef.current!, { type: 'words', wordsClass: 'fm-word' })
      gsap.set(splitRef.current.words, { opacity: 0 })
    })
    tl.call(() => {
      if (splitRef.current) gsap.to(splitRef.current.words, { opacity: 1, duration: 0.2, stagger: 0.04, ease: 'power2.out' })
    })
    tl.to({}, { duration: 0.35 })
  }, [morphState])

  const collapse = useCallback(() => {
    if (!boxRef.current || !textWrapRef.current || !dividerRef.current ||
        !svgRef.current || !dotsRef.current || !buttonRef.current) return
    if (autoCollapseTimerRef.current) { clearTimeout(autoCollapseTimerRef.current); autoCollapseTimerRef.current = null }
    setMorphState('collapsing')
    if (timelineRef.current) timelineRef.current.kill()
    const glowEl = boxRef.current.querySelector('.fm-glow')
    const tl = gsap.timeline({
      onComplete: () => {
        boxRef.current?.classList.remove('fm-has-bg')
        buttonRef.current?.classList.remove('fm-animating')
        setMorphState('idle')
        cooldownRef.current = true
        setTimeout(() => { cooldownRef.current = false }, 3000)
      }
    })
    timelineRef.current = tl
    const dots = dotsRef.current.querySelectorAll('.fm-icon-dot')
    tl.to(textWrapRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.2, ease: 'power2.in',
      onComplete: () => { if (splitRef.current) { splitRef.current.revert(); splitRef.current = null } }
    })
    tl.to(dividerRef.current, { opacity: 0, duration: 0.12, ease: 'power2.in' }, '-=0.08')
    tl.to(svgRef.current, { x: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
    tl.to(boxRef.current, { width: 56, duration: 0.35, ease: 'power3.inOut' }, '-=0.2')
    if (glowEl) tl.to(glowEl, { borderRadius: 18, duration: 0.35, ease: 'power2.inOut' }, '-=0.35')
    tl.set(dotsRef.current, { opacity: 1 })
    tl.set(dots, { opacity: 0, y: 4, scale: 0.4 })
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
      if (splitRef.current) splitRef.current.revert()
    }
  }, [])

  const themeClass = isDark ? 'fm-dark' : 'fm-light'

  return (
    <div ref={containerRef}>
      <button ref={buttonRef} className={`fm-widget ${themeClass}`} onClick={handleClick} aria-label="Открыть чат">
        <div ref={boxRef} className="fm-box">
          <div className="fm-glow" />
          <svg ref={svgRef} className="fm-svg" viewBox="0 0 40 38" fill="none">
            <path className="fm-svg-path" d={BUBBLE_PATH} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div ref={dotsRef} className="fm-dots">
            <span className="fm-icon-dot" /><span className="fm-icon-dot" /><span className="fm-icon-dot" />
          </div>
          <span ref={textWrapRef} className="fm-text-wrap">{MORPH_MESSAGE}</span>
          <div ref={dividerRef} className="fm-divider" />
        </div>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   NEW VARIANT 1: Liquid Bloom
   ──────────────────────────────────────────────────────
   SVG gooey filter → кнопка = залитый круг (не outline).
   При раскрытии круг РАСТЕКАЕТСЯ вправо как капля,
   формируя капсулу. Иконка растворяется в потоке.
   Текст появляется побуквенно с back.out ease.
   Нет иконки в раскрытом состоянии — только текст.
   ~900ms total.
   ═══════════════════════════════════════════════════════ */

function LiquidBloomWidget({ isDark }: { isDark: boolean }) {
  const [morphState, setMorphState] = useState<MorphState>('idle')
  const clickCountRef = useRef(0)
  const triggerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoCollapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cooldownRef = useRef(false)

  const wrapRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {}, wrapRef)
    return () => ctx.revert()
  }, [])

  const expand = useCallback(() => {
    if (!blobRef.current || !textRef.current || !wrapRef.current) return
    if (morphState !== 'idle') return
    setMorphState('animating')
    if (timelineRef.current) timelineRef.current.kill()

    const tl = gsap.timeline({
      onComplete: () => {
        setMorphState('expanded')
        autoCollapseTimerRef.current = setTimeout(() => collapse(), MORPH_AUTO_COLLAPSE_DELAY)
      }
    })
    timelineRef.current = tl

    /*
      Liquid Bloom sequence:
      1. Blob pulses slightly (120ms)
      2. Blob stretches into full-width capsule (350ms, power3.inOut — viscous)
         Icon inside scales down and fades during stretch
      3. Text chars appear with staggered back.out (each char pops in)
    */

    const iconEl = blobRef.current.querySelector('svg')

    // 1. Pulse
    tl.to(blobRef.current, { scale: 1.08, duration: 0.12, ease: 'power2.out' })
    tl.to(blobRef.current, { scale: 1, duration: 0.1, ease: 'power2.in' })

    // 2. Icon fades + blob stretches to full width
    if (iconEl) {
      tl.to(iconEl, { scale: 0.4, opacity: 0, duration: 0.2, ease: 'power2.in' })
    }
    tl.to(blobRef.current, {
      width: MORPH_EXPANDED_WIDTH, borderRadius: 28,
      duration: 0.35, ease: 'power3.inOut',
    }, '-=0.15')

    // 3. Chars appear — create spans if not already
    tl.set(textRef.current, { opacity: 1, pointerEvents: 'auto' })
    tl.call(() => {
      const el = textRef.current!
      // Split into individual characters
      const text = MORPH_MESSAGE
      el.innerHTML = text.split('').map(ch =>
        ch === ' ' ? ' ' : `<span class="lb-char">${ch}</span>`
      ).join('')
    })
    tl.call(() => {
      const chars = textRef.current!.querySelectorAll('.lb-char')
      gsap.fromTo(chars,
        { opacity: 0, y: 8, scale: 0.6 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, stagger: 0.025, ease: 'back.out(1.7)' }
      )
    })
    tl.to({}, { duration: 0.25 + 0.025 * MORPH_MESSAGE.replace(/ /g, '').length })
  }, [morphState])

  const collapse = useCallback(() => {
    if (!blobRef.current || !textRef.current) return
    if (autoCollapseTimerRef.current) { clearTimeout(autoCollapseTimerRef.current); autoCollapseTimerRef.current = null }
    setMorphState('collapsing')
    if (timelineRef.current) timelineRef.current.kill()

    const iconEl = blobRef.current.querySelector('svg')

    const tl = gsap.timeline({
      onComplete: () => {
        setMorphState('idle')
        textRef.current!.innerHTML = MORPH_MESSAGE
        cooldownRef.current = true
        setTimeout(() => { cooldownRef.current = false }, 3000)
      }
    })
    timelineRef.current = tl

    // Reverse: text out → blob shrinks → icon back
    tl.to(textRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.2, ease: 'power2.in' })
    tl.to(blobRef.current, {
      width: 56, borderRadius: '50%',
      duration: 0.35, ease: 'power3.inOut',
    })
    if (iconEl) {
      tl.to(iconEl, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.5)' }, '-=0.15')
    }
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
    }
  }, [])

  const themeClass = isDark ? 'lb-dark' : 'lb-light'

  return (
    <div ref={wrapRef} className={`lb-wrap ${themeClass}`} onClick={handleClick}>
      <div ref={blobRef} className="lb-blob">
        <svg viewBox="0 0 40 38" fill="none">
          <path d={BUBBLE_PATH} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <span ref={textRef} className="lb-text">{MORPH_MESSAGE}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   NEW VARIANT 2: Terminal Boot
   ──────────────────────────────────────────────────────
   Кнопка = обычная (outline). При раскрытии:
   1. Глитч-вспышка (3 мерцания, steps(1))
   2. Фон меняется на тёмный терминал
   3. Форма расширяется ступенчато (steps(8))
   4. Текст набирается посимвольно МОНОШИРИННЫМ шрифтом + курсор
   5. Финальная "нормализация" — возврат к бренд-стилю
   ~1.5s total. Абсолютно уникальный ритм.
   ═══════════════════════════════════════════════════════ */

function TerminalBootWidget({ isDark }: { isDark: boolean }) {
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
    buttonRef.current.classList.add('tb-animating')
    if (timelineRef.current) timelineRef.current.kill()

    const tl = gsap.timeline({
      onComplete: () => {
        setMorphState('expanded')
        autoCollapseTimerRef.current = setTimeout(() => collapse(), MORPH_AUTO_COLLAPSE_DELAY)
      }
    })
    timelineRef.current = tl

    const dots = dotsRef.current.querySelectorAll('.tb-dot')

    /*
      Terminal Boot sequence (expands LEFT via transform-origin: right center):
      0. DOTS: gentle wave pulse, then smooth fade out
      1. BG + scanlines appear
      2. Stepped width expand LEFT (400ms, steps(8))
      3. Typewriter — char by char monowidth + cursor
    */

    // 0. Force dots visible
    tl.set(dots, { opacity: 1, y: 0, scale: 1 })

    // Gentle wave — dots softly pulse up one by one (like a calm "thinking" indicator)
    tl.to(dots[0], { y: -3, scale: 1.3, duration: 0.15, ease: 'sine.inOut', yoyo: true, repeat: 1 })
    tl.to(dots[1], { y: -3, scale: 1.3, duration: 0.15, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '-=0.25')
    tl.to(dots[2], { y: -3, scale: 1.3, duration: 0.15, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '-=0.25')

    // Smooth fade out — dots gently shrink and disappear together
    tl.to(dots, {
      scale: 0.5, opacity: 0,
      duration: 0.25, ease: 'power2.inOut', stagger: 0.04,
    })

    // 1. BG fades in smoothly, SVG fades out
    tl.set(dotsRef.current, { opacity: 0 })
    tl.to(svgRef.current, { opacity: 0, scale: 0.85, duration: 0.2, ease: 'power2.inOut' })
    tl.to(boxRef.current, {
      backgroundColor: isDark ? 'rgba(24,24,27,0.98)' : 'rgba(255,255,255,0.98)',
      borderColor: isDark ? '#34D399' : '#059669',
      duration: 0.2, ease: 'power2.inOut',
    }, '-=0.15')
    tl.to(scanlineRef.current, { opacity: 1, duration: 0.15, ease: 'power1.out' }, '-=0.1')

    // 2. Width expand LEFT — smooth with slight overshoot
    tl.to(boxRef.current, {
      width: MORPH_EXPANDED_WIDTH,
      borderRadius: 16,
      duration: 0.5,
      ease: 'power3.out',
    })

    // 4. Show text area + typewriter
    tl.set(textAreaRef.current, { opacity: 1, pointerEvents: 'auto' })
    tl.set(cursorRef.current, { opacity: 1 })
    tl.call(() => { cursorRef.current!.classList.add('tb-cursor-blink') })
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

  }, [morphState, isDark])

  const collapse = useCallback(() => {
    if (!boxRef.current || !svgRef.current || !dotsRef.current ||
        !buttonRef.current || !textAreaRef.current || !scanlineRef.current || !cursorRef.current) return
    if (autoCollapseTimerRef.current) { clearTimeout(autoCollapseTimerRef.current); autoCollapseTimerRef.current = null }
    if (typingTimerRef.current) { clearTimeout(typingTimerRef.current); typingTimerRef.current = null }
    setMorphState('collapsing')
    if (timelineRef.current) timelineRef.current.kill()

    const tl = gsap.timeline({
      onComplete: () => {
        buttonRef.current?.classList.remove('tb-animating')
        setMorphState('idle')
        cooldownRef.current = true
        setTimeout(() => { cooldownRef.current = false }, 3000)
      }
    })
    timelineRef.current = tl

    const dots = dotsRef.current.querySelectorAll('.tb-dot')

    // Text + cursor fade smoothly
    cursorRef.current.classList.remove('tb-cursor-blink')
    tl.to(textAreaRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.2, ease: 'power2.inOut' })
    tl.set(cursorRef.current, { opacity: 0 })
    tl.to(scanlineRef.current, { opacity: 0, duration: 0.15, ease: 'power1.in' }, '-=0.1')

    // Shape shrinks back smoothly + BG fades out together
    tl.to(boxRef.current, {
      width: 56, borderRadius: 16,
      backgroundColor: 'transparent',
      duration: 0.45, ease: 'power3.inOut',
    })
    tl.to(boxRef.current, {
      borderColor: isDark ? '#34D399' : '#059669',
      duration: 0.2, ease: 'power2.out',
    }, '-=0.2')

    // SVG + dots restore gently
    tl.to(svgRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }, '-=0.15')
    tl.set(dotsRef.current, { opacity: 1 })
    // Clear ALL inline styles from dots so CSS :hover transitions work again
    tl.call(() => {
      dots.forEach((dot) => gsap.set(dot, { clearProps: 'all' }))
    })

    // Reset text content
    tl.call(() => { textAreaRef.current!.textContent = '' })
  }, [isDark])

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

  const themeClass = isDark ? 'tb-dark' : 'tb-light'

  return (
    <div ref={containerRef}>
      <button ref={buttonRef} className={`tb-widget ${themeClass}`} onClick={handleClick} aria-label="Открыть чат">
        <div ref={boxRef} className="tb-box">
          <div className="tb-glow" />
          <div ref={scanlineRef} className="tb-scanlines" />
          <svg ref={svgRef} className="tb-svg" viewBox="0 0 40 38" fill="none">
            <path className="tb-svg-path" d={BUBBLE_PATH} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div ref={dotsRef} className="tb-dots">
            <span className="tb-dot" /><span className="tb-dot" /><span className="tb-dot" />
          </div>
          <span ref={textAreaRef} className="tb-text-area">
            <span ref={cursorRef} className="tb-cursor" style={{ opacity: 0 }} />
          </span>
        </div>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   NEW VARIANT 3: Origami Unfold
   ──────────────────────────────────────────────────────
   Кнопка = обычная (outline). При раскрытии:
   1. Кнопка "поворачивается" по Y-оси на 90° (исчезает)
   2. На её месте появляется развёрнутая капсула —
      "разворачивается" обратно из 90° в 0° (rotateY)
   3. Текст появляется по словам с X-сдвигом (slide-in)
   Суть: 3D flip/unfold. Выглядит как раскладка оригами.
   Иконки в развёрнутом виде нет.
   ~1.1s total.
   ═══════════════════════════════════════════════════════ */

function OrigamiUnfoldWidget({ isDark }: { isDark: boolean }) {
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
  const textWrapRef = useRef<HTMLSpanElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const splitRef = useRef<SplitText | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {}, containerRef)
    return () => ctx.revert()
  }, [])

  const expand = useCallback(() => {
    if (!boxRef.current || !svgRef.current || !dotsRef.current ||
        !buttonRef.current || !textWrapRef.current) return
    if (morphState !== 'idle') return
    setMorphState('animating')
    buttonRef.current.classList.add('ou-animating')
    if (timelineRef.current) timelineRef.current.kill()

    const tl = gsap.timeline({
      onComplete: () => {
        setMorphState('expanded')
        autoCollapseTimerRef.current = setTimeout(() => collapse(), MORPH_AUTO_COLLAPSE_DELAY)
      }
    })
    timelineRef.current = tl

    const dots = dotsRef.current.querySelectorAll('.ou-dot')
    const glowEl = boxRef.current.querySelector('.ou-glow')

    /*
      Origami Unfold (expands LEFT via transform-origin: right center):
      0. DOTS SHOW: force visible, then "origami fold" — dots converge into center point (300ms)
      1. At convergence: scale the merged point up then flatten — like paper being pressed (150ms)
      2. Fold away: rotateY 0° → 90° (250ms)
      3. At 90°: snap width, add BG, hide icon
      4. Unfold: rotateY 90° → 0° (350ms)
      5. Text words slide in from right
    */

    // 0. Force dots visible
    tl.set(dots, { opacity: 1, y: 0, scale: 1 })

    // Dots "origami fold" — converge to center (left dot moves right, right dot moves left, center stays)
    tl.to(dots[0], { x: 7, scale: 0.8, duration: 0.2, ease: 'power2.inOut' })
    tl.to(dots[2], { x: -7, scale: 0.8, duration: 0.2, ease: 'power2.inOut' }, '-=0.2')
    tl.to(dots[1], { scale: 1.3, duration: 0.12, ease: 'power2.out' }, '-=0.08')
    // All three merge — snap to center dot position
    tl.to(dots[0], { x: 0, opacity: 0, scale: 0, duration: 0.1, ease: 'power3.in' })
    tl.to(dots[2], { x: 0, opacity: 0, scale: 0, duration: 0.1, ease: 'power3.in' }, '-=0.1')

    // 1. Merged center dot "presses flat" (like paper fold crease)
    tl.to(dots[1], { scaleX: 3, scaleY: 0.3, opacity: 0.7, duration: 0.1, ease: 'power2.in' })
    tl.to(dots[1], { scale: 0, opacity: 0, duration: 0.08, ease: 'power2.in' })

    // SVG fades in parallel
    tl.to(svgRef.current, { opacity: 0, duration: 0.15, ease: 'power2.in' }, '-=0.18')
    if (glowEl) tl.to(glowEl, { opacity: 0, duration: 0.15 }, '-=0.15')

    // 2. Fold away: rotate Y to 90°
    tl.to(boxRef.current, {
      rotateY: -90,
      duration: 0.25, ease: 'power2.in',
    })

    // 3. At 90° — invisible — change dimensions
    tl.set(boxRef.current, { width: MORPH_EXPANDED_WIDTH, borderRadius: 16 })
    tl.call(() => { boxRef.current!.classList.add('ou-has-bg') })
    tl.set(svgRef.current, { display: 'none' })
    tl.set(dotsRef.current, { display: 'none' })

    // 4. Unfold LEFT: rotate back from -90° to 0°
    tl.to(boxRef.current, {
      rotateY: 0,
      duration: 0.35, ease: 'power2.out',
    })
    if (glowEl) tl.to(glowEl, { opacity: 0.35, duration: 0.2 }, '-=0.15')

    // 5. Text words slide in from right
    tl.set(textWrapRef.current, { opacity: 1, pointerEvents: 'auto' })
    tl.call(() => {
      if (splitRef.current) splitRef.current.revert()
      splitRef.current = new SplitText(textWrapRef.current!, { type: 'words', wordsClass: 'ou-word' })
      gsap.set(splitRef.current.words, { opacity: 0, x: 20 })
    })
    tl.call(() => {
      if (splitRef.current) {
        gsap.to(splitRef.current.words, {
          opacity: 1, x: 0,
          duration: 0.3, stagger: 0.06, ease: 'power3.out',
        })
      }
    })
    tl.to({}, { duration: 0.3 + 0.06 * 4 })

  }, [morphState])

  const collapse = useCallback(() => {
    if (!boxRef.current || !svgRef.current || !dotsRef.current ||
        !buttonRef.current || !textWrapRef.current) return
    if (autoCollapseTimerRef.current) { clearTimeout(autoCollapseTimerRef.current); autoCollapseTimerRef.current = null }
    setMorphState('collapsing')
    if (timelineRef.current) timelineRef.current.kill()

    const glowEl = boxRef.current.querySelector('.ou-glow')

    const tl = gsap.timeline({
      onComplete: () => {
        boxRef.current?.classList.remove('ou-has-bg')
        buttonRef.current?.classList.remove('ou-animating')
        setMorphState('idle')
        cooldownRef.current = true
        setTimeout(() => { cooldownRef.current = false }, 3000)
      }
    })
    timelineRef.current = tl

    const dots = dotsRef.current.querySelectorAll('.ou-dot')

    // Reverse: text out → fold away LEFT → snap back → unfold
    tl.to(textWrapRef.current, {
      opacity: 0, x: -20, pointerEvents: 'none', duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        if (splitRef.current) { splitRef.current.revert(); splitRef.current = null }
        gsap.set(textWrapRef.current!, { x: 0 })
      }
    })
    if (glowEl) tl.to(glowEl, { opacity: 0, duration: 0.1 })

    // Fold capsule away (left rotation)
    tl.to(boxRef.current, {
      rotateY: -90,
      duration: 0.25, ease: 'power2.in',
    })

    // Snap back to button dimensions
    tl.set(boxRef.current, { width: 56, borderRadius: 16 })
    tl.call(() => { boxRef.current!.classList.remove('ou-has-bg') })
    tl.set(svgRef.current, { display: '', opacity: 1 })
    tl.set(dotsRef.current, { display: '', opacity: 1 })
    // Reset dots — CSS controls hover appearance
    tl.set(dots, { opacity: 0, y: 4, scale: 0.4, x: 0, scaleX: 1, scaleY: 1 })

    // Unfold back to button
    tl.to(boxRef.current, {
      rotateY: 0,
      duration: 0.3, ease: 'back.out(1.2)',
    })
    if (glowEl) tl.to(glowEl, { opacity: 0.35, duration: 0.2 }, '-=0.15')
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
      if (splitRef.current) splitRef.current.revert()
    }
  }, [])

  const themeClass = isDark ? 'ou-dark' : 'ou-light'

  return (
    <div ref={containerRef} className="ou-container">
      <button ref={buttonRef} className={`ou-widget ${themeClass}`} onClick={handleClick} aria-label="Открыть чат">
        <div ref={boxRef} className="ou-box">
          <div className="ou-glow" />
          <svg ref={svgRef} className="ou-svg" viewBox="0 0 40 38" fill="none">
            <path className="ou-svg-path" d={BUBBLE_PATH} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div ref={dotsRef} className="ou-dots">
            <span className="ou-dot" /><span className="ou-dot" /><span className="ou-dot" />
          </div>
          <span ref={textWrapRef} className="ou-text-wrap">{MORPH_MESSAGE}</span>
        </div>
      </button>
    </div>
  )
}
