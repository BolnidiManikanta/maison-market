export type Product = {
  id: string
  sku: string
  slug: string
  name: string
  brand: string
  category: string
  categoryId: string
  subcategory: string
  subcategoryId: string
  description: string
  price: number
  mrp: number
  rating: number
  reviewCount: number
  unit: string
  image: string
  tags: string[]
  isBOGO: boolean
  bogoRule?: string
  stock: number
  deliveryTime: string
  location: string
  highlights: string[]
  specs: Record<string, string | undefined>
}

export const productImages: Record<string, string> = {
  // Automobile
  'bike-cleaning-kit': '/images/products/automobile/bike-cleaning-kit.png',
  'car-phone-mount': '/images/products/automobile/car-phone-mount.png',
  'led-bike-indicator': '/images/products/automobile/led-bike-indicator.png',
  'microfiber-car-duster': '/images/products/automobile/microfiber-car-duster.png',
  'reflective-safety-vest': '/images/products/automobile/reflective-safety-vest.png',

  // Budget / Furniture
  'three-seater-sofa': '/images/products/budget/three-seater-sofa.png',
  'wooden-chair': '/images/products/budget/wooden-chair.png',

  // Divine
  'brass-diya-set': '/images/products/divine/brass-diya-set.png',
  'camphor-tablets': '/images/products/divine/camphor-tablets.png',
  'cotton-wicks': '/images/products/divine/cotton-wicks.png',
  'daily-puja-kit': '/images/products/divine/daily-puja-kit.png',
  'sandalwood-incense-sticks': '/images/products/divine/sandalwood-incense-sticks.png',

  // Fresh Produce & Essentials
  'alphonso-mango': '/images/products/fresh/alphonso-mango.png',
  'baby-spinach': '/images/products/fresh/baby-spinach.png',
  'capsicum': '/images/products/fresh/capsicum.png',
  'carrot': '/images/products/fresh/carrot.png',
  'coconut': '/images/products/fresh/coconut.png',
  'farm-fresh-milk': '/images/products/fresh/farm-fresh-milk.png',
  'french-beans': '/images/products/fresh/french-beans.png',
  'fresh-coriander': '/images/products/fresh/fresh-coriander.png',
  'green-chilli': '/images/products/fresh/green-chilli.png',
  'himachal-apple': '/images/products/fresh/himachal-apple.png',
  'hybrid-tomato': '/images/products/fresh/hybrid-tomato.png',
  'kashmir-potato': '/images/products/fresh/kashmir-potato.png',
  'malai-paneer': '/images/products/fresh/malai-paneer.png',
  'nagpur-orange': '/images/products/fresh/nagpur-orange.png',
  'pomegranate': '/images/products/fresh/pomegranate.png',
  'red-onion': '/images/products/fresh/red-onion.png',
  'robusta-banana': '/images/products/fresh/robusta-banana.png',
  'sweet-lime': '/images/products/fresh/sweet-lime.png',
  'table-butter': '/images/products/fresh/table-butter.png',
  'thick-curd': '/images/products/fresh/thick-curd.png',

  // Home Needs / Utility
  'adhesive-wall-hooks': '/images/products/home-needs/adhesive-wall-hooks.png',
  'airtight-storage-container': '/images/products/home-needs/airtight-storage-container.png',
  'bathroom-caddy': '/images/products/home-needs/bathroom-caddy.png',
  'ceramic-mug-set': '/images/products/home-needs/ceramic-mug-set.png',
  'clothes-organizer': '/images/products/home-needs/clothes-organizer.png',
  'decorative-string-light': '/images/products/home-needs/decorative-string-light.png',
  'desk-stationery-kit': '/images/products/home-needs/desk-stationery-kit.png',
  'foldable-storage-box': '/images/products/home-needs/foldable-storage-box.png',
  'insulated-water-bottle': '/images/products/home-needs/insulated-water-bottle.png',
  'kitchen-organizer': '/images/products/home-needs/kitchen-organizer.png',
  'laundry-basket': '/images/products/home-needs/laundry-basket.png',
  'led-bulb': '/images/products/home-needs/led-bulb.png',
  'lunch-box': '/images/products/home-needs/lunch-box.png',
  'multipurpose-dustbin': '/images/products/home-needs/multipurpose-dustbin.png',
  'silicone-spatula-set': '/images/products/home-needs/silicone-spatula-set.png',
  'spice-rack': '/images/products/home-needs/spice-rack.png',
  'stainless-steel-tiffin-set': '/images/products/home-needs/stainless-steel-tiffin-set.png',
  'table-fan': '/images/products/home-needs/table-fan.png',
  'travel-pouch': '/images/products/home-needs/travel-pouch.png',
  'wooden-hangers': '/images/products/home-needs/wooden-hangers.png',

  // Smart Electronics & Tech
  '10000mah-power-bank': '/images/products/smart/10000mah-power-bank.png',
  'basmati-rice-5kg': '/images/products/smart/basmati-rice-5kg.png',
  'bluetooth-headphones': '/images/products/smart/bluetooth-headphones.png',
  'bluetooth-receiver': '/images/products/smart/bluetooth-receiver.png',
  'braided-usb-c-cable': '/images/products/smart/braided-usb-c-cable.png',
  'cable-organizer': '/images/products/smart/cable-organizer.png',
  'car-charger': '/images/products/smart/car-charger.png',
  'cold-pressed-groundnut-oil': '/images/products/smart/cold-pressed-groundnut-oil.png',
  'cotton-bedsheet': '/images/products/smart/cotton-bedsheet.png',
  'dark-chocolate-bar': '/images/products/smart/dark-chocolate-bar.png',
  'dell-laptop': '/images/products/smart/dell-laptop.png',
  'digital-alarm-clock': '/images/products/smart/digital-alarm-clock.png',
  'dishwash-liquid': '/images/products/smart/dishwash-liquid.png',
  'extension-board': '/images/products/smart/extension-board.png',
  'fast-charging-adapter': '/images/products/smart/fast-charging-adapter.png',
  'keyboard': '/images/products/smart/keyboard.png',
  'laptop-stand': '/images/products/smart/laptop-stand.png',
  'laundry-detergent': '/images/products/smart/laundry-detergent.png',
  'led-desk-lamp': '/images/products/smart/led-desk-lamp.png',
  'mango-juice': '/images/products/smart/mango-juice.png',
  'masala-tea-250g': '/images/products/smart/masala-tea-250g.png',
  'mini-rechargeable-fan': '/images/products/smart/mini-rechargeable-fan.png',
  'neem-face-wash': '/images/products/smart/neem-face-wash.png',
  'night-lamp': '/images/products/smart/night-lamp.png',
  'non-stick-fry-pan': '/images/products/smart/non-stick-fry-pan.png',
  'phone-holder': '/images/products/smart/phone-holder.png',
  'pocket-bluetooth-speaker': '/images/products/smart/pocket-bluetooth-speaker.png',
  'rechargeable-emergency-light': '/images/products/smart/rechargeable-emergency-light.png',
  'rechargeable-usb-trimmer': '/images/products/smart/rechargeable-usb-trimmer.png',
  'roasted-namkeen': '/images/products/smart/roasted-namkeen.png',
  'smart-plug': '/images/products/smart/smart-plug.png',
  'toor-dal-1kg': '/images/products/smart/toor-dal-1kg.png',
  'wireless-earbuds': '/images/products/smart/wireless-earbuds.png',
  'wireless-mouse': '/images/products/smart/wireless-mouse.png',

  // Tribe / Apparel
  'kids-t-shirt': '/images/products/tribe/kids-t-shirt.png',
  'mens-cotton-shirt': '/images/products/tribe/mens-cotton-shirt.png',
  'running-shoes': '/images/products/tribe/running-shoes.png',
  'womens-kurti': '/images/products/tribe/womens-kurti.png',
}

export type CategoryDefinition = {
  id: string
  name: string
  subtitle: string
  badgeText: string
  letterBadge: string
  image: string
}

