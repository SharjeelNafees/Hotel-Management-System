'use client'

import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

const RoomShowcase = () => {
  const rooms = [
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

  return (
    <section id="rooms" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Luxury Rooms & Suites
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully designed accommodations, each offering comfort, 
            elegance, and breathtaking views
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-gold-500" />
                    <span className="text-sm font-medium">{room.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary-600">${room.price}</span>
                    <span className="text-gray-500 text-sm">/night</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{room.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <Link
                    href={`/booking?roomId=${room.id}&name=${encodeURIComponent(room.name)}`}
                    className="flex-1 btn-primary text-center"
                  >
                    Book Now
                  </Link>
                  <Link
                    href={`/rooms/${room.id}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RoomShowcase
