'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

/* ── Animation Types ── */
type AnimId = 'slide' | 'fade' | 'bounce' | 'scale' | 'none'

const ANIM_ROWS: { id: AnimId; label: string }[][] = [
  [
    { id: 'slide', label: 'Слайд' },
    { id: 'fade', label: 'Затухание' },
    { id: 'bounce', label: 'Отскок' },
  ],
  [
    { id: 'scale', label: 'Масштаб' },
    { id: 'none', label: 'Без' },
  ],
]

/* ── Trigger Types ── */
type TriggerId = 'time' | 'scroll'

const TRIGGERS: { id: TriggerId; label: string }[] = [
  { id: 'time', label: 'По времени' },
  { id: 'scroll', label: 'По прокрутке' },
]

/* ── Backdrop ── */
const BACKDROPS = ['Выкл', 'Лёгкое', 'Сильное'] as const

export function AnimationPanel() {
  const [anim, setAnim] = useState<AnimId>('slide')
  const [trigger, setTrigger] = useState<TriggerId>('time')
  const [delay, setDelay] = useState(2)
  const [scrollPx, setScrollPx] = useState(300)
  const [backdrop, setBackdrop] = useState<string>('Выкл')
  const [speed, setSpeed] = useState(0.3)

  return (
    <div className="space-y-3.5">
      {/* ── Тип появления — 2-row pills ── */}
      <div>
        <label className="island-label">Появление</label>
        <div className="flex flex-col gap-1">
          {ANIM_ROWS.map((row, i) => (
            <div key={i} className="island-segmented">
              {row.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAnim(a.id)}
                  className={`island-segment ${anim === a.id ? 'island-segment-active' : ''}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Триггер ── */}
      <div>
        <label className="island-label">Триггер</label>
        <div className="island-segmented">
          {TRIGGERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrigger(t.id)}
              className={`island-segment ${trigger === t.id ? 'island-segment-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Conditional slider — smooth reveal */}
        <div className={`island-trigger-expand ${trigger === 'time' ? 'island-trigger-expand-time' : 'island-trigger-expand-scroll'}`}>
          <div className="island-trigger-expand-inner">
            {trigger === 'time' ? (
              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <label className="island-label mb-0">Задержка</label>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{delay}с</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="island-slider mt-1.5 w-full"
                />
              </div>
            ) : (
              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <label className="island-label mb-0">Прокрутка</label>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{scrollPx}px</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={scrollPx}
                  onChange={(e) => setScrollPx(Number(e.target.value))}
                  className="island-slider mt-1.5 w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Затемнение фона ── */}
      <div>
        <label className="island-label">Затемнение</label>
        <div className="island-segmented">
          {BACKDROPS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBackdrop(b)}
              className={`island-segment ${backdrop === b ? 'island-segment-active' : ''}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* ── Скорость анимации ── */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Скорость</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{speed}с</span>
        </div>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.1}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="island-slider mt-1.5 w-full"
        />
      </div>

      {/* ── Предпросмотр ── */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/50 py-2 text-[12px] font-medium text-foreground/60 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
      >
        <Play className="size-3.5" strokeWidth={2} />
        Воспроизвести
      </button>
    </div>
  )
}
