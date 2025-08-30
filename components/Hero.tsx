'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDaysIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline'
import DatePicker from 'react-datepicker'

const Hero = () => {
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(2)

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates')
      return
    }
    // Navigate to booking page with selected dates
    window.location.href = `/booking?checkin=${checkIn.toISOString()}&checkout=${checkOut.toISOString()}&guests=${guests}`
  }

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-gold-900/60 absolute z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Hotel Nova Luxury"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Welcome to{' '}
            <span className="text-gradient bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              Hotel Nova
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Experience luxury redefined with world-class amenities, exceptional service, 
            and unforgettable moments in the heart of the city.
          </p>
        </motion.div>

        {/* Booking Widget */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Book Your Stay</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Check-in */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                <CalendarDaysIcon className="w-4 h-4 inline mr-2" />
                Check-in
              </label>
              <DatePicker
                selected={checkIn}
                onChange={(date: Date | null) => setCheckIn(date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                placeholderText="Select date"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-gold-400 focus:border-transparent"
              />
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                <CalendarDaysIcon className="w-4 h-4 inline mr-2" />
                Check-out
              </label>
              <DatePicker
                selected={checkOut}
                onChange={(date: Date | null) => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn}
                placeholderText="Select date"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-gold-400 focus:border-transparent"
              />
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                <UserGroupIcon className="w-4 h-4 inline mr-2" />
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-gold-400 focus:border-transparent"
              >
                {[1,2,3,4,5,6].map(num => (
                  <option key={num} value={num} className="text-gray-900">
                    {num} Guest{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Button */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-transparent">Book</label>
              <button
                onClick={handleBooking}
                className="w-full btn-gold h-12"
              >
                Check Availability
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center text-sm text-gray-300">
            <MapPinIcon className="w-4 h-4 mr-2" />
            Located in the heart of the city • Best rates guaranteed
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
