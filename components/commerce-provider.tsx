'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { products, type Product } from '@/data/products'

export type CartLine = {
  product: Product
  quantity: number
}

type StoredCartLine = {
  productId: string
  quantity: number
}

export type Address = {
  id: string
  label: string
  name: string
  phone: string
  street: string
  landmark?: string
  city: string
  pincode: string
  isDefault?: boolean
}

export type ContactPreferences = {
  email: boolean
  sms: boolean
  whatsapp: boolean
  orderUpdates: boolean
  promotions: boolean
}

export type ShoppingPreferences = {
  language: string
  preferredCategories: string[]
}

export type UserProfile = {
  id: string
  name: string
  email: string
  phone: string
  alternatePhone?: string
  dob?: string
  gender?: string
  photoURL?: string
  addresses: Address[]
  contactPreferences?: ContactPreferences
  shoppingPreferences?: ShoppingPreferences
}

type StoredUser = UserProfile & {
  password: string
}

export type OrderItem = {
  productId: string
  name: string
  image: string
  price: number
  mrp: number
  quantity: number
  isBOGO: boolean
}

export type OrderStatus =
  | 'Processing'
  | 'Confirmed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'

export type Order = {
  id: string
  userId: string
  createdAt: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  bogoSavings: number
  deliveryFee: number
  total: number
  paymentMethod: string
  paymentStatus?: 'Paid' | 'Pending' | 'Refunded'
  transactionId?: string
  estimatedDelivery?: string
  communityCode?: string
  address: Omit<Address, 'id' | 'label' | 'isDefault'>
}

