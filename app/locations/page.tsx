'use client'
import Link from 'next/link'
import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { locationOptions } from '@/data/marketplaces'
export default function LocationsPage(){const [selected,setSelected]=useState('Pune');return <main className="location-page"><div className="location-card"><MapPin size={24}/><p className="eyebrow">MAISONMARKET · DELIVERY AREA</p><h1>Where should we deliver?</h1><p>Choose a neighbourhood to update delivery windows, service availability and marketplace listings in this demo.</p><div className="location-grid">{locationOptions.map(x=><button className={selected===x?'selected':''} key={x} onClick={()=>setSelected(x)}>{x}</button>)}</div><div className="location-confirm">Delivering to <b>{selected}</b><Link href={`/shop?location=${selected}`} className="button primary">Continue shopping</Link></div></div></main>}