export const buyCategoryDefinitions: CategoryDefinition[] = [
  { id: 'fresh', name: 'Fresh', subtitle: 'Produce & Dairy', badgeText: '20 picks', letterBadge: 'F', image: '/images/products/fresh-produce.png' },
  { id: 'smart', name: 'Smart', subtitle: 'Gadgets & Tech', badgeText: '20 picks', letterBadge: 'S', image: '/images/products/smart-electronics.png' },
  { id: 'home-needs', name: 'Home Needs', subtitle: 'Kitchen & Utility', badgeText: '25 picks', letterBadge: 'H', image: '/images/products/home-utility.png' },
  { id: 'divine', name: 'Divine', subtitle: 'Puja Essentials', badgeText: '20 picks', letterBadge: 'D', image: '/images/products/divine.png' },
  { id: 'tribe', name: 'Tribe', subtitle: 'Living & Regional', badgeText: '20 picks', letterBadge: 'T', image: '/images/products/tribe.png' },
  { id: 'fashion', name: 'Fashion', subtitle: 'Apparel & Wear', badgeText: '24 picks', letterBadge: 'F', image: '/images/products/tribe/womens-kurti.png' },
  { id: 'cosmetics', name: 'Cosmetics', subtitle: 'Skin & Personal Care', badgeText: '24 picks', letterBadge: 'C', image: '/images/products/smart/neem-face-wash.png' },
  { id: 'furniture', name: 'Furniture', subtitle: 'Living & Office', badgeText: '24 picks', letterBadge: 'F', image: '/images/products/budget/three-seater-sofa.png' },
  { id: 'bulk-order', name: 'Bulk Order', subtitle: 'Pantry Supplies', badgeText: '22 picks', letterBadge: 'B', image: '/images/products/shop.png' },
  { id: 'refurbished', name: 'Refurbished', subtitle: 'Tested Tech', badgeText: '22 picks', letterBadge: 'R', image: '/images/marketplace/refurbished-phone.png' },
]

export const buyCategories = ['Fresh', 'Smart', 'Home Needs', 'Divine', 'Tribe', 'Fashion', 'Cosmetics', 'Furniture', 'Bulk Order', 'Refurbished'] as const
export const sellCategories = ['Selling Club', 'Scraps', 'Electronics', '4 Wheeler', 'Dry Wash', 'Bicycle', 'Car', 'Bike'] as const
export const serviceCategories = [
  'Home Care',
  'Electrical & Electronics',
  'Home Appliances',
  'Plumbing & Water',
  'Carpentry & Furniture',
  'Painting & Home Maintenance',
  'Beauty & Personal Care',
  'Automobile Services',
  'Moving & Delivery',
  'Education & Learning',
  'Health & Elder Support',
  'Outdoor & Garden',
  'Security & Community Support',
  'Daily Needs & Home Support',
  'Events & Community Activities',
  'Specialized Services',
] as const
export const communityCategories = ['B2B', 'Community Center', 'Security', 'Housekeep', 'Community', 'Wallet'] as const
export const categories = [...buyCategories]

type RawItem = {
  name: string
  price: number
  mrp: number
  unit: string
  image: string
  subcategory: string
  isBOGO?: boolean
  description?: string
  brand?: string
}

