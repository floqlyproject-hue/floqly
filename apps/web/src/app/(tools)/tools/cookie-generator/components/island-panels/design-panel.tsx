'use client'

import { useRef, useState } from 'react'

/* ── Banner Style Presets ── */
type StyleId = 'classic' | 'glass' | 'neo' | 'minimal' | 'gradient' | 'outlined'

const BANNER_STYLES: { id: StyleId; label: string }[] = [
  { id: 'classic', label: 'Классика' },
  { id: 'glass', label: 'Стекло' },
  { id: 'neo', label: 'Нео' },
  { id: 'minimal', label: 'Минимал' },
  { id: 'gradient', label: 'Градиент' },
  { id: 'outlined', label: 'Контур' },
]

/* ── Preset Colors ── */
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

const SHADOWS = ['Нет', 'Мягкая', 'Сильная'] as const

/* ── Color Picker Row ── */
function ColorPickerRow({
  presets,
  selected,
  customColor,
  onPresetSelect,
  onCustomSelect,
}: {
  presets: { id: string; color: string; label: string }[]
  selected: string
  customColor: string
  onPresetSelect: (id: string) => void
  onCustomSelect: (color: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isCustomActive = selected === 'custom'

  return (
    <div>
      <div className="flex items-center gap-2">
        {presets.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-label={c.label}
            onClick={() => onPresetSelect(c.id)}
            className={`island-color-circle ${selected === c.id ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''}`}
            style={{ backgroundColor: c.color }}
          />
        ))}
        {/* Custom color — rainbow circle wrapping native input */}
        <button
          type="button"
          aria-label="Свой цвет"
          onClick={() => inputRef.current?.click()}
          className={`island-color-circle island-color-custom ${isCustomActive ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''}`}
          style={isCustomActive ? { background: customColor } : undefined}
        />
        <input
          ref={inputRef}
          type="color"
          value={customColor}
          onChange={(e) => onCustomSelect(e.target.value)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* Inline hex input — visible when custom is active */}
      {isCustomActive && (
        <div className="mt-2 flex items-center gap-2">
          <div
            className="size-5 shrink-0 rounded-full border border-foreground/10"
            style={{ backgroundColor: customColor }}
          />
          <input
            type="text"
            value={customColor.toUpperCase()}
            onChange={(e) => {
              const v = e.target.value
              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onCustomSelect(v)
            }}
            maxLength={7}
            className="island-input font-mono text-[12px]"
            placeholder="#000000"
          />
        </div>
      )}
    </div>
  )
}

/* ── Design Panel ── */
export function DesignPanel() {
  const [bannerStyle, setBannerStyle] = useState<StyleId>('classic')
  const [bgColor, setBgColor] = useState('white')
  const [bgCustom, setBgCustom] = useState('#FFFFFF')
  const [btnColor, setBtnColor] = useState('black')
  const [btnCustom, setBtnCustom] = useState('#000000')
  const [radius, setRadius] = useState(12)
  const [shadow, setShadow] = useState<string>('Мягкая')

  return (
    <div className="space-y-4">
      {/* ── Стиль виджета: Grid 3×2 ── */}
      <div>
        <label className="island-label">Стиль</label>
        <div className="grid grid-cols-3 gap-1.5">
          {BANNER_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setBannerStyle(s.id)}
              className={`island-style-card ${bannerStyle === s.id ? 'island-style-card-active' : ''}`}
            >
              {/* Mini banner preview */}
              <div className={`island-style-preview island-style-preview--${s.id}`}>
                <div className="island-style-preview-bar" />
                <div className="island-style-preview-btn" />
              </div>
              <span className="island-style-card-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Фон баннера ── */}
      <div>
        <label className="island-label">Фон баннера</label>
        <ColorPickerRow
          presets={BG_COLORS}
          selected={bgColor}
          customColor={bgCustom}
          onPresetSelect={(id) => setBgColor(id)}
          onCustomSelect={(color) => {
            setBgCustom(color)
            setBgColor('custom')
          }}
        />
      </div>

      {/* ── Цвет кнопок ── */}
      <div>
        <label className="island-label">Цвет кнопок</label>
        <ColorPickerRow
          presets={BTN_COLORS}
          selected={btnColor}
          customColor={btnCustom}
          onPresetSelect={(id) => setBtnColor(id)}
          onCustomSelect={(color) => {
            setBtnCustom(color)
            setBtnColor('custom')
          }}
        />
      </div>

      {/* ── Скругление ── */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Скругление</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{radius}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={24}
          step={2}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="island-slider mt-1.5 w-full"
        />
      </div>

      {/* ── Тень ── */}
      <div>
        <label className="island-label">Тень</label>
        <div className="island-segmented">
          {SHADOWS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setShadow(s)}
              className={`island-segment ${shadow === s ? 'island-segment-active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
