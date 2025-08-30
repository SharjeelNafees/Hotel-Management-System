"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Booking = {
  id: string
  roomId: string
  roomName: string
  pricePerNight: number
  checkin: string
  checkout: string
  guests: number
  name: string
  email?: string
  phone?: string
  total: number
  createdAt: string
}

export default function BookingsPage() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/v1/bookings', { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to load bookings (${res.status})`)
      setItems(await res.json())
    } catch (e: any) {
      setError(e.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen pt-24 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-200 blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Bookings</h1>
            <p className="mt-1 text-sm text-gray-600">View and manage reservations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchItems} disabled={loading} className="inline-flex items-center rounded-lg border px-4 py-2 text-primary-700 border-primary-200 hover:bg-primary-50 disabled:opacity-60">
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            <Link href="/admin" className="inline-flex items-center rounded-lg border px-4 py-2 text-primary-700 border-primary-200 hover:bg-primary-50">← Back</Link>
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-full rounded-md bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-gray-500 text-sm">No bookings yet. Create a booking from the website to see it here.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-700 bg-slate-50">
                    <th className="py-2 pr-4">Confirmation</th>
                    <th className="py-2 pr-4">Room</th>
                    <th className="py-2 pr-4">Guest</th>
                    <th className="py-2 pr-4">Dates</th>
                    <th className="py-2 pr-4">Guests</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(b => (
                    <tr key={b.id} className="border-b last:border-0 hover:bg-slate-50/60">
                      <td className="py-2 pr-4 font-medium">{b.id}</td>
                      <td className="py-2 pr-4">{b.roomName} (#{b.roomId})</td>
                      <td className="py-2 pr-4">{b.name}<div className="text-xs text-gray-500">{b.email || ''}{b.email && b.phone ? ' • ' : ''}{b.phone || ''}</div></td>
                      <td className="py-2 pr-4">{new Date(b.checkin).toLocaleDateString()} → {new Date(b.checkout).toLocaleDateString()}</td>
                      <td className="py-2 pr-4">{b.guests}</td>
                      <td className="py-2 pr-4">${'{'}b.total.toFixed(2){'}'}</td>
                      <td className="py-2 pr-4">{new Date(b.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
