import { NextRequest, NextResponse } from 'next/server'

const STORE_LAT = Number(process.env.NEXT_PUBLIC_STORE_LAT || '18.5913')
const STORE_LNG = Number(process.env.NEXT_PUBLIC_STORE_LNG || '73.7610')
const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || 'TechieSmart Hub · Wakad, Pune'
const MAX_RADIUS_KM = Number(process.env.NEXT_PUBLIC_MAX_DELIVERY_RADIUS_KM || '25')

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function computeDeliveryFee(distanceKm: number, subtotal: number): number {
  if (subtotal >= 499 || subtotal === 0) return 0
  if (distanceKm <= 2) return 29
  return Math.min(99, Math.round(29 + (distanceKm - 2) * 8))
}

export async function POST(req: NextRequest) {
  let body: { lat?: number; lng?: number; subtotal?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const lat = Number(body.lat)
  const lng = Number(body.lng)
  const subtotal = Number(body.subtotal || 0)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: 'Valid lat and lng are required.' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  let distanceKm = Number((haversineKm(STORE_LAT, STORE_LNG, lat, lng) * 1.25).toFixed(1))
  let durationMinutes = Math.max(10, Math.round(distanceKm * 3.2))
  let source: 'google_routes' | 'estimate' = 'estimate'

  if (apiKey) {
    try {
      const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
        },
        body: JSON.stringify({
          origin: {
            location: { latLng: { latitude: STORE_LAT, longitude: STORE_LNG } },
          },
          destination: {
            location: { latLng: { latitude: lat, longitude: lng } },
          },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
        }),
        cache: 'no-store',
      })

      if (res.ok) {
        const data = (await res.json()) as {
          routes?: Array<{ distanceMeters?: number; duration?: string }>
        }
        const route = data.routes?.[0]
        if (route?.distanceMeters) {
          distanceKm = Number((route.distanceMeters / 1000).toFixed(1))
          const secs = Number(String(route.duration || '0s').replace('s', ''))
          if (Number.isFinite(secs) && secs > 0) {
            durationMinutes = Math.max(5, Math.round(secs / 60))
          }
          source = 'google_routes'
        }
      }
    } catch {
      // Fall back to Haversine road-factor estimate
    }
  }

  const serviceable = distanceKm <= MAX_RADIUS_KM
  const deliveryFee = computeDeliveryFee(distanceKm, subtotal)

  return NextResponse.json({
    distanceKm,
    durationMinutes,
    deliveryFee,
    serviceable,
    maxRadiusKm: MAX_RADIUS_KM,
    source,
    storeLocation: {
      name: STORE_NAME,
      lat: STORE_LAT,
      lng: STORE_LNG,
    },
  })
}
