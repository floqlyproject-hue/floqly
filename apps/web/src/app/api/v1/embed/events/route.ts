/**
 * POST /api/v1/embed/events
 *
 * Public endpoint — records analytics events from embed scripts.
 * No auth required. Fire-and-forget from widget.
 */

import { NextResponse } from 'next/server'
import { recordAnalyticsEvent } from '@/lib/services/embed-service'

// Allowed event types
const ALLOWED_EVENT_TYPES = [
  'view',
  'cookie_accept',
  'cookie_decline',
  'cookie_settings',
  'interaction',
  'open',
  'close',
]

// Max event_data size (prevent abuse)
const MAX_EVENT_DATA_SIZE = 4096

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.widget_id || !body.event_type || !body.visitor_id) {
      return NextResponse.json(
        { error: 'Missing required fields: widget_id, event_type, visitor_id' },
        { status: 400 }
      )
    }

    // Validate event type
    if (!ALLOWED_EVENT_TYPES.includes(body.event_type)) {
      return NextResponse.json(
        { error: `Invalid event_type. Allowed: ${ALLOWED_EVENT_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate event_data size
    if (body.event_data && JSON.stringify(body.event_data).length > MAX_EVENT_DATA_SIZE) {
      return NextResponse.json(
        { error: 'event_data too large' },
        { status: 400 }
      )
    }

    // Get IP from headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || null

    // Record event via service layer
    await recordAnalyticsEvent({
      widget_id: body.widget_id,
      event_type: body.event_type,
      visitor_id: body.visitor_id,
      session_id: body.session_id || '',
      page_url: body.page_url || '',
      referrer: body.referrer || undefined,
      user_agent: body.user_agent || undefined,
      ip_address: ip || undefined,
      event_data: body.event_data || undefined,
    })

    // Minimal response for speed
    return NextResponse.json({ ok: true })
  } catch {
    // Don't expose errors — analytics should fail silently
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
