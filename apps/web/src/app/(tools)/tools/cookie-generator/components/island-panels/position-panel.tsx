'use client'

export type WidthOption = 'Вытянутый' | 'Обычный' | 'Компакт'
export type VertOption = 'Сверху' | 'Центр' | 'Снизу'
export type HorizOption = 'Слева' | 'Центр' | 'Справа'

const WIDTHS: WidthOption[] = ['Вытянутый', 'Обычный', 'Компакт']
const VERT: VertOption[] = ['Сверху', 'Центр', 'Снизу']
const HORIZ: HorizOption[] = ['Слева', 'Центр', 'Справа']

export interface PositionState {
  width: WidthOption
  vert: VertOption
  horiz: HorizOption
  offsetX: number
  offsetY: number
}

interface PositionPanelProps {
  value: PositionState
  onChange: (next: PositionState) => void
}

export function PositionPanel({ value, onChange }: PositionPanelProps) {
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
              onClick={() => onChange({ ...value, width: w })}
              className={`island-segment ${value.width === w ? 'island-segment-active' : ''}`}
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
              onClick={() => onChange({ ...value, vert: v })}
              className={`island-segment ${value.vert === v ? 'island-segment-active' : ''}`}
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
              onClick={() => onChange({ ...value, horiz: h })}
              className={`island-segment ${value.horiz === h ? 'island-segment-active' : ''}`}
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
          <span className="text-[11px] tabular-nums text-muted-foreground">{value.offsetX}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={48}
          step={4}
          value={value.offsetX}
          onChange={(e) => onChange({ ...value, offsetX: Number(e.target.value) })}
          className="island-slider mt-1.5 w-full"
        />
      </div>

      {/* Отступ Y */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Отступ Y</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{value.offsetY}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={48}
          step={4}
          value={value.offsetY}
          onChange={(e) => onChange({ ...value, offsetY: Number(e.target.value) })}
          className="island-slider mt-1.5 w-full"
        />
      </div>
    </div>
  )
}
