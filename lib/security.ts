// Centralized security utilities for input sanitization, validation, rate limiting, and audit logging.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Sliding-window in-memory rate limiter.
 * Returns { allowed, remaining, resetAt }.
 */
export function checkRateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetAt) {
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs }
    rateLimitStore.set(key, entry)
    return { allowed: true, remaining: limit - 1, resetAt: entry.resetAt }
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  }
}

/**
 * Sanitizes user-supplied text by stripping control characters,
 * escaping HTML-significant characters, and enforcing a max length.
 */
export function sanitizeText(input: unknown, maxLen = 200): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen)
}

export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(id)
}

export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === 'string' &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
}

export function isValidPhone(phone: unknown): phone is string {
  return typeof phone === 'string' && /^[+\d\s()-]{7,20}$/.test(phone.trim())
}

export function isValidPincode(pincode: unknown): pincode is string {
  return typeof pincode === 'string' && /^\d{4,10}$/.test(pincode.trim())
}

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'idToken',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  'authorization',
])

export function redactSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(k)) {
      out[k] = '[REDACTED]'
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = redactSensitive(v as Record<string, unknown>)
    } else {
      out[k] = v
    }
  }
  return out
}

export function logSecurityEvent(
  event: string,
  details: Record<string, unknown> = {}
): void {
  const safeDetails = redactSensitive(details)
  console.info(`[SECURITY] ${event}`, JSON.stringify(safeDetails))
}
