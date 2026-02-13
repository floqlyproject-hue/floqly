'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'
  return 'Добрый вечер'
}

export function DashboardGreeting() {
  const [name, setName] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) {
        setName(user.user_metadata.full_name)
      } else if (user?.email) {
        setName(user.email.split('@')[0])
      }
    })
  }, [supabase.auth])

  const greeting = getGreeting()

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        {name ? `${greeting}, ${name}` : greeting}
      </h1>
      <p className="mt-1 text-[14px] text-muted-foreground">
        Управляйте виджетами и инструментами
      </p>
    </div>
  )
}
