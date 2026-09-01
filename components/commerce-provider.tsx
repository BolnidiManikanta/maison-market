'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '@/data/products'

type CartLine={product:Product;quantity:number}
type CommerceContextValue={cart:CartLine[];wishlist:string[];location:string;addToCart:(product:Product,quantity?:number)=>void;changeQuantity:(id:string,delta:number)=>void;toggleWishlist:(id:string)=>void;setLocation:(location:string)=>void;cartCount:number;subtotal:number}
const CommerceContext=createContext<CommerceContextValue|null>(null)
const STORAGE_KEY='maisonmarket-commerce'

export function CommerceProvider({children}:{children:React.ReactNode}){
  const [cart,setCart]=useState<CartLine[]>([])
  const [wishlist,setWishlist]=useState<string[]>([])
  const [location,setLocation]=useState('Wakad, Pune')
  const [ready,setReady]=useState(false)
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(saved){setCart(saved.cart||[]);setWishlist(saved.wishlist||[]);setLocation(saved.location||'Wakad, Pune')}}catch{}setReady(true)},[])
  useEffect(()=>{if(!ready)return;localStorage.setItem(STORAGE_KEY,JSON.stringify({cart,wishlist,location}))},[cart,wishlist,location,ready])
  const value=useMemo(()=>({cart,wishlist,location,setLocation,addToCart:(product:Product,quantity=1)=>setCart(lines=>{const found=lines.find(line=>line.product.id===product.id);return found?lines.map(line=>line.product.id===product.id?{...line,quantity:line.quantity+quantity}:line):[...lines,{product,quantity}]}),changeQuantity:(id:string,delta:number)=>setCart(lines=>lines.flatMap(line=>line.product.id===id&&line.quantity+delta<=0?[]:line.product.id===id?[{...line,quantity:line.quantity+delta}]:[line])),toggleWishlist:(id:string)=>setWishlist(ids=>ids.includes(id)?ids.filter(item=>item!==id):[...ids,id]),cartCount:cart.reduce((sum,line)=>sum+line.quantity,0),subtotal:cart.reduce((sum,line)=>sum+line.product.price*line.quantity,0)}),[cart,wishlist,location])
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}
export function useCommerce(){const value=useContext(CommerceContext);if(!value)throw new Error('useCommerce must be used inside CommerceProvider');return value}