type CommerceContextValue = {
  cart: CartLine[]
  wishlist: string[]
  wishlistProducts: Product[]
  location: string
  user: UserProfile | null
  orders: Order[]
  cartCount: number
  subtotal: number
  bogoSavings: number
  addToCart: (product: Product, quantity?: number) => void
  changeQuantity: (id: string, delta: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  toggleWishlist: (id: string) => void
  moveWishlistToCart: (product: Product) => void
  setLocation: (location: string) => void
  login: (emailOrPhone: string, password: string) => { ok: boolean; error?: string }
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>
  register: (data: { name: string; email: string; phone: string; password: string }) => {
    ok: boolean
    error?: string
  }
  resetPassword: (email: string, newPassword: string) => { ok: boolean; error?: string }
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
  addAddress: (address: Omit<Address, 'id'>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  placeOrder: (data: {
    address: Omit<Address, 'id' | 'label' | 'isDefault'>
    paymentMethod: string
    communityCode?: string
  }) => Order
  cancelOrder: (orderId: string) => void
  returnOrder: (orderId: string) => void
  buyAgain: (order: Order) => void
}

const CommerceContext = createContext<CommerceContextValue | null>(null)

const STORAGE_KEY = 'techiesmart-commerce-v2'
const USERS_KEY = 'techiesmart-users-v1'
const SESSION_KEY = 'techiesmart-session-v1'
const ORDERS_KEY = 'techiesmart-orders-v1'

const productById = new Map(products.map((p) => [p.id, p]))

function hydrateCart(stored: StoredCartLine[]): CartLine[] {
  const lines: CartLine[] = []
  for (const item of stored) {
    const product = productById.get(item.productId)
    if (product && item.quantity > 0) {
      lines.push({ product, quantity: item.quantity })
    }
  }
  return lines
}

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [location, setLocation] = useState('Wakad, Pune')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [ready, setReady] = useState(false)
  const [pendingCartItem, setPendingCartItem] = useState<{
    product: Product
    quantity: number
    fromWishlist?: boolean
  } | null>(null)
  const [authModalError, setAuthModalError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved) {
        if (Array.isArray(saved.cart)) {
          setCart(hydrateCart(saved.cart))
        }
        if (Array.isArray(saved.wishlist)) {
          setWishlist(saved.wishlist.filter((id: string) => productById.has(id)))
        }
        if (saved.location) {
          setLocation(saved.location)
        }
      }

      const sessionUserId = localStorage.getItem(SESSION_KEY)
      if (sessionUserId) {
        const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
        const found = users.find((u) => u.id === sessionUserId)
        if (found) {
          const { password: _, ...profile } = found
          setUser(profile)
        }
      }

      const savedOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
      if (Array.isArray(savedOrders)) {
        setOrders(savedOrders)
      }
    } catch {
      // ignore corrupted storage
    }
    setReady(true)

    getRedirectResult(auth).catch(() => {
      // ignore redirect errors on initial load
    })

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const storedProfiles: Record<string, UserProfile> = JSON.parse(
          localStorage.getItem('techiesmart-google-profiles') || '{}'
        )
        const existing = storedProfiles[fbUser.uid]
        const profile: UserProfile = existing || {
          id: fbUser.uid,
          name: fbUser.displayName || 'TechieSmart Member',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          addresses: [],
        }
        setUser(profile)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!ready) return
    const compactCart: StoredCartLine[] = cart.map((line) => ({
      productId: line.product.id,
      quantity: line.quantity,
    }))
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ cart: compactCart, wishlist, location })
    )
  }, [cart, wishlist, location, ready])

  const syncUserToStorage = (updated: UserProfile) => {
    setUser(updated)
    try {
      const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      const nextUsers = users.map((u) =>
        u.id === updated.id ? { ...u, ...updated } : u
      )
      localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers))
    } catch {
      // ignore
    }
  }

  const value = useMemo<CommerceContextValue>(() => {
    const wishlistProducts = wishlist
      .map((id) => productById.get(id))
      .filter((p): p is Product => Boolean(p))

    const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)
    const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
    const bogoSavings = cart.reduce(
      (sum, line) => sum + (line.product.isBOGO ? line.product.price * line.quantity : 0),
      0
    )

    const userOrders = user
      ? orders.filter((o) => o.userId === user.id || o.userId === 'guest')
      : orders.filter((o) => o.userId === 'guest')

    return {
      cart,
      wishlist,
      wishlistProducts,
      location,
      user,
      orders: userOrders,
      cartCount,
      subtotal,
      bogoSavings,
      setLocation,
      addToCart: (product: Product, quantity = 1) => {
        if (!user) {
          setAuthModalError('')
          setPendingCartItem({ product, quantity })
          return
        }
        setCart((lines) => {
          const found = lines.find((line) => line.product.id === product.id)
          return found
            ? lines.map((line) =>
                line.product.id === product.id
                  ? { ...line, quantity: line.quantity + quantity }
                  : line
              )
            : [...lines, { product, quantity }]
        })
      },
      changeQuantity: (id: string, delta: number) =>
        setCart((lines) =>
          lines.flatMap((line) => {
            if (line.product.id !== id) return [line]
            const nextQty = line.quantity + delta
            return nextQty <= 0 ? [] : [{ ...line, quantity: nextQty }]
          })
        ),
      removeFromCart: (id: string) =>
        setCart((lines) => lines.filter((line) => line.product.id !== id)),
      clearCart: () => setCart([]),
      toggleWishlist: (id: string) =>
        setWishlist((ids) =>
          ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
        ),
      moveWishlistToCart: (product: Product) => {
        if (!user) {
          setAuthModalError('')
          setPendingCartItem({ product, quantity: 1, fromWishlist: true })
          return
        }
        setCart((lines) => {
          const found = lines.find((line) => line.product.id === product.id)
          return found
            ? lines.map((line) =>
                line.product.id === product.id
                  ? { ...line, quantity: line.quantity + 1 }
                  : line
              )
            : [...lines, { product, quantity: 1 }]
        })
        setWishlist((ids) => ids.filter((item) => item !== product.id))
      },
      signInWithGoogle: async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider)
          const fbUser = result.user
          const storedProfiles: Record<string, UserProfile> = JSON.parse(
            localStorage.getItem('techiesmart-google-profiles') || '{}'
          )
          const profile: UserProfile = storedProfiles[fbUser.uid] || {
            id: fbUser.uid,
            name: fbUser.displayName || 'TechieSmart Member',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '',
            addresses: [],
          }
          storedProfiles[fbUser.uid] = profile
          localStorage.setItem('techiesmart-google-profiles', JSON.stringify(storedProfiles))
          setUser(profile)
          return { ok: true }
        } catch (err: unknown) {
          const code = (err as { code?: string })?.code
          if (code === 'auth/popup-blocked') {
            await signInWithRedirect(auth, googleProvider)
            return { ok: true }
          }
          return {
            ok: false,
            error: err instanceof Error ? err.message : 'Google Sign-In was cancelled or failed.',
          }
        }
      },
      login: (emailOrPhone: string, password: string) => {
        const identifier = emailOrPhone.trim().toLowerCase()
        if (!identifier || !password) {
          return { ok: false, error: 'Please enter both email/mobile and password.' }
        }
        try {
          const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
          const found = users.find(
            (u) =>
              (u.email.toLowerCase() === identifier || u.phone === identifier) &&
              u.password === password
          )
          if (!found) {
            return { ok: false, error: 'Invalid credentials. Please check your email/mobile and password or register a new account.' }
          }
          const { password: _, ...profile } = found
          setUser(profile)
          localStorage.setItem(SESSION_KEY, found.id)
          return { ok: true }
        } catch {
          return { ok: false, error: 'Unable to access account storage.' }
        }
      },
      register: ({ name, email, phone, password }) => {
        const cleanEmail = email.trim().toLowerCase()
        const cleanPhone = phone.trim()
        if (!name.trim() || !cleanEmail || !cleanPhone || password.length < 6) {
          return {
            ok: false,
            error: 'All fields are required and password must be at least 6 characters.',
          }
        }
        try {
          const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
          if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
            return { ok: false, error: 'An account with this email already exists.' }
          }
          const newUser: StoredUser = {
            id: `USR-${Date.now()}`,
            name: name.trim(),
            email: cleanEmail,
            phone: cleanPhone,
            password,
            addresses: [],
          }
          localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
          localStorage.setItem(SESSION_KEY, newUser.id)
          const { password: _, ...profile } = newUser
          setUser(profile)
          return { ok: true }
        } catch {
          return { ok: false, error: 'Unable to save registration.' }
        }
      },
      resetPassword: (email: string, newPassword: string) => {
        const cleanEmail = email.trim().toLowerCase()
        if (!cleanEmail || newPassword.length < 6) {
          return {
            ok: false,
            error: 'Enter your registered email and a new password (min 6 characters).',
          }
        }
        try {
          const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
          const idx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail)
          if (idx === -1) {
            return { ok: false, error: 'No account found with that email address.' }
          }
          users[idx].password = newPassword
          localStorage.setItem(USERS_KEY, JSON.stringify(users))
          return { ok: true }
        } catch {
          return { ok: false, error: 'Unable to reset password.' }
        }
      },
      logout: () => {
        setUser(null)
        localStorage.removeItem(SESSION_KEY)
        signOut(auth).catch(() => {})
      },
      updateProfile: (data) => {
        if (!user) return
        const updated: UserProfile = {
          ...user,
          ...data,
          name: data.name !== undefined ? data.name.trim() : user.name,
          email: data.email !== undefined ? data.email.trim().toLowerCase() : user.email,
          phone: data.phone !== undefined ? data.phone.trim() : user.phone,
        }
        syncUserToStorage(updated)
        try {
          const googleProfiles: Record<string, UserProfile> = JSON.parse(
            localStorage.getItem('techiesmart-google-profiles') || '{}'
          )
          if (googleProfiles[updated.id] || updated.id) {
            googleProfiles[updated.id] = updated
            localStorage.setItem('techiesmart-google-profiles', JSON.stringify(googleProfiles))
          }
        } catch {
          // ignore
        }
      },
      addAddress: (address) => {
        if (!user) return
        const newAddr: Address = {
          ...address,
          id: `ADDR-${Date.now()}`,
          isDefault: user.addresses.length === 0 ? true : Boolean(address.isDefault),
        }
        const nextAddresses: Address[] = newAddr.isDefault
          ? [...user.addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
          : [...user.addresses, newAddr]
        syncUserToStorage({ ...user, addresses: nextAddresses })
      },
      removeAddress: (id: string) => {
        if (!user) return
        const filtered = user.addresses.filter((a) => a.id !== id)
        if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
          filtered[0].isDefault = true
        }
        syncUserToStorage({ ...user, addresses: filtered })
      },
      setDefaultAddress: (id: string) => {
        if (!user) return
        const updated = user.addresses.map((a) => ({ ...a, isDefault: a.id === id }))
        syncUserToStorage({ ...user, addresses: updated })
      },
      placeOrder: ({ address, paymentMethod, communityCode }) => {
        const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 39
        const newOrder: Order = {
          id: `TS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: user?.id || 'guest',
          createdAt: new Date().toISOString(),
          status: 'Confirmed',
          items: cart.map((line) => ({
            productId: line.product.id,
            name: line.product.name,
            image: line.product.image,
            price: line.product.price,
            mrp: line.product.mrp,
            quantity: line.quantity,
            isBOGO: line.product.isBOGO,
          })),
          subtotal,
          bogoSavings,
          deliveryFee,
          total: subtotal + deliveryFee,
          paymentMethod,
          paymentStatus: paymentMethod.includes('Cash') ? 'Pending' : 'Paid',
          transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          estimatedDelivery: new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          communityCode: communityCode || undefined,
          address,
        }
        const nextOrders = [newOrder, ...orders]
        setOrders(nextOrders)
        try {
          localStorage.setItem(ORDERS_KEY, JSON.stringify(nextOrders))
        } catch {
          // ignore
        }
        setCart([])
        return newOrder
      },
      cancelOrder: (orderId: string) => {
        const nextOrders = orders.map((o) =>
          o.id === orderId ? { ...o, status: 'Cancelled' as OrderStatus, paymentStatus: 'Refunded' as const } : o
        )
        setOrders(nextOrders)
        try {
          localStorage.setItem(ORDERS_KEY, JSON.stringify(nextOrders))
        } catch {
          // ignore
        }
      },
      returnOrder: (orderId: string) => {
        const nextOrders = orders.map((o) =>
          o.id === orderId ? { ...o, status: 'Returned' as OrderStatus, paymentStatus: 'Refunded' as const } : o
        )
        setOrders(nextOrders)
        try {
          localStorage.setItem(ORDERS_KEY, JSON.stringify(nextOrders))
        } catch {
          // ignore
        }
      },
      buyAgain: (order: Order) => {
        setCart((lines) => {
          const next = [...lines]
          for (const item of order.items) {
            const prod = productById.get(item.productId)
            if (!prod) continue
            const existing = next.find((l) => l.product.id === prod.id)
            if (existing) {
              existing.quantity += item.quantity
            } else {
              next.push({ product: prod, quantity: item.quantity })
            }
          }
          return next
        })
      },
    }
  }, [cart, wishlist, location, user, orders])

  return (
    <CommerceContext.Provider value={value}>
      {children}
      {pendingCartItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="google-auth-modal-title"
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#dfe4dc] shadow-2xl space-y-4 text-[#173b32]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#c89c47]">
                TECHIESMART · GOOGLE ACCOUNT
              </p>
              <h2 id="google-auth-modal-title" className="text-xl font-serif font-bold mt-1">
                Sign in with Google to add to cart
              </h2>
              <p className="text-xs text-[#65766e] mt-1">
                Register or sign in with your Google account to save{' '}
                <strong>{pendingCartItem.product.name}</strong> to your cart.
              </p>
            </div>

            {authModalError && (
              <p className="text-xs text-[#9c2b26] bg-[#fbeeed] p-2.5 rounded-lg border border-[#f3c2c0]">
                {authModalError}
              </p>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                disabled={authLoading}
                onClick={async () => {
                  setAuthLoading(true)
                  setAuthModalError('')
                  const res = await value.signInWithGoogle()
                  setAuthLoading(false)
                  if (!res.ok) {
                    setAuthModalError(res.error || 'Google Sign-In failed.')
                    return
                  }
                  const { product, quantity, fromWishlist } = pendingCartItem
                  setCart((lines) => {
                    const found = lines.find((line) => line.product.id === product.id)
                    return found
                      ? lines.map((line) =>
                          line.product.id === product.id
                            ? { ...line, quantity: line.quantity + quantity }
                            : line
                        )
                      : [...lines, { product, quantity }]
                  })
                  if (fromWishlist) {
                    setWishlist((ids) => ids.filter((item) => item !== product.id))
                  }
                  setPendingCartItem(null)
                }}
                className="w-full py-2.5 px-4 bg-[#173b32] !text-white text-xs font-bold rounded-xl hover:bg-[#112d26] disabled:opacity-60"
              >
                {authLoading ? 'Signing in...' : 'Continue with Google'}
              </button>
              <button
                type="button"
                onClick={() => setPendingCartItem(null)}
                className="w-full py-2 px-4 text-xs font-semibold text-[#65766e] hover:text-[#173b32]"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </CommerceContext.Provider>
  )
}

export function useCommerce() {
  const value = useContext(CommerceContext)
  if (!value) throw new Error('useCommerce must be used inside CommerceProvider')
  return value
}
