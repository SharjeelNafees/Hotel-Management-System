'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BuildingOffice2Icon, 
  HeartIcon, 
  CakeIcon, 
  WifiIcon,
  TruckIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline'

const Services = () => {
  const services = [
    {
      slug: 'restaurant',
      icon: <CakeIcon className="w-8 h-8" />,
      title: 'Fine Dining Restaurant',
      description: 'Experience culinary excellence with our award-winning chefs and international cuisine',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    },
    {
      slug: 'spa',
      icon: <HeartIcon className="w-8 h-8" />,
      title: 'Luxury Spa & Wellness',
      description: 'Rejuvenate your body and mind with our world-class spa treatments and wellness programs',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    },
    {
      slug: 'events',
      icon: <BuildingOffice2Icon className="w-8 h-8" />,
      title: 'Event & Conference Halls',
      description: 'Host memorable events with our state-of-the-art facilities and professional event planning',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
    },
    {
      slug: 'business-center',
      icon: <WifiIcon className="w-8 h-8" />,
      title: 'Business Center',
      description: 'Fully equipped business facilities with high-speed internet and meeting rooms',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
    },
    {
      slug: 'valet-parking',
      icon: <TruckIcon className="w-8 h-8" />,
      title: 'Valet Parking',
      description: 'Complimentary valet parking service for all our guests with 24/7 security',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    },
    {
      slug: 'concierge',
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: 'Concierge Services',
      description: 'Personalized assistance for tours, transportation, and local recommendations',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80'
    }
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Services & Facilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Indulge in our comprehensive range of services designed to make your stay extraordinary
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/services/${service.slug}`} className="block">
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="text-gold-400">
                        {service.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                <Link href={`/services/${service.slug}`} className="inline-block text-primary-600 font-medium hover:text-primary-700 transition-colors">
                  Learn More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            24/7 Premium Support
          </h3>
          <p className="text-xl mb-8 text-primary-100">
            Our dedicated team is always available to ensure your comfort and satisfaction
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gold-300">24/7</div>
              <div className="text-primary-100">Room Service</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gold-300">100%</div>
              <div className="text-primary-100">Guest Satisfaction</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gold-300">5★</div>
              <div className="text-primary-100">Luxury Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
