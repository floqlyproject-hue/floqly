'use client'

import { useState } from 'react'

export default function Sandbox2Preview() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const isDark = theme === 'dark'

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

      {/* Empty - Widget will be here */}
      <div className="fixed bottom-6 right-6">
        {/* ВИДЖЕТ ВСТАВЛЯТЬ СЮДА */}
      </div>
    </main>
  )
}
