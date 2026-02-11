'use client'

import { useState } from 'react'

type Position = 'bottom' | 'top' | 'floating' | 'corner'

const POSITIONS: { id: Position; label: string }[] = [
  { id: 'top', label: 'Сверху' },
  { id: 'corner', label: 'В углу' },
  { id: 'bottom', label: 'Снизу' },
  { id: 'floating', label: 'Плавающий' },
]

const WIDTHS = ['Полная', 'Компакт'] as const

export function PositionPanel() {
  const [position, setPosition] = useState<Position>('bottom')
  const [width, setWidth] = useState<string>('Полная')
  const [padding, setPadding] = useState(16)

  return (
    <div className="space-y-4">
      {/* Расположение — Visual Picker 2×2 */}
      <div>
        <label className="island-label">Расположение</label>
        <div className="grid grid-cols-2 gap-1.5">
          {POSITIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPosition(p.id)}
              className={`island-position-cell ${position === p.id ? 'island-position-cell-active' : ''}`}
            >
              {/* Mini banner indicator */}
              <div
                className={`island-position-indicator ${
                  p.id === 'top'
                    ? 'left-1 right-1 top-1 h-1.5'
                    : p.id === 'bottom'
                      ? 'bottom-1 left-1 right-1 h-1.5'
                      : p.id === 'corner'
                        ? 'bottom-1 right-1 h-3 w-4'
                        : 'bottom-2 left-2 right-2 h-2 rounded-sm'
                }`}
              />
              <span className="relative z-10 text-[10px] font-medium">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ширина */}
      <div>
        <label className="island-label">Ширина</label>
        <div className="island-segmented">
          {WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWidth(w)}
              className={`island-segment ${width === w ? 'island-segment-active' : ''}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Отступы */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Отступы</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{padding}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={32}
          step={4}
          value={padding}
          onChange={(e) => setPadding(Number(e.target.value))}
          className="island-slider mt-1.5 w-full"
        />
      </div>
    </div>
  )
}
