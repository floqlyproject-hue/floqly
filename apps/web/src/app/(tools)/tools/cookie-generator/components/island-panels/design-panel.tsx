'use client'

import { useState } from 'react'

const BG_COLORS = [
  { id: 'white', color: '#FFFFFF', label: 'Белый' },
  { id: 'dark', color: '#1A1A1A', label: 'Тёмный' },
  { id: 'gray', color: '#F5F5F5', label: 'Серый' },
  { id: 'blue', color: '#E8EEF5', label: 'Голубой' },
]

const BTN_COLORS = [
  { id: 'black', color: '#000000', label: 'Чёрный' },
  { id: 'blue', color: '#3B82F6', label: 'Синий' },
  { id: 'green', color: '#10B981', label: 'Зелёный' },
  { id: 'purple', color: '#8B5CF6', label: 'Фиолетовый' },
]

const STYLES = ['Светлый', 'Тёмный', 'Прозрачный'] as const

export function DesignPanel() {
  const [bgColor, setBgColor] = useState('white')
  const [btnColor, setBtnColor] = useState('black')
  const [style, setStyle] = useState<string>('Светлый')
  const [radius, setRadius] = useState(12)

  return (
    <div className="space-y-4">
      {/* Фон баннера */}
      <div>
        <label className="island-label">Фон баннера</label>
        <div className="flex gap-2">
          {BG_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={c.label}
              onClick={() => setBgColor(c.id)}
              className={`island-color-circle ${bgColor === c.id ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''}`}
              style={{ backgroundColor: c.color }}
            />
          ))}
        </div>
      </div>

      {/* Стиль */}
      <div>
        <label className="island-label">Стиль</label>
        <div className="island-segmented">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={`island-segment ${style === s ? 'island-segment-active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Скругление */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Скругление</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{radius}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={24}
          step={4}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="island-slider mt-1.5 w-full"
        />
      </div>

      {/* Цвет кнопок */}
      <div>
        <label className="island-label">Цвет кнопок</label>
        <div className="flex gap-2">
          {BTN_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={c.label}
              onClick={() => setBtnColor(c.id)}
              className={`island-color-circle ${btnColor === c.id ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''}`}
              style={{ backgroundColor: c.color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
