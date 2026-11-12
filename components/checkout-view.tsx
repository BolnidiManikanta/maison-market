'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, MapPin, CreditCard, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useCommerce, type Order } from '@/components/commerce-provider'
import Footer from '@/components/footer'

const money = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function CheckoutView() {
  const { cart, cartCount, subtotal, bogoSavings, user, placeOrder } = useCommerce()

  const [selectedAddressId, setSelectedAddressId] = useState<string>('new')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [landmark, setLandmark] = useState('')
  const [city, setCity] = useState('Pune')
  const [pincode, setPincode] = useState('411057')
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe)')
  const [communityCode, setCommunityCode] = useState('')
  const [error, setError] = useState('')
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setPhone(user.phone)
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0]
      if (def) {
        setSelectedAddressId(def.id)
      }
    }
  }, [user])

  const [routeEstimate, setRouteEstimate] = useState<{
    distanceKm: number
    durationMinutes: number
    deliveryFee: number
    serviceable: boolean
    storeName: string
  } | null>(null)

  useEffect(() => {
    const saved = user?.addresses.find((a) => a.id === selectedAddressId) as
      | { lat?: number; lng?: number }
      | undefined
    const lat = saved?.lat ?? 18.5913
    const lng = saved?.lng ?? 73.7610
    let cancelled = false

    fetch('/api/maps/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng, subtotal }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.distanceKm === 'number') {
          setRouteEstimate({
            distanceKm: data.distanceKm,
            durationMinutes: data.durationMinutes,
            deliveryFee: data.deliveryFee,
            serviceable: data.serviceable,
            storeName: data.storeLocation?.name || 'TechieSmart Hub',
          })
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [selectedAddressId, user, subtotal])

  const deliveryFee =
    routeEstimate?.deliveryFee ?? (subtotal >= 499 || subtotal === 0 ? 0 : 39)
  const totalPayable = subtotal + deliveryFee

  const [submitting, setSubmitting] = useState(false)

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError('')

    let chosenAddress = {
      name: name.trim(),
      phone: phone.trim(),
      street: street.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
    }

    if (user && selectedAddressId !== 'new') {
      const saved = user.addresses.find((a) => a.id === selectedAddressId)
      if (saved) {
        chosenAddress = {
          name: saved.name,
          phone: saved.phone,
          street: saved.street,
          landmark: saved.landmark || '',
          city: saved.city,
          pincode: saved.pincode,
        }
      }
    }

    if (
      !chosenAddress.name ||
      !chosenAddress.phone ||
      !chosenAddress.street ||
      !chosenAddress.city ||
      !chosenAddress.pincode
    ) {
      setError('Please complete all required delivery address fields.')
      return
    }

    setSubmitting(true)
    try {
      const idempotencyKey = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          items: cart.map((c) => ({
            productId: c.product.id,
            quantity: c.quantity,
          })),
          address: chosenAddress,
          paymentMethod,
          communityCode: communityCode.trim().toUpperCase() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Order validation failed. Please check your details.')
        return
      }

      const order = placeOrder({
        address: data.order?.address || chosenAddress,
        paymentMethod,
        communityCode: communityCode.trim().toUpperCase() || undefined,
      })
      setPlacedOrder(order)
    } catch {
      setError('Network error while validating your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (placedOrder) {
    return (
      <>
        <main className="route-page bg-[#f6f5f0] min-h-screen py-12 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto bg-white border border-[#dfe4dc] rounded-2xl p-8 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#edf4e9] text-[#205234] flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#c89c47]">
                ORDER CONFIRMED
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#173b32] mt-1">
                Thank you, {placedOrder.address.name}!
              </h1>
              <p className="text-sm text-[#65766e] mt-1">
                Order <strong className="font-mono text-[#173b32]">#{placedOrder.id}</strong> has been placed.
              </p>
            </div>

            <div className="bg-[#f9faf7] border border-[#dfe4dc] rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#65766e]">Total Paid ({placedOrder.paymentMethod})</span>
                <strong className="text-[#173b32]">{money(placedOrder.total)}</strong>
              </div>
              {placedOrder.bogoSavings > 0 && (
                <div className="flex justify-between text-[#205234] font-semibold">
                  <span>BOGO Savings Unlocked</span>
                  <span>{money(placedOrder.bogoSavings)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#dfe4dc]">
                <span className="text-[#65766e] block">Delivering to:</span>
                <strong className="text-[#173b32]">
                  {placedOrder.address.street}, {placedOrder.address.city} - {placedOrder.address.pincode}
                </strong>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173b32] !text-white text-xs font-bold rounded-lg hover:bg-[#112d26]"
              >
                View Order History <ArrowRight size={15} />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#173b32] text-[#173b32] text-xs font-bold rounded-lg hover:bg-[#edf2ec]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="route-page bg-[#f6f5f0] min-h-screen py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <Link href="/cart" className="text-xs font-bold text-[#65766e] hover:text-[#173b32]">
              ← Back to cart
            </Link>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c89c47]">
              TECHIESMART · CHECKOUT
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#173b32] mt-1">
              Complete Your Order
            </h1>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white border border-[#dfe4dc] rounded-2xl p-10 text-center space-y-4">
              <ShoppingBag size={28} className="mx-auto text-[#65766e]" />
              <h2 className="text-lg font-bold text-[#173b32]">Your cart is empty</h2>
              <p className="text-xs text-[#65766e]">Add items to your cart before checking out.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173b32] !text-white text-xs font-bold rounded-lg"
              >
                Browse Products <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Address */}
                <section className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#173b32] flex items-center gap-2">
                      <MapPin size={18} className="text-[#c89c47]" /> Delivery Address
                    </h2>
                    {!user && (
                      <Link href="/login" className="text-xs font-bold text-[#173b32] underline">
                        Sign in for saved addresses
                      </Link>
                    )}
                  </div>

                  {user && user.addresses.length > 0 && (
                    <div className="space-y-2">
                      {user.addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`block p-3.5 rounded-xl border cursor-pointer text-xs ${
                            selectedAddressId === addr.id
                              ? 'border-[#173b32] bg-[#f9faf7]'
                              : 'border-[#dfe4dc]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="savedAddress"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                            />
                            <strong className="text-[#173b32]">{addr.label}</strong>
                            <span className="text-[#65766e]">· {addr.name} ({addr.phone})</span>
                          </div>
                          <p className="text-[#65766e] mt-1 ml-5">
                            {addr.street}, {addr.city} - {addr.pincode}
                          </p>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#173b32] pt-1 cursor-pointer">
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={selectedAddressId === 'new'}
                          onChange={() => setSelectedAddressId('new')}
                        />
                        Use a different delivery address
                      </label>
                    </div>
                  )}

                  {(!user || user.addresses.length === 0 || selectedAddressId === 'new') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="block">
                        <span className="font-semibold text-[#173b32]">Full Name *</span>
                        <input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                        />
                      </label>
                      <label className="block">
                        <span className="font-semibold text-[#173b32]">Mobile Number *</span>
                        <input
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit mobile"
                          className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                        />
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="font-semibold text-[#173b32]">Flat / House No., Building, Street *</span>
                        <input
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="e.g. Flat 402, Rohan Tarang, Wakad"
                          className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                        />
                      </label>
                      <label className="block">
                        <span className="font-semibold text-[#173b32]">City *</span>
                        <input
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                        />
                      </label>
                      <label className="block">
                        <span className="font-semibold text-[#173b32]">Pincode *</span>
                        <input
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-[#dfe4dc] rounded-lg"
                        />
                      </label>
                    </div>
                  )}
                </section>

                {/* Payment Method */}
                <section className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-3">
                  <h2 className="text-base font-bold text-[#173b32] flex items-center gap-2">
                    <CreditCard size={18} className="text-[#c89c47]" /> Payment Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {['UPI (GPay / PhonePe)', 'Credit / Debit Card', 'Cash on Delivery'].map((method) => (
                      <label
                        key={method}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 font-semibold ${
                          paymentMethod === method
                            ? 'border-[#173b32] bg-[#f9faf7] text-[#173b32]'
                            : 'border-[#dfe4dc] text-[#65766e]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </section>

                {/* Community Code */}
                <section className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-2 text-xs">
                  <label className="block">
                    <span className="font-bold text-[#173b32]">Community Code (Optional)</span>
                    <input
                      value={communityCode}
                      onChange={(e) => setCommunityCode(e.target.value)}
                      placeholder="e.g. WAKAD001"
                      className="mt-1.5 w-full sm:w-64 px-3 py-2 border border-[#dfe4dc] rounded-lg uppercase"
                    />
                  </label>
                </section>
              </div>

              {/* Summary */}
              <aside className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4 sticky top-24">
                <h2 className="text-lg font-serif font-bold text-[#173b32]">Order Summary</h2>
                <div className="space-y-2 text-xs max-h-48 overflow-y-auto border-b border-[#dfe4dc] pb-3">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between gap-2">
                      <span className="text-[#4d5e55] truncate">
                        {quantity}× {product.name}
                        {product.isBOGO ? ` (+${quantity} free)` : ''}
                      </span>
                      <strong className="text-[#173b32] shrink-0">
                        {money(product.price * quantity)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs border-b border-[#dfe4dc] pb-3">
                  <div className="flex justify-between text-[#4d5e55]">
                    <span>Subtotal ({cartCount} items)</span>
                    <strong className="text-[#173b32]">{money(subtotal)}</strong>
                  </div>
                  {bogoSavings > 0 && (
                    <div className="flex justify-between text-[#205234] font-semibold">
                      <span>BOGO Savings</span>
                      <span>{money(bogoSavings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#4d5e55]">
                    <span>Delivery</span>
                    <strong className="text-[#173b32]">
                      {deliveryFee === 0 ? 'FREE' : money(deliveryFee)}
                    </strong>
                  </div>
                </div>

                <div className="flex justify-between text-base font-extrabold text-[#173b32]">
                  <span>Total Payable</span>
                  <span>{money(totalPayable)}</span>
                </div>

                {error && (
                  <p className="text-xs text-[#9c2b26] bg-[#fbeeed] p-2.5 rounded-lg border border-[#f3c2c0]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#173b32] text-white text-xs font-bold rounded-xl hover:bg-[#112d26] transition-colors"
                >
                  Place Order ({money(totalPayable)}) <ArrowRight size={15} />
                </button>

                <p className="text-[11px] text-[#65766e] flex items-center gap-1.5 justify-center">
                  <ShieldCheck size={14} className="text-[#205234]" />
                  Safe & transparent checkout
                </p>
              </aside>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
