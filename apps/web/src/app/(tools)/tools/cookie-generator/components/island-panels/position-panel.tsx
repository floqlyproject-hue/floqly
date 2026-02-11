'use client'

import { useState } from 'react'

const WIDTHS = ['Полная', 'Средняя', 'Компакт'] as const
const VERT = ['Сверху', 'Центр', 'Снизу'] as const
const HORIZ = ['Слева', 'Центр', 'Справа'] as const

export function PositionPanel() {
  const [width, setWidth] = useState<string>('Полная')
  const [vert, setVert] = useState<string>('Снизу')
  const [horiz, setHoriz] = useState<string>('Центр')
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  return (
    <div className="space-y-3.5">
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

      {/* Вертикаль */}
      <div>
        <label className="island-label">Вертикаль</label>
        <div className="island-segmented">
          {VERT.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVert(v)}
              className={`island-segment ${vert === v ? 'island-segment-active' : ''}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Горизонталь */}
      <div>
        <label className="island-label">Горизонталь</label>
        <div className="island-segmented">
          {HORIZ.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHoriz(h)}
              className={`island-segment ${horiz === h ? 'island-segment-active' : ''}`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Отступ X */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Отступ X</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{offsetX}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={48}
          step={4}
          value={offsetX}
          onChange={(e) => setOffsetX(Number(e.target.value))}
          className="island-slider mt-1.5 w-full"
        />
      </div>

      {/* Отступ Y */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Отступ Y</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{offsetY}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={48}
          step={4}
          value={offsetY}
          onChange={(e) => setOffsetY(Number(e.target.value))}
          className="island-slider mt-1.5 w-full"
        />
      </div>
    </div>
  )
}
