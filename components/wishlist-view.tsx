'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCommerce } from '@/components/commerce-provider'
import Footer from '@/components/footer'

const money = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function WishlistView() {
  const { wishlistProducts, toggleWishlist, moveWishlistToCart } = useCommerce()

  return (
    <>
      <main className="route-page bg-[#f6f5f0] min-h-screen py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <Link href="/shop" className="text-xs font-bold text-[#65766e] hover:text-[#173b32]">
              ← Back to shop
            </Link>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c89c47]">
              TECHIESMART · SAVED ITEMS
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#173b32] mt-1">
              Your Wishlist ({wishlistProducts.length})
            </h1>
            <p className="text-sm text-[#65766e] mt-1">
              Save products for later or move them directly into your shopping cart.
            </p>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="bg-white border border-[#dfe4dc] rounded-2xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#f6f5f0] text-[#ba684f] flex items-center justify-center mx-auto">
                <Heart size={26} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[#173b32]">No saved products yet</h2>
              <p className="text-sm text-[#65766e] max-w-md mx-auto">
                Tap the heart icon on any product in Buy Mart or BOGO Deals to save it here.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173b32] !text-white text-xs font-bold rounded-lg hover:bg-[#112d26]"
              >
                Explore Products <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistProducts.map((product) => (
                <article
                  key={product.id}
                  className="bg-white border border-[#dfe4dc] rounded-xl overflow-hidden flex flex-col"
                >
                  <Link
                    href={`/${product.slug}`}
                    className="relative h-44 bg-[#f6f5f0] block overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isBOGO && (
                      <span className="bogo-badge">BUY 1 GET 1</span>
                    )}
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#65766e]">
                        {product.brand} · {product.unit}
                      </p>
                      <Link
                        href={`/${product.slug}`}
                        className="text-sm font-bold text-[#173b32] hover:underline mt-0.5 block"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1.5">
                        <strong className="text-sm font-extrabold text-[#173b32]">
                          {money(product.price)}
                        </strong>
                        <del className="text-xs text-[#65766e]">{money(product.mrp)}</del>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#dfe4dc]">
                      <button
                        type="button"
                        onClick={() => moveWishlistToCart(product)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#173b32] text-white text-xs font-bold rounded-lg hover:bg-[#112d26]"
                      >
                        <ShoppingBag size={14} /> Move to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="p-2 border border-[#dfe4dc] text-[#9c2b26] rounded-lg hover:bg-[#fbeeed]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
