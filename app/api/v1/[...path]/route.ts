import { NextRequest, NextResponse } from 'next/server'

// Try these backend URLs in order until one responds.
const BACKENDS = [
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003',
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:5002',
  'http://localhost:5003',
  'http://localhost:5004',
  'http://localhost:5005',
]

async function forward(req: NextRequest) {
  const { pathname, search } = new URL(req.url)
  const suffix = pathname.replace(/^\/api\/v1\//, '') + (search || '')

  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text()
  const headers = new Headers(req.headers)
  headers.delete('host')

  let lastErr: any = null
  for (const base of BACKENDS) {
    try {
      const target = `${base}/api/v1/${suffix}`
      const res = await fetch(target, {
        method: req.method,
        headers,
        body,
      })
      // If the server is down, fetch throws; if it responds, return as-is.
      const resHeaders = new Headers(res.headers)
      const buf = await res.arrayBuffer()
      return new NextResponse(buf, {
        status: res.status,
        headers: resHeaders,
      })
    } catch (e) {
      lastErr = e
      continue
    }
  }
  return NextResponse.json({ error: 'Backend not reachable', detail: String(lastErr) }, { status: 502 })
}

export async function GET(req: NextRequest) { return forward(req) }
export async function POST(req: NextRequest) { return forward(req) }
export async function PUT(req: NextRequest) { return forward(req) }
export async function DELETE(req: NextRequest) { return forward(req) }
export async function PATCH(req: NextRequest) { return forward(req) }
export async function HEAD(req: NextRequest) { return forward(req) }
export async function OPTIONS(req: NextRequest) { return forward(req) }
