'use client'

import { useState, useEffect } from 'react'
import { Mail, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function EmailConfirmBanner() {
  const [visible, setVisible] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Если баннер был закрыт в этой сессии — не показывать
    const dismissed = sessionStorage.getItem('email-banner-dismissed')
    if (dismissed) return

    // Проверяем, подтверждён ли email
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && !user.email_confirmed_at) {
        setVisible(true)
      }
    })
  }, [supabase.auth])

  const handleResend = async () => {
    setSending(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        await supabase.auth.resend({
          type: 'signup',
          email: user.email,
        })
        setSent(true)
      }
    } catch {
      // Тихий fallback — пользователь может попробовать ещё раз
    } finally {
      setSending(false)
    }
  }

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem('email-banner-dismissed', 'true')
  }

  if (!visible) return null

  return (
    <div className="border-b border-warning/20 bg-warning/6 px-4 py-2.5 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        {/* Left: icon + text */}
        <div className="flex min-w-0 items-center gap-2.5">
          <Mail className="size-4 shrink-0 text-warning" strokeWidth={1.5} />
          <p className="truncate text-[13px] text-foreground/80">
            Подтвердите email для доступа ко всем возможностям
          </p>
        </div>

        {/* Right: resend + close */}
        <div className="flex shrink-0 items-center gap-2">
          {sent ? (
            <span className="text-[12px] text-success">
              Письмо отправлено
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={sending}
              className="text-[12px] font-medium text-foreground/70 transition-colors hover:text-foreground disabled:opacity-50"
            >
              {sending ? 'Отправка...' : 'Отправить письмо'}
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="rounded-md p-1 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-muted-foreground"
            aria-label="Скрыть"
          >
            <X className="size-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
