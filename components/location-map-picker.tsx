'use client'

import { useEffect, useRef, useState } from 'react'
import { LocateFixed, Search, MapPin, Loader2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

export type PickedLocation = {
  lat: number
  lng: number
  formattedAddress: string
  street: string
  city: string
  pincode: string
}

type SearchResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

export default function LocationMapPicker({
  initialLat = 18.5913,
  initialLng = 73.7389,
  onLocationSelect,
}: {
  initialLat?: number
  initialLng?: number
  onLocationSelect: (loc: PickedLocation) => void
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const markerRef = useRef<import('leaflet').Marker | null>(null)

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [currentAddress, setCurrentAddress] = useState('')

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      )
      const data = await res.json()
      const addr = data.address || {}
      const streetParts = [
        addr.house_number,
        addr.road,
        addr.neighbourhood || addr.suburb,
      ].filter(Boolean)
      const street = streetParts.join(', ') || data.display_name?.split(',').slice(0, 2).join(',') || ''
      const city = addr.city || addr.town || addr.village || addr.state_district || 'Pune'
      const pincode = addr.postcode || ''
      const formattedAddress = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`

      setCurrentAddress(formattedAddress)
      onLocationSelect({
        lat,
        lng,
        formattedAddress,
        street,
        city,
        pincode,
      })
    } catch {
      const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setCurrentAddress(fallback)
      onLocationSelect({
        lat,
        lng,
        formattedAddress: fallback,
        street: '',
        city: 'Pune',
        pincode: '',
      })
    }
  }

  useEffect(() => {
    let mounted = true
    async function initMap() {
      if (!mapContainerRef.current || mapRef.current) return
      const L = (await import('leaflet')).default

      if (!mounted || !mapContainerRef.current) return

      const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 14)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      const pinIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#173b32;border:3px solid #c89c47;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,0.35);"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      })

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: pinIcon,
      }).addTo(map)

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        setCoords({ lat: pos.lat, lng: pos.lng })
        reverseGeocode(pos.lat, pos.lng)
      })

      map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        setCoords({ lat, lng })
        reverseGeocode(lat, lng)
      })

      mapRef.current = map
      markerRef.current = marker
    }

    initMap()
    return () => {
      mounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function movePin(lat: number, lng: number) {
    setCoords({ lat, lng })
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
      mapRef.current.setView([lat, lng], 16)
    }
    reverseGeocode(lat, lng)
  }

  function handleDetectLocation() {
    if (!navigator.geolocation) {
      setStatusMsg('Geolocation is not supported by your browser.')
      return
    }
    setLocating(true)
    setStatusMsg('Requesting GPS location permission...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        setStatusMsg('Live GPS location detected!')
        movePin(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => {
        setLocating(false)
        setStatusMsg(
          err.code === 1
            ? 'Location permission denied. You can search or drag the pin on the map.'
            : 'Unable to detect GPS location. Try searching your address.'
        )
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    setStatusMsg('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          searchQuery.trim()
        )}`
      )
      const data: SearchResult[] = await res.json()
      setSearchResults(data)
      if (data.length === 0) {
        setStatusMsg('No matching locations found. Try a broader search.')
      }
    } catch {
      setStatusMsg('Address search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65766e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, street, landmark, or pincode..."
              className="w-full pl-8 pr-3 py-2 border border-[#dfe4dc] rounded-lg text-xs bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-3.5 py-2 bg-[#173b32] !text-white text-xs font-bold rounded-lg hover:bg-[#112d26] disabled:opacity-60"
          >
            {searching ? <Loader2 size={14} className="animate-spin" /> : 'Search'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={locating}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-[#173b32] text-[#173b32] text-xs font-bold rounded-lg hover:bg-[#edf2ec] disabled:opacity-60"
        >
          {locating ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
          Detect My Location
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white border border-[#dfe4dc] rounded-xl divide-y divide-[#dfe4dc] max-h-40 overflow-y-auto">
          {searchResults.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onClick={() => {
                movePin(parseFloat(item.lat), parseFloat(item.lon))
                setSearchResults([])
              }}
              className="w-full text-left px-3 py-2 text-xs text-[#173b32] hover:bg-[#f6f5f0] flex items-start gap-2"
            >
              <MapPin size={13} className="text-[#c89c47] shrink-0 mt-0.5" />
              <span>{item.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {statusMsg && <p className="text-[11px] text-[#4d5e55] font-medium">{statusMsg}</p>}

      <div
        ref={mapContainerRef}
        className="w-full h-64 rounded-xl border border-[#dfe4dc] overflow-hidden z-0"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#65766e] bg-[#f9faf7] px-3 py-2 rounded-lg border border-[#dfe4dc]">
        <span className="truncate max-w-full sm:max-w-[70%]">
          <strong className="text-[#173b32]">Selected Pin:</strong>{' '}
          {currentAddress || 'Drag the pin or click anywhere on the map'}
        </span>
        <span className="font-mono">
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </span>
      </div>
    </div>
  )
}
