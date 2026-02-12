'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Slider } from '@/components/ui/slider'

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
        <ToggleGroup
          type="single"
          value={value.width}
          onValueChange={(v) => { if (v) onChange({ ...value, width: v as WidthOption }) }}
          className="flex gap-1"
        >
          {WIDTHS.map((w) => (
            <ToggleGroupItem
              key={w}
              value={w}
              size="sm"
              className="h-7 flex-1 rounded-md px-2 text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {w}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Вертикаль */}
      <div>
        <label className="island-label">Вертикаль</label>
        <ToggleGroup
          type="single"
          value={value.vert}
          onValueChange={(v) => { if (v) onChange({ ...value, vert: v as VertOption }) }}
          className="flex gap-1"
        >
          {VERT.map((v) => (
            <ToggleGroupItem
              key={v}
              value={v}
              size="sm"
              className="h-7 flex-1 rounded-md px-2 text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {v}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Горизонталь */}
      <div>
        <label className="island-label">Горизонталь</label>
        <ToggleGroup
          type="single"
          value={value.horiz}
          onValueChange={(v) => { if (v) onChange({ ...value, horiz: v as HorizOption }) }}
          className="flex gap-1"
        >
          {HORIZ.map((h) => (
            <ToggleGroupItem
              key={h}
              value={h}
              size="sm"
              className="h-7 flex-1 rounded-md px-2 text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {h}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Отступ X — shadcn Slider */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Отступ X</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{value.offsetX}px</span>
        </div>
        <Slider
          min={0}
          max={48}
          step={4}
          value={[value.offsetX]}
          onValueChange={([v]) => onChange({ ...value, offsetX: v })}
          className="mt-1.5 [&_[role=slider]]:size-3.5 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-foreground [&_[role=slider]]:shadow-sm"
        />
      </div>

      {/* Отступ Y — shadcn Slider */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Отступ Y</label>
          <span className="text-[11px] tabular-nums text-muted-foreground">{value.offsetY}px</span>
        </div>
        <Slider
          min={0}
          max={48}
          step={4}
          value={[value.offsetY]}
          onValueChange={([v]) => onChange({ ...value, offsetY: v })}
          className="mt-1.5 [&_[role=slider]]:size-3.5 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-foreground [&_[role=slider]]:shadow-sm"
        />
      </div>
    </div>
  )
}
