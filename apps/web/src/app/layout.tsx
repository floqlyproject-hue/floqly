import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin', 'cyrillic'],
  weight: ['600'],
})

export const metadata: Metadata = {
  title: {
    default: 'Floqly — Умные виджеты для сайтов',
    template: '%s | Floqly',
  },
  description:
    'Экосистема виджетов для сайтов с AI-чатом. Cookie Generator, Simple Widget и умный AI-виджет для увеличения конверсии.',
  keywords: [
    'виджеты для сайта',
    'AI чат',
    'чат-бот',
    'cookie consent',
    'виджет обратной связи',
  ],
  authors: [{ name: 'Floqly' }],
  creator: 'Floqly',
  metadataBase: new URL('https://floqly.ru'),
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// Скрипт для предотвращения мигания темы при загрузке
const themeScript = `
  (function() {
    const stored = localStorage.getItem('floqly-theme');
    const theme = stored || 'system';
    let resolved = theme;

    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.classList.add(resolved);
  })();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      </body>
    </html>
  )
}
