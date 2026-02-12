'use client'

import { Play } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

/* ── Animation Types ── */
export type AnimId = 'slide' | 'fade' | 'bounce' | 'scale' | 'none'
export type TriggerId = 'time' | 'scroll'
export type BackdropOption = 'Выкл' | 'Лёгкое' | 'Сильное'

const ANIMS: { id: AnimId; label: string }[] = [
  { id: 'slide', label: 'Слайд' },
  { id: 'fade', label: 'Затухание' },
  { id: 'bounce', label: 'Отскок' },
  { id: 'scale', label: 'Масштаб' },
  { id: 'none', label: 'Без' },
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
  onPlay?: () => void
}

export function AnimationPanel({ value, onChange, onPlay }: AnimationPanelProps) {
  return (
    <div className="space-y-4">
      {/* Тип появления — shadcn ToggleGroup wrapping */}
      <div>
        <label className="island-label">Появление</label>
        <ToggleGroup
          type="single"
          value={value.anim}
          onValueChange={(v) => { if (v) onChange({ ...value, anim: v as AnimId }) }}
          spacing={1}
          className="flex flex-wrap gap-1"
        >
          {ANIMS.map((a) => (
            <ToggleGroupItem
              key={a.id}
              value={a.id}
              size="sm"
              className="h-[26px] rounded-full px-2.5 text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {a.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Триггер */}
      <div>
        <label className="island-label">Триггер</label>
        <ToggleGroup
          type="single"
          value={value.trigger}
          onValueChange={(v) => { if (v) onChange({ ...value, trigger: v as TriggerId }) }}
          spacing={1}
          className="flex gap-1"
        >
          {TRIGGERS.map((t) => (
            <ToggleGroupItem
              key={t.id}
              value={t.id}
              size="sm"
              className="h-[26px] flex-1 rounded-full px-2.5 text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {t.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {/* Conditional slider — smooth reveal */}
        <div className={`island-trigger-expand ${value.trigger === 'time' ? 'island-trigger-expand-time' : 'island-trigger-expand-scroll'}`}>
          <div className="island-trigger-expand-inner">
            {value.trigger === 'time' ? (
              <div className="pb-2 pt-3">
                <div className="flex items-center justify-between">
                  <label className="island-label mb-0">Задержка</label>
                  <span className="text-[11px] text-foreground/60" style={{ fontVariantNumeric: 'tabular-nums' }}>{value.delay}с</span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={0.5}
                  value={[value.delay]}
                  onValueChange={([v]) => onChange({ ...value, delay: v })}
                  className="mt-2 [&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-foreground [&_[data-slot=slider-thumb]]:shadow-sm [&_[data-slot=slider-range]]:bg-foreground/40"
                />
              </div>
            ) : (
              <div className="pb-2 pt-3">
                <div className="flex items-center justify-between">
                  <label className="island-label mb-0">Прокрутка</label>
                  <span className="text-[11px] text-foreground/60" style={{ fontVariantNumeric: 'tabular-nums' }}>{value.scrollPx}px</span>
                </div>
                <Slider
                  min={50}
                  max={1000}
                  step={50}
                  value={[value.scrollPx]}
                  onValueChange={([v]) => onChange({ ...value, scrollPx: v })}
                  className="mt-2 [&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-foreground [&_[data-slot=slider-thumb]]:shadow-sm [&_[data-slot=slider-range]]:bg-foreground/40"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Затемнение фона */}
      <div>
        <label className="island-label">Затемнение</label>
        <ToggleGroup
          type="single"
          value={value.backdrop}
          onValueChange={(v) => { if (v) onChange({ ...value, backdrop: v as BackdropOption }) }}
          spacing={1}
          className="flex gap-1"
        >
          {BACKDROPS.map((b) => (
            <ToggleGroupItem
              key={b}
              value={b}
              size="sm"
              className="h-[26px] flex-1 rounded-full px-2.5 text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {b}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Скорость анимации — shadcn Slider */}
      <div>
        <div className="flex items-center justify-between">
          <label className="island-label mb-0">Скорость</label>
          <span className="text-[11px] text-foreground/60" style={{ fontVariantNumeric: 'tabular-nums' }}>{value.speed}с</span>
        </div>
        <Slider
          min={0.1}
          max={1}
          step={0.1}
          value={[value.speed]}
          onValueChange={([v]) => onChange({ ...value, speed: v })}
          className="mt-2 [&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-foreground [&_[data-slot=slider-thumb]]:shadow-sm [&_[data-slot=slider-range]]:bg-foreground/40"
        />
      </div>

      {/* Предпросмотр — shadcn Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-1.5 text-[12px] font-medium text-foreground/60"
        onClick={onPlay}
      >
        <Play className="size-3.5" strokeWidth={2} />
        Воспроизвести
      </Button>
    </div>
  )
}
