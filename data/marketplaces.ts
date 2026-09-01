import type { Product } from './products'
import { serviceCategories } from './products'

export type Service = {id:string;serviceId?:string;slug?:string;serviceCategoryId?:string;serviceTypeId?:string;name:string;category:string;description:string;provider:string;rating:number;reviewCount:number;price:number;priceType:string;location:string;availability:string;leadTime:string;bookingRequired:boolean;communityEligible:boolean;image:string}
const baseServiceCatalog:Service[] = [
 {id:'svc-car-interior',name:'Car Interior Cleaning',category:'Automobile Services',description:'Vacuum, dashboard wipe and seat-area care for a cleaner daily commute.',provider:'CleanRide Partners',rating:4.8,reviewCount:112,price:399,priceType:'per car',location:'Pune',availability:'Tomorrow',leadTime:'1 day',bookingRequired:true,communityEligible:true,image:'/images/services/cleaning.png'},
 {id:'svc-bike-foam',name:'Bike Foam Wash',category:'Automobile Services',description:'Two-wheeler foam wash, chain wipe and finish check.',provider:'CleanRide Partners',rating:4.7,reviewCount:84,price:249,priceType:'per bike',location:'Wakad',availability:'Today',leadTime:'Same day',bookingRequired:true,communityEligible:true,image:'/images/services/cleaning.png'},
 {id:'svc-electrician',name:'Electrician Visit',category:'Electrical & Electronics',description:'Fixture installation, switch replacement and basic diagnosis with a visit fee.',provider:'FixRight Community',rating:4.6,reviewCount:67,price:249,priceType:'visit',location:'Hinjewadi',availability:'Tomorrow',leadTime:'1 day',bookingRequired:true,communityEligible:false,image:'/images/services/electrician.png'},
 {id:'svc-plumber',name:'Plumber Visit',category:'Plumbing & Water',description:'Tap, drain and leak checks for routine household repairs.',provider:'FixRight Community',rating:4.5,reviewCount:51,price:299,priceType:'visit',location:'Baner',availability:'Tomorrow',leadTime:'1 day',bookingRequired:true,communityEligible:false,image:'/images/services/plumber.png'},
 {id:'svc-deep-clean',name:'Premium Home Deep Cleaning',category:'Home Care',description:'Kitchen, bathroom and living-area clean with scope confirmed before arrival.',provider:'NeatNest Crew',rating:4.9,reviewCount:143,price:1499,priceType:'per home',location:'Pune',availability:'This weekend',leadTime:'2 days',bookingRequired:true,communityEligible:true,image:'/images/services/cleaning.png'},
 {id:'svc-garden',name:'Garden Maintenance',category:'Outdoor & Garden',description:'Recurring trimming, planting and seasonal care for shared spaces.',provider:'GreenBlock Services',rating:4.7,reviewCount:39,price:699,priceType:'per visit',location:'Wakad',availability:'Friday',leadTime:'3 days',bookingRequired:true,communityEligible:true,image:'/images/services/garden.png'},
]
const serviceDetails:Record<string,[string,string,string]>= {
 'Home Appliances':['AC Repair','AC, refrigerator and washing machine repair with clear visit scope.','/images/services/home-cleaning.png'],
 'Carpentry & Furniture':['Furniture Repair','Furniture assembly, repair and fitting for homes.','/images/services/home-cleaning.png'],
 'Painting & Home Maintenance':['Home Painting','Small painting and home maintenance visits booked locally.','/images/services/home-cleaning.png'],
 'Beauty & Personal Care':['At-Home Beauty Visit','Salon and personal care services at a scheduled home visit.','/images/services/home-cleaning.png'],
 'Moving & Delivery':['Local Moving Help','Neighbourhood moving, packing and delivery assistance.','/images/services/home-cleaning.png'],
 'Education & Learning':['Neighbourhood Tutoring','Local tutoring and learning support for students.','/images/services/home-cleaning.png'],
 'Health & Elder Support':['Elder Assistance','Non-medical home assistance for errands and routine support.','/images/services/home-cleaning.png'],
 'Security & Community Support':['CCTV & Security Check','CCTV checks and practical community security support.','/images/services/home-cleaning.png'],
 'Daily Needs & Home Support':['Household Help','Reliable daily household support booked by location.','/images/services/home-cleaning.png'],
 'Events & Community Activities':['Event Setup','Community event planning, setup and pack-down support.','/images/services/home-cleaning.png'],
 'Specialized Services':['Laptop Repair','Laptop diagnosis and repair with a transparent service quote.','/images/services/home-cleaning.png'],
 'Electrical & Electronics':['Electrician Visit','Fixture installation, switch replacement and electronics diagnosis.','/images/services/electrician.png'],
 'Plumbing & Water':['Plumber Visit','Tap, drain and leak checks for routine household repairs.','/images/services/plumber.png'],
 'Outdoor & Garden':['Garden Maintenance','Recurring trimming, planting and seasonal care for shared spaces.','/images/services/garden.png'],
 'Automobile Services':['Car Interior Cleaning','Vacuum, dashboard wipe and seat-area care for a cleaner commute.','/images/services/cleaning.png'],
 'Home Care':['Home Deep Cleaning','Kitchen, bathroom and living-area deep cleaning.','/images/services/home-cleaning.png']
}
export const serviceCatalog:Service[]=serviceCategories.map((category)=>{const found=baseServiceCatalog.find(s=>s.category===category);const [name,description,image]=serviceDetails[category];const serviceSlug=(found?.name||name).toLowerCase().replace(/[^a-z0-9]+/g,'-');const record=found||{id:`svc-${serviceSlug}`,name,category,description,provider:'MaisonMarket Verified Partners',rating:4.6,reviewCount:24,price:299,priceType:'starting',location:'Pune',availability:'Tomorrow',leadTime:'1 day',bookingRequired:true,communityEligible:false,image};const serviceImage=serviceSlug==='furniture-repair'?'/images/services/furniture-repair.png':serviceSlug==='home-painting'?'/images/services/home-painting.png':`/images/services/${serviceSlug}.png`;return {...record,serviceId:record.id,slug:serviceSlug,serviceCategoryId:category.toLowerCase().replace(/[^a-z0-9]+/g,'-'),serviceTypeId:serviceSlug,image:serviceImage}})
export type Listing={id:string;listingId?:string;slug?:string;sellCategoryId?:string;title:string;category:string;condition:string;price:number;originalPrice:number;location:string;seller:string;rating:number;description:string;image:string}
export const resellerListings:Listing[]=[
 {id:'res-lg-fridge',title:'LG 260L Frost Free Refrigerator',category:'Fridge',condition:'Used — Good',price:18500,originalPrice:32000,location:'Pune',seller:'Amit R.',rating:4.7,description:'Two-door refrigerator, clean interiors, recently serviced.',image:'/images/marketplace/resale-fridge.png'},
 {id:'res-study-table',title:'Solid Wood Study Desk',category:'Furniture',condition:'Used — Excellent',price:6200,originalPrice:11500,location:'Wakad',seller:'Neha P.',rating:4.8,description:'Storage drawers and a sturdy work surface for home study.',image:'/images/products/home-utility.png'},
 {id:'res-sony-tv',title:'Sony 43-inch Smart LED Television',category:'TV',condition:'Used — Like new',price:22900,originalPrice:39900,location:'Baner',seller:'Rohan K.',rating:4.6,description:'Working smart TV with remote and wall-mount bracket.',image:'/images/marketplace/resale-tv.png'},
 {id:'res-ifb-washer',title:'IFB Front Load Washing Machine',category:'Washing Machine',condition:'Used — Good',price:14800,originalPrice:28900,location:'Aundh',seller:'Kavya M.',rating:4.5,description:'Front-load washer with service history shared by seller.',image:'/images/marketplace/resale-washer.png'},
]
export const saleProducts:Listing[]=[
 {id:'sale-led-bulb',title:'Smart LED Bulb 12W',category:'Electronics Sale',condition:'New',price:199,originalPrice:399,location:'Pune',seller:'Maison Select',rating:4.5,description:'Energy-efficient bulb with warm and cool light modes.',image:'/images/products/smart-electronics.png'},
 {id:'sale-cookware',title:'Stainless Steel Cookware Set',category:'Kitchen Sale',condition:'New',price:1499,originalPrice:2499,location:'Pune',seller:'Maison Select',rating:4.7,description:'Three-piece everyday cookware set for family kitchens.',image:'/images/marketplace/sale-cookware.png'},
 {id:'sale-airfryer',title:'Compact Air Fryer 4L',category:'Home Sale',condition:'New',price:2999,originalPrice:4999,location:'Pune',seller:'DailyKart',rating:4.6,description:'Countertop air fryer with timer and temperature control.',image:'/images/marketplace/sale-airfryer.png'},
 {id:'sale-kettle',title:'Electric Kettle 1.5L',category:'Daily Utility Sale',condition:'New',price:899,originalPrice:1399,location:'Pune',seller:'Urban Utility',rating:4.4,description:'Fast-boil kettle with auto shutoff and steel interior.',image:'/images/products/shop.png'},
]
export const buysProducts:Listing[]=[
 {id:'buy-iphone13',title:'iPhone 13 128GB — Refurbished',category:'Phones',condition:'Excellent · inspected',price:39999,originalPrice:59900,location:'Pune',seller:'Maison Refurbished',rating:4.8,description:'40-point inspection, battery health 89%, unlocked device.',image:'/images/marketplace/refurbished-phone.png'},
 {id:'buy-dell5420',title:'Dell Latitude 5420',category:'Laptops',condition:'Very good · inspected',price:28990,originalPrice:57990,location:'Hinjewadi',seller:'Maison Refurbished',rating:4.6,description:'16GB RAM, 512GB SSD and inspection report available.',image:'/images/products/smart-electronics.png'},
 {id:'buy-ipad9',title:'iPad 9th Generation',category:'Tablets',condition:'Excellent · inspected',price:21990,originalPrice:32990,location:'Baner',seller:'Maison Refurbished',rating:4.7,description:'Wi-Fi tablet with charging cable and six-month warranty.',image:'/images/products/shop.png'},
]
export const locationOptions=['Pune','Wakad','Hinjewadi','Baner','Aundh','Kothrud','Viman Nagar','Kharadi','Hadapsar','Pimpri','Chinchwad','Mumbai','Nashik','Nagpur','Bengaluru','Hyderabad']
export const demoCommunities=[{code:'WAKAD001',name:'Wakad Neighbourhood',benefit:'1% eligible order commission'},{code:'HINJEWADI002',name:'Hinjewadi Collective',benefit:'Shared campaign access'},{code:'BANER003',name:'Baner Community Circle',benefit:'Community service coordination'}]
export const isSameDataset=(a:Listing[],b:Listing[])=>new Set(a.map(x=>x.id)).size===a.length && !a.some(x=>b.some(y=>y.id===x.id))
export type AnyCatalogProduct = Product
