"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

 type RequestItem = {
  id: string
  type: 'housekeeping' | 'maintenance' | string
  room: string
  note?: string
  preferredTime?: string
  status: 'pending' | 'in_progress' | 'done' | string
  source?: string
  createdAt?: string
  updatedAt?: string
}

export default function RequestsPage() {
  const [items, setItems] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/v1/requests', { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to load requests (${res.status})`)
      setItems(await res.json())
    } catch (e: any) {
      setError(e.message || 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(r =>
      r.id.toLowerCase().includes(q) ||
      (r.type || '').toLowerCase().includes(q) ||
      (r.room || '').toLowerCase().includes(q) ||
      (r.note || '').toLowerCase().includes(q) ||
      (r.status || '').toLowerCase().includes(q)
    )
  }, [items, query])

  const cycleStatus = (s: RequestItem['status']): RequestItem['status'] => {
    if (s === 'pending') return 'in_progress'
    if (s === 'in_progress') return 'done'
    return 'pending'
  }

  const updateStatus = async (r: RequestItem, next?: RequestItem['status']) => {
    try {
      setError('')
      const res = await fetch(`/api/v1/requests/${r.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next ?? cycleStatus(r.status) }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      await fetchItems()
    } catch (e: any) {
      setError(e.message || 'Failed to update status')
    }
  }

  return (
    <main className="min-h-screen pt-24 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-200 blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Requests</h1>
            <p className="mt-1 text-sm text-gray-600">Manage housekeeping and maintenance tickets.</p>
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
          <div className="flex items-center justify-between mb-4 gap-3">
            <input
              placeholder="Search id, type, room, note, status..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="hidden md:block w-80 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
            />
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-full rounded-md bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (filtered.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-700 bg-slate-50">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Room</th>
                    <th className="py-2 pr-4">Preferred Time</th>
                    <th className="py-2 pr-4">Note</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50/60">
                      <td className="py-2 pr-4 font-medium">{r.id}</td>
                      <td className="py-2 pr-4 capitalize">{r.type}</td>
                      <td className="py-2 pr-4">{r.room}</td>
                      <td className="py-2 pr-4">{r.preferredTime || '-'}</td>
                      <td className="py-2 pr-4 max-w-xl truncate" title={r.note}>{r.note}</td>
                      <td className="py-2 pr-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${r.status === 'done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : r.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                          {r.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2 pr-0 text-right space-x-2">
                        <button className="inline-flex items-center rounded-md border px-2.5 py-1 text-sm text-primary-700 border-primary-200 hover:bg-primary-50" onClick={() => updateStatus(r)}>Next</button>
                        <div className="inline-flex items-center gap-1">
                          <select defaultValue={r.status} onChange={(e) => updateStatus(r, e.target.value as any)} className="rounded-md border px-2 py-1 text-sm">
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No requests yet. When guests submit housekeeping/maintenance via the chatbot, they will appear here.</div>
          ))}
        </div>
      </div>
    </main>
  )
}
