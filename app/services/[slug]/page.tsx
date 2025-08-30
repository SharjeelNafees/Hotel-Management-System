import Link from 'next/link'
import { notFound } from 'next/navigation'

const SERVICES: Record<string, {
  title: string
  hero: string
  description: string
  packages: { name: string; price: string; details: string[] }[]
}> = {
  'restaurant': {
    title: 'Fine Dining Restaurant',
    hero: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Experience culinary excellence with seasonal menus crafted by our award-winning chefs. From breakfast to late-night dining, enjoy international cuisine with curated wine pairings.',
    packages: [
      { name: 'Breakfast Buffet', price: '$29 per person', details: ['6:30–10:30 AM', 'Hot & cold items', 'Fresh juices & coffee'] },
      { name: 'Chef\'s Tasting Menu', price: '$89 per person', details: ['6 courses', 'Wine pairing available', 'Reservation recommended'] },
      { name: 'Room Service', price: 'Menu pricing', details: ['Available 24/7', 'Signature dishes', 'Late-night options'] },
    ]
  },
  'spa': {
    title: 'Luxury Spa & Wellness',
    hero: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Rejuvenate body and mind with premium treatments in tranquil surroundings. Our therapists personalize each session for maximum relaxation and wellness.',
    packages: [
      { name: 'Swedish Massage (60 min)', price: '$99', details: ['Full-body massage', 'Essential oils', 'Add hot stones +$20'] },
      { name: 'Deep Tissue (90 min)', price: '$149', details: ['Targeted pressure', 'Muscle recovery', 'Post-treatment tea'] },
      { name: 'Couples Retreat (120 min)', price: '$279', details: ['Side-by-side massage', 'Facial & foot ritual', 'Champagne & fruit'] },
    ]
  },
  'events': {
    title: 'Event & Conference Halls',
    hero: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    description: 'Host memorable events with flexible layouts, pro AV, and expert planning. Ideal for conferences, galas, and private celebrations.',
    packages: [
      { name: 'Half-Day Meeting', price: '$799', details: ['Up to 50 guests', 'Projector & audio', 'Coffee break'] },
      { name: 'Full-Day Conference', price: '$1499', details: ['Up to 120 guests', 'Catering options', 'On-site coordinator'] },
      { name: 'Banquet Package', price: '$69 per person', details: ['3-course menu', 'Table settings', 'Dedicated service staff'] },
    ]
  },
  'business-center': {
    title: 'Business Center',
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    description: 'Stay productive with high-speed internet, printing, and private meeting rooms supported by our concierge team.',
    packages: [
      { name: 'Day Pass', price: '$25 per day', details: ['Workstations', 'High-speed WiFi', 'Printing (10 pages)'] },
      { name: 'Meeting Room (2 hrs)', price: '$60', details: ['Up to 6 people', 'Display screen', 'Coffee & water'] },
      { name: 'Executive Suite (Half Day)', price: '$149', details: ['Private office', 'Concierge support', 'Priority printing'] },
    ]
  },
  'valet-parking': {
    title: 'Valet Parking',
    hero: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Enjoy seamless arrivals with our secure 24/7 valet. EV charging and overnight options available.',
    packages: [
      { name: 'Hourly', price: '$5 per hour', details: ['First 30 min complimentary', 'Curbside drop-off', 'Priority retrieval'] },
      { name: 'Overnight', price: '$25 per night', details: ['24/7 security', 'Covered parking', 'In/out privileges'] },
      { name: 'EV Charging', price: '$10 add-on', details: ['Level 2 charging', 'Limited availability', 'Request on arrival'] },
    ]
  },
  'concierge': {
    title: 'Concierge Services',
    hero: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80',
    description: 'From curated city tours to last-minute reservations, our concierge team crafts experiences tailored to you.',
    packages: [
      { name: 'City Tour', price: '$59 per person', details: ['3-hour guided tour', 'Top landmarks', 'Hotel pickup'] },
      { name: 'Airport Transfer', price: '$39 one-way', details: ['Private sedan', 'Meet & greet', 'Bottled water'] },
      { name: 'Custom Itinerary', price: 'Varies', details: ['Dining reservations', 'Tickets & events', 'Personalized recommendations'] },
    ]
  }
}

export default function ServiceDetails({ params }: { params: { slug: string } }) {
  const service = SERVICES[params.slug]
  if (!service) return notFound()

  return (
    <main className="min-h-screen pt-24 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-200 blur-3xl opacity-40" />

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">{service.title}</h1>
            <p className="mt-1 text-sm text-gray-600">Explore details and pricing.</p>
          </div>
          <Link href="/#services" className="inline-flex items-center rounded-lg border px-4 py-2 text-primary-700 border-primary-200 hover:bg-primary-50">← Back to Services</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <img src={service.hero} alt={service.title} className="w-full h-80 object-cover rounded-2xl border" />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
            <p className="text-gray-700 mb-6">{service.description}</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Packages & Pricing</h2>
            <div className="space-y-4">
              {service.packages.map((p, i) => (
                <div key={i} className="rounded-xl border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {p.details.map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right">
                      <div className="text-primary-700 font-semibold">{p.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/booking" className="btn-primary">Book a Service</Link>
              <Link href="/contact" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Contact Concierge</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
