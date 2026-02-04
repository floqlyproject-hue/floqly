'use client'

import { useEffect, useState } from 'react'

interface ActivityEvent {
  id: string
  type: 'widget_view' | 'widget_click' | 'form_submit' | 'cookie_accept' | 'cookie_decline'
  message: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

// Mock data for now - будет заменено на Supabase Realtime
const MOCK_EVENTS: ActivityEvent[] = [
  {
    id: '1',
    type: 'widget_view',
    message: 'Виджет показан на mysite.ru',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: '2',
    type: 'cookie_accept',
    message: 'Пользователь принял cookie',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '3',
    type: 'form_submit',
    message: 'Новая заявка с формы обратной связи',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '4',
    type: 'widget_click',
    message: 'Клик по кнопке виджета',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
]

const eventIcons: Record<ActivityEvent['type'], React.ReactNode> = {
  widget_view: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  widget_click: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
    </svg>
  ),
  form_submit: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  cookie_accept: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  cookie_decline: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const eventColors: Record<ActivityEvent['type'], string> = {
  widget_view: 'bg-primary/10 text-primary',
  widget_click: 'bg-warning/10 text-warning',
  form_submit: 'bg-success/10 text-success',
  cookie_accept: 'bg-success/10 text-success',
  cookie_decline: 'bg-muted text-muted-foreground',
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'только что'
  if (diffMins < 60) return `${diffMins} мин. назад`
  if (diffHours < 24) return `${diffHours} ч. назад`
  return `${diffDays} дн. назад`
}

interface ActivityFeedProps {
  projectId?: string
  maxItems?: number
}

export function ActivityFeed({ maxItems = 5 }: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock loading - будет заменено на Supabase Realtime
  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(MOCK_EVENTS.slice(0, maxItems))
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [maxItems])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="size-8 rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/4 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <svg className="size-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Нет недавних событий
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50"
        >
          <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${eventColors[event.type]}`}>
            {eventIcons[event.type]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm text-foreground">{event.message}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatRelativeTime(event.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
