import { useState, useEffect, useRef } from "react"

const IMG_WARM = "/img-warm.jpg"
const IMG_COLD = "/img-cold.jpg"
const IMG_NORM = "/img-norm.jpg"
const IMG_BIZ  = "/img-biz.jpg"

const DESTINATIONS = [
  'New York, NY','Los Angeles, CA','Chicago, IL','Houston, TX','Phoenix, AZ',
  'Philadelphia, PA','San Antonio, TX','San Diego, CA','Dallas, TX','San Jose, CA',
  'Austin, TX','Jacksonville, FL','Fort Worth, TX','Columbus, OH','Charlotte, NC',
  'Indianapolis, IN','San Francisco, CA','Seattle, WA','Denver, CO','Nashville, TN',
  'Oklahoma City, OK','El Paso, TX','Washington DC','Las Vegas, NV','Louisville, KY',
  'Memphis, TN','Portland, OR','Baltimore, MD','Salt Lake City, UT','Detroit, MI','Boston, MA',
  'Honolulu, HI','Anchorage, AK','Bozeman, MT','Aspen, CO','Vail, CO',
  'Park City, UT','Jackson Hole, WY','Sedona, AZ','Savannah, GA','Charleston, SC',
  'Key West, FL','Napa, CA','Santa Fe, NM','Scottsdale, AZ','Myrtle Beach, SC',
  'Miami, FL','Tampa, FL','Orlando, FL','Atlanta, GA','Raleigh, NC',
  'London, UK','Paris, France','Rome, Italy','Barcelona, Spain','Madrid, Spain',
  'Amsterdam, Netherlands','Berlin, Germany','Munich, Germany','Vienna, Austria',
  'Prague, Czech Republic','Budapest, Hungary','Stockholm, Sweden','Oslo, Norway',
  'Copenhagen, Denmark','Helsinki, Finland','Reykjavik, Iceland',
  'Zurich, Switzerland','Geneva, Switzerland','Lisbon, Portugal','Porto, Portugal',
  'Athens, Greece','Santorini, Greece','Mykonos, Greece','Istanbul, Turkey',
  'Dubrovnik, Croatia','Split, Croatia','Venice, Italy','Florence, Italy',
  'Milan, Italy','Naples, Italy','Amalfi Coast, Italy','Nice, France',
  'Edinburgh, Scotland','Dublin, Ireland','Seville, Spain','Valencia, Spain',
  'Ibiza, Spain','Mallorca, Spain','Krakow, Poland','Tallinn, Estonia',
  'Tokyo, Japan','Osaka, Japan','Kyoto, Japan','Seoul, South Korea',
  'Beijing, China','Shanghai, China','Hong Kong','Taipei, Taiwan',
  'Bangkok, Thailand','Chiang Mai, Thailand','Phuket, Thailand','Koh Samui, Thailand',
  'Singapore','Kuala Lumpur, Malaysia','Bali, Indonesia','Manila, Philippines',
  'Ho Chi Minh City, Vietnam','Hanoi, Vietnam','Da Nang, Vietnam','Siem Reap, Cambodia',
  'Kathmandu, Nepal','Mumbai, India','Delhi, India','Goa, India','Jaipur, India',
  'Dubai, UAE','Abu Dhabi, UAE','Doha, Qatar','Muscat, Oman',
  'Amman, Jordan','Tel Aviv, Israel','Jerusalem, Israel',
  'Sydney, Australia','Melbourne, Australia','Brisbane, Australia','Perth, Australia',
  'Auckland, New Zealand','Queenstown, New Zealand',
  'Fiji','Tahiti, French Polynesia','Bora Bora, French Polynesia','Maldives','Seychelles',
  'Toronto, Canada','Vancouver, Canada','Montreal, Canada','Calgary, Canada',
  'Quebec City, Canada','Banff, Canada','Whistler, Canada',
  'Mexico City, Mexico','Cancun, Mexico','Tulum, Mexico','Playa del Carmen, Mexico',
  'Havana, Cuba','Punta Cana, Dominican Republic','San Juan, Puerto Rico',
  'Nassau, Bahamas','Bridgetown, Barbados','Montego Bay, Jamaica',
  'San Jose, Costa Rica','Panama City, Panama','Bogota, Colombia',
  'Medellin, Colombia','Cartagena, Colombia','Lima, Peru','Cusco, Peru',
  'Buenos Aires, Argentina','Rio de Janeiro, Brazil','Sao Paulo, Brazil',
  'Santiago, Chile','Cairo, Egypt','Luxor, Egypt','Marrakech, Morocco',
  'Casablanca, Morocco','Nairobi, Kenya','Zanzibar, Tanzania',
  'Cape Town, South Africa','Johannesburg, South Africa','Mauritius',
]

function classifyClimate(dest) {
  const d = dest.toLowerCase()
  if (/miami|bali|bangkok|phuket|cancun|maldives|hawaii|honolulu|koh samui|singapore|jamaica|barbados|bahamas|fiji|tahiti|bora bora|seychelles|mauritius|zanzibar|punta cana|tulum|playa|key west|da nang|hoi an|goa|cartagena|cairns|darwin|gold coast|panama|costa rica|cebu|colombo|rio|sao paulo|rio de janeiro/.test(d)) return 'tropical'
  if (/aspen|vail|park city|jackson hole|whistler|queenstown|bozeman|banff|zurich|geneva|reykjavik|oslo|stockholm|helsinki|anchorage|montreal|tallinn|sapporo/.test(d)) return 'cold'
  if (/dubai|abu dhabi|doha|riyadh|muscat|cairo|luxor|marrakech|casablanca|las vegas|phoenix|scottsdale|mesa|albuquerque|el paso|jaipur|agra|sedona|santa fe|jordan|amman|israel|tel aviv|jerusalem/.test(d)) return 'desert'
  if (/barcelona|madrid|seville|valencia|ibiza|mallorca|lisbon|porto|athens|santorini|mykonos|rome|naples|venice|milan|florence|istanbul|split|dubrovnik|nice|marseille|limassol|cyprus|malta|beirut|montego bay|san juan|havana|amalfi|los angeles|san diego|san francisco|napa/.test(d)) return 'warm'
  return 'temperate'
}

// warm = tropical + desert + mediterranean
// cold = cold + snowy
// normal = temperate
function getVisualCategory(climate, tripType) {
  if (tripType === 'Business') return 'business'
  if (climate === 'tropical' || climate === 'desert' || climate === 'warm') return 'warm'
  if (climate === 'cold') return 'cold'
  return 'normal'
}

function getVisualImage(climate, tripType) {
  const cat = getVisualCategory(climate, tripType)
  if (cat === 'business') return IMG_BIZ
  if (cat === 'warm') return IMG_WARM
  if (cat === 'cold') return IMG_COLD
  return IMG_NORM
}

function suggestTripTypes(climate) {
  const map = {
    tropical: ['Leisure','Beach','Adventure','Family'],
    cold: ['Leisure','Adventure','Family','Business'],
    desert: ['Leisure','Business','Adventure'],
    warm: ['Leisure','Beach','Family','Adventure','Business'],
    temperate: ['Leisure','Business','Family','Adventure','Backpacking'],
  }
  return map[climate] || ['Leisure','Business','Family','Adventure']
}

// Cap clothing quantities — for long trips recommend washing instead
function smartQty(base, cap) {
  if (base <= cap) return base
  return cap  // will add laundry note
}

