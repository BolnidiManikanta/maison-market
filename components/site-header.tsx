'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  ShoppingBag,
  Store,
  Wrench,
  Users,
  MapPin,
  Search,
  UserRound,
  Heart,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Tag,
} from 'lucide-react'
import { useCommerce } from '@/components/commerce-provider'

export default function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { cartCount, wishlist, user } = useCommerce()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Skip header on admin operational pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const isHome = pathname === '/'
  const isBuyMart =
    pathname === '/buy-mart' ||
    pathname?.startsWith('/buy-mart/') ||
    pathname === '/categories' ||
    pathname?.startsWith('/categories/') ||
    pathname === '/shop'
  const isSellMart =
    pathname === '/sell-mart' ||
    pathname?.startsWith('/sell-mart/') ||
    pathname === '/resellers'
  const isServMart =
    pathname === '/serv-mart' ||
    pathname?.startsWith('/serv-mart/') ||
    pathname === '/services' ||
    pathname?.startsWith('/services/')
  const isCommunity = pathname === '/community'
  const isBogo = pathname === '/bogo' || pathname?.startsWith('/bogo/')

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement">
        Community shopping, made useful{' '}
        <span>BOGO savings are always itemised at checkout</span>
      </div>

      {/* Main Header */}
      <header className="site-header">
        <div className="header-top">
          {/* Mobile hamburger menu */}
          <button
            className="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <span>t</span> techie<span>smart</span>
          </Link>


          {/* Deliver To Location */}
          <Link href="/locations" className="location">
            <MapPin size={16} />
            <span>
              Deliver to <b>Wakad, Pune</b>
            </span>
          </Link>

          {/* Search Bar */}
          <form className="search" onSubmit={handleSearchSubmit}>
            <Search size={18} />
            <input
              placeholder="Search products, services, brands..."
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd>⌘ K</kbd>
          </form>

          {/* Header Action Icons */}
          <nav className="header-actions">
            <Link href={user ? '/account' : '/login'} aria-label="Account" className="account-link">
              <UserRound size={20} />
              <small>Account</small>
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="cart-link">
              <Heart size={20} fill={wishlist.length > 0 ? '#ba684f' : 'none'} />
              {wishlist.length > 0 && <i>{wishlist.length}</i>}
              <small>Wishlist</small>
            </Link>
            <Link href="/cart" aria-label="Cart" className="cart-link">
              <ShoppingBag size={20} />
              {cartCount > 0 && <i>{cartCount}</i>}
              <small>Cart</small>
            </Link>
          </nav>
        </div>

        {/* Dedicated Top Tabs Navigation Bar (Prominent across all screen sizes) */}
        <nav className="top-nav-tabs-bar" aria-label="Main Tabs Navigation">
          <div className="top-nav-tabs-container">
            {/* 1. Home Tab */}
            <Link
              href="/"
              className={`top-nav-tab ${isHome ? 'active' : ''}`}
              aria-current={isHome ? 'page' : undefined}
            >
              <Home size={16} />
              <span>Home</span>
            </Link>

            {/* 2. Buy Mart Tab */}
            <Link
              href="/buy-mart"
              className={`top-nav-tab ${isBuyMart ? 'active' : ''}`}
              aria-current={isBuyMart ? 'page' : undefined}
            >
              <ShoppingBag size={16} />
              <span>Buy Mart</span>
              <span className="tab-pill tab-pill-buy">Shop</span>
            </Link>

            {/* 3. Sell Mart Tab */}
            <Link
              href="/sell-mart"
              className={`top-nav-tab ${isSellMart ? 'active' : ''}`}
              aria-current={isSellMart ? 'page' : undefined}
            >
              <Store size={16} />
              <span>Sell Mart</span>
              <span className="tab-pill tab-pill-sell">Resale</span>
            </Link>

            {/* 4. Serv Mart Tab */}
            <Link
              href="/serv-mart"
              className={`top-nav-tab ${isServMart ? 'active' : ''}`}
              aria-current={isServMart ? 'page' : undefined}
            >
              <Wrench size={16} />
              <span>Serv Mart</span>
              <span className="tab-pill tab-pill-serv">Services</span>
            </Link>

            {/* 5. Communities Tab */}
            <Link
              href="/community"
              className={`top-nav-tab ${isCommunity ? 'active' : ''}`}
              aria-current={isCommunity ? 'page' : undefined}
            >
              <Users size={16} />
              <span>Communities</span>
            </Link>

            {/* 6. BOGO Deals Tab */}
            <Link
              href="/bogo"
              className={`top-nav-tab ${isBogo ? 'active' : ''}`}
              aria-current={isBogo ? 'page' : undefined}
            >
              <Tag size={16} />
              <span>BOGO Deals</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-head">
              <Link href="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                <span>t</span> techie<span>smart</span>
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="close-drawer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              <p className="eyebrow">Main Navigation</p>
              <Link
                href="/"
                className={`mobile-tab-item ${isHome ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Home size={18} />
                  <div>
                    <strong>Home</strong>
                    <small className="block text-xs text-gray-500">Storefront & Highlights</small>
                  </div>
                </div>
                <ChevronRight size={16} />
              </Link>

              <Link
                href="/buy-mart"
                className={`mobile-tab-item ${isBuyMart ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={18} />
                  <div>
                    <strong>Buy Mart</strong>
                    <small className="block text-xs text-gray-500">Shop 220+ verified products</small>
                  </div>
                </div>
                <ChevronRight size={16} />
              </Link>

              <Link
                href="/sell-mart"
                className={`mobile-tab-item ${isSellMart ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Store size={18} />
                  <div>
                    <strong>Sell Mart</strong>
                    <small className="block text-xs text-gray-500">Pre-loved, resale & scrap deals</small>
                  </div>
                </div>
                <ChevronRight size={16} />
              </Link>

              <Link
                href="/serv-mart"
                className={`mobile-tab-item ${isServMart ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Wrench size={18} />
                  <div>
                    <strong>Serv Mart</strong>
                    <small className="block text-xs text-gray-500">Doorstep home & device services</small>
                  </div>
                </div>
                <ChevronRight size={16} />
              </Link>

              <p className="eyebrow mt-4">Discover & Save</p>
              <Link
                href="/bogo"
                className={`mobile-tab-item ${isBogo ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Tag size={18} />
                  <strong>BOGO Buy 1 Get 1</strong>
                </div>
                <ChevronRight size={16} />
              </Link>

              <Link
                href="/community"
                className={`mobile-tab-item ${isCommunity ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <strong>Community Hub</strong>
                </div>
                <ChevronRight size={16} />
              </Link>

              <Link
                href="/locations"
                className="mobile-tab-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <span>Delivery Area: <b>Wakad, Pune</b></span>
                </div>
                <ChevronRight size={16} />
              </Link>

              <div className="mt-6 pt-4 border-t border-gray-200 flex gap-2">
                <Link
                  href="/cart"
                  className="button primary flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag size={16} /> Cart ({cartCount})
                </Link>
                <Link
                  href={user ? '/account' : '/login'}
                  className="button secondary flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserRound size={16} /> Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
