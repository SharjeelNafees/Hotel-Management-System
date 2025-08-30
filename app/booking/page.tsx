'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Room = { id: string; name: string; capacity: number; price: number }

export default function BookingPage() {
  const params = useSearchParams()
  const preselectedRoomId = params.get('roomId') || ''
  const preselectedName = params.get('name') || ''

  const [roomId, setRoomId] = useState(preselectedRoomId)
  const [guests, setGuests] = useState<string>(params.get('guests') || '1')
  const [checkin, setCheckin] = useState<string>(params.get('checkin') || '')
  const [checkout, setCheckout] = useState<string>(params.get('checkout') || '')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [availabilityMsg, setAvailabilityMsg] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')

  const checkAvailability = async () => {
    setError(''); setAvailabilityMsg(''); setAvailableRooms([]); setConfirmation('')
    setLoading(true)
    try {
      const res = await fetch('/api/v1/availability', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkin, checkout, guests, roomId: roomId || undefined })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to check availability')
      setAvailableRooms(data.rooms || [])
      setAvailabilityMsg(data.available ? 'Good news! We have availability.' : 'Sorry, no rooms available for the selected dates.')
      if (!roomId && data.rooms?.[0]) setRoomId(data.rooms[0].id)
    } catch (e: any) {
      setError(e.message || 'Failed to check availability')
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async () => {
    setError(''); setConfirmation('')
    if (!roomId) { setError('Please select a room.'); return }
    if (!checkin || !checkout) { setError('Please select check-in and check-out dates.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, name: fullName, email, phone, checkin, checkout, guests })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Booking failed')
      setConfirmation(data.confirmation)
    } catch (e: any) {
      setError(e.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-24 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-200 blur-3xl opacity-40" />

      <div className="max-w-4xl mx-auto relative">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Booking</h1>
            <p className="mt-1 text-sm text-gray-600">Choose your dates, guests, and confirm your reservation.</p>
          </div>
          <Link href="/" className="inline-flex items-center rounded-lg border px-4 py-2 text-primary-700 border-primary-200 hover:bg-primary-50">← Home</Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 space-y-6">
          {/* Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Room</label>
              <input
                type="text"
                value={preselectedName || roomId}
                onChange={e => setRoomId(e.target.value)}
                className="input-field"
                placeholder={preselectedName ? `${preselectedName}` : 'Room ID (optional)'}
                disabled={!!preselectedRoomId}
              />
              {roomId && <div className="text-xs text-gray-500 mt-1">Selected: {preselectedName || `ID ${roomId}`}</div>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Guests</label>
              <input type="number" min={1} max={6} value={guests}
                     onChange={e => setGuests(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Check-in</label>
              <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Check-out</label>
              <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={checkAvailability} disabled={loading} className="btn-primary disabled:opacity-60">{loading ? 'Checking…' : 'Check Availability'}</button>
            <Link href="/#rooms" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Choose another room</Link>
          </div>

          {/* Availability result */}
          {availabilityMsg && (
            <div className="rounded-md border p-3 text-sm flex items-start gap-2"
                 style={{ borderColor: availableRooms.length ? '#BBF7D0' : '#FECACA', background: availableRooms.length ? '#F0FDF4' : '#FEF2F2', color: availableRooms.length ? '#166534' : '#991B1B' }}>
              <span className="mt-0.5">{availabilityMsg}</span>
            </div>
          )}
          {!!availableRooms.length && !preselectedRoomId && (
            <div className="text-sm text-gray-700">
              <div className="font-medium mb-2">Available rooms</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableRooms.map(r => (
                  <button key={r.id} onClick={() => setRoomId(r.id)}
                          className={`text-left rounded-lg border p-3 hover:bg-gray-50 ${roomId===r.id? 'border-primary-300 ring-1 ring-primary-200' : 'border-gray-200'}`}>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-gray-500">ID: {r.id} • Sleeps {r.capacity} • ${'{'}r.price{'}'}/night</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guest details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="+1 555 123 4567" />
            </div>
          </div>

          {error && <div className="rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm">{error}</div>}
          {confirmation && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 p-3 text-sm">
              Booking confirmed! Your confirmation number is <span className="font-semibold">{confirmation}</span>.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={createBooking} disabled={loading} className="btn-primary disabled:opacity-60">{loading ? 'Booking…' : 'Book Now'}</button>
            <Link href="/#rooms" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Back to Rooms</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
