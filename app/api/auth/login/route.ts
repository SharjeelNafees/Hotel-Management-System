import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const username = (body?.username || '').toString().trim()
    const password = (body?.password || '').toString()
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const backend = process.env.BACKEND_URL || 'http://localhost:5003'
    const url = `${backend.replace(/\/$/, '')}/api/v1/auth/login`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      const message = err?.error || 'Login failed'
      return NextResponse.json({ error: message }, { status: res.status })
    }

    const data = await res.json().catch(() => ({}))
    const token = data.token
    if (!token) {
      return NextResponse.json({ error: 'Login failed: no token' }, { status: 502 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    })
    return response
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
