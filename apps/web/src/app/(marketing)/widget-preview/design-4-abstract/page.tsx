'use client'

import { useState } from 'react'

export default function AbstractPreview() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shape, setShape] = useState<'circle' | 'square' | 'blob'>('blob')
  const [animation, setAnimation] = useState<'vertical' | 'horizontal' | 'radial'>('radial')
  const [colorScheme, setColorScheme] = useState<'sunset' | 'ocean' | 'forest' | 'candy'>('sunset')

  const gradients = {
    sunset: 'from-orange-500 via-pink-500 to-purple-600',
    ocean: 'from-cyan-400 via-blue-500 to-indigo-600',
    forest: 'from-green-400 via-emerald-500 to-teal-600',
    candy: 'from-pink-400 via-purple-500 to-indigo-500',
  }

  const bgGradients = {
    sunset: 'from-orange-900/20 via-pink-900/20 to-purple-900/20',
    ocean: 'from-cyan-900/20 via-blue-900/20 to-indigo-900/20',
    forest: 'from-green-900/20 via-emerald-900/20 to-teal-900/20',
    candy: 'from-pink-900/20 via-purple-900/20 to-indigo-900/20',
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Animated Background */}
      <div className={`fixed inset-0 bg-gradient-to-br ${bgGradients[colorScheme]} transition-all duration-1000`}>
        <div className="absolute inset-0 opacity-30">
          {/* Abstract shapes */}
          <div className={`absolute -left-20 top-20 size-96 rounded-full bg-gradient-to-br ${gradients[colorScheme]} opacity-20 blur-3xl`} />
          <div className={`absolute -right-20 bottom-20 size-80 rounded-full bg-gradient-to-br ${gradients[colorScheme]} opacity-20 blur-3xl`} />
          <div className={`absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${gradients[colorScheme]} opacity-10 blur-3xl`} />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Design 4: Abstract</h1>
                <p className="text-sm text-white/50">Градиенты, формы, креатив</p>
              </div>
              <a
                href="/widget-preview"
                className={`rounded-full bg-gradient-to-r ${gradients[colorScheme]} px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg`}
              >
                Все дизайны
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            {/* Controls */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-lg font-semibold text-white">Цветовая схема</h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sunset', label: 'Закат', colors: 'from-orange-500 to-purple-600' },
                    { id: 'ocean', label: 'Океан', colors: 'from-cyan-400 to-indigo-600' },
                    { id: 'forest', label: 'Лес', colors: 'from-green-400 to-teal-600' },
                    { id: 'candy', label: 'Конфета', colors: 'from-pink-400 to-indigo-500' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColorScheme(c.id as typeof colorScheme)}
                      className={`relative overflow-hidden rounded-xl p-3 text-sm font-medium transition-all ${
                        colorScheme === c.id
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-950'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${c.colors}`} />
                      <span className="relative text-white">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-lg font-semibold text-white">Форма кнопки</h2>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'circle', label: 'Круг' },
                    { id: 'square', label: 'Квадрат' },
                    { id: 'blob', label: 'Blob' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setShape(s.id as typeof shape)}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        shape === s.id
                          ? `bg-gradient-to-r ${gradients[colorScheme]} text-white`
                          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-lg font-semibold text-white">Анимация</h2>
                <div className="space-y-2">
                  {[
                    { id: 'vertical', label: 'Вертикальная' },
                    { id: 'horizontal', label: 'Горизонтальная' },
                    { id: 'radial', label: 'Радиальная' },
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAnimation(a.id as typeof animation)}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition-all ${
                        animation === a.id
                          ? `bg-gradient-to-r ${gradients[colorScheme]} text-white`
                          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="relative min-h-[600px] overflow-hidden rounded-3xl border border-white/10 bg-black/50 backdrop-blur-sm">
              {/* Fake website content */}
              <div className="p-8">
                <div className={`mb-6 h-8 w-48 rounded-full bg-gradient-to-r ${gradients[colorScheme]} opacity-30`} />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-white/5" />
                  <div className="h-4 w-4/5 rounded-full bg-white/5" />
                  <div className="h-4 w-3/5 rounded-full bg-white/5" />
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`aspect-video rounded-2xl bg-gradient-to-br ${gradients[colorScheme]} opacity-10`}
                    />
                  ))}
                </div>
              </div>

              {/* Widget Preview - Abstract Style */}
              <div className="absolute bottom-6 right-6">
                {/* Expanded Social Icons - Radial layout for "radial" animation */}
                {isExpanded && (
                  <div className={`absolute ${
                    animation === 'radial' ? 'bottom-0 right-0' : 'bottom-full right-0 mb-3'
                  }`}>
                    <div
                      className={`flex ${
                        animation === 'vertical' ? 'flex-col gap-3' :
                        animation === 'horizontal' ? 'flex-row-reverse gap-3' :
                        'flex-col gap-3'
                      }`}
                      style={animation === 'radial' ? {
                        position: 'absolute',
                        bottom: '70px',
                        right: '0',
                      } : {}}
                    >
                      {/* Radial positions */}
                      {animation === 'radial' ? (
                        <>
                          {/* Position icons in a semi-circle */}
                          <button
                            className={`absolute size-12 rounded-full bg-gradient-to-br ${gradients[colorScheme]} shadow-lg transition-all hover:scale-110`}
                            style={{ transform: 'translate(-80px, 0px)' }}
                          >
                            <svg className="mx-auto size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </button>
                          <button
                            className={`absolute size-12 rounded-full bg-gradient-to-br ${gradients[colorScheme]} shadow-lg transition-all hover:scale-110`}
                            style={{ transform: 'translate(-60px, -50px)' }}
                          >
                            <svg className="mx-auto size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                          </button>
                          <button
                            className={`absolute size-12 rounded-full bg-gradient-to-br ${gradients[colorScheme]} shadow-lg transition-all hover:scale-110`}
                            style={{ transform: 'translate(-20px, -75px)' }}
                          >
                            <svg className="mx-auto size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.033-1.49-1.172-1.744-1.172-.356 0-.458.102-.458.593v1.562c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.963 4 8.539c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/>
                            </svg>
                          </button>
                          <button
                            className={`absolute size-12 rounded-full bg-gradient-to-br ${gradients[colorScheme]} shadow-lg transition-all hover:scale-110`}
                            style={{ transform: 'translate(25px, -60px)' }}
                          >
                            <svg className="mx-auto size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Vertical/Horizontal layout */}
                          <button className={`size-12 rounded-full bg-gradient-to-br ${gradients[colorScheme]} shadow-lg transition-all hover:scale-110`}>
                            <svg className="mx-auto size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </button>
                          <button className={`size-12 rounded-full bg-gradient-to-br ${gradients[colorScheme]} shadow-lg transition-all hover:scale-110`}>
                            <svg className="mx-auto size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                          </button>
                          <button className={`size-12 rounded-full bg-gradient-to-br ${gradients[colorScheme]} shadow-lg transition-all hover:scale-110`}>
                            <svg className="mx-auto size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.033-1.49-1.172-1.744-1.172-.356 0-.458.102-.458.593v1.562c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.963 4 8.539c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/>
                            </svg>
                          </button>
                          <button className={`size-12 rounded-full bg-gradient-to-br ${gradients[colorScheme]} shadow-lg transition-all hover:scale-110`}>
                            <svg className="mx-auto size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Main Button - Abstract with gradient */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`
                    relative size-16 overflow-hidden bg-gradient-to-br ${gradients[colorScheme]} shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]
                    ${shape === 'circle' ? 'rounded-full' : ''}
                    ${shape === 'square' ? 'rounded-2xl' : ''}
                    ${shape === 'blob' ? 'rounded-[40%_60%_60%_40%/60%_40%_60%_40%] animate-[blob_8s_ease-in-out_infinite]' : ''}
                  `}
                  style={shape === 'blob' ? {
                    animation: 'blob 8s ease-in-out infinite',
                  } : {}}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 transition-opacity hover:opacity-100" />

                  <svg
                    className={`relative mx-auto size-7 text-white transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {isExpanded ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">Заметки по дизайну</h2>
            <ul className="space-y-2 text-sm text-white/60">
              <li>- Яркие градиенты (3-4 цвета)</li>
              <li>- Анимированные blob-формы</li>
              <li>- Glow-эффекты при hover</li>
              <li>- Радиальное раскрытие полукругом</li>
              <li>- Цветовые схемы на выбор</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%; }
          25% { border-radius: 50% 50% 40% 60% / 40% 60% 50% 50%; }
          50% { border-radius: 60% 40% 50% 50% / 50% 50% 40% 60%; }
          75% { border-radius: 50% 50% 60% 40% / 60% 40% 50% 50%; }
        }
      `}</style>
    </main>
  )
}