const rawCatalog: Record<string, RawItem[]> = {
  // 1. FRESH (20 products)
  fresh: [
    { name: 'Himachal Apple', price: 149, mrp: 199, unit: '1 kg (4-5 pcs)', image: '/images/products/fresh/himachal-apple.png', subcategory: 'Fruits' },
    { name: 'Robusta Banana', price: 49, mrp: 70, unit: '1 kg (6-8 pcs)', image: '/images/products/fresh/robusta-banana.png', subcategory: 'Fruits' },
    { name: 'Alphonso Mango', price: 349, mrp: 499, unit: '1 dozen pack', image: '/images/products/fresh/alphonso-mango.png', subcategory: 'Fruits' },
    { name: 'Nagpur Orange', price: 99, mrp: 140, unit: '1 kg', image: '/images/products/fresh/nagpur-orange.png', subcategory: 'Fruits' },
    { name: 'Pomegranate Box', price: 179, mrp: 230, unit: '1 kg (3-4 pcs)', image: '/images/products/fresh/pomegranate.png', subcategory: 'Fruits' },
    { name: 'Sweet Lime (Mosambi)', price: 89, mrp: 120, unit: '1 kg', image: '/images/products/fresh/sweet-lime.png', subcategory: 'Fruits' },
    { name: 'Fresh Tender Coconut', price: 59, mrp: 75, unit: '1 piece', image: '/images/products/fresh/coconut.png', subcategory: 'Fruits' },
    { name: 'Hybrid Tomato', price: 39, mrp: 55, unit: '1 kg', image: '/images/products/fresh/hybrid-tomato.png', subcategory: 'Vegetables' },
    { name: 'Red Onion', price: 45, mrp: 60, unit: '1 kg', image: '/images/products/fresh/red-onion.png', subcategory: 'Vegetables' },
    { name: 'Kashmir Potato', price: 35, mrp: 48, unit: '1 kg', image: '/images/products/fresh/kashmir-potato.png', subcategory: 'Vegetables' },
    { name: 'Baby Spinach (Palak)', price: 29, mrp: 40, unit: '250 g bunch', image: '/images/products/fresh/baby-spinach.png', subcategory: 'Vegetables' },
    { name: 'Fresh Coriander Bunch', price: 19, mrp: 30, unit: '100 g', image: '/images/products/fresh/fresh-coriander.png', subcategory: 'Vegetables' },
    { name: 'Green Chilli', price: 22, mrp: 35, unit: '100 g pack', image: '/images/products/fresh/green-chilli.png', subcategory: 'Vegetables' },
    { name: 'Green Capsicum', price: 49, mrp: 70, unit: '500 g', image: '/images/products/fresh/capsicum.png', subcategory: 'Vegetables' },
    { name: 'Crisp Orange Carrot', price: 39, mrp: 55, unit: '500 g', image: '/images/products/fresh/carrot.png', subcategory: 'Vegetables' },
    { name: 'French Green Beans', price: 42, mrp: 60, unit: '250 g', image: '/images/products/fresh/french-beans.png', subcategory: 'Vegetables' },
    { name: 'Farm Fresh Cow Milk', price: 34, mrp: 40, unit: '500 ml pouch', image: '/images/products/fresh/farm-fresh-milk.png', subcategory: 'Dairy' },
    { name: 'Thick Set Curd', price: 45, mrp: 55, unit: '400 g tub', image: '/images/products/fresh/thick-curd.png', subcategory: 'Dairy' },
    { name: 'Fresh Malai Paneer', price: 110, mrp: 135, unit: '200 g block', image: '/images/products/fresh/malai-paneer.png', subcategory: 'Dairy' },
    { name: 'Salted Table Butter', price: 58, mrp: 65, unit: '100 g block', image: '/images/products/fresh/table-butter.png', subcategory: 'Dairy' },
  ],

  // 2. SMART ELECTRONICS (20 products)
  smart: [
    { name: 'Rechargeable USB Trimmer', price: 699, mrp: 1299, unit: '1 set', image: '/images/products/smart/rechargeable-usb-trimmer.png', subcategory: 'Grooming' },
    { name: 'Pocket Bluetooth Speaker', price: 799, mrp: 1499, unit: '1 unit', image: '/images/products/smart/pocket-bluetooth-speaker.png', subcategory: 'Audio' },
    { name: 'True Wireless Earbuds', price: 999, mrp: 1999, unit: '1 pair', image: '/images/products/smart/wireless-earbuds.png', subcategory: 'Audio' },
    { name: 'Bluetooth Over-Ear Headphones', price: 1299, mrp: 2499, unit: '1 unit', image: '/images/products/smart/bluetooth-headphones.png', subcategory: 'Audio' },
    { name: 'Fast Charging Adapter 30W', price: 449, mrp: 899, unit: '1 unit', image: '/images/products/smart/fast-charging-adapter.png', subcategory: 'Charging' },
    { name: '10000mAh Slim Power Bank', price: 899, mrp: 1599, unit: '1 unit', image: '/images/products/smart/10000mah-power-bank.png', subcategory: 'Charging' },
    { name: 'Braided USB-C to USB-C Cable', price: 199, mrp: 399, unit: '1.2 meter', image: '/images/products/smart/braided-usb-c-cable.png', subcategory: 'Cables' },
    { name: 'Wireless Silent Optical Mouse', price: 349, mrp: 699, unit: '1 unit', image: '/images/products/smart/wireless-mouse.png', subcategory: 'Computer' },
    { name: 'Compact Bluetooth Keyboard', price: 649, mrp: 1199, unit: '1 unit', image: '/images/products/smart/keyboard.png', subcategory: 'Computer' },
    { name: 'Ergonomic Foldable Laptop Stand', price: 499, mrp: 999, unit: '1 unit', image: '/images/products/smart/laptop-stand.png', subcategory: 'Accessories' },
    { name: 'Adjustable Phone & Tablet Holder', price: 249, mrp: 499, unit: '1 unit', image: '/images/products/smart/phone-holder.png', subcategory: 'Accessories' },
    { name: 'Dimmable LED Desk Lamp', price: 549, mrp: 999, unit: '1 unit', image: '/images/products/smart/led-desk-lamp.png', subcategory: 'Lighting' },
    { name: 'Rechargeable Emergency Light', price: 429, mrp: 799, unit: '1 unit', image: '/images/products/smart/rechargeable-emergency-light.png', subcategory: 'Lighting' },
    { name: 'Warm LED Sensor Night Lamp', price: 199, mrp: 399, unit: '1 unit', image: '/images/products/smart/night-lamp.png', subcategory: 'Lighting' },
    { name: 'Smart Wi-Fi Plug 16A', price: 599, mrp: 1199, unit: '1 unit', image: '/images/products/smart/smart-plug.png', subcategory: 'Smart Home' },
    { name: 'Multi-Plug Extension Board 4-Way', price: 399, mrp: 699, unit: '2 meter cord', image: '/images/products/smart/extension-board.png', subcategory: 'Power' },
    { name: 'Dual USB Fast Car Charger', price: 299, mrp: 599, unit: '1 unit', image: '/images/products/smart/car-charger.png', subcategory: 'Charging' },
    { name: 'Desktop Digital Alarm Clock', price: 399, mrp: 749, unit: '1 unit', image: '/images/products/smart/digital-alarm-clock.png', subcategory: 'Gadgets' },
    { name: 'Silicone Cable Organizer Clips', price: 149, mrp: 299, unit: 'Set of 6', image: '/images/products/smart/cable-organizer.png', subcategory: 'Accessories' },
    { name: 'Mini USB Rechargeable Fan', price: 349, mrp: 699, unit: '1 unit', image: '/images/products/smart/mini-rechargeable-fan.png', subcategory: 'Gadgets' },
  ],

  // 3. HOME NEEDS (25 products)
  'home-needs': [
    { name: 'Stainless Steel 3-Tier Tiffin Set', price: 449, mrp: 799, unit: '1 set', image: '/images/products/home-needs/stainless-steel-tiffin-set.png', subcategory: 'Kitchen' },
    { name: 'Airtight Food Storage Containers', price: 399, mrp: 699, unit: 'Set of 4', image: '/images/products/home-needs/airtight-storage-container.png', subcategory: 'Storage' },
    { name: 'Rotating Spice Rack 12-Jar', price: 549, mrp: 999, unit: '1 rack', image: '/images/products/home-needs/spice-rack.png', subcategory: 'Kitchen' },
    { name: 'Insulated Thermal Water Bottle', price: 349, mrp: 599, unit: '750 ml', image: '/images/products/home-needs/insulated-water-bottle.png', subcategory: 'Drinkware' },
    { name: 'Ceramic Coffee Mug Set', price: 299, mrp: 499, unit: 'Set of 2', image: '/images/products/home-needs/ceramic-mug-set.png', subcategory: 'Dining' },
    { name: 'Multipurpose Pedal Dustbin 10L', price: 279, mrp: 499, unit: '1 unit', image: '/images/products/home-needs/multipurpose-dustbin.png', subcategory: 'Cleaning' },
    { name: 'Foldable Fabric Clothes Organizer', price: 329, mrp: 599, unit: 'Set of 2', image: '/images/products/home-needs/clothes-organizer.png', subcategory: 'Storage' },
    { name: 'Foldable Toy & Linen Storage Box', price: 299, mrp: 499, unit: '1 box', image: '/images/products/home-needs/foldable-storage-box.png', subcategory: 'Storage' },
    { name: 'Heavy Duty Adhesive Wall Hooks', price: 149, mrp: 299, unit: 'Pack of 10', image: '/images/products/home-needs/adhesive-wall-hooks.png', subcategory: 'Hardware' },
    { name: 'Natural Wooden Hangers', price: 349, mrp: 599, unit: 'Pack of 6', image: '/images/products/home-needs/wooden-hangers.png', subcategory: 'Storage' },
    { name: 'Breathable Mesh Laundry Basket', price: 249, mrp: 449, unit: '1 basket', image: '/images/products/home-needs/laundry-basket.png', subcategory: 'Utility' },
    { name: 'LED Energy Saver Bulb 9W', price: 99, mrp: 180, unit: 'Pack of 2', image: '/images/products/home-needs/led-bulb.png', subcategory: 'Lighting' },
    { name: 'High-Speed Oscillating Table Fan', price: 899, mrp: 1499, unit: '1 unit', image: '/images/products/home-needs/table-fan.png', subcategory: 'Appliances' },
    { name: 'Decorative Warm Fairy String Light', price: 199, mrp: 399, unit: '10 meter', image: '/images/products/home-needs/decorative-string-light.png', subcategory: 'Decor' },
    { name: 'Desktop Stationery & Pen Organizer', price: 229, mrp: 399, unit: '1 unit', image: '/images/products/home-needs/desk-stationery-kit.png', subcategory: 'Office' },
    { name: 'Multi-Pocket Toiletry Travel Pouch', price: 249, mrp: 449, unit: '1 unit', image: '/images/products/home-needs/travel-pouch.png', subcategory: 'Travel' },
    { name: 'Leakproof Insulated Lunch Box', price: 349, mrp: 599, unit: '1 set', image: '/images/products/home-needs/lunch-box.png', subcategory: 'Kitchen' },
    { name: 'Heat Resistant Silicone Spatula Set', price: 199, mrp: 399, unit: 'Set of 3', image: '/images/products/home-needs/silicone-spatula-set.png', subcategory: 'Kitchen' },
    { name: 'Suction Corner Bathroom Caddy', price: 219, mrp: 399, unit: '1 unit', image: '/images/products/home-needs/bathroom-caddy.png', subcategory: 'Bath' },
    { name: 'Modular Kitchen Countertop Organizer', price: 449, mrp: 799, unit: '1 rack', image: '/images/products/home-needs/kitchen-organizer.png', subcategory: 'Kitchen' },
    { name: 'LED Bike Indicator Pair', price: 199, mrp: 399, unit: '1 pair', image: '/images/products/automobile/led-bike-indicator.png', subcategory: 'Automobile' },
    { name: '360 Car Dashboard Phone Mount', price: 249, mrp: 499, unit: '1 unit', image: '/images/products/automobile/car-phone-mount.png', subcategory: 'Automobile' },
    { name: 'Microfiber Car Cleaning Duster', price: 189, mrp: 349, unit: '1 duster', image: '/images/products/automobile/microfiber-car-duster.png', subcategory: 'Automobile' },
    { name: 'Complete Bike Cleaning Kit', price: 349, mrp: 599, unit: '1 kit', image: '/images/products/automobile/bike-cleaning-kit.png', subcategory: 'Automobile' },
    { name: 'High-Visibility Reflective Safety Vest', price: 149, mrp: 299, unit: '1 vest', image: '/images/products/automobile/reflective-safety-vest.png', subcategory: 'Automobile' },
  ],

  // 4. DIVINE (20 products)
  divine: [
    { name: 'Handcrafted Brass Diya Set', price: 299, mrp: 499, unit: 'Set of 2', image: '/images/products/divine/brass-diya-set.png', subcategory: 'Puja Utensils' },
    { name: 'Sandalwood Pure Incense Sticks', price: 99, mrp: 160, unit: 'Pack of 100 sticks', image: '/images/products/divine/sandalwood-incense-sticks.png', subcategory: 'Aroma' },
    { name: 'Pure Camphor Tablets Jar', price: 89, mrp: 140, unit: '100 g jar', image: '/images/products/divine/camphor-tablets.png', subcategory: 'Puja Samagri' },
    { name: 'Complete Daily Puja Kit', price: 349, mrp: 599, unit: '1 complete box', image: '/images/products/divine/daily-puja-kit.png', subcategory: 'Kits' },
    { name: 'Pure Cotton Long Wicks (Batti)', price: 49, mrp: 80, unit: 'Pack of 200 pcs', image: '/images/products/divine/cotton-wicks.png', subcategory: 'Wicks' },
    { name: 'Brass Temple Ghanti (Bell)', price: 199, mrp: 349, unit: '1 bell', image: '/images/products/divine/brass-diya-set.png', subcategory: 'Puja Utensils' },
    { name: 'Solid Brass Kumkum / Haldi Container', price: 149, mrp: 250, unit: '1 piece', image: '/images/products/divine/brass-diya-set.png', subcategory: 'Puja Utensils' },
    { name: 'Marigold & Mango Leaf Festival Toran', price: 179, mrp: 299, unit: '1 unit (3 ft)', image: '/images/products/divine/daily-puja-kit.png', subcategory: 'Decor' },
    { name: 'Velvet Embroidered Prayer Aasan Mat', price: 129, mrp: 220, unit: '1 mat', image: '/images/products/divine/daily-puja-kit.png', subcategory: 'Puja Essentials' },
    { name: 'Ready-to-Use Pure Ghee Diya Wicks', price: 119, mrp: 180, unit: 'Box of 30 pcs', image: '/images/products/divine/cotton-wicks.png', subcategory: 'Wicks' },
    { name: 'Organic Rose Dhoop Cones', price: 79, mrp: 130, unit: 'Pack of 50 cones', image: '/images/products/divine/sandalwood-incense-sticks.png', subcategory: 'Aroma' },
    { name: 'Embossed Brass Puja Thali 9-inch', price: 399, mrp: 699, unit: '1 thali', image: '/images/products/divine/brass-diya-set.png', subcategory: 'Puja Utensils' },
    { name: 'Original Tulsi Mala 108 Beads', price: 149, mrp: 260, unit: '1 mala', image: '/images/products/divine/daily-puja-kit.png', subcategory: 'Spiritual' },
    { name: 'Wooden OM Wall Hanging Decor', price: 219, mrp: 399, unit: '1 frame', image: '/images/products/divine/daily-puja-kit.png', subcategory: 'Decor' },
    { name: 'Natural Herb Havan Samagri Pack', price: 99, mrp: 160, unit: '500 g pack', image: '/images/products/divine/daily-puja-kit.png', subcategory: 'Puja Samagri' },
    { name: 'Pure Chandan Tika Powder', price: 69, mrp: 110, unit: '50 g box', image: '/images/products/divine/camphor-tablets.png', subcategory: 'Puja Samagri' },
    { name: 'Carved Brass Dhoop Incense Stand', price: 169, mrp: 299, unit: '1 stand', image: '/images/products/divine/brass-diya-set.png', subcategory: 'Puja Utensils' },
    { name: 'Brass Hanging Bell with Chain', price: 289, mrp: 499, unit: '1 bell', image: '/images/products/divine/brass-diya-set.png', subcategory: 'Puja Utensils' },
    { name: 'Diwali Clay Diyas Traditional Assortment', price: 99, mrp: 160, unit: 'Set of 12', image: '/images/products/divine/daily-puja-kit.png', subcategory: 'Decor' },
    { name: 'Traditional Brass Kalash Lota', price: 249, mrp: 420, unit: '1 lota (500ml)', image: '/images/products/divine/brass-diya-set.png', subcategory: 'Puja Utensils' },
  ],

  // 5. TRIBE / REGIONAL CRAFTS (20 products)
  tribe: [
    { name: 'Woven Organic Cotton Tote Bag', price: 299, mrp: 499, unit: '1 bag', image: '/images/products/tribe.png', subcategory: 'Handloom' },
    { name: 'Kutch Hand Embroidery Travel Pouch', price: 249, mrp: 420, unit: '1 pouch', image: '/images/products/home-needs/travel-pouch.png', subcategory: 'Handicrafts' },
    { name: 'Eco Bamboo Travel Tumbler', price: 349, mrp: 599, unit: '450 ml', image: '/images/products/home-needs/insulated-water-bottle.png', subcategory: 'Eco Living' },
    { name: 'Handloom Khadi Table Runner', price: 399, mrp: 699, unit: '1 runner (5 ft)', image: '/images/products/smart/cotton-bedsheet.png', subcategory: 'Home Linen' },
    { name: 'Handcrafted Terracotta Planter', price: 229, mrp: 399, unit: '1 planter', image: '/images/products/home-needs/ceramic-mug-set.png', subcategory: 'Pottery' },
    { name: 'Bagru Block Print Cushion Covers', price: 349, mrp: 599, unit: 'Set of 2 (16x16)', image: '/images/products/smart/cotton-bedsheet.png', subcategory: 'Home Linen' },
    { name: 'Natural Coir Welcome Doormat', price: 199, mrp: 349, unit: '1 mat', image: '/images/products/tribe.png', subcategory: 'Handicrafts' },
    { name: 'Canvas & Jute Weekender Bag', price: 699, mrp: 1299, unit: '1 bag', image: '/images/products/tribe.png', subcategory: 'Handloom' },
    { name: 'Etched Brass Feather Bookmark', price: 129, mrp: 220, unit: '1 piece', image: '/images/products/divine/brass-diya-set.png', subcategory: 'Metalcraft' },
    { name: 'Braided Jute Market Basket', price: 379, mrp: 650, unit: '1 basket', image: '/images/products/home-needs/laundry-basket.png', subcategory: 'Handicrafts' },
    { name: 'Handmade Recycled Paper Journal', price: 189, mrp: 320, unit: '1 journal (120 pgs)', image: '/images/products/home-needs/desk-stationery-kit.png', subcategory: 'Stationery' },
    { name: 'Stoneware Hand-Glazed Snack Bowl', price: 269, mrp: 450, unit: 'Set of 2', image: '/images/products/home-needs/ceramic-mug-set.png', subcategory: 'Pottery' },
    { name: 'Mulberry Silk & Cotton Scarf', price: 399, mrp: 699, unit: '1 scarf', image: '/images/products/tribe/womens-kurti.png', subcategory: 'Handloom' },
    { name: 'Natural Bamboo Cutlery Travel Kit', price: 199, mrp: 350, unit: '4 piece set', image: '/images/products/home-needs/silicone-spatula-set.png', subcategory: 'Eco Living' },
    { name: 'Pure Linen Kitchen Chef Apron', price: 349, mrp: 599, unit: '1 apron', image: '/images/products/tribe/mens-cotton-shirt.png', subcategory: 'Home Linen' },
    { name: 'Sheesham Wood Serving Tray', price: 449, mrp: 799, unit: '1 tray', image: '/images/products/budget/wooden-chair.png', subcategory: 'Woodcraft' },
    { name: 'Sabai Grass Woven Storage Bin', price: 329, mrp: 550, unit: '1 bin', image: '/images/products/home-needs/laundry-basket.png', subcategory: 'Handicrafts' },
    { name: 'Hand-Carved Wooden Key Holder', price: 219, mrp: 380, unit: '1 unit (5 hooks)', image: '/images/products/home-needs/adhesive-wall-hooks.png', subcategory: 'Woodcraft' },
    { name: 'Hand-Painted Warli Art Coasters', price: 199, mrp: 349, unit: 'Set of 6', image: '/images/products/tribe.png', subcategory: 'Art' },
    { name: 'Cotton Dhurrie Picnic Blanket', price: 549, mrp: 999, unit: '1 blanket (4x6 ft)', image: '/images/products/smart/cotton-bedsheet.png', subcategory: 'Home Linen' },
  ],

  // 6. FASHION (24 products)
  fashion: [
    { name: "Men's Classic Cotton Shirt", price: 699, mrp: 1299, unit: 'Size M-XXL', image: '/images/products/tribe/mens-cotton-shirt.png', subcategory: "Men's Wear" },
    { name: "Women's Anarkali Cotton Kurti", price: 599, mrp: 1199, unit: 'Size S-XXL', image: '/images/products/tribe/womens-kurti.png', subcategory: "Women's Wear" },
    { name: 'Classic Crew Neck Cotton T-Shirt', price: 349, mrp: 699, unit: '1 unit', image: '/images/products/tribe/kids-t-shirt.png', subcategory: "Casuals" },
    { name: "Men's Slim Fit Stretch Jeans", price: 899, mrp: 1799, unit: 'Waist 30-38', image: '/images/products/tribe/mens-cotton-shirt.png', subcategory: "Men's Wear" },
    { name: 'Crisp Formal White Shirt', price: 749, mrp: 1399, unit: 'Size 38-44', image: '/images/products/tribe/mens-cotton-shirt.png', subcategory: "Men's Wear" },
    { name: "Women's Floral Printed Casual Top", price: 449, mrp: 899, unit: 'Size S-XL', image: '/images/products/tribe/womens-kurti.png', subcategory: "Women's Wear" },
    { name: 'Pure Chanderi Cotton Saree', price: 999, mrp: 1999, unit: '6.3 meter with blouse', image: '/images/products/tribe/womens-kurti.png', subcategory: "Ethnic Wear" },
    { name: 'Ready-to-Wear Salwar Suit Set', price: 899, mrp: 1699, unit: '3-Piece Set', image: '/images/products/tribe/womens-kurti.png', subcategory: "Ethnic Wear" },
    { name: 'Unisex Lightweight Fleece Hoodie', price: 799, mrp: 1499, unit: 'Size S-XXL', image: '/images/products/tribe/kids-t-shirt.png', subcategory: "Winter Wear" },
    { name: 'Casual Washed Denim Jacket', price: 1199, mrp: 2299, unit: 'Size M-XL', image: '/images/products/tribe/mens-cotton-shirt.png', subcategory: "Jackets" },
    { name: 'Dry-Fit Breathable Sports T-Shirt', price: 399, mrp: 749, unit: '1 unit', image: '/images/products/tribe/kids-t-shirt.png', subcategory: "Sportswear" },
    { name: 'Lightweight Breathable Running Shoes', price: 999, mrp: 1999, unit: 'UK 6-11', image: '/images/products/tribe/running-shoes.png', subcategory: "Footwear" },
    { name: 'Casual White Everyday Sneakers', price: 849, mrp: 1699, unit: 'UK 6-10', image: '/images/products/tribe/running-shoes.png', subcategory: "Footwear" },
    { name: "Women's Comfort Strap Flat Sandals", price: 499, mrp: 999, unit: 'UK 4-8', image: '/images/products/tribe/running-shoes.png', subcategory: "Footwear" },
    { name: 'Genuine Leather Bi-Fold Wallet', price: 399, mrp: 799, unit: '1 wallet', image: '/images/products/home-needs/travel-pouch.png', subcategory: "Accessories" },
    { name: 'Durable Canvas Laptop Backpack', price: 799, mrp: 1499, unit: '25 Litre', image: '/images/products/home-needs/travel-pouch.png', subcategory: "Bags" },
    { name: "Women's Structured Shoulder Handbag", price: 899, mrp: 1799, unit: '1 handbag', image: '/images/products/tribe.png', subcategory: "Bags" },
    { name: 'Formal Genuine Leather Reversible Belt', price: 349, mrp: 699, unit: 'Waist 30-42', image: '/images/products/tribe.png', subcategory: "Accessories" },
    { name: 'UV Protected Polarized Sunglasses', price: 499, mrp: 999, unit: '1 pair with case', image: '/images/products/automobile/car-phone-mount.png', subcategory: "Accessories" },
    { name: 'Minimalist Analog Quartz Wrist Watch', price: 799, mrp: 1599, unit: '1 watch', image: '/images/products/smart/digital-alarm-clock.png', subcategory: "Watches" },
    { name: 'Adjustable Baseball Cotton Cap', price: 249, mrp: 499, unit: 'Free size', image: '/images/products/tribe.png', subcategory: "Accessories" },
    { name: "Men's Stretch Cotton Chinos", price: 799, mrp: 1499, unit: 'Waist 30-38', image: '/images/products/tribe/mens-cotton-shirt.png', subcategory: "Men's Wear" },
    { name: "Women's Ethnic Pointed Bellies / Flats", price: 449, mrp: 899, unit: 'UK 4-8', image: '/images/products/tribe/running-shoes.png', subcategory: "Footwear" },
    { name: "Men's Festive Embroidered Kurta", price: 699, mrp: 1399, unit: 'Size 38-44', image: '/images/products/tribe/mens-cotton-shirt.png', subcategory: "Ethnic Wear" },
  ],

  // 7. COSMETICS & BEAUTY (24 products)
  cosmetics: [
    { name: 'Purifying Neem Face Wash', price: 149, mrp: 220, unit: '150 ml tube', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Skincare' },
    { name: 'Gentle Foaming Daily Cleanser', price: 199, mrp: 299, unit: '120 ml pump', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Skincare' },
    { name: 'Hyaluronic Acid Face Moisturizer', price: 299, mrp: 499, unit: '100 g tub', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Skincare' },
    { name: 'Ultra Light SPF 50 Sunscreen Gel', price: 349, mrp: 549, unit: '80 g tube', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Sun Care' },
    { name: 'Vitamin C Brightening Face Serum', price: 449, mrp: 799, unit: '30 ml dropper', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Serums' },
    { name: 'Matte Liquid Long-Stay Lipstick', price: 249, mrp: 450, unit: '5 ml tube', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Makeup' },
    { name: 'Weightless Matte Foundation', price: 399, mrp: 699, unit: '30 ml bottle', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Makeup' },
    { name: 'Oil-Control Compact Setting Powder', price: 199, mrp: 349, unit: '9 g compact', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Makeup' },
    { name: 'Smudge-Proof Ayurvedic Herbal Kajal', price: 129, mrp: 199, unit: '1 stick', image: '/images/products/divine/camphor-tablets.png', subcategory: 'Eye Makeup' },
    { name: 'Waterproof Precision Liquid Eyeliner', price: 179, mrp: 299, unit: '1 pen', image: '/images/products/smart/braided-usb-c-cable.png', subcategory: 'Eye Makeup' },
    { name: 'Volumizing & Curling Mascara', price: 229, mrp: 399, unit: '8.5 ml', image: '/images/products/smart/rechargeable-usb-trimmer.png', subcategory: 'Eye Makeup' },
    { name: 'Natural Glow Mineral Blush Palette', price: 279, mrp: 499, unit: '1 palette', image: '/images/products/home-needs/desk-stationery-kit.png', subcategory: 'Makeup' },
    { name: 'Professional Makeup Brush Set', price: 399, mrp: 799, unit: 'Set of 8 with pouch', image: '/images/products/home-needs/silicone-spatula-set.png', subcategory: 'Tools' },
    { name: 'Herbal Anti-Dandruff Shampoo', price: 189, mrp: 280, unit: '300 ml bottle', image: '/images/products/smart/dishwash-liquid.png', subcategory: 'Hair Care' },
    { name: 'Deep Nourishing Hair Conditioner', price: 199, mrp: 299, unit: '250 ml tube', image: '/images/products/smart/dishwash-liquid.png', subcategory: 'Hair Care' },
    { name: 'Argan Oil Frizz-Control Hair Serum', price: 299, mrp: 499, unit: '50 ml bottle', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Hair Care' },
    { name: 'Cold Pressed Onion & Bhringraj Hair Oil', price: 249, mrp: 399, unit: '200 ml bottle', image: '/images/products/smart/cold-pressed-groundnut-oil.png', subcategory: 'Hair Care' },
    { name: 'Deep Hydrating Cocoa Body Lotion', price: 229, mrp: 350, unit: '400 ml pump', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Body Care' },
    { name: 'Detoxifying Multani Mitti Face Pack', price: 149, mrp: 240, unit: '100 g jar', image: '/images/products/fresh/malai-paneer.png', subcategory: 'Skincare' },
    { name: 'Strawberry Tinted Nourishing Lip Balm', price: 99, mrp: 160, unit: '10 g tub', image: '/images/products/divine/camphor-tablets.png', subcategory: 'Lip Care' },
    { name: 'Shea Butter & Vitamin E Hand Cream', price: 139, mrp: 220, unit: '50 g tube', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Body Care' },
    { name: 'Luxury Eau De Parfum (French Jasmine)', price: 499, mrp: 999, unit: '50 ml spray', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Fragrance' },
    { name: 'All-Day Fresh Deodorant Spray', price: 189, mrp: 275, unit: '150 ml can', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Fragrance' },
    { name: 'Bi-Phase Gentle Makeup Cleansing Oil', price: 249, mrp: 399, unit: '100 ml bottle', image: '/images/products/smart/neem-face-wash.png', subcategory: 'Skincare' },
  ],

  // 8. FURNITURE (24 products)
  furniture: [
    { name: 'Contemporary 3-Seater Fabric Sofa', price: 12999, mrp: 21999, unit: 'Grey Fabric', image: '/images/products/budget/three-seater-sofa.png', subcategory: 'Living Room' },
    { name: 'Compact 2-Seater Studio Loveseat', price: 8999, mrp: 15999, unit: 'Blue Fabric', image: '/images/products/budget/three-seater-sofa.png', subcategory: 'Living Room' },
    { name: 'Comfort Armchair & Lounge Seater', price: 4999, mrp: 8999, unit: '1 unit', image: '/images/products/budget/wooden-chair.png', subcategory: 'Living Room' },
    { name: 'Solid Sheesham Wooden Dining Chair', price: 1999, mrp: 3499, unit: '1 chair', image: '/images/products/budget/wooden-chair.png', subcategory: 'Dining' },
    { name: 'Cushioned Ergonomic Dining Chair', price: 2299, mrp: 3999, unit: 'Set of 1', image: '/images/products/budget/wooden-chair.png', subcategory: 'Dining' },
    { name: 'Solid Wood 4-Seater Dining Table', price: 9499, mrp: 16999, unit: '4x3 ft table', image: '/images/products/budget/wooden-chair.png', subcategory: 'Dining' },
    { name: 'Modern Minimalist Coffee Table', price: 2999, mrp: 5499, unit: 'Teak finish', image: '/images/products/home-utility.png', subcategory: 'Living Room' },
    { name: 'Bedside Solid Wood End Table', price: 1499, mrp: 2799, unit: '1 drawer table', image: '/images/products/home-needs/kitchen-organizer.png', subcategory: 'Bedroom' },
    { name: 'Compact Study Table with Bookshelf', price: 3499, mrp: 6499, unit: '1 desk', image: '/images/products/smart/laptop-stand.png', subcategory: 'Office' },
    { name: 'Ergonomic Mesh High-Back Office Chair', price: 4499, mrp: 7999, unit: '1 chair', image: '/images/products/budget/wooden-chair.png', subcategory: 'Office' },
    { name: '4-Tier Wooden Display Bookshelf', price: 2799, mrp: 4999, unit: '1 shelf unit', image: '/images/products/home-needs/kitchen-organizer.png', subcategory: 'Storage' },
    { name: 'Engineered Wood TV Entertainment Unit', price: 3999, mrp: 7499, unit: 'Up to 55" TV', image: '/images/marketplace/resale-tv.png', subcategory: 'Living Room' },
    { name: '3-Tier Ventilated Wooden Shoe Rack', price: 1699, mrp: 2999, unit: 'Holds 12 pairs', image: '/images/products/home-needs/foldable-storage-box.png', subcategory: 'Storage' },
    { name: 'Nightstand with Storage Drawers', price: 1899, mrp: 3299, unit: '1 table', image: '/images/products/home-needs/wooden-hangers.png', subcategory: 'Bedroom' },
    { name: 'Two-Door Engineered Wood Wardrobe', price: 7999, mrp: 14999, unit: 'With lock & mirror', image: '/images/products/home-needs/clothes-organizer.png', subcategory: 'Bedroom' },
    { name: 'Solid Wood Single Cot Bed', price: 5499, mrp: 9999, unit: '3x6 ft frame', image: '/images/products/smart/cotton-bedsheet.png', subcategory: 'Bedroom' },
    { name: 'Queen Size Wooden Bed with Box Storage', price: 14999, mrp: 25999, unit: '5x6.5 ft bed', image: '/images/products/smart/cotton-bedsheet.png', subcategory: 'Bedroom' },
    { name: 'Multi-Utility Hallway Storage Cabinet', price: 3499, mrp: 6299, unit: '2-door unit', image: '/images/products/home-needs/airtight-storage-container.png', subcategory: 'Storage' },
    { name: 'Height Adjustable Work from Home Desk', price: 5999, mrp: 10999, unit: '4x2 ft desk', image: '/images/products/smart/laptop-stand.png', subcategory: 'Office' },
    { name: 'Single Seater Manual Recliner Chair', price: 11499, mrp: 19999, unit: 'Leatherette brown', image: '/images/products/budget/three-seater-sofa.png', subcategory: 'Living Room' },
    { name: 'Kitchen Wall Hanging Storage Cabinet', price: 2499, mrp: 4499, unit: '2-tier cabinet', image: '/images/products/home-needs/kitchen-organizer.png', subcategory: 'Kitchen' },
    { name: 'Entryway Slim Wooden Console Table', price: 2299, mrp: 4199, unit: '3 ft table', image: '/images/products/home-utility.png', subcategory: 'Living Room' },
    { name: 'Foldable Wooden Balcony Chair', price: 1199, mrp: 2199, unit: '1 chair', image: '/images/products/budget/wooden-chair.png', subcategory: 'Outdoor' },
    { name: 'Upholstered Storage Ottoman Bench', price: 2699, mrp: 4899, unit: '3 ft bench', image: '/images/products/budget/three-seater-sofa.png', subcategory: 'Living Room' },
  ],

  // 9. BULK ORDER & WHOLESALE (22 products)
  'bulk-order': [
    { name: 'Royal Basmati Rice 5kg Wholesale Pack', price: 499, mrp: 750, unit: '5 kg bag', image: '/images/products/smart/basmati-rice-5kg.png', subcategory: 'Grains & Pulses', isBOGO: false },
    { name: 'Farm Toor Dal 5kg Bulk Pack', price: 649, mrp: 900, unit: '5 kg bag', image: '/images/products/smart/toor-dal-1kg.png', subcategory: 'Grains & Pulses', isBOGO: false },
    { name: 'Refined Pure Sugar 5kg Pack', price: 219, mrp: 280, unit: '5 kg bag', image: '/images/products/shop.png', subcategory: 'Pantry Bulk', isBOGO: false },
    { name: 'Chakki Fresh Wheat Flour (Atta) 10kg', price: 399, mrp: 520, unit: '10 kg bag', image: '/images/products/shop.png', subcategory: 'Grains & Pulses', isBOGO: false },
    { name: 'Cold Pressed Groundnut Oil 5L Tin', price: 899, mrp: 1250, unit: '5 Litre can', image: '/images/products/smart/cold-pressed-groundnut-oil.png', subcategory: 'Oils & Ghee', isBOGO: false },
    { name: 'Premium Assam CTC Tea 1kg Bulk Pack', price: 349, mrp: 499, unit: '1 kg pack', image: '/images/products/smart/masala-tea-250g.png', subcategory: 'Beverages', isBOGO: false },
    { name: 'Roasted Filter Coffee 1kg Wholesale Pack', price: 499, mrp: 720, unit: '1 kg bag', image: '/images/products/shop.png', subcategory: 'Beverages', isBOGO: false },
    { name: 'Disposable Paper Hot Cups 100 Pack', price: 149, mrp: 250, unit: '100 cups (200ml)', image: '/images/products/home-needs/ceramic-mug-set.png', subcategory: 'Catering', isBOGO: false },
    { name: 'Biodegradable Bagasse Plates 50 Pack', price: 189, mrp: 300, unit: '50 plates (10-inch)', image: '/images/products/home-needs/stainless-steel-tiffin-set.png', subcategory: 'Catering', isBOGO: false },
    { name: '2-Ply Kitchen Paper Towel Roll 12 Pack', price: 299, mrp: 480, unit: '12 rolls', image: '/images/products/home-needs/laundry-basket.png', subcategory: 'Hygiene', isBOGO: false },
    { name: 'Commercial Surface Disinfectant 5L Can', price: 449, mrp: 750, unit: '5 Litre can', image: '/images/products/smart/dishwash-liquid.png', subcategory: 'Cleaning Bulk', isBOGO: false },
    { name: 'Concentrated Liquid Laundry Detergent 5L', price: 499, mrp: 850, unit: '5 Litre can', image: '/images/products/smart/laundry-detergent.png', subcategory: 'Cleaning Bulk', isBOGO: false },
    { name: 'Smooth Ballpoint Pen Box of 50', price: 199, mrp: 350, unit: '50 blue pens', image: '/images/products/home-needs/desk-stationery-kit.png', subcategory: 'Stationery Bulk', isBOGO: false },
    { name: 'Stainless Steel Water Bottle 10 Pack', price: 1899, mrp: 3499, unit: '10 bottles (750ml)', image: '/images/products/home-needs/insulated-water-bottle.png', subcategory: 'Commercial', isBOGO: false },
    { name: 'Corrugated Shipping Boxes 25 Pack', price: 349, mrp: 600, unit: '25 boxes (10x8x6)', image: '/images/products/home-needs/foldable-storage-box.png', subcategory: 'Packaging', isBOGO: false },
    { name: 'Airtight Modular Kitchen Jars 12 Pack', price: 899, mrp: 1599, unit: '12 jars (1000ml)', image: '/images/products/home-needs/airtight-storage-container.png', subcategory: 'Kitchen Bulk', isBOGO: false },
    { name: 'Microfiber Cleaning Towels 20 Pack', price: 399, mrp: 700, unit: '20 cloths (40x40cm)', image: '/images/products/automobile/microfiber-car-duster.png', subcategory: 'Hygiene', isBOGO: false },
    { name: 'Heavy Duty Wall Hooks 30 Pack Box', price: 299, mrp: 550, unit: '30 hooks', image: '/images/products/home-needs/adhesive-wall-hooks.png', subcategory: 'Hardware Bulk', isBOGO: false },
    { name: 'Stainless Steel Snack Plates 12 Pack', price: 549, mrp: 950, unit: '12 plates', image: '/images/products/home-needs/stainless-steel-tiffin-set.png', subcategory: 'Catering', isBOGO: false },
    { name: 'Commercial Waste Dustbin 4 Pack', price: 799, mrp: 1400, unit: '4 bins (15L)', image: '/images/products/home-needs/multipurpose-dustbin.png', subcategory: 'Cleaning Bulk', isBOGO: false },
    { name: 'Eco-friendly Brown Kraft Paper Bags 100 Pack', price: 249, mrp: 450, unit: '100 bags', image: '/images/products/shop.png', subcategory: 'Packaging', isBOGO: false },
    { name: 'Heavy Zip-Lock Storage Bags 150 Pack', price: 219, mrp: 380, unit: '150 bags', image: '/images/products/home-needs/travel-pouch.png', subcategory: 'Packaging', isBOGO: false },
  ],

  // 10. REFURBISHED TECH & APPLIANCES (22 products)
  refurbished: [
    { name: 'Refurbished iPhone 13 128GB (Certified)', price: 39999, mrp: 59900, unit: 'Midnight · 89% Battery', image: '/images/marketplace/refurbished-phone.png', subcategory: 'Phones', isBOGO: false },
    { name: 'Refurbished 5G Android Smartphone 128GB', price: 14999, mrp: 24999, unit: '8GB RAM · Inspected', image: '/images/marketplace/refurbished-phone.png', subcategory: 'Phones', isBOGO: false },
    { name: 'Refurbished iPhone 12 Pro 256GB', price: 44999, mrp: 79900, unit: 'Graphite · 6M Warranty', image: '/images/marketplace/refurbished-phone.png', subcategory: 'Phones', isBOGO: false },
    { name: 'Refurbished Dell Latitude 5420 Laptop', price: 28990, mrp: 57990, unit: 'Core i5 · 16GB · 512GB SSD', image: '/images/products/smart/dell-laptop.png', subcategory: 'Laptops', isBOGO: false },
    { name: 'Refurbished Lenovo ThinkPad T14 Laptop', price: 31990, mrp: 64990, unit: 'Core i7 · 16GB · 512GB SSD', image: '/images/products/smart/dell-laptop.png', subcategory: 'Laptops', isBOGO: false },
    { name: 'Refurbished Apple iPad 9th Gen 64GB', price: 21990, mrp: 32990, unit: 'Space Grey · Wi-Fi', image: '/images/marketplace/refurbished-phone.png', subcategory: 'Tablets', isBOGO: false },
    { name: 'Refurbished HP EliteDesk Mini PC Tower', price: 18490, mrp: 38990, unit: '16GB RAM · 256GB SSD', image: '/images/products/smart/keyboard.png', subcategory: 'Computers', isBOGO: false },
    { name: 'Refurbished 24-inch Full HD IPS Monitor', price: 5490, mrp: 11990, unit: '75Hz · HDMI/VGA', image: '/images/marketplace/resale-tv.png', subcategory: 'Displays', isBOGO: false },
    { name: 'Refurbished Mechanical Gaming Keyboard', price: 1290, mrp: 2990, unit: 'Blue Switches · RGB', image: '/images/products/smart/keyboard.png', subcategory: 'Accessories', isBOGO: false },
    { name: 'Refurbished Ergonomic Wireless Mouse', price: 690, mrp: 1490, unit: 'Rechargeable', image: '/images/products/smart/wireless-mouse.png', subcategory: 'Accessories', isBOGO: false },
    { name: 'Refurbished Active Noise Cancelling Headphones', price: 2490, mrp: 5990, unit: '30h Battery · Tested', image: '/images/products/smart/bluetooth-headphones.png', subcategory: 'Audio', isBOGO: false },
    { name: 'Refurbished True Wireless Earbuds with Case', price: 1190, mrp: 2990, unit: 'Sanitized · Grade A', image: '/images/products/smart/wireless-earbuds.png', subcategory: 'Audio', isBOGO: false },
    { name: 'Refurbished 16W Portable Bluetooth Speaker', price: 1390, mrp: 3290, unit: 'IPX7 Waterproof', image: '/images/products/smart/pocket-bluetooth-speaker.png', subcategory: 'Audio', isBOGO: false },
    { name: 'Refurbished AMOLED Smartwatch 44mm', price: 1990, mrp: 4990, unit: 'Heart Rate & SpO2', image: '/images/products/smart/digital-alarm-clock.png', subcategory: 'Wearables', isBOGO: false },
    { name: 'Refurbished 43-inch 4K Smart LED TV', price: 16990, mrp: 32990, unit: 'Android OS · Wall Mount', image: '/images/marketplace/resale-tv.png', subcategory: 'Appliances', isBOGO: false },
    { name: 'Refurbished 260L Frost-Free Double Door Fridge', price: 15490, mrp: 28990, unit: 'Serviced · 6M Warranty', image: '/images/marketplace/resale-fridge.png', subcategory: 'Appliances', isBOGO: false },
    { name: 'Refurbished 7kg Fully Automatic Washing Machine', price: 11990, mrp: 22990, unit: 'Front Load · Sanitized', image: '/images/marketplace/resale-washer.png', subcategory: 'Appliances', isBOGO: false },
    { name: 'Refurbished Convection Microwave Oven 28L', price: 6490, mrp: 13990, unit: 'Auto Cook Menus', image: '/images/marketplace/sale-airfryer.png', subcategory: 'Appliances', isBOGO: false },
    { name: 'Refurbished All-in-One Laser Printer', price: 7990, mrp: 16990, unit: 'Print/Scan/Copy', image: '/images/products/smart/keyboard.png', subcategory: 'Office Tech', isBOGO: false },
    { name: 'Refurbished Mirrorless 24MP Digital Camera', price: 29990, mrp: 54990, unit: '18-55mm Lens Kit', image: '/images/marketplace/refurbished-phone.png', subcategory: 'Cameras', isBOGO: false },
    { name: 'Refurbished HD Gaming Console 500GB', price: 14990, mrp: 28990, unit: '1 Controller included', image: '/images/products/smart/10000mah-power-bank.png', subcategory: 'Gaming', isBOGO: false },
    { name: 'Refurbished Gigabit AC1200 Wi-Fi Router', price: 1190, mrp: 2490, unit: 'Dual Band 4 Antennas', image: '/images/products/smart/extension-board.png', subcategory: 'Networking', isBOGO: false },
  ],
}

const brandsPool = ['TechieSmart Select', 'DailyKart', 'Namma Farms', 'Urban Utility', 'Aarambh', 'Mitti Collective', 'Everyday Co.']
const categoryTitles: Record<string, string> = {
  fresh: 'Fresh',
  smart: 'Smart',
  'home-needs': 'Home Needs',
  divine: 'Divine',
  tribe: 'Tribe',
  fashion: 'Fashion',
  cosmetics: 'Cosmetics',
  furniture: 'Furniture',
  'bulk-order': 'Bulk Order',
  refurbished: 'Refurbished',
}

export const products: Product[] = Object.entries(rawCatalog).flatMap(([catKey, items]) =>
  items.map((item, i) => {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const categoryId = catKey
    const category = categoryTitles[catKey] || catKey
    const brand = item.brand || brandsPool[(i + catKey.length) % brandsPool.length]
    const price = item.price
    const mrp = item.mrp
    const isBOGO = item.isBOGO !== undefined ? item.isBOGO : catKey !== 'bulk-order' && catKey !== 'refurbished'
    const bogoRule = isBOGO ? 'Buy 1 Get 1 Free' : undefined
    const rating = Number((4.2 + (i % 8) / 10).toFixed(1))
    const reviewCount = 20 + i * 9
    const stock = 12 + (i % 38)
    const deliveryTime = catKey === 'fresh' ? 'Today, 30–60 min' : catKey === 'furniture' ? '2-3 Business Days' : 'Tomorrow, 9am–1pm'
    const description = item.description || `A carefully selected ${item.name.toLowerCase()} for practical everyday use, with clear pricing and dependable delivery from TechieSmart.`
    const image = item.image

    return {
      id: `${catKey}-${i + 1}`,
      sku: `MM-${catKey.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${String(i + 1).padStart(3, '0')}`,
      slug,
      name: item.name,
      brand,
      category,
      categoryId,
      subcategory: item.subcategory,
      subcategoryId: `${catKey}-${item.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      description,
      price,
      mrp,
      rating,
      reviewCount,
      unit: item.unit,
      image,
      tags: [catKey, item.name.toLowerCase(), category.toLowerCase(), item.subcategory.toLowerCase(), 'community savings'],
      isBOGO,
      bogoRule,
      stock,
      deliveryTime,
      location: 'Pune',
      highlights:
        catKey === 'fresh'
          ? ['Freshly harvested & cleaned', 'Temperature controlled delivery', 'Origin confirmed on pack']
          : catKey === 'refurbished'
          ? ['40-point technical inspection', '6 months warranty support', 'Original accessories & cable']
          : catKey === 'bulk-order'
          ? ['Wholesale bulk packaging', 'Transparent tier pricing', 'Direct verified supplier dispatch']
          : ['Quality tested materials', 'Community verified pricing', 'Standard TechieSmart assurance'],
      specs:
        catKey === 'fresh'
          ? { origin: 'India', storage: 'Keep refrigerated', shelfLife: 'As marked on pack' }
          : catKey === 'refurbished'
          ? { condition: 'Tested & Certified', warranty: '6 Months TechieSmart Care', packageContents: '1 unit + accessories' }
          : { material: 'Quality-tested materials', warranty: catKey === 'smart' ? '1 Year Standard' : 'Standard Policy', packageContents: item.unit },
    }
  })
)

export const featuredProducts = products.filter((p) => p.isBOGO).slice(0, 12)
export function findProduct(slug: string) {
  const s = slug.toLowerCase()
  return products.find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      p.slug.toLowerCase() === s ||
      p.id.toLowerCase() === s
  )
}
export const productStats = {
  total: products.length,
  bogo: products.filter((p) => p.isBOGO).length,
  shop: products.filter((p) => !p.isBOGO).length,
}

export const bogoVerticals = [
  ['Fresh', 'Fresh produce, dairy and daily essentials', '/bogo/fresh'],
  ['Smart', 'Useful technology without the premium markup', '/bogo/smart'],
  ['Home Needs', 'Home utility picks under a considered budget', '/bogo/home-needs'],
  ['Divine', 'Respectful, practical prayer essentials', '/bogo/divine'],
  ['Tribe', 'Regional products with a community story', '/bogo/tribe'],
  ['Fashion', 'Apparel and wardrobe staples with BOGO value', '/bogo/fashion'],
  ['Cosmetics', 'Skin care and beauty daily formulations', '/bogo/cosmetics'],
  ['Furniture', 'Functional living and workspace furniture', '/bogo/furniture'],
]

export const faqs = [
  ['What is BOGO at TechieSmart?', 'BOGO is a transparent Buy One Get One offer on selected campaigns. You pay for the paid quantity and the matching free quantity is shown separately in your cart.'],
  ['How does community commerce work?', 'Neighbours can discover the same campaign and aggregate interest. Participation can improve procurement planning, but savings and availability are always shown as estimates until confirmed.'],
  ['How quickly will my order arrive?', 'Fresh campaigns show a short delivery window. Other products show the next available slot before checkout, based on the demo location selected.'],
  ['Can I return an item?', 'Return eligibility is shown on each product and order. Fresh goods follow a separate quality issue process, while eligible non-food products have a standard return window.'],
  ['Are payments real?', 'This build simulates payment choices and order creation locally. No payment is charged and no financial settlement is represented.'],
]

export const services = [
  ['Car cleaning', 'CleanRide Partners', 'From ₹399', 'Exterior wash, interior vacuum and dashboard care with a bookable neighbourhood slot.'],
  ['Home deep cleaning', 'NeatNest Crew', 'From ₹1,499', 'A structured kitchen, bathroom and living-area clean with an itemised visit scope.'],
  ['Electrician visit', 'FixRight Community', 'From ₹249', 'Small electrical repairs, fixture installation and diagnosis with transparent visit pricing.'],
  ['Garden maintenance', 'GreenBlock Services', 'From ₹699', 'Recurring common-area planting, trimming and seasonal care for residential communities.'],
  ['Elder assistance', 'CareCircle Demo Provider', 'From ₹599', 'Non-medical home assistance for errands and routine support; advance booking required.'],
  ['Festival decoration', 'RangRoom Events', 'From ₹2,499', 'Community-ready decoration planning, setup and pack-down for festivals and gatherings.'],
]

export const communities = [
  ['WAKAD001', 'Wakad Neighbourhood', 'Active', '1% eligible order commission'],
  ['HINJEWADI002', 'Hinjewadi Collective', 'Active', 'Shared campaign access'],
  ['BANER003', 'Baner Community Circle', 'Active', 'Community service coordination'],
]

export const resale = ['Refurbished Android Phone', 'Two-door Refrigerator', 'Study Desk with Storage', 'Smart LED Television', 'Front Load Washing Machine', 'Air Conditioner 1.5T', 'Solid Wood Bookshelf', 'Gaming Monitor']
export const importInfo = ['Choose a product request', 'TechieSmart aggregates interest', 'Supplier quotations are compared', 'Community reviews MOQ and landed estimates', 'Procurement status is updated before dispatch']

export function searchProducts(query: string) {
  const q = query.toLowerCase().trim()
  return q
    ? products.filter((p) =>
        [p.name, p.brand, p.category, p.subcategory, ...p.tags]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    : products
}

export function getBogoTotals(product: Product, quantity: number) {
  return {
    paid: quantity,
    free: product.isBOGO ? quantity : 0,
    savings: product.isBOGO ? product.price * quantity : 0,
    total: product.price * quantity,
  }
}

// Catalog integrity check
if (process.env.NODE_ENV !== 'production') {
  for (const p of products) {
    if (!p.name || p.mrp < p.price || (p.isBOGO && !p.bogoRule)) {
      throw new Error(`Invalid catalog record: ${p.id}`)
    }
  }
}
