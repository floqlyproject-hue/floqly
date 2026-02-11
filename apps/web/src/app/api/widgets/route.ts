import { NextRequest, NextResponse } from 'next/server'

// GET /api/widgets - Получить список виджетов
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  // TODO: Подключить Supabase
  return NextResponse.json({
    widgets: [],
    message: 'API endpoint ready. Supabase integration pending.',
  })
}

// POST /api/widgets - Создать новый виджет
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Валидация и сохранение в Supabase
    return NextResponse.json(
      {
        success: true,
        message: 'Widget creation endpoint ready. Supabase integration pending.',
        data: body,
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
