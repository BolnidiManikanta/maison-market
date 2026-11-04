import fs from 'node:fs'
import path from 'node:path'
import { products } from '../data/products'
import { serviceCatalog, resellerListings, saleProducts, buysProducts } from '../data/marketplaces'

type Result = {
  total: number
  explicit: number
  missing: number
  broken: number
  generic: number
  category: number
  placeholder: number
  duplicates: number
  invalid: number
}

const root = process.cwd()
const empty = (): Result => ({
  total: 0,
  explicit: 0,
  missing: 0,
  broken: 0,
  generic: 0,
  category: 0,
  placeholder: 0,
  duplicates: 0,
  invalid: 0,
})

const inspect = (
  records: Array<{ slug?: string; name?: string; title?: string; image?: string }>,
  kind: 'product' | 'service' | 'marketplace'
): Result => {
  const r = empty()
  r.total = records.length
  const seen = new Map<string, string>()

  for (const record of records) {
    const image = record.image || ''
    if (image) {
      r.explicit++
    } else {
      r.missing++
      continue
    }

    if (!image.startsWith('/images/') && !image.startsWith('/placeholder')) {
      r.invalid++
    }

    if (!['.webp', '.png', '.jpg', '.jpeg', '.svg'].some((ext) => image.endsWith(ext))) {
      r.invalid++
    }

    const diskPath = path.join(root, 'public', image.startsWith('/') ? image.slice(1) : image)
    if (!fs.existsSync(diskPath)) {
      r.broken++
      console.error(`Broken image path: "${image}" for item "${record.name || record.title || record.slug}"`)
    }

    if (image.includes('/placeholder')) {
      r.placeholder++
    }
  }
  return r
}

const productsResult = inspect(products, 'product')
const servicesResult = inspect(serviceCatalog, 'service')
const marketplaceListings = [...resellerListings, ...saleProducts, ...buysProducts]
const marketplaceResult = inspect(marketplaceListings, 'marketplace')

console.log('==================================================\nTECHIESMART IMAGE AUDIT\n==================================================\n')
console.log('PRODUCTS')
const print = (r: Result) => {
  console.log(
    `Total: ${r.total}\nExplicit images: ${r.explicit}\nMissing: ${r.missing}\nBroken: ${r.broken}\nPlaceholder: ${r.placeholder}\nInvalid paths: ${r.invalid}\n`
  )
}
print(productsResult)
console.log('SERVICES')
print(servicesResult)
console.log('MARKETPLACE / RESALE')
print(marketplaceResult)

const failed = [productsResult, servicesResult, marketplaceResult].some(
  (r) => r.missing + r.broken + r.invalid > 0
)

if (failed) {
  process.exitCode = 1
} else {
  console.log(' All image paths verified successfully! 0 broken or missing images.')
}
