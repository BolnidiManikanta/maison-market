// Zero-dependency Upstash Redis REST client with automatic in-memory fallback for local dev.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

interface MemoryEntry {
  value: string
  expiresAt: number
}

const memoryStore = new Map<string, MemoryEntry>()

export function isRedisConfigured(): boolean {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN)
}

async function upstashCommand<T = unknown>(command: (string | number)[]): Promise<T | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  try {
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = (await res.json()) as { result?: T }
    return data.result ?? null
  } catch {
    return null
  }
}

/**
 * Distributed sliding-window / fixed-window counter.
 * Falls back to in-memory Map when Upstash env vars are not configured.
 */
export async function distributedRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; count: number }> {
  if (isRedisConfigured()) {
    const count = await upstashCommand<number>(['INCR', key])
    if (typeof count === 'number') {
      if (count === 1) {
        await upstashCommand(['EXPIRE', key, windowSeconds])
      }
      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        count,
      }
    }
  }

  // In-memory fallback
  const now = Date.now()
  const existing = memoryStore.get(key)
  if (!existing || now > existing.expiresAt) {
    memoryStore.set(key, {
      value: '1',
      expiresAt: now + windowSeconds * 1000,
    })
    return { allowed: true, remaining: limit - 1, count: 1 }
  }

  const nextCount = Number(existing.value || '0') + 1
  existing.value = String(nextCount)
  return {
    allowed: nextCount <= limit,
    remaining: Math.max(0, limit - nextCount),
    count: nextCount,
  }
}

/**
 * Distributed idempotency get/set using Redis SET NX EX.
 */
export async function getIdempotencyRecord(key: string): Promise<string | null> {
  if (isRedisConfigured()) {
    return upstashCommand<string>(['GET', `idem:${key}`])
  }
  const entry = memoryStore.get(`idem:${key}`)
  if (!entry || Date.now() > entry.expiresAt) return null
  return entry.value
}

export async function setIdempotencyRecord(
  key: string,
  value: string,
  ttlSeconds = 600
): Promise<boolean> {
  if (isRedisConfigured()) {
    const res = await upstashCommand<string>([
      'SET',
      `idem:${key}`,
      value,
      'EX',
      ttlSeconds,
      'NX',
    ])
    return res === 'OK'
  }
  const existing = memoryStore.get(`idem:${key}`)
  if (existing && Date.now() <= existing.expiresAt) return false
  memoryStore.set(`idem:${key}`, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
  return true
}
