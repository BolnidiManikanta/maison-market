import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'
import {
  distributedRateLimit,
  getIdempotencyRecord,
  setIdempotencyRecord,
} from '@/lib/redis'
import {
  isValidId,
  isValidPhone,
  isValidPincode,
  logSecurityEvent,
  sanitizeText,
} from '@/lib/security'

interface OrderItemInput {
  productId: string
  quantity: number
}

interface OrderRequestBody {
  items: OrderItemInput[]
  address: {
    name: string
    phone: string
    street: string
    landmark?: string
    city: string
    pincode: string
  }
  paymentMethod: string
  communityCode?: string
}

const ALLOWED_PAYMENT_METHODS = new Set([
  'UPI (GPay / PhonePe)',
  'Credit / Debit Card',
  'Cash on Delivery',
  'Net Banking',
])

const productMap = new Map(products.map((p) => [p.id, p]))

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  // 1. Distributed Per-IP Rate Limit (30 req/min) & Global Rate Limit (1,200 req/min)
  const [ipRate, globalRate] = await Promise.all([
    distributedRateLimit(`rl:orders:ip:${clientIp}`, 30, 60),
    distributedRateLimit('rl:orders:global', 1200, 60),
  ])

  if (!ipRate.allowed || !globalRate.allowed) {
    logSecurityEvent('ORDER_RATE_LIMITED', {
      clientIp,
      ipCount: ipRate.count,
      globalCount: globalRate.count,
    })
    return NextResponse.json(
      { error: 'Too many order requests. Please wait a moment and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Remaining': String(Math.min(ipRate.remaining, globalRate.remaining)),
        },
      }
    )
  }

  // 2. Distributed Idempotency Check
  const idempotencyKey = req.headers.get('idempotency-key')?.trim()
  if (idempotencyKey) {
    if (!isValidId(idempotencyKey)) {
      return NextResponse.json(
        { error: 'Invalid Idempotency-Key header format.' },
        { status: 400 }
      )
    }
    const cachedRaw = await getIdempotencyRecord(idempotencyKey)
    if (cachedRaw) {
      try {
        const cachedOrder = JSON.parse(cachedRaw)
        return NextResponse.json(
          { order: cachedOrder, deduplicated: true },
          {
            status: 200,
            headers: { 'X-Response-Time': `${Date.now() - startedAt}ms` },
          }
        )
      } catch {
        // Ignore corrupted cache entry and proceed
      }
    }
  }

  let body: OrderRequestBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: 'Order must contain at least one item.' },
      { status: 400 }
    )
  }

  if (body.items.length > 50) {
    return NextResponse.json(
      { error: 'Order exceeds maximum allowed line items (50).' },
      { status: 400 }
    )
  }

  // 3. Validate & sanitize delivery address
  const addr = body.address
  if (!addr || typeof addr !== 'object') {
    return NextResponse.json(
      { error: 'Delivery address is required.' },
      { status: 400 }
    )
  }

  const sanitizedAddress = {
    name: sanitizeText(addr.name, 100),
    phone: sanitizeText(addr.phone, 20),
    street: sanitizeText(addr.street, 200),
    landmark: sanitizeText(addr.landmark || '', 120),
    city: sanitizeText(addr.city, 80),
    pincode: sanitizeText(addr.pincode, 10),
  }

  if (
    !sanitizedAddress.name ||
    !sanitizedAddress.street ||
    !sanitizedAddress.city ||
    !isValidPhone(sanitizedAddress.phone) ||
    !isValidPincode(sanitizedAddress.pincode)
  ) {
    return NextResponse.json(
      { error: 'Please provide a valid delivery address, phone, and pincode.' },
      { status: 400 }
    )
  }

  const paymentMethod = sanitizeText(body.paymentMethod, 60)
  if (!ALLOWED_PAYMENT_METHODS.has(paymentMethod)) {
    return NextResponse.json(
      { error: 'Unsupported payment method.' },
      { status: 400 }
    )
  }

  // 4. Recompute prices, BOGO savings, and stock strictly from server catalog
  let subtotal = 0
  let bogoSavings = 0
  const verifiedItems: Array<{
    productId: string
    name: string
    unitPrice: number
    quantity: number
    freeUnits: number
    lineTotal: number
  }> = []

  for (const item of body.items) {
    if (
      !item ||
      !isValidId(item.productId) ||
      typeof item.quantity !== 'number' ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    ) {
      return NextResponse.json(
        { error: 'Invalid item or quantity in order.' },
        { status: 400 }
      )
    }

    const product = productMap.get(item.productId)
    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.productId} not found.` },
        { status: 404 }
      )
    }

    if (typeof product.stock === 'number' && item.quantity > product.stock) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product.name}.` },
        { status: 409 }
      )
    }

    const freeUnits = product.isBOGO ? Math.floor(item.quantity / 2) : 0
    const paidUnits = item.quantity - freeUnits
    const lineTotal = paidUnits * product.price
    const lineSavings = freeUnits * product.price

    subtotal += lineTotal
    bogoSavings += lineSavings

    verifiedItems.push({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      freeUnits,
      lineTotal,
    })
  }

  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 39
  const total = subtotal + deliveryFee
  const communityCode = body.communityCode
    ? sanitizeText(body.communityCode, 24).toUpperCase()
    : undefined

  const orderRecord = {
    id: `TS-${Math.floor(100000 + Math.random() * 900000)}`,
    items: verifiedItems,
    address: sanitizedAddress,
    paymentMethod,
    communityCode,
    subtotal,
    bogoSavings,
    deliveryFee,
    total,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  }

  if (idempotencyKey) {
    await setIdempotencyRecord(idempotencyKey, JSON.stringify(orderRecord), 600)
  }

  const durationMs = Date.now() - startedAt
  logSecurityEvent('ORDER_VERIFIED', {
    orderId: orderRecord.id,
    total: orderRecord.total,
    itemCount: verifiedItems.length,
    durationMs,
  })

  return NextResponse.json(
    { order: orderRecord },
    {
      status: 201,
      headers: {
        'X-Response-Time': `${durationMs}ms`,
        'X-RateLimit-Remaining': String(Math.min(ipRate.remaining, globalRate.remaining)),
      },
    }
  )
}
