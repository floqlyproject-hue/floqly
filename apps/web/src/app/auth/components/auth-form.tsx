'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Check, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@floqly/ui'
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

        setMessage('Проверьте почту для подтверждения регистрации')
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
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {mode === 'login' ? 'Вход в аккаунт' : 'Создать аккаунт'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Войдите, чтобы управлять виджетами'
              : 'Бесплатно. Без привязки карты.'}
          </p>
        </div>

        {/* OAuth Buttons */}
        <OAuthButtons redirect={redirect} />

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              или по email
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
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ivan@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Пароль</Label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleMagicLink}
                  className="text-xs text-primary hover:underline"
                  disabled={loading}
                >
                  Войти без пароля
                </button>
              )}
            </div>

            {/* Password field with eye toggle */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
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
                  <div className="flex items-center gap-1.5 text-[12px] text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-3 shrink-0" strokeWidth={2} />
                    <span>Вы вводите кириллицей — возможно, не та раскладка</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg bg-success/10 p-3 text-sm text-success">
              {message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
          >
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Нет аккаунта?{' '}
              <Link
                href={`/auth/register${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="font-medium text-primary hover:underline"
              >
                Зарегистрируйтесь
              </Link>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <Link
                href={`/auth/login${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="font-medium text-primary hover:underline"
              >
                Войдите
              </Link>
            </>
          )}
        </p>
      </div>

      {/* Terms */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        {mode === 'register' && (
          <>
            Регистрируясь, вы соглашаетесь с{' '}
            <Link href="/terms" className="hover:underline">
              условиями использования
            </Link>{' '}
            и{' '}
            <Link href="/privacy" className="hover:underline">
              политикой конфиденциальности
            </Link>
          </>
        )}
      </p>
    </div>
  )
}

/* ── Sub-components ── */

function PasswordCheck({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-[12px] transition-colors ${
      passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground/50'
    }`}>
      <Check className={`size-3 shrink-0 ${passed ? 'opacity-100' : 'opacity-30'}`} strokeWidth={2} />
      <span>{label}</span>
    </div>
  )
}
