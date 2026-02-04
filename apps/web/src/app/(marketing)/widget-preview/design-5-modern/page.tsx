'use client'

import { useState } from 'react'

export default function ModernPreview() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shape, setShape] = useState<'circle' | 'square' | 'blob'>('square')
  const [animation, setAnimation] = useState<'vertical' | 'horizontal' | 'radial'>('vertical')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [accentColor, setAccentColor] = useState<'blue' | 'violet' | 'emerald' | 'rose'>('violet')

  const isDark = theme === 'dark'

  const accents = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-500',
      border: 'border-blue-500',
      hover: 'hover:bg-blue-500',
      ring: 'ring-blue-500',
      glow: 'shadow-blue-500/25',
    },
    violet: {
      bg: 'bg-violet-500',
      text: 'text-violet-500',
      border: 'border-violet-500',
      hover: 'hover:bg-violet-500',
      ring: 'ring-violet-500',
      glow: 'shadow-violet-500/25',
    },
    emerald: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-500',
      border: 'border-emerald-500',
      hover: 'hover:bg-emerald-500',
      ring: 'ring-emerald-500',
      glow: 'shadow-emerald-500/25',
    },
    rose: {
      bg: 'bg-rose-500',
      text: 'text-rose-500',
      border: 'border-rose-500',
      hover: 'hover:bg-rose-500',
      ring: 'ring-rose-500',
      glow: 'shadow-rose-500/25',
    },
  }

  const accent = accents[accentColor]

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Design 5: Modern
              </h1>
              <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                Тренды 2025-2026, микроанимации
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`rounded-xl p-2.5 transition-colors ${
                  isDark
                    ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                    : 'bg-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {isDark ? (
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <a
                href="/widget-preview"
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${accent.bg} text-white hover:opacity-90`}
              >
                Все дизайны
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Controls */}
          <div className="space-y-4">
            {/* Accent Color */}
            <div className={`rounded-2xl p-5 ${isDark ? 'bg-zinc-900' : 'bg-white'} ${isDark ? '' : 'shadow-sm'}`}>
              <h2 className={`mb-4 text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Акцентный цвет
              </h2>
              <div className="flex gap-2">
                {[
                  { id: 'blue', color: 'bg-blue-500' },
                  { id: 'violet', color: 'bg-violet-500' },
                  { id: 'emerald', color: 'bg-emerald-500' },
                  { id: 'rose', color: 'bg-rose-500' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setAccentColor(c.id as typeof accentColor)}
                    className={`size-10 rounded-xl ${c.color} transition-all ${
                      accentColor === c.id
                        ? 'ring-2 ring-offset-2 ' + (isDark ? 'ring-offset-zinc-900' : 'ring-offset-white') + ' ring-white/50'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Shape */}
            <div className={`rounded-2xl p-5 ${isDark ? 'bg-zinc-900' : 'bg-white'} ${isDark ? '' : 'shadow-sm'}`}>
              <h2 className={`mb-4 text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Форма кнопки
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'circle', label: 'Круг' },
                  { id: 'square', label: 'Квадрат' },
                  { id: 'blob', label: 'Blob' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setShape(s.id as typeof shape)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      shape === s.id
                        ? `${accent.bg} text-white`
                        : isDark
                          ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation */}
            <div className={`rounded-2xl p-5 ${isDark ? 'bg-zinc-900' : 'bg-white'} ${isDark ? '' : 'shadow-sm'}`}>
              <h2 className={`mb-4 text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Анимация раскрытия
              </h2>
              <div className="space-y-2">
                {[
                  { id: 'vertical', label: 'Вертикальная', icon: '↑' },
                  { id: 'horizontal', label: 'Горизонтальная', icon: '←' },
                  { id: 'radial', label: 'Радиальная', icon: '↗' },
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAnimation(a.id as typeof animation)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      animation === a.id
                        ? `${accent.bg} text-white`
                        : isDark
                          ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <span>{a.label}</span>
                    <span className="text-lg">{a.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className={`rounded-2xl p-5 ${isDark ? 'bg-zinc-900' : 'bg-white'} ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Статус виджета</span>
                <span className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  <span className={`size-2 rounded-full ${isExpanded ? 'bg-green-500' : accent.bg}`} />
                  {isExpanded ? 'Развёрнут' : 'Свёрнут'}
                </span>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className={`relative min-h-[600px] overflow-hidden rounded-3xl ${isDark ? 'bg-zinc-900' : 'bg-white shadow-sm'}`}>
            {/* Fake website content */}
            <div className="p-8">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-xl ${accent.bg}`} />
                <div className={`h-4 w-32 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
              </div>
              <div className="mt-8 space-y-3">
                <div className={`h-4 w-full rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
                <div className={`h-4 w-4/5 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
                <div className={`h-4 w-3/5 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className={`aspect-video rounded-2xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
                ))}
              </div>
            </div>

            {/* Widget Preview - Modern Style */}
            <div className="absolute bottom-6 right-6">
              {/* Expanded Social Icons */}
              {isExpanded && (
                <div
                  className={`mb-3 flex ${
                    animation === 'vertical' ? 'flex-col' :
                    animation === 'horizontal' ? 'flex-row-reverse' :
                    'flex-col'
                  } gap-2`}
                >
                  {/* WhatsApp */}
                  <button className={`group size-12 rounded-xl transition-all hover:scale-105 ${isDark ? 'bg-zinc-800 hover:bg-green-500' : 'bg-zinc-100 hover:bg-green-500'}`}>
                    <svg className={`mx-auto size-5 transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'} group-hover:text-white`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>

                  {/* Telegram */}
                  <button className={`group size-12 rounded-xl transition-all hover:scale-105 ${isDark ? 'bg-zinc-800 hover:bg-blue-500' : 'bg-zinc-100 hover:bg-blue-500'}`}>
                    <svg className={`mx-auto size-5 transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'} group-hover:text-white`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </button>

                  {/* VK */}
                  <button className={`group size-12 rounded-xl transition-all hover:scale-105 ${isDark ? 'bg-zinc-800 hover:bg-blue-600' : 'bg-zinc-100 hover:bg-blue-600'}`}>
                    <svg className={`mx-auto size-5 transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'} group-hover:text-white`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.033-1.49-1.172-1.744-1.172-.356 0-.458.102-.458.593v1.562c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.963 4 8.539c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/>
                    </svg>
                  </button>

                  {/* Message */}
                  <button className={`group size-12 rounded-xl transition-all hover:scale-105 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'} ${accent.hover}`}>
                    <svg className={`mx-auto size-5 transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'} group-hover:text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Main Button - Modern */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                  relative size-14 overflow-hidden transition-all duration-300 hover:scale-105 ${accent.bg} text-white shadow-lg ${accent.glow} hover:shadow-xl
                  ${shape === 'circle' ? 'rounded-full' : ''}
                  ${shape === 'square' ? 'rounded-2xl' : ''}
                  ${shape === 'blob' ? 'rounded-[40%_60%_60%_40%/60%_40%_60%_40%]' : ''}
                `}
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20" />

                <svg
                  className={`relative mx-auto size-6 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {isExpanded ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className={`mt-8 rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-white shadow-sm'}`}>
          <h2 className={`mb-4 text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Заметки по дизайну
          </h2>
          <ul className={`space-y-2 text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
            <li>- Скруглённые углы 2xl/3xl (современный тренд)</li>
            <li>- Акцентные цвета с glow-эффектом</li>
            <li>- Нейтральный zinc для фона</li>
            <li>- Микроанимации при hover (scale, colors)</li>
            <li>- Чёткая иерархия через цвет и размер</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
