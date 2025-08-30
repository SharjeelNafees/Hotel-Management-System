export const metadata = {
  title: 'Admin Panel | Hotel Nova',
}

export default function AdminPage() {
  return (
    <main className="min-h-screen pt-24 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-200 blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage your hotel operations from a single, elegant dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/admin/staff" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-all">
            <div className="text-2xl mb-2">👩‍🍳</div>
            <h2 className="text-lg font-semibold mb-1">Staff Management</h2>
            <p className="text-sm text-gray-600">Manage hotel staff records and employee IDs.</p>
          </a>
          <a href="/admin/customers" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-all">
            <div className="text-2xl mb-2">🧑‍💼</div>
            <h2 className="text-lg font-semibold mb-1">Customers</h2>
            <p className="text-sm text-gray-600">Manage customer profiles and export to Excel.</p>
          </a>
          <a href="/admin/bookings" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-all">
            <div className="text-2xl mb-2">📖</div>
            <h2 className="text-lg font-semibold mb-1">Bookings</h2>
            <p className="text-sm text-gray-600">View and manage reservations.</p>
          </a>

          <a href="/admin/requests" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-all">
            <div className="text-2xl mb-2">🧹</div>
            <h2 className="text-lg font-semibold mb-1">Requests</h2>
            <p className="text-sm text-gray-600">Housekeeping and maintenance tickets.</p>
          </a>

          <a href="/admin/rooms" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-all">
            <div className="text-2xl mb-2">🛏️</div>
            <h2 className="text-lg font-semibold mb-1">Rooms</h2>
            <p className="text-sm text-gray-600">Create, edit, and categorize rooms.</p>
          </a>

          <a href="/admin/guests" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-all">
            <div className="text-2xl mb-2">🧳</div>
            <h2 className="text-lg font-semibold mb-1">Guests</h2>
            <p className="text-sm text-gray-600">Manage guest profiles and history.</p>
          </a>

          <a href="/admin/payments" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-all">
            <div className="text-2xl mb-2">💳</div>
            <h2 className="text-lg font-semibold mb-1">Payments</h2>
            <p className="text-sm text-gray-600">Track invoices and transactions.</p>
          </a>

          <a href="/admin/reports" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-all">
            <div className="text-2xl mb-2">📊</div>
            <h2 className="text-lg font-semibold mb-1">Reports</h2>
            <p className="text-sm text-gray-600">Generate occupancy and revenue reports.</p>
          </a>

          <a href="/admin/settings" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 hover:shadow-xl transition-all">
            <div className="text-2xl mb-2">⚙️</div>
            <h2 className="text-lg font-semibold mb-1">Settings</h2>
            <p className="text-sm text-gray-600">Configure hotel details and policies.</p>
          </a>
        </div>
      </div>
    </main>
  )
}
