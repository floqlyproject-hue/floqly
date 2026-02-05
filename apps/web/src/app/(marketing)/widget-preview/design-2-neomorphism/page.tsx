'use client'

import { useState } from 'react'

export default function NeomorphismPreview() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shape, setShape] = useState<'circle' | 'square' | 'blob'>('circle')
  const [animation, setAnimation] = useState<'vertical' | 'horizontal' | 'radial'>('vertical')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const bgColor = theme === 'light' ? 'bg-[#e0e5ec]' : 'bg-[#2d3436]'
  const textColor = theme === 'light' ? 'text-gray-700' : 'text-gray-200'
  const mutedColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400'

  // Neomorphism shadows
  const neuOutset = theme === 'light'
    ? 'shadow-[8px_8px_16px_#b8bec7,-8px_-8px_16px_#ffffff]'
    : 'shadow-[8px_8px_16px_#1e2426,-8px_-8px_16px_#3c4446]'

  const neuInset = theme === 'light'
    ? 'shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff]'
    : 'shadow-[inset_4px_4px_8px_#1e2426,inset_-4px_-4px_8px_#3c4446]'

  const neuButtonHover = theme === 'light'
    ? 'hover:shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff]'
    : 'hover:shadow-[4px_4px_8px_#1e2426,-4px_-4px_8px_#3c4446]'

  return (
    <main className={`min-h-screen ${bgColor} transition-colors duration-500`}>
      {/* Header */}
      <div className={`border-b ${theme === 'light' ? 'border-gray-300/50' : 'border-gray-600/50'}`}>
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold ${textColor}`}>Design 2: Neomorphism</h1>
              <p className={`text-sm ${mutedColor}`}>Мягкие тени, эффект вдавленности</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`rounded-full p-2 ${neuOutset} ${bgColor} transition-all ${neuButtonHover}`}
              >
                {theme === 'light' ? (
                  <svg className="size-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="size-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <a
                href="/widget-preview"
                className={`rounded-xl px-4 py-2 text-sm ${textColor} ${neuOutset} ${bgColor} transition-all ${neuButtonHover}`}
              >
                Все дизайны
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Controls */}
          <div className="space-y-6">
            <div className={`rounded-2xl p-6 ${neuOutset} ${bgColor}`}>
              <h2 className={`mb-4 text-lg font-semibold ${textColor}`}>Форма кнопки</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'circle', label: 'Круг' },
                  { id: 'square', label: 'Квадрат' },
                  { id: 'blob', label: 'Blob' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setShape(s.id as typeof shape)}
                    className={`rounded-xl px-3 py-2 text-sm transition-all ${
                      shape === s.id
                        ? `${neuInset} ${textColor}`
                        : `${neuOutset} ${mutedColor} ${neuButtonHover}`
                    } ${bgColor}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-6 ${neuOutset} ${bgColor}`}>
              <h2 className={`mb-4 text-lg font-semibold ${textColor}`}>Анимация</h2>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'vertical', label: 'Вертикальная' },
                  { id: 'horizontal', label: 'Горизонтальная' },
                  { id: 'radial', label: 'Радиальная' },
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAnimation(a.id as typeof animation)}
                    className={`rounded-xl px-3 py-2 text-sm transition-all ${
                      animation === a.id
                        ? `${neuInset} ${textColor}`
                        : `${neuOutset} ${mutedColor} ${neuButtonHover}`
                    } ${bgColor}`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-6 ${neuOutset} ${bgColor}`}>
              <h2 className={`mb-4 text-lg font-semibold ${textColor}`}>Статус</h2>
              <div className={`space-y-2 text-sm ${mutedColor}`}>
                <p>Форма: <span className={textColor}>{shape}</span></p>
                <p>Анимация: <span className={textColor}>{animation}</span></p>
                <p>Тема: <span className={textColor}>{theme}</span></p>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className={`relative min-h-[600px] overflow-hidden rounded-3xl ${neuInset} ${bgColor}`}>
            {/* Fake website content */}
            <div className="p-8">
              <div className={`mb-6 h-8 w-48 rounded-xl ${neuOutset} ${bgColor}`} />
              <div className="space-y-3">
                <div className={`h-4 w-full rounded-lg ${neuInset} ${bgColor}`} />
                <div className={`h-4 w-4/5 rounded-lg ${neuInset} ${bgColor}`} />
                <div className={`h-4 w-3/5 rounded-lg ${neuInset} ${bgColor}`} />
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`aspect-video rounded-2xl ${neuOutset} ${bgColor}`} />
                ))}
              </div>
            </div>

            {/* Widget Preview - Neomorphism Style */}
            <div className="absolute bottom-6 right-6">
              {/* Expanded Social Icons */}
              {isExpanded && (
                <div
                  className={`mb-3 flex ${
                    animation === 'vertical' ? 'flex-col' :
                    animation === 'horizontal' ? 'flex-row-reverse' :
                    'flex-col'
                  } gap-3`}
                >
                  {/* WhatsApp */}
                  <button className={`size-12 rounded-full ${neuOutset} ${bgColor} transition-all active:${neuInset}`}>
                    <svg className="mx-auto size-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>

                  {/* Telegram */}
                  <button className={`size-12 rounded-full ${neuOutset} ${bgColor} transition-all`}>
                    <svg className="mx-auto size-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </button>

                  {/* VK */}
                  <button className={`size-12 rounded-full ${neuOutset} ${bgColor} transition-all`}>
                    <svg className="mx-auto size-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.033-1.49-1.172-1.744-1.172-.356 0-.458.102-.458.593v1.562c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.963 4 8.539c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/>
                    </svg>
                  </button>

                  {/* Message */}
                  <button className={`size-12 rounded-full ${neuOutset} ${bgColor} transition-all`}>
                    <svg className="mx-auto size-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Main Button - Neomorphism */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                  transition-all duration-300
                  ${isExpanded ? neuInset : neuOutset}
                  ${bgColor}
                  ${shape === 'circle' ? 'size-16 rounded-full' : ''}
                  ${shape === 'square' ? 'size-16 rounded-2xl' : ''}
                  ${shape === 'blob' ? 'size-16 rounded-[40%_60%_60%_40%/60%_40%_60%_40%]' : ''}
                `}
              >
                <svg
                  className={`mx-auto size-7 transition-transform duration-300 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  } ${isExpanded ? 'rotate-45' : ''}`}
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
        <div className={`mt-8 rounded-2xl p-6 ${neuOutset} ${bgColor}`}>
          <h2 className={`mb-4 text-lg font-semibold ${textColor}`}>Заметки по дизайну</h2>
          <ul className={`space-y-2 text-sm ${mutedColor}`}>
            <li>- Двойные тени: светлая и тёмная для объёма</li>
            <li>- Inset-тени для состояния &quot;нажато&quot;</li>
            <li>- Монохромная палитра (серые тона)</li>
            <li>- Скруглённые формы</li>
            <li>- Поддержка светлой и тёмной темы</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
