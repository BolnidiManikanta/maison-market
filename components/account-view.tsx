'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
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
  Phone,
  Heart,
  CreditCard,
  Bell,
  Shield,
  Settings,
  LayoutDashboard,
  LogOut,
  Edit3,
  Download,
  RotateCcw,
  Search,
  Truck,
  PackageCheck,
  Trash2,
  Plus,
} from 'lucide-react'
import {
  getBookings,
  cancelBooking,
  onBookingsChanged,
  type ServiceBooking,
  type BookingStatus,
} from '@/lib/bookings'
import {
  useCommerce,
  type Order,
  type OrderStatus,
} from '@/components/commerce-provider'
import AuthDemo from '@/components/auth-demo'

const LocationMapPicker = dynamic(() => import('@/components/location-map-picker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-xl border border-[#dfe4dc] bg-[#f9faf7] flex items-center justify-center text-xs text-[#65766e]">
      Loading interactive map...
    </div>
  ),
})

type SidebarSection =
  | 'overview'
  | 'personal'
  | 'addresses'
  | 'orders'
  | 'wishlist'
  | 'bookings'
  | 'payments'
  | 'notifications'
  | 'security'
  | 'settings'

const money = (n: number) => `₹${n.toLocaleString('en-IN')}`

const ORDER_TABS: ('All' | OrderStatus)[] = [
  'All',
  'Processing',
  'Confirmed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
]

