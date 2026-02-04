import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Успешная авторизация — редирект на нужную страницу
      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  // Ошибка — редирект на страницу входа с ошибкой
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
