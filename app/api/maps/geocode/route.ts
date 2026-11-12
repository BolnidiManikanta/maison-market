import { NextRequest, NextResponse } from 'next/server'

interface GeocodeResult {
  street: string
  area: string
  city: string
  state: string
  pincode: string
  formattedAddress: string
  lat: number
  lng: number
}

function parseGoogleAddressComponents(
  components: Array<{ long_name: string; types: string[] }>
) {
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name || ''

  const streetNumber = get('street_number')
  const route = get('route')
  const sublocality2 = get('sublocality_level_2')
  const sublocality1 = get('sublocality_level_1') || get('sublocality')
  const locality = get('locality') || get('administrative_area_level_2')
  const state = get('administrative_area_level_1')
  const pincode = get('postal_code')

  const street = [streetNumber, route, sublocality2].filter(Boolean).join(' ').trim()

  return {
    street: street || sublocality1 || locality,
    area: sublocality1 || sublocality2 || '',
    city: locality || state,
    state,
    pincode,
  }
}

export async function POST(req: NextRequest) {
  let body: { lat?: number; lng?: number; query?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Mode 1: Reverse Geocode (lat, lng)
  if (typeof body.lat === 'number' && typeof body.lng === 'number') {
    const { lat, lng } = body
    if (apiKey) {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
          { cache: 'no-store' }
        )
        const data = (await res.json()) as {
          status: string
          results?: Array<{
            formatted_address: string
            address_components: Array<{ long_name: string; types: string[] }>
          }>
        }
        if (data.status === 'OK' && data.results?.[0]) {
          const top = data.results[0]
          const parsed = parseGoogleAddressComponents(top.address_components || [])
          const result: GeocodeResult = {
            ...parsed,
            formattedAddress: top.formatted_address,
            lat,
            lng,
          }
          return NextResponse.json({ result, source: 'google_geocoding' })
        }
      } catch {
        // Fall through to Nominatim
      }
    }

    // Fallback: OpenStreetMap Nominatim
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'TechieSmart/1.0' } }
      )
      const data = await res.json()
      const addr = data.address || {}
      const result: GeocodeResult = {
        street: [addr.house_number, addr.road, addr.suburb].filter(Boolean).join(', ') || data.display_name || '',
        area: addr.suburb || addr.neighbourhood || '',
        city: addr.city || addr.town || addr.village || addr.state_district || 'Pune',
        state: addr.state || '',
        pincode: addr.postcode || '',
        formattedAddress: data.display_name || '',
        lat,
        lng,
      }
      return NextResponse.json({ result, source: 'nominatim' })
    } catch {
      return NextResponse.json({ error: 'Unable to reverse geocode coordinates.' }, { status: 502 })
    }
  }

  // Mode 2: Forward Address Search (query)
  const query = typeof body.query === 'string' ? body.query.trim() : ''
  if (!query) {
    return NextResponse.json({ error: 'Provide lat/lng or a search query.' }, { status: 400 })
  }

  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`,
        { cache: 'no-store' }
      )
      const data = (await res.json()) as {
        status: string
        results?: Array<{
          formatted_address: string
          geometry: { location: { lat: number; lng: number } }
          address_components: Array<{ long_name: string; types: string[] }>
        }>
      }
      if (data.status === 'OK' && data.results?.length) {
        const results: GeocodeResult[] = data.results.slice(0, 5).map((r) => ({
          ...parseGoogleAddressComponents(r.address_components || []),
          formattedAddress: r.formatted_address,
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
        }))
        return NextResponse.json({ results, source: 'google_geocoding' })
      }
    } catch {
      // Fall through to Nominatim
    }
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': 'TechieSmart/1.0' } }
    )
    const items = (await res.json()) as Array<{
      lat: string
      lon: string
      display_name: string
      address?: Record<string, string>
    }>
    const results: GeocodeResult[] = items.map((item) => ({
      street: item.display_name,
      area: item.address?.suburb || '',
      city: item.address?.city || item.address?.town || item.address?.state_district || '',
      state: item.address?.state || '',
      pincode: item.address?.postcode || '',
      formattedAddress: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon),
    }))
    return NextResponse.json({ results, source: 'nominatim' })
  } catch {
    return NextResponse.json({ error: 'Address search failed.' }, { status: 502 })
  }
}
