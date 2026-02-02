import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/widgets/[id] - Получить виджет по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  // TODO: Получить из Supabase
  return NextResponse.json({
    widget: null,
    message: `Widget ${id} endpoint ready. Supabase integration pending.`,
  })
}

// PATCH /api/widgets/[id] - Обновить виджет
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const body = await request.json()

    // TODO: Обновить в Supabase
    return NextResponse.json({
      success: true,
      message: `Widget ${id} update endpoint ready. Supabase integration pending.`,
      data: body,
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

// DELETE /api/widgets/[id] - Удалить виджет
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  // TODO: Удалить из Supabase
  return NextResponse.json({
    success: true,
    message: `Widget ${id} delete endpoint ready. Supabase integration pending.`,
  })
}
