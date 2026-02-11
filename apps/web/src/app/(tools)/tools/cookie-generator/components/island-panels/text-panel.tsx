'use client'

/* ── Tone Templates ── */
export type ToneId = 'friendly' | 'short' | 'official' | 'creative' | 'detailed'

const TONE_ROWS: { id: ToneId; label: string }[][] = [
  [
    { id: 'friendly', label: 'Дружелюбный' },
    { id: 'short', label: 'Короткий' },
    { id: 'official', label: 'Официальный' },
  ],
  [
    { id: 'creative', label: 'Креативный' },
    { id: 'detailed', label: 'Развёрнутый' },
  ],
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
  settings: string
  showDecline: boolean
  showSettings: boolean
  linkWordEnabled: boolean
  linkWord: string
  linkLineEnabled: boolean
  linkLineText: string
  linkTarget: 'popup' | 'page'
  linkUrl: string
}

interface TextPanelProps {
  value: TextState
  onChange: (next: TextState) => void
}

export function TextPanel({ value, onChange }: TextPanelProps) {
  function applyTone(id: ToneId) {
    const t = TONE_TEXTS[id]
    onChange({ ...value, tone: id, title: t.title, desc: t.desc, accept: t.accept, decline: t.decline })
  }

  return (
    <div className="space-y-3.5">
      {/* Tone selector — 2-row pills */}
      <div>
        <label className="island-label">Шаблон</label>
        <div className="flex flex-col gap-1">
          {TONE_ROWS.map((row, i) => (
            <div key={i} className="island-segmented">
              {row.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTone(t.id)}
                  className={`island-segment ${value.tone === t.id ? 'island-segment-active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Editable fields */}
      <div>
        <label className="island-label">Заголовок</label>
        <input
          type="text"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="island-input"
          placeholder="Мы используем cookie"
        />
      </div>

      <div>
        <label className="island-label">Описание</label>
        <textarea
          value={value.desc}
          onChange={(e) => onChange({ ...value, desc: e.target.value })}
          rows={2}
          className="island-input island-textarea"
          placeholder="Текст описания…"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="island-label">Принять</label>
          <input
            type="text"
            value={value.accept}
            onChange={(e) => onChange({ ...value, accept: e.target.value })}
            className="island-input"
            placeholder="Принять"
          />
        </div>
        <div className="flex-1">
          <label className="island-label">Отклонить</label>
          <input
            type="text"
            value={value.decline}
            onChange={(e) => onChange({ ...value, decline: e.target.value })}
            className="island-input"
            placeholder="Отклонить"
          />
        </div>
      </div>
    </div>
  )
}