export default function AccountView({ initialTab = 'overview' }: { initialTab?: string }) {
  const router = useRouter()
  const {
    user,
    orders,
    wishlistProducts,
    logout,
    updateProfile,
    addAddress,
    removeAddress,
    setDefaultAddress,
    cancelOrder,
    returnOrder,
    buyAgain,
    toggleWishlist,
    moveWishlistToCart,
  } = useCommerce()

  const mapInitialSection = (tab: string): SidebarSection => {
    if (tab === 'orders') return 'orders'
    if (tab === 'profile') return 'personal'
    if (tab === 'bookings') return 'bookings'
    if (tab === 'addresses') return 'addresses'
    return 'overview'
  }

  const [section, setSection] = useState<SidebarSection>(mapInitialSection(initialTab))
  const [bookings, setBookings] = useState<ServiceBooking[]>([])
  const [bookingFilter, setBookingFilter] = useState<string>('All')
  const [cancelModalBooking, setCancelModalBooking] = useState<ServiceBooking | null>(null)
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null)

  // Personal Info form state
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [altPhone, setAltPhone] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [photoURL, setPhotoURL] = useState('')

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addrLabel, setAddrLabel] = useState('Home')
  const [addrStreet, setAddrStreet] = useState('')
  const [addrCity, setAddrCity] = useState('Pune')
  const [addrPincode, setAddrPincode] = useState('411057')

  // Order management state
  const [orderTab, setOrderTab] = useState<'All' | OrderStatus>('All')
  const [orderSearch, setOrderSearch] = useState('')
  const [orderSort, setOrderSort] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Preferences state
  const [contactPrefs, setContactPrefs] = useState({
    email: true,
    sms: true,
    whatsapp: false,
    orderUpdates: true,
    promotions: false,
  })
  const [language, setLanguage] = useState('English')
  const [preferredCategories, setPreferredCategories] = useState<string[]>(['Fresh Produce', 'Smart Tech'])

  useEffect(() => {
    setBookings(getBookings())
    const unsubscribe = onBookingsChanged((latest) => {
      setBookings(latest)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      if (tabParam) {
        setSection(mapInitialSection(tabParam))
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '')
      setProfileEmail(user.email || '')
      setProfilePhone(user.phone || '')
      setAltPhone(user.alternatePhone || '')
      setDob(user.dob || '')
      setGender(user.gender || '')
      setPhotoURL(user.photoURL || '')
      if (user.contactPreferences) setContactPrefs(user.contactPreferences)
      if (user.shoppingPreferences) {
        setLanguage(user.shoppingPreferences.language || 'English')
        setPreferredCategories(user.shoppingPreferences.preferredCategories || [])
      }
    }
  }, [user])

  const notify = (msg: string) => {
    setFeedbackNotice(msg)
    setTimeout(() => setFeedbackNotice(null), 4500)
  }

  const filteredBookings = bookings.filter((b) =>
    bookingFilter === 'All' ? true : b.bookingStatus.toLowerCase() === bookingFilter.toLowerCase()
  )

  const filteredOrders = useMemo(() => {
    let list = orders.filter((o) => (orderTab === 'All' ? true : o.status === orderTab))
    if (orderSearch.trim()) {
      const q = orderSearch.trim().toLowerCase()
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q))
      )
    }
    return [...list].sort((a, b) => {
      if (orderSort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (orderSort === 'amount-high') return b.total - a.total
      if (orderSort === 'amount-low') return a.total - b.total
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [orders, orderTab, orderSearch, orderSort])

  const activeOrdersCount = orders.filter(
    (o) => !['Delivered', 'Cancelled', 'Returned'].includes(o.status)
  ).length
  const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length

  function handleDownloadInvoice(order: Order) {
    const lines = [
      '========================================',
      '           TECHIESMART INVOICE          ',
      '========================================',
      `Order ID: ${order.id}`,
      `Date: ${new Date(order.createdAt).toLocaleString('en-IN')}`,
      `Status: ${order.status}`,
      `Payment: ${order.paymentMethod} (${order.paymentStatus || 'Paid'})`,
      `Transaction ID: ${order.transactionId || 'N/A'}`,
      '----------------------------------------',
      'ITEMS:',
      ...order.items.map(
        (i) =>
          `- ${i.quantity}x ${i.name}${i.isBOGO ? ` (+${i.quantity} FREE)` : ''} : ${money(
            i.price * i.quantity
          )}`
      ),
      '----------------------------------------',
      `Subtotal: ${money(order.subtotal)}`,
      `BOGO Savings: ${money(order.bogoSavings)}`,
      `Delivery Fee: ${order.deliveryFee === 0 ? 'FREE' : money(order.deliveryFee)}`,
      `Total Paid: ${money(order.total)}`,
      '----------------------------------------',
      `Delivery Address: ${order.address.name}, ${order.address.street}, ${order.address.city} - ${order.address.pincode}`,
      '========================================',
    ].join('\n')

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TechieSmart-Invoice-${order.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
    notify(`Invoice downloaded for Order #${order.id}`)
  }

  function handleConfirmCancelBooking() {
    if (!cancelModalBooking) return
    const res = cancelBooking(cancelModalBooking.id)
    if (res) {
      setBookings(getBookings())
      notify(`Booking #${cancelModalBooking.id} has been cancelled.`)
    }
    setCancelModalBooking(null)
  }

  function getStatusBadgeClass(status: BookingStatus | OrderStatus) {
    switch (status) {
      case 'Confirmed':
      case 'Delivered':
        return 'bg-[#edf4e9] text-[#205234] border-[#c4dcbe]'
      case 'Assigned':
      case 'Shipped':
        return 'bg-[#edf4fb] text-[#194b7d] border-[#c0d6ee]'
      case 'In Progress':
      case 'Processing':
      case 'Out for Delivery':
        return 'bg-[#fef7e7] text-[#935b0b] border-[#f4dfb2]'
      case 'Completed':
      case 'Returned':
        return 'bg-[#f0f2eb] text-[#4d5e55] border-[#d5ded2]'
      case 'Cancelled':
        return 'bg-[#fbeeed] text-[#9c2b26] border-[#f3c2c0]'
      default:
        return 'bg-[#f0f2eb] text-[#4d5e55] border-[#dfe4dc]'
    }
  }

  if (!user) {
    return <AuthDemo />
  }

  const sidebarItems: { id: SidebarSection; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'overview', label: 'Profile Overview', icon: LayoutDashboard },
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'addresses', label: 'Addresses & Map', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'bookings', label: 'My Bookings', icon: Wrench },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <main className="route-page bg-[#f6f5f0] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar with Breadcrumb & Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#dfe4dc] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#173b32] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 overflow-hidden border-2 border-[#c89c47]">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || 'T'
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#c89c47]">
                TECHIESMART · CUSTOMER DASHBOARD
              </p>
              <h1 className="text-2xl font-serif font-bold text-[#173b32]">{user.name}</h1>
              <p className="text-xs text-[#65766e]">
                {user.email} {user.phone ? `· ${user.phone}` : ''}
              </p>
            </div>
          </div>

          {/* Top-Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSection('personal')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f6f5f0] text-[#173b32] border border-[#dfe4dc] text-xs font-bold rounded-lg hover:bg-[#edf2ec]"
            >
              <Edit3 size={14} /> Edit Profile
            </button>
            <button
              type="button"
              onClick={() => setSection('addresses')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f6f5f0] text-[#173b32] border border-[#dfe4dc] text-xs font-bold rounded-lg hover:bg-[#edf2ec]"
            >
              <MapPin size={14} /> Manage Addresses
            </button>
            <button
              type="button"
              onClick={() => setSection('orders')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#173b32] !text-white text-xs font-bold rounded-lg hover:bg-[#112d26]"
            >
              <ShoppingBag size={14} /> My Orders
            </button>
            <button
              type="button"
              onClick={() => {
                logout()
                router.push('/login')
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#f3c2c0] text-[#9c2b26] text-xs font-bold rounded-lg hover:bg-[#fbeeed]"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackNotice && (
          <div className="p-3.5 bg-[#edf4e9] border border-[#c4dcbe] rounded-xl text-xs text-[#205234] font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> {feedbackNotice}
            </span>
            <button type="button" onClick={() => setFeedbackNotice(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Main 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 bg-white border border-[#dfe4dc] rounded-2xl p-3 shadow-sm lg:sticky lg:top-24">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0" aria-label="Account sections">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const active = section === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      active
                        ? '!bg-[#173b32] !text-white shadow-sm'
                        : 'text-[#4d5e55] hover:!bg-[#f6f5f0] hover:text-[#173b32]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={15} />
                      {item.label}
                    </span>
                    {item.id === 'orders' && orders.length > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                          active ? 'bg-[#c89c47] text-white' : 'bg-[#e9ece5] text-[#173b32]'
                        }`}
                      >
                        {orders.length}
                      </span>
                    )}
                    {item.id === 'wishlist' && wishlistProducts.length > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                          active ? 'bg-[#c89c47] text-white' : 'bg-[#e9ece5] text-[#173b32]'
                        }`}
                      >
                        {wishlistProducts.length}
                      </span>
                    )}
                    {item.id === 'bookings' && bookings.length > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                          active ? 'bg-[#c89c47] text-white' : 'bg-[#e9ece5] text-[#173b32]'
                        }`}
                      >
                        {bookings.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Right Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. PROFILE OVERVIEW */}
            {section === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { label: 'Total Orders', value: orders.length, onClick: () => setSection('orders') },
                    { label: 'Active Orders', value: activeOrdersCount, onClick: () => setSection('orders') },
                    { label: 'Completed', value: completedOrdersCount, onClick: () => setSection('orders') },
                    { label: 'Wishlist Items', value: wishlistProducts.length, onClick: () => setSection('wishlist') },
                    { label: 'Saved Addresses', value: user.addresses.length, onClick: () => setSection('addresses') },
                  ].map((stat) => (
                    <button
                      key={stat.label}
                      type="button"
                      onClick={stat.onClick}
                      className="bg-white border border-[#dfe4dc] rounded-2xl p-4 text-left hover:border-[#173b32] transition-colors shadow-sm"
                    >
                      <span className="text-[11px] font-semibold text-[#65766e] block">{stat.label}</span>
                      <strong className="text-2xl font-serif font-bold text-[#173b32] mt-1 block">
                        {stat.value}
                      </strong>
                    </button>
                  ))}
                </div>

                <div className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#173b32]">Recent Orders</h2>
                    <button
                      type="button"
                      onClick={() => setSection('orders')}
                      className="text-xs font-bold text-[#173b32] underline"
                    >
                      View all orders →
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-xs text-[#65766e]">
                      No orders placed yet. Explore Buy Mart or BOGO Deals to place your first order.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {orders.slice(0, 3).map((o) => (
                        <div
                          key={o.id}
                          className="p-3.5 bg-[#f9faf7] border border-[#dfe4dc] rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <strong className="font-mono text-[#173b32]">#{o.id}</strong>
                            <span className="text-[#65766e] ml-2">
                              {o.items.length} item(s) · {money(o.total)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full border font-bold ${getStatusBadgeClass(o.status)}`}>
                              {o.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(o)}
                              className="text-[#173b32] font-bold underline"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. PERSONAL INFORMATION */}
            {section === 'personal' && (
              <div className="bg-white border border-[#dfe4dc] rounded-2xl p-6 sm:p-8 space-y-5 text-xs">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#173b32]">Personal Information</h2>
                  <p className="text-[#65766e]">
                    Manage your Google-connected profile details, phone numbers, and personal info.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    updateProfile({
                      name: profileName,
                      email: profileEmail,
                      phone: profilePhone,
                      alternatePhone: altPhone,
                      dob,
                      gender,
                      photoURL,
                    })
                    notify('Personal information saved successfully.')
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <label className="block">
                    <span className="font-semibold text-[#173b32]">Full Name *</span>
                    <input
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                    />
                  </label>
                  <label className="block">
                    <span className="font-semibold text-[#173b32]">Email Address *</span>
                    <input
                      required
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                    />
                  </label>
                  <label className="block">
                    <span className="font-semibold text-[#173b32]">Mobile Number *</span>
                    <input
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                    />
                  </label>
                  <label className="block">
                    <span className="font-semibold text-[#173b32]">Alternate Phone</span>
                    <input
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      placeholder="Optional alternate number"
                      className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                    />
                  </label>
                  <label className="block">
                    <span className="font-semibold text-[#173b32]">Date of Birth</span>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                    />
                  </label>
                  <label className="block">
                    <span className="font-semibold text-[#173b32]">Gender</span>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg bg-white"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </label>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#173b32] !text-white font-bold rounded-lg hover:bg-[#112d26]"
                    >
                      Save Personal Information
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. ADDRESSES & LIVE MAP */}
            {section === 'addresses' && (
              <div className="space-y-6 text-xs">
                <div className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-3">
                  <h2 className="text-base font-bold text-[#173b32]">Live Location & Interactive Map</h2>
                  <p className="text-[#65766e]">
                    Detect your live GPS location, search an address, or drag the pin to auto-fill your delivery address.
                  </p>
                  <LocationMapPicker
                    onLocationSelect={(loc) => {
                      if (loc.street) setAddrStreet(loc.street)
                      if (loc.city) setAddrCity(loc.city)
                      if (loc.pincode) setAddrPincode(loc.pincode)
                      setShowAddressForm(true)
                    }}
                  />
                </div>

                <div className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#173b32]">Saved Delivery Addresses</h2>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#173b32] !text-white font-bold rounded-lg"
                    >
                      <Plus size={14} /> {showAddressForm ? 'Close Form' : 'Add Address'}
                    </button>
                  </div>

                  {showAddressForm && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        addAddress({
                          label: addrLabel,
                          name: user.name,
                          phone: user.phone || 'Not provided',
                          street: addrStreet,
                          city: addrCity,
                          pincode: addrPincode,
                        })
                        setAddrStreet('')
                        setShowAddressForm(false)
                        notify('Delivery address saved!')
                      }}
                      className="p-4 bg-[#f9faf7] border border-[#dfe4dc] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <select
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                        className="px-3 py-2 border border-[#dfe4dc] rounded-lg bg-white"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Current">Current Address</option>
                        <option value="Permanent">Permanent Address</option>
                      </select>
                      <input
                        required
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        placeholder="Flat / Building / Street"
                        className="px-3 py-2 border border-[#dfe4dc] rounded-lg bg-white"
                      />
                      <input
                        required
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        placeholder="City"
                        className="px-3 py-2 border border-[#dfe4dc] rounded-lg bg-white"
                      />
                      <input
                        required
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value)}
                        placeholder="Pincode"
                        className="px-3 py-2 border border-[#dfe4dc] rounded-lg bg-white"
                      />
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#173b32] !text-white font-bold rounded-lg"
                        >
                          Save Delivery Address
                        </button>
                      </div>
                    </form>
                  )}

                  {user.addresses.length === 0 ? (
                    <p className="text-[#65766e]">No saved addresses yet. Use the map above or click Add Address.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {user.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="p-4 bg-[#fbfcf9] border border-[#dfe4dc] rounded-xl space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-[#c89c47]">
                              {addr.label} {addr.isDefault ? '· DEFAULT' : ''}
                            </span>
                            <div className="flex gap-2">
                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDefaultAddress(addr.id)
                                    notify(`${addr.label} set as default delivery address.`)
                                  }}
                                  className="text-[11px] font-semibold text-[#173b32] underline"
                                >
                                  Set Default
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeAddress(addr.id)}
                                className="text-[11px] font-semibold text-[#9c2b26] underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="font-bold text-[#173b32]">{addr.street}</p>
                          <p className="text-[#65766e]">
                            {addr.city} - {addr.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. MY ORDERS */}
            {section === 'orders' && (
              <div className="space-y-4 text-xs">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {ORDER_TABS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOrderTab(t)}
                      className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                        orderTab === t
                          ? 'bg-[#173b32] !text-white'
                          : 'bg-white text-[#4d5e55] border border-[#dfe4dc] hover:border-[#173b32]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Search & Sort */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65766e]" />
                    <input
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search by Order ID or product name..."
                      className="w-full pl-8 pr-3 py-2 bg-white border border-[#dfe4dc] rounded-lg"
                    />
                  </div>
                  <select
                    value={orderSort}
                    onChange={(e) => setOrderSort(e.target.value as typeof orderSort)}
                    className="px-3 py-2 bg-white border border-[#dfe4dc] rounded-lg"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount-high">Amount: High to Low</option>
                    <option value="amount-low">Amount: Low to High</option>
                  </select>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="bg-white border border-[#dfe4dc] rounded-2xl p-10 text-center space-y-3">
                    <ShoppingBag size={28} className="mx-auto text-[#65766e]" />
                    <h2 className="text-base font-bold text-[#173b32]">No orders found</h2>
                    <p className="text-[#65766e]">
                      {orderTab === 'All'
                        ? 'You have not placed any orders yet.'
                        : `No orders with status "${orderTab}".`}
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#173b32] !text-white font-bold rounded-lg"
                    >
                      Browse Products <ChevronRight size={14} />
                    </Link>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const canCancel = !['Delivered', 'Cancelled', 'Returned'].includes(order.status)
                    const canReturn = order.status === 'Delivered'
                    return (
                      <article
                        key={order.id}
                        className="bg-white border border-[#dfe4dc] rounded-2xl p-5 space-y-4 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dfe4dc] pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-[#173b32] bg-[#f6f5f0] px-2.5 py-1 rounded border border-[#dfe4dc]">
                              #{order.id}
                            </span>
                            <span className="text-[#65766e]">
                              Placed on{' '}
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-[#65766e]">
                              · Payment: <b>{order.paymentStatus || 'Paid'}</b>
                            </span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full border font-bold ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {order.items.map((item) => (
                            <div key={item.productId} className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover border border-[#dfe4dc] bg-[#f6f5f0]"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-[#173b32] truncate">{item.name}</p>
                                <p className="text-[#65766e]">
                                  Qty: {item.quantity}
                                  {item.isBOGO ? ` (+${item.quantity} FREE)` : ''} · {money(item.price)} each
                                </p>
                              </div>
                              <strong className="text-[#173b32]">{money(item.price * item.quantity)}</strong>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-[#dfe4dc] pt-3 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="text-[#65766e]">Total: </span>
                            <strong className="text-sm text-[#173b32]">{money(order.total)}</strong>
                            {order.bogoSavings > 0 && (
                              <span className="ml-2 text-[#205234] font-semibold">
                                (Saved {money(order.bogoSavings)} BOGO)
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 bg-[#173b32] !text-white font-bold rounded-lg"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadInvoice(order)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#dfe4dc] text-[#173b32] font-bold rounded-lg hover:bg-[#f6f5f0]"
                            >
                              <Download size={13} /> Invoice
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                buyAgain(order)
                                notify('Items added to your cart!')
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#dfe4dc] text-[#173b32] font-bold rounded-lg hover:bg-[#f6f5f0]"
                            >
                              <RotateCcw size={13} /> Buy Again
                            </button>
                            {canCancel && (
                              <button
                                type="button"
                                onClick={() => {
                                  cancelOrder(order.id)
                                  notify(`Order #${order.id} cancelled.`)
                                }}
                                className="px-3 py-1.5 border border-[#f3c2c0] text-[#9c2b26] font-bold rounded-lg hover:bg-[#fbeeed]"
                              >
                                Cancel
                              </button>
                            )}
                            {canReturn && (
                              <button
                                type="button"
                                onClick={() => {
                                  returnOrder(order.id)
                                  notify(`Return initiated for Order #${order.id}.`)
                                }}
                                className="px-3 py-1.5 border border-[#f4dfb2] text-[#935b0b] font-bold rounded-lg hover:bg-[#fef7e7]"
                              >
                                Return / Replace
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            )}

            {/* 5. WISHLIST */}
            {section === 'wishlist' && (
              <div className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4 text-xs">
                <h2 className="text-base font-bold text-[#173b32]">
                  Saved Wishlist ({wishlistProducts.length})
                </h2>
                {wishlistProducts.length === 0 ? (
                  <p className="text-[#65766e]">No saved products yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <div key={p.id} className="border border-[#dfe4dc] rounded-xl p-3 space-y-2">
                        <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-lg" />
                        <p className="font-bold text-[#173b32] truncate">{p.name}</p>
                        <p className="font-extrabold text-[#173b32]">{money(p.price)}</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              moveWishlistToCart(p)
                              notify(`${p.name} moved to cart!`)
                            }}
                            className="flex-1 py-1.5 bg-[#173b32] !text-white font-bold rounded-lg"
                          >
                            Move to Cart
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(p.id)}
                            className="p-1.5 border border-[#dfe4dc] text-[#9c2b26] rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. MY BOOKINGS */}
            {section === 'bookings' && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-wrap items-center gap-2 pb-1">
                  {['All', 'Confirmed', 'Assigned', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setBookingFilter(st)}
                      className={`inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                        bookingFilter === st
                          ? '!bg-[#173b32] !text-white !border !border-[#173b32] shadow-sm'
                          : '!bg-white !text-[#173b32] !border !border-[#dfe4dc] hover:!bg-[#f6f5f0]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                {filteredBookings.length === 0 ? (
                  <div className="bg-white border border-[#dfe4dc] rounded-2xl p-8 text-center text-[#65766e]">
                    No service bookings found.
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <article key={b.id} className="bg-white border border-[#dfe4dc] rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <strong className="font-mono text-[#173b32]">BOOKING #{b.id}</strong>
                        <span className={`px-2.5 py-0.5 rounded-full border font-bold ${getStatusBadgeClass(b.bookingStatus)}`}>
                          {b.bookingStatus}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-[#173b32]">{b.serviceName}</p>
                      <p className="text-[#65766e]">
                        <Calendar size={12} className="inline mr-1" /> {b.date} ·{' '}
                        <Clock size={12} className="inline mr-1" /> {b.timeSlot}
                      </p>
                      <div className="flex justify-between items-center pt-2 border-t border-[#dfe4dc]">
                        <strong className="text-[#173b32]">{money(b.amount)}</strong>
                        {b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => setCancelModalBooking(b)}
                            className="text-[#9c2b26] font-bold underline"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* 7. PAYMENTS */}
            {section === 'payments' && (
              <div className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4 text-xs">
                <h2 className="text-base font-bold text-[#173b32]">Payments & Transactions</h2>
                {orders.length === 0 ? (
                  <p className="text-[#65766e]">No transactions recorded yet.</p>
                ) : (
                  <div className="divide-y divide-[#dfe4dc]">
                    {orders.map((o) => (
                      <div key={o.id} className="py-3 flex justify-between items-center">
                        <div>
                          <strong className="text-[#173b32]">Order #{o.id}</strong>
                          <p className="text-[#65766e]">
                            {o.paymentMethod} · TXN: {o.transactionId || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <strong className="text-[#173b32] block">{money(o.total)}</strong>
                          <span className="text-[11px] text-[#205234] font-semibold">
                            {o.paymentStatus || 'Paid'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 8. NOTIFICATIONS */}
            {section === 'notifications' && (
              <div className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4 text-xs">
                <h2 className="text-base font-bold text-[#173b32]">Contact & Notification Preferences</h2>
                <div className="space-y-3">
                  {[
                    { key: 'email', label: 'Email Notifications' },
                    { key: 'sms', label: 'SMS Alerts' },
                    { key: 'whatsapp', label: 'WhatsApp Updates' },
                    { key: 'orderUpdates', label: 'Live Order & Delivery Tracking' },
                    { key: 'promotions', label: 'BOGO & Community Offers' },
                  ].map((pref) => (
                    <label key={pref.key} className="flex items-center justify-between p-3 border border-[#dfe4dc] rounded-xl cursor-pointer">
                      <span className="font-semibold text-[#173b32]">{pref.label}</span>
                      <input
                        type="checkbox"
                        checked={contactPrefs[pref.key as keyof typeof contactPrefs]}
                        onChange={(e) => {
                          const next = { ...contactPrefs, [pref.key]: e.target.checked }
                          setContactPrefs(next)
                          updateProfile({ contactPreferences: next })
                          notify('Notification preferences updated.')
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 9. SECURITY */}
            {section === 'security' && (
              <div className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4 text-xs">
                <h2 className="text-base font-bold text-[#173b32]">Account Security</h2>
                <div className="p-4 bg-[#edf4e9] border border-[#c4dcbe] rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-[#205234] block">Google Account Connected</strong>
                    <span className="text-[#4d5e55]">{user.email}</span>
                  </div>
                  <CheckCircle2 size={20} className="text-[#205234]" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
                  className="px-4 py-2 border border-[#f3c2c0] text-[#9c2b26] font-bold rounded-lg hover:bg-[#fbeeed]"
                >
                  Sign Out of This Device
                </button>
              </div>
            )}

            {/* 10. SETTINGS */}
            {section === 'settings' && (
              <div className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4 text-xs">
                <h2 className="text-base font-bold text-[#173b32]">My Preferences & Settings</h2>
                <label className="block max-w-xs">
                  <span className="font-semibold text-[#173b32]">Preferred Language</span>
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value)
                      updateProfile({
                        shoppingPreferences: { language: e.target.value, preferredCategories },
                      })
                      notify('Language preference saved.')
                    }}
                    className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#dfe4dc] shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#dfe4dc] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#173b32]">Order #{selectedOrder.id}</h3>
                  <p className="text-[#65766e]">
                    Estimated Delivery: {selectedOrder.estimatedDelivery || 'Within 48 hours'}
                  </p>
                </div>
                <button type="button" onClick={() => setSelectedOrder(null)}>
                  <X size={18} />
                </button>
              </div>

              {/* Visual Delivery Timeline */}
              <div className="space-y-2 py-2">
                <p className="font-bold text-[#173b32] flex items-center gap-1.5">
                  <Truck size={14} className="text-[#c89c47]" /> Live Order Tracking
                </p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                    const active =
                      selectedOrder.status === step ||
                      (selectedOrder.status === 'Delivered' && idx <= 3) ||
                      (selectedOrder.status === 'Out for Delivery' && idx <= 2) ||
                      (selectedOrder.status === 'Shipped' && idx <= 1) ||
                      idx === 0
                    return (
                      <div
                        key={step}
                        className={`p-2 rounded-lg border text-[10px] font-bold ${
                          active
                            ? 'bg-[#edf4e9] border-[#c4dcbe] text-[#205234]'
                            : 'bg-[#f9faf7] border-[#dfe4dc] text-[#65766e]'
                        }`}
                      >
                        <PackageCheck size={14} className="mx-auto mb-1" />
                        {step}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-[#f9faf7] border border-[#dfe4dc] rounded-xl p-3 space-y-1">
                <p className="font-bold text-[#173b32]">Delivery Address</p>
                <p className="text-[#4d5e55]">
                  {selectedOrder.address.name} ({selectedOrder.address.phone})
                </p>
                <p className="text-[#65766e]">
                  {selectedOrder.address.street}, {selectedOrder.address.city} -{' '}
                  {selectedOrder.address.pincode}
                </p>
              </div>

              <div className="space-y-1.5">
                {selectedOrder.items.map((i) => (
                  <div key={i.productId} className="flex justify-between">
                    <span>
                      {i.quantity}× {i.name}
                    </span>
                    <strong>{money(i.price * i.quantity)}</strong>
                  </div>
                ))}
                <div className="border-t border-[#dfe4dc] pt-2 flex justify-between text-sm font-bold text-[#173b32]">
                  <span>Total Paid ({selectedOrder.paymentMethod})</span>
                  <span>{money(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKING CANCELLATION MODAL */}
        {cancelModalBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#dfe4dc] shadow-2xl space-y-4 text-xs">
              <div className="flex items-center gap-3 text-[#9c2b26]">
                <AlertTriangle size={20} />
                <h3 className="text-base font-bold text-[#173b32]">Cancel Booking?</h3>
              </div>
              <p className="text-[#65766e]">
                Are you sure you want to cancel booking <b>#{cancelModalBooking.id}</b>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 font-bold text-[#65766e]"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancelBooking}
                  className="px-4 py-2 bg-[#9c2b26] !text-white font-bold rounded-lg"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
