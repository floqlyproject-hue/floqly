'use client'

interface OAuthButtonsProps {
  redirect: string
}

// OAuth провайдеры — пока disabled, будут настроены через Supabase Dashboard
// Yandex: Custom OIDC Provider
// VK: нативная поддержка Supabase (vkontakte)
// Telegram: через Telegram Login Widget

const providers = [
  {
    id: 'yandex' as const,
    name: 'Яндекс',
    label: 'Авторизация через Яндекс появится скоро',
    // Официальная буква «Я» из Yandex brand SVG
    icon: (
      <svg className="size-[18px]" viewBox="0 0 32 32" fill="currentColor" opacity="0.55">
        <path d="M21.88,2h-4c-4,0-8.07,3-8.07,9.62a8.33,8.33,0,0,0,4.14,7.66L9,28.13A1.25,1.25,0,0,0,9,29.4a1.21,1.21,0,0,0,1,.6h2.49a1.24,1.24,0,0,0,1.2-.75l4.59-9h.34v8.62A1.14,1.14,0,0,0,19.82,30H22a1.12,1.12,0,0,0,1.16-1.06V3.22A1.19,1.19,0,0,0,22,2ZM18.7,16.28h-.59c-2.3,0-3.66-1.87-3.66-5,0-3.9,1.73-5.29,3.34-5.29h.94Z" />
      </svg>
    ),
  },
  {
    id: 'vk' as const,
    name: 'VK',
    label: 'Авторизация через VK появится скоро',
    icon: (
      <svg className="size-[18px]" viewBox="0 0 24 24" fill="currentColor" opacity="0.55">
        <path d="M15.073 2H8.937C3.333 2 2 3.333 2 8.927v6.136C2 20.667 3.333 22 8.927 22h6.136c5.604 0 6.937-1.333 6.937-6.927V8.927C22 3.333 20.677 2 15.073 2zm3.073 14.27h-1.72c-.65 0-.85-.53-2.016-1.72-1.02-.99-1.47-1.12-1.72-1.12-.35 0-.45.1-.45.58v1.57c0 .41-.13.66-1.2.66-1.77 0-3.73-1.07-5.11-3.07C4.24 10.07 3.8 8.12 3.8 7.65c0-.25.1-.48.58-.48h1.72c.43 0 .6.2.76.66.84 2.43 2.24 4.56 2.82 4.56.21 0 .31-.1.31-.65V9.24c-.07-1.13-.66-1.22-.66-1.62 0-.2.17-.41.43-.41h2.7c.37 0 .5.2.5.63v3.37c0 .36.17.49.27.49.22 0 .4-.13.8-.53 1.23-1.38 2.11-3.52 2.11-3.52.12-.25.31-.48.74-.48h1.72c.52 0 .63.27.52.63-.21.97-2.24 3.85-2.24 3.85-.18.29-.24.41 0 .73.17.24.76.73 1.15 1.18.72.82 1.27 1.5 1.41 1.97.16.47-.1.71-.54.71z" />
      </svg>
    ),
  },
  {
    id: 'telegram' as const,
    name: 'Telegram',
    label: 'Авторизация через Telegram появится скоро',
    icon: (
      <svg className="size-[18px]" viewBox="0 0 24 24" fill="currentColor" opacity="0.55">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OAuthButtons({ redirect }: OAuthButtonsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            disabled
            className="group relative flex h-11 flex-1 cursor-not-allowed items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground/50 transition-all duration-200 hover:border-border hover:text-muted-foreground/70"
            aria-label={provider.label}
            title={provider.label}
          >
            {provider.icon}
          </button>
        ))}
      </div>
      <p className="text-center text-[10px] text-muted-foreground/40">
        Авторизация через соцсети появится скоро
      </p>
    </div>
  )
}
