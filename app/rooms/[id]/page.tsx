import Link from 'next/link'
import { notFound } from 'next/navigation'

const ROOMS = [
  {
    id: 1,
    name: 'Deluxe Ocean View',
    price: 299,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    amenities: ['Ocean View', 'King Bed', 'Mini Bar', 'WiFi'],
    rating: 4.8,
    description: 'Spacious room with stunning ocean views and luxury amenities'
  },
  {
    id: 2,
    name: 'Family Suite',
    price: 449,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    amenities: ['2 Bedrooms', 'Living Area', 'Kitchenette', 'Balcony'],
    rating: 4.9,
    description: 'Perfect for families with separate bedrooms and living space'
  },
  {
    id: 3,
    name: 'Presidential Suite',
    price: 899,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
    amenities: ['Panoramic View', 'Jacuzzi', 'Butler Service', 'Private Terrace'],
    rating: 5.0,
    description: 'Ultimate luxury with premium amenities and personalized service'
  }
]

export default function RoomDetails({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const room = ROOMS.find(r => r.id === id)
  if (!room) return notFound()

  return (
    <main className="min-h-screen pt-24 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-200 blur-3xl opacity-40" />

      <div className="max-w-5xl mx-auto relative">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">{room.name}</h1>
            <p className="mt-1 text-sm text-gray-600">Rated {room.rating}★ • ${room.price}/night</p>
          </div>
          <Link href="/" className="inline-flex items-center rounded-lg border px-4 py-2 text-primary-700 border-primary-200 hover:bg-primary-50">← Home</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <img src={room.image} alt={room.name} className="w-full h-80 object-cover rounded-2xl border" />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
            <p className="text-gray-700 mb-4">{room.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {room.amenities.map((a, i) => (
                <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">{a}</span>
              ))}
            </div>
            <div className="flex gap-3">
              <Link href={`/booking?roomId=${room.id}&name=${encodeURIComponent(room.name)}`} className="btn-primary">Book Now</Link>
              <Link href="/#rooms" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Back to rooms</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
