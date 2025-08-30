'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Customer = {
  id: string
  name: string
  email?: string
  phone?: string
  note?: string
  createdAt?: string
  updatedAt?: string
}

// Use Next.js API proxy (app/api/v1/[...path]) to avoid CORS and port issues
const API_BASE = ''

export default function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [success, setSuccess] = useState('')
  const [query, setQuery] = useState('')

  const emptyForm: Customer = useMemo(
    () => ({ id: '', name: '', email: '', phone: '', note: '' }),
    []
  )
  const [form, setForm] = useState<Customer>(emptyForm)

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`/api/v1/customers`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to load customers (${res.status})`)
      setItems(await res.json())
    } catch (e: any) {
      setError(e.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      const method = editing ? 'PUT' : 'POST'
      const url = editing
        ? `/api/v1/customers/${editing.id}`
        : `/api/v1/customers`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name?.trim(),
          email: form.email?.trim() || undefined,
          phone: form.phone?.trim() || undefined,
          note: form.note?.trim() || undefined,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setSuccess(editing ? 'Customer updated successfully.' : 'Customer added successfully.')
      setTimeout(() => setSuccess(''), 2000)
      setForm(emptyForm)
      setEditing(null)
      await fetchItems()
    } catch (e: any) {
      setError(e.message || 'Failed to save customer')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (c: Customer) => {
    setEditing(c)
    setForm({ ...c })
  }

  const handleDelete = async (c: Customer) => {
    if (!confirm(`Delete ${c.name}?`)) return
    try {
      setSaving(true)
      setError('')
      const res = await fetch(`/api/v1/customers/${c.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setSuccess('Deleted successfully.')
      setTimeout(() => setSuccess(''), 2000)
      await fetchItems()
    } catch (e: any) {
      setError(e.message || 'Failed to delete')
    } finally {
      setSaving(false)
    }
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.note || '').toLowerCase().includes(q)
    )
  }, [query, items])

  return (
    <main className="min-h-screen pt-24 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-200 blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-600">Manage guest records and notes. Export the list to Excel when needed.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/api/v1/customers/export`}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-amber-800 hover:bg-amber-100"
            >
              Export Excel
            </a>
            <Link href="/admin" className="inline-flex items-center rounded-lg border px-4 py-2 text-primary-700 border-primary-200 hover:bg-primary-50">← Back</Link>
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
              <h2 className="text-lg font-semibold mb-1">{editing ? 'Edit Customer' : 'Add Customer'}</h2>
              <p className="text-xs text-slate-500 mb-4">Capture guest details for quick reference.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                      value={form.email || ''}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                      value={form.phone || ''}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                  <textarea
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    rows={3}
                    value={form.note || ''}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary px-4 py-2 disabled:opacity-60 shadow-sm">
                    {saving ? 'Saving...' : editing ? 'Update' : 'Add Customer'}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      className="btn-gold px-4 py-2 shadow-sm"
                      onClick={() => { setEditing(null); setForm(emptyForm); }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
              <div className="flex items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-semibold">Directory</h2>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Search name, email, phone, note..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="hidden md:block w-72 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  />
                  <button onClick={fetchItems} disabled={loading} className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm text-primary-700 border-primary-200 hover:bg-primary-50 disabled:opacity-60">
                    {loading ? 'Refreshing…' : 'Refresh'}
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 w-full rounded-md bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="text-gray-500 text-sm">No customers yet. Add your first customer.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-gray-700 bg-slate-50">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Phone</th>
                        <th className="py-2 pr-4">Note</th>
                        <th className="py-2 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(filtered.length ? filtered : items).map((c) => (
                        <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50/60">
                          <td className="py-2 pr-4 font-medium">{c.name}</td>
                          <td className="py-2 pr-4">{c.email}</td>
                          <td className="py-2 pr-4">{c.phone}</td>
                          <td className="py-2 pr-4">{c.note}</td>
                          <td className="py-2 pr-0 text-right space-x-2">
                            <button className="inline-flex items-center rounded-md border px-2.5 py-1 text-sm text-primary-700 border-primary-200 hover:bg-primary-50" onClick={() => handleEdit(c)}>Edit</button>
                            <button className="inline-flex items-center rounded-md border px-2.5 py-1 text-sm text-red-700 border-red-200 hover:bg-red-50" onClick={() => handleDelete(c)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
