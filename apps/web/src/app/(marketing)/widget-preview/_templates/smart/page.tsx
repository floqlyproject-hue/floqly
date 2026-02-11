'use client'

import { useState } from 'react'

export default function SmartWidgetTemplate() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      {/* Widget Preview Container */}
      <div className="relative h-[600px] w-full max-w-4xl rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Smart Widget — Design Template
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Проактивный AI-виджет с уведомлениями и диалогом
          </p>
        </div>

        {/* Widget будет здесь */}
        <div className="flex h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
          <div className="text-center">
            <p className="text-muted-foreground">
              1. Скопируйте утверждённый Simple Widget из design-XX/simple/
            </p>
            <p className="mt-2 text-muted-foreground">
              2. Добавьте проактивные уведомления (анимация появления)
            </p>
            <p className="mt-2 text-muted-foreground">
              3. Добавьте диалоговое окно (чат с AI)
            </p>
            <p className="mt-2 text-muted-foreground">
              4. Добавьте анимацию &quot;раздумий&quot; (thinking/typing)
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground">
          <p><strong>Инструкция:</strong></p>
          <p>1. Начните с копии Simple Widget</p>
          <p>2. Добавьте логику проактивных уведомлений</p>
          <p>3. Реализуйте диалоговый интерфейс</p>
          <p>4. Обновите notes.md с описанием новых фич</p>
        </div>
      </div>
    </main>
  )
}
