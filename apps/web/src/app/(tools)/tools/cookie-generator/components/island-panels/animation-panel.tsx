'use client'

import { Play } from 'lucide-react'

/* ── Animation Types ── */
export type AnimId = 'slide' | 'fade' | 'bounce' | 'scale' | 'none'
export type TriggerId = 'time' | 'scroll'
export type BackdropOption = 'Выкл' | 'Лёгкое' | 'Сильное'

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

const TRIGGERS: { id: TriggerId; label: string }[] = [
  { id: 'time', label: 'По времени' },
  { id: 'scroll', label: 'По прокрутке' },
]

const BACKDROPS: BackdropOption[] = ['Выкл', 'Лёгкое', 'Сильное']

export interface AnimationState {
  anim: AnimId
  trigger: TriggerId
  delay: number
  scrollPx: number
  backdrop: BackdropOption
  speed: number
}

interface AnimationPanelProps {
  value: AnimationState
  onChange: (next: AnimationState) => void
}

export function AnimationPanel({ value, onChange }: AnimationPanelProps) {
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
                  onClick={() => onChange({ ...value, anim: a.id })}
                  className={`island-segment ${value.anim === a.id ? 'island-segment-active' : ''}`}
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
              onClick={() => onChange({ ...value, trigger: t.id })}
              className={`island-segment ${value.trigger === t.id ? 'island-segment-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Conditional slider — smooth reveal */}
        <div className={`island-trigger-expand ${value.trigger === 'time' ? 'island-trigger-expand-time' : 'island-trigger-expand-scroll'}`}>
          <div className="island-trigger-expand-inner">
            {value.trigger === 'time' ? (
              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <label className="island-label mb-0">Задержка</label>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{value.delay}с</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={value.delay}
                  onChange={(e) => onChange({ ...value, delay: Number(e.target.value) })}
                  className="island-slider mt-1.5 w-full"
                />
              </div>
            ) : (
              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <label className="island-label mb-0">Прокрутка</label>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{value.scrollPx}px</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={value.scrollPx}
                  onChange={(e) => onChange({ ...value, scrollPx: Number(e.target.value) })}
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
              onClick={() => onChange({ ...value, backdrop: b })}
              className={`island-segment ${value.backdrop === b ? 'island-segment-active' : ''}`}
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
          <span className="text-[11px] tabular-nums text-muted-foreground">{value.speed}с</span>
        </div>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.1}
          value={value.speed}
          onChange={(e) => onChange({ ...value, speed: Number(e.target.value) })}
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
