'use client'

import { useState } from 'react'

/* ── Tone Templates ── */
type ToneId = 'friendly' | 'short' | 'official' | 'creative' | 'detailed'

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

const TONE_TEXTS: Record<
  ToneId,
  { title: string; desc: string; accept: string; decline: string }
> = {
  friendly: {
    title: 'Мы используем cookie',
    desc: 'Чтобы сделать сайт удобнее, мы используем cookie. Продолжая, вы соглашаетесь с этим.',
    accept: 'Принять',
    decline: 'Отклонить',
  },
  short: {
    title: 'Cookie',
    desc: 'Сайт использует cookie для корректной работы.',
    accept: 'OK',
    decline: 'Нет',
  },
  official: {
    title: 'Уведомление о cookie',
    desc: 'В соответствии с 152-ФЗ, данный сайт использует файлы cookie для обеспечения работоспособности и улучшения качества обслуживания.',
    accept: 'Принять все',
    decline: 'Отклонить',
  },
  creative: {
    title: 'Cookie? Конечно! 🍪',
    desc: 'Мы используем cookie, чтобы сайт работал ещё лучше для вас.',
    accept: 'Согласен!',
    decline: 'Не сейчас',
  },
  detailed: {
    title: 'Политика cookie',
    desc: 'Мы используем файлы cookie для анализа трафика, персонализации контента и улучшения вашего опыта. Вы можете управлять настройками.',
    accept: 'Принять все',
    decline: 'Только необходимые',
  },
}

export function TextPanel() {
  const [tone, setTone] = useState<ToneId>('friendly')
  const [title, setTitle] = useState(TONE_TEXTS.friendly.title)
  const [desc, setDesc] = useState(TONE_TEXTS.friendly.desc)
  const [accept, setAccept] = useState(TONE_TEXTS.friendly.accept)
  const [decline, setDecline] = useState(TONE_TEXTS.friendly.decline)

  function applyTone(id: ToneId) {
    setTone(id)
    const t = TONE_TEXTS[id]
    setTitle(t.title)
    setDesc(t.desc)
    setAccept(t.accept)
    setDecline(t.decline)
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
                  className={`island-segment ${tone === t.id ? 'island-segment-active' : ''}`}
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="island-input"
          placeholder="Мы используем cookie"
        />
      </div>

      <div>
        <label className="island-label">Описание</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
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
            value={accept}
            onChange={(e) => setAccept(e.target.value)}
            className="island-input"
            placeholder="Принять"
          />
        </div>
        <div className="flex-1">
          <label className="island-label">Отклонить</label>
          <input
            type="text"
            value={decline}
            onChange={(e) => setDecline(e.target.value)}
            className="island-input"
            placeholder="Отклонить"
          />
        </div>
      </div>
    </div>
  )
}
