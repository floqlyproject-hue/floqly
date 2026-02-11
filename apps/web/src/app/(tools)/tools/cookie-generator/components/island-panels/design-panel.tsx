'use client'

import { useRef, useState } from 'react'
import { Pipette } from 'lucide-react'

/* ── Banner Style Presets ── */
type StyleId = 'classic' | 'glass' | 'neo' | 'minimal' | 'gradient' | 'outlined'

const STYLE_ROWS: { id: StyleId; label: string }[][] = [
  [
    { id: 'classic', label: 'Классика' },
    { id: 'glass', label: 'Стекло' },
    { id: 'neo', label: 'Нео' },
  ],
  [
    { id: 'minimal', label: 'Минимал' },
    { id: 'gradient', label: 'Градиент' },
    { id: 'outlined', label: 'Контур' },
  ],
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
  const nativeRef = useRef<HTMLInputElement>(null)
  const isCustom = selected === 'custom'

  return (
    <div>
      <div className="flex items-center gap-1.5">
        {presets.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-label={c.label}
            onClick={() => onPresetSelect(c.id)}
            className={`island-color-dot ${selected === c.id ? 'island-color-dot-active' : ''}`}
            style={{ backgroundColor: c.color }}
          />
        ))}
        {/* Custom color — subtle + button */}
        <button
          type="button"
          aria-label="Свой цвет"
          onClick={() => {
            if (!isCustom) {
              onCustomSelect(customColor)
            }
            nativeRef.current?.click()
          }}
          className={`island-color-dot island-color-dot-plus ${isCustom ? 'island-color-dot-active' : ''}`}
          style={isCustom ? { backgroundColor: customColor, borderStyle: 'solid' } : undefined}
        >
          {!isCustom && <span className="text-[11px] leading-none text-foreground/30">+</span>}
        </button>
        <input
          ref={nativeRef}
          type="color"
          value={customColor}
          onChange={(e) => onCustomSelect(e.target.value)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* Expanded custom color editor — smooth reveal */}
      <div className={`island-color-expand ${isCustom ? 'island-color-expand-open' : ''}`}>
        <div className="island-color-expand-inner">
          <div className="flex items-center gap-2 pt-2.5">
            <div
              className="size-6 shrink-0 rounded-md border border-foreground/8 shadow-sm"
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
              spellCheck={false}
              className="island-hex-input"
              placeholder="#000000"
            />
            <button
              type="button"
              aria-label="Выбрать цвет"
              onClick={() => nativeRef.current?.click()}
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-foreground/30 transition-colors hover:bg-foreground/5 hover:text-foreground/60"
            >
              <Pipette className="size-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
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
    <div className="space-y-3.5">
      {/* ── Стиль: compact 2-row pills ── */}
      <div>
        <label className="island-label">Стиль</label>
        <div className="flex flex-col gap-1">
          {STYLE_ROWS.map((row, i) => (
            <div key={i} className="island-segmented">
              {row.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setBannerStyle(s.id)}
                  className={`island-segment ${bannerStyle === s.id ? 'island-segment-active' : ''}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Фон баннера ── */}
      <div>
        <label className="island-label">Фон</label>
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
        <label className="island-label">Кнопки</label>
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
