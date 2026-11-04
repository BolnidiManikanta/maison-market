'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
  User,
  ShoppingBag,
  Wrench,
  ChevronRight,
  Sparkles,
  Phone,
} from 'lucide-react'
import {
  getBookings,
  cancelBooking,
  onBookingsChanged,
  type ServiceBooking,
  type BookingStatus,
} from '@/lib/bookings'

export default function AccountView({ initialTab = 'bookings' }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders' | 'profile'>(
    initialTab === 'orders' ? 'orders' : initialTab === 'profile' ? 'profile' : 'bookings'
  )
  const [bookings, setBookings] = useState<ServiceBooking[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [cancelModalBooking, setCancelModalBooking] = useState<ServiceBooking | null>(null)
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null)

  useEffect(() => {
    setBookings(getBookings())
    const unsubscribe = onBookingsChanged((latest) => {
      setBookings(latest)
    })
    return () => unsubscribe()
  }, [])

  // Check URL query on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      if (tabParam === 'bookings' || tabParam === 'orders' || tabParam === 'profile') {
        setActiveTab(tabParam)
      }
    }
  }, [])

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'All') return true
    return b.bookingStatus.toLowerCase() === statusFilter.toLowerCase()
  })

  function handleConfirmCancel() {
    if (!cancelModalBooking) return
    const res = cancelBooking(cancelModalBooking.id)
    if (res) {
      setBookings(getBookings())
      setFeedbackNotice(`Booking #${cancelModalBooking.id} has been cancelled.`)
      setTimeout(() => setFeedbackNotice(null), 5000)
    }
    setCancelModalBooking(null)
  }

  function getStatusBadgeClass(status: BookingStatus) {
    switch (status) {
      case 'Confirmed':
        return 'bg-[#edf4e9] text-[#205234] border-[#c4dcbe]'
      case 'Assigned':
        return 'bg-[#edf4fb] text-[#194b7d] border-[#c0d6ee]'
      case 'In Progress':
        return 'bg-[#fef7e7] text-[#935b0b] border-[#f4dfb2]'
      case 'Completed':
        return 'bg-[#f0f2eb] text-[#4d5e55] border-[#d5ded2]'
      case 'Cancelled':
        return 'bg-[#fbeeed] text-[#9c2b26] border-[#f3c2c0]'
      default:
        return 'bg-[#f0f2eb] text-[#4d5e55] border-[#dfe4dc]'
    }
  }

  return (
    <main className="route-page bg-[#f6f5f0] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link href="/" className="text-xs font-bold text-[#65766e] hover:text-[#173b32]">
            ← Back to home
          </Link>
        </div>

        {/* Page Top Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c89c47]">
              TECHIESMART · ACCOUNT & PARTICIPATION
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#173b32] mt-1">
              Your Account
            </h1>
            <p className="text-sm text-[#65766e] mt-1">
              Manage your orders, doorstep service bookings, and neighbourhood deliveries.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/serv-mart"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#173b32] text-white text-xs font-bold rounded-lg hover:bg-[#112d26] transition-colors"
            >
              <Wrench size={14} /> Book a Service
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#173b32] text-[#173b32] text-xs font-bold rounded-lg hover:bg-white transition-colors"
            >
              <ShoppingBag size={14} /> Shop Catalog
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackNotice && (
          <div className="mb-6 p-3 bg-[#fbeeed] border border-[#f3c2c0] rounded-xl text-xs text-[#9c2b26] flex items-center justify-between">
            <span>{feedbackNotice}</span>
            <button onClick={() => setFeedbackNotice(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex gap-2 border-b border-[#dfe4dc] pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-[#173b32] text-white shadow-sm'
                : 'bg-white text-[#173b32] border border-[#dfe4dc] hover:bg-[#edf2ec]'
            }`}
          >
            <Wrench size={14} /> My Bookings
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'bookings' ? 'bg-[#c89c47] text-white' : 'bg-[#e9ece5] text-[#173b32]'
              }`}
            >
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#173b32] text-white shadow-sm'
                : 'bg-white text-[#173b32] border border-[#dfe4dc] hover:bg-[#edf2ec]'
            }`}
          >
            <ShoppingBag size={14} /> Orders & Deliveries
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#173b32] text-white shadow-sm'
                : 'bg-white text-[#173b32] border border-[#dfe4dc] hover:bg-[#edf2ec]'
            }`}
          >
            <User size={14} /> Profile & Addresses
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: MY BOOKINGS                                                        */}
        {/* ========================================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs text-[#65766e] font-semibold mr-1">Filter:</span>
              {['All', 'Confirmed', 'Assigned', 'In Progress', 'Completed', 'Cancelled'].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? 'bg-[#173b32] text-white'
                        : 'bg-white text-[#65766e] border border-[#dfe4dc] hover:border-[#173b32]'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 && (
              <div className="bg-white border border-[#dfe4dc] rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#f6f5f0] text-[#65766e] flex items-center justify-center mx-auto">
                  <Wrench size={24} />
                </div>
                <h3 className="text-base font-bold text-[#173b32]">No service bookings found</h3>
                <p className="text-xs text-[#65766e] max-w-sm mx-auto">
                  {statusFilter === 'All'
                    ? "You haven't booked any doorstep services yet. Browse Serv Mart to schedule verified cleaning, plumbing, or appliance experts."
                    : `No service bookings with status "${statusFilter}".`}
                </p>
                <Link
                  href="/serv-mart"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#173b32] text-white text-xs font-bold rounded-lg hover:bg-[#112d26] transition-colors"
                >
                  Explore Serv Mart <ChevronRight size={14} />
                </Link>
              </div>
            )}

            {/* Bookings List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredBookings.map((b) => {
                const canCancel = b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Completed'
                return (
                  <article
                    key={b.id}
                    className="bg-white border border-[#dfe4dc] rounded-xl p-5 shadow-sm space-y-4 hover:border-[#173b32] transition-colors"
                  >
                    {/* Header line: Booking ID + Status Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dfe4dc] pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#173b32] bg-[#f6f5f0] px-2 py-0.5 rounded border border-[#dfe4dc]">
                          BOOKING #{b.id}
                        </span>
                        <span className="text-[11px] text-[#65766e] ml-2">
                          Booked on {new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                            b.bookingStatus
                          )}`}
                        >
                          Status: {b.bookingStatus}
                        </span>
                      </div>
                    </div>

                    {/* Middle grid: Service details, Schedule, Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Service Info */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#c89c47] tracking-wider block">
                          SERVICE
                        </span>
                        <h3 className="text-sm font-bold text-[#173b32] mt-0.5 leading-snug">
                          {b.serviceName}
                        </h3>
                        <p className="text-[#65766e] mt-1">Crew: {b.provider}</p>
                        <p className="text-[#65766e]">Category: {b.category}</p>
                      </div>

                      {/* Schedule Info */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#c89c47] tracking-wider block">
                          DATE & TIME
                        </span>
                        <p className="font-semibold text-[#173b32] flex items-center gap-1.5 mt-1">
                          <Calendar size={13} className="text-[#65766e]" /> {b.date}
                        </p>
                        <p className="font-semibold text-[#173b32] flex items-center gap-1.5 mt-1">
                          <Clock size={13} className="text-[#65766e]" /> {b.timeSlot}
                        </p>
                      </div>

                      {/* Address & Recipient */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#c89c47] tracking-wider block">
                          SERVICE LOCATION
                        </span>
                        <p className="text-[#173b32] mt-1 font-medium leading-relaxed">
                          <MapPin size={13} className="inline text-[#65766e] mr-1" />
                          {b.customer.address}
                          {b.customer.landmark ? `, Near ${b.customer.landmark}` : ''},{' '}
                          {b.customer.city} - {b.customer.pincode}
                        </p>
                        <p className="text-[#65766e] mt-1 flex items-center gap-1">
                          <User size={12} /> {b.customer.name} · <Phone size={12} /> +91{' '}
                          {b.customer.phone}
                        </p>
                      </div>
                    </div>

                    {/* Footer Row: Payment Info + Amount + Actions */}
                    <div className="border-t border-[#dfe4dc] pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-[#65766e] block text-[11px]">Total Amount:</span>
                          <strong className="text-base font-extrabold text-[#173b32]">
                            ₹{b.amount.toLocaleString('en-IN')}
                          </strong>
                        </div>
                        <div className="border-l border-[#dfe4dc] pl-4">
                          <span className="text-[#65766e] block text-[11px]">Payment:</span>
                          <span className="font-semibold text-[#173b32]">
                            {b.paymentStatus} ({b.paymentMethod})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelModalBooking(b)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#9c2b26] border border-[#f3c2c0] hover:bg-[#fbeeed] rounded-lg transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}
                        {b.bookingStatus === 'Cancelled' && (
                          <span className="text-xs text-[#9c2b26] italic">
                            Cancelled upon user request
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ORDERS & DELIVERIES                                                */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#dfe4dc] rounded-2xl p-8 space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#173b32]">Commerce Orders</h2>
            <p className="text-[#65766e]">
              Orders placed in the marketplace with BOGO savings, community dispatch, and fresh grocery delivery will appear here.
            </p>
            <div className="p-4 bg-[#fbfcf9] border border-[#dfe4dc] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#173b32]">Demo Order #MM-2026-9041</span>
                <p className="text-[#65766e] mt-0.5">3 items · ₹648 (Saved ₹299 with BOGO) · Delivered to Wakad, Pune</p>
              </div>
              <span className="text-xs font-bold text-[#205234] bg-[#edf4e9] px-2.5 py-1 rounded-full border border-[#c4dcbe]">
                Delivered
              </span>
            </div>
            <Link href="/shop" className="inline-block mt-2 text-xs font-bold text-[#173b32] underline">
              Browse products catalog →
            </Link>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PROFILE & ADDRESSES                                                */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-[#dfe4dc] rounded-2xl p-8 space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#173b32]">Customer Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#fbfcf9] border border-[#dfe4dc] rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#c89c47]">PRIMARY CONTACT</span>
                <p className="font-bold text-sm text-[#173b32]">Manikanta Rao</p>
                <p className="text-[#65766e]">Phone: +91 9876543210</p>
                <p className="text-[#65766e]">Email: manikanta@example.com</p>
              </div>
              <div className="p-4 bg-[#fbfcf9] border border-[#dfe4dc] rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#c89c47]">SAVED SERVICE ADDRESS</span>
                <p className="font-bold text-sm text-[#173b32]">Flat 402, Tower B, Rohan Tarang</p>
                <p className="text-[#65766e]">Near Datta Mandir, Wakad</p>
                <p className="text-[#65766e]">Pune, Maharashtra - 411057</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CANCELLATION CONFIRMATION DIALOG                                          */}
        {/* ========================================================================= */}
        {cancelModalBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-dialog-title"
          >
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#dfe4dc] shadow-2xl space-y-4 text-sm text-[#173b32]">
              <div className="flex items-center gap-3 text-[#9c2b26]">
                <div className="w-10 h-10 rounded-full bg-[#fbeeed] flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 id="cancel-dialog-title" className="text-base font-bold text-[#173b32]">
                    Cancel Booking?
                  </h3>
                  <p className="text-xs text-[#65766e]">
                    Are you sure you want to cancel this booking?
                  </p>
                </div>
              </div>

              <div className="bg-[#f9faf7] border border-[#dfe4dc] rounded-xl p-3.5 space-y-1.5 text-xs">
                <p>
                  <span className="text-[#65766e]">Booking ID:</span>{' '}
                  <strong className="font-mono text-[#173b32]">{cancelModalBooking.id}</strong>
                </p>
                <p>
                  <span className="text-[#65766e]">Service:</span>{' '}
                  <strong className="text-[#173b32]">{cancelModalBooking.serviceName}</strong>
                </p>
                <p>
                  <span className="text-[#65766e]">Scheduled for:</span>{' '}
                  <strong className="text-[#173b32]">
                    {cancelModalBooking.date} ({cancelModalBooking.timeSlot})
                  </strong>
                </p>
                <p>
                  <span className="text-[#65766e]">Amount:</span>{' '}
                  <strong className="text-[#173b32]">
                    ₹{cancelModalBooking.amount.toLocaleString('en-IN')}
                  </strong>
                </p>
              </div>

              <p className="text-xs text-[#65766e]">
                Your booking record will be updated to <b>Cancelled</b>. You will not be charged or assigned a crew.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 text-xs font-bold text-[#65766e] hover:text-[#173b32] rounded-lg transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 text-xs font-bold bg-[#9c2b26] text-white rounded-lg hover:bg-[#81221e] transition-colors shadow-sm"
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
