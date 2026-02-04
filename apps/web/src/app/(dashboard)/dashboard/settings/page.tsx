'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const [name, setName] = useState('Пользователь')
  const [email, setEmail] = useState('user@example.com')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Обновление профиля в Supabase
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Настройки</h1>
        <p className="mt-1 text-muted-foreground">
          Ваш профиль и настройки аккаунта
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 border-b border-border pb-4">
        <Link
          href="/dashboard/settings"
          className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
        >
          Профиль
        </Link>
        <Link
          href="/dashboard/subscription"
          className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Подписка
        </Link>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Профиль</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ваши личные данные
        </p>

        <div className="mt-6 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-xl font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                Изменить аватар
              </button>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG до 1 MB
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Имя
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Безопасность</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Настройки безопасности аккаунта
        </p>

        <div className="mt-6 space-y-4">
          {/* Password */}
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Пароль</p>
              <p className="text-sm text-muted-foreground">Изменить пароль аккаунта</p>
            </div>
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Изменить
            </button>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-foreground">Двухфакторная аутентификация</p>
                <p className="text-sm text-muted-foreground">Дополнительный уровень защиты</p>
              </div>
            </div>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Скоро
            </span>
          </div>

          {/* Sessions */}
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Активные сессии</p>
              <p className="text-sm text-muted-foreground">Управление входами в аккаунт</p>
            </div>
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Посмотреть
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Уведомления</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Настройте, какие уведомления вы хотите получать
        </p>

        <div className="mt-6 space-y-4">
          <NotificationToggle
            title="Email-уведомления"
            description="Получать важные обновления на почту"
            defaultChecked
          />
          <NotificationToggle
            title="Новые лиды"
            description="Уведомления о новых заявках"
            defaultChecked
          />
          <NotificationToggle
            title="Маркетинговые рассылки"
            description="Новости и обновления Floqly"
          />
        </div>
      </div>
    </div>
  )
}

function NotificationToggle({
  title,
  description,
  defaultChecked = false,
}: {
  title: string
  description: string
  defaultChecked?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-4">
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  )
}