function generateList(tripType, days, climate) {
  const needsLaundryNote = days > 10

  // Sensible caps per category
  const shirtCap = 7, pantCap = 4, undyCap = 8, sockCap = 8

  const shirts = smartQty(Math.min(days + 1, 12), shirtCap)
  const undies = smartQty(Math.min(days + 1, 12), undyCap)
  const socks  = smartQty(Math.min(days + 1, 12), sockCap)

  const clothing = []
  const footwear = []
  const toiletries = [
    { name:'Toothbrush', qty:1, weight:0.1, packed:false, bag:'carry' },
    { name:'Toothpaste', qty:1, weight:0.3, packed:false, bag:'carry' },
    { name:'Deodorant', qty:1, weight:0.3, packed:false, bag:'carry' },
    { name:'Shampoo', qty:1, weight:0.5, packed:false, bag:'main' },
    { name:'Body Wash', qty:1, weight:0.5, packed:false, bag:'main' },
    { name:'Face Wash', qty:1, weight:0.4, packed:false, bag:'main' },
    { name:'Moisturizer', qty:1, weight:0.3, packed:false, bag:'carry' },
    { name:'Razor', qty:1, weight:0.2, packed:false, bag:'main' },
  ]
  const electronics = [
    { name:'Phone Charger', qty:1, weight:0.3, packed:false, bag:'carry' },
    { name:'Earbuds', qty:1, weight:0.2, packed:false, bag:'carry' },
    { name:'Portable Charger', qty:1, weight:0.8, packed:false, bag:'carry' },
  ]
  const documents = [
    { name:'Passport', qty:1, weight:0.1, packed:false, bag:'carry' },
    { name:'Travel Insurance', qty:1, weight:0.1, packed:false, bag:'carry' },
    { name:'Credit Cards', qty:2, weight:0.1, packed:false, bag:'carry' },
    { name:'Cash', qty:1, weight:0.1, packed:false, bag:'carry' },
  ]
  const health = [
    { name:'Pain Relievers', qty:1, weight:0.2, packed:false, bag:'carry' },
    { name:'Hand Sanitizer', qty:1, weight:0.2, packed:false, bag:'carry' },
    { name:'Band-Aids', qty:1, weight:0.1, packed:false, bag:'carry' },
  ]

  if (tripType === 'Business') {
    const suits = Math.min(Math.max(1, Math.ceil(days / 3)), 3)
    const dressShirts = Math.min(days + 1, 6)
    clothing.push(
      { name:'Suit', qty:suits, weight:3.0, packed:false, bag:'main' },
      { name:'Dress Shirt', qty:dressShirts, weight:0.5, packed:false, bag:'main' },
      { name:'Tie', qty:suits, weight:0.1, packed:false, bag:'main' },
      { name:'Dress Pants', qty:Math.min(suits, 3), weight:1.0, packed:false, bag:'main' },
      { name:'Belt', qty:1, weight:0.3, packed:false, bag:'main' },
      { name:'T-Shirts (casual)', qty:Math.min(Math.ceil(days / 2), 4), weight:0.5, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
      { name:'Dress Socks', qty:Math.min(dressShirts, 6), weight:0.2, packed:false, bag:'main' },
    )
    footwear.push(
      { name:'Dress Shoes', qty:1, weight:2.5, packed:false, bag:'main' },
      { name:'Casual Shoes', qty:1, weight:2.0, packed:false, bag:'main' },
    )
    electronics.push(
      { name:'Laptop', qty:1, weight:4.0, packed:false, bag:'carry' },
      { name:'Laptop Charger', qty:1, weight:0.8, packed:false, bag:'carry' },
    )
    documents.push({ name:'Business Cards', qty:1, weight:0.1, packed:false, bag:'carry' })
  } else if (tripType === 'Beach') {
    clothing.push(
      { name:'Swimsuit', qty:2, weight:0.3, packed:false, bag:'main' },
      { name:'Shorts', qty:Math.min(days, 5), weight:0.4, packed:false, bag:'main' },
      { name:'T-Shirts', qty:shirts, weight:0.5, packed:false, bag:'main' },
      { name:'Cover-Up', qty:1, weight:0.3, packed:false, bag:'main' },
      { name:'Light Dress / Linen Shirt', qty:2, weight:0.3, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
      { name:'Socks', qty:Math.ceil(socks / 2), weight:0.2, packed:false, bag:'main' },
    )
    footwear.push(
      { name:'Sandals', qty:1, weight:1.0, packed:false, bag:'main' },
      { name:'Flip Flops', qty:1, weight:0.5, packed:false, bag:'main' },
      { name:'Sneakers', qty:1, weight:2.0, packed:false, bag:'main' },
    )
    toiletries.push(
      { name:'Sunscreen SPF 50', qty:2, weight:0.6, packed:false, bag:'main' },
      { name:'After-Sun Lotion', qty:1, weight:0.5, packed:false, bag:'main' },
    )
    health.push({ name:'Bug Spray', qty:1, weight:0.3, packed:false, bag:'main' })
  } else if (tripType === 'Adventure') {
    clothing.push(
      { name:'Moisture-Wicking Shirts', qty:Math.min(shirts, 5), weight:0.4, packed:false, bag:'main' },
      { name:'Hiking Pants', qty:Math.min(Math.ceil(days / 2), pantCap), weight:0.8, packed:false, bag:'main' },
      { name:'Shorts', qty:Math.min(Math.ceil(days / 2), 3), weight:0.4, packed:false, bag:'main' },
      { name:'Thermal Base Layer', qty:1, weight:0.6, packed:false, bag:'main' },
      { name:'Rain Jacket', qty:1, weight:1.0, packed:false, bag:'main' },
      { name:'Fleece', qty:1, weight:1.2, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
      { name:'Wool Socks', qty:Math.min(socks, 6), weight:0.3, packed:false, bag:'main' },
    )
    footwear.push(
      { name:'Hiking Boots', qty:1, weight:3.0, packed:false, bag:'main' },
      { name:'Camp Sandals', qty:1, weight:0.8, packed:false, bag:'main' },
    )
    health.push(
      { name:'Blister Bandages', qty:1, weight:0.1, packed:false, bag:'carry' },
      { name:'Bug Spray', qty:1, weight:0.3, packed:false, bag:'main' },
      { name:'Sunscreen', qty:1, weight:0.5, packed:false, bag:'main' },
    )
  } else if (tripType === 'Backpacking') {
    clothing.push(
      { name:'T-Shirts', qty:Math.min(shirts, 4), weight:0.5, packed:false, bag:'main' },
      { name:'Pants', qty:2, weight:1.0, packed:false, bag:'main' },
      { name:'Shorts', qty:2, weight:0.4, packed:false, bag:'main' },
      { name:'Underwear', qty:Math.min(undies, 5), weight:0.2, packed:false, bag:'main' },
      { name:'Socks', qty:Math.min(socks, 5), weight:0.2, packed:false, bag:'main' },
      { name:'Light Jacket', qty:1, weight:1.0, packed:false, bag:'main' },
    )
    footwear.push(
      { name:'Sneakers', qty:1, weight:2.0, packed:false, bag:'main' },
      { name:'Flip Flops', qty:1, weight:0.5, packed:false, bag:'main' },
    )
  } else if (tripType === 'Family') {
    clothing.push(
      { name:'T-Shirts', qty:shirts, weight:0.5, packed:false, bag:'main' },
      { name:'Pants / Jeans', qty:Math.min(Math.ceil(days / 2), pantCap), weight:1.2, packed:false, bag:'main' },
      { name:'Shorts', qty:Math.min(Math.ceil(days / 2), 3), weight:0.4, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
      { name:'Socks', qty:socks, weight:0.2, packed:false, bag:'main' },
    )
    footwear.push(
      { name:'Sneakers', qty:1, weight:2.0, packed:false, bag:'main' },
      { name:'Sandals', qty:1, weight:1.0, packed:false, bag:'main' },
    )
    health.push(
      { name:"Children's Medication", qty:1, weight:0.3, packed:false, bag:'carry' },
      { name:'Sunscreen', qty:2, weight:0.5, packed:false, bag:'main' },
    )
  } else {
    // Leisure
    clothing.push(
      { name:'T-Shirts', qty:shirts, weight:0.5, packed:false, bag:'main' },
      { name:'Pants / Jeans', qty:Math.min(Math.ceil(days / 2), pantCap), weight:1.2, packed:false, bag:'main' },
      { name:'Shorts', qty:Math.min(Math.ceil(days / 2), 3), weight:0.4, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
      { name:'Socks', qty:socks, weight:0.2, packed:false, bag:'main' },
    )
    footwear.push(
      { name:'Sneakers', qty:1, weight:2.0, packed:false, bag:'main' },
      { name:'Sandals', qty:1, weight:1.0, packed:false, bag:'main' },
    )
  }

  // Climate additions
  if (climate === 'tropical') {
    if (!toiletries.find(i => i.name.includes('Sunscreen')))
      toiletries.push({ name:'Sunscreen SPF 50', qty:2, weight:0.5, packed:false, bag:'main' })
    health.push({ name:'Malaria Prevention', qty:1, weight:0.1, packed:false, bag:'carry' })
    if (!clothing.find(i => i.name === 'Swimsuit'))
      clothing.push({ name:'Swimsuit', qty:1, weight:0.3, packed:false, bag:'main' })
  } else if (climate === 'cold') {
    clothing.push(
      { name:'Heavy Winter Coat', qty:1, weight:3.5, packed:false, bag:'main' },
      { name:'Thermal Base Layers', qty:2, weight:0.6, packed:false, bag:'main' },
      { name:'Gloves', qty:1, weight:0.3, packed:false, bag:'main' },
      { name:'Scarf', qty:1, weight:0.4, packed:false, bag:'main' },
      { name:'Warm Hat', qty:1, weight:0.2, packed:false, bag:'main' },
    )
    if (!footwear.find(i => i.name.toLowerCase().includes('boot')))
      footwear.push({ name:'Insulated Boots', qty:1, weight:3.0, packed:false, bag:'main' })
  } else if (climate === 'desert') {
    toiletries.push({ name:'High-SPF Sunscreen', qty:2, weight:0.6, packed:false, bag:'main' })
    clothing.push(
      { name:'Lightweight Long-Sleeve', qty:2, weight:0.4, packed:false, bag:'main' },
      { name:'Sun Hat', qty:1, weight:0.3, packed:false, bag:'main' },
    )
    health.push({ name:'Electrolyte Packets', qty:6, weight:0.1, packed:false, bag:'carry' })
  } else if (climate === 'warm') {
    toiletries.push({ name:'Sunscreen SPF 30', qty:1, weight:0.5, packed:false, bag:'main' })
    clothing.push({ name:'Light Jacket / Cardigan', qty:1, weight:0.8, packed:false, bag:'main' })
  } else {
    clothing.push({ name:'Light Jacket', qty:1, weight:1.5, packed:false, bag:'main' })
  }

  return {
    items: { Clothing: clothing, Footwear: footwear, Toiletries: toiletries, Electronics: electronics, Documents: documents, Health: health },
    laundryNote: needsLaundryNote
  }
}

const WEATHER_CODES = {
  0:'☀️ Clear', 1:'🌤 Mostly Clear', 2:'⛅ Partly Cloudy', 3:'☁️ Overcast',
  45:'🌫 Foggy', 48:'🌫 Foggy',
  51:'🌦 Drizzle', 53:'🌦 Drizzle', 55:'🌦 Drizzle',
  61:'🌧 Light Rain', 63:'🌧 Rain', 65:'🌧 Heavy Rain',
  71:'❄️ Light Snow', 73:'❄️ Snow', 75:'❄️ Heavy Snow', 77:'❄️ Snow Grains',
  80:'🌦 Showers', 81:'🌦 Showers', 82:'⛈ Heavy Showers',
  85:'❄️ Snow Showers', 86:'❄️ Heavy Snow Showers',
  95:'⛈ Thunderstorm', 96:'⛈ Thunderstorm', 99:'⛈ Thunderstorm',
}

function getWeatherCode(code) {
  return WEATHER_CODES[code] || '🌡 Unknown'
}

function getPackingTip(avgHigh, rainDays, snowDays) {
  if (avgHigh < 32) return `🥶 Freezing — heavy coat, thermals & waterproof boots essential`
  if (avgHigh < 45 && (rainDays > 0 || snowDays > 0)) return `🧥 Very cold & wet — waterproof coat, warm layers, boots`
  if (avgHigh < 45) return `🧥 Very cold — heavy coat & thermal layers`
  if (avgHigh < 60 && rainDays > 1) return `🌂 Cool & rainy — rain jacket & layers`
  if (avgHigh < 60) return `🧣 Cool — light jacket or sweater`
  if (avgHigh < 75 && rainDays > 2) return `🌂 Mild but rainy — pack a rain jacket`
  if (avgHigh < 75) return `👕 Comfortable — light layers work well`
  if (avgHigh >= 90) return `🕶 Very hot — lightweight clothes, sunscreen & hydration`
  if (rainDays > 2) return `☀️🌧 Warm & showery — breathable clothes + light rain layer`
  return `☀️ Warm & pleasant — light clothing`
}

// AI keyword knowledge base
const AI_KB = [
  { keys:['rain','rainy','raining','wet','waterproof','drizzle','umbrella','monsoon','shower','precipitation'], ans:`For rainy destinations, pack a compact packable rain jacket — much lighter than an umbrella. Waterproof shoes or a waterproofing spray for your regular shoes also help. Stick to quick-dry fabrics and bring a few dry bags to protect electronics. A small travel umbrella is still handy for light drizzle in cities.` },
  { keys:['baggage fee','checked bag','avoid fee','airline fee','overweight','luggage fee','bag fee','excess baggage','luggage cost','checked luggage'], ans:`To avoid baggage fees: check your credit card — many travel cards include free checked bags. Pack in a personal item + carry-on instead of checking. Wear your heaviest shoes and jacket on the plane. Use soft-sided bags which squeeze into overhead bins easier. Airlines like Southwest still offer free checked bags, while Spirit and Frontier charge the most.` },
  { keys:['tsa','liquid','3-1-1','security','airport','quart','3.4 oz','100ml','gel','aerosol','x-ray','screening','security check'], ans:`TSA 3-1-1 rule: all liquids, gels, and aerosols must be 3.4 oz (100ml) or less, all fitting in ONE quart-sized clear zip-lock bag, with ONE bag per passenger. This includes shampoo, toothpaste, sunscreen, and hand sanitizer. Prescription medications are exempt. Pro tip: buy solid toiletries (shampoo bars, solid deodorant) to skip the liquid limit entirely.` },
  { keys:['packing cube','cube','organizer','organize','compression','compression bag','rolling bag'], ans:`Packing cubes are absolutely worth it. They compress clothing to save 20–30% space, keep your bag organized, make unpacking at your hotel take under 2 minutes, and help separate clean from dirty clothes. Use one cube per category: shirts, bottoms, underwear and socks. Compression cubes are even better for bulky items like hoodies.` },
  { keys:['beach','swimsuit','swim','tropical','sunscreen','sand','resort','snorkel','ocean','sea','pool'], ans:`Beach trip essentials: 2+ swimsuits (so one dries while you wear the other), SPF 50+ sunscreen (buy extra — you'll use more than you think), after-sun aloe vera, lightweight cover-up, flip flops, a mesh beach bag, and a waterproof phone pouch. Pack light on clothes — you'll be in a swimsuit most of the day.` },
  { keys:['wrinkle','crease','fold','iron','steamer','press','creased','crumple'], ans:`To minimize wrinkles: roll clothes instead of folding — especially t-shirts and casual wear. Pack dress shirts in dry-cleaning bags — they slide and don't crease. Hang wrinkled clothes in the bathroom while you shower — steam relaxes fabric. Bring a small travel steamer if wrinkles are a serious concern for business trips.` },
  { keys:['carry on','carry-on','overhead bin','one bag','personal item','cabin bag','hand luggage'], ans:`One-bag carry-on strategy: use a 40L backpack or small roller (max ~22x14x9 inches for most US airlines). Pack 4-5 tops, 2-3 bottoms, 5-6 underwear and socks, one versatile shoe worn on the plane. Roll everything, use packing cubes to compress, wear your bulkiest outfit on travel day, and stick to solid toiletries. Most people overpack by 40% — lay everything out, then put half back.` },
  { keys:['cold','winter','freeze','freezing','snow','ski','alpine','snowboard','blizzard','icy','frost','arctic','glacier'], ans:`Cold weather essentials: thermal base layers (top + bottom), a quality mid-layer fleece, a windproof and waterproof outer shell, insulated boots, wool socks (bring more than you think), gloves, a warm hat, and a neck gaiter. The layer system is key — base wicks moisture, mid insulates, outer blocks wind. Merino wool is excellent: warm, odor-resistant, and can be worn multiple days.` },
  { keys:['business','suit','formal','professional','conference','meeting','corporate','work trip','client','office'], ans:`Business travel tips: pack suits in a garment bag or use the bundle wrap method. Bring a portable steamer. Stick to a neutral color palette so everything mixes and matches — one suit can work for multiple meetings with different shirt and tie combos. Always keep your laptop, chargers, and important documents in your carry-on. A carry-on with a dedicated laptop sleeve saves time at security.` },
  { keys:['medication','medicine','prescription','pharmacy','pill','health','drugs','tablet','inhaler','epipen'], ans:`Keep all prescriptions in original labeled containers. Carry medications in your carry-on — never check them. Bring more than you need (extra week supply) in case of travel delays. TSA allows prescription medications over 3.4 oz in liquid form — just declare them. For international travel, research what medications are restricted at your destination — some common drugs are controlled substances abroad.` },
  { keys:['electronics','tech','gadget','charger','adapter','plug','voltage','outlet','power bank','laptop','tablet','device'], ans:`Electronics checklist: universal power adapter (essential internationally), phone charger, portable battery pack (10,000+ mAh), laptop and charger if needed, earbuds, e-reader. Keep all electronics and chargers in your carry-on — lithium batteries are prohibited in checked bags by most airlines. Check the voltage and plug type for your destination before you go.` },
  { keys:['long trip','month','extended','weeks','long stay','laundry','washing','wash clothes','laundromat','hostel laundry'], ans:`For extended trips (10+ days), pack for about a week and plan to do laundry. Most hotels and Airbnbs have laundry facilities, and laundromats are everywhere globally. 7 shirts, 4-5 pants, and 7-8 underwear and socks is genuinely enough for a month — overpacking creates a heavier bag and more stress. You'll thank yourself later.` },
  { keys:['light','minimal','minimalist','less','smaller bag','one bag','ultralight','pack less'], ans:`Minimalist packing formula: 5 tops, 2-3 bottoms (versatile, mix-and-match), 5-6 underwear, 4-5 socks, 1 pair of all-purpose shoes worn on the plane, 1 light jacket, travel-size solid toiletries. The trick: choose a color palette (navy, white, grey) so every piece works together. You can hand-wash clothes every few days to extend your wardrobe significantly.` },
  { keys:['jet lag','jetlag','time zone','time difference','adjust','sleep schedule','tired after flying','fatigue','circadian'], ans:`Beat jet lag: adjust your sleep schedule 2–3 days before departure by shifting bedtime toward your destination's timezone. Stay hydrated on the plane, avoid alcohol, and get natural light as soon as you land. Apps like Timeshifter are excellent for long-haul trips. For eastward travel, melatonin helps your body shift earlier. Stay up until local bedtime on arrival day — it's tough but resets your clock fastest.` },
  { keys:['passport','visa','entry','permit','id','identification','expire','renewal','tourist visa','immigration','border crossing'], ans:`Passport tips: ensure your passport is valid for at least 6 months beyond your return date — many countries require this. Apply for visas well in advance; processing times vary from 1 day to several weeks. Carry a photocopy of your passport stored separately from the original. Some destinations (like the EU for US citizens) allow stays up to 90 days visa-free. Check visa requirements at your destination's official immigration website.` },
  { keys:['hotel','accommodation','airbnb','hostel','resort','stay','lodging','check in','check out','booking'], ans:`Smart accommodation packing: always check your hotel's amenities before packing — most hotels provide shampoo, conditioner, and hairdryers, saving you bag space. Pack a power strip or travel extension cord (single unit, no surge protector, for your room). A door stopper adds extra security in budget hotels. Bring a sleep mask and earplugs for unfamiliar environments. Keep your itinerary and confirmation numbers in your carry-on.` },
  { keys:['camera','photo','photography','lens','gear','shoot','picture','dslr','mirrorless','gopro','drone','shoot'], ans:`Photography travel tips: bring extra memory cards and a backup battery — you can never have too many. A lightweight travel tripod or GorillaPod is worth the space. Lens wipes and a microfiber cloth keep gear clean. Protect your camera in a padded sleeve inside your bag. For checked luggage, put your camera in your carry-on — you don't want it in the hold. A peak design strap is excellent for comfort all day.` },
  { keys:['money','cash','currency','atm','exchange','exchange rate','budget','cheap','afford','save money','cost','spending','wallet','foreign currency'], ans:`Money tips for travel: notify your bank before going abroad to avoid card freezes. Use ATMs at your destination for better exchange rates than airport currency booths. Keep some local cash for small vendors and taxis. A travel card like Wise or Charles Schwab refunds ATM fees and uses mid-market exchange rates. Keep emergency cash in a hidden location in your bag separate from your wallet.` },
  { keys:['insurance','travel insurance','cancel','trip protection','medical abroad','coverage','claim','emergency','evacuation'], ans:`Travel insurance is worth it for any trip over $1,000 or international travel. Look for plans covering trip cancellation, medical emergencies, and evacuation. Medical evacuation alone can cost $50,000+ without insurance. Compare plans on InsureMyTrip.com. Credit cards like Chase Sapphire often include decent trip protection — check your card benefits before buying a separate policy.` },
  { keys:['kids','children','baby','toddler','stroller','family','child','infant','with kids','traveling with kids'], ans:`Packing with kids: bring double what you think you need for babies and toddlers — spills happen constantly. Snacks, a tablet loaded with offline content, and noise-cancelling headphones are lifesavers on long flights. Pack a change of clothes in your carry-on for both kids and yourself. Collapsible strollers are worth the investment. Check your airline's policy on car seats — many allow them as a free checked item.` },
  { keys:['solo','alone','by myself','one person','traveling alone','solo travel','single traveler'], ans:`Solo travel tips: always share your itinerary with someone back home. Use a money belt or hidden pouch for passport and emergency cash. Book accommodations with good reviews for solo travelers — hostels have excellent common areas for meeting people. Stay in central locations to minimize late-night travel. Trust your instincts and don't be afraid to change plans. Solo travel is incredibly rewarding — you move at your own pace.` },
  { keys:['cruise','ship','sailing','sea','ocean cruise','cruise ship','port','port day'], ans:`Cruise packing tips: formal nights are real — check your cruise line's dress code. Magnetic hooks are genius for cruise cabin walls. Pack motion sickness patches or Sea-Bands just in case. Leave room in your bag for port-day purchases. Bring a reusable water bottle for port excursions. A small backpack for shore days is essential. Don't pack more than you can comfortably carry off the ship on port days.` },
  { keys:['hike','hiking','trail','trek','backpack','outdoors','camping','wilderness','national park','nature'], ans:`Hiking and outdoor packing: layer up — conditions change fast in the mountains. The ten essentials: navigation (map + compass), sun protection, insulation, illumination (headlamp), first aid, fire starter, repair tools, nutrition, hydration, and emergency shelter. Merino wool socks prevent blisters. Break in boots before the trip. Trekking poles save your knees on downhills. A lightweight emergency bivy weighs almost nothing and could save your life.` },
  { keys:['food','allergy','diet','vegan','vegetarian','gluten','halal','kosher','dietary','restriction','nut allergy'], ans:`Traveling with dietary restrictions: research your destination's food culture in advance — some places have very limited vegan or gluten-free options. Carry allergy cards translated into the local language (TripLingo app helps). Pack backup snacks like protein bars, nuts, or jerky. Apps like HappyCow find vegan restaurants worldwide. Inform airlines of dietary needs at least 24 hours before departure for special meals.` },
  { keys:['lost luggage','missing bag','delayed luggage','airline lost','baggage claim','missing suitcase'], ans:`If luggage is lost: report it immediately at the airline's baggage claim counter before leaving the airport — don't wait. Get a reference number and keep it. Airlines are required to compensate for delayed bags; keep receipts for essential purchases. Take photos of your bag and its contents before travel. Pack essentials (medication, valuables, one change of clothes) in your carry-on so a lost bag isn't a crisis. Most "lost" bags are just delayed and arrive within 48 hours.` },
  { keys:['roll','rolling method','rolling clothes','bundle','fold vs roll'], ans:`Roll your clothes — it genuinely works. Rolling t-shirts, jeans, and casual wear saves 20-30% more space than folding and reduces wrinkles. For dress shirts and structured garments, use the bundle wrap method or dry-cleaning bags. Socks go inside shoes. Underwear fills gaps. Heavy items at the bottom (near wheels), lightest on top. Pack in reverse order of when you'll need things — first things out on top.` },
  { keys:['shoes','footwear','boots','sneakers','heels','sandals','how many shoes'], ans:`Shoe packing rule: maximum 3 pairs and wear the bulkiest on the plane. One pair for walking (comfortable sneakers or walking shoes), one for nights out or smarter occasions, and flip flops or sandals if going somewhere warm. Shoes take up disproportionate space — choose versatile pairs that work for multiple occasions. Stuff socks inside shoes to maintain shape and save space.` },
  { keys:['what to wear on plane','flight outfit','what to wear flying','airplane outfit','comfortable flight'], ans:`Best flight outfit: comfort is king. Wear layers — planes get cold. Compression socks reduce swelling on long flights. Slip-on shoes save time at security. A scarf doubles as a blanket. Avoid tight waistbands — cabin pressure causes bloating. Wear your heaviest/bulkiest items to reduce bag weight. Bring a clean outfit in your carry-on to change into — arriving fresh makes a huge difference.` },
]

function getAIResponse(msg, context) {
  const q = msg.toLowerCase()

  // Try full phrase matching first
  for (const entry of AI_KB) {
    if (entry.keys.some(k => q.includes(k))) return entry.ans
  }

  // Try word-level fuzzy matching — split query into words and score each entry
  const words = q.split(/\s+/).filter(w => w.length > 3)
  let bestEntry = null, bestScore = 0
  for (const entry of AI_KB) {
    const score = words.reduce((s, w) => s + entry.keys.filter(k => k.includes(w) || w.includes(k)).length, 0)
    if (score > bestScore) { bestScore = score; bestEntry = entry }
  }
  if (bestScore >= 1 && bestEntry) return bestEntry.ans

  if (q.includes('what should i pack') || q.includes('what to pack') || q.includes('packing list')) {
    const dest = context.destination || 'your destination'
    const tt = context.tripType || 'leisure'
    return `For a ${tt.toLowerCase()} trip to ${dest}, your generated list covers the essentials. Key priorities: right clothing for the climate, comfortable walking shoes, all documents in your carry-on, and a portable charger. Anything specific you'd like advice on?`
  }
  if (q.includes('how many') || q.includes('how much') || q.includes('quantity') || q.includes('how long')) {
    return `Rule of thumb: pack for 7 days max and plan to do laundry if going longer. One outfit per day up to 5-6 days, then you're overpacking. For underwear and socks, pack one extra beyond what you need. Two pairs of shoes maximum — wear the heavier pair on the plane.`
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help') || q.includes('start')) {
    return `Hey! I'm your packing assistant. Ask me about TSA rules, avoiding baggage fees, cold weather packing, jet lag, travel insurance, photography gear, solo travel, traveling with kids, food restrictions — or anything else travel-related.`
  }
  if (q.includes('thank') || q.includes('thanks') || q.includes('great') || q.includes('awesome')) {
    return `Happy to help! If you think of anything else — TSA rules, what to wear on the plane, how to beat jet lag — just ask.`
  }

  // Catch-all: suggest relevant topics based on partial context
  const dest = context.destination
  const tt = context.tripType
  if (dest || tt) {
    return `I'm not sure about that specific question, but for your ${tt ? tt.toLowerCase() + ' trip' : 'trip'}${dest ? ' to ' + dest : ''} — I can help with packing lists, TSA rules, baggage fees, weather gear, laundry tips, travel insurance, jet lag, or what to wear on the plane. What would be most useful?`
  }
  return `I can help with: TSA liquid rules, avoiding baggage fees, cold or hot weather packing, carry-on strategy, business travel, long trips and laundry, jet lag, travel insurance, kids, solo travel, and more. What do you want to know?`
}

const climateLabels = {
  tropical:'Tropical', cold:'Cold',
  warm:'Warm & Mediterranean', desert:'Arid / Desert', temperate:'Temperate',
}

function mergePremiumItems(allItemSets) {
  const merged = {}
  for (const itemsObj of allItemSets) {
    for (const [cat, catItems] of Object.entries(itemsObj)) {
      if (!merged[cat]) merged[cat] = []
      for (const item of catItems) {
        const existing = merged[cat].find(i => i.name === item.name)
        if (existing) {
          existing.qty = Math.max(existing.qty, item.qty)
        } else {
          merged[cat].push({ ...item })
        }
      }
    }
  }
  return merged
}

export default function PackPerfect() {
  const [dark, setDark] = useState(false)
  const TABS = ['Packing List','Visual Aid','AI Assistant','Settings','Premium']
  const [activeTab, setActiveTab] = useState('Packing List')

  const handleTabClick = (tab) => {
    if (tab === 'Premium' && !premiumUnlocked) { setShowPremiumModal(true); return }
    setActiveTab(tab)
  }
  const [destInput, setDestInput] = useState('')
  const [destination, setDestination] = useState('')
  const [climate, setClimate] = useState('temperate')
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug] = useState(false)
  const [tripType, setTripType] = useState('Leisure')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [listGenerated, setListGenerated] = useState(false)
  const [items, setItems] = useState({})
  const [laundryNote, setLaundryNote] = useState(false)
  const [weightLimit] = useState(50) // main bag only
  const [customItem, setCustomItem] = useState('')
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState('')
  const [savedLists, setSavedLists] = useState([])
  const [chatMessages, setChatMessages] = useState([{ role:'assistant', content:"Hey! I'm your packing assistant. Ask me about TSA rules, baggage fees, packing for cold weather, long trips, and more." }])
  const [chatInput, setChatInput] = useState('')
  const [chatTyping, setChatTyping] = useState(false)
  const [profile, setProfile] = useState({ name:'', homeCity:'', travelStyle:'Average', frequentFlyer:'Sometimes' })
  const chatEndRef = useRef(null)
  const destRef = useRef(null)

  // Premium state
  const [premiumUnlocked, setPremiumUnlocked] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [premiumPasswordInput, setPremiumPasswordInput] = useState('')
  const [premiumPasswordError, setPremiumPasswordError] = useState(false)
  const [numLocations, setNumLocations] = useState(2)
  const [premiumLegs, setPremiumLegs] = useState(
    Array.from({length:5}, () => ({ destInput:'', destination:'', climate:'temperate', startDate:'', endDate:'', suggestions:[], showSug:false }))
  )
  const [premiumTripType, setPremiumTripType] = useState('Leisure')
  const [premiumGenerated, setPremiumGenerated] = useState(false)
  const [premiumItems, setPremiumItems] = useState({})
  const [premiumLaundryNote, setPremiumLaundryNote] = useState(false)
  const [premiumWeathers, setPremiumWeathers] = useState([])
  const [premiumWeatherLoading, setPremiumWeatherLoading] = useState(false)
  const [premiumWeatherErrors, setPremiumWeatherErrors] = useState([])
  const [premiumVisImage, setPremiumVisImage] = useState(IMG_NORM)
  const [premiumCustomItem, setPremiumCustomItem] = useState('')
  const premiumLegRefs = useRef([])
  const [selectedDayIdx, setSelectedDayIdx] = useState(null)
  const [premiumSelectedDay, setPremiumSelectedDay] = useState(null) // { legIdx, dayIdx }

  useEffect(() => {
    try {
      const l = localStorage.getItem('pp_lists'); if (l) setSavedLists(JSON.parse(l))
      const d = localStorage.getItem('pp_dark'); if (d !== null) setDark(d === '1')
      const p = localStorage.getItem('pp_profile'); if (p) setProfile(JSON.parse(p))
    } catch(e) {}
  }, [])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:'smooth' }) }, [chatMessages, chatTyping])

  useEffect(() => {
    const h = (e) => { if (destRef.current && !destRef.current.contains(e.target)) setShowSug(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  const toggleDark = () => { const v = !dark; setDark(v); try{ localStorage.setItem('pp_dark', v ? '1' : '0') }catch(e){} }
  const saveProfile = (updates) => { const u = { ...profile, ...updates }; setProfile(u); try{ localStorage.setItem('pp_profile', JSON.stringify(u)) }catch(e){} }

  const handleDestInput = (v) => {
    setDestInput(v)
    if (v.length < 2) { setSuggestions([]); setShowSug(false); return }
    const m = DESTINATIONS.filter(d => d.toLowerCase().includes(v.toLowerCase())).slice(0, 8)
    setSuggestions(m); setShowSug(m.length > 0)
  }

  const selectDest = (d) => {
    setDestInput(d); setDestination(d)
    const c = classifyClimate(d); setClimate(c)
    const suggested = suggestTripTypes(c)
    if (!suggested.includes(tripType)) setTripType(suggested[0])
    setShowSug(false)
  }

  const getDays = () => {
    if (!startDate || !endDate) return 5
    return Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000))
  }

  const allItems = Object.values(items).flat()
  const mainItems = allItems.filter(i => i.bag === 'main')
  const carryItems = allItems.filter(i => i.bag === 'carry')
  const mainWeight = mainItems.reduce((s, i) => s + i.weight * i.qty, 0)
  const carryWeight = carryItems.reduce((s, i) => s + i.weight * i.qty, 0)
  const packedCount = allItems.filter(i => i.packed).length
  const mainOverLimit = mainWeight > weightLimit

  const togglePacked = (cat, idx) => setItems(p => { const u = {...p}; u[cat] = [...u[cat]]; u[cat][idx] = {...u[cat][idx], packed: !u[cat][idx].packed}; return u })
  const toggleBag = (cat, idx) => setItems(p => { const u = {...p}; u[cat] = [...u[cat]]; u[cat][idx] = {...u[cat][idx], bag: u[cat][idx].bag === 'main' ? 'carry' : 'main'}; return u })

  const addCustomItem = () => {
    if (!customItem.trim()) return
    setItems(p => ({ ...p, Clothing: [...(p.Clothing || []), { name: customItem, qty:1, weight:0.5, packed:false, bag:'main' }] }))
    setCustomItem('')
  }

  const saveList = () => {
    if (!destination) return
    const n = { destination, tripType, startDate, endDate, items, date: new Date().toLocaleDateString() }
    const u = [n, ...savedLists.slice(0, 9)]
    setSavedLists(u)
    try { localStorage.setItem('pp_lists', JSON.stringify(u)) } catch(e) {}
    alert('List saved!')
  }

  const fetchWeather = async (dest, start, end) => {
    if (!dest) return
    setWeatherLoading(true); setWeather(null); setWeatherError('')
    try {
      const city = dest.split(',')[0].trim()
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
      const geoData = await geoRes.json()
      if (!geoData.results?.length) { setWeatherError(`Couldn't find location: ${dest}`); setWeatherLoading(false); return }
      const { latitude, longitude, name, country } = geoData.results[0]

      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      let startD = start || todayStr
      let endD = end
      if (!endD) { const t = new Date(today); t.setDate(t.getDate() + 6); endD = t.toISOString().split('T')[0] }

      // Clamp: can't go before today, max 16 days forecast (compare as strings — avoids UTC-vs-local issues)
      const maxDate = new Date(today); maxDate.setDate(today.getDate() + 15)
      const maxDateStr = maxDate.toISOString().split('T')[0]
      if (startD < todayStr) startD = todayStr
      if (endD > maxDateStr) endD = maxDateStr

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&temperature_unit=fahrenheit&timezone=auto&start_date=${startD}&end_date=${endD}`
      const wRes = await fetch(url)
      const wd = await wRes.json()
      if (!wd.daily?.time?.length) { setWeatherError('No forecast available for these dates.'); setWeatherLoading(false); return }
      setSelectedDayIdx(null)
      setWeather({ city: name, country, ...wd })
    } catch(e) {
      setWeatherError(`Weather unavailable: ${e.message}`)
    }
    setWeatherLoading(false)
  }

  // Premium helpers
  const handlePremiumUnlock = () => {
    if (premiumPasswordInput === 'Incubator') {
      setPremiumUnlocked(true); setShowPremiumModal(false); setPremiumPasswordInput(''); setPremiumPasswordError(false); setActiveTab('Premium')
    } else {
      setPremiumPasswordError(true)
    }
  }

  const updatePremiumLeg = (idx, updates) => {
    setPremiumLegs(prev => prev.map((leg, i) => i === idx ? { ...leg, ...updates } : leg))
  }

  const handlePremiumDestInput = (idx, v) => {
    const m = v.length >= 2 ? DESTINATIONS.filter(d => d.toLowerCase().includes(v.toLowerCase())).slice(0, 8) : []
    updatePremiumLeg(idx, { destInput: v, suggestions: m, showSug: m.length > 0 })
  }

  const selectPremiumDest = (idx, d) => {
    const c = classifyClimate(d)
    updatePremiumLeg(idx, { destInput: d, destination: d, climate: c, showSug: false })
  }

  const getLegDays = (leg) => {
    if (!leg.startDate || !leg.endDate) return 3
    return Math.max(1, Math.ceil((new Date(leg.endDate) - new Date(leg.startDate)) / 86400000))
  }

  const renderHourlyPanel = (weatherData, dayIdx, accentColor) => {
    if (!weatherData?.hourly?.time?.length) return null
    const baseIdx = dayIdx * 24
    const hours = [0, 3, 6, 9, 12, 15, 18, 21].map(h => {
      const i = baseIdx + h
      const timeStr = weatherData.hourly.time[i] || ''
      const hourNum = parseInt(timeStr.split('T')[1]?.split(':')[0] ?? '0')
      const label = hourNum === 0 ? '12am' : hourNum < 12 ? `${hourNum}am` : hourNum === 12 ? '12pm' : `${hourNum - 12}pm`
      const wc = getWeatherCode(weatherData.hourly.weather_code?.[i] ?? 0)
      return {
        label,
        icon: wc.split(' ')[0],
        condition: wc.split(' ').slice(1).join(' '),
        temp: Math.round(weatherData.hourly.temperature_2m?.[i] ?? 0),
        precip: weatherData.hourly.precipitation_probability?.[i] ?? 0,
        wind: Math.round(weatherData.hourly.wind_speed_10m?.[i] ?? 0),
      }
    })
    const dayLabel = weatherData.daily.time[dayIdx]
      ? new Date(weatherData.daily.time[dayIdx] + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })
      : ''
    return (
      <div style={{ marginTop:'10px', padding:'14px', background:t.inputBg, borderRadius:'10px', border:`1px solid ${t.border}` }}>
        <div style={{ fontSize:'11px', fontWeight:'600', color:accentColor, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'10px' }}>
          Hourly — {dayLabel}
        </div>
        <div style={{ display:'flex', gap:'7px', overflowX:'auto', paddingBottom:'4px' }}>
          {hours.map((h, i) => (
            <div key={i} style={{ flexShrink:0, textAlign:'center', background:t.surface, border:`1px solid ${t.border}`, borderRadius:'8px', padding:'10px 8px', minWidth:'62px' }}>
              <div style={{ fontSize:'11px', color:t.textMuted, fontWeight:'500', marginBottom:'5px' }}>{h.label}</div>
              <div style={{ fontSize:'18px', marginBottom:'4px' }}>{h.icon}</div>
              <div style={{ fontSize:'14px', fontWeight:'600', color:t.text, fontFamily:"'JetBrains Mono',monospace" }}>{h.temp}°F</div>
              <div style={{ fontSize:'10px', color:accentColor, marginTop:'4px' }}>{h.precip}% 💧</div>
              <div style={{ fontSize:'10px', color:t.textMuted, marginTop:'2px' }}>{h.wind} mph</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const fetchPremiumWeather = async (legs) => {
    setPremiumWeatherLoading(true); setPremiumWeathers([]); setPremiumWeatherErrors([])
    const results = [], errors = []
    for (const leg of legs) {
      if (!leg.destination) { results.push(null); errors.push(''); continue }
      try {
        const city = leg.destination.split(',')[0].trim()
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
        const geoData = await geoRes.json()
        if (!geoData.results?.length) { results.push(null); errors.push(`Couldn't find: ${leg.destination}`); continue }
        const { latitude, longitude, name, country } = geoData.results[0]
        const today = new Date(); const todayStr = today.toISOString().split('T')[0]
        let startD = leg.startDate || todayStr
        let endD = leg.endDate
        if (!endD) { const t2 = new Date(today); t2.setDate(t2.getDate() + 6); endD = t2.toISOString().split('T')[0] }
        const maxDate = new Date(today); maxDate.setDate(today.getDate() + 15); const maxDateStr = maxDate.toISOString().split('T')[0]
        if (startD < todayStr) startD = todayStr
        if (endD > maxDateStr) endD = maxDateStr
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&temperature_unit=fahrenheit&timezone=auto&start_date=${startD}&end_date=${endD}`
        const wRes = await fetch(url); const wd = await wRes.json()
        if (!wd.daily?.time?.length) { results.push(null); errors.push('No forecast available.'); continue }
        results.push({ city: name, country, ...wd }); errors.push('')
      } catch(e) { results.push(null); errors.push(`Weather unavailable: ${e.message}`) }
    }
    setPremiumWeathers(results); setPremiumWeatherErrors(errors); setPremiumWeatherLoading(false)
    return results
  }

  const handlePremiumGenerate = async () => {
    const legs = premiumLegs.slice(0, numLocations)
    if (!legs.some(l => l.destination || l.destInput)) return
    const resolvedLegs = legs.map(l => ({ ...l, destination: l.destination || l.destInput, climate: l.destination ? l.climate : classifyClimate(l.destInput) }))
    const allItemSets = resolvedLegs.map(leg => generateList(premiumTripType, getLegDays(leg), leg.climate))
    const merged = mergePremiumItems(allItemSets.map(r => r.items))
    const totalDays = resolvedLegs.reduce((s, leg) => s + getLegDays(leg), 0)
    setPremiumItems(merged); setPremiumLaundryNote(totalDays > 10); setPremiumGenerated(true)
    const weatherResults = await fetchPremiumWeather(resolvedLegs)
    const validWeathers = weatherResults.filter(Boolean)
    if (validWeathers.length > 0) {
      const allTemps = validWeathers.flatMap(w => w.daily.temperature_2m_max || [])
      const overallAvg = allTemps.length > 0 ? allTemps.reduce((a,b) => a+b, 0) / allTemps.length : null
      if (overallAvg !== null) {
        if (premiumTripType === 'Business') setPremiumVisImage(IMG_BIZ)
        else if (overallAvg >= 72) setPremiumVisImage(IMG_WARM)
        else if (overallAvg < 50) setPremiumVisImage(IMG_COLD)
        else setPremiumVisImage(IMG_NORM)
      } else setPremiumVisImage(getVisualImage(resolvedLegs[0].climate, premiumTripType))
    } else {
      setPremiumVisImage(getVisualImage(resolvedLegs[0]?.climate || 'temperate', premiumTripType))
    }
  }

  const togglePremiumPacked = (cat, idx) => setPremiumItems(p => { const u={...p}; u[cat]=[...u[cat]]; u[cat][idx]={...u[cat][idx], packed:!u[cat][idx].packed}; return u })
  const togglePremiumBag = (cat, idx) => setPremiumItems(p => { const u={...p}; u[cat]=[...u[cat]]; u[cat][idx]={...u[cat][idx], bag:u[cat][idx].bag==='main'?'carry':'main'}; return u })
  const addPremiumCustomItem = () => {
    if (!premiumCustomItem.trim()) return
    setPremiumItems(p => ({ ...p, Clothing: [...(p.Clothing||[]), { name:premiumCustomItem, qty:1, weight:0.5, packed:false, bag:'main' }] }))
    setPremiumCustomItem('')
  }

  const handleGenerate = async () => {
    const dest = destination || destInput
    if (!dest) return
    setDestination(dest)
    const c = classifyClimate(dest); setClimate(c)
    const result = generateList(tripType, getDays(), c)
    setItems(result.items)
    setLaundryNote(result.laundryNote)
    setListGenerated(true)
    fetchWeather(dest, startDate, endDate)
  }

  // Typing effect for AI
  const typeMessage = (fullText) => {
    setChatTyping(true)
    let i = 0
    const chunk = 3 // chars per tick
    const tick = 18 // ms per tick
    setChatMessages(prev => [...prev, { role:'assistant', content:'' }])
    const interval = setInterval(() => {
      i += chunk
      setChatMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role:'assistant', content: fullText.slice(0, i) }
        return updated
      })
      if (i >= fullText.length) {
        clearInterval(interval)
        setChatMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role:'assistant', content: fullText }
          return updated
        })
        setChatTyping(false)
      }
    }, tick)
  }

  const sendChat = (preset) => {
    const text = preset || chatInput
    if (!text?.trim() || chatTyping) return
    setChatInput('')
    setChatMessages(prev => [...prev, { role:'user', content: text }])
    setTimeout(() => {
      const resp = getAIResponse(text, { destination, tripType })
      typeMessage(resp)
    }, 300)
  }

  // Theme
  const t = {
    bg: dark ? '#080f1c' : '#f4f6f9',
    surface: dark ? '#0d1625' : '#ffffff',
    border: dark ? '#1a2d4a' : '#dde2ea',
    borderStrong: dark ? '#1e4080' : '#b0bfd4',
    text: dark ? '#e8edf5' : '#0f1929',
    textMuted: dark ? '#5a7aaa' : '#6b7fa0',
    textDim: dark ? '#2d4a6e' : '#9aacc4',
    accent: '#2563eb',
    accentDim: dark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.08)',
    inputBg: dark ? '#060c17' : '#f0f3f8',
    headerBg: dark ? '#060c17' : '#ffffff',
    pill: (active) => ({
      background: active ? '#2563eb' : 'transparent',
      color: active ? '#ffffff' : (dark ? '#5a7aaa' : '#6b7fa0'),
      border: `1px solid ${active ? '#2563eb' : (dark ? '#1a2d4a' : '#dde2ea')}`,
    }),
  }

  const card = { background: t.surface, border: `1px solid ${t.border}`, borderRadius:'12px', padding:'22px', marginBottom:'12px' }
  const inputStyle = { width:'100%', padding:'10px 13px', background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'8px', fontSize:'14px', color:t.text, outline:'none' }
  const labelStyle = { display:'block', fontSize:'11px', fontWeight:'600', color:t.textMuted, marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.08em' }
  const btnPrimary = { background:t.accent, color:'#fff', border:'none', borderRadius:'8px', padding:'11px 20px', fontSize:'14px', fontWeight:'500', cursor:'pointer', width:'100%' }

  const availableTripTypes = destination ? suggestTripTypes(climate) : ['Leisure','Business','Beach','Adventure','Family','Backpacking']
  const visImage = getVisualImage(climate, tripType)

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    ::-webkit-scrollbar { width:4px } ::-webkit-scrollbar-thumb { background:${t.border}; border-radius:4px }
    input,select,button,textarea { font-family:'Sora',sans-serif }
    input[type=date]::-webkit-calendar-picker-indicator { filter:${dark?'invert(0.4)':'invert(0.6)'} }
    input[type=checkbox] { accent-color:#2563eb }
    .dest-sug:hover { background:${dark?'#0d1e35':'#eef2f8'} !important }
    .item-row { transition:background 120ms ease; }
    .item-row:hover { background:${dark?'#0a1523':'#f0f4fa'} !important }
    .tab-btn { transition:color 150ms ease, background 150ms ease, transform 150ms ease !important }
    .tab-btn:hover { color:${t.text} !important; transform:translateY(-1px) }
    .tab-btn:active { transform:translateY(0) scale(0.97) }
    .btn-primary { transition:transform 150ms ease, box-shadow 150ms ease, filter 150ms ease !important }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 18px rgba(37,99,235,0.32); filter:brightness(1.08) }
    .btn-primary:active { transform:translateY(0) scale(0.97); filter:brightness(0.96) }
    .btn-pill { transition:transform 120ms ease, background 120ms ease, box-shadow 120ms ease !important }
    .btn-pill:hover { transform:scale(1.05); box-shadow:0 2px 8px rgba(0,0,0,0.1) }
    .btn-pill:active { transform:scale(0.96) }
    .btn-ghost { transition:transform 150ms ease, background 150ms ease !important }
    .btn-ghost:hover { transform:translateY(-1px); background:${dark?'rgba(37,99,235,0.12)':'rgba(37,99,235,0.08)'} !important }
    .btn-ghost:active { transform:scale(0.97) }
    .btn-toggle { transition:background 200ms ease !important }
    .cursor-blink::after { content:'▋'; animation:blink 0.7s infinite; margin-left:1px }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @media (prefers-reduced-motion:reduce) { *, *::before, *::after { transition-duration:0.01ms !important; animation-duration:0.01ms !important } }
    @media (max-width:640px) {
      .pp-header { flex-wrap:wrap; height:auto !important; padding:10px 14px !important; gap:6px; }
      .pp-tabs { width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; padding-bottom:2px; justify-content:flex-start !important; }
      .pp-tabs::-webkit-scrollbar { display:none; }
      .pp-main { padding:14px 12px !important; }
      .pp-grid-2 { grid-template-columns:1fr !important; }
      .pp-tips-grid { grid-template-columns:1fr !important; }
      .pp-chat-messages { min-height:260px !important; max-height:320px !important; }
    }
  `

  return (
    <div style={{ fontFamily:"'Sora',sans-serif", minHeight:'100vh', background:t.bg, color:t.text }}>
      <style>{CSS}</style>

      {/* PREMIUM PASSWORD MODAL */}
      {showPremiumModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowPremiumModal(false); setPremiumPasswordInput(''); setPremiumPasswordError(false) } }}>
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:'18px', padding:'36px 32px', maxWidth:'380px', width:'100%', textAlign:'center' }}>
            <div style={{ fontSize:'32px', marginBottom:'10px' }}>✦</div>
            <h2 style={{ fontSize:'20px', fontWeight:'600', color:t.text, marginBottom:'6px' }}>Premium Access</h2>
            <p style={{ fontSize:'13px', color:t.textMuted, marginBottom:'26px', lineHeight:'1.6' }}>Enter the access code to unlock multi-location packing with live weather per destination</p>
            <input
              type="password"
              value={premiumPasswordInput}
              onChange={e => { setPremiumPasswordInput(e.target.value); setPremiumPasswordError(false) }}
              onKeyDown={e => e.key === 'Enter' && handlePremiumUnlock()}
              placeholder="Access code..."
              autoFocus
              style={{ ...inputStyle, marginBottom:'10px', textAlign:'center', letterSpacing:'0.2em', fontSize:'16px' }}
            />
            {premiumPasswordError && (
              <p style={{ fontSize:'12px', color:'#dc2626', marginBottom:'10px' }}>Incorrect access code. Try again.</p>
            )}
            <button className="btn-primary" onClick={handlePremiumUnlock}
              style={{ ...btnPrimary, background:'linear-gradient(135deg, #ca8a04, #d97706)', marginBottom:'10px' }}>
              Unlock Premium
            </button>
            <button onClick={() => { setShowPremiumModal(false); setPremiumPasswordInput(''); setPremiumPasswordError(false) }}
              style={{ background:'transparent', border:'none', color:t.textMuted, fontSize:'13px', cursor:'pointer', width:'100%', padding:'6px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="pp-header" style={{ background:t.headerBg, borderBottom:`1px solid ${t.border}`, padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'56px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.26 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.17 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.46-.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>
          <span style={{ fontSize:'16px', fontWeight:'600', color:t.text }}>PackPerfect</span>
          {destination && listGenerated && <span style={{ fontSize:'12px', color:t.textMuted, background:t.accentDim, padding:'2px 10px', borderRadius:'999px' }}>{destination}</span>}
        </div>
        <div className="pp-tabs" style={{ display:'flex', gap:'4px' }}>
          {TABS.map(tab => {
            const isPremium = tab === 'Premium'
            const isActive = activeTab === tab
            return (
              <button key={tab} className="tab-btn" onClick={() => handleTabClick(tab)} style={{
                padding:'6px 13px',
                border: isPremium ? `1px solid ${isActive ? '#ca8a04' : 'rgba(202,138,4,0.35)'}` : 'none',
                borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontFamily:"'Sora',sans-serif",
                background: isActive ? (isPremium ? 'rgba(202,138,4,0.12)' : t.accentDim) : 'transparent',
                color: isPremium ? (isActive ? '#ca8a04' : 'rgba(202,138,4,0.75)') : (isActive ? t.accent : t.textMuted),
                fontWeight: isActive ? '500' : '400',
                whiteSpace:'nowrap',
              }}>
                {isPremium ? (premiumUnlocked ? '✦ Premium' : '🔒 Premium') : tab}
              </button>
            )
          })}
        </div>
      </div>

      <div className="pp-main" style={{ maxWidth:'860px', margin:'0 auto', padding:'24px 20px' }}>

        {/* ── PACKING LIST ── */}
        {activeTab === 'Packing List' && (
          <div>
            <div style={{ ...card, borderColor: listGenerated ? t.border : t.borderStrong }}>
              <h2 style={{ fontSize:'18px', fontWeight:'600', color:t.text, marginBottom:'4px' }}>{listGenerated ? 'Edit Trip Details' : 'Plan Your Trip'}</h2>
              <p style={{ fontSize:'13px', color:t.textMuted, marginBottom:'18px' }}>Enter your destination and dates to generate a smart packing list</p>
              <div style={{ display:'grid', gap:'14px' }}>

                {/* Destination */}
                <div ref={destRef} style={{ position:'relative' }}>
                  <label style={labelStyle}>Destination</label>
                  <input value={destInput} onChange={e => handleDestInput(e.target.value)} onFocus={() => destInput.length >= 2 && setShowSug(true)}
                    placeholder="Search city or country..." style={inputStyle} />
                  {showSug && suggestions.length > 0 && (
                    <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:t.surface, border:`1px solid ${t.borderStrong}`, borderRadius:'8px', zIndex:200, overflow:'hidden' }}>
                      {suggestions.map(s => (
                        <div key={s} className="dest-sug" onClick={() => selectDest(s)}
                          style={{ padding:'9px 13px', cursor:'pointer', fontSize:'14px', color:t.text, borderBottom:`1px solid ${t.border}` }}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>

                {destination && (
                  <div style={{ padding:'8px 12px', background:t.accentDim, border:`1px solid ${t.accentDim}`, borderRadius:'7px', fontSize:'13px', color:t.accent }}>
                    {climateLabels[climate]} climate detected — list adjusted automatically
                  </div>
                )}

                {/* Dates */}
                <div className="pp-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div><label style={labelStyle}>Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} /></div>
                </div>

                {startDate && endDate && (
                  <div style={{ fontSize:'13px', color:t.textMuted, padding:'7px 12px', background:t.inputBg, borderRadius:'7px', border:`1px solid ${t.border}` }}>
                    {getDays()} day{getDays() !== 1 ? 's' : ''} — {tripType} trip{destination ? ` to ${destination.split(',')[0]}` : ''}
                    {getDays() > 10 && <span style={{ color:t.accent }}> · Extended trip — laundry recommended</span>}
                  </div>
                )}

                {/* Trip Type */}
                <div>
                  <label style={labelStyle}>Trip Type</label>
                  <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                    {availableTripTypes.map(ty => (
                      <button key={ty} className="btn-pill" onClick={() => setTripType(ty)} style={{
                        ...t.pill(tripType === ty), borderRadius:'999px', padding:'5px 14px',
                        fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif",
                      }}>{ty}</button>
                    ))}
                  </div>
                </div>

                {tripType === 'Business' && (
                  <div style={{ padding:'10px 13px', background:t.accentDim, border:`1px solid ${t.borderStrong}`, borderRadius:'8px', fontSize:'13px', color:t.accent }}>
                    Business trip — suits scaled to trip length, carry-on with laptop compartment recommended.
                  </div>
                )}

                <button className="btn-primary" onClick={handleGenerate} style={{ ...btnPrimary, marginTop:'4px' }}>
                  {listGenerated ? 'Regenerate List' : 'Generate Packing List'}
                </button>
              </div>
            </div>

            {listGenerated && (
              <div>
                {/* Laundry note for long trips */}
                {laundryNote && (
                  <div style={{ ...card, borderColor:'#f59e0b', background: dark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.06)', padding:'14px 18px' }}>
                    <p style={{ fontSize:'13px', color:'#f59e0b', fontWeight:'500' }}>
                      Long trip detected — list capped at ~1 week of clothing. Plan on using a washing machine or laundromat. Hotels and Airbnbs almost always have laundry, and it beats hauling a month of clothes.
                    </p>
                  </div>
                )}

                {/* Weather */}
                {weatherLoading && (
                  <div style={{ ...card, textAlign:'center', color:t.textMuted, fontSize:'13px', padding:'16px' }}>
                    Fetching forecast for {destination}...
                  </div>
                )}
                {weatherError && !weatherLoading && (
                  <div style={{ ...card, borderColor:'#dc2626' }}>
                    <p style={{ fontSize:'13px', color:'#dc2626' }}>{weatherError}</p>
                  </div>
                )}
                {weather && !weatherLoading && (() => {
                  const temps = weather.daily.temperature_2m_max || []
                  const codes = weather.daily.weather_code || []
                  const rains = weather.daily.precipitation_probability_max || []
                  const avgHigh = Math.round(temps.reduce((a,b) => a+b, 0) / temps.length)
                  const rainDays = codes.filter(c => [51,53,55,61,63,65,66,67,80,81,82].includes(c)).length
                  const snowDays = codes.filter(c => [71,73,75,77,85,86].includes(c)).length
                  const tip = getPackingTip(avgHigh, rainDays, snowDays)
                  return (
                    <div style={{ ...card, borderColor:t.borderStrong }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                        <div>
                          <div style={{ fontSize:'15px', fontWeight:'600', color:t.text }}>{weather.city}, {weather.country}</div>
                          <div style={{ fontSize:'12px', color:t.textMuted, marginTop:'2px' }}>
                            {startDate && endDate ? `${startDate} → ${endDate}` : '7-day forecast'} · Open-Meteo
                          </div>
                        </div>
                        <span style={{ fontSize:'12px', color:t.accent, background:t.accentDim, padding:'3px 10px', borderRadius:'6px', border:`1px solid ${t.borderStrong}`, flexShrink:0 }}>Live</span>
                      </div>
                      {/* Packing tip */}
                      <div style={{ padding:'9px 12px', background:t.accentDim, borderRadius:'8px', fontSize:'13px', marginBottom:'14px' }}>
                        <span style={{ color:t.accent, fontWeight:'500' }}>Avg high ~{avgHigh}°F</span>
                        {rainDays > 0 && <span style={{ color:t.textMuted }}> · {rainDays} rainy day{rainDays>1?'s':''}</span>}
                        {snowDays > 0 && <span style={{ color:t.textMuted }}> · {snowDays} snowy day{snowDays>1?'s':''}</span>}
                        <span style={{ color:t.textMuted }}> — {tip}</span>
                      </div>
                      {/* Day cards */}
                      <div style={{ fontSize:'11px', color:t.textDim, marginBottom:'8px' }}>Tap a day for hourly breakdown</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(86px, 1fr))', gap:'8px' }}>
                        {weather.daily.time.map((date, i) => {
                          const wc = getWeatherCode(codes[i])
                          const icon = wc.split(' ')[0]
                          const label = wc.split(' ').slice(1).join(' ')
                          const isToday = date === new Date().toISOString().split('T')[0]
                          const isSelected = selectedDayIdx === i
                          const high = Math.round(temps[i])
                          const low = Math.round(weather.daily.temperature_2m_min[i])
                          const rain = rains[i]
                          return (
                            <div key={i} onClick={() => setSelectedDayIdx(prev => prev === i ? null : i)}
                              style={{ background: isSelected ? t.accentDim : isToday ? t.accentDim : t.inputBg, border:`1px solid ${isSelected ? t.accent : isToday ? t.accent : t.border}`, borderRadius:'10px', padding:'11px 7px', textAlign:'center', cursor:'pointer', outline: isSelected ? `2px solid ${t.accent}` : 'none', outlineOffset:'2px' }}>
                              <div style={{ fontSize:'10px', color:t.textMuted, marginBottom:'6px', fontWeight:'500' }}>
                                {new Date(date+'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
                              </div>
                              <div style={{ fontSize:'20px', marginBottom:'6px' }}>{icon}</div>
                              <div style={{ fontSize:'15px', fontWeight:'600', color:t.text, fontFamily:"'JetBrains Mono',monospace" }}>{high}°F</div>
                              <div style={{ fontSize:'11px', color:t.textMuted, fontFamily:"'JetBrains Mono',monospace", marginTop:'1px' }}>{low}°F</div>
                              <div style={{ fontSize:'10px', color:t.accent, marginTop:'4px', fontWeight:'500' }}>{label}</div>
                              <div style={{ fontSize:'10px', color:t.textDim, marginTop:'2px' }}>{rain}% rain</div>
                            </div>
                          )
                        })}
                      </div>
                      {selectedDayIdx !== null && renderHourlyPanel(weather, selectedDayIdx, t.accent)}
                    </div>
                  )
                })()}

                {/* Weight tracker — main bag only vs 50lb limit */}
                <div style={card}>
                  <div style={{ fontSize:'13px', fontWeight:'600', color:t.text, marginBottom:'14px' }}>Weight Tracker</div>
                  <div className="pp-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' }}>
                    {[{ label:'Main Suitcase', val:mainWeight, limit:true }, { label:'Carry-On', val:carryWeight, limit:false }].map(b => (
                      <div key={b.label} style={{ background:t.inputBg, borderRadius:'8px', padding:'12px', textAlign:'center', border:`1px solid ${b.limit && b.val > weightLimit ? '#dc2626' : t.border}` }}>
                        <div style={{ fontSize:'22px', fontWeight:'600', color: b.limit && b.val > weightLimit ? '#dc2626' : t.accent, fontFamily:"'JetBrains Mono',monospace" }}>{b.val.toFixed(1)}</div>
                        <div style={{ fontSize:'11px', color:t.textMuted, marginTop:'2px' }}>{b.label} lbs{b.limit ? ` / ${weightLimit} max` : ''}</div>
                      </div>
                    ))}
                  </div>
                  {mainOverLimit && (
                    <div style={{ fontSize:'12px', color:'#dc2626', padding:'8px 12px', background:'rgba(220,38,38,0.08)', borderRadius:'7px', marginBottom:'10px' }}>
                      Main suitcase over 50 lbs — most airlines will charge overweight fees. Move some items to carry-on or leave them behind.
                    </div>
                  )}
                  <div style={{ background:t.inputBg, borderRadius:'999px', height:'6px', overflow:'hidden' }}>
                    <div style={{ background: mainOverLimit ? '#dc2626' : t.accent, height:'100%', width:`${Math.min((mainWeight/weightLimit)*100,100).toFixed(1)}%`, borderRadius:'999px', transition:'width 0.4s' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:'7px', fontSize:'12px', color:t.textMuted }}>
                    <span>{packedCount}/{allItems.length} packed</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", color: mainOverLimit ? '#dc2626' : t.textMuted }}>
                      Main: {mainWeight.toFixed(1)} / {weightLimit} lbs{mainOverLimit ? ' — OVER LIMIT' : ''}
                    </span>
                  </div>
                </div>

                {/* Item lists */}
                {Object.entries(items).map(([cat, catItems]) => catItems.length === 0 ? null : (
                  <div key={cat} style={card}>
                    <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'12px' }}>
                      {cat} <span style={{ color:t.textDim }}>({catItems.length})</span>
                    </div>
                    {catItems.map((item, i) => (
                      <div key={i} className="item-row" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 6px', borderRadius:'6px', borderBottom: i < catItems.length-1 ? `1px solid ${t.border}` : 'none' }}>
                        <input type="checkbox" checked={item.packed} onChange={() => togglePacked(cat, i)} style={{ width:'15px', height:'15px', flexShrink:0, cursor:'pointer' }} />
                        <span style={{ flex:1, fontSize:'14px', color: item.packed ? t.textDim : t.text, textDecoration: item.packed ? 'line-through' : 'none' }}>
                          {item.name} <span style={{ color:t.textDim, fontSize:'12px', fontFamily:"'JetBrains Mono',monospace" }}>×{item.qty}</span>
                        </span>
                        <span style={{ fontSize:'11px', color:t.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{item.weight} lb</span>
                        <button onClick={() => toggleBag(cat, i)} style={{
                          fontSize:'11px', background:t.accentDim, color:t.accent, border:`1px solid ${t.borderStrong}`,
                          padding:'2px 10px', borderRadius:'999px', cursor:'pointer', fontWeight:'500', whiteSpace:'nowrap',
                        }}>
                          {item.bag === 'carry' ? 'Carry-On' : 'Main'}
                        </button>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Add item */}
                <div style={card}>
                  <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'12px' }}>Add Item</div>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <input value={customItem} onChange={e => setCustomItem(e.target.value)} placeholder="Item name..."
                      onKeyDown={e => e.key === 'Enter' && addCustomItem()} style={{ ...inputStyle, flex:1 }} />
                    <button className="btn-primary" onClick={addCustomItem} style={{ ...btnPrimary, width:'auto', padding:'10px 18px' }}>Add</button>
                  </div>
                </div>

                <button className="btn-primary" onClick={saveList} style={btnPrimary}>Save List</button>
              </div>
            )}
          </div>
        )}

        {/* ── VISUAL AID ── */}
        {activeTab === 'Visual Aid' && (
          <div>
            <div style={card}>
              <h2 style={{ fontSize:'18px', fontWeight:'600', marginBottom:'4px', color:t.text }}>Visual Packing Aid</h2>
              <p style={{ fontSize:'13px', color:t.textMuted, marginBottom:'4px' }}>
                Showing: <strong style={{ color:t.accent }}>
                  {tripType === 'Business' ? 'Business trip' :
                   (climate === 'tropical' || climate === 'desert' || climate === 'warm') ? 'Warm / Tropical trip' :
                   climate === 'cold' ? 'Cold weather trip' : 'Standard leisure trip'}
                </strong>
              </p>
              {!listGenerated && <p style={{ fontSize:'12px', color:t.textDim, marginBottom:'14px' }}>Generate a list first to see the right image for your trip type.</p>}
              <img src={visImage} alt="Packing visual guide" style={{ width:'100%', borderRadius:'12px', display:'block', marginTop:'12px' }} />
            </div>
            <div style={card}>
              <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'14px' }}>Expert Packing Tips</div>
              <div className="pp-tips-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'9px' }}>
                {[
                  ['Rolling Method','Roll clothes instead of folding — saves up to 30% more space'],
                  ['Heaviest at Bottom','Pack heavy items near the wheels for better balance'],
                  ['Packing Cubes','Organize by category for fast, stress-free unpacking'],
                  ['Fill Shoes','Stuff socks or small items inside shoes to maximize space'],
                  ['Long Trip Strategy','Pack for 7 days max and find a laundromat — beats hauling 30 days of clothes'],
                  ['Carry-On Essentials','Valuables, meds, chargers, and documents always go in your carry-on'],
                ].map(([title, tip]) => (
                  <div key={title} style={{ background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'8px', padding:'11px 13px' }}>
                    <div style={{ fontSize:'12px', fontWeight:'600', color:t.accent, marginBottom:'4px' }}>{title}</div>
                    <div style={{ fontSize:'12px', color:t.textMuted, lineHeight:'1.5' }}>{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── AI ASSISTANT ── */}
        {activeTab === 'AI Assistant' && (
          <div style={{ ...card, padding:0, overflow:'hidden' }}>
            <div style={{ padding:'20px 22px', borderBottom:`1px solid ${t.border}` }}>
              <h2 style={{ fontSize:'18px', fontWeight:'600', color:t.text, marginBottom:'3px' }}>AI Packing Assistant</h2>
              <p style={{ fontSize:'13px', color:t.textMuted }}>
                {destination ? `${destination} — ${tripType}` : 'Ask me anything about packing'}
              </p>
            </div>
            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${t.border}`, display:'flex', gap:'7px', flexWrap:'wrap' }}>
              {['Packing for rain?','Avoid baggage fees?','TSA liquid rules?','Long trip laundry?','Packing cubes worth it?'].map(q => (
                <button key={q} onClick={() => sendChat(q)} disabled={chatTyping}
                  style={{ background:t.accentDim, border:`1px solid ${t.border}`, borderRadius:'999px', padding:'5px 13px', fontSize:'12px', cursor: chatTyping ? 'default' : 'pointer', color:t.accent, opacity: chatTyping ? 0.5 : 1 }}>
                  {q}
                </button>
              ))}
            </div>
            <div className="pp-chat-messages" style={{ padding:'16px', minHeight:'340px', maxHeight:'420px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'10px' }}>
              {chatMessages.map((msg, i) => {
                const isLast = i === chatMessages.length - 1
                const isTypingMsg = chatTyping && isLast && msg.role === 'assistant'
                return (
                  <div key={i} style={{ display:'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div className={isTypingMsg ? 'cursor-blink' : ''} style={{
                      maxWidth:'78%', padding:'10px 14px',
                      borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                      background: msg.role === 'user' ? t.accent : t.inputBg,
                      border: msg.role === 'assistant' ? `1px solid ${t.border}` : 'none',
                      color: msg.role === 'user' ? '#fff' : t.text,
                      fontSize:'14px', lineHeight:'1.6',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding:'14px 16px', borderTop:`1px solid ${t.border}`, display:'flex', gap:'8px' }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Ask anything about packing..." disabled={chatTyping}
                style={{ flex:1, padding:'10px 16px', background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'999px', fontSize:'14px', color:t.text, outline:'none', opacity: chatTyping ? 0.6 : 1 }} />
              <button className="btn-primary" onClick={() => sendChat()} disabled={chatTyping} style={{ ...btnPrimary, width:'auto', padding:'10px 22px', borderRadius:'999px', opacity: chatTyping ? 0.6 : 1 }}>Send</button>
            </div>
          </div>
        )}

        {/* ── PREMIUM ── */}
        {activeTab === 'Premium' && (
          <div>
            {/* Header banner */}
            <div style={{ ...card, background: dark ? 'rgba(202,138,4,0.08)' : 'rgba(254,243,199,0.6)', borderColor:'rgba(202,138,4,0.35)', marginBottom:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
                <span style={{ fontSize:'22px' }}>✦</span>
                <h2 style={{ fontSize:'18px', fontWeight:'600', color:'#ca8a04' }}>Premium — Multi-Location Planner</h2>
              </div>
              <p style={{ fontSize:'13px', color:t.textMuted, lineHeight:'1.6' }}>
                Plan a trip across multiple destinations. Specify your dates at each location and we'll fetch live weather for every leg and build a combined smart packing list.
              </p>
            </div>

            {/* Setup form */}
            <div style={card}>
              {/* Number of locations */}
              <div style={{ marginBottom:'20px' }}>
                <label style={labelStyle}>Number of Locations</label>
                <div style={{ display:'flex', gap:'7px' }}>
                  {[2,3,4,5].map(n => (
                    <button key={n} className="btn-pill" onClick={() => setNumLocations(n)} style={{
                      ...t.pill(numLocations === n), borderRadius:'999px', padding:'5px 18px',
                      fontSize:'14px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif",
                    }}>{n}</button>
                  ))}
                </div>
              </div>

              {/* Location cards */}
              {Array.from({length: numLocations}, (_, idx) => {
                const leg = premiumLegs[idx]
                return (
                  <div key={idx} style={{ border:`1px solid ${t.border}`, borderRadius:'10px', padding:'16px', marginBottom:'12px', background:t.inputBg }}>
                    <div style={{ fontSize:'12px', fontWeight:'600', color:'#ca8a04', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                      Location {idx + 1}
                    </div>
                    <div style={{ position:'relative', marginBottom:'12px' }} ref={el => premiumLegRefs.current[idx] = el}>
                      <label style={labelStyle}>Destination</label>
                      <input
                        value={leg.destInput}
                        onChange={e => handlePremiumDestInput(idx, e.target.value)}
                        onFocus={() => leg.destInput.length >= 2 && updatePremiumLeg(idx, { showSug: true })}
                        placeholder="Search city or country..."
                        style={inputStyle}
                      />
                      {leg.showSug && leg.suggestions.length > 0 && (
                        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:t.surface, border:`1px solid ${t.borderStrong}`, borderRadius:'8px', zIndex:200, overflow:'hidden' }}>
                          {leg.suggestions.map(s => (
                            <div key={s} className="dest-sug" onClick={() => selectPremiumDest(idx, s)}
                              style={{ padding:'9px 13px', cursor:'pointer', fontSize:'14px', color:t.text, borderBottom:`1px solid ${t.border}` }}>{s}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    {leg.destination && (
                      <div style={{ padding:'6px 10px', background:'rgba(202,138,4,0.08)', border:'1px solid rgba(202,138,4,0.25)', borderRadius:'6px', fontSize:'12px', color:'#ca8a04', marginBottom:'10px' }}>
                        {climateLabels[leg.climate]} climate detected
                      </div>
                    )}
                    <div className="pp-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                      <div>
                        <label style={labelStyle}>Arrival Date</label>
                        <input type="date" value={leg.startDate} onChange={e => updatePremiumLeg(idx, { startDate: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Departure Date</label>
                        <input type="date" value={leg.endDate} onChange={e => updatePremiumLeg(idx, { endDate: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    {leg.startDate && leg.endDate && (
                      <div style={{ fontSize:'12px', color:t.textMuted, marginTop:'8px' }}>
                        {getLegDays(leg)} day{getLegDays(leg) !== 1 ? 's' : ''} in {leg.destination || 'this location'}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Trip type */}
              <div style={{ marginBottom:'18px' }}>
                <label style={labelStyle}>Trip Type</label>
                <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                  {['Leisure','Beach','Adventure','Business','Family','Backpacking'].map(ty => (
                    <button key={ty} className="btn-pill" onClick={() => setPremiumTripType(ty)} style={{
                      ...t.pill(premiumTripType === ty), borderRadius:'999px', padding:'5px 14px',
                      fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif",
                    }}>{ty}</button>
                  ))}
                </div>
              </div>

              <button className="btn-primary" onClick={handlePremiumGenerate}
                style={{ ...btnPrimary, background:'linear-gradient(135deg, #ca8a04, #d97706)' }}>
                {premiumGenerated ? 'Regenerate Multi-Location List' : 'Generate Multi-Location Packing List'}
              </button>
            </div>

            {/* Results */}
            {premiumGenerated && (
              <div>
                {premiumLaundryNote && (
                  <div style={{ ...card, borderColor:'#f59e0b', background: dark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.06)', padding:'14px 18px' }}>
                    <p style={{ fontSize:'13px', color:'#f59e0b', fontWeight:'500' }}>
                      Long multi-leg trip — clothing capped at ~1 week per leg. Plan on laundry at some stops.
                    </p>
                  </div>
                )}

                {/* Visual image */}
                <div style={{ ...card, marginBottom:'12px' }}>
                  <div style={{ fontSize:'11px', fontWeight:'600', color:'#ca8a04', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'10px' }}>
                    Visual Aid — based on average temperatures across all destinations
                  </div>
                  <img src={premiumVisImage} alt="Packing visual" style={{ width:'100%', borderRadius:'10px', display:'block' }} />
                </div>

                {/* Weather per leg */}
                {premiumWeatherLoading && (
                  <div style={{ ...card, textAlign:'center', color:t.textMuted, fontSize:'13px', padding:'16px' }}>
                    Fetching forecasts for all locations...
                  </div>
                )}
                {!premiumWeatherLoading && premiumWeathers.map((w, idx) => {
                  const leg = premiumLegs[idx]
                  if (!leg?.destination) return null
                  const err = premiumWeatherErrors[idx]
                  if (err && !w) return (
                    <div key={idx} style={{ ...card, borderColor:'#dc2626' }}>
                      <p style={{ fontSize:'13px', color:'#dc2626' }}>Location {idx+1} — {err}</p>
                    </div>
                  )
                  if (!w) return null
                  const temps = w.daily.temperature_2m_max || []
                  const codes = w.daily.weather_code || []
                  const rains = w.daily.precipitation_probability_max || []
                  const avgHigh = Math.round(temps.reduce((a,b) => a+b, 0) / temps.length)
                  const rainDays = codes.filter(c => [51,53,55,61,63,65,66,67,80,81,82].includes(c)).length
                  const snowDays = codes.filter(c => [71,73,75,77,85,86].includes(c)).length
                  const tip = getPackingTip(avgHigh, rainDays, snowDays)
                  return (
                    <div key={idx} style={{ ...card, borderColor: dark ? 'rgba(202,138,4,0.35)' : 'rgba(202,138,4,0.25)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                        <div>
                          <div style={{ fontSize:'13px', fontWeight:'600', color:'#ca8a04', marginBottom:'2px' }}>Location {idx+1}</div>
                          <div style={{ fontSize:'15px', fontWeight:'600', color:t.text }}>{w.city}, {w.country}</div>
                          <div style={{ fontSize:'12px', color:t.textMuted, marginTop:'2px' }}>
                            {leg.startDate && leg.endDate ? `${leg.startDate} → ${leg.endDate}` : '7-day forecast'}
                          </div>
                        </div>
                        <span style={{ fontSize:'12px', color:'#ca8a04', background:'rgba(202,138,4,0.1)', padding:'3px 10px', borderRadius:'6px', border:'1px solid rgba(202,138,4,0.3)', flexShrink:0 }}>Live</span>
                      </div>
                      <div style={{ padding:'9px 12px', background:'rgba(202,138,4,0.08)', borderRadius:'8px', fontSize:'13px', marginBottom:'12px' }}>
                        <span style={{ color:'#ca8a04', fontWeight:'500' }}>Avg high ~{avgHigh}°F</span>
                        {rainDays > 0 && <span style={{ color:t.textMuted }}> · {rainDays} rainy day{rainDays>1?'s':''}</span>}
                        {snowDays > 0 && <span style={{ color:t.textMuted }}> · {snowDays} snowy day{snowDays>1?'s':''}</span>}
                        <span style={{ color:t.textMuted }}> — {tip}</span>
                      </div>
                      <div style={{ fontSize:'11px', color:t.textDim, marginBottom:'8px' }}>Tap a day for hourly breakdown</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(86px, 1fr))', gap:'8px' }}>
                        {w.daily.time.map((date, i) => {
                          const wc = getWeatherCode(codes[i]); const icon = wc.split(' ')[0]; const label = wc.split(' ').slice(1).join(' ')
                          const isToday = date === new Date().toISOString().split('T')[0]
                          const isSelected = premiumSelectedDay?.legIdx === idx && premiumSelectedDay?.dayIdx === i
                          const high = Math.round(temps[i]); const low = Math.round(w.daily.temperature_2m_min[i]); const rain = rains[i]
                          return (
                            <div key={i} onClick={() => setPremiumSelectedDay(prev => prev?.legIdx === idx && prev?.dayIdx === i ? null : { legIdx: idx, dayIdx: i })}
                              style={{ background: isSelected ? 'rgba(202,138,4,0.15)' : isToday ? 'rgba(202,138,4,0.1)' : t.inputBg, border:`1px solid ${isSelected ? '#ca8a04' : isToday ? '#ca8a04' : t.border}`, borderRadius:'10px', padding:'11px 7px', textAlign:'center', cursor:'pointer', outline: isSelected ? '2px solid #ca8a04' : 'none', outlineOffset:'2px' }}>
                              <div style={{ fontSize:'10px', color:t.textMuted, marginBottom:'6px', fontWeight:'500' }}>
                                {new Date(date+'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
                              </div>
                              <div style={{ fontSize:'20px', marginBottom:'6px' }}>{icon}</div>
                              <div style={{ fontSize:'15px', fontWeight:'600', color:t.text, fontFamily:"'JetBrains Mono',monospace" }}>{high}°F</div>
                              <div style={{ fontSize:'11px', color:t.textMuted, fontFamily:"'JetBrains Mono',monospace", marginTop:'1px' }}>{low}°F</div>
                              <div style={{ fontSize:'10px', color:'#ca8a04', marginTop:'4px', fontWeight:'500' }}>{label}</div>
                              <div style={{ fontSize:'10px', color:t.textDim, marginTop:'2px' }}>{rain}% rain</div>
                            </div>
                          )
                        })}
                      </div>
                      {premiumSelectedDay?.legIdx === idx && premiumSelectedDay?.dayIdx !== undefined && renderHourlyPanel(w, premiumSelectedDay.dayIdx, '#ca8a04')}
                    </div>
                  )
                })}

                {/* Weight tracker */}
                {(() => {
                  const pAllItems = Object.values(premiumItems).flat()
                  const pMain = pAllItems.filter(i => i.bag === 'main'); const pCarry = pAllItems.filter(i => i.bag === 'carry')
                  const pMainW = pMain.reduce((s,i) => s + i.weight*i.qty, 0); const pCarryW = pCarry.reduce((s,i) => s + i.weight*i.qty, 0)
                  const pPacked = pAllItems.filter(i => i.packed).length; const pOver = pMainW > 50
                  return (
                    <div style={card}>
                      <div style={{ fontSize:'13px', fontWeight:'600', color:t.text, marginBottom:'14px' }}>Weight Tracker</div>
                      <div className="pp-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' }}>
                        {[{ label:'Main Suitcase', val:pMainW, limit:true }, { label:'Carry-On', val:pCarryW, limit:false }].map(b => (
                          <div key={b.label} style={{ background:t.inputBg, borderRadius:'8px', padding:'12px', textAlign:'center', border:`1px solid ${b.limit && b.val > 50 ? '#dc2626' : t.border}` }}>
                            <div style={{ fontSize:'22px', fontWeight:'600', color: b.limit && b.val > 50 ? '#dc2626' : '#ca8a04', fontFamily:"'JetBrains Mono',monospace" }}>{b.val.toFixed(1)}</div>
                            <div style={{ fontSize:'11px', color:t.textMuted, marginTop:'2px' }}>{b.label} lbs{b.limit ? ' / 50 max' : ''}</div>
                          </div>
                        ))}
                      </div>
                      {pOver && <div style={{ fontSize:'12px', color:'#dc2626', padding:'8px 12px', background:'rgba(220,38,38,0.08)', borderRadius:'7px', marginBottom:'10px' }}>Main suitcase over 50 lbs — move some items to carry-on.</div>}
                      <div style={{ background:t.inputBg, borderRadius:'999px', height:'6px', overflow:'hidden' }}>
                        <div style={{ background: pOver ? '#dc2626' : '#ca8a04', height:'100%', width:`${Math.min((pMainW/50)*100,100).toFixed(1)}%`, borderRadius:'999px', transition:'width 0.4s' }} />
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'7px', fontSize:'12px', color:t.textMuted }}>
                        <span>{pPacked}/{pAllItems.length} packed</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", color: pOver ? '#dc2626' : t.textMuted }}>Main: {pMainW.toFixed(1)} / 50 lbs</span>
                      </div>
                    </div>
                  )
                })()}

                {/* Combined packing list */}
                {Object.entries(premiumItems).map(([cat, catItems]) => catItems.length === 0 ? null : (
                  <div key={cat} style={card}>
                    <div style={{ fontSize:'11px', fontWeight:'600', color:'#ca8a04', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'12px' }}>
                      {cat} <span style={{ color:t.textDim }}>({catItems.length})</span>
                    </div>
                    {catItems.map((item, i) => (
                      <div key={i} className="item-row" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 6px', borderRadius:'6px', borderBottom: i < catItems.length-1 ? `1px solid ${t.border}` : 'none' }}>
                        <input type="checkbox" checked={item.packed} onChange={() => togglePremiumPacked(cat, i)} style={{ width:'15px', height:'15px', flexShrink:0, cursor:'pointer' }} />
                        <span style={{ flex:1, fontSize:'14px', color: item.packed ? t.textDim : t.text, textDecoration: item.packed ? 'line-through' : 'none' }}>
                          {item.name} <span style={{ color:t.textDim, fontSize:'12px', fontFamily:"'JetBrains Mono',monospace" }}>×{item.qty}</span>
                        </span>
                        <span style={{ fontSize:'11px', color:t.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{item.weight} lb</span>
                        <button onClick={() => togglePremiumBag(cat, i)} style={{
                          fontSize:'11px', background:'rgba(202,138,4,0.1)', color:'#ca8a04', border:'1px solid rgba(202,138,4,0.3)',
                          padding:'2px 10px', borderRadius:'999px', cursor:'pointer', fontWeight:'500', whiteSpace:'nowrap',
                        }}>
                          {item.bag === 'carry' ? 'Carry-On' : 'Main'}
                        </button>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Add custom item */}
                <div style={card}>
                  <div style={{ fontSize:'11px', fontWeight:'600', color:'#ca8a04', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'12px' }}>Add Item</div>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <input value={premiumCustomItem} onChange={e => setPremiumCustomItem(e.target.value)} placeholder="Item name..."
                      onKeyDown={e => e.key === 'Enter' && addPremiumCustomItem()} style={{ ...inputStyle, flex:1 }} />
                    <button className="btn-primary" onClick={addPremiumCustomItem}
                      style={{ ...btnPrimary, width:'auto', padding:'10px 18px', background:'#ca8a04' }}>Add</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === 'Settings' && (
          <div>
            {/* Profile */}
            <div style={card}>
              <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'18px' }}>Your Profile</div>
              <div style={{ display:'grid', gap:'14px' }}>
                <div>
                  <label style={labelStyle}>Your Name</label>
                  <input value={profile.name} onChange={e => saveProfile({ name: e.target.value })} placeholder="Enter your name..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Home City</label>
                  <input value={profile.homeCity} onChange={e => saveProfile({ homeCity: e.target.value })} placeholder="Where do you usually travel from?" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Packing Style</label>
                  <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                    {['Light Packer','Average','Heavy Packer'].map(s => (
                      <button key={s} className="btn-pill" onClick={() => saveProfile({ travelStyle: s })} style={{ ...t.pill(profile.travelStyle === s), borderRadius:'999px', padding:'5px 14px', fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Frequent Flyer?</label>
                  <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                    {['Yes','Sometimes','No'].map(s => (
                      <button key={s} className="btn-pill" onClick={() => saveProfile({ frequentFlyer: s })} style={{ ...t.pill(profile.frequentFlyer === s), borderRadius:'999px', padding:'5px 14px', fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>{s}</button>
                    ))}
                  </div>
                </div>
                {profile.name && (
                  <div style={{ padding:'10px 14px', background:t.accentDim, border:`1px solid ${t.borderStrong}`, borderRadius:'8px', fontSize:'13px', color:t.accent }}>
                    Welcome, {profile.name}! Your preferences are saved automatically.
                  </div>
                )}
              </div>
            </div>

            <div style={card}>
              <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'18px' }}>Appearance</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:'14px', fontWeight:'500', color:t.text }}>Dark Mode</div>
                  <div style={{ fontSize:'12px', color:t.textMuted, marginTop:'2px' }}>Toggle light / dark theme</div>
                </div>
                <button className="btn-toggle" onClick={toggleDark} style={{ width:'48px', height:'26px', borderRadius:'999px', border:'none', cursor:'pointer', background: dark ? t.accent : t.border, position:'relative' }}>
                  <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'white', position:'absolute', top:'3px', left: dark ? '25px' : '3px', transition:'left 0.2s' }} />
                </button>
              </div>
            </div>

            <div style={card}>
              <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'14px' }}>Weight Limits</div>
              <p style={{ fontSize:'13px', color:t.textMuted }}>Main suitcase limit: <strong style={{ color:t.text }}>50 lbs</strong> (standard airline checked bag). Carry-on has no enforced limit here — airlines typically allow 15–22 lbs but the suitcase weight check only applies to your main bag.</p>
            </div>

            {savedLists.length > 0 && (
              <div style={card}>
                <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'14px' }}>Saved Lists</div>
                {savedLists.map((list, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i < savedLists.length-1 ? `1px solid ${t.border}` : 'none' }}>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:'500', color:t.text }}>{list.destination}</div>
                      <div style={{ fontSize:'12px', color:t.textMuted, marginTop:'1px' }}>{list.tripType} · {list.date}</div>
                    </div>
                    <button className="btn-ghost" onClick={() => { setItems(list.items); setDestination(list.destination); setDestInput(list.destination); setTripType(list.tripType); setListGenerated(true); setActiveTab('Packing List') }}
                      style={{ background:'transparent', color:t.accent, border:`1px solid ${t.borderStrong}`, borderRadius:'8px', padding:'6px 14px', fontSize:'12px', cursor:'pointer' }}>
                      Load
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
