'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { products } from '@/data/products'
import { buysProducts, resellerListings, saleProducts, serviceCatalog } from '@/data/marketplaces'
import {
  getBookings,
  updateBookingStatus,
  onBookingsChanged,
  type ServiceBooking,
  type BookingStatus,
} from '@/lib/bookings'
import { Calendar, Clock, MapPin, User, Phone, CheckCircle2, ChevronRight, Wrench } from 'lucide-react'

const STATUS_OPTIONS: BookingStatus[] = [
  'Pending',
  'Confirmed',
  'Assigned',
  'In Progress',
  'Completed',
  'Cancelled',
]

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<ServiceBooking[]>([])
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All')
  const [adminNotice, setAdminNotice] = useState<string | null>(null)

  useEffect(() => {
    setBookings(getBookings())
    const unsubscribe = onBookingsChanged((latest) => {
      setBookings(latest)
    })
    return () => unsubscribe()
  }, [])

  function handleStatusChange(id: string, newStatus: BookingStatus) {
    const updated = updateBookingStatus(id, newStatus)
    if (updated) {
      setBookings(getBookings())
      setAdminNotice(`Booking #${id} updated to ${newStatus}`)
      setTimeout(() => setAdminNotice(null), 4000)
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (selectedStatusFilter === 'All') return true
    return b.bookingStatus.toLowerCase() === selectedStatusFilter.toLowerCase()
  })

  const cards = [
    ['Products', products.length, '/shop'],
    ['Services', serviceCatalog.length, '/serv-mart'],
    ['Service Bookings', bookings.length, '#service-bookings'],
    ['Resellers', resellerListings.length, '/resellers'],
    ['Buys', buysProducts.length, '/buys'],
    ['Sale items', saleProducts.length, '/sale'],
    ['Communities', 3, '/community'],
  ]

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-top">
          <div>
            <p className="eyebrow">MAISONMARKET · OPERATIONS</p>
            <h1>Admin dashboard</h1>
            <p>
              Demo operations console for catalog, marketplaces, services, and doorstep booking coordination.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="button secondary">
              View storefront
            </Link>
            <Link href="/serv-mart" className="button primary">
              Serv Mart →
            </Link>
          </div>
        </div>

        {adminNotice && (
          <div className="mb-4 p-3 bg-[#edf4e9] border border-[#cbdcc8] rounded-lg text-xs text-[#205234] font-medium">
            {adminNotice}
          </div>
        )}

        {/* Operational metric cards */}
        <div className="admin-grid">
          {cards.map(([label, count, href]) => (
            <Link className="admin-card" href={href as string} key={label as string}>
              <span>{label}</span>
              <strong>{count}</strong>
              <small>Open workspace →</small>
            </Link>
          ))}
        </div>

        {/* Service Bookings Console */}
        <section id="service-bookings" className="admin-table mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-0 pb-2">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#173b32] m-0">
                Service Bookings Console ({bookings.length})
              </h2>
              <p className="text-xs text-[#65766e] mt-0.5">
                Real-time feed of doorstep appointments booked through Serv Mart.
              </p>
            </div>
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['All', 'Confirmed', 'Assigned', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-full border text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedStatusFilter === st
                      ? 'bg-[#173b32] text-white border-[#173b32]'
                      : 'bg-white text-[#65766e] border-[#dfe4dc] hover:border-[#173b32]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 border-t border-[#dfe4dc] text-xs text-[#65766e]">
              <p>No bookings matching &ldquo;{selectedStatusFilter}&rdquo;.</p>
              <Link href="/serv-mart" className="text-[#173b32] font-bold underline mt-2 inline-block">
                Go to Serv Mart to book a service →
              </Link>
            </div>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-[#dfe4dc] text-[#65766e] uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Booking ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Service</th>
                    <th className="py-2.5 px-3">Schedule</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe4dc]">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#fbfcf9] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#173b32] whitespace-nowrap">
                        {b.id}
                      </td>
                      <td className="py-3 px-3">
                        <strong className="block text-[#173b32]">{b.customer.name}</strong>
                        <span className="text-[#65766e] text-[11px]">+91 {b.customer.phone}</span>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="block text-[#173b32]">{b.serviceName}</strong>
                        <span className="text-[#65766e] text-[11px]">By {b.provider}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-[#173b32]">{b.date}</div>
                        <div className="text-[11px] text-[#65766e]">{b.timeSlot}</div>
                      </td>
                      <td className="py-3 px-3 max-w-[200px]">
                        <span className="block truncate" title={`${b.customer.address}, ${b.customer.city}`}>
                          {b.customer.address}
                        </span>
                        <span className="text-[11px] text-[#65766e]">
                          {b.customer.city} - {b.customer.pincode}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-bold text-[#173b32]">
                        ₹{b.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            b.paymentStatus === 'Paid'
                              ? 'bg-[#edf4e9] text-[#205234]'
                              : 'bg-[#fef7e7] text-[#935b0b]'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                        <span className="block text-[10px] text-[#65766e] truncate max-w-[120px]">
                          {b.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={b.bookingStatus}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                          className={`px-2 py-1 rounded text-xs font-bold border focus:outline-none focus:ring-1 ${
                            b.bookingStatus === 'Confirmed'
                              ? 'bg-[#edf4e9] text-[#205234] border-[#c4dcbe]'
                              : b.bookingStatus === 'Assigned'
                              ? 'bg-[#edf4fb] text-[#194b7d] border-[#c0d6ee]'
                              : b.bookingStatus === 'In Progress'
                              ? 'bg-[#fef7e7] text-[#935b0b] border-[#f4dfb2]'
                              : b.bookingStatus === 'Completed'
                              ? 'bg-[#f0f2eb] text-[#4d5e55] border-[#d5ded2]'
                              : b.bookingStatus === 'Cancelled'
                              ? 'bg-[#fbeeed] text-[#9c2b26] border-[#f3c2c0]'
                              : 'bg-[#f0f2eb] text-[#4d5e55] border-[#dfe4dc]'
                          }`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Operations checklist */}
        <section className="admin-table mt-6">
          <h2>Operations checklist</h2>
          {[
            'Catalog image validation',
            'BOGO campaign review',
            'Service provider availability',
            'Reseller listing moderation',
            'Refurbished inspection records',
            'Community code requests',
          ].map((x, i) => (
            <div key={x}>
              <span>{x}</span>
              <b>{i < 3 ? 'Ready' : 'Demo queue'}</b>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
