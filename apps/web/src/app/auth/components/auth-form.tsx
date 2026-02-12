'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Check, AlertTriangle, ArrowRight, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input, Label } from '@floqly/ui'
import { OAuthButtons } from './oauth-buttons'

interface AuthFormProps {
  mode: 'login' | 'register'
}

/* ── Helpers ── */

const CYRILLIC_RE = /[а-яёА-ЯЁ]/

function getPasswordChecks(password: string) {
  return {
    length: password.length >= 6,
    noCyrillic: !CYRILLIC_RE.test(password),
  }
}

/* ── Component ── */

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()
  const checks = getPasswordChecks(password)
  const hasCyrillic = password.length > 0 && !checks.noCyrillic

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Honeypot: если заполнено — тихо «успешно»
    if (honeypot) {
      setMessage(mode === 'register'
        ? 'Проверьте почту для подтверждения регистрации'
        : 'Выполняется вход...',
      )
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
          },
        })

        if (error) throw error

        // Автологин — сразу в dashboard, подтверждение email через баннер
        router.push(redirect)
        router.refresh()
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push(redirect)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Введите email')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        },
      })

      if (error) throw error

      setMessage('Ссылка для входа отправлена на почту')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      {/* Card */}
      <div className="relative rounded-2xl border border-border/80 bg-card px-7 pb-8 pt-7 shadow-sm">
        {/* Close button — top-right corner of card */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground/40 transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Закрыть"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>

        {/* Header */}
        <div className="mb-7 pr-8">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            {mode === 'login' ? 'Вход в аккаунт' : 'Создать аккаунт'}
          </h1>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            {mode === 'login'
              ? 'Войдите, чтобы управлять виджетами'
              : 'Бесплатно. Без привязки карты.'}
          </p>
        </div>

        {/* OAuth Buttons — compact row */}
        <OAuthButtons redirect={redirect} />

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
              или
            </span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot — invisible to humans, filled by bots */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="website_url">Не заполняйте это поле</label>
            <input
              type="text"
              id="website_url"
              name="website_url"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[13px] font-medium text-foreground/80">
                Имя
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Как вас зовут?"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                disabled={loading}
                className="h-11 rounded-lg border-border/60 bg-background text-[14px] shadow-none ring-0 placeholder:text-muted-foreground/40 focus-visible:border-foreground/25 focus-visible:ring-0"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium text-foreground/80">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-11 rounded-lg border-border/60 bg-background text-[14px] shadow-none ring-0 placeholder:text-muted-foreground/40 focus-visible:border-foreground/25 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[13px] font-medium text-foreground/80">
                Пароль
              </Label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleMagicLink}
                  className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                  disabled={loading}
                >
                  Войти по ссылке
                </button>
              )}
            </div>

            {/* Password field with eye toggle */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="h-11 rounded-lg border-border/60 bg-background pr-10 text-[14px] shadow-none ring-0 placeholder:text-muted-foreground/40 focus-visible:border-foreground/25 focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
                tabIndex={-1}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="size-4" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Password requirements (register only, shown when typing) */}
            {mode === 'register' && password.length > 0 && (
              <div className="space-y-1 pt-1">
                <PasswordCheck passed={checks.length} label="Минимум 6 символов" />
                {hasCyrillic && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-3 shrink-0" strokeWidth={2} />
                    <span>Кириллица — возможно, не та раскладка</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error / Success messages */}
          {error && (
            <div className="rounded-lg bg-destructive/8 px-3 py-2.5 text-[13px] text-destructive">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg bg-success/8 px-3 py-2.5 text-[13px] text-success">
              {message}
            </div>
          )}

          {/* Submit button — dark (foreground), not blue */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-[14px] font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <>
                {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>

        {/* Footer — switch mode */}
        <p className="mt-6 text-center text-[13px] text-muted-foreground">
          {mode === 'login' ? (
            <>
              Нет аккаунта?{' '}
              <Link
                href={`/auth/register${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="font-medium text-foreground transition-colors hover:text-foreground/70"
              >
                Создать
              </Link>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <Link
                href={`/auth/login${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="font-medium text-foreground transition-colors hover:text-foreground/70"
              >
                Войти
              </Link>
            </>
          )}
        </p>
      </div>

      {/* Terms — below the card */}
      {mode === 'register' && (
        <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground/60">
          Нажимая «Создать аккаунт», вы соглашаетесь с{' '}
          <Link href="/terms" className="underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:text-muted-foreground hover:decoration-muted-foreground/60">
            условиями использования
          </Link>{' '}
          и{' '}
          <Link href="/privacy" className="underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:text-muted-foreground hover:decoration-muted-foreground/60">
            политикой конфиденциальности
          </Link>
        </p>
      )}
    </div>
  )
}

/* ── Sub-components ── */

function PasswordCheck({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-[11px] transition-colors ${
      passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground/40'
    }`}>
      <div className={`flex size-3.5 items-center justify-center rounded-full transition-colors ${
        passed ? 'bg-emerald-600/10 dark:bg-emerald-400/10' : 'bg-muted'
      }`}>
        <Check className={`size-2.5 ${passed ? 'opacity-100' : 'opacity-30'}`} strokeWidth={2.5} />
      </div>
      <span>{label}</span>
    </div>
  )
}
