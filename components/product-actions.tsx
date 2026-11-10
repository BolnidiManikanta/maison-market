'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCommerce } from '@/components/commerce-provider'
import type { Product } from '@/data/products'

export default function ProductActions({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCommerce()

  return (
    <div className="pdp-actions">
      <button
        type="button"
        className="button primary"
        onClick={() => addToCart(product)}
      >
        ADD TO CART
      </button>
      <button
        type="button"
        className="button secondary"
        onClick={() => {
          addToCart(product)
          router.push('/checkout')
        }}
      >
        BUY NOW
      </button>
      <Link href="/cart" className="text-link">
        View Cart
      </Link>
    </div>
  )
}
