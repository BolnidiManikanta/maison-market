'use client'

import Link from 'next/link'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from 'lucide-react'
import { useCommerce } from '@/components/commerce-provider'
import Footer from '@/components/footer'

const money = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function CartView() {
  const { cart, cartCount, subtotal, bogoSavings, changeQuantity, removeFromCart, clearCart } =
    useCommerce()

  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 39
  const totalPayable = subtotal + deliveryFee

  return (
    <>
      <main className="route-page bg-[#f6f5f0] min-h-screen py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <Link href="/shop" className="text-xs font-bold text-[#65766e] hover:text-[#173b32]">
              ← Continue shopping
            </Link>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#c89c47]">
                TECHIESMART · SHOPPING BASKET
              </p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#173b32] mt-1">
                Your Cart ({cartCount})
              </h1>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-[#9c2b26] hover:underline"
              >
                Clear cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="bg-white border border-[#dfe4dc] rounded-2xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#f6f5f0] text-[#173b32] flex items-center justify-center mx-auto">
                <ShoppingBag size={26} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[#173b32]">Your cart is empty</h2>
              <p className="text-sm text-[#65766e] max-w-md mx-auto">
                Add everyday essentials, fresh produce, or BOGO community deals to see your itemised savings here.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173b32] !text-white text-xs font-bold rounded-lg hover:bg-[#112d26]"
                >
                  Browse Products <ArrowRight size={15} />
                </Link>
                <Link
                  href="/bogo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#173b32] text-[#173b32] text-xs font-bold rounded-lg hover:bg-[#edf2ec]"
                >
                  <Tag size={15} /> Explore BOGO
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                {cart.map(({ product, quantity }) => (
                  <article
                    key={product.id}
                    className="bg-white border border-[#dfe4dc] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                  >
                    <Link
                      href={`/${product.slug}`}
                      className="w-20 h-20 rounded-lg bg-[#f6f5f0] overflow-hidden shrink-0 border border-[#dfe4dc]"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#65766e]">
                        {product.brand} · {product.unit}
                      </p>
                      <Link
                        href={`/${product.slug}`}
                        className="text-sm font-bold text-[#173b32] hover:underline block truncate"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <strong className="text-sm font-extrabold text-[#173b32]">
                          {money(product.price)}
                        </strong>
                        <del className="text-xs text-[#65766e]">{money(product.mrp)}</del>
                        {product.isBOGO && (
                          <span className="text-[10px] font-bold bg-[#edf4e9] text-[#205234] px-2 py-0.5 rounded border border-[#c4dcbe]">
                            BOGO: +{quantity} FREE
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="flex items-center border border-[#dfe4dc] rounded-lg overflow-hidden bg-[#f9faf7]">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${product.name}`}
                          onClick={() => changeQuantity(product.id, -1)}
                          className="p-2 text-[#173b32] hover:bg-[#edf2ec]"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#173b32]">{quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${product.name}`}
                          onClick={() => changeQuantity(product.id, 1)}
                          className="p-2 text-[#173b32] hover:bg-[#edf2ec]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <strong className="text-sm font-bold text-[#173b32] block">
                          {money(product.price * quantity)}
                        </strong>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="text-[11px] text-[#9c2b26] hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Order Summary */}
              <aside className="bg-white border border-[#dfe4dc] rounded-2xl p-6 space-y-4 sticky top-24">
                <h2 className="text-lg font-serif font-bold text-[#173b32]">Order Summary</h2>

                <div className="space-y-2.5 text-xs border-b border-[#dfe4dc] pb-4">
                  <div className="flex justify-between text-[#4d5e55]">
                    <span>Items subtotal ({cartCount} paid)</span>
                    <strong className="text-[#173b32]">{money(subtotal)}</strong>
                  </div>
                  {bogoSavings > 0 && (
                    <div className="flex justify-between text-[#205234] font-semibold">
                      <span>BOGO Free Value</span>
                      <span>{money(bogoSavings)} FREE</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#4d5e55]">
                    <span>Neighbourhood Delivery</span>
                    <strong className="text-[#173b32]">
                      {deliveryFee === 0 ? 'FREE' : money(deliveryFee)}
                    </strong>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-[11px] text-[#65766e]">
                      Add {money(499 - subtotal)} more for free delivery.
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center text-base font-extrabold text-[#173b32]">
                  <span>Total Payable</span>
                  <span>{money(totalPayable)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#173b32] !text-white text-xs font-bold rounded-xl hover:bg-[#112d26] transition-colors"
                >
                  Proceed to Checkout <ArrowRight size={15} />
                </Link>

                <p className="text-[11px] text-[#65766e] flex items-center gap-1.5 justify-center">
                  <ShieldCheck size={14} className="text-[#205234]" />
                  Transparent BOGO itemisation at checkout
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
