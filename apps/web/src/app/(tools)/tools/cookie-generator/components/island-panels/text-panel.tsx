'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

/* ── Tone Templates ── */
export type ToneId = 'friendly' | 'short' | 'official' | 'creative' | 'detailed'

const TONES: { id: ToneId; label: string }[] = [
  { id: 'friendly', label: 'Дружелюбный' },
  { id: 'short', label: 'Короткий' },
  { id: 'official', label: 'Официальный' },
  { id: 'creative', label: 'Креативный' },
  { id: 'detailed', label: 'Развёрнутый' },
]

export const TONE_TEXTS: Record<
  ToneId,
  { title: string; desc: string; accept: string; decline: string }
> = {
  friendly: {
    title: 'Мы используем cookie',
    desc: 'Для удобства работы сайт использует cookie.',
    accept: 'Принять',
    decline: 'Отклонить',
  },
  short: {
    title: 'Cookie',
    desc: 'Сайт использует cookie.',
    accept: 'OK',
    decline: 'Нет',
  },
  official: {
    title: 'Уведомление о cookie',
    desc: 'Сайт использует cookie в соответствии с 152-ФЗ.',
    accept: 'Принять все',
    decline: 'Отклонить',
  },
  creative: {
    title: 'Cookie? Конечно! 🍪',
    desc: 'Используем cookie, чтобы сайт работал лучше.',
    accept: 'Согласен!',
    decline: 'Не сейчас',
  },
  detailed: {
    title: 'Политика cookie',
    desc: 'Cookie используются для аналитики и персонализации. Вы можете управлять настройками.',
    accept: 'Принять все',
    decline: 'Только необходимые',
  },
}

export interface TextState {
  tone: ToneId
  title: string
  desc: string
  accept: string
  decline: string
}

interface TextPanelProps {
  value: TextState
  onChange: (next: TextState) => void
}

export function TextPanel({ value, onChange }: TextPanelProps) {
  function applyTone(id: ToneId) {
    const t = TONE_TEXTS[id]
    onChange({ tone: id, title: t.title, desc: t.desc, accept: t.accept, decline: t.decline })
  }

  return (
    <div className="space-y-3">
      {/* Tone selector — shadcn ToggleGroup wrapping */}
      <div>
        <label className="island-label">Шаблон</label>
        <ToggleGroup
          type="single"
          value={value.tone}
          onValueChange={(v) => { if (v) applyTone(v as ToneId) }}
          className="flex flex-wrap gap-1"
        >
          {TONES.map((t) => (
            <ToggleGroupItem
              key={t.id}
              value={t.id}
              size="sm"
              className="h-7 rounded-md px-2.5 text-[11px] font-medium data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {t.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Editable fields */}
      <div>
        <label className="island-label">Заголовок</label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Мы используем cookie"
          className="h-8 border-0 border-b border-border bg-transparent px-0 text-[13px] shadow-none rounded-none focus-visible:ring-0 focus-visible:border-foreground"
        />
      </div>

      <div>
        <label className="island-label">Описание</label>
        <Textarea
          value={value.desc}
          onChange={(e) => onChange({ ...value, desc: e.target.value })}
          rows={2}
          placeholder="Текст описания…"
          className="min-h-0 resize-none border-0 border-b border-border bg-transparent px-0 text-[13px] shadow-none rounded-none focus-visible:ring-0 focus-visible:border-foreground"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="island-label">Принять</label>
          <Input
            value={value.accept}
            onChange={(e) => onChange({ ...value, accept: e.target.value })}
            placeholder="Принять"
            className="h-8 border-0 border-b border-border bg-transparent px-0 text-[13px] shadow-none rounded-none focus-visible:ring-0 focus-visible:border-foreground"
          />
        </div>
        <div className="flex-1">
          <label className="island-label">Отклонить</label>
          <Input
            value={value.decline}
            onChange={(e) => onChange({ ...value, decline: e.target.value })}
            placeholder="Отклонить"
            className="h-8 border-0 border-b border-border bg-transparent px-0 text-[13px] shadow-none rounded-none focus-visible:ring-0 focus-visible:border-foreground"
          />
        </div>
      </div>
    </div>
  )
}
