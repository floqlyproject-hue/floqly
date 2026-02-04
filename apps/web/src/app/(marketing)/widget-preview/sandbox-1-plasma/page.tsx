'use client'

import { useState } from 'react'
import './plasma.css'

export default function SandboxPreview() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [isExpanded, setIsExpanded] = useState(false)

  const isDark = theme === 'dark'

  const socialLinks = [
    {
      name: 'WhatsApp',
      gradient: 'from-green-400 to-green-600',
      shadowColor: 'shadow-green-500/40',
      hoverShadow: 'hover:shadow-green-500/60',
      icon: (
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      name: 'Telegram',
      gradient: 'from-sky-400 to-blue-500',
      shadowColor: 'shadow-sky-500/40',
      hoverShadow: 'hover:shadow-sky-500/60',
      icon: (
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
    {
      name: 'VK',
      gradient: 'from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-500/40',
      hoverShadow: 'hover:shadow-blue-500/60',
      icon: (
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.033-1.49-1.172-1.744-1.172-.356 0-.458.102-.458.593v1.562c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.963 4 8.539c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/>
        </svg>
      ),
    },
  ]

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
      {/* Theme Toggle */}
      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`rounded-full p-3 transition-colors ${
            isDark
              ? 'bg-zinc-800 text-white hover:bg-zinc-700'
              : 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-md'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Back Link */}
      <div className="fixed left-4 top-4 z-50">
        <a
          href="/widget-preview"
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            isDark
              ? 'bg-zinc-800 text-white hover:bg-zinc-700'
              : 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-md'
          }`}
        >
          ← Назад
        </a>
      </div>

      {/* Widget Area - Aligned to center */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4">
        {/* Social Icons */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-500 ease-out ${
            isExpanded
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          {socialLinks.map((social, index) => (
            <button
              key={social.name}
              className={`
                group relative size-[60px] rounded-full
                bg-gradient-to-br ${social.gradient}
                shadow-lg ${social.shadowColor} ${social.hoverShadow}
                transition-all duration-300 ease-out
                hover:scale-110 hover:shadow-xl
                active:scale-95
              `}
              style={{
                transitionDelay: isExpanded ? `${index * 60}ms` : '0ms',
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded
                  ? 'scale(1) translateY(0)'
                  : 'scale(0.5) translateY(20px)',
              }}
              aria-label={social.name}
            >
              {/* Glossy overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-transparent" />

              {/* Inner shadow for depth */}
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-b from-white/10 to-black/10" />

              {/* Icon */}
              <div className="relative flex h-full items-center justify-center text-white drop-shadow-md">
                {social.icon}
              </div>
            </button>
          ))}
        </div>

        {/* Main Plasma Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`loader ${isExpanded ? 'paused' : ''}`}
          aria-label={isExpanded ? 'Закрыть меню' : 'Открыть меню'}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <mask id="clipping">
                <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                <polygon points="25,25 75,25 50,75" fill="white" />
                <polygon points="50,25 75,75 25,75" fill="white" />
                <polygon points="35,35 65,35 50,65" fill="white" />
                <polygon points="35,35 65,35 50,65" fill="white" />
                <polygon points="35,35 65,35 50,65" fill="white" />
                <polygon points="35,35 65,35 50,65" fill="white" />
              </mask>
            </defs>
          </svg>
          <div className="box" />

          {/* Close icon when expanded */}
          <div className={`close-icon ${isExpanded ? 'visible' : ''}`}>
            <svg
              className="size-7 text-white drop-shadow-lg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </button>
      </div>
    </main>
  )
}
