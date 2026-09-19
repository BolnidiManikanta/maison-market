'use client'

import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  CreditCard,
  Building2,
  Banknote,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  AlertCircle,
  Smartphone,
} from 'lucide-react'
import type { Service } from '@/data/marketplaces'
import { createBooking, type ServiceBooking } from '@/lib/bookings'

interface ServiceBookingModalProps {
  service: Service | null
  onClose: () => void
  onSuccess?: (booking: ServiceBooking) => void
  defaultLocation?: string
}

const TIME_SLOTS = [
  '9:00 AM – 11:00 AM',
  '11:00 AM – 1:00 PM',
  '1:00 PM – 3:00 PM',
  '3:00 PM – 5:00 PM',
  '5:00 PM – 7:00 PM',
]

const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India (SBI)', 'Axis Bank', 'Kotak Mahindra']

export default function ServiceBookingModal({
  service,
  onClose,
  onSuccess,
  defaultLocation = 'Wakad, Pune',
}: ServiceBookingModalProps) {
  // Today formatted as YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  // Tomorrow formatted as YYYY-MM-DD for default booking
  const tomorrowStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  // Wizard steps: 'details' -> 'payment' -> 'confirmed'
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details')

  // Customer Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [city, setCity] = useState(defaultLocation.includes(',') ? defaultLocation.split(',')[1].trim() : 'Pune')
  const [pincode, setPincode] = useState('411057')
  const [date, setDate] = useState(tomorrowStr)
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0])
  const [notes, setNotes] = useState('')

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Service'>('UPI')
  const [upiOption, setUpiOption] = useState<'PhonePe' | 'Google Pay' | 'Paytm' | 'ID'>('PhonePe')
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [selectedBank, setSelectedBank] = useState(BANKS[0])
  const [isProcessing, setIsProcessing] = useState(false)

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createdBooking, setCreatedBooking] = useState<ServiceBooking | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  if (!service) return null

  // Price calculations - never hardcoded!
  const serviceCharge = service.price
  const taxesAndFees = Math.round(serviceCharge * 0.05) // 5% GST & safety platform fee
  const totalAmount = serviceCharge + taxesAndFees

  function validateDetails(): boolean {
    const errs: Record<string, string> = {}

    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Full Name is required (at least 2 characters)'
    }

    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number'
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address'
    }

    if (!address.trim() || address.trim().length < 5) {
      errs.address = 'Complete address is required (house/flat no., building, street)'
    }

    if (!city.trim()) {
      errs.city = 'City is required'
    }

    const cleanPin = pincode.replace(/\D/g, '')
    if (!cleanPin || cleanPin.length !== 6) {
      errs.pincode = 'Please enter a valid 6-digit postal pincode'
    }

    if (!date) {
      errs.date = 'Preferred date is required'
    } else if (date < todayStr) {
      errs.date = 'Booking date cannot be in the past'
    }

    if (!timeSlot) {
      errs.timeSlot = 'Preferred time slot is required'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleContinueToPayment(e: React.FormEvent) {
    e.preventDefault()
    if (validateDetails()) {
      setStep('payment')
    }
  }

  function handleProcessPayment(e: React.FormEvent) {
    e.preventDefault()
    if (!service) return
    const activeService = service
    setIsProcessing(true)

    // Simulate payment handling with clear demo architecture
    setTimeout(() => {
      const paymentDetailText =
        paymentMethod === 'UPI'
          ? `UPI (${upiOption === 'ID' && upiId ? upiId : upiOption})`
          : paymentMethod === 'Credit / Debit Card'
          ? `Card (ending in ${cardNumber.slice(-4) || '4242'})`
          : paymentMethod === 'Net Banking'
          ? `Net Banking (${selectedBank})`
          : 'Cash on Service'

      const paymentStatus: 'Paid' | 'Pay on Service' =
        paymentMethod === 'Cash on Service' ? 'Pay on Service' : 'Paid'

      const newBooking = createBooking({
        serviceId: activeService.id,
        serviceName: activeService.name,
        provider: activeService.provider,
        category: activeService.category,
        image: activeService.image,
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: address.trim(),
          landmark: landmark.trim() || undefined,
          city: city.trim(),
          pincode: pincode.trim(),
        },
        date,
        timeSlot,
        serviceCharge,
        taxesAndFees,
        amount: totalAmount,
        paymentMethod: paymentDetailText,
        paymentStatus,
        bookingStatus: 'Confirmed',
        notes: notes.trim() || undefined,
      })

      setCreatedBooking(newBooking)
      setIsProcessing(false)
      setStep('confirmed')
      if (onSuccess) {
        onSuccess(newBooking)
      }
    }, 900)
  }

  const modalContent = (
    <div
      id="service-booking-modal-overlay"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: 'rgba(14, 38, 32, 0.75)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-[#ffffff] rounded-2xl shadow-2xl border border-[#dfe4dc] my-auto overflow-hidden text-[#173b32] flex flex-col max-h-[92vh]"
        style={{ fontFamily: 'Arial, sans-serif' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#dfe4dc] bg-[#fbfcf9]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#173b32] text-white text-xs font-bold font-serif italic">
              m
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#c89c47] uppercase">
                SERV MART · BOOKING WORKSPACE
              </p>
              <h2 id="booking-modal-title" className="text-base sm:text-lg font-bold text-[#173b32] leading-tight">
                {step === 'details' && 'Book Doorstep Service'}
                {step === 'payment' && 'Confirm & Payment'}
                {step === 'confirmed' && 'Booking Confirmed'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#65766e] hover:text-[#173b32] hover:bg-[#edf2ec] rounded-lg transition-colors"
            aria-label="Close booking modal"
          >
            <X size={19} />
          </button>
        </div>

        {/* Selected Service Ribbon (always visible during details & payment) */}
        {step !== 'confirmed' && (
          <div className="bg-[#f6f5f0] px-5 py-3 border-b border-[#dfe4dc] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-12 h-12 object-cover rounded-lg border border-[#dfe4dc] shrink-0"
                />
              )}
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c89c47]">
                  {service.category}
                </span>
                <h3 className="text-sm font-bold text-[#173b32] truncate leading-tight">
                  {service.name}
                </h3>
                <p className="text-xs text-[#65766e] truncate">
                  By {service.provider} · <MapPin size={11} className="inline mr-0.5" />
                  {service.location}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-[#65766e] block">Service Fee</span>
              <strong className="text-base sm:text-lg font-bold text-[#173b32]">
                ₹{service.price.toLocaleString('en-IN')}
              </strong>
              <small className="block text-[10px] text-[#65766e]">{service.priceType}</small>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 text-sm">
          {/* ========================================================================= */}
          {/* STEP 1: CUSTOMER & SERVICE ADDRESS & SCHEDULE DETAILS                      */}
          {/* ========================================================================= */}
          {step === 'details' && (
            <form onSubmit={handleContinueToPayment} className="space-y-5">
              {/* Customer Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#dfe4dc]">
                  <User size={16} className="text-[#c89c47]" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#173b32]">
                    1. Customer Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#173b32] mb-1">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Manikanta Rao"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32] ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-[#dfe4dc]'
                      }`}
                      required
                    />
                    {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173b32] mb-1">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#65766e] font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className={`w-full pl-11 pr-3 py-2 text-sm border rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32] ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-[#dfe4dc]'
                        }`}
                        required
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#173b32] mb-1">
                      Email Address <span className="text-[11px] font-normal text-[#65766e]">(Optional, for receipt)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32] ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-[#dfe4dc]'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Service Address */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-[#dfe4dc]">
                  <MapPin size={16} className="text-[#c89c47]" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#173b32]">
                    2. Service Location & Address
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#173b32] mb-1">
                      Complete Address <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Flat / House No., Apartment name, Wing, Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32] ${
                        errors.address ? 'border-red-500 bg-red-50' : 'border-[#dfe4dc]'
                      }`}
                      required
                    />
                    {errors.address && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173b32] mb-1">
                      Landmark <span className="text-[11px] font-normal text-[#65766e]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Near Datta Mandir / Metro Pillar"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#dfe4dc] rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-[#173b32] mb-1">
                        City <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32] ${
                          errors.city ? 'border-red-500 bg-red-50' : 'border-[#dfe4dc]'
                        }`}
                        required
                      />
                      {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#173b32] mb-1">
                        Pincode <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="411057"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32] ${
                          errors.pincode ? 'border-red-500 bg-red-50' : 'border-[#dfe4dc]'
                        }`}
                        required
                      />
                      {errors.pincode && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Schedule */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-[#dfe4dc]">
                  <Calendar size={16} className="text-[#c89c47]" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#173b32]">
                    3. Preferred Schedule
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#173b32] mb-1">
                      Preferred Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32] ${
                        errors.date ? 'border-red-500 bg-red-50' : 'border-[#dfe4dc]'
                      }`}
                      required
                    />
                    {errors.date && <p className="text-[11px] text-red-600 mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173b32] mb-1">
                      Preferred Time Slot <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32] ${
                        errors.timeSlot ? 'border-red-500 bg-red-50' : 'border-[#dfe4dc]'
                      }`}
                      required
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {errors.timeSlot && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.timeSlot}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#173b32] mb-1">
                      Special Notes / Instructions <span className="text-[11px] font-normal text-[#65766e]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ring doorbell, carry mask, call before arriving"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#dfe4dc] rounded-lg bg-[#f8faf7] text-[#173b32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173b32]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-3 border-t border-[#dfe4dc] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-[#65766e] hover:text-[#173b32] hover:bg-[#edf2ec] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173b32] text-white text-xs font-bold rounded-lg hover:bg-[#112d26] transition-colors shadow-sm"
                >
                  Continue to Payment <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: BOOKING SUMMARY & PAYMENT METHOD                                   */}
          {/* ========================================================================= */}
          {step === 'payment' && (
            <form onSubmit={handleProcessPayment} className="space-y-5">
              {/* Itemised Booking Summary */}
              <div className="bg-[#f9faf7] border border-[#dfe4dc] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#dfe4dc] pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c89c47]">
                    BOOKING SUMMARY
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-xs text-[#173b32] underline hover:text-[#c89c47]"
                  >
                    Edit details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#65766e]">Service:</span>
                    <strong className="block text-[#173b32] font-semibold">{service.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#65766e]">Service Provider:</span>
                    <strong className="block text-[#173b32] font-semibold">{service.provider}</strong>
                  </div>
                  <div>
                    <span className="text-[#65766e]">Date:</span>
                    <strong className="block text-[#173b32] font-semibold">{date}</strong>
                  </div>
                  <div>
                    <span className="text-[#65766e]">Time:</span>
                    <strong className="block text-[#173b32] font-semibold">{timeSlot}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#65766e]">Service location:</span>
                    <strong className="block text-[#173b32] font-semibold">
                      {address}
                      {landmark ? `, Near ${landmark}` : ''}, {city} - {pincode}
                    </strong>
                    <span className="text-[11px] text-[#65766e]">
                      Recipient: {name} (+91 {phone})
                    </span>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-[#dfe4dc] pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-[#65766e]">
                    <span>Service charge:</span>
                    <span>₹{serviceCharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#65766e]">
                    <span>Taxes / fees:</span>
                    <span>₹{taxesAndFees.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#173b32] pt-1 border-t border-dashed border-[#dfe4dc]">
                    <span>TOTAL:</span>
                    <span className="text-[#173b32] text-base font-extrabold">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#dfe4dc]">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-[#c89c47]" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#173b32]">
                      Select Payment Method
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#65766e] bg-[#edf4e9] text-[#2c5e3b] px-2 py-0.5 rounded font-medium">
                    Demo Simulation Mode
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI', icon: Smartphone },
                    { id: 'Credit / Debit Card', label: 'Card', icon: CreditCard },
                    { id: 'Net Banking', label: 'Net Banking', icon: Building2 },
                    { id: 'Cash on Service', label: 'Cash on Service', icon: Banknote },
                  ].map((m) => {
                    const Icon = m.icon
                    const isSelected = paymentMethod === m.id
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          isSelected
                            ? 'bg-[#173b32] text-white border-[#173b32] shadow-sm'
                            : 'bg-[#ffffff] text-[#173b32] border-[#dfe4dc] hover:border-[#173b32]'
                        }`}
                      >
                        <Icon size={18} className={isSelected ? 'text-[#c89c47]' : 'text-[#65766e]'} />
                        <span className="text-xs font-bold leading-tight mt-1">{m.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Sub-inputs depending on chosen payment method */}
                <div className="p-3.5 bg-[#fbfcf9] border border-[#dfe4dc] rounded-xl text-xs space-y-3">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-2.5">
                      <p className="font-semibold text-[#173b32]">Choose UPI provider or enter UPI ID:</p>
                      <div className="flex flex-wrap gap-2">
                        {(['PhonePe', 'Google Pay', 'Paytm', 'ID'] as const).map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setUpiOption(opt)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                              upiOption === opt
                                ? 'bg-[#173b32] text-white border-[#173b32]'
                                : 'bg-white text-[#173b32] border-[#dfe4dc]'
                            }`}
                          >
                            {opt === 'ID' ? 'Any UPI ID' : opt}
                          </button>
                        ))}
                      </div>

                      {upiOption === 'ID' ? (
                        <div className="pt-1">
                          <input
                            type="text"
                            placeholder="username@okhdfcbank / mobile@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-3 py-2 border border-[#dfe4dc] rounded-lg bg-white text-[#173b32] focus:outline-none focus:ring-2 focus:ring-[#173b32]"
                          />
                        </div>
                      ) : (
                        <p className="text-[#65766e] text-[11px]">
                          Clicking confirm will simulate payment notification to your {upiOption} app.
                        </p>
                      )}
                    </div>
                  )}

                  {paymentMethod === 'Credit / Debit Card' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-[#173b32] mb-1">
                            Card Number (Demo test values accepted)
                          </label>
                          <input
                            type="text"
                            maxLength={19}
                            placeholder="4532 •••• •••• 4242"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#dfe4dc] rounded-lg bg-white text-[#173b32]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#173b32] mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="12/28"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#dfe4dc] rounded-lg bg-white text-[#173b32]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#173b32] mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={3}
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#dfe4dc] rounded-lg bg-white text-[#173b32]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Net Banking' && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-[#173b32]">
                        Choose Bank
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 border border-[#dfe4dc] rounded-lg bg-white text-[#173b32]"
                      >
                        {BANKS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'Cash on Service' && (
                    <div className="flex items-start gap-2.5 text-[#65766e]">
                      <Banknote size={20} className="text-[#c89c47] shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed">
                        Pay ₹{totalAmount.toLocaleString('en-IN')} via Cash, UPI QR, or Card directly to the certified crew after your service is completed to your satisfaction.
                      </p>
                    </div>
                  )}
                </div>

                {/* Gateway Integration Notice */}
                <div className="flex items-start gap-2 p-2.5 bg-[#edf4e9] text-[#204936] rounded-lg text-[11px] border border-[#d2e4ce]">
                  <ShieldCheck size={16} className="shrink-0 mt-0.5 text-[#3b7e56]" />
                  <p>
                    <strong>Demo Architecture Note:</strong> Payment method selection is isolated from processing. Production systems can plug in Razorpay, Stripe, or Cashfree webhook listeners without redesigning the booking engine.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#dfe4dc] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#65766e] hover:text-[#173b32]"
                >
                  <ArrowLeft size={14} /> Back to details
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#173b32] text-white text-xs font-bold rounded-lg hover:bg-[#112d26] transition-colors shadow-sm disabled:opacity-75"
                >
                  {isProcessing ? (
                    'Processing Booking...'
                  ) : paymentMethod === 'Cash on Service' ? (
                    <>Confirm Booking (Pay on Service)</>
                  ) : (
                    <>Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm Booking</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: PAYMENT CONFIRMATION (BOOKING CONFIRMED SCREEN)                    */}
          {/* ========================================================================= */}
          {step === 'confirmed' && createdBooking && (
            <div className="space-y-5 text-center py-2">
              {/* Success Badge */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#edf4e9] text-[#256c42] mx-auto">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#173b32]">
                  ✓ Booking Confirmed
                </h3>
                <p className="text-xs text-[#65766e] mt-1">
                  Your appointment is reserved. A certified crew has been notified.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-[#f9faf7] border border-[#dfe4dc] rounded-xl p-4 text-left space-y-3 text-xs max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-[#dfe4dc] pb-2">
                  <span className="text-[#65766e] font-semibold">Booking ID:</span>
                  <span className="font-mono font-bold text-[#173b32] bg-[#f0f2eb] px-2 py-0.5 rounded text-sm">
                    {createdBooking.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-[#65766e] block text-[11px]">Service:</span>
                    <strong className="text-[#173b32]">{createdBooking.serviceName}</strong>
                  </div>
                  <div>
                    <span className="text-[#65766e] block text-[11px]">Service Provider:</span>
                    <strong className="text-[#173b32]">{createdBooking.provider}</strong>
                  </div>
                  <div>
                    <span className="text-[#65766e] block text-[11px]">Date:</span>
                    <strong className="text-[#173b32]">{createdBooking.date}</strong>
                  </div>
                  <div>
                    <span className="text-[#65766e] block text-[11px]">Time:</span>
                    <strong className="text-[#173b32]">{createdBooking.timeSlot}</strong>
                  </div>
                  <div>
                    <span className="text-[#65766e] block text-[11px]">Customer:</span>
                    <strong className="text-[#173b32]">{createdBooking.customer.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#65766e] block text-[11px]">Mobile:</span>
                    <strong className="text-[#173b32]">+91 {createdBooking.customer.phone}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#65766e] block text-[11px]">Service Address:</span>
                    <strong className="text-[#173b32]">
                      {createdBooking.customer.address}
                      {createdBooking.customer.landmark ? `, Near ${createdBooking.customer.landmark}` : ''},{' '}
                      {createdBooking.customer.city} - {createdBooking.customer.pincode}
                    </strong>
                  </div>
                </div>

                <div className="border-t border-[#dfe4dc] pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#65766e] block">Payment Method:</span>
                    <strong className="text-[#173b32]">{createdBooking.paymentMethod}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#65766e] block">
                      {createdBooking.paymentStatus === 'Paid' ? 'Amount Paid:' : 'Payable on Service:'}
                    </span>
                    <strong className="text-sm sm:text-base font-extrabold text-[#173b32]">
                      ₹{createdBooking.amount.toLocaleString('en-IN')}
                    </strong>
                    <span className="block text-[10px] text-[#256c42] font-semibold">
                      {createdBooking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Prominent Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/account?tab=bookings"
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#173b32] text-white text-xs font-bold rounded-lg hover:bg-[#112d26] transition-colors"
                >
                  View Booking
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-[#173b32] text-[#173b32] text-xs font-bold rounded-lg hover:bg-[#edf2ec] transition-colors"
                >
                  Back to Serv Mart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (typeof document !== 'undefined' && mounted && document.body) {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}
