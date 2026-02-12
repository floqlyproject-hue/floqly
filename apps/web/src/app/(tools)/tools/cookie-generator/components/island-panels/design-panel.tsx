'use client'

import { useRef } from 'react'
import { Pipette } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Slider } from '@/components/ui/slider'

/* ── Banner Style Presets ── */
export type StyleId = 'classic' | 'glass' | 'neo' | 'minimal' | 'gradient' | 'outlined'

const STYLES: { id: StyleId; label: string }[] = [
  { id: 'classic', label: 'Классика' },
  { id: 'glass', label: 'Стекло' },
  { id: 'neo', label: 'Нео' },
  { id: 'minimal', label: 'Минимал' },
  { id: 'gradient', label: 'Градиент' },
  { id: 'outlined', label: 'Контур' },
]

/* ── Preset Colors ── */
export const BG_COLORS = [
  { id: 'white', color: '#FFFFFF', label: 'Белый' },
  { id: 'dark', color: '#1A1A1A', label: 'Тёмный' },
  { id: 'gray', color: '#F5F5F5', label: 'Серый' },
  { id: 'blue', color: '#E8EEF5', label: 'Голубой' },
]

export const BTN_COLORS = [
  { id: 'black', color: '#000000', label: 'Чёрный' },
  { id: 'blue', color: '#3B82F6', label: 'Синий' },
  { id: 'green', color: '#10B981', label: 'Зелёный' },
  { id: 'purple', color: '#8B5CF6', label: 'Фиолетовый' },
]

export type ShadowLabel = 'Нет' | 'Мягкая' | 'Сильная'
const SHADOWS: ShadowLabel[] = ['Нет', 'Мягкая', 'Сильная']

export interface DesignState {
  bannerStyle: StyleId
  bgColor: string       // preset ID or 'custom'
  bgCustom: string      // hex
  btnColor: string      // preset ID or 'custom'
  btnCustom: string     // hex
  radius: number
  shadow: ShadowLabel
}

interface DesignPanelProps {
  value: DesignState
  onChange: (next: DesignState) => void
}

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
        <button
          type="button"
          aria-label="Свой цвет"
          onClick={() => {
            if (!isCustom) onCustomSelect(customColor)
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

      {/* Expanded custom color editor */}
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
export function DesignPanel({ value, onChange }: DesignPanelProps) {
  return (
    <div className="space-y-4">
      {/* Стиль — shadcn ToggleGroup wrapping */}
      <div>
        <label className="island-label">Стиль</label>
        <ToggleGroup
          type="single"
          value={value.bannerStyle}
          onValueChange={(v) => { if (v) onChange({ ...value, bannerStyle: v as StyleId }) }}
          spacing={1}
          className="flex flex-wrap gap-1"
        >
          {STYLES.map((s) => (
            <ToggleGroupItem
              key={s.id}
              value={s.id}
              size="sm"
              className="h-[26px] rounded-full px-2.5 text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {s.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Фон баннера */}
      <div>
        <label className="island-label">Фон</label>
        <ColorPickerRow
          presets={BG_COLORS}
          selected={value.bgColor}
          customColor={value.bgCustom}
          onPresetSelect={(id) => onChange({ ...value, bgColor: id })}
          onCustomSelect={(color) => onChange({ ...value, bgCustom: color, bgColor: 'custom' })}
        />
      </div>

      {/* Цвет кнопок */}
      <div>
        <label className="island-label">Кнопки</label>
        <ColorPickerRow
          presets={BTN_COLORS}
          selected={value.btnColor}
          customColor={value.btnCustom}
          onPresetSelect={(id) => onChange({ ...value, btnColor: id })}
          onCustomSelect={(color) => onChange({ ...value, btnCustom: color, btnColor: 'custom' })}
        />
      </div>

      {/* Скругление — shadcn Slider */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Скругление</label>
          <span className="font-variant-numeric-tabular text-[11px] text-muted-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{value.radius}px</span>
        </div>
        <Slider
          min={0}
          max={24}
          step={2}
          value={[value.radius]}
          onValueChange={([v]) => onChange({ ...value, radius: v })}
          className="mt-2 [&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-foreground [&_[data-slot=slider-thumb]]:shadow-sm [&_[data-slot=slider-range]]:bg-foreground/40"
        />
      </div>

      {/* Тень — shadcn ToggleGroup */}
      <div>
        <label className="island-label">Тень</label>
        <ToggleGroup
          type="single"
          value={value.shadow}
          onValueChange={(v) => { if (v) onChange({ ...value, shadow: v as ShadowLabel }) }}
          spacing={1}
          className="flex gap-1"
        >
          {SHADOWS.map((s) => (
            <ToggleGroupItem
              key={s}
              value={s}
              size="sm"
              className="h-[26px] flex-1 rounded-full px-2.5 text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {s}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}
