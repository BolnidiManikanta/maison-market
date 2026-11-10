'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Heart, Plus, Minus, SlidersHorizontal, ArrowRight, ShoppingBag } from 'lucide-react'
import { products, searchProducts } from '@/data/products'
import { useCommerce } from '@/components/commerce-provider'

const money = (n: number) => `₹${n.toLocaleString('en-IN')}`

const categoryLabelMap: Record<string, string> = {
  shop: 'Shop All Products',
  fresh: 'Fresh Produce & Dairy',
  smart: 'Smart Electronics & Tech',
  'home-needs': 'Home Needs & Utility',
  budgets: 'Home Needs & Utility',
  budget: 'Home Needs & Utility',
  automobile: 'Automobile Care & Needs',
  auto: 'Automobile Care & Needs',
  divine: 'Divine & Puja Essentials',
  toys: 'Tribe & Regional Crafts',
  tribe: 'Tribe & Regional Living',
  fashion: 'Fashion & Apparel',
  cosmetics: 'Cosmetics & Personal Care',
  furniture: 'Furniture & Living Room',
  'bulk-order': 'Bulk Order & Wholesale Supplies',
  refurbished: 'Certified Refurbished Tech',
}

export default function CatalogPage({
  section = 'shop',
  isBogoOnlyDefault = false,
}: {
  section?: string
  isBogoOnlyDefault?: boolean
}) {
  const group =
    section === 'shop'
      ? undefined
      : section === 'budgets' || section === 'budget' || section === 'automobile' || section === 'auto'
      ? 'home-needs'
      : section === 'toys'
      ? 'tribe'
      : section

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('relevance')
  const [bogoOnly, setBogoOnly] = useState(isBogoOnlyDefault)
  const [visibleCount, setVisibleCount] = useState(24)
  const { cart, wishlist, addToCart, changeQuantity, toggleWishlist, cartCount } = useCommerce()

  const pool = useMemo(() => {
    let list = group ? products.filter((p) => p.categoryId === group) : products
    if (query) list = list.filter((p) => searchProducts(query).some((x) => x.id === p.id))
    if (bogoOnly) list = list.filter((p) => p.isBOGO)
    return [...list].sort((a, b) =>
      sort === 'price-low'
        ? a.price - b.price
        : sort === 'price-high'
        ? b.price - a.price
        : sort === 'rating'
        ? b.rating - a.rating
        : sort === 'discount'
        ? (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp
        : 0
    )
  }, [group, query, sort, bogoOnly])

  const title =
    isBogoOnlyDefault && group
      ? `BOGO ${group[0]?.toUpperCase()}${group.slice(1)}`
      : categoryLabelMap[section] || `${section[0]?.toUpperCase()}${section.slice(1)} Collection`

  const qtyFor = (id: string) => cart.find((line) => line.product.id === id)?.quantity || 0

  return (
    <main className="catalog-page">
      <div className="catalog-shell">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/categories">Buy Mart</Link>
          <span>/</span>
          <span>{title}</span>
        </div>

        <div className="catalog-heading">
          <div>
            <p className="eyebrow">
              TECHIESMART · {isBogoOnlyDefault ? 'COMMUNITY BOGO OFFER' : 'BUY MART INVENTORY'}
            </p>
            <h1>{title}</h1>
            <p>
              {group === 'bulk-order'
                ? 'Wholesale commercial packs, grains, pantry essentials and packaging with volume-tier pricing.'
                : group === 'refurbished'
                ? '40-point quality checked electronics, phones and appliances with warranty support and inspection certificates.'
                : isBogoOnlyDefault
                ? 'Buy together, receive more. Every eligible product shows its paid quantity, free quantity and savings before checkout.'
                : 'Browse verified inventory with transparent pricing, instant cart calculations and neighbourhood delivery.'}
            </p>
          </div>
          <Link href="/cart" className="button primary">
            <ShoppingBag size={16} /> Cart {cartCount ? `· ${cartCount}` : ''}
          </Link>
        </div>

        <div className="catalog-toolbar">
          <label className="catalog-search">
            Search this collection
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try shirt, sofa, cream, rice, phone..."
            />
          </label>
          <label className="select-label">
            <SlidersHorizontal size={16} /> Sort
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
              <option value="rating">Top rated</option>
              <option value="discount">Biggest discount</option>
            </select>
          </label>
          <button
            className={`filter-chip ${bogoOnly ? 'selected' : ''}`}
            onClick={() => setBogoOnly((v) => !v)}
          >
            BOGO only
          </button>
        </div>

        <div className="catalog-meta">
          <b>{pool.length} products available</b>
          <span>{query ? `Matching “${query}”` : 'Curated for your neighbourhood'}</span>
        </div>

        {pool.length ? (
          <>
            <div className="catalog-grid">
              {pool.slice(0, visibleCount).map((p) => {
              const qty = qtyFor(p.id)
              return (
                <article className="catalog-card" key={p.id}>
                  <div className="catalog-image">
                    <img src={p.image} alt={p.name} loading="lazy" />
                    {p.isBOGO ? (
                      <span className="bogo-badge">BUY 1 GET 1</span>
                    ) : (
                      <span className="bogo-badge" style={{ background: '#355b4b' }}>
                        VERIFIED
                      </span>
                    )}
                    <button
                      className={`wish ${wishlist.includes(p.id) ? 'active' : ''}`}
                      aria-label="Toggle wishlist"
                      onClick={() => toggleWishlist(p.id)}
                    >
                      <Heart size={17} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="catalog-card-body">
                    <small>
                      {p.brand} · {p.unit}
                    </small>
                    <Link href={`/${p.slug}`} prefetch={false} className="catalog-name">
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
                        <span>
                          Receive 2 units · Save {money(p.price)}
                        </span>
                      </div>
                    ) : (
                      <div className="bogo-detail" style={{ color: '#2d5345', background: '#eaf4ee' }}>
                        <b>Direct Value Price</b>
                        <span>Transparent bulk / inspected rate</span>
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
                      <button className="add-button" onClick={() => addToCart(p)}>
                        ADD <Plus size={15} />
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
          {pool.length > visibleCount && (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 24)}
                className="button secondary"
              >
                Load more products ({pool.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
        ) : (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try a broader search or explore the full shop.</p>
            <button
              className="button secondary"
              onClick={() => {
                setQuery('')
                setBogoOnly(false)
              }}
            >
              Clear filters <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export function CartPreview() {
  return null
}
