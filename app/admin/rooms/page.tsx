import Link from 'next/link'

export const metadata = { title: 'Rooms | Admin | Hotel Nova' }

export default function RoomsPage() {
  return (
    <main className="min-h-screen pt-24 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-200 blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Rooms</h1>
            <p className="mt-1 text-sm text-gray-600">Create, edit, and categorize rooms. (Coming soon)</p>
          </div>
          <Link href="/admin" className="inline-flex items-center rounded-lg border px-4 py-2 text-primary-700 border-primary-200 hover:bg-primary-50">← Back</Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
          <p className="text-gray-600">This module will allow room CRUD and categories. Placeholder for now.</p>
        </div>
      </div>
    </main>
  )
}
