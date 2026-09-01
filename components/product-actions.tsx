'use client'
import Link from 'next/link'
import { useCommerce } from '@/components/commerce-provider'
import type { Product } from '@/data/products'
export default function ProductActions({product}:{product:Product}){const {addToCart}=useCommerce();return <div className="pdp-actions"><button className="button primary" onClick={()=>addToCart(product)}>ADD TO CART</button><button className="button secondary" onClick={()=>addToCart(product)}><Link href="/checkout">BUY NOW</Link></button></div>}
