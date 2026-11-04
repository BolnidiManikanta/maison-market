export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Assigned'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'

export type PaymentMethod =
  | 'UPI'
  | 'Credit / Debit Card'
  | 'Net Banking'
  | 'Cash on Service'

export interface CustomerDetails {
  name: string
  phone: string
  email?: string
  address: string
  landmark?: string
  city: string
  pincode: string
}

export interface ServiceBooking {
  id: string
  serviceId: string
  serviceName: string
  provider: string
  category: string
  image?: string
  customer: CustomerDetails
  date: string
  timeSlot: string
  serviceCharge: number
  taxesAndFees: number
  amount: number
  paymentMethod: string
  paymentStatus: 'Paid' | 'Pay on Service' | 'Pending'
  bookingStatus: BookingStatus
  createdAt: string
  notes?: string
}

const STORAGE_KEY = 'techiesmart_service_bookings'
const EVENT_NAME = 'techiesmart:bookings-updated'

export const DEFAULT_BOOKINGS: ServiceBooking[] = [
  {
    id: 'BK-20260903-001',
    serviceId: 'svc-deep-clean',
    serviceName: 'Full Home Deep Cleaning',
    provider: 'NeatNest Verified Crew',
    category: 'Home Care',
    image: '/images/services/cleaning.png',
    customer: {
      name: 'Manikanta Rao',
      phone: '9876543210',
      email: 'manikanta@example.com',
      address: 'Flat 402, Tower B, Rohan Tarang',
      landmark: 'Near Datta Mandir',
      city: 'Pune',
      pincode: '411057',
    },
    date: '2026-09-03',
    timeSlot: '11:00 AM – 1:00 PM',
    serviceCharge: 1499,
    taxesAndFees: 75,
    amount: 1574,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    createdAt: '2026-09-01T10:30:00.000Z',
    notes: 'Please bring eco-friendly cleaning liquid if possible.',
  },
  {
    id: 'BK-20260828-042',
    serviceId: 'svc-kitchen-clean',
    serviceName: 'Kitchen Exhaust & Degreasing Clean',
    provider: 'SparklePro Kitchen Specialists',
    category: 'Home Care',
    image: '/images/services/kitchen-appliance.png',
    customer: {
      name: 'Manikanta Rao',
      phone: '9876543210',
      email: 'manikanta@example.com',
      address: 'Flat 402, Tower B, Rohan Tarang',
      landmark: 'Near Datta Mandir',
      city: 'Pune',
      pincode: '411057',
    },
    date: '2026-08-28',
    timeSlot: '1:00 PM – 3:00 PM',
    serviceCharge: 799,
    taxesAndFees: 40,
    amount: 839,
    paymentMethod: 'Cash on Service',
    paymentStatus: 'Paid',
    bookingStatus: 'Completed',
    createdAt: '2026-08-26T14:15:00.000Z',
  },
]

export function getBookings(): ServiceBooking[] {
  if (typeof window === 'undefined') return DEFAULT_BOOKINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKINGS))
      return DEFAULT_BOOKINGS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    return DEFAULT_BOOKINGS
  } catch {
    return DEFAULT_BOOKINGS
  }
}

export function getBookingById(id: string): ServiceBooking | undefined {
  const all = getBookings()
  return all.find((b) => b.id === id)
}

export function saveBookings(bookings: ServiceBooking[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: bookings }))
  } catch (err) {
    console.error('Failed to persist bookings', err)
  }
}

export function generateBookingId(): string {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  const rand = Math.floor(100 + Math.random() * 900)
  return `BK-${y}${m}${d}-${rand}`
}

export function createBooking(
  bookingInput: Omit<ServiceBooking, 'id' | 'createdAt'>
): ServiceBooking {
  const all = getBookings()
  const newBooking: ServiceBooking = {
    ...bookingInput,
    id: generateBookingId(),
    createdAt: new Date().toISOString(),
  }
  const updated = [newBooking, ...all]
  saveBookings(updated)
  return newBooking
}

export function updateBookingStatus(
  id: string,
  newStatus: BookingStatus
): ServiceBooking | null {
  const all = getBookings()
  let updatedBooking: ServiceBooking | null = null
  const updated = all.map((b) => {
    if (b.id === id) {
      updatedBooking = { ...b, bookingStatus: newStatus }
      return updatedBooking
    }
    return b
  })
  if (updatedBooking) {
    saveBookings(updated)
  }
  return updatedBooking
}

export function cancelBooking(id: string): ServiceBooking | null {
  return updateBookingStatus(id, 'Cancelled')
}

export function onBookingsChanged(callback: (bookings: ServiceBooking[]) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = () => {
    callback(getBookings())
  }
  window.addEventListener(EVENT_NAME, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(EVENT_NAME, handler)
    window.removeEventListener('storage', handler)
  }
}
