'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

const TYPES = ['Slide', 'Fade', 'Bounce'] as const

export function AnimationPanel() {
  const [type, setType] = useState<string>('Slide')
  const [delay, setDelay] = useState(1)
  const [speed, setSpeed] = useState(0.3)

  return (
    <div className="space-y-4">
      {/* Тип появления */}
      <div>
        <label className="island-label">Появление</label>
        <div className="island-segmented">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`island-segment ${type === t ? 'island-segment-active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Задержка */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Задержка</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{delay}с</span>
        </div>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="island-slider mt-1.5 w-full"
        />
      </div>

      {/* Скорость */}
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

      {/* Предпросмотр */}
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
