'use client'

import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
import { Button } from '@floqly/ui'

interface OAuthButtonsProps {
  redirect: string
}

// OAuth провайдеры, доступные в Supabase
// Yandex, VK, Telegram требуют настройки через Supabase Dashboard:
// 1. Supabase Dashboard → Authentication → Providers
// 2. Включить нужного провайдера
// 3. Указать Client ID и Client Secret

type OAuthProvider = 'yandex' | 'vk' | 'telegram'

export function OAuthButtons({ redirect: _redirect }: OAuthButtonsProps) {
  const [loading, setLoading] = useState<OAuthProvider | null>(null)
  const [error, setError] = useState<string | null>(null)
  // const supabase = createClient()

  const handleOAuth = async (provider: OAuthProvider) => {
    setLoading(provider)
    setError(null)

    try {
      // Для Telegram используется отдельный flow через бота
      if (provider === 'telegram') {
        // Telegram Login требует отдельной реализации через Telegram Login Widget
        // https://core.telegram.org/widgets/login
        setError('Telegram авторизация будет доступна позже')
        setLoading(null)
        return
      }

      // Yandex и VK поддерживаются через Supabase (требуют настройки в Dashboard)
      // Для работы нужно:
      // 1. Создать приложение в Yandex OAuth: https://oauth.yandex.ru/
      // 2. Создать приложение VK: https://vk.com/editapp?act=create
      // 3. Настроить провайдеров в Supabase Dashboard

      // Supabase не имеет встроенной поддержки Yandex,
      // но можно использовать через Custom OIDC Provider
      // Пока показываем сообщение
      if (provider === 'yandex') {
        setError('Yandex OAuth будет настроен позже')
        setLoading(null)
        return
      }

      // VK поддерживается нативно
      if (provider === 'vk') {
        setError('VK OAuth будет настроен позже')
        setLoading(null)
        return
      }

      // Uncomment when providers are configured in Supabase:
      // const { error } = await supabase.auth.signInWithOAuth({
      //   provider: provider === 'vk' ? 'vkontakte' : provider,
      //   options: {
      //     redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      //   },
      // })
      // if (error) throw error
    } catch (err) {
      console.error('OAuth error:', err)
      setError(err instanceof Error ? err.message : 'Ошибка авторизации')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-warning/10 p-3 text-center text-sm text-warning">
          {error}
        </div>
      )}

      <div className="grid gap-3">
        {/* Yandex */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="relative"
          onClick={() => handleOAuth('yandex')}
          disabled={loading !== null}
          loading={loading === 'yandex'}
        >
          {loading !== 'yandex' && (
            <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 15h-2v-6.5L8.5 17h-2l4-6.5V5h2v5.5l4 6.5h-2l-3-6.5V17z" />
            </svg>
          )}
          Войти через Яндекс
        </Button>

        {/* VK */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="relative"
          onClick={() => handleOAuth('vk')}
          disabled={loading !== null}
          loading={loading === 'vk'}
        >
          {loading !== 'vk' && (
            <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.073 2H8.937C3.333 2 2 3.333 2 8.927v6.136C2 20.667 3.333 22 8.927 22h6.136c5.604 0 6.937-1.333 6.937-6.927V8.927C22 3.333 20.677 2 15.073 2zm3.073 14.27h-1.72c-.65 0-.85-.53-2.016-1.72-1.02-.99-1.47-1.12-1.72-1.12-.35 0-.45.1-.45.58v1.57c0 .41-.13.66-1.2.66-1.77 0-3.73-1.07-5.11-3.07C4.24 10.07 3.8 8.12 3.8 7.65c0-.25.1-.48.58-.48h1.72c.43 0 .6.2.76.66.84 2.43 2.24 4.56 2.82 4.56.21 0 .31-.1.31-.65V9.24c-.07-1.13-.66-1.22-.66-1.62 0-.2.17-.41.43-.41h2.7c.37 0 .5.2.5.63v3.37c0 .36.17.49.27.49.22 0 .4-.13.8-.53 1.23-1.38 2.11-3.52 2.11-3.52.12-.25.31-.48.74-.48h1.72c.52 0 .63.27.52.63-.21.97-2.24 3.85-2.24 3.85-.18.29-.24.41 0 .73.17.24.76.73 1.15 1.18.72.82 1.27 1.5 1.41 1.97.16.47-.1.71-.54.71z" />
            </svg>
          )}
          Войти через VK
        </Button>

        {/* Telegram */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="relative"
          onClick={() => handleOAuth('telegram')}
          disabled={loading !== null}
          loading={loading === 'telegram'}
        >
          {loading !== 'telegram' && (
            <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          )}
          Войти через Telegram
        </Button>
      </div>
    </div>
  )
}
