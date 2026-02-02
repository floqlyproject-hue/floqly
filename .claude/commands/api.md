# /api — Создание нового API endpoint

Создай новый API route для Next.js App Router.

## Инструкции

1. Спроси:
   - Путь endpoint (например: `/api/widgets/[id]`)
   - HTTP методы (GET, POST, PUT, DELETE)
   - Нужна ли аутентификация?

2. Создай файл в `apps/web/app/api/...`

3. Включи:
   - Типизацию request/response
   - Валидацию входных данных (zod)
   - Обработку ошибок
   - Rate limiting (если публичный)
   - Логирование

## Шаблон

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const requestSchema = z.object({
  // ...
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Проверка авторизации
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Валидация
    const body = await request.json()
    const validated = requestSchema.parse(body)

    // Логика
    // ...

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```
