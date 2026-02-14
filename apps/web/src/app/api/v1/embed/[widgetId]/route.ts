/**
 * GET /api/v1/embed/{widgetId}
 *
 * Public endpoint — returns widget config by embed_key.
 * No auth required. Called by embed script from client sites.
 */

import { NextResponse } from 'next/server'
import { getWidgetConfig } from '@/lib/services/embed-service'

// Validate embed_key format (hex string, 8-32 chars)
const EMBED_KEY_REGEX = /^[a-f0-9]{8,32}$/i

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  const { widgetId } = await params

  // Validate format
  if (!widgetId || !EMBED_KEY_REGEX.test(widgetId)) {
    return NextResponse.json(
      { error: 'Invalid widget ID' },
      { status: 400 }
    )
  }

  // Fetch widget config from service layer
  const widget = await getWidgetConfig(widgetId)

  if (!widget) {
    return NextResponse.json(
      { error: 'Widget not found or inactive' },
      { status: 404 }
    )
  }

  // Return config in embed response format
  return NextResponse.json({
    widget: {
      id: widget.id,
      type: widget.type,
      config: widget.config,
    },
  })
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
