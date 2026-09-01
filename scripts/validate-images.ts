import fs from 'node:fs'
import path from 'node:path'
import { products } from '../data/products'
import { serviceCatalog, resellerListings } from '../data/marketplaces'

type Result={total:number;explicit:number;missing:number;broken:number;generic:number;category:number;placeholder:number;duplicates:number;invalid:number}
const root=process.cwd()
const empty=():Result=>({total:0,explicit:0,missing:0,broken:0,generic:0,category:0,placeholder:0,duplicates:0,invalid:0})
const slug=(v:string)=>v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
const inspect=(records:Array<{slug?:string;name?:string;title?:string;image?:string}>, kind:'product'|'service'|'sell'):Result=>{const r=empty();r.total=records.length;const seen=new Map<string,string>();for(const record of records){const image=record.image||'';if(image)r.explicit++;else r.missing++;const expected=kind==='product'?`/images/products/`:kind==='service'?'/images/services/':'/images/sell/';if(!image)continue;if(image.includes('/categories/')||image.includes('category'))r.category++;if(/placeholder|default|generic|unavailable|image\.webp|product\.webp/i.test(image))r.placeholder++;if(!image.startsWith(expected)||!['.webp','.png','.jpg','.jpeg'].some(extension=>image.endsWith(extension)))r.invalid++;if(!fs.existsSync(path.join(root,'public',image)))r.broken++;const previous=seen.get(image);if(previous)r.duplicates++;else seen.set(image,record.name||record.title||'unknown');if(kind==='product'&&record.slug&&!image.match(new RegExp(`/${record.slug}\\.(webp|png|jpg|jpeg)$`)))r.invalid++;if(kind==='service'&&record.slug&&!image.match(new RegExp(`/${record.slug}\\.(webp|png|jpg|jpeg)$`)))r.invalid++;if(kind==='sell'&&record.slug&&!image.match(new RegExp(`/${record.slug}\\.(webp|png|jpg|jpeg)$`)))r.invalid++;if(/\/images\/(products|services|sell)\/(smart|fresh|tribe|home-needs|product|service|sell)\.(png|jpg|jpeg|webp)$/i.test(image))r.generic++}return r}
const productsResult=inspect(products,'product');const servicesResult=inspect(serviceCatalog,'service');const sellResult=inspect(resellerListings.map(x=>({...x,slug:x.slug||slug(x.title)})),'sell')
console.log('==================================================\nMAISONMARKET IMAGE AUDIT\n==================================================\n\nPRODUCTS')
const print=(r:Result,service=false)=>{console.log(`Total: ${r.total}\nExplicit images: ${r.explicit}\nMissing: ${r.missing}\nBroken: ${r.broken}\nGeneric fallback: ${r.generic}\nCategory fallback: ${r.category}\nPlaceholder: ${r.placeholder}\nDuplicate assignments: ${r.duplicates}\n${service?'Invalid paths':'Invalid deterministic paths'}: ${r.invalid}\n`)}
print(productsResult);console.log('SERVICES');print(servicesResult,true);console.log('SELL MART');print(sellResult,true)
const failed=[productsResult,servicesResult,sellResult].some(r=>r.missing+r.broken+r.generic+r.category+r.placeholder+r.invalid>0)
if(failed)process.exitCode=1
