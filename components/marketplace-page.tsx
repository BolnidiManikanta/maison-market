'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  ShoppingBag,
  Plus,
  Minus,
  Heart,
  Clock3,
  CheckCircle2,
  Users,
  Sparkles,
  Store,
  Wrench,
  TrendingUp,
  Tag,
  Building2,
  PhoneCall,
  Check,
} from 'lucide-react'
import {
  buysProducts,
  locationOptions,
  resellerListings,
  saleProducts,
  serviceCatalog,
  demoCommunities,
  CommunityRecord,
  Service,
  findService,
  getServiceSlug,
} from '@/data/marketplaces'
import ServiceBookingModal from '@/components/service-booking-modal'
import {
  products,
  buyCategories,
  sellCategories,
  serviceCategories,
  communityCategories,
  searchProducts,
  Product,
} from '@/data/products'
import { useCommerce } from '@/components/commerce-provider'
import MarketplaceCategoryGrid, {
  CategoryCardItem,
} from '@/components/marketplace-category-grid'

const money = (n: number) => `₹${n.toLocaleString('en-IN')}`
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export default function MarketplacePage({
  kind,
  initialCategory,
  initialServiceId,
}: {
  kind: 'services' | 'resellers' | 'buys' | 'sale' | 'sell' | 'categories' | 'community'
  initialCategory?: string
  initialServiceId?: string
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(
    initialCategory
      ? serviceCategories.find((x) => slugify(x) === initialCategory) ||
          sellCategories.find((x) => slugify(x) === initialCategory) ||
          'All'
      : 'All'
  )
  const [location, setLocation] = useState('')
  const [notice, setNotice] = useState('')

  if (kind === 'categories') return <BuyMartCategoryHub />
  if (kind === 'community') return <CommunityHub />
  if (kind === 'services')
    return (
      <Services
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        notice={notice}
        setNotice={setNotice}
        initialServiceId={initialServiceId}
      />
    )
  if (kind === 'sell')
    return (
      <SellMart
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
        notice={notice}
        setNotice={setNotice}
      />
    )

  const source =
    kind === 'resellers' ? resellerListings : kind === 'buys' ? buysProducts : saleProducts
  const cats = ['All', ...Array.from(new Set(source.map((x) => x.category)))]
  const list = useMemo(
    () =>
      source.filter(
        (x) =>
          (category === 'All' || x.category === category) &&
          (!query ||
            `${x.title} ${x.category} ${x.description}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (!location || x.location.toLowerCase().includes(location.toLowerCase()))
      ),
    [category, location, query, source]
  )
  const title =
    kind === 'resellers'
      ? 'Resellers marketplace'
      : kind === 'buys'
      ? 'Buys: inspected refurbished'
      : 'Sale, with the price upfront.'

  return (
    <main className="marketplace-page">
      <div className="marketplace-shell">
        <div className="marketplace-head">
          <div>
            <p className="eyebrow">MAISONMARKET</p>
            <h1>{title}</h1>
            <p>
              Pre-owned, certified refurbished, and clear seasonal offers from verified
              community sellers and verified partners.
            </p>
          </div>
          <Link href="/sell-mart" className="button primary">
            List an item <ArrowRight size={16} />
          </Link>
        </div>

        {notice && (
          <div className="market-notice">
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        <div className="market-toolbar">
          <div className="market-search">
            <Search size={16} />
            <input
              aria-label="Search listings"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand or category..."
            />
          </div>
          <select
            aria-label="Filter by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All locations</option>
            {locationOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="market-chips">
          {cats.map((c) => (
            <button
              key={c}
              className={category === c ? 'active' : ''}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="market-meta">
          <b>{list.length} listings available</b>
          <span>Inspected & verified for community safety</span>
        </div>

        <div className="market-grid">
          {list.map((item) => (
            <article className="market-card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="market-body">
                <span className="market-condition">{item.condition}</span>
                <h2>{item.title}</h2>
                <div className="market-seller">
                  <span>{item.seller}</span>
                  <span>
                    <Star size={12} fill="currentColor" /> {item.rating}
                  </span>
                </div>
                <p className="market-desc">{item.description}</p>
                <div className="market-price-row">
                  <div>
                    <b>{money(item.price)}</b>
                    {item.originalPrice > item.price && (
                      <del>{money(item.originalPrice)}</del>
                    )}
                  </div>
                  <span className="market-loc">
                    <MapPin size={12} /> {item.location}
                  </span>
                </div>
                <button
                  className="button secondary mt-3 w-full"
                  onClick={() =>
                    setNotice(
                      `Contact enquiry sent to seller for “${item.title}”. Check your account messages.`
                    )
                  }
                >
                  Contact seller <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

/* =========================================================================
   1. BUY MART - Product Categories Selection Hub
   ========================================================================= */
function BuyMartCategoryHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [query, setQuery] = useState('')
  const { cart, wishlist, addToCart, changeQuantity, toggleWishlist, cartCount } =
    useCommerce()

  const buyCategoryCards: CategoryCardItem[] = [
    {
      id: 'fresh',
      name: 'Fresh',
      subtitle: 'Produce & Dairy',
      badgeText: '20 picks',
      letterBadge: 'F',
      image: '/images/products/fresh-produce.png',
      href: '/categories/fresh',
    },
    {
      id: 'smart',
      name: 'Smart',
      subtitle: 'Gadgets & Tech',
      badgeText: '20 picks',
      letterBadge: 'S',
      image: '/images/products/smart-electronics.png',
      href: '/categories/smart',
    },
    {
      id: 'home-needs',
      name: 'Home Needs',
      subtitle: 'Kitchen & Utility',
      badgeText: '25 picks',
      letterBadge: 'H',
      image: '/images/products/home-utility.png',
      href: '/categories/home-needs',
    },
    {
      id: 'divine',
      name: 'Divine',
      subtitle: 'Puja Essentials',
      badgeText: '20 picks',
      letterBadge: 'D',
      image: '/images/products/divine.png',
      href: '/categories/divine',
    },
    {
      id: 'tribe',
      name: 'Tribe',
      subtitle: 'Living & Regional',
      badgeText: '20 picks',
      letterBadge: 'T',
      image: '/images/products/tribe.png',
      href: '/categories/tribe',
    },
    {
      id: 'fashion',
      name: 'Fashion',
      subtitle: 'Apparel & Wear',
      badgeText: '24 picks',
      letterBadge: 'F',
      image: '/images/products/tribe/womens-kurti.png',
      href: '/categories/fashion',
    },
    {
      id: 'cosmetics',
      name: 'Cosmetics',
      subtitle: 'Skin & Beauty',
      badgeText: '24 picks',
      letterBadge: 'C',
      image: '/images/products/smart/neem-face-wash.png',
      href: '/categories/cosmetics',
    },
    {
      id: 'furniture',
      name: 'Furniture',
      subtitle: 'Living & Office',
      badgeText: '24 picks',
      letterBadge: 'F',
      image: '/images/products/budget/three-seater-sofa.png',
      href: '/categories/furniture',
    },
    {
      id: 'bulk-order',
      name: 'Bulk Order',
      subtitle: 'Pantry & Wholesale',
      badgeText: '22 picks',
      letterBadge: 'B',
      image: '/images/products/shop.png',
      href: '/categories/bulk-order',
    },
    {
      id: 'refurbished',
      name: 'Refurbished',
      subtitle: 'Tested Tech & TV',
      badgeText: '22 picks',
      letterBadge: 'R',
      image: '/images/marketplace/refurbished-phone.png',
      href: '/categories/refurbished',
    },
  ]

  const pool = useMemo(() => {
    let list = products
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategory)
    }
    if (query) {
      list = list.filter((p) =>
        searchProducts(query).some((x) => x.id === p.id)
      )
    }
    return list
  }, [selectedCategory, query])

  const qtyFor = (id: string) =>
    cart.find((line) => line.product.id === id)?.quantity || 0

  return (
    <main className="marketplace-page">
      <div className="marketplace-shell">
        {/* Reusable Photographic Category Selection Grid */}
        <MarketplaceCategoryGrid
          kicker="Buy Mart Categories"
          title="Shop products you love"
          description="Explore complete inventories across fresh produce, electronics, home essentials, fashion, cosmetics, furniture, bulk orders, and certified refurbished goods."
          categories={buyCategoryCards}
          columnsDesktop={5}
        />

        {/* Category Filter Tabs & Search Header */}
        <div className="marketplace-head mt-8">
          <div>
            <p className="eyebrow">BUY MART · CATALOGUE INVENTORY</p>
            <h1>
              {selectedCategory === 'all'
                ? 'All Products Inventory'
                : buyCategoryCards.find((c) => c.id === selectedCategory)?.name +
                  ' Collection'}
            </h1>
            <p>
              Showing {pool.length} real product items with transparent pricing,
              stock status, and neighbourhood delivery.
            </p>
          </div>
          <Link href="/cart" className="button primary">
            <ShoppingBag size={16} /> Cart {cartCount ? `· ${cartCount}` : ''}
          </Link>
        </div>

        {/* Search & Sub-Filter Bar */}
        <div className="market-toolbar">
          <div className="market-search">
            <Search size={16} />
            <input
              aria-label="Search all Buy Mart products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in Buy Mart (e.g. shirt, kurti, apple, sofa, cream)..."
            />
          </div>
        </div>

        {/* Category filter chips */}
        <div className="market-chips">
          <button
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories ({products.length})
          </button>
          {buyCategoryCards.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length
            return (
              <button
                key={c.id}
                className={selectedCategory === c.id ? 'active' : ''}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.name} ({count})
              </button>
            )
          })}
        </div>

        <div className="market-meta">
          <b>{pool.length} products found</b>
          <span>Direct neighbourhood inventory</span>
        </div>

        {/* Full Products Grid - COMPLETE PRODUCT CARDS */}
        <div className="catalog-grid">
          {pool.map((p) => {
            const qty = qtyFor(p.id)
            return (
              <article className="catalog-card" key={p.id}>
                <div className="catalog-image">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  {p.isBOGO ? (
                    <span className="bogo-badge">BUY 1 GET 1</span>
                  ) : (
                    <span
                      className="bogo-badge"
                      style={{ background: '#355b4b' }}
                    >
                      VERIFIED
                    </span>
                  )}
                  <button
                    className={`wish ${wishlist.includes(p.id) ? 'active' : ''}`}
                    aria-label="Toggle wishlist"
                    onClick={() => toggleWishlist(p.id)}
                  >
                    <Heart
                      size={17}
                      fill={wishlist.includes(p.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
                <div className="catalog-card-body">
                  <small>
                    {p.brand} · {p.unit}
                  </small>
                  <Link href={`/${p.slug}`} className="catalog-name">
                    {p.name}
                  </Link>
                  <div className="rating">
                    ★ {p.rating} <span>({p.reviewCount})</span>
                  </div>
                  <div className="catalog-price">
                    <b>{money(p.price)}</b>
                    <del>{money(p.mrp)}</del>
                    <em>{Math.round((1 - p.price / p.mrp) * 100)}% off</em>
                  </div>
                  {p.isBOGO ? (
                    <div className="bogo-detail">
                      <b>Pay {money(p.price)}</b>
                      <span>Receive 2 units · Save {money(p.price)}</span>
                    </div>
                  ) : (
                    <div
                      className="bogo-detail"
                      style={{ color: '#2d5345', background: '#eaf4ee' }}
                    >
                      <b>Direct Value Price</b>
                      <span>Transparent rate</span>
                    </div>
                  )}
                  <small className="delivery-text">Delivery {p.deliveryTime}</small>
                  {qty ? (
                    <div className="stepper">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => changeQuantity(p.id, -1)}
                      >
                        <Minus size={15} />
                      </button>
                      <b>{qty}</b>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => changeQuantity(p.id, 1)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-button"
                      onClick={() => addToCart(p)}
                    >
                      ADD <Plus size={15} />
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}

/* =========================================================================
   2. SELL MART - Pre-Loved, Resale, Scraps & Vehicles Hub
   ========================================================================= */
function SellMart({
  query,
  setQuery,
  category,
  setCategory,
  location,
  setLocation,
  notice,
  setNotice,
}: {
  query: string
  setQuery: (v: string) => void
  category: string
  setCategory: (v: string) => void
  location: string
  setLocation: (v: string) => void
  notice: string
  setNotice: (v: string) => void
}) {
  const sellCategoryCards: CategoryCardItem[] = [
    {
      id: 'selling-club',
      name: 'Selling Club',
      subtitle: 'Furniture & Living',
      badgeText: '6 listings',
      letterBadge: 'S',
      image: '/images/products/budget/three-seater-sofa.png',
      href: '/sell-mart/selling-club',
    },
    {
      id: 'electronics',
      name: 'Electronics',
      subtitle: 'TV, Fridge & Laptops',
      badgeText: '8 listings',
      letterBadge: 'E',
      image: '/images/marketplace/resale-tv.png',
      href: '/sell-mart/electronics',
    },
    {
      id: 'scraps',
      name: 'Scraps',
      subtitle: 'Metal, Brass & E-waste',
      badgeText: '2 listings',
      letterBadge: 'S',
      image: '/images/products/divine/brass-diya-set.png',
      href: '/sell-mart/scraps',
    },
    {
      id: '4-wheeler',
      name: '4 Wheeler',
      subtitle: 'Tyres, Mat & Care',
      badgeText: '2 listings',
      letterBadge: '4',
      image: '/images/products/automobile/microfiber-car-duster.png',
      href: '/sell-mart/4-wheeler',
    },
    {
      id: 'dry-wash',
      name: 'Dry Wash',
      subtitle: 'Waterless Auto Polish',
      badgeText: '1 pack',
      letterBadge: 'D',
      image: '/images/products/automobile/microfiber-car-duster.png',
      href: '/sell-mart/dry-wash',
    },
    {
      id: 'bicycle',
      name: 'Bicycle',
      subtitle: 'Gear Cycles & Kids Bikes',
      badgeText: '2 listings',
      letterBadge: 'B',
      image: '/images/products/automobile/bike-cleaning-kit.png',
      href: '/sell-mart/bicycle',
    },
    {
      id: 'car',
      name: 'Car',
      subtitle: 'Verified Pre-Owned Cars',
      badgeText: '2 listings',
      letterBadge: 'C',
      image: '/images/products/automobile/car-phone-mount.png',
      href: '/sell-mart/car',
    },
    {
      id: 'bike',
      name: 'Bike',
      subtitle: 'Scooters & Motorcycles',
      badgeText: '2 listings',
      letterBadge: 'B',
      image: '/images/products/automobile/led-bike-indicator.png',
      href: '/sell-mart/bike',
    },
  ]

  const sellCats = [
    'All',
    'Selling Club',
    'Electronics',
    'Bicycle',
    'Bike',
    'Car',
    '4 Wheeler',
    'Scraps',
    'Dry Wash',
  ]

  const list = useMemo(
    () =>
      resellerListings.filter(
        (x) =>
          (category === 'All' ||
            x.category.toLowerCase() === category.toLowerCase() ||
            slugify(x.category) === slugify(category)) &&
          (!query ||
            `${x.title} ${x.category} ${x.description} ${x.seller}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (!location || x.location.toLowerCase().includes(location.toLowerCase()))
      ),
    [category, location, query]
  )

  return (
    <main className="marketplace-page">
      <div className="marketplace-shell">
        <MarketplaceCategoryGrid
          kicker="Sell Mart Categories"
          title="Sell what you no longer need"
          description="List furniture, electronics, cycles, vehicles, and scraps directly to nearby neighbours with verified inspection support."
          categories={sellCategoryCards}
          columnsDesktop={4}
        />

        <div className="marketplace-head mt-8">
          <div>
            <p className="eyebrow">SELL MART · NEIGHBOURHOOD LISTINGS</p>
            <h1>Pre-Loved & Resale Exchange</h1>
            <p>
              Connect with verified local residents across Pune for honest prices,
              clean inspection notes, and zero-brokerage pickups.
            </p>
          </div>
          <button
            className="button primary"
            onClick={() => {
              const el = document.getElementById('listing-form-sec')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Post your listing <Plus size={16} />
          </button>
        </div>

        {notice && (
          <div className="market-notice">
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        <div className="market-toolbar">
          <div className="market-search">
            <Search size={16} />
            <input
              aria-label="Search Sell Mart listings"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, appliance, car, bike or seller..."
            />
          </div>
          <select
            aria-label="Filter listings by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Pune Locations</option>
            {locationOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="market-chips">
          {sellCats.map((c) => (
            <button
              key={c}
              className={category === c ? 'active' : ''}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="market-meta">
          <b>{list.length} verified listings</b>
          <span>Direct seller exchange · No middleman</span>
        </div>

        <div className="market-grid">
          {list.map((item) => (
            <article className="market-card" key={item.id}>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="market-body">
                <span className="market-condition">{item.condition}</span>
                <h2>{item.title}</h2>
                <div className="market-seller">
                  <span>{item.seller}</span>
                  <span>
                    <Star size={12} fill="currentColor" /> {item.rating}
                  </span>
                </div>
                <p className="market-desc">{item.description}</p>
                <div className="market-price-row">
                  <div>
                    <b>{money(item.price)}</b>
                    {item.originalPrice > item.price && (
                      <del>{money(item.originalPrice)}</del>
                    )}
                  </div>
                  <span className="market-loc">
                    <MapPin size={12} /> {item.location}
                  </span>
                </div>
                <button
                  className="button secondary mt-3 w-full"
                  onClick={() =>
                    setNotice(
                      `Contact request sent to ${item.seller} for “${item.title}”. They will call or message your number.`
                    )
                  }
                >
                  Message seller <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div id="listing-form-sec" className="mt-12">
          <ListingForm setNotice={setNotice} />
        </div>
      </div>
    </main>
  )
}

/* =========================================================================
   3. SERV MART - Doorstep Services Hub (WITH CORRECT IMAGES)
   ========================================================================= */
function Services({
  query,
  setQuery,
  category,
  setCategory,
  notice,
  setNotice,
  initialServiceId,
}: {
  query: string
  setQuery: (v: string) => void
  category: string
  setCategory: (v: string) => void
  notice: string
  setNotice: (v: string) => void
  initialServiceId?: string
}) {
  const [location, setLocation] = useState('')
  const [bookingService, setBookingService] = useState<Service | null>(() => {
    if (initialServiceId) {
      const found = findService(initialServiceId)
      if (found) return found
    }
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const bookParam = urlParams.get('book') || urlParams.get('service')
      if (bookParam) {
        const found = findService(bookParam)
        if (found) return found
      }
    }
    return null
  })

  // Synchronize on browser history popstate or query changes
  useEffect(() => {
    function readParamFromUrl() {
      if (typeof window === 'undefined') return
      const urlParams = new URLSearchParams(window.location.search)
      const bookParam = urlParams.get('book') || urlParams.get('service')
      if (bookParam) {
        const found = findService(bookParam)
        if (found) {
          setBookingService(found)
        }
      }
    }

    readParamFromUrl()
    window.addEventListener('popstate', readParamFromUrl)
    return () => {
      window.removeEventListener('popstate', readParamFromUrl)
    }
  }, [])

  // Synchronize when initialServiceId prop changes (e.g. Next.js router transitions)
  useEffect(() => {
    if (initialServiceId) {
      const found = findService(initialServiceId)
      if (found) {
        setBookingService(found)
      }
    }
  }, [initialServiceId])

  // Fixed Photographic Service Category Cards
  const servCategoryCards: CategoryCardItem[] = [
    {
      id: 'home-care',
      name: 'Home Care',
      subtitle: 'Deep clean & sanitization',
      badgeText: '4 Services',
      letterBadge: 'H',
      image: '/images/services/home-cleaning.png', // GENUINE HOME CLEANING IMAGE
      href: '/serv-mart/home-care',
    },
    {
      id: 'electrical-electronics',
      name: 'Electrical',
      subtitle: 'Wiring, fixtures & fans',
      badgeText: '3 Services',
      letterBadge: 'E',
      image: '/images/services/electrician.png',
      href: '/serv-mart/electrical-and-electronics',
    },
    {
      id: 'home-appliances',
      name: 'Home Appliances',
      subtitle: 'AC, fridge & washer repair',
      badgeText: '3 Services',
      letterBadge: 'A',
      image: '/images/marketplace/resale-washer.png',
      href: '/serv-mart/home-appliances',
    },
    {
      id: 'plumbing-water',
      name: 'Plumbing',
      subtitle: 'Taps, tanks & drainage',
      badgeText: '3 Services',
      letterBadge: 'P',
      image: '/images/services/plumber.png',
      href: '/serv-mart/plumbing-and-water',
    },
    {
      id: 'carpentry-furniture',
      name: 'Carpentry',
      subtitle: 'Assembly, locks & woodwork',
      badgeText: '2 Services',
      letterBadge: 'C',
      image: '/images/services/furniture-repair.png',
      href: '/serv-mart/carpentry-and-furniture',
    },
    {
      id: 'painting-home-maintenance',
      name: 'Painting',
      subtitle: 'Wall painting & damp fix',
      badgeText: '2 Services',
      letterBadge: 'P',
      image: '/images/services/home-painting.png',
      href: '/serv-mart/painting-and-home-maintenance',
    },
    {
      id: 'automobile-services',
      name: 'Automobile Care',
      subtitle: 'Car foam wash & bike lube',
      badgeText: '2 Services',
      letterBadge: 'A',
      image: '/images/services/cleaning.png', // CAR CLEANING IMAGE FOR AUTOMOBILE
      href: '/serv-mart/automobile-services',
    },
    {
      id: 'outdoor-garden',
      name: 'Garden Care',
      subtitle: 'Balcony & society lawn',
      badgeText: '1 Service',
      letterBadge: 'G',
      image: '/images/services/garden.png',
      href: '/serv-mart/outdoor-and-garden',
    },
  ]

  const cats = [
    'All',
    'Home Care',
    'Electrical & Electronics',
    'Home Appliances',
    'Plumbing & Water',
    'Carpentry & Furniture',
    'Painting & Home Maintenance',
    'Automobile Services',
    'Outdoor & Garden',
    'Health & Elder Support',
    'Moving & Delivery',
    'Specialized Services',
    'Events & Community Activities',
  ]

  const list = useMemo(
    () =>
      serviceCatalog.filter(
        (s) =>
          (category === 'All' ||
            s.category.toLowerCase() === category.toLowerCase() ||
            slugify(s.category) === slugify(category)) &&
          (!query ||
            `${s.name} ${s.category} ${s.description} ${s.provider}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (!location || s.location.toLowerCase().includes(location.toLowerCase()))
      ),
    [category, location, query]
  )

  return (
    <main className="marketplace-page">
      <div className="marketplace-shell">
        <MarketplaceCategoryGrid
          kicker="Serv Mart Categories"
          title="Book trusted doorstep services"
          description="Book certified electricians, plumbers, home deep cleaners, appliance technicians, and car wash pros with upfront transparent visit pricing."
          categories={servCategoryCards}
          columnsDesktop={4}
        />

        <div className="marketplace-head mt-8">
          <div>
            <p className="eyebrow">SERV MART · BOOK VERIFIED EXPERTS</p>
            <h1>Doorstep Services with upfront scope</h1>
            <p>
              Pre-agreed transparent pricing, background-verified professionals,
              and dedicated neighbourhood time slots.
            </p>
          </div>
        </div>

        {notice && (
          <div className="market-notice">
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        <div className="market-toolbar">
          <div className="market-search">
            <Search size={16} />
            <input
              aria-label="Search Serv Mart"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by service, electrician, cleaning, plumbing, AC..."
            />
          </div>
          <select
            aria-label="Filter services by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locationOptions.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="market-chips">
          {cats.map((c) => (
            <button
              key={c}
              className={category === c ? 'active' : ''}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="market-meta">
          <b>{list.length} services available</b>
          <span>Itemised scope before booking</span>
        </div>

        <div className="service-grid">
          {list.map((s) => {
            const serviceSlug = s.slug || getServiceSlug(s)
            return (
              <article className="service-card" key={s.id}>
                <img src={s.image} alt={`${s.name} service`} loading="lazy" />
                <div className="service-body">
                  <span className="service-category">{s.category}</span>
                  <h2>{s.name}</h2>
                  <p className="provider">
                    {s.provider} · <Star size={13} fill="currentColor" /> {s.rating} (
                    {s.reviewCount})
                  </p>
                  <p>{s.description}</p>
                  <div className="service-meta">
                    <b>{money(s.price)}</b>
                    <span>
                      <MapPin size={13} /> {s.location}
                    </span>
                    <span>{s.availability}</span>
                  </div>
                  <a
                    id={`book-service-${serviceSlug}`}
                    data-service-id={serviceSlug}
                    href={`/serv-mart?book=${encodeURIComponent(serviceSlug)}`}
                    className="button primary mt-3"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 10,
                      pointerEvents: 'auto',
                      width: '100%',
                      textDecoration: 'none',
                    }}
                    onClick={(e) => {
                      if (typeof window !== 'undefined' && window.history) {
                        window.history.pushState(
                          null,
                          '',
                          `/serv-mart?book=${encodeURIComponent(serviceSlug)}`
                        )
                      }
                      setBookingService(s)
                    }}
                  >
                    Book service <CalendarDays size={15} />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {bookingService && (
        <ServiceBookingModal
          service={bookingService}
          onClose={() => {
            setBookingService(null)
            if (typeof window !== 'undefined' && window.history) {
              try {
                const url = new URL(window.location.href)
                url.searchParams.delete('book')
                url.searchParams.delete('service')
                const searchStr = url.searchParams.toString()
                const cleanUrl = url.pathname + (searchStr ? `?${searchStr}` : '')
                window.history.pushState(null, '', cleanUrl || '/serv-mart')
              } catch {
                window.history.pushState(null, '', '/serv-mart')
              }
            }
          }}
          onSuccess={(booking) => {
            setNotice(
              `✓ Booking #${booking.id} confirmed for ${booking.serviceName} (${money(
                booking.amount
              )}). Check details in your Account under My Bookings.`
            )
            setBookingService(null)
            if (typeof window !== 'undefined' && window.history) {
              try {
                const url = new URL(window.location.href)
                url.searchParams.delete('book')
                url.searchParams.delete('service')
                const searchStr = url.searchParams.toString()
                const cleanUrl = url.pathname + (searchStr ? `?${searchStr}` : '')
                window.history.pushState(null, '', cleanUrl || '/serv-mart')
              } catch {
                window.history.pushState(null, '', '/serv-mart')
              }
            }
          }}
        />
      )}
    </main>
  )
}

/* =========================================================================
   4. COMMUNITIES - Real Residential Collectives & Hubs
   ========================================================================= */
function CommunityHub() {
  const [activeCode, setActiveCode] = useState('')
  const [joinedMsg, setJoinedMsg] = useState('')
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityRecord | null>(
    null
  )

  const communityCategoryCards: CategoryCardItem[] = [
    {
      id: 'neighbourhoods',
      name: 'Neighbourhoods',
      subtitle: 'Wakad, Baner & Hinjewadi',
      badgeText: '6 Active hubs',
      letterBadge: 'N',
      image: '/images/marketplace/nav-communities.svg',
    },
    {
      id: 'group-buying',
      name: 'Group Buying',
      subtitle: 'Combine demand & save',
      badgeText: '1% Cashback',
      letterBadge: 'G',
      image: '/images/products/fresh-produce.png',
    },
    {
      id: 'security-safety',
      name: 'Security & Safety',
      subtitle: 'CCTV, staff & entry passes',
      badgeText: 'Verified',
      letterBadge: 'S',
      image: '/images/services/electrician.png',
    },
    {
      id: 'housekeeping-staff',
      name: 'Housekeeping',
      subtitle: 'Shared maintenance & staff',
      badgeText: 'Coordination',
      letterBadge: 'H',
      image: '/images/services/home-cleaning.png',
    },
    {
      id: 'local-buy-sell',
      name: 'Local Buy & Sell',
      subtitle: 'Neighbourhood resale circle',
      badgeText: 'Zero Fee',
      letterBadge: 'L',
      image: '/images/marketplace/resale-tv.png',
    },
    {
      id: 'community-wallet',
      name: 'Community Wallet',
      subtitle: 'Shared credits & reward perks',
      badgeText: 'Active perks',
      letterBadge: 'W',
      image: '/images/products/smart-electronics.png',
    },
  ]

  return (
    <main className="marketplace-page">
      <div className="marketplace-shell">
        <MarketplaceCategoryGrid
          kicker="Local Communities"
          title="Connect, share & grow together"
          description="Join verified residential collectives, access group BOGO savings, and coordinate neighbourhood support."
          categories={communityCategoryCards}
          columnsDesktop={6}
        />

        <div className="marketplace-head mt-8">
          <div>
            <p className="eyebrow">MAISONMARKET · COMMUNITIES</p>
            <h1>Community commerce, locally coordinated.</h1>
            <p>
              Connect residents, services, safety, household support, and shared
              purchasing in one clear workspace.
            </p>
          </div>
        </div>

        {/* Join Community Code Bar */}
        <div className="my-6 rounded-xl border border-[#dfe4dc] bg-white p-6 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#173b32]">
            Join your residential collective
          </h3>
          <p className="text-xs text-[#65766e] mt-1">
            Enter your apartment or building community code (e.g. WAKAD001,
            HINJEWADI002, BANER003, AUNDH004, KOTHRUD005, VIMAN006) to link
            collective benefits.
          </p>
          <div className="mt-4 flex max-w-md gap-2">
            <input
              className="flex-1 rounded-lg border border-[#dfe4dc] bg-[#f8faf7] px-3.5 py-2 text-sm text-[#173b32] uppercase placeholder:normal-case focus:border-[#c89c47] focus:outline-none"
              placeholder="e.g. WAKAD001"
              value={activeCode}
              onChange={(e) => setActiveCode(e.target.value.toUpperCase())}
            />
            <button
              className="rounded-lg bg-[#173b32] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#173b32]/90"
              onClick={() => {
                const found = demoCommunities.find((c) => c.code === activeCode)
                if (found) {
                  setSelectedCommunity(found)
                  setJoinedMsg(`Connected to ${found.name}! ${found.benefit}.`)
                } else {
                  setJoinedMsg(
                    activeCode
                      ? `Code “${activeCode}” linked in demo mode.`
                      : 'Please enter a valid community code.'
                  )
                }
              }}
            >
              Connect
            </button>
          </div>
          {joinedMsg && (
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#173b32] bg-[#edf7f1] p-3 rounded-lg">
              <CheckCircle2 size={16} className="text-[#0e3b2e]" />
              {joinedMsg}
            </div>
          )}
        </div>

        {/* Selected Community Detail Panel if active */}
        {selectedCommunity && (
          <div className="my-6 rounded-xl border border-[#c89c47] bg-[#fcfaf5] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded bg-[#173b32] px-2.5 py-1 text-xs font-bold text-white">
                  CODE: {selectedCommunity.code}
                </span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-[#173b32]">
                  {selectedCommunity.name}
                </h2>
                <p className="text-sm text-[#4f6159] mt-1">
                  {selectedCommunity.description}
                </p>
              </div>
              <button
                className="text-xs text-[#65766e] underline hover:text-[#173b32]"
                onClick={() => setSelectedCommunity(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-[#e2d5bd] pt-4 text-xs">
              <div>
                <span className="text-[#65766e]">Coordinator:</span>
                <p className="font-bold text-[#173b32]">
                  {selectedCommunity.coordinator}
                </p>
              </div>
              <div>
                <span className="text-[#65766e]">Drop-off Zone:</span>
                <p className="font-bold text-[#173b32]">
                  {selectedCommunity.hubAddress}
                </p>
              </div>
              <div>
                <span className="text-[#65766e]">Resident Scale:</span>
                <p className="font-bold text-[#173b32]">
                  {selectedCommunity.familiesCount} Families ·{' '}
                  {selectedCommunity.activeCampaigns} Active Campaigns
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {selectedCommunity.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[#f0e6d2] px-3 py-1 text-[11px] font-semibold text-[#6d4d12]"
                >
                  ✓ {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Active Real Community Records Grid */}
        <div className="market-grid">
          {demoCommunities.map((c) => (
            <article className="market-card" key={c.code}>
              <div className="market-body">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">CODE: {c.code}</p>
                  <span className="rounded bg-[#edf7f1] px-2 py-0.5 text-[11px] font-bold text-[#0e3b2e]">
                    {c.status}
                  </span>
                </div>
                <h2>{c.name}</h2>
                <p className="text-xs text-[#65766e] flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {c.location} · {c.familiesCount} Families
                </p>
                <p className="market-detail mt-2">{c.benefit}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    className="button secondary flex-1"
                    onClick={() => {
                      setSelectedCommunity(c)
                      setActiveCode(c.code)
                      setJoinedMsg(`Connected to ${c.name}! ${c.benefit}.`)
                    }}
                  >
                    View Hub & Join <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

function ListingForm({ setNotice }: { setNotice: (v: string) => void }) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState('Excellent')
  const [location, setLoc] = useState('Wakad, Pune')

  return (
    <section className="listing-panel">
      <p className="eyebrow">SELL WITH MAISONMARKET</p>
      <h2>Create a verified local listing</h2>
      <p>
        Describe the item, set a fair price, select your neighbourhood, and receive
        enquiries from nearby verified community members.
      </p>
      <div className="listing-fields">
        <input
          aria-label="Listing title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Listing title (e.g. Wooden Dining Table, Smart TV...)"
        />
        <input
          aria-label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price in ₹ (e.g. 4500)"
        />
        <select
          aria-label="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option>Used — Excellent</option>
          <option>Used — Very Good</option>
          <option>Used — Good</option>
          <option>Used — Like New</option>
          <option>Brand New</option>
        </select>
        <input
          aria-label="Location"
          value={location}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="Neighbourhood / Suburb"
        />
      </div>
      <button
        className="button"
        onClick={() => {
          if (!title) {
            setNotice('Please enter a listing title.')
            return
          }
          setNotice(
            `Listing “${title}” (₹${price || '0'}) published to ${location}. Interested buyers will contact you.`
          )
          setTitle('')
          setPrice('')
        }}
      >
        Publish listing <ArrowRight size={15} />
      </button>
    </section>
  )
}
