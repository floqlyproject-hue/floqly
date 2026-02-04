'use client'

import { useState } from 'react'

export default function LiquidGlassPreview() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shape, setShape] = useState<'circle' | 'square' | 'blob'>('circle')
  const [animation, setAnimation] = useState<'vertical' | 'horizontal' | 'radial'>('vertical')

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Design 1: Liquid Glass</h1>
              <p className="text-sm text-white/60">Glassmorphism / Liquid Glass эффект</p>
            </div>
            <a
              href="/widget-preview"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition hover:bg-white/20"
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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
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
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      shape === s.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold text-white">Анимация</h2>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'vertical', label: 'Вертикальная' },
                  { id: 'horizontal', label: 'Горизонтальная' },
                  { id: 'radial', label: 'Радиальная' },
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAnimation(a.id as typeof animation)}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      animation === a.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold text-white">Статус</h2>
              <div className="space-y-2 text-sm text-white/60">
                <p>Форма: <span className="text-white">{shape}</span></p>
                <p>Анимация: <span className="text-white">{animation}</span></p>
                <p>Развёрнут: <span className="text-white">{isExpanded ? 'Да' : 'Нет'}</span></p>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="relative min-h-[600px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            {/* Fake website content */}
            <div className="p-8">
              <div className="mb-6 h-8 w-48 rounded-lg bg-white/10" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-white/5" />
                <div className="h-4 w-4/5 rounded bg-white/5" />
                <div className="h-4 w-3/5 rounded bg-white/5" />
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video rounded-lg bg-white/5" />
                ))}
              </div>
            </div>

            {/* Widget Preview - Liquid Glass Style */}
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
                  <button className="group relative size-12 overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <svg className="relative mx-auto size-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>

                  {/* Telegram */}
                  <button className="group relative size-12 overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <svg className="relative mx-auto size-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </button>

                  {/* VK */}
                  <button className="group relative size-12 overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <svg className="relative mx-auto size-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.033-1.49-1.172-1.744-1.172-.356 0-.458.102-.458.593v1.562c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.963 4 8.539c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/>
                    </svg>
                  </button>

                  {/* Message */}
                  <button className="group relative size-12 overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <svg className="relative mx-auto size-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Main Button - Liquid Glass */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                  relative overflow-hidden border border-white/30 bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20
                  ${shape === 'circle' ? 'size-16 rounded-full' : ''}
                  ${shape === 'square' ? 'size-16 rounded-2xl' : ''}
                  ${shape === 'blob' ? 'size-16 rounded-[40%_60%_60%_40%/60%_40%_60%_40%]' : ''}
                `}
              >
                {/* Glass highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-xl" />

                {/* Icon */}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">Заметки по дизайну</h2>
          <ul className="space-y-2 text-sm text-white/60">
            <li>- Glassmorphism эффект с backdrop-blur</li>
            <li>- Полупрозрачные границы (border-white/20)</li>
            <li>- Градиентные блики для объёма</li>
            <li>- Плавные hover-эффекты</li>
            <li>- Цветовые акценты через gradient glow</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
