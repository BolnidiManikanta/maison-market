import Link from 'next/link'
import { notFound } from 'next/navigation'
import CatalogPage from '@/components/catalog-page'
import { findProduct, products } from '@/data/products'
import MarketplacePage from '@/components/marketplace-page'
import AuthDemo from '@/components/auth-demo'
import ProductActions from '@/components/product-actions'
import AccountView from '@/components/account-view'

export default async function RoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const sp = searchParams ? await searchParams : {}
  const bookParam =
    typeof sp.book === 'string'
      ? sp.book
      : typeof sp.service === 'string'
      ? sp.service
      : undefined
  const path = slug.join('/')
  const product = findProduct(slug.at(-1) || '')
  if (product)
    return (
      <main className="route-page">
        <div className="route-inner">
          <Link href="/shop" className="back-link">
            ← Back to shop
          </Link>
          <div className="pdp">
            <div className="pdp-media">
              <img src={product.image} alt={product.name} />
              <span className="bogo-badge">
                {product.isBOGO ? 'BUY 1 GET 1' : 'MAISON SELECT'}
              </span>
            </div>
            <div className="pdp-copy">
              <p className="eyebrow">
                {product.brand} · {product.category}
              </p>
              <h1>{product.name}</h1>
              <p className="rating">
                ★ {product.rating} ({product.reviewCount} reviews)
              </p>
              <div className="pdp-price">
                ₹{product.price.toLocaleString('en-IN')}{' '}
                <del>₹{product.mrp.toLocaleString('en-IN')}</del>
                <em>{Math.round((1 - product.price / product.mrp) * 100)}% off</em>
              </div>
              {product.isBOGO && (
                <div className="pdp-bogo">
                  <b>BUY 1 GET 1 FREE</b>
                  <span>
                    Pay for 1, receive 2 units. BOGO savings: ₹
                    {product.price.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <p className="pdp-description">
                {product.description} Designed for practical everyday use with
                transparent value and neighbourhood delivery.
              </p>
              <ProductActions product={product} />
              <div className="pdp-info">
                <span>Delivery {product.deliveryTime}</span>
                <span>{product.stock} units available</span>
                <span>Easy support</span>
              </div>
              <section>
                <h2>Key highlights</h2>
                <ul>
                  {product.highlights.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h2>Specifications</h2>
                <div className="spec-grid">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <p key={k}>
                      <b>{k}</b>
                      {v}
                    </p>
                  ))}
                </div>
              </section>
              <section>
                <h2>Returns & delivery</h2>
                <p>
                  Availability is confirmed at checkout. Eligible non-food
                  products can be requested for return within the displayed
                  policy window; fresh products follow a quality-issue
                  process.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    )
  if (path === 'bogo') return <CatalogPage section="smart" />
  if (path.startsWith('bogo/'))
    return <CatalogPage section={path.split('/').at(-1) || 'smart'} />
  if (
    [
      'shop',
      'smart',
      'budgets',
      'budget',
      'fresh',
      'automobile',
      'auto',
      'divine',
      'toys',
      'tribe',
    ].includes(path)
  )
    return <CatalogPage section={path} />
  if (path === 'categories') return <MarketplacePage kind="categories" />
  if (path.startsWith('categories/')) {
    const category = path.split('/').at(-1) || 'fresh'
    return <CatalogPage section={category} />
  }
  if (path === 'community') return <MarketplacePage kind="community" />
  if (path === 'buy-mart') return <CatalogPage section="shop" />
  if (path.startsWith('buy-mart/'))
    return <CatalogPage section={path.split('/').at(-1) || 'fresh'} />
  if (path === 'sell-mart') return <MarketplacePage kind="sell" />
  if (path.startsWith('sell-mart/'))
    return (
      <MarketplacePage
        kind="sell"
        initialCategory={path.split('/').at(-1) || ''}
      />
    )
  if (path === 'serv-mart' || path === 'services')
    return <MarketplacePage kind="services" initialServiceId={bookParam} />
  if (path.startsWith('serv-mart/book/') || path.startsWith('services/book/')) {
    const serviceId = path.split('/').at(-1) || ''
    return <MarketplacePage kind="services" initialServiceId={serviceId} />
  }
  if (path.startsWith('serv-mart/') || path.startsWith('services/'))
    return (
      <MarketplacePage
        kind="services"
        initialCategory={path.split('/').at(-1) || ''}
        initialServiceId={bookParam}
      />
    )
  if (path==='resellers'||path==='buys'||path==='sale') return <MarketplacePage kind={path}/>
  if (path==='login') return <AuthDemo/>
  if (path==='account') return <AccountView initialTab="bookings"/>
  if (path==='orders') return <AccountView initialTab="orders"/>
  if (['cart','checkout'].includes(path)) { const title=path==='cart'?'Your cart':'Checkout'; return <main className="route-page"><div className="route-inner"><Link href="/" className="back-link">← Back to home</Link><p className="eyebrow">MAISONMARKET</p><h1>{title}</h1><p className="route-lead">A commerce-first experience for shopping together, discovering useful services and making savings visible.</p><div className="route-list"><article><h2>Explore this workspace</h2><p>{path==='cart'?'Your cart will show exact products, quantities and BOGO savings.':'MaisonMarket connects everyday shopping, community offers and useful neighbourhood services.'}</p><Link href="/shop" className="button primary">{path==='cart'?'Continue shopping':'Browse products'}</Link></article></div></div></main>
  }
  notFound()
}

export function generateStaticParams(){return []}
export function generateMetadata(){return {title:'MaisonMarket | Community commerce and BOGO savings',description:'Shop products, BOGO offers, fresh essentials and neighbourhood services with MaisonMarket.'}}
