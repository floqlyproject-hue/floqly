'use client'

import { useState } from 'react'

export function TextPanel() {
  const [title, setTitle] = useState('Мы используем cookie')
  const [description, setDescription] = useState('')
  const [acceptBtn, setAcceptBtn] = useState('Принять все')
  const [declineBtn, setDeclineBtn] = useState('Отклонить')

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div>
        <label className="island-label">Заголовок</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Мы используем cookie"
          className="island-input"
        />
      </div>

      {/* Описание */}
      <div>
        <label className="island-label">Описание</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Наш сайт использует файлы cookie…"
          className="island-input"
        />
      </div>

      {/* Кнопка принять */}
      <div>
        <label className="island-label">Кнопка «Принять»</label>
        <input
          type="text"
          value={acceptBtn}
          onChange={(e) => setAcceptBtn(e.target.value)}
          placeholder="Принять все"
          className="island-input"
        />
      </div>

      {/* Кнопка отклонить */}
      <div>
        <label className="island-label">Кнопка «Отклонить»</label>
        <input
          type="text"
          value={declineBtn}
          onChange={(e) => setDeclineBtn(e.target.value)}
          placeholder="Отклонить"
          className="island-input"
        />
      </div>
    </div>
  )
}
