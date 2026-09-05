import { useState, useEffect, useRef } from "react"

const IMG_WARM      = "/img-warm.jpg"
const IMG_COLD      = "/img-cold.jpg"
const IMG_NORM      = "/img-norm.jpg"
const IMG_BIZ       = "/img-biz.jpg"
const IMG_BIZ_BEACH = "/business-beach.jpg"
const IMG_SKI_BEACH = "/ski-beach.jpg"
const IMG_SKI       = "/ski-trip.jpg"
const IMG_SPORTS    = "/sports-trip.jpg"

const IS_QUOTES = [
  '"Do not go gentle into that good night." — Dylan Thomas',
  '"Love is the one thing that transcends time and space." — Brand',
  '"We used to look up at the sky and wonder at our place in the stars."',
  '"Mankind was born on Earth. It was never meant to die here."',
  'TARS: Humor setting 75%. Confirmed.',
  '"Every hour on Miller\'s Planet = 7 years on Earth." — TARS',
  '"We\'re not meant to save the world. We\'re meant to leave it."',
  '"Cooper... they\'re not beings, they\'re us." — Brand',
  '"Gravity is the only thing that transcends dimensions."',
  '"Time to make some memories, Murph." — Pack Perfect',
]
const IS_STARS = Array.from({length:130}, (_, i) => ({
  id:i, x:(i*7.3+2.1)%100, y:(i*5.9+1.7)%100,
  size:i%6===0?2.5:i%3===0?1.5:1, opacity:0.25+(i%7)*0.08,
  dur:1.5+(i*0.27)%3.5, delay:(i*0.19)%5,
}))
const IS_DUST = Array.from({length:20}, (_, i) => ({
  id:i, x:15+(i*8.3)%70, delay:(i*0.41)%4, dur:2.5+(i*0.31)%2.5, dx:-20+(i*6)%40,
}))
const IS_BOOKS = Array.from({length:27}, (_, i) => ({
  id:i, w:20+(i*7)%16, h:100+(i*13)%70,
  color:['#8B4513','#A0522D','#6B3A2A','#5C4033','#4A3728','#7B5E3A','#9C6644','#3D2B1F','#6E4C30','#B8860B','#8B6914','#5F4020','#A67C52','#7D5A3C','#C19A6B'][i%15],
  shelf:Math.floor(i/9), pushed:[1,4,7,9,12,15,18,21,24].includes(i),
  pushDelay:(i*0.29)%2.5, pushDur:0.7+(i*0.13)%0.8,
}))

const ICE_AGE_QUOTES = [
  '"MY ACORN!" — Scrat',
  '"Why am I always the one who gets left behind?!" — Sid',
  '"We\'re a herd. That\'s what herds do." — Manny',
  '"Actually... I think we can do this." — Diego',
  '"For the acorn!!!" — Scrat',
  '"You know what? Keep it. I don\'t want it anyway." — Sid (lying)',
  '"Nobody touches the fur. NOBODY." — Manny',
  '"How do you always find something to eat in the middle of an ice age?" — Diego',
  '"Ice Age packing tip: thermal layers. All of them. Every single one." — Pack Perfect',
  '"THWACK!" — Acorn hitting Scrat',
]
const ICE_SNOWFLAKES = Array.from({length:45}, (_, i) => ({
  id:i, left:(i*2.27+1.1)%100, delay:(i*0.33)%7, dur:5+(i*0.51)%6,
  size:8+(i*3)%18, opacity:0.35+(i%6)*0.1, drift:(i%2===0?1:-1)*(5+(i*2.3)%15),
}))
const ICE_CRACKS = Array.from({length:6}, (_, i) => ({
  id:i, x:47+(i*1.2-3), angle:-25+(i*12), len:60+(i*18)%80, w:1+(i%3)*0.7,
}))
const ICE_CHUNKS = Array.from({length:12}, (_, i) => ({
  id:i, x:(i*8.4+2)%96, y:(i*7.1+5)%60, size:30+(i*11)%60,
  angle:(i*31)%360, opacity:0.15+(i%4)*0.07,
}))

const HA_QUOTES = [
  '"MERRY CHRISTMAS, YA FILTHY ANIMALS. AND A HAPPY NEW YEAR."',
  '"Bless this highly nutritious micro-wavable macaroni and cheese dinner..." — Kevin',
  '"AAAAHHHH!" — Marv',
]
const HA_SNOWFLAKES = Array.from({length:55}, (_, i) => ({
  id:i, left:(i*2.11+0.9)%100, delay:(i*0.41)%8, dur:6+(i*0.47)%7,
  size:10+(i*4)%20, opacity:0.45+(i%5)*0.1, drift:(i%2===0?1:-1)*(8+(i*2.7)%18),
}))
const HA_LIGHTS = Array.from({length:22}, (_, i) => ({
  id:i, color:['#ff2222','#22cc22','#ffcc00','#2244ff','#ff44aa'][i%5],
  delay:(i*0.18)%2.2,
}))
const HA_TRAPS = [
  { icon:'🕯️', name:'Blow Torch',        note:'doorknob heating system' },
  { icon:'🏒', name:'BB Gun',             note:'just in case' },
  { icon:'🪣', name:'Paint Cans on Wire', note:'string-activated' },
  { icon:'❄️', name:'Icy Front Steps',    note:'pre-applied, extra slippery' },
  { icon:'🔮', name:'Ornament Landmines', note:'strategically placed' },
  { icon:'🕷️', name:'Buzz\'s Tarantula', note:'borrowed without permission' },
  { icon:'🧲', name:'Zip Line Kit',       note:'for rapid rooftop egress' },
  { icon:'🔨', name:'Nail Board',         note:'basement entry deterrent' },
  { icon:'🧴', name:'Aftershave',         note:'personal care & scream trigger' },
  { icon:'🍕', name:'Cheese Pizza',       note:'just for me, not for Wet Bandits' },
]

const MINIONS_QUOTES = [
  '"LIGHTBULB." — Gru',
  '"It\'s so fluffy I\'m gonna DIE!" — Agnes',
  'BANANA! 🍌🍌🍌',
  '"Tonight... the moon!" — Gru',
  'Tulaliloo ti amo! 💛',
  '"Vector. VECTOR!" — Gru',
  'Bello! 👋',
  '"We had a deal, Vector!" — Gru',
  'Poopaye! 😂',
  '"Gru... he\'s a SUPER villain!" — Margo',
]
const MINIONS_BANANAS = Array.from({length:20}, (_, i) => ({
  id:i, left:(i*5.3+1.9)%100, delay:(i*0.38)%5, dur:3+(i*0.43)%3, size:18+(i*3)%14,
}))
const MINIONS_STALACTITES = Array.from({length:11}, (_, i) => ({
  id:i, left:(i*9.7+1.5)%98, h:40+(i*17)%80, w:18+(i*7)%22,
}))
const MINIONS_SPEECH = [
  { text:'Bello! 👋',          delay:0.3 },
  { text:'BANANA! 🍌',         delay:0.9 },
  { text:'Tulaliloo ti amo! 💛', delay:1.5 },
  { text:'Poopaye! 😂',         delay:2.2 },
  { text:'PAPOY! 🎉',           delay:2.8 },
]

const KJ_QUOTES = [
  "I like to move it, move it! 🕺",
  "I AM the king! Everyone bow down! 👑",
  "SILENCE! The king is packing! 🧳",
  "I decree you shall DANCE! 💃",
  "This is MY kingdom! 🌴",
  "You are welcome! ...I don't know why! 😂",
  "Move it! MOVE IT! 🎶",
  "Nobody touches the royal luggage! 👜",
  "I am so pretty! So pretty and so royal! ✨",
  "Bring me my crown, I'm going on vacation! 🏖️",
]
const KJ_CONFETTI = Array.from({length:24}, (_, i) => ({
  id: i,
  left: (i * 4.3 + 2) % 100,
  delay: (i * 0.41) % 5,
  dur: 4 + (i * 0.47) % 4,
  emoji: ['👑','🎉','🕺','🦁','✨','🌴','🎊','💃','🐒','🎶','🎵','🥳','🌺','🍌','🦜','🎪','🌈','🎸','🏆','🎭','🎨','🎯','🌸','🎀'][i % 24],
  size: 18 + (i * 3) % 16,
}))

const GRINCH_QUOTES = [
  '"You\'re a MEAN one, Mr. Grinch." — Narrator',
  '"Hate, hate, hate. Double hate. LOATHE ENTIRELY." — Grinch',
  '"4:00, wallow in self pity. 4:30, stare into the abyss." — Grinch\'s Schedule',
  '"It\'s because I\'m GREEN, isn\'t it?" — Grinch',
  '"MAX. Fetch me my reindeer antler." — Grinch',
  '"Help me. I\'m feeling." — Grinch',
  '"Every Who down in Whoville liked Christmas a lot." — Narrator',
  '"BLECH!" — Grinch',
  '"Your heart grew THREE SIZES today. Pack accordingly." — Pack Perfect',
  '"I could use a little Christmas spirit... said no Grinch ever." — Pack Perfect',
]
const GRINCH_SCHEDULE = [
  { time: '4:00',  task: 'Wallow in self-pity',              done: true  },
  { time: '4:30',  task: 'Stare into the abyss',              done: true  },
  { time: '5:00',  task: 'Solve world\'s problems — alone',   done: false },
  { time: '5:30',  task: 'Brood on Mount Crumpit',            done: true  },
  { time: '6:00',  task: 'Plot the theft of Christmas',        done: true  },
  { time: '7:00',  task: 'Craft reindeer disguise for Max',    done: true  },
  { time: '8:00',  task: 'Steal every last present',           done: true  },
  { time: '9:00',  task: 'Have wonderful, awful idea',         done: true  },
]
const GRINCH_STOLEN = [
  { icon: '🎄', name: 'Christmas Tree',              note: 'last one on the block'            },
  { icon: '🎁', name: 'Every Last Present',           note: 'under every tree, naturally'      },
  { icon: '🧦', name: 'Stockings Hung with Care',     note: 'all of them. every single one.'  },
  { icon: '🍗', name: 'Roast Beast',                  note: 'centerpiece of the feast'         },
  { icon: '🕯️', name: 'Christmas Candles',           note: 'all 147 of them'                  },
  { icon: '⭐', name: 'Tree Topper',                  note: 'star, angel, the works'           },
  { icon: '🔔', name: 'Every Jingle Bell',             note: 'silencing Whoville since \'57'   },
  { icon: '🌟', name: 'Lights & Tinsel',              note: 'stripped the entire street'       },
  { icon: '🍪', name: 'Christmas Cookies',             note: 'and the milk. obviously.'         },
  { icon: '🐕', name: "Max's Last Shred of Dignity",  note: 'reindeer antler: compulsory'      },
]
const GRINCH_HEIST_COMMENTS = [
  '"Child\'s play." — Grinch',
  '"Still warm. EXCELLENT." — Grinch',
  '"You won\'t be needing this." — Grinch',
  '"Into the sack. Now." — Grinch',
  '"MAX! PULL! HARDER!" — Grinch',
  '"Every. Last. One." — Grinch',
  '"Was this... sentimental? Even better." — Grinch',
  '"The whole street. Swept clean." — Grinch',
  '"...I left the crumbs. I have standards." — Grinch',
  '"Merry Christmas to ME." — Grinch',
]
const GRINCH_LAUGHS = [
  { text:'heh.', size:14, color:'rgba(80,220,80,0.5)' },
  { text:'heh heh.', size:17, color:'rgba(80,220,80,0.6)' },
  { text:'HEH HEH HEH...', size:21, color:'rgba(60,240,60,0.75)' },
  { text:'MUAHAHAHA!', size:28, color:'rgba(34,255,34,0.9)' },
  { text:'MUAHAHAHAHAHAHA!!!', size:36, color:'#33ff33' },
  { text:'💚 A WONDERFUL, AWFUL PLAN. COMPLETE. 💚', size:17, color:'#aaffaa' },
]
const GRINCH_HEART_CONFETTI = Array.from({length:34}, (_, i) => ({
  id:i, left:(i*3.1+2.3)%98, delay:(i*0.08)%2.5, dur:2.1+(i*0.21)%2.8,
  size:12+(i*5)%26, rot:(i*53)%360, dx:-50+(i*11)%100,
}))
const GRINCH_SNOWFLAKES = Array.from({length:55}, (_, i) => ({
  id:i, left:(i*2.09+0.6)%100, delay:(i*0.37)%8, dur:5+(i*0.49)%7,
  size:8+(i*3)%18, opacity:0.35+(i%6)*0.1, drift:(i%2===0?1:-1)*(5+(i*2.4)%15),
}))
const GRINCH_STARS = Array.from({length:60}, (_, i) => ({
  id:i, x:(i*6.7+3)%100, y:(i*4.9+2)%55,
  size:i%5===0?2.5:i%3===0?1.5:1, opacity:0.2+(i%6)*0.1,
  dur:2+(i*0.31)%3, delay:(i*0.23)%4,
}))
const GRINCH_ORNAMENTS = Array.from({length:20}, (_, i) => ({
  id:i,
  color:['#cc0000','#22aa22','#ffcc00','#0044cc','#cc44aa','#ff6600','#009966'][i%7],
  delay:(i*0.21)%2.5, dur:2.1+(i*0.27)%1.2,
}))

const DESTINATIONS = [...new Set([
  // New York City & boroughs
  'New York, NY','Manhattan, NY','Brooklyn, NY','Queens, NY','The Bronx, NY','Staten Island, NY',
  // Long Island
  'Roslyn, NY','Garden City, NY','Huntington, NY','Babylon, NY','Smithtown, NY',
  'Hempstead, NY','Great Neck, NY','Oyster Bay, NY','Montauk, NY','East Hampton, NY',
  // More New York State
  'Buffalo, NY','Rochester, NY','Syracuse, NY','Albany, NY','Ithaca, NY',
  'Saratoga Springs, NY','Niagara Falls, NY','White Plains, NY',
  // Northeast US
  'Boston, MA','Providence, RI','Hartford, CT','New Haven, CT','Stamford, CT',
  'Portland, ME','Burlington, VT','Montpelier, VT','Concord, NH','Manchester, NH',
  'Bridgeport, CT','Springfield, MA','Worcester, MA','Lowell, MA','Cambridge, MA',
  // Mid-Atlantic
  'Philadelphia, PA','Pittsburgh, PA','Baltimore, MD','Annapolis, MD',
  'Washington DC','Richmond, VA','Virginia Beach, VA','Norfolk, VA','Charlottesville, VA',
  'Wilmington, DE','Dover, DE','Atlantic City, NJ','Newark, NJ','Jersey City, NJ',
  'Trenton, NJ','Princeton, NJ','Hoboken, NJ',
  // Southeast
  'Charlotte, NC','Raleigh, NC','Durham, NC','Asheville, NC','Wilmington, NC',
  'Charleston, SC','Columbia, SC','Myrtle Beach, SC','Greenville, SC',
  'Atlanta, GA','Savannah, GA','Augusta, GA',
  'Jacksonville, FL','Miami, FL','Tampa, FL','Orlando, FL','Fort Lauderdale, FL',
  'West Palm Beach, FL','Key West, FL','Naples, FL','Sarasota, FL','Gainesville, FL',
  'Tallahassee, FL','Pensacola, FL','Destin, FL',
  'Nashville, TN','Memphis, TN','Knoxville, TN','Chattanooga, TN',
  'Louisville, KY','Lexington, KY','Bowling Green, KY',
  'Birmingham, AL','Mobile, AL','Montgomery, AL','Huntsville, AL',
  'Jackson, MS','Gulfport, MS','Biloxi, MS',
  'New Orleans, LA','Baton Rouge, LA','Shreveport, LA','Lafayette, LA',
  // Midwest
  'Chicago, IL','Springfield, IL','Rockford, IL','Winnetka, IL',
  'Indianapolis, IN','Fort Wayne, IN','South Bend, IN',
  'Columbus, OH','Cleveland, OH','Cincinnati, OH','Dayton, OH','Akron, OH','Toledo, OH',
  'Detroit, MI','Grand Rapids, MI','Ann Arbor, MI','Lansing, MI','Traverse City, MI',
  'Minneapolis, MN','St. Paul, MN','Duluth, MN',
  'Milwaukee, WI','Madison, WI','Green Bay, WI',
  'Kansas City, MO','St. Louis, MO','Springfield, MO',
  'Omaha, NE','Lincoln, NE',
  'Des Moines, IA','Iowa City, IA',
  'Sioux Falls, SD','Rapid City, SD',
  'Fargo, ND','Bismarck, ND',
  'Wichita, KS','Topeka, KS',
  // South Central
  'Houston, TX','Dallas, TX','San Antonio, TX','Austin, TX','Fort Worth, TX',
  'El Paso, TX','Lubbock, TX','Amarillo, TX','Corpus Christi, TX','Galveston, TX',
  'Oklahoma City, OK','Tulsa, OK',
  'Little Rock, AR','Fayetteville, AR',
  // Mountain West
  'Denver, CO','Colorado Springs, CO','Boulder, CO','Aspen, CO','Vail, CO','Telluride, CO',
  'Salt Lake City, UT','Park City, UT','Provo, UT','Moab, UT','St. George, UT',
  'Boise, ID','Sun Valley, ID',
  'Helena, MT','Bozeman, MT','Missoula, MT','Billings, MT','Glacier, MT',
  'Cheyenne, WY','Jackson Hole, WY','Yellowstone, WY',
  'Albuquerque, NM','Santa Fe, NM','Taos, NM',
  'Las Vegas, NV','Reno, NV',
  'Phoenix, AZ','Scottsdale, AZ','Sedona, AZ','Flagstaff, AZ','Tucson, AZ',
  // West Coast
  'Los Angeles, CA','San Francisco, CA','San Diego, CA','San Jose, CA',
  'Sacramento, CA','Fresno, CA','Long Beach, CA','Oakland, CA','Napa, CA',
  'Santa Barbara, CA','Palm Springs, CA','Lake Tahoe, CA','Yosemite, CA','Big Sur, CA',
  'Portland, OR','Salem, OR','Eugene, OR','Bend, OR','Crater Lake, OR',
  'Seattle, WA','Spokane, WA','Tacoma, WA','Olympia, WA',
  // Alaska & Hawaii
  'Anchorage, AK','Fairbanks, AK','Juneau, AK','Sitka, AK',
  'Honolulu, HI','Maui, HI','Kauai, HI','Hilo, HI','Lahaina, HI',
  // US Territories
  'San Juan, Puerto Rico','Ponce, Puerto Rico','Charlotte Amalie, US Virgin Islands',
  // Europe
  'London, UK','Manchester, UK','Liverpool, UK','Edinburgh, Scotland','Glasgow, Scotland','Dublin, Ireland',
  'Paris, France','Lyon, France','Nice, France','Marseille, France','Bordeaux, France','Strasbourg, France',
  'Rome, Italy','Milan, Italy','Venice, Italy','Florence, Italy','Naples, Italy','Amalfi Coast, Italy',
  'Barcelona, Spain','Madrid, Spain','Seville, Spain','Valencia, Spain','Ibiza, Spain','Mallorca, Spain','Bilbao, Spain',
  'Lisbon, Portugal','Porto, Portugal','Algarve, Portugal',
  'Amsterdam, Netherlands','Rotterdam, Netherlands',
  'Berlin, Germany','Munich, Germany','Hamburg, Germany','Frankfurt, Germany','Cologne, Germany',
  'Vienna, Austria','Salzburg, Austria','Innsbruck, Austria',
  'Zurich, Switzerland','Geneva, Switzerland','Lucerne, Switzerland','Interlaken, Switzerland',
  'Prague, Czech Republic','Brno, Czech Republic',
  'Budapest, Hungary','Krakow, Poland','Warsaw, Poland','Gdansk, Poland',
  'Brussels, Belgium','Bruges, Belgium','Ghent, Belgium',
  'Stockholm, Sweden','Gothenburg, Sweden','Oslo, Norway','Bergen, Norway','Copenhagen, Denmark',
  'Helsinki, Finland','Reykjavik, Iceland','Tallinn, Estonia','Riga, Latvia','Vilnius, Lithuania',
  'Athens, Greece','Santorini, Greece','Mykonos, Greece','Rhodes, Greece','Thessaloniki, Greece','Crete, Greece',
  'Istanbul, Turkey','Cappadocia, Turkey','Antalya, Turkey','Bodrum, Turkey',
  'Dubrovnik, Croatia','Split, Croatia','Hvar, Croatia','Zadar, Croatia',
  'Ljubljana, Slovenia','Piran, Slovenia',
  'Valletta, Malta','Limassol, Cyprus',
  'Bucharest, Romania','Sofia, Bulgaria','Belgrade, Serbia','Sarajevo, Bosnia and Herzegovina',
  'Monaco','Luxembourg City, Luxembourg',
  // Middle East & North Africa
  'Dubai, UAE','Abu Dhabi, UAE','Doha, Qatar','Muscat, Oman',
  'Amman, Jordan','Petra, Jordan','Tel Aviv, Israel','Jerusalem, Israel','Eilat, Israel',
  'Cairo, Egypt','Luxor, Egypt','Hurghada, Egypt','Sharm el-Sheikh, Egypt',
  'Marrakech, Morocco','Casablanca, Morocco','Fes, Morocco','Tangier, Morocco',
  'Tunis, Tunisia','Beirut, Lebanon',
  // Sub-Saharan Africa
  'Nairobi, Kenya','Mombasa, Kenya','Zanzibar, Tanzania','Dar es Salaam, Tanzania',
  'Cape Town, South Africa','Johannesburg, South Africa','Durban, South Africa','Kruger, South Africa',
  'Accra, Ghana','Lagos, Nigeria','Abuja, Nigeria','Dakar, Senegal',
  'Mauritius','Seychelles','Reunion Island',
  // South & Central Asia
  'Mumbai, India','Delhi, India','Goa, India','Jaipur, India','Agra, India',
  'Bangalore, India','Chennai, India','Kolkata, India','Hyderabad, India','Kochi, India',
  'Kathmandu, Nepal','Pokhara, Nepal','Colombo, Sri Lanka','Kandy, Sri Lanka',
  'Dhaka, Bangladesh','Lahore, Pakistan','Karachi, Pakistan','Islamabad, Pakistan',
  'Tashkent, Uzbekistan','Samarkand, Uzbekistan',
  // East & Southeast Asia
  'Tokyo, Japan','Osaka, Japan','Kyoto, Japan','Hiroshima, Japan','Sapporo, Japan','Okinawa, Japan',
  'Seoul, South Korea','Busan, South Korea','Jeju, South Korea',
  'Beijing, China','Shanghai, China','Hong Kong','Shenzhen, China','Chengdu, China','Guilin, China','Xi\'an, China',
  'Taipei, Taiwan','Tainan, Taiwan',
  'Bangkok, Thailand','Chiang Mai, Thailand','Phuket, Thailand','Koh Samui, Thailand','Krabi, Thailand',
  'Singapore','Kuala Lumpur, Malaysia','Penang, Malaysia','Langkawi, Malaysia',
  'Bali, Indonesia','Jakarta, Indonesia','Lombok, Indonesia','Yogyakarta, Indonesia',
  'Manila, Philippines','Cebu, Philippines','Palawan, Philippines','Boracay, Philippines',
  'Ho Chi Minh City, Vietnam','Hanoi, Vietnam','Da Nang, Vietnam','Hoi An, Vietnam','Ha Long Bay, Vietnam',
  'Siem Reap, Cambodia','Phnom Penh, Cambodia',
  'Vientiane, Laos','Luang Prabang, Laos',
  'Yangon, Myanmar','Bagan, Myanmar',
  // Oceania
  'Sydney, Australia','Melbourne, Australia','Brisbane, Australia','Perth, Australia',
  'Gold Coast, Australia','Cairns, Australia','Adelaide, Australia','Darwin, Australia','Hobart, Australia',
  'Auckland, New Zealand','Queenstown, New Zealand','Wellington, New Zealand','Christchurch, New Zealand',
  'Fiji','Tahiti, French Polynesia','Bora Bora, French Polynesia','Maldives',
  'Papeete, French Polynesia','Nadi, Fiji','Port Vila, Vanuatu',
  // Canada
  'Toronto, Canada','Vancouver, Canada','Montreal, Canada','Calgary, Canada',
  'Quebec City, Canada','Ottawa, Canada','Banff, Canada','Whistler, Canada',
  'Halifax, Canada','Victoria, Canada','Winnipeg, Canada','Edmonton, Canada',
  // Mexico
  'Mexico City, Mexico','Cancun, Mexico','Tulum, Mexico','Playa del Carmen, Mexico',
  'Los Cabos, Mexico','Puerto Vallarta, Mexico','Guadalajara, Mexico','Monterrey, Mexico',
  'Oaxaca, Mexico','Merida, Mexico','San Miguel de Allende, Mexico','Mazatlan, Mexico',
  // Central America & Caribbean
  'Guatemala City, Guatemala','Antigua, Guatemala','Lake Atitlan, Guatemala','Tikal, Guatemala',
  'Havana, Cuba','Trinidad, Cuba','Punta Cana, Dominican Republic','Santo Domingo, Dominican Republic',
  'Nassau, Bahamas','Bridgetown, Barbados','Montego Bay, Jamaica','Kingston, Jamaica','Aruba',
  'San Jose, Costa Rica','Manuel Antonio, Costa Rica','Liberia, Costa Rica',
  'Panama City, Panama','Boquete, Panama',
  'Belize City, Belize','San Pedro, Belize',
  'Managua, Nicaragua','Granada, Nicaragua',
  'Tegucigalpa, Honduras','Roatan, Honduras',
  'San Salvador, El Salvador',
  // South America
  'Bogota, Colombia','Medellin, Colombia','Cartagena, Colombia','Santa Marta, Colombia',
  'Lima, Peru','Cusco, Peru','Machu Picchu, Peru','Arequipa, Peru',
  'Quito, Ecuador','Galapagos Islands, Ecuador','Cuenca, Ecuador',
  'Buenos Aires, Argentina','Mendoza, Argentina','Bariloche, Argentina','Patagonia, Argentina',
  'Rio de Janeiro, Brazil','Sao Paulo, Brazil','Florianopolis, Brazil','Salvador, Brazil','Iguazu Falls, Brazil',
  'Santiago, Chile','Valparaiso, Chile','Torres del Paine, Chile','Easter Island, Chile',
  'Montevideo, Uruguay','Punta del Este, Uruguay',
  'La Paz, Bolivia','Sucre, Bolivia','Uyuni, Bolivia',
  'Caracas, Venezuela','Asuncion, Paraguay',
  'Georgetown, Guyana','Paramaribo, Suriname',
  // Additional Europe
  'Palma de Mallorca, Spain','Tenerife, Spain','Lanzarote, Spain','Gran Canaria, Spain',
  'Brest, France','Nantes, France','Montpellier, France','Toulouse, France','Perpignan, France',
  'Turin, Italy','Bologna, Italy','Palermo, Italy','Catania, Italy','Bari, Italy','Pisa, Italy','Sicily, Italy','Taormina, Sicily','Agrigento, Sicily','Syracuse, Sicily','Ragusa, Sicily',
  'Alicante, Spain','Malaga, Spain','Bilbao, Spain','Cordoba, Spain',
  'Porto Santo, Portugal','Madeira, Portugal','Azores, Portugal',
  'Nicosia, Cyprus','Paphos, Cyprus',
  'Tbilisi, Georgia','Yerevan, Armenia','Baku, Azerbaijan',
  'Chisinau, Moldova','Skopje, North Macedonia','Tirana, Albania','Podgorica, Montenegro','Pristina, Kosovo',
  'Valletta, Malta','Gozo, Malta',
  'Innsbruck, Austria','Graz, Austria','Linz, Austria',
  'Bern, Switzerland','Basel, Switzerland','Zermatt, Switzerland','Davos, Switzerland',
  'Eindhoven, Netherlands','The Hague, Netherlands','Utrecht, Netherlands',
  'Antwerp, Belgium','Liege, Belgium',
  'Gothenburg, Sweden','Malmo, Sweden','Uppsala, Sweden',
  'Tampere, Finland','Turku, Finland','Rovaniemi, Finland',
  'Aarhus, Denmark','Odense, Denmark',
  'Stavanger, Norway','Tromso, Norway','Alesund, Norway',
  // Additional Middle East & Africa
  'Riyadh, Saudi Arabia','Jeddah, Saudi Arabia','Mecca, Saudi Arabia','Medina, Saudi Arabia',
  'Kuwait City, Kuwait','Manama, Bahrain','Musandam, Oman','Salalah, Oman',
  'Aqaba, Jordan','Dead Sea, Jordan',
  'Haifa, Israel','Nazareth, Israel',
  'Addis Ababa, Ethiopia','Kampala, Uganda','Kigali, Rwanda','Dar es Salaam, Tanzania',
  'Maputo, Mozambique','Lusaka, Zambia','Harare, Zimbabwe','Windhoek, Namibia','Gaborone, Botswana',
  'Dakar, Senegal','Abidjan, Ivory Coast','Accra, Ghana','Lome, Togo','Cotonou, Benin',
  'Tunis, Tunisia','Sfax, Tunisia','Sousse, Tunisia',
  'Alexandria, Egypt','Aswan, Egypt','Port Said, Egypt',
  // Additional Asia
  'Hanoi, Vietnam','Nha Trang, Vietnam','Hue, Vietnam','Mui Ne, Vietnam',
  'Colombo, Sri Lanka','Negombo, Sri Lanka','Galle, Sri Lanka',
  'Dhaka, Bangladesh','Chittagong, Bangladesh',
  'Kathmandu, Nepal','Pokhara, Nepal','Chitwan, Nepal',
  'Ulaanbaatar, Mongolia',
  'Almaty, Kazakhstan','Nur-Sultan, Kazakhstan','Tashkent, Uzbekistan','Bishkek, Kyrgyzstan',
  'Phnom Penh, Cambodia','Battambang, Cambodia',
  'Vientiane, Laos','Luang Prabang, Laos','Vang Vieng, Laos',
  'Mandalay, Myanmar','Inle Lake, Myanmar','Bagan, Myanmar',
  'Nusa Dua, Indonesia','Seminyak, Bali','Ubud, Bali','Komodo, Indonesia','Raja Ampat, Indonesia',
  'Cebu, Philippines','Davao, Philippines','Boracay, Philippines',
  'Penang, Malaysia','Kuching, Malaysia','Kota Kinabalu, Malaysia','Johor Bahru, Malaysia',
  // Additional Americas
  'Whistler, Canada','Kelowna, Canada','Saskatoon, Canada','Thunder Bay, Canada','Fredericton, Canada',
  'Guadalajara, Mexico','Puebla, Mexico','Veracruz, Mexico','Tijuana, Mexico','Leon, Mexico',
  'Medellín, Colombia','Cali, Colombia','Barranquilla, Colombia',
  'Guayaquil, Ecuador','Otavalo, Ecuador',
  'Recife, Brazil','Manaus, Brazil','Belo Horizonte, Brazil','Curitiba, Brazil','Porto Alegre, Brazil',
  'Asuncion, Paraguay','Ciudad del Este, Paraguay',
  'Sucre, Bolivia','Cochabamba, Bolivia','Santa Cruz, Bolivia',
  'Trujillo, Peru','Iquitos, Peru','Puno, Peru',
  'Rosario, Argentina','Cordoba, Argentina','Salta, Argentina','Mar del Plata, Argentina',
  'Montevideo, Uruguay','Colonia del Sacramento, Uruguay',
  'Panama City Beach, Panama','Bocas del Toro, Panama',
  'San Pedro Sula, Honduras','La Ceiba, Honduras',
  'Cartago, Costa Rica','Quepos, Costa Rica','Jaco, Costa Rica',
  'Flores, Guatemala','Quetzaltenango, Guatemala',
  'Negril, Jamaica','Ocho Rios, Jamaica','Port Antonio, Jamaica',
  'Providenciales, Turks and Caicos','George Town, Cayman Islands',
  'Charlotte Amalie, US Virgin Islands','Frederiksted, US Virgin Islands',
  'Fort-de-France, Martinique','Pointe-a-Pitre, Guadeloupe','Castries, St Lucia',
  'Kingstown, St Vincent','Basseterre, St Kitts','Saint George, Grenada',
  // Russia & Siberia
  'Moscow, Russia','Saint Petersburg, Russia','Novosibirsk, Russia','Yekaterinburg, Russia',
  'Kazan, Russia','Nizhny Novgorod, Russia','Chelyabinsk, Russia','Omsk, Russia',
  'Samara, Russia','Rostov-on-Don, Russia','Ufa, Russia','Krasnoyarsk, Russia',
  'Irkutsk, Russia','Vladivostok, Russia','Khabarovsk, Russia','Yakutsk, Russia',
  'Norilsk, Russia','Tomsk, Russia','Kemerovo, Russia','Barnaul, Russia',
  'Tyumen, Russia','Surgut, Russia','Nizhnevartovsk, Russia','Lake Baikal, Russia',
  'Murmansk, Russia','Arkhangelsk, Russia','Sochi, Russia','Kaliningrad, Russia',
  'Perm, Russia','Saratov, Russia','Volgograd, Russia','Voronezh, Russia',
  'Siberia, Russia','Western Siberia, Russia','Eastern Siberia, Russia',
  // Greenland
  'Nuuk, Greenland','Ilulissat, Greenland','Sisimiut, Greenland','Kangerlussuaq, Greenland',
  // Central Asia & Caucasus extras
  'Ashgabat, Turkmenistan','Dushanbe, Tajikistan','Kabul, Afghanistan',
  'Tbilisi, Georgia','Batumi, Georgia','Kutaisi, Georgia',
  'Yerevan, Armenia','Gyumri, Armenia',
  'Baku, Azerbaijan','Ganja, Azerbaijan','Sheki, Azerbaijan',
  // More Europe
  'Minsk, Belarus','Lviv, Ukraine','Kyiv, Ukraine','Odessa, Ukraine','Kharkiv, Ukraine',
  'Chisinau, Moldova','Tiraspol, Moldova',
  'Reykjavik, Iceland','Akureyri, Iceland',
  'Torshavn, Faroe Islands','Longyearbyen, Svalbard',
  'San Marino','Vaduz, Liechtenstein','Andorra la Vella, Andorra',
  'Podgorica, Montenegro','Kotor, Montenegro','Budva, Montenegro',
  'Ohrid, North Macedonia','Bitola, North Macedonia',
  'Berat, Albania','Sarande, Albania','Shkoder, Albania',
  'Mostar, Bosnia and Herzegovina','Banja Luka, Bosnia and Herzegovina',
  // More Asia
  // China — major & well-known cities
  'Guangzhou, China','Wuhan, China','Tianjin, China','Qingdao, China','Suzhou, China',
  'Xiamen, China','Zhengzhou, China','Changsha, China','Nanjing, China','Hangzhou, China',
  'Chongqing, China','Kunming, China','Lijiang, China','Wuxi, China','Ningbo, China',
  'Foshan, China','Wenzhou, China','Zhuhai, China','Shenyang, China','Jinan, China',
  'Xian, China','Kashgar, China','Lhasa, Tibet','Urumqi, China','Harbin, China',
  'Dalian, China','Macau','Haikou, China','Sanya, China','Hefei, China','Fuzhou, China',
  'Pyongyang, North Korea',
  'Ulaanbaatar, Mongolia','Erdenet, Mongolia',
  // More India — famous cities most people know
  'Varanasi, India','Amritsar, India','Udaipur, India','Jodhpur, India','Jaisalmer, India',
  'Pune, India','Ahmedabad, India','Mysore, India','Chandigarh, India','Pondicherry, India',
  'Darjeeling, India','Shimla, India','Manali, India','Leh, India','Coimbatore, India',
  // Middle East — major well-known cities
  'Tehran, Iran','Isfahan, Iran','Shiraz, Iran','Mashhad, Iran','Tabriz, Iran',
  'Baghdad, Iraq','Erbil, Iraq','Basra, Iraq',
  'Damascus, Syria','Aleppo, Syria',
  'Izmir, Turkey','Trabzon, Turkey','Ankara, Turkey','Gaziantep, Turkey','Konya, Turkey',
  'Sanaa, Yemen','Aden, Yemen',
  'Nicosia, Cyprus',
  // More Turkey & Pakistan well-known
  'Bursa, Turkey','Konya, Turkey',
  'Peshawar, Pakistan','Quetta, Pakistan','Multan, Pakistan','Faisalabad, Pakistan',
  // More Africa well-known
  'Nairobi, Kenya','Mombasa, Kenya','Zanzibar, Tanzania',
  'Marrakech, Morocco','Casablanca, Morocco','Fes, Morocco','Tangier, Morocco','Agadir, Morocco','Essaouira, Morocco',
  'Alexandria, Egypt','Luxor, Egypt','Hurghada, Egypt','Sharm el-Sheikh, Egypt',
  'Tunis, Tunisia','Sfax, Tunisia','Djerba, Tunisia',
  'Algiers, Algeria','Oran, Algeria','Constantine, Algeria',
  'Tripoli, Libya',
  'Khartoum, Sudan','Addis Ababa, Ethiopia','Asmara, Eritrea',
  'Accra, Ghana','Kumasi, Ghana',
  'Abuja, Nigeria','Lagos, Nigeria','Kano, Nigeria','Ibadan, Nigeria',
  'Dakar, Senegal','Abidjan, Ivory Coast',
  'Nairobi, Kenya','Kampala, Uganda','Kigali, Rwanda',
  'Cape Town, South Africa','Johannesburg, South Africa','Durban, South Africa','Pretoria, South Africa',
  // More Americas well-known
  'Havana, Cuba','Varadero, Cuba',
  'Port-au-Prince, Haiti','Santo Domingo, Dominican Republic',
  'San Jose, Costa Rica',
  'Caracas, Venezuela','Maracaibo, Venezuela',
  'Georgetown, Guyana','Paramaribo, Suriname','Cayenne, French Guiana',
  'Belem, Brazil','Natal, Brazil','Fortaleza, Brazil','Maceio, Brazil',
  // More Europe well-known
  'Bratislava, Slovakia','Kosice, Slovakia',
  'Zagreb, Croatia','Rijeka, Croatia',
  'Skopje, North Macedonia',
  'Tirana, Albania',
  'Nicosia, Cyprus',
  'Valletta, Malta',
  'Reykjavik, Iceland',
  'Vilnius, Lithuania','Kaunas, Lithuania',
  'Riga, Latvia','Liepaja, Latvia',
  'Tallinn, Estonia','Tartu, Estonia',
  'Kathmandu, Nepal','Pokhara, Nepal','Lukla, Nepal',
  'Thimphu, Bhutan','Paro, Bhutan',
  'Male, Maldives','Addu Atoll, Maldives',
  'Dili, East Timor','Honiara, Solomon Islands','Suva, Fiji','Apia, Samoa',
  'Nuku\'alofa, Tonga','Port Moresby, Papua New Guinea',
  // More Africa
  'Tripoli, Libya','Benghazi, Libya',
  'Khartoum, Sudan','Juba, South Sudan',
  'Mogadishu, Somalia','Djibouti City, Djibouti','Asmara, Eritrea','Addis Ababa, Ethiopia',
  'Antananarivo, Madagascar','Moroni, Comoros','Victoria, Seychelles',
  'Windhoek, Namibia','Swakopmund, Namibia','Etosha, Namibia',
  'Gaborone, Botswana','Maun, Botswana','Chobe, Botswana',
  'Harare, Zimbabwe','Victoria Falls, Zimbabwe','Bulawayo, Zimbabwe',
  'Lusaka, Zambia','Livingstone, Zambia',
  'Lilongwe, Malawi','Blantyre, Malawi',
  'Maputo, Mozambique','Beira, Mozambique','Pemba, Mozambique',
  'Kampala, Uganda','Entebbe, Uganda','Jinja, Uganda',
  'Kigali, Rwanda','Gisenyi, Rwanda',
  'Bujumbura, Burundi',
  'Libreville, Gabon','Yaounde, Cameroon','Douala, Cameroon',
  'Kinshasa, DRC','Lubumbashi, DRC',
  'Brazzaville, Republic of Congo',
  'Bangui, Central African Republic',
  'N\'Djamena, Chad',
  'Niamey, Niger','Ouagadougou, Burkina Faso',
  'Bamako, Mali','Timbuktu, Mali',
  'Conakry, Guinea','Freetown, Sierra Leone','Monrovia, Liberia',
  'Yamoussoukro, Ivory Coast',
  'Lome, Togo','Porto-Novo, Benin',
  'Malabo, Equatorial Guinea',
  // US Coastal & Island Gems
  'Cape Cod, MA','Nantucket, MA',"Martha's Vineyard, MA",'Outer Banks, NC','Hilton Head, SC',
  'Cape May, NJ','Jekyll Island, GA','Amelia Island, FL','St. Augustine, FL','Marco Island, FL',
  'Sanibel Island, FL','Clearwater, FL','Fort Myers, FL','Tybee Island, GA','Wrightsville Beach, NC',
  'Rehoboth Beach, DE','Ocean City, MD',
  // US Mountains, Parks & Outdoors
  'Grand Canyon, AZ','Joshua Tree, CA','Zion, UT','Bryce Canyon, UT','Arches National Park, UT',
  'Lake Placid, NY','Finger Lakes, NY','Stowe, VT','Bar Harbor, ME','Newport, RI',
  'Gatlinburg, TN','Boone, NC','Williamsburg, VA','Shenandoah Valley, VA','Hot Springs, AR',
  'Steamboat Springs, CO','Durango, CO','Ouray, CO','Whitefish, MT','Hood River, OR',
  'Leavenworth, WA','Bellingham, WA','Astoria, OR',
  // US Southwest & California
  'Carmel, CA','Mendocino, CA','San Luis Obispo, CA','Santa Cruz, CA','Monterey, CA',
  'Fredericksburg, TX','Marfa, TX',
  // Greece — more islands
  'Corfu, Greece','Zakynthos, Greece','Lefkada, Greece','Paros, Greece','Naxos, Greece',
  'Milos, Greece','Skiathos, Greece','Kefalonia, Greece','Lesbos, Greece','Kos, Greece',
  // Italy — culture & nature
  'Cinque Terre, Italy','Dolomites, Italy','Matera, Italy','Lecce, Italy','Siena, Italy',
  'Verona, Italy','Trieste, Italy','Perugia, Italy','Agrigento, Italy','Trapani, Italy',
  // France — regions
  'Normandy, France','Brittany, France','Loire Valley, France','Alsace, France','Burgundy, France',
  'Dordogne, France','Corsica, France',
  // Scandinavia extras
  'Lofoten Islands, Norway','Flam, Norway','Geirangerfjord, Norway',
  'Abisko, Sweden','Gotland, Sweden','Visby, Sweden','Bornholm, Denmark',
  // Eastern Europe
  'Wroclaw, Poland','Poznan, Poland','Zakopane, Poland','Bled, Slovenia',
  'Plitvice Lakes, Croatia','Brac, Croatia','Vis, Croatia','Mljet, Croatia','Sibenik, Croatia',
  // Portugal Islands
  'Funchal, Madeira, Portugal','Ponta Delgada, Azores, Portugal',
  // Thailand extras
  'Chiang Rai, Thailand','Koh Tao, Thailand','Koh Phangan, Thailand','Hua Hin, Thailand',
  'Pai, Thailand','Ayutthaya, Thailand','Khao Yai, Thailand','Kanchanaburi, Thailand',
  // Bali & Indonesia extras
  'Canggu, Bali','Amed, Bali','Gili Islands, Indonesia','Flores, Indonesia',
  'Nusa Penida, Indonesia','Sumba, Indonesia','Belitung, Indonesia',
  // Philippines extras
  'El Nido, Philippines','Siargao, Philippines','Coron, Philippines',
  'Dumaguete, Philippines','Siquijor, Philippines',
  // Vietnam & Indochina extras
  'Ha Giang, Vietnam','Dalat, Vietnam','Phu Quoc, Vietnam',
  'Kep, Cambodia','Kampot, Cambodia','Mekong Delta, Vietnam',
  // Pacific & Oceania
  'Palau','Noumea, New Caledonia','Rarotonga, Cook Islands','Moorea, French Polynesia',
  'Rotorua, New Zealand','Abel Tasman, New Zealand','Milford Sound, New Zealand','Napier, New Zealand',
  'Byron Bay, Australia','Broome, Australia','Margaret River, Australia','Uluru, Australia',
  'Port Douglas, Australia','Noosa, Australia','Kakadu, Australia','Exmouth, Australia',
  'Kangaroo Island, Australia',
  // Mexico extras
  'Bacalar, Mexico','Holbox, Mexico','Sayulita, Mexico','Todos Santos, Mexico',
  'Guanajuato, Mexico','Morelia, Mexico','Taxco, Mexico','Copper Canyon, Mexico','Zihuatanejo, Mexico',
  // Central America & Caribbean extras
  'Caye Caulker, Belize','Utila, Honduras','San Blas Islands, Panama',
  'Ometepe, Nicaragua','Corn Islands, Nicaragua','Suchitoto, El Salvador',
  // South America extras
  'Mancora, Peru','Colca Canyon, Peru','Paracas, Peru',
  'Fernando de Noronha, Brazil','Chapada Diamantina, Brazil','Jericoacoara, Brazil',
  'Pantanal, Brazil','Bonito, Brazil',
  'San Andres, Colombia','Tayrona, Colombia','Villa de Leyva, Colombia','Salento, Colombia',
  'Margarita Island, Venezuela',
  // Africa — East & Indian Ocean
  'Chefchaouen, Morocco','Merzouga, Morocco',
  'Diani Beach, Kenya','Lamu, Kenya','Masai Mara, Kenya',
  'Arusha, Tanzania','Ngorongoro, Tanzania','Serengeti, Tanzania','Pemba Island, Tanzania','Zanzibar Stone Town, Tanzania',
  'Lake Malawi, Malawi','Inhambane, Mozambique',
  'Nosy Be, Madagascar',"Ile Sainte-Marie, Madagascar",'King Julien, Madagascar',
  // Africa — South
  'Okavango Delta, Botswana','Sossusvlei, Namibia',
  'Drakensberg, South Africa','Stellenbosch, South Africa','Garden Route, South Africa',
  // Middle East extras
  'Wadi Rum, Jordan','Jerash, Jordan',
  'Al Ain, UAE','Sur, Oman','Nizwa, Oman','Wadi Shab, Oman',
  'Dahab, Egypt','Siwa Oasis, Egypt','El Gouna, Egypt',
  // Central Asia extras
  'Khiva, Uzbekistan','Bukhara, Uzbekistan',
  // Additional US — Florida coastline
  'Boca Raton, FL','Delray Beach, FL','Jupiter, FL','Vero Beach, FL','Fort Pierce, FL','Stuart, FL',
  'Cocoa Beach, FL','New Smyrna Beach, FL','St. Pete Beach, FL','Indian Rocks Beach, FL','Tarpon Springs, FL',
  'Crystal River, FL','Cedar Key, FL','Apalachicola, FL','Seaside, FL','Rosemary Beach, FL',
  'Fernandina Beach, FL','St. Augustine Beach, FL','Daytona Beach, FL','Flagler Beach, FL',
  'Islamorada, FL','Marathon, FL','Big Pine Key, FL','Dunedin, FL','Safety Harbor, FL',
  // Additional US — Southeast
  'Pawleys Island, SC','Kiawah Island, SC','Beaufort, SC','Bluffton, SC','Folly Beach, SC',
  'Nags Head, NC','Kill Devil Hills, NC','Kitty Hawk, NC','Duck, NC','Emerald Isle, NC',
  'Atlantic Beach, NC','Beaufort, NC','Ocracoke Island, NC',
  'Chincoteague, VA','Roanoke, VA','Staunton, VA','Winchester, VA','Harrisonburg, VA',
  'Fredericksburg, VA','Luray, VA','Lexington, VA',
  'Brunswick, GA','Valdosta, GA','Macon, GA','Columbus, GA','St. Simons Island, GA',
  'Natchez, MS','Oxford, MS',
  'Hot Springs, AR','Eureka Springs, AR','Bentonville, AR',
  'Franklin, TN','Lynchburg, TN','Pigeon Forge, TN',
  // Additional US — Mid-Atlantic
  'Lancaster, PA','Gettysburg, PA','Hershey, PA','Erie, PA','State College, PA',
  'Bethlehem, PA','Allentown, PA','Jim Thorpe, PA','New Hope, PA',
  'Wildwood, NJ','Stone Harbor, NJ','Avalon, NJ','Long Beach Island, NJ','Asbury Park, NJ',
  'Point Pleasant, NJ','Spring Lake, NJ','Red Bank, NJ','Princeton, NJ',
  // Additional US — New England
  'Provincetown, MA','Falmouth, MA','Hyannis, MA','Gloucester, MA','Salem, MA',
  'Newburyport, MA','Rockport, MA','Plymouth, MA','New Bedford, MA',
  'Northampton, MA','Lenox, MA','Stockbridge, MA','Great Barrington, MA',
  'Narragansett, RI','Westerly, RI','Watch Hill, RI',
  'Mystic, CT','Old Saybrook, CT','Westport, CT','Litchfield, CT',
  'Woodstock, VT','Middlebury, VT','Manchester, VT','Brattleboro, VT','Stowe, VT',
  'Kennebunkport, ME','Ogunquit, ME','York, ME','Rockland, ME','Camden, ME',
  // Additional US — Upstate NY & Hudson Valley
  'Lake George, NY','Cooperstown, NY','Hudson, NY','Woodstock, NY','Rhinebeck, NY',
  'Tarrytown, NY','Cold Spring, NY','Beacon, NY','Sag Harbor, NY','Shelter Island, NY',
  'Fire Island, NY','Southampton, NY','Westhampton Beach, NY',
  'Watkins Glen, NY','Corning, NY','Elmira, NY',
  'Saranac Lake, NY','Old Forge, NY','Inlet, NY','Lake Placid, NY',
  // Additional US — Great Lakes & Midwest
  'Mackinac Island, MI','Charlevoix, MI','Petoskey, MI','Holland, MI','Saugatuck, MI',
  'South Haven, MI','Marquette, MI','Copper Harbor, MI',
  'Door County, WI','Bayfield, WI','Sturgeon Bay, WI','Lake Geneva, WI',
  'Grand Marais, MN','Ely, MN','Brainerd, MN','Red Wing, MN','Northfield, MN',
  'Galena, IL','Bloomington, IL','Champaign, IL',
  'Brown County, IN','Nashville, IN',
  'Hocking Hills, OH','Yellow Springs, OH','Granville, OH',
  'Put-in-Bay, OH','Kelley\'s Island, OH',
  // Additional US — Texas & South Central
  'New Braunfels, TX','Wimberley, TX','Boerne, TX','Kerrville, TX','Rockport, TX',
  'Port Aransas, TX','South Padre Island, TX','Nacogdoches, TX','Jefferson, TX',
  'Eureka Springs, AR',
  // Additional US — Southwest
  'Page, AZ','Monument Valley, AZ','Tombstone, AZ','Bisbee, AZ','Prescott, AZ',
  'Wickenburg, AZ','Jerome, AZ',
  'Breckenridge, CO','Estes Park, CO','Fort Collins, CO','Glenwood Springs, CO',
  'Silverton, CO','Crested Butte, CO','Leadville, CO','Creede, CO',
  'Red River, NM','Cloudcroft, NM','Ruidoso, NM','Truth or Consequences, NM',
  'Silver City, NM',
  // Additional US — Mountain West
  'Coeur d\'Alene, ID','Sandpoint, ID','McCall, ID','Driggs, ID',
  'Cody, WY','Laramie, WY','Sheridan, WY','Thermopolis, WY',
  'Lander, WY','Dubois, WY',
  'Whitefish, MT','Red Lodge, MT','Lewistown, MT',
  // Additional US — Pacific Northwest
  'Cannon Beach, OR','Lincoln City, OR','Newport, OR','Florence, OR',
  'Ashland, OR','Jacksonville, OR',
  'Port Townsend, WA','Sequim, WA','Port Angeles, WA','Anacortes, WA',
  'Friday Harbor, WA','Orcas Island, WA','Bainbridge Island, WA',
  'Walla Walla, WA','Leavenworth, WA',
  // Additional US — California
  'Laguna Beach, CA','Newport Beach, CA','Huntington Beach, CA','Dana Point, CA',
  'San Clemente, CA','Carlsbad, CA','Encinitas, CA','Del Mar, CA','La Jolla, CA','Coronado, CA',
  'Sonoma, CA','Healdsburg, CA','Guerneville, CA','Bodega Bay, CA','Point Reyes, CA',
  'Half Moon Bay, CA','Capitola, CA','Cambria, CA','Morro Bay, CA','Pismo Beach, CA',
  'Solvang, CA','Ojai, CA','Ventura, CA','Oxnard, CA',
  'Mammoth Lakes, CA','Bishop, CA','Chico, CA','Redding, CA','Mount Shasta, CA',
  'Eureka, CA','Arcata, CA','Ferndale, CA','Inverness, CA',
  'Truckee, CA','South Lake Tahoe, CA',
  // Additional US — Hawaii
  'Kailua-Kona, HI','Volcano, HI','Waimea, HI','Hanalei, HI','Princeville, HI','Poipu, HI',
  'Kihei, HI','Paia, HI','Haleiwa, HI','Kailua, HI','Lanai, HI','Molokai, HI',
  // Additional US — Alaska
  'Ketchikan, AK','Skagway, AK','Homer, AK','Seward, AK','Valdez, AK','Kodiak, AK',
  'Talkeetna, AK','Girdwood, AK','Denali, AK','Kenai, AK',
  // Additional US — National Parks
  'Canyonlands, UT','Capitol Reef, UT','Mesa Verde, CO','Rocky Mountain NP, CO',
  'White Sands, NM','Big Bend, TX','Olympic NP, WA','Mount Rainier, WA',
  'Redwood NP, CA','Sequoia NP, CA','Kings Canyon, CA','Death Valley, CA',
  'Acadia NP, ME','Great Smoky Mountains, TN',
  'Cumberland Island, GA','Everglades, FL',
  // Additional Canada
  'Prince Edward Island, Canada','Charlottetown, Canada','St. John\'s, Canada',
  'Moncton, Canada','Fredericton, Canada','Niagara-on-the-Lake, Canada',
  'Tofino, Canada','Ucluelet, Canada','Squamish, Canada',
  'Nelson, Canada','Revelstoke, Canada','Golden, Canada','Canmore, Canada',
  'Jasper, Canada','Lake Louise, Canada','Drumheller, Canada',
  'Churchill, Canada','Whitehorse, Canada','Dawson City, Canada','Yellowknife, Canada',
  'Iqaluit, Canada','Inuvik, Canada',
  // Additional Mexico
  'Isla Mujeres, Mexico','Cozumel, Mexico','Akumal, Mexico','Bacalar, Mexico',
  'Palenque, Mexico','San Cristobal de las Casas, Mexico',
  'Manzanillo, Mexico','Loreto, Mexico','La Paz, Mexico',
  'Ensenada, Mexico','Valle de Guadalupe, Mexico',
  'Real de Catorce, Mexico','Mineral de Pozos, Mexico',
  'Pátzcuaro, Mexico','Uruapan, Mexico','Tequila, Mexico',
  // Additional Caribbean
  'Anguilla','St. Barts','St. Martin / Sint Maarten','Bonaire','Curacao',
  'Turks and Caicos','British Virgin Islands','Dominica',
  'Montserrat','Nevis','Saba',
  // Additional Central America
  'Tamarindo, Costa Rica','Santa Teresa, Costa Rica','Nosara, Costa Rica',
  'Uvita, Costa Rica','Drake Bay, Costa Rica',
  'Portobelo, Panama','Bocas del Toro, Panama',
  'Copan, Honduras',
  'Semuc Champey, Guatemala','Todos Santos, Guatemala',
  'Santa Ana, El Salvador',
  // Additional South America
  'Huaraz, Peru','Chachapoyas, Peru','Mancora, Peru',
  'Manta, Ecuador','Puerto Lopez, Ecuador',
  'Taganga, Colombia','Jardin, Colombia','Villa de Leyva, Colombia',
  'Ilha Grande, Brazil','Paraty, Brazil','Buzios, Brazil',
  'Arraial d\'Ajuda, Brazil','Trancoso, Brazil','Morro de Sao Paulo, Brazil',
  'Ouro Preto, Brazil','Tiradentes, Brazil','Diamantina, Brazil',
  'Alter do Chao, Brazil','Santarem, Brazil',
  'Puerto Natales, Chile','Puerto Varas, Chile','Chiloe Island, Chile',
  'San Pedro de Atacama, Chile','Vina del Mar, Chile',
  'Ushuaia, Argentina','Puerto Madryn, Argentina','Cafayate, Argentina','Tilcara, Argentina',
  'Cabo Polonio, Uruguay',
  'Rurrenabaque, Bolivia','Samaipata, Bolivia',
  // Additional UK & Ireland
  'Bath, UK','Oxford, UK','Cambridge, UK','York, UK','Chester, UK',
  'Stratford-upon-Avon, UK','Cotswolds, UK','Lake District, UK','Cornwall, UK',
  'Brighton, UK','Canterbury, UK',
  'Cardiff, Wales','Snowdonia, Wales','Pembrokeshire, Wales',
  'Isle of Skye, Scotland','Inverness, Scotland','St Andrews, Scotland',
  'Loch Ness, Scotland','Scottish Highlands','Orkney Islands, Scotland',
  'Galway, Ireland','Killarney, Ireland','Cork, Ireland','Dingle, Ireland',
  'Kilkenny, Ireland','Limerick, Ireland','Westport, Ireland',
  'Cliffs of Moher, Ireland','Belfast, Northern Ireland',
  // Additional France
  'Avignon, France','Aix-en-Provence, France','Arles, France','Carcassonne, France',
  'Cannes, France','Antibes, France','Menton, France',
  'Biarritz, France','Bayonne, France','Arcachon, France',
  'Mont Saint-Michel, France','Saint-Malo, France','Dinan, France',
  'Annecy, France','Chamonix, France','Megeve, France','Courchevel, France',
  'Beaune, France','Dijon, France','Colmar, France',
  'Versailles, France','Chartres, France',
  // Additional Italy
  'Ravenna, Italy','Padova, Italy','Treviso, Italy','Bergamo, Italy',
  'Mantova, Italy','Portofino, Italy','Genoa, Italy',
  'Orvieto, Italy','Assisi, Italy','Spoleto, Italy','Todi, Italy',
  'Montalcino, Italy','Montepulciano, Italy','Pienza, Italy',
  'Positano, Italy','Ravello, Italy','Praiano, Italy',
  'Taormina, Italy','Syracuse, Italy','Ragusa, Italy','Modica, Italy',
  'Alberobello, Italy','Ostuni, Italy','Polignano a Mare, Italy',
  'Bolzano, Italy','Merano, Italy','Cortina d\'Ampezzo, Italy',
  // Additional Spain
  'Girona, Spain','Tarragona, Spain','Sitges, Spain','Cadaques, Spain',
  'San Sebastian, Spain','Pamplona, Spain','Burgos, Spain',
  'Leon, Spain','Santiago de Compostela, Spain','Salamanca, Spain',
  'Segovia, Spain','Avila, Spain','Toledo, Spain','Cuenca, Spain','Ronda, Spain',
  'Jerez, Spain','Cadiz, Spain','Tarifa, Spain',
  'Fuerteventura, Spain','La Palma, Spain','La Gomera, Spain',
  // Additional Portugal
  'Sintra, Portugal','Cascais, Portugal','Evora, Portugal','Obidos, Portugal',
  'Nazare, Portugal','Peniche, Portugal','Ericeira, Portugal',
  'Coimbra, Portugal','Aveiro, Portugal','Guimaraes, Portugal',
  'Braga, Portugal','Viana do Castelo, Portugal',
  'Lagos, Portugal','Sagres, Portugal','Tavira, Portugal','Faro, Portugal',
  // Additional Germany
  'Heidelberg, Germany','Nuremberg, Germany','Stuttgart, Germany','Dresden, Germany',
  'Leipzig, Germany','Dusseldorf, Germany','Freiburg, Germany',
  'Rothenburg ob der Tauber, Germany','Wurzburg, Germany','Regensburg, Germany',
  'Baden-Baden, Germany','Berchtesgaden, Germany',
  'Lubeck, Germany','Rostock, Germany','Weimar, Germany','Erfurt, Germany',
  // Additional Austria, Switzerland & Benelux
  'Hallstatt, Austria','Gmunden, Austria','Klagenfurt, Austria',
  'Montreux, Switzerland','Grindelwald, Switzerland','Wengen, Switzerland',
  'Murren, Switzerland','Verbier, Switzerland',
  'Dinant, Belgium','Maastricht, Netherlands','Delft, Netherlands',
  'Leiden, Netherlands','Haarlem, Netherlands','Giethoorn, Netherlands',
  // Additional Scandinavia & Baltics
  'Kiruna, Sweden','Are, Sweden',
  'Molde, Norway','Kristiansand, Norway',
  'Lapland, Finland','Santa Claus Village, Finland','Saariselka, Finland',
  'Parnu, Estonia','Haapsalu, Estonia',
  'Jurmala, Latvia','Kuldiga, Latvia',
  'Trakai, Lithuania','Palanga, Lithuania','Klaipeda, Lithuania',
  // Additional Eastern Europe
  'Cesky Krumlov, Czech Republic','Olomouc, Czech Republic','Karlovy Vary, Czech Republic',
  'Torun, Poland','Gdynia, Poland',
  'Kobarid, Slovenia',
  'Pula, Croatia','Porec, Croatia','Rovinj, Croatia',
  'Perast, Montenegro',
  'Nessebar, Bulgaria','Plovdiv, Bulgaria','Varna, Bulgaria',
  'Sinaia, Romania','Brasov, Romania','Sibiu, Romania','Cluj-Napoca, Romania',
  'Sighisoara, Romania','Timisoara, Romania',
  // Additional Greece & Turkey
  'Delphi, Greece','Nafplio, Greece','Meteora, Greece',
  'Hydra, Greece','Spetses, Greece','Ios, Greece','Samos, Greece',
  'Fethiye, Turkey','Oludeniz, Turkey','Kalkan, Turkey','Kas, Turkey',
  'Selcuk, Turkey','Kusadasi, Turkey','Amasya, Turkey','Safranbolu, Turkey',
  // Additional Middle East
  'Hatta, UAE','Fujairah, UAE','Ras Al Khaimah, UAE','Sharjah, UAE',
  'Al Ula, Saudi Arabia','Abha, Saudi Arabia','Tabuk, Saudi Arabia',
  'Bethlehem, Palestinian Territories','Caesarea, Israel',
  'Socotra Island, Yemen',
  // Additional Japan
  'Nikko, Japan','Kamakura, Japan','Yokohama, Japan','Hakone, Japan',
  'Nara, Japan','Kobe, Japan','Kanazawa, Japan','Matsumoto, Japan',
  'Nagano, Japan','Takayama, Japan','Shirakawa-go, Japan',
  'Beppu, Japan','Nagasaki, Japan','Kumamoto, Japan','Kagoshima, Japan',
  'Yakushima, Japan','Ishigaki, Japan','Miyako-jima, Japan',
  'Hakodate, Japan','Niseko, Japan','Furano, Japan',
  'Sendai, Japan','Karuizawa, Japan','Naoshima, Japan',
  // Additional Korea & Taiwan
  'Gyeongju, South Korea','Jeonju, South Korea','Incheon, South Korea',
  'Tainan, Taiwan', // already there but fine
  'Jiufen, Taiwan','Taroko, Taiwan','Kenting, Taiwan',
  // Additional China
  'Zhangjiajie, China','Yangshuo, China','Fenghuang, China',
  'Dunhuang, China','Zhangye, China','Jiuzhaigou, China',
  'Leshan, China','Huangshan, China',
  'Wuzhen, China','Xitang, China','Tongli, China',
  // Additional Southeast Asia
  'Muang Ngoi, Laos',
  'Sihanoukville, Cambodia',
  'Con Dao, Vietnam','Cat Ba Island, Vietnam',
  'Koh Lanta, Thailand','Koh Chang, Thailand','Koh Lipe, Thailand',
  'Ipoh, Malaysia','Malacca, Malaysia','Cameron Highlands, Malaysia',
  'Tioman Island, Malaysia',
  'Batam, Indonesia','Labuan Bajo, Indonesia',
  'Toraja, Indonesia','Manado, Indonesia',
  'Banda Islands, Indonesia','Ternate, Indonesia',
  'Sagada, Philippines','Banaue, Philippines','Batanes, Philippines',
  // Additional Indian subcontinent
  'Rishikesh, India','Haridwar, India','Mussoorie, India','Nainital, India',
  'Pushkar, India','Bikaner, India','Mount Abu, India',
  'Hampi, India','Varkala, India','Alleppey, India','Munnar, India',
  'Mahabalipuram, India','Madurai, India','Kodaikanal, India','Ooty, India',
  'Andaman Islands, India','Coorg, India','Chikmagalur, India','Wayanad, India',
  'Khajuraho, India','Orchha, India',
  'Sigiriya, Sri Lanka','Dambulla, Sri Lanka','Ella, Sri Lanka',
  'Nuwara Eliya, Sri Lanka','Mirissa, Sri Lanka','Arugam Bay, Sri Lanka',
  'Trincomalee, Sri Lanka',
  'Namche Bazaar, Nepal','Mustang, Nepal','Lumbini, Nepal',
  'Ngapali Beach, Myanmar','Mrauk-U, Myanmar',
  // Additional Africa — East & Horn
  'Samburu, Kenya','Amboseli, Kenya','Mount Kenya, Kenya','Tsavo, Kenya',
  'Mount Kilimanjaro, Tanzania','Mikumi, Tanzania',
  'Lalibela, Ethiopia','Gondar, Ethiopia','Axum, Ethiopia','Harar, Ethiopia',
  'Simien Mountains, Ethiopia','Omo Valley, Ethiopia',
  'Lake Kivu, Rwanda','Bwindi, Uganda',
  'Diani Beach, Kenya',
  // Additional Africa — Southern
  'Hermanus, South Africa','Knysna, South Africa','Plettenberg Bay, South Africa',
  'Oudtshoorn, South Africa',
  'Hwange, Zimbabwe',
  'Spitzkoppe, Namibia','Fish River Canyon, Namibia',
  'South Luangwa, Zambia','Lower Zambezi, Zambia',
  'Tofo Beach, Mozambique','Vilanculos, Mozambique',
  'Isalo, Madagascar','Ranomafana, Madagascar','Toliara, Madagascar',
  // Additional Africa — West & Central
  'Cape Coast, Ghana',
  'Saint-Louis, Senegal','Casamance, Senegal',
  'Banjul, Gambia',
  'Grand Bassam, Ivory Coast',
  'Ouidah, Benin',
  'Djenné, Mali','Agadez, Niger',
  'Goma, DRC',
  // Additional Pacific & Oceania
  'Wanaka, New Zealand','Taupo, New Zealand','New Plymouth, New Zealand',
  'Nelson, New Zealand','Picton, New Zealand','Franz Josef Glacier, New Zealand',
  'Dunedin, New Zealand','Te Anau, New Zealand','Stewart Island, New Zealand',
  'Airlie Beach, Australia','Whitsunday Islands, Australia',
  'Magnetic Island, Australia','Ningaloo Reef, Australia',
  'Barossa Valley, Australia','Blue Mountains, Australia',
  'Hunter Valley, Australia','Jervis Bay, Australia',
  'Alice Springs, Australia','Kununurra, Australia',
  'Launceston, Australia','Cradle Mountain, Australia','Freycinet, Australia',
  'Rarotonga, Cook Islands','Niue',
  'Vanuatu','Tuvalu','Kiribati','Micronesia',
  // Easter eggs
  'Whoville',
  'Miller\'s Planet',
  'Gru\'s Lair, Antarctica',
  'Antarctica',
  'South Pole, Antarctica',
  'McMurdo Station, Antarctica',
  'Ice Age, Antarctica',
])]

const SUITCASES = [
  // Away
  { id:'away-co',       brand:'Away',               name:'The Carry-On',                    size:'carry-on', dimensions:'21.7" × 13.7" × 9"',   liters:39,  weightLbs:7.8  },
  { id:'away-bco',      brand:'Away',               name:'The Bigger Carry-On',             size:'carry-on', dimensions:'22.7" × 14.7" × 9.6"', liters:47,  weightLbs:8.4  },
  { id:'away-ci',       brand:'Away',               name:'The Check-In (Medium)',            size:'medium',   dimensions:'24.5" × 15.6" × 10.6"',liters:58,  weightLbs:9.1  },
  { id:'away-med',      brand:'Away',               name:'The Medium',                      size:'medium',   dimensions:'26.2" × 17.8" × 11"',  liters:69,  weightLbs:9.7  },
  { id:'away-lg',       brand:'Away',               name:'The Large',                       size:'large',    dimensions:'29.2" × 20.5" × 12.5"',liters:92,  weightLbs:10.5 },
  { id:'away-cop',      brand:'Away',               name:'The Carry-On with Pocket',        size:'carry-on', dimensions:'21.7" × 13.7" × 9"',   liters:39,  weightLbs:8.6  },
  { id:'away-lgflex',   brand:'Away',               name:'The Large Flex',                  size:'large',    dimensions:'30.0" × 20.5" × 13.0"',liters:105, weightLbs:11.2 },
  { id:'away-kids',     brand:'Away',               name:'The Kids Carry-On',               size:'carry-on', dimensions:'18.7" × 12.7" × 8"',   liters:28,  weightLbs:5.4  },
  // Samsonite
  { id:'sam-omni20',    brand:'Samsonite',          name:'Omni PC Hardside 20"',            size:'carry-on', dimensions:'20" × 14.5" × 9.5"',   liters:35,  weightLbs:7.5  },
  { id:'sam-omni24',    brand:'Samsonite',          name:'Omni PC Hardside 24"',            size:'medium',   dimensions:'24" × 17.5" × 11.5"',  liters:70,  weightLbs:9.0  },
  { id:'sam-omni28',    brand:'Samsonite',          name:'Omni PC Hardside 28"',            size:'large',    dimensions:'28" × 19.5" × 13"',    liters:100, weightLbs:10.5 },
  { id:'sam-win20',     brand:'Samsonite',          name:'Winfield 2 Hardside 20"',         size:'carry-on', dimensions:'20" × 14" × 9"',        liters:38,  weightLbs:7.7  },
  { id:'sam-win24',     brand:'Samsonite',          name:'Winfield 2 Hardside 24"',         size:'medium',   dimensions:'24" × 17" × 11"',       liters:62,  weightLbs:8.8  },
  { id:'sam-win28',     brand:'Samsonite',          name:'Winfield 2 Hardside 28"',         size:'large',    dimensions:'28" × 19" × 12.5"',    liters:90,  weightLbs:10.2 },
  { id:'sam-free21',    brand:'Samsonite',          name:'Freeform Hardside 21"',           size:'carry-on', dimensions:'21.5" × 15.5" × 9.5"', liters:42,  weightLbs:7.9  },
  { id:'sam-free25',    brand:'Samsonite',          name:'Freeform Hardside 25"',           size:'medium',   dimensions:'25" × 17.5" × 11"',    liters:78,  weightLbs:9.5  },
  { id:'sam-free28',    brand:'Samsonite',          name:'Freeform Hardside 28"',           size:'large',    dimensions:'28" × 19.5" × 12.5"',  liters:98,  weightLbs:10.8 },
  { id:'sam-sol22',     brand:'Samsonite',          name:'Solyte DLX Softside 22"',         size:'carry-on', dimensions:'22" × 14" × 9"',        liters:44,  weightLbs:8.2  },
  // Tumi
  { id:'tumi-a3co',     brand:'Tumi',               name:'Alpha 3 Intl Carry-On',           size:'carry-on', dimensions:'22" × 14" × 9"',        liters:38,  weightLbs:9.0  },
  { id:'tumi-a3med',    brand:'Tumi',               name:'Alpha 3 Medium Trip',             size:'medium',   dimensions:'26" × 18" × 11"',       liters:67,  weightLbs:10.5 },
  { id:'tumi-a3lg',     brand:'Tumi',               name:'Alpha 3 Extended Trip',           size:'large',    dimensions:'30" × 21" × 12"',       liters:100, weightLbs:12.8 },
  { id:'tumi-19co',     brand:'Tumi',               name:'19 Degree Aluminum Carry-On',     size:'carry-on', dimensions:'21.5" × 15" × 8"',     liters:26,  weightLbs:12.1 },
  { id:'tumi-19med',    brand:'Tumi',               name:'19 Degree Aluminum Medium',       size:'medium',   dimensions:'25.5" × 17" × 11"',    liters:55,  weightLbs:14.3 },
  { id:'tumi-19lg',     brand:'Tumi',               name:'19 Degree Aluminum Large',        size:'large',    dimensions:'29" × 20" × 12"',       liters:81,  weightLbs:16.5 },
  { id:'tumi-v4co',     brand:'Tumi',               name:'V4 International Carry-On',       size:'carry-on', dimensions:'22" × 14" × 9"',        liters:36,  weightLbs:8.2  },
  { id:'tumi-v4lg',     brand:'Tumi',               name:'V4 Large Trip Expandable',        size:'large',    dimensions:'30" × 20.5" × 12"',    liters:80,  weightLbs:11.8 },
  // Rimowa
  { id:'rim-esscab',    brand:'Rimowa',             name:'Essential Cabin',                 size:'carry-on', dimensions:'21.7" × 15.8" × 9.1"', liters:36,  weightLbs:6.6  },
  { id:'rim-esschm',    brand:'Rimowa',             name:'Essential Check-In M',            size:'medium',   dimensions:'25.6" × 17.8" × 10.6"',liters:68,  weightLbs:8.8  },
  { id:'rim-esschl',    brand:'Rimowa',             name:'Essential Check-In L',            size:'large',    dimensions:'29.3" × 19.7" × 12"',  liters:87,  weightLbs:10.6 },
  { id:'rim-origcab',   brand:'Rimowa',             name:'Original Cabin',                  size:'carry-on', dimensions:'21.7" × 15.8" × 9.1"', liters:36,  weightLbs:8.4  },
  { id:'rim-origm',     brand:'Rimowa',             name:'Original Check-In M',             size:'medium',   dimensions:'25.6" × 17.8" × 10.6"',liters:68,  weightLbs:11.0 },
  { id:'rim-origl',     brand:'Rimowa',             name:'Original Check-In L',             size:'large',    dimensions:'29.3" × 19.7" × 12"',  liters:87,  weightLbs:12.8 },
  { id:'rim-classcab',  brand:'Rimowa',             name:'Classic Cabin',                   size:'carry-on', dimensions:'21.7" × 15.8" × 9.1"', liters:33,  weightLbs:9.3  },
  { id:'rim-essplusco', brand:'Rimowa',             name:'Essential Plus Cabin',            size:'carry-on', dimensions:'21.7" × 15.8" × 9.1"', liters:38,  weightLbs:7.9  },
  // Briggs & Riley
  { id:'br-baseco',     brand:'Briggs & Riley',     name:'Baseline Carry-On',               size:'carry-on', dimensions:'22" × 14" × 9"',        liters:39,  weightLbs:7.9  },
  { id:'br-basemed',    brand:'Briggs & Riley',     name:'Baseline Medium Expandable',      size:'medium',   dimensions:'25" × 17.5" × 11"',    liters:66,  weightLbs:9.8  },
  { id:'br-baselg',     brand:'Briggs & Riley',     name:'Baseline Large Expandable',       size:'large',    dimensions:'29" × 20" × 13"',       liters:93,  weightLbs:11.5 },
  { id:'br-usco',       brand:'Briggs & Riley',     name:'U.S. Carry-On Expandable',        size:'carry-on', dimensions:'22" × 14" × 9"',        liters:43,  weightLbs:8.4  },
  { id:'br-torq',       brand:'Briggs & Riley',     name:'Torq Hardside Carry-On',          size:'carry-on', dimensions:'21.5" × 15" × 9"',     liters:34,  weightLbs:8.6  },
  { id:'br-symmed',     brand:'Briggs & Riley',     name:'Sympatico Medium Expandable',     size:'medium',   dimensions:'25" × 18" × 11.5"',    liters:72,  weightLbs:9.2  },
  // Travelpro
  { id:'tp-plat22',     brand:'Travelpro',          name:'Platinum Elite Carry-On 22"',     size:'carry-on', dimensions:'22" × 14" × 9"',        liters:43,  weightLbs:8.0  },
  { id:'tp-platci',     brand:'Travelpro',          name:'Platinum Elite Large Check-In',   size:'large',    dimensions:'29" × 20" × 13"',       liters:100, weightLbs:11.3 },
  { id:'tp-max5co',     brand:'Travelpro',          name:'Maxlite 5 Carry-On 22"',          size:'carry-on', dimensions:'22" × 14" × 9"',        liters:39,  weightLbs:5.9  },
  { id:'tp-max5med',    brand:'Travelpro',          name:'Maxlite 5 Medium 25"',            size:'medium',   dimensions:'25" × 17" × 11"',       liters:66,  weightLbs:7.1  },
  { id:'tp-max5lg',     brand:'Travelpro',          name:'Maxlite 5 Large 29"',             size:'large',    dimensions:'29" × 20" × 13"',       liters:94,  weightLbs:8.6  },
  { id:'tp-crew5co',    brand:'Travelpro',          name:'Crew Classic Carry-On 22"',       size:'carry-on', dimensions:'22" × 14" × 9"',        liters:41,  weightLbs:7.4  },
  { id:'tp-walk6',      brand:'Travelpro',          name:'Walkabout 6 Carry-On',            size:'carry-on', dimensions:'21.5" × 14" × 9"',     liters:36,  weightLbs:5.7  },
  { id:'tp-crewess',    brand:'Travelpro',          name:'Crew Essential Carry-On',         size:'carry-on', dimensions:'22" × 14.5" × 9"',     liters:45,  weightLbs:7.5  },
  // Delsey
  { id:'del-chat20',    brand:'Delsey',             name:'Chatelet Hard+ Carry-On 20"',     size:'carry-on', dimensions:'20" × 14" × 9"',        liters:38,  weightLbs:8.5  },
  { id:'del-chat25',    brand:'Delsey',             name:'Chatelet Hard+ Medium 25"',       size:'medium',   dimensions:'25" × 17.5" × 11"',    liters:79,  weightLbs:10.3 },
  { id:'del-chat28',    brand:'Delsey',             name:'Chatelet Hard+ Large 28"',        size:'large',    dimensions:'28" × 19.5" × 12.5"',  liters:99,  weightLbs:12.0 },
  { id:'del-hel21',     brand:'Delsey',             name:'Helium Aero 21"',                 size:'carry-on', dimensions:'21.5" × 14" × 9"',     liters:35,  weightLbs:6.6  },
  { id:'del-hel25',     brand:'Delsey',             name:'Helium Aero 25"',                 size:'medium',   dimensions:'25" × 17" × 10.5"',    liters:72,  weightLbs:8.1  },
  { id:'del-hel29',     brand:'Delsey',             name:'Helium Aero 29"',                 size:'large',    dimensions:'29" × 19.5" × 12.5"',  liters:107, weightLbs:9.7  },
  { id:'del-tur21',     brand:'Delsey',             name:'Turenne Carry-On 21"',            size:'carry-on', dimensions:'21" × 14.5" × 8.5"',   liters:36,  weightLbs:9.4  },
  // American Tourister
  { id:'at-moon21',     brand:'American Tourister', name:'Moonlight Carry-On 21"',          size:'carry-on', dimensions:'21" × 14.5" × 9.5"',   liters:33,  weightLbs:6.8  },
  { id:'at-moon24',     brand:'American Tourister', name:'Moonlight 24"',                   size:'medium',   dimensions:'24" × 17" × 11.5"',    liters:65,  weightLbs:8.4  },
  { id:'at-moon28',     brand:'American Tourister', name:'Moonlight 28"',                   size:'large',    dimensions:'28" × 19.5" × 13"',    liters:91,  weightLbs:9.9  },
  { id:'at-str21',      brand:'American Tourister', name:'Stratum Hardside 21"',            size:'carry-on', dimensions:'21" × 15" × 9"',        liters:36,  weightLbs:7.1  },
  { id:'at-str25',      brand:'American Tourister', name:'Stratum Hardside 25"',            size:'medium',   dimensions:'25" × 17.5" × 11"',    liters:68,  weightLbs:8.9  },
  { id:'at-str29',      brand:'American Tourister', name:'Stratum Hardside 29"',            size:'large',    dimensions:'29" × 20" × 13.5"',    liters:95,  weightLbs:10.4 },
  { id:'at-tri21',      brand:'American Tourister', name:'Triumph DX Carry-On 21"',         size:'carry-on', dimensions:'21" × 14" × 9"',        liters:38,  weightLbs:7.4  },
  // Victorinox
  { id:'vic-spec21',    brand:'Victorinox',         name:'Spectra 3.0 Carry-On 21"',        size:'carry-on', dimensions:'21.5" × 15" × 9"',     liters:36,  weightLbs:8.0  },
  { id:'vic-spec25',    brand:'Victorinox',         name:'Spectra 3.0 Medium 25"',          size:'medium',   dimensions:'25" × 17.5" × 11"',    liters:67,  weightLbs:9.5  },
  { id:'vic-spec29',    brand:'Victorinox',         name:'Spectra 3.0 Large 29"',           size:'large',    dimensions:'29" × 19.5" × 12.5"',  liters:93,  weightLbs:10.8 },
  { id:'vic-conn21',    brand:'Victorinox',         name:'Connex Carry-On 21"',             size:'carry-on', dimensions:'21" × 14.5" × 9"',     liters:39,  weightLbs:7.6  },
  { id:'vic-conn29',    brand:'Victorinox',         name:'Connex Large 29"',                size:'large',    dimensions:'29" × 20" × 13"',       liters:75,  weightLbs:10.2 },
  // Bric's
  { id:'brics-lifeco',  brand:"Bric's",             name:'Life Carry-On 21"',               size:'carry-on', dimensions:'21" × 15" × 9"',        liters:35,  weightLbs:7.2  },
  { id:'brics-lifemed', brand:"Bric's",             name:'Life Medium 27"',                 size:'medium',   dimensions:'27" × 17" × 11"',       liters:65,  weightLbs:9.0  },
  { id:'brics-ulco',    brand:"Bric's",             name:'Ulisse Carry-On 21"',             size:'carry-on', dimensions:'21" × 15" × 9.5"',     liters:40,  weightLbs:7.8  },
  { id:'brics-ulmed',   brand:"Bric's",             name:'Ulisse Medium 27"',               size:'medium',   dimensions:'27" × 18" × 12"',       liters:78,  weightLbs:10.2 },
  // Ricardo Beverly Hills
  { id:'ric-cab21',     brand:'Ricardo',            name:'Cabrillo 2.0 Carry-On 21"',      size:'carry-on', dimensions:'21" × 14" × 9"',        liters:38,  weightLbs:6.5  },
  { id:'ric-cab25',     brand:'Ricardo',            name:'Cabrillo 2.0 Medium 25"',        size:'medium',   dimensions:'25" × 17" × 11"',       liters:67,  weightLbs:8.2  },
  { id:'ric-sea21',     brand:'Ricardo',            name:'Sea Cliff 21"',                   size:'carry-on', dimensions:'21" × 14.5" × 9"',     liters:36,  weightLbs:6.8  },
  { id:'ric-sea25',     brand:'Ricardo',            name:'Sea Cliff 25"',                   size:'medium',   dimensions:'25" × 17" × 11"',       liters:64,  weightLbs:8.0  },
  // Hartmann
  { id:'hart-vig22',    brand:'Hartmann',           name:'Vigor 22" Carry-On',              size:'carry-on', dimensions:'22" × 14.5" × 9"',     liters:40,  weightLbs:8.4  },
  { id:'hart-vig26',    brand:'Hartmann',           name:'Vigor 26" Medium',                size:'medium',   dimensions:'26" × 18" × 11.5"',    liters:75,  weightLbs:10.1 },
  { id:'hart-inn22',    brand:'Hartmann',           name:'Innovaire 22" Carry-On',          size:'carry-on', dimensions:'22" × 14" × 9"',        liters:38,  weightLbs:8.0  },
  { id:'hart-inn27',    brand:'Hartmann',           name:'Innovaire 27" Medium',            size:'medium',   dimensions:'27" × 18" × 11"',       liters:68,  weightLbs:9.8  },
  // Eagle Creek
  { id:'ec-migco',      brand:'Eagle Creek',        name:'Migrate Carry-On 22"',            size:'carry-on', dimensions:'22" × 14" × 9"',        liters:36,  weightLbs:6.4  },
  { id:'ec-mig26',      brand:'Eagle Creek',        name:'Migrate 26" Medium',              size:'medium',   dimensions:'26" × 17.5" × 11"',    liters:68,  weightLbs:8.0  },
  { id:'ec-mig29',      brand:'Eagle Creek',        name:'Migrate 29" Large',               size:'large',    dimensions:'29" × 20" × 13"',       liters:96,  weightLbs:9.4  },
  // Osprey
  { id:'osp-oz22',      brand:'Osprey',             name:'Ozone 22" Carry-On',              size:'carry-on', dimensions:'22" × 14" × 9"',        liters:38,  weightLbs:7.6  },
  { id:'osp-oz26',      brand:'Osprey',             name:'Ozone 26" Medium',                size:'medium',   dimensions:'26" × 17.5" × 11"',    liters:65,  weightLbs:9.1  },
  { id:'osp-transp',    brand:'Osprey',             name:'Transporter Carry-On',            size:'carry-on', dimensions:'21.5" × 14" × 9"',     liters:36,  weightLbs:7.0  },
  // CalPak
  { id:'cal-ambco',     brand:'CalPak',             name:'Ambeur Carry-On 20"',             size:'carry-on', dimensions:'20" × 13.5" × 9"',     liters:35,  weightLbs:6.2  },
  { id:'cal-amblg',     brand:'CalPak',             name:'Ambeur Large 28"',                size:'large',    dimensions:'28" × 19.5" × 13"',    liters:80,  weightLbs:9.3  },
  { id:'cal-hue',       brand:'CalPak',             name:'Hue Carry-On 20"',                size:'carry-on', dimensions:'20" × 14" × 9"',        liters:38,  weightLbs:6.8  },
  { id:'cal-huemed',    brand:'CalPak',             name:'Hue Medium 24"',                  size:'medium',   dimensions:'24" × 17" × 11"',       liters:62,  weightLbs:8.1  },
  // Kenneth Cole Reaction
  { id:'kc-otw20',      brand:'Kenneth Cole',       name:'Out of This World 20"',           size:'carry-on', dimensions:'20" × 14" × 9"',        liters:35,  weightLbs:7.0  },
  { id:'kc-otw24',      brand:'Kenneth Cole',       name:'Out of This World 24"',           size:'medium',   dimensions:'24" × 17" × 11"',       liters:65,  weightLbs:8.8  },
  { id:'kc-otw28',      brand:'Kenneth Cole',       name:'Out of This World 28"',           size:'large',    dimensions:'28" × 19.5" × 13"',    liters:90,  weightLbs:10.2 },
]

const SUITCASE_BRANDS = [...new Set(SUITCASES.map(s => s.brand))]

function classifyClimate(dest) {
  const d = dest.toLowerCase()
  if (/miami|bali|bangkok|phuket|cancun|maldives|hawaii|honolulu|koh samui|singapore|jamaica|barbados|bahamas|fiji|tahiti|bora bora|seychelles|mauritius|zanzibar|punta cana|tulum|playa|key west|da nang|hoi an|goa|cartagena|cairns|darwin|gold coast|panama|costa rica|cebu|colombo|rio|sao paulo|rio de janeiro|guatemala|antigua|lake atitlan|tikal|belize|roatan|manuel antonio|galapagos|mombasa|accra|lagos|dakar|florianopolis|salvador|fortaleza|okinawa|langkawi|lombok|boracay|palawan|luang prabang|vientiane|mandalay|krabi|koh|maui|lahaina|hilo|kauai|nadi|vanuatu|port vila|papeete|reunion|ho chi minh|hanoi|ha long|phnom penh|yangon|guangzhou|shenzhen|xiamen|haikou|sanya|manila|jakarta|kuala lumpur|penang|yangon|colombo|mumbai|chennai|kochi|pondicherry|male|addu|dili|honiara|suva|apia|port moresby|kinshasa|libreville|douala|kampala|entebbe|kigali|nairobi|mombasa|dar es salaam|addis ababa|accra|kumasi|abidjan|dakar|conakry|freetown|monrovia|abuja|lagos|kano|ibadan|lome|cotonou|port-au-prince|havana|varadero|caracas|maracaibo|belem|manaus|fortaleza|recife|natal|maceio/.test(d)) return 'tropical'
  if (/whoville|antarctica|south pole|mcmurdo|ice age|aspen|vail|park city|jackson hole|whistler|queenstown|bozeman|banff|zurich|geneva|reykjavik|oslo|stockholm|helsinki|anchorage|montreal|tallinn|sapporo|patagonia|torres del paine|bariloche|ushuaia|fairbanks|juneau|sitka|glacier|yellowstone|lake tahoe|interlaken|innsbruck|salzburg|lucerne|bergen|tromso|kiruna|riga|vilnius|warsaw|krakow|gdansk|sofia|bucharest|sarajevo|minsk|ulaanbaatar|almaty|moscow|saint petersburg|novosibirsk|yekaterinburg|kazan|chelyabinsk|omsk|krasnoyarsk|irkutsk|vladivostok|khabarovsk|yakutsk|norilsk|tomsk|kemerovo|barnaul|tyumen|surgut|murmansk|arkhangelsk|kaliningrad|perm|volgograd|russia|siberia|greenland|nuuk|ilulissat|sisimiut|kangerlussuaq|harbin|lhasa|tibet|longyearbyen|svalbard|akureyri|bishkek|dushanbe|nur-sultan|astana|thimphu|paro|bhutan|lukla|erdenet|minsk|kyiv|lviv|kharkiv|leh|darjeeling|shimla|manali|srinagar|chandigarh/.test(d)) return 'cold'
  if (/dubai|abu dhabi|doha|riyadh|jeddah|mecca|medina|muscat|cairo|luxor|marrakech|casablanca|las vegas|phoenix|scottsdale|mesa|albuquerque|el paso|jaipur|agra|sedona|santa fe|jordan|amman|israel|tel aviv|jerusalem|hurghada|sharm|fes|tangier|tunis|petra|uyuni|eilat|palm springs|tucson|flagstaff|tehran|isfahan|shiraz|mashhad|tabriz|baghdad|erbil|basra|damascus|aleppo|sanaa|aden|kuwait city|manama|riyadh|algiers|oran|constantine|tripoli|khartoum|niamey|bamako|timbuktu|ouagadougou|n'djamena|bangui|jaisalmer|jodhpur|ahmedabad|kashgar|urumqi|aswan|luxor|hurghada/.test(d)) return 'desert'
  if (/barcelona|madrid|seville|valencia|ibiza|mallorca|lisbon|porto|algarve|athens|santorini|mykonos|rhodes|crete|rome|naples|venice|milan|florence|istanbul|cappadocia|antalya|bodrum|split|dubrovnik|hvar|zadar|nice|marseille|limassol|cyprus|malta|beirut|montego bay|san juan|havana|amalfi|los angeles|san diego|san francisco|napa|santa barbara|bilbao|bordeaux|lyon|valencia|montpelier|thessaloniki|la paz|mendoza|santiago|valparaiso|easter island|montevideo|punta del este|lima|cusco|arequipa|machu picchu|quito|cuenca|medellin|bogota|santa marta|cartagena|beirut|accra|cape town|durban|johannesburg|nairobi|johannesburg/.test(d)) return 'warm'
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
  if (tripType === 'Skiing') return IMG_SKI
  if (tripType === 'Sports Tournament') return IMG_SPORTS
  const cat = getVisualCategory(climate, tripType)
  if (cat === 'business') return IMG_BIZ
  if (cat === 'warm') return IMG_WARM
  if (cat === 'cold') return IMG_COLD
  return IMG_NORM
}

function suggestTripTypes(climate, dest = '') {
  const base = ['Leisure','Business','Beach','Adventure','Family','Backpacking','Skiing','Sports Tournament']
  if (/minsk.*belarus/i.test(dest)) base.push('Dance')
  if (/miller.{0,5}planet/i.test(dest)) base.push('Space Exploration')
  if (/whoville/i.test(dest)) base.push('Christmas Trip')
  if (/gru.{0,5}lair/i.test(dest)) base.push('Villain Getaway')
  if (/antarctica/i.test(dest) && !/gru/i.test(dest)) base.push('Ice Age Survival')
  return base
}

function isUSDestination(dest) {
  if (!dest) return false
  const US_STATE = /,\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)$/i
  return US_STATE.test(dest) ||
    /washington dc/i.test(dest) ||
    /puerto rico/i.test(dest) ||
    /us virgin islands/i.test(dest)
}

// Cap clothing quantities — for long trips recommend washing instead
function smartQty(base, cap) {
  if (base <= cap) return base
  return cap  // will add laundry note
}

const ITINERARY_KW_MAP = {
  water:    ['beach','snorkel','snorkeling','swim','swimming','pool','surf','surfing','kayak','kayaking','dive','diving','scuba','sailing','sail','boat','ocean','sea','lake','river','waterfall','rafting','paddleboard','paddleboarding','fishing','jet ski'],
  formal:   ['dinner','gala','wedding','show','theatre','theater','restaurant','cocktail','dress code','semi-formal','black tie','formal','banquet','reception','opera','ballet','fundraiser'],
  outdoor:  ['hike','hiking','trail','trek','trekking','mountain','camp','camping','forest','national park','safari','wildlife','jungle','canyon','volcano','waterfall','rappel','rappelling','zip line','zip-line','rock climb','backpacking outdoors'],
  business: ['meeting','conference','presentation','office','boardroom','keynote','summit','expo','seminar','workshop','trade show','client dinner','networking'],
  nightlife:['club','clubbing','bar','lounge','party','nightlife','concert','festival','pub','rooftop bar','live music','disco','karaoke'],
  ski:      ['ski','skiing','snowboard','snowboarding','slope','gondola','après-ski','apres ski','powder','chalet'],
  rain:     ['rain','rainy','monsoon','wet season','typhoon','drizzle','umbrella'],
  cold:     ['cold','freezing','arctic','winter','frost','below zero','sub-zero'],
  hot:      ['hot','heat','humid','tropical','sweltering','scorching'],
}

function extractItineraryKeywords(text) {
  const lower = text.toLowerCase()
  const result = {}
  for (const [cat, words] of Object.entries(ITINERARY_KW_MAP)) {
    result[cat] = words.some(w => lower.includes(w))
  }
  return result
}

function generateList(tripType, days, climate, liters = 69, gender = '', dest = '', hotelType = '', travelStyle = 'Average', itineraryKw = {}) {
  const needsLaundryNote = days > 10

  // Capacity factor: carry-on squeezes items, large bag allows more
  const capFactor = liters < 45 ? 0.7 : liters > 80 ? 1.2 : 1.0
  // Pack factor: light packer brings less, heavy packer brings more
  const packFactor = travelStyle === 'Light Packer' ? 0.8 : travelStyle === 'Heavy Packer' ? 1.2 : 1.0

  // Scale to ~7-day laundry cycle: 1.2x days-until-laundry, rounded
  const cycleLen = Math.min(days, 7)
  const socks  = Math.max(1, Math.round(cycleLen * 1.2 * capFactor * packFactor))
  const undies = Math.max(1, Math.round(cycleLen * 1.2 * capFactor * packFactor))

  const shirtCap = Math.max(3, Math.round(7 * capFactor * packFactor)), pantCap = Math.max(2, Math.round(4 * capFactor * packFactor))
  const shirts = smartQty(Math.min(days + 1, 12), shirtCap)

  // Swimsuits scale with trip length: 2 for <1wk, +1 per additional week, max 5
  const swimsuits = Math.min(2 + Math.floor(days / 7), 5)
  // Cold beach or temperate beach = fewer swimsuits
  const beachSwimQty = (climate === 'cold' || climate === 'temperate') ? 1 : Math.min(swimsuits, cycleLen)

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
    { name: isUSDestination(dest) ? 'Government-Issued ID' : 'Passport', qty:1, weight:0.1, packed:false, bag:'carry' },
    { name:'Travel Insurance', qty:1, weight:0.1, packed:false, bag:'carry' },
    { name:'Credit Cards', qty:2, weight:0.1, packed:false, bag:'carry' },
    { name:'Cash', qty:1, weight:0.1, packed:false, bag:'carry' },
  ]
  const health = [
    { name:'Hand Sanitizer', qty:1, weight:0.2, packed:false, bag:'carry' },
    { name:'Band-Aids', qty:1, weight:0.1, packed:false, bag:'carry' },
  ]

  if (tripType === 'Business') {
    const suits = Math.min(Math.max(1, Math.ceil(days / 3)), 3)
    const dressShirts = Math.min(days + 1, 6)
    if (gender === 'Female') {
      clothing.push(
        { name:'Blazer', qty:suits, weight:1.5, packed:false, bag:'main' },
        { name:'Blouse', qty:dressShirts, weight:0.4, packed:false, bag:'main' },
        { name:'Dress Pants / Skirt', qty:Math.min(suits + 1, 4), weight:1.0, packed:false, bag:'main' },
        { name:'Business Dress', qty:1, weight:0.8, packed:false, bag:'main' },
        { name:'T-Shirts (casual)', qty:Math.min(Math.ceil(days / 2), 4), weight:0.5, packed:false, bag:'main' },
        { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
        { name:'Dress Socks / Hosiery', qty:Math.min(dressShirts, 6), weight:0.2, packed:false, bag:'main' },
      )
      footwear.push(
        { name:'Heels / Dress Flats', qty:1, weight:2.0, packed:false, bag:'main' },
        { name:'Casual Shoes', qty:1, weight:2.0, packed:false, bag:'main' },
      )
    } else {
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
    }
    if (climate === 'cold') clothing.push({ name:'Overcoat', qty:1, weight:3.0, packed:false, bag:'main' })
    electronics.push(
      { name:'Laptop', qty:1, weight:4.0, packed:false, bag:'carry' },
      { name:'Laptop Charger', qty:1, weight:0.8, packed:false, bag:'carry' },
      { name:'Universal Power Adapter', qty:1, weight:0.5, packed:false, bag:'carry' },
    )
    documents.push(
      { name:'Business Cards', qty:1, weight:0.1, packed:false, bag:'carry' },
      { name:'Printed Itinerary', qty:1, weight:0.1, packed:false, bag:'carry' },
    )
  } else if (tripType === 'Beach') {
    clothing.push(
      { name:'Swimsuit', qty:beachSwimQty, weight:0.3, packed:false, bag:'main' },
      { name:'Shorts', qty:Math.min(days, 5), weight:0.4, packed:false, bag:'main' },
      { name:'T-Shirts', qty:shirts, weight:0.5, packed:false, bag:'main' },
      { name:'Cover-Up', qty:1, weight:0.3, packed:false, bag:'main' },
      { name:'Light Dress / Linen Shirt', qty:1, weight:0.3, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
      { name:'Socks', qty:Math.max(2, Math.round(cycleLen * 0.5)), weight:0.2, packed:false, bag:'main' },
    )
    if (gender === 'Female') clothing.push({ name:'Sarong / Pareo', qty:1, weight:0.3, packed:false, bag:'main' })
    footwear.push(
      { name:'Sandals', qty:1, weight:1.0, packed:false, bag:'main' },
      { name:'Flip Flops', qty:1, weight:0.5, packed:false, bag:'main' },
      { name:'Sneakers', qty:1, weight:2.0, packed:false, bag:'main' },
    )
    // Cold / temperate beach: add warmth layers instead of intense sun gear
    if (climate === 'cold' || climate === 'temperate') {
      clothing.push({ name:'Light Jacket', qty:1, weight:1.0, packed:false, bag:'main' })
      toiletries.push({ name:'Sunscreen SPF 30', qty:1, weight:0.5, packed:false, bag:'main' })
    } else {
      toiletries.push(
        { name:'Sunscreen SPF 50', qty:2, weight:0.6, packed:false, bag:'main' },
        { name:'After-Sun Lotion', qty:1, weight:0.5, packed:false, bag:'main' },
      )
      clothing.push({ name:'Sun Hat', qty:1, weight:0.3, packed:false, bag:'main' })
      clothing.push({ name:'Sunglasses', qty:1, weight:0.1, packed:false, bag:'carry' })
      health.push({ name:'Bug Spray', qty:1, weight:0.3, packed:false, bag:'main' })
    }
    health.push({ name:'Waterproof Phone Pouch', qty:1, weight:0.1, packed:false, bag:'main' })
  } else if (tripType === 'Adventure') {
    clothing.push(
      { name:'Moisture-Wicking Shirts', qty:Math.min(shirts, 5), weight:0.4, packed:false, bag:'main' },
      { name:'Hiking Pants', qty:Math.min(Math.ceil(days / 2), pantCap), weight:0.8, packed:false, bag:'main' },
      { name:'Shorts', qty:Math.min(Math.ceil(days / 2), 3), weight:0.4, packed:false, bag:'main' },
      { name:'Rain Jacket', qty:1, weight:1.0, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
      { name:'Wool Socks', qty:Math.min(socks, 6), weight:0.3, packed:false, bag:'main' },
    )
    footwear.push(
      { name:'Hiking Boots', qty:1, weight:3.0, packed:false, bag:'main' },
      { name:'Camp Sandals', qty:1, weight:0.8, packed:false, bag:'main' },
    )
    health.push(
      { name:'Blister Bandages', qty:1, weight:0.1, packed:false, bag:'carry' },
      { name:'Sunscreen', qty:1, weight:0.5, packed:false, bag:'main' },
      { name:'First Aid Kit', qty:1, weight:0.8, packed:false, bag:'main' },
    )
    // Climate-specific adventure gear
    if (climate === 'tropical') {
      clothing.push(
        { name:'Quick-Dry Shirts', qty:2, weight:0.3, packed:false, bag:'main' },
        { name:'Swimsuit', qty:1, weight:0.3, packed:false, bag:'main' },
      )
      footwear.push({ name:'Water Shoes', qty:1, weight:0.8, packed:false, bag:'main' })
      health.push({ name:'Bug Spray (DEET)', qty:2, weight:0.4, packed:false, bag:'main' })
      health.push({ name:'Water Purification Tablets', qty:1, weight:0.1, packed:false, bag:'carry' })
    } else if (climate === 'cold') {
      clothing.push(
        { name:'Thermal Base Layer', qty:2, weight:0.6, packed:false, bag:'main' },
        { name:'Fleece Mid-Layer', qty:1, weight:1.2, packed:false, bag:'main' },
        { name:'Insulated Jacket', qty:1, weight:2.0, packed:false, bag:'main' },
      )
      health.push({ name:'Hand Warmers', qty:4, weight:0.1, packed:false, bag:'carry' })
    } else if (climate === 'desert') {
      clothing.push(
        { name:'Long-Sleeve Sun Shirt', qty:2, weight:0.4, packed:false, bag:'main' },
        { name:'Sun Hat / Boonie Hat', qty:1, weight:0.3, packed:false, bag:'main' },
      )
      health.push({ name:'Bug Spray', qty:1, weight:0.3, packed:false, bag:'main' })
      health.push({ name:'Electrolyte Packets', qty:8, weight:0.1, packed:false, bag:'carry' })
    } else {
      clothing.push({ name:'Thermal Base Layer', qty:1, weight:0.6, packed:false, bag:'main' })
      clothing.push({ name:'Fleece', qty:1, weight:1.2, packed:false, bag:'main' })
      health.push({ name:'Bug Spray', qty:1, weight:0.3, packed:false, bag:'main' })
    }
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
      { name:'Sneakers / Walking Shoes', qty:1, weight:2.0, packed:false, bag:'main' },
      { name:'Flip Flops', qty:1, weight:0.5, packed:false, bag:'main' },
    )
    health.push({ name:'Travel Towel', qty:1, weight:0.5, packed:false, bag:'main' })
    documents.push({ name:'Passport Holder', qty:1, weight:0.1, packed:false, bag:'carry' })
    electronics.push({ name:'Travel Padlock', qty:1, weight:0.3, packed:false, bag:'main' })
  } else if (tripType === 'Skiing') {
    clothing.push(
      { name:'Ski Jacket', qty:1, weight:2.5, packed:false, bag:'main' },
      { name:'Ski Pants', qty:1, weight:1.8, packed:false, bag:'main' },
      { name:'Thermal Base Layer (Top)', qty:2, weight:0.6, packed:false, bag:'main' },
      { name:'Thermal Base Layer (Bottom)', qty:2, weight:0.5, packed:false, bag:'main' },
      { name:'Fleece Mid-Layer', qty:1, weight:1.2, packed:false, bag:'main' },
      { name:'Wool Socks', qty:Math.min(socks, 6), weight:0.3, packed:false, bag:'main' },
      { name:'Ski Gloves', qty:1, weight:0.5, packed:false, bag:'main' },
      { name:'Neck Gaiter / Balaclava', qty:1, weight:0.2, packed:false, bag:'main' },
      { name:'Warm Hat / Beanie', qty:1, weight:0.2, packed:false, bag:'main' },
      { name:'Goggles', qty:1, weight:0.4, packed:false, bag:'boot bag' },
      { name:'Helmet', qty:1, weight:2.5, packed:false, bag:'boot bag' },
      { name:'Casual Après-Ski Outfit', qty:Math.min(Math.ceil(days / 2), 3), weight:0.6, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
    )
    footwear.push(
      { name:'Skis / Ski Bag (or rent on-site)', qty:1, weight:15.0, packed:false, bag:'boot bag' },
      { name:'Ski Poles (or rent on-site)', qty:1, weight:2.5, packed:false, bag:'boot bag' },
      { name:'Ski Boots (or rent on-site)', qty:1, weight:7.0, packed:false, bag:'boot bag' },
      { name:'Warm Snow Boots (après-ski)', qty:1, weight:3.0, packed:false, bag:'boot bag' },
    )
    health.push(
      { name:'Sunscreen SPF 50 (UV is intense at altitude)', qty:2, weight:0.5, packed:false, bag:'carry' },
      { name:'Lip Balm with SPF', qty:1, weight:0.1, packed:false, bag:'carry' },
      { name:'Hand Warmers', qty:6, weight:0.1, packed:false, bag:'carry' },
    )
  } else if (tripType === 'Sports Tournament') {
    clothing.push(
      { name:'Jersey / Team Uniform', qty:2, weight:0.4, packed:false, bag:'main' },
      { name:'Athletic Shorts', qty:Math.min(days + 1, 5), weight:0.3, packed:false, bag:'main' },
      { name:'Compression Shorts / Leggings', qty:Math.min(Math.ceil(days / 2), 3), weight:0.3, packed:false, bag:'main' },
      { name:'Athletic Socks', qty:Math.min(socks, 7), weight:0.2, packed:false, bag:'main' },
      { name:'Moisture-Wicking T-Shirts', qty:Math.min(shirts, 5), weight:0.4, packed:false, bag:'main' },
      { name:'Casual Outfit (off-field)', qty:Math.min(Math.ceil(days / 2), 3), weight:0.6, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
    )
    if (gender === 'Female') clothing.push({ name:'Sports Bra', qty:Math.min(Math.ceil(days / 2), 4), weight:0.2, packed:false, bag:'main' })
    footwear.push(
      { name:'Athletic / Sport Shoes', qty:1, weight:2.2, packed:false, bag:'main' },
      { name:'Casual Shoes / Slides', qty:1, weight:1.0, packed:false, bag:'main' },
    )
    health.push(
      { name:'Athletic Tape / KT Tape', qty:1, weight:0.2, packed:false, bag:'carry' },
      { name:'Muscle Rub / Recovery Balm', qty:1, weight:0.3, packed:false, bag:'main' },
      { name:'Reusable Water Bottle', qty:1, weight:0.5, packed:false, bag:'main' },
      { name:'Protein Bars / Snacks', qty:Math.min(days * 2, 10), weight:0.1, packed:false, bag:'carry' },
    )
  } else if (tripType === 'Family') {
    clothing.push(
      { name:'T-Shirts', qty:shirts, weight:0.5, packed:false, bag:'main' },
      { name:'Pants / Jeans', qty:Math.min(Math.ceil(days / 2), pantCap), weight:1.2, packed:false, bag:'main' },
      { name:'Shorts', qty:Math.min(Math.ceil(days / 2), 3), weight:0.4, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
      { name:'Socks', qty:socks, weight:0.2, packed:false, bag:'main' },
    )
    if (gender === 'Female') clothing.push({ name:'Casual Dress', qty:Math.min(2, Math.ceil(days / 4)), weight:0.4, packed:false, bag:'main' })
    footwear.push(
      { name:'Sneakers', qty:1, weight:2.0, packed:false, bag:'main' },
      { name:'Sandals', qty:1, weight:1.0, packed:false, bag:'main' },
    )
    health.push(
      { name:"Children's Medication", qty:1, weight:0.3, packed:false, bag:'carry' },
      { name:'Sunscreen', qty:2, weight:0.5, packed:false, bag:'main' },
      { name:'Insect Repellent', qty:1, weight:0.3, packed:false, bag:'main' },
    )
    electronics.push({ name:'Tablet / Kids Device', qty:1, weight:1.5, packed:false, bag:'carry' })
  } else {
    // Leisure
    clothing.push(
      { name:'T-Shirts', qty:shirts, weight:0.5, packed:false, bag:'main' },
      { name:'Pants / Jeans', qty:Math.min(Math.ceil(days / 2), pantCap), weight:1.2, packed:false, bag:'main' },
      { name:'Shorts', qty:Math.min(Math.ceil(days / 2), 3), weight:0.4, packed:false, bag:'main' },
      { name:'Underwear', qty:undies, weight:0.2, packed:false, bag:'main' },
      { name:'Socks', qty:socks, weight:0.2, packed:false, bag:'main' },
      { name:'One Nice Outfit (evening)', qty:1, weight:0.8, packed:false, bag:'main' },
    )
    if (gender === 'Female') clothing.push({ name:'Casual Dress / Skirt', qty:Math.min(Math.ceil(days / 3), 3), weight:0.4, packed:false, bag:'main' })
    footwear.push(
      { name:'Sneakers', qty:1, weight:2.0, packed:false, bag:'main' },
      { name:'Sandals', qty:1, weight:1.0, packed:false, bag:'main' },
    )
  }

  // Gender-specific toiletries
  if (gender === 'Female') {
    toiletries.push({ name:'Makeup Bag / Cosmetics', qty:1, weight:1.0, packed:false, bag:'main' })
    toiletries.push({ name:'Hair Accessories', qty:1, weight:0.2, packed:false, bag:'main' })
  }

  // Climate additions (only for non-Adventure since Adventure handles its own climate gear)
  if (climate === 'tropical') {
    if (!toiletries.find(i => i.name.includes('Sunscreen')))
      toiletries.push({ name:'Sunscreen SPF 50', qty:2, weight:0.5, packed:false, bag:'main' })
    if (!clothing.find(i => i.name === 'Swimsuit') && tripType !== 'Adventure')
      clothing.push({ name:'Swimsuit', qty:Math.max(swimsuits, Math.min(days, 5)), weight:0.3, packed:false, bag:'main' })
    if (!clothing.find(i => i.name === 'Sunglasses'))
      clothing.push({ name:'Sunglasses', qty:1, weight:0.1, packed:false, bag:'carry' })
  } else if (climate === 'cold') {
    if (tripType !== 'Adventure') {
      clothing.push(
        { name:'Heavy Winter Coat', qty:1, weight:3.5, packed:false, bag:'main' },
        { name:'Thermal Base Layers', qty:2, weight:0.6, packed:false, bag:'main' },
        { name:'Gloves', qty:1, weight:0.3, packed:false, bag:'main' },
        { name:'Scarf', qty:1, weight:0.4, packed:false, bag:'main' },
        { name:'Warm Hat', qty:1, weight:0.2, packed:false, bag:'main' },
      )
    } else {
      // Adventure already has cold gear — just add the outer shell if not there
      clothing.push(
        { name:'Gloves', qty:1, weight:0.3, packed:false, bag:'main' },
        { name:'Warm Hat', qty:1, weight:0.2, packed:false, bag:'main' },
      )
    }
    if (!footwear.find(i => i.name.toLowerCase().includes('boot')))
      footwear.push({ name:'Insulated Boots', qty:1, weight:3.0, packed:false, bag:'main' })
  } else if (climate === 'desert') {
    if (!toiletries.find(i => i.name.includes('Sunscreen')))
      toiletries.push({ name:'High-SPF Sunscreen', qty:2, weight:0.6, packed:false, bag:'main' })
    if (!clothing.find(i => i.name.includes('Long-Sleeve') || i.name.includes('Sun Shirt')))
      clothing.push({ name:'Lightweight Long-Sleeve', qty:2, weight:0.4, packed:false, bag:'main' })
    if (!clothing.find(i => i.name.includes('Sun Hat') || i.name.includes('Boonie')))
      clothing.push({ name:'Sun Hat', qty:1, weight:0.3, packed:false, bag:'main' })
    if (!clothing.find(i => i.name === 'Sunglasses'))
      clothing.push({ name:'Sunglasses', qty:1, weight:0.1, packed:false, bag:'carry' })
    if (!health.find(i => i.name.includes('Electrolyte')))
      health.push({ name:'Electrolyte Packets', qty:6, weight:0.1, packed:false, bag:'carry' })
  } else if (climate === 'warm') {
    if (!toiletries.find(i => i.name.includes('Sunscreen')))
      toiletries.push({ name:'Sunscreen SPF 30', qty:1, weight:0.5, packed:false, bag:'main' })
    if (!clothing.find(i => i.name.includes('Jacket') || i.name.includes('Cardigan')))
      clothing.push({ name:'Light Jacket / Cardigan', qty:1, weight:0.8, packed:false, bag:'main' })
    if (!clothing.find(i => i.name === 'Sunglasses'))
      clothing.push({ name:'Sunglasses', qty:1, weight:0.1, packed:false, bag:'carry' })
  } else {
    // Temperate
    if (!clothing.find(i => i.name.includes('Jacket')))
      clothing.push({ name:'Light Jacket', qty:1, weight:1.5, packed:false, bag:'main' })
  }

  // Hotel / accommodation extras
  if (hotelType === 'resort' || hotelType === 'all-inclusive') {
    const swimQty = hotelType === 'all-inclusive' ? 3 : 2
    if (!clothing.find(i => i.name === 'Swimsuit'))
      clothing.push({ name:'Swimsuit', qty:swimQty, weight:0.3, packed:false, bag:'main' })
    if (!toiletries.find(i => i.name.toLowerCase().includes('sunscreen')))
      toiletries.push({ name:'Sunscreen SPF 50', qty:2, weight:0.6, packed:false, bag:'main' })
    if (!footwear.find(i => i.name.toLowerCase().includes('flip') || i.name.toLowerCase().includes('pool') || i.name.toLowerCase().includes('slide')))
      footwear.push({ name:'Pool Slides / Flip Flops', qty:1, weight:0.5, packed:false, bag:'main' })
    if (!health.find(i => i.name.toLowerCase().includes('phone pouch') || i.name.toLowerCase().includes('waterproof')))
      health.push({ name:'Waterproof Phone Pouch', qty:1, weight:0.1, packed:false, bag:'main' })
    if (hotelType === 'all-inclusive')
      clothing.push({ name:'Casual Evening Outfit', qty:2, weight:0.6, packed:false, bag:'main' })
  }
  if (hotelType === 'hostel') {
    if (!electronics.find(i => i.name.toLowerCase().includes('padlock')))
      electronics.push({ name:'Travel Padlock', qty:1, weight:0.3, packed:false, bag:'main' })
    health.push({ name:'Sleep Sheet / Liner', qty:1, weight:0.3, packed:false, bag:'main' })
    if (!footwear.find(i => i.name.toLowerCase().includes('flip') || i.name.toLowerCase().includes('shower')))
      footwear.push({ name:'Shower Flip Flops', qty:1, weight:0.4, packed:false, bag:'main' })
  }

  // Itinerary keyword extras
  if (itineraryKw.water) {
    if (!footwear.find(i => i.name.toLowerCase().includes('water shoe')))
      footwear.push({ name:'Water Shoes', qty:1, weight:0.6, packed:false, bag:'main' })
    if (!health.find(i => i.name.toLowerCase().includes('snorkel')))
      health.push({ name:'Snorkel Mask', qty:1, weight:0.5, packed:false, bag:'main' })
    if (!toiletries.find(i => i.name.toLowerCase().includes('reef')))
      toiletries.push({ name:'Reef-Safe Sunscreen', qty:1, weight:0.5, packed:false, bag:'main' })
    if (!clothing.find(i => i.name.toLowerCase().includes('rash')))
      clothing.push({ name:'Rash Guard', qty:1, weight:0.3, packed:false, bag:'main' })
  }
  if (itineraryKw.formal) {
    const hasSmartWear = clothing.some(i => /dress|blazer|suit|sport coat/i.test(i.name))
    if (!hasSmartWear)
      clothing.push({ name: gender === 'female' ? 'Dress / Evening Wear' : 'Dress Shirt & Blazer', qty:1, weight:0.6, packed:false, bag:'main' })
    if (!footwear.find(i => /dress shoe|heel|formal/i.test(i.name)))
      footwear.push({ name: gender === 'female' ? 'Heels / Dressy Flats' : 'Dress Shoes', qty:1, weight:0.8, packed:false, bag:'main' })
    if (!clothing.find(i => /clutch|tie|pocket square/i.test(i.name)))
      clothing.push({ name: gender === 'female' ? 'Evening Clutch' : 'Dress Tie', qty:1, weight:0.2, packed:false, bag:'main' })
  }
  if (itineraryKw.outdoor) {
    if (!electronics.find(i => i.name.toLowerCase().includes('headlamp')))
      electronics.push({ name:'Headlamp', qty:1, weight:0.3, packed:false, bag:'main' })
    if (!health.find(i => i.name.toLowerCase().includes('blister')))
      health.push({ name:'Blister Pads', qty:1, weight:0.1, packed:false, bag:'carry' })
    if (!health.find(i => i.name.toLowerCase().includes('insect')))
      health.push({ name:'Insect Repellent', qty:1, weight:0.4, packed:false, bag:'main' })
  }
  if (itineraryKw.business) {
    if (!documents.find(i => i.name.toLowerCase().includes('business card')))
      documents.push({ name:'Business Cards', qty:1, weight:0.1, packed:false, bag:'carry' })
  }
  if (itineraryKw.nightlife) {
    if (!clothing.find(i => /going.out|nightlife|evening outfit/i.test(i.name)))
      clothing.push({ name:'Going-Out Outfit', qty:1, weight:0.4, packed:false, bag:'main' })
  }
  if (itineraryKw.ski) {
    if (!clothing.find(i => /ski goggle|goggles/i.test(i.name)))
      clothing.push({ name:'Ski Goggles', qty:1, weight:0.5, packed:false, bag:'main' })
    if (!clothing.find(i => /ski jacket|snow pant/i.test(i.name)))
      clothing.push({ name:'Ski Jacket & Snow Pants', qty:1, weight:3.0, packed:false, bag:'main' })
  }
  if (itineraryKw.rain) {
    if (!clothing.find(i => /rain jacket|raincoat/i.test(i.name)))
      clothing.push({ name:'Packable Rain Jacket', qty:1, weight:0.8, packed:false, bag:'main' })
  }
  if (itineraryKw.cold) {
    if (!clothing.find(i => /thermal|base layer/i.test(i.name)))
      clothing.push({ name:'Thermal Base Layer', qty:2, weight:0.6, packed:false, bag:'main' })
  }
  if (itineraryKw.hot) {
    if (!toiletries.find(i => i.name.toLowerCase().includes('sunscreen')))
      toiletries.push({ name:'Sunscreen SPF 50', qty:1, weight:0.5, packed:false, bag:'main' })
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

  const TABS = ['Packing List','Visual Aid','AI Assistant','Profile','About']
  const [activeTab, setActiveTab] = useState('Packing List')

  const handleTabClick = (tab) => {
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
  const [selectedSuitcase, setSelectedSuitcase] = useState(null)
  const weightLimit = selectedSuitcase ? Math.max(0, 50 - selectedSuitcase.weightLbs) : 50
  const [suitcaseBrandFilter, setSuitcaseBrandFilter] = useState('')
  const [hotelType, setHotelType] = useState('')
  const [customItem, setCustomItem] = useState('')
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState('')
  const [savedLists, setSavedLists] = useState([])
  const [chatMessages, setChatMessages] = useState([{ role:'assistant', content:"Hey! I'm your packing assistant. Ask me about TSA rules, baggage fees, packing for cold weather, long trips, and more." }])
  const [chatInput, setChatInput] = useState('')
  const [chatTyping, setChatTyping] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [visualAidReady, setVisualAidReady] = useState(false)
  const [profile, setProfile] = useState({ name:'', homeCity:'', gender:'', travelStyle:'Average', frequentFlyer:'Sometimes' })
  const [showTripSurvey, setShowTripSurvey] = useState(false)
  const [surveyStep, setSurveyStep] = useState(0)
  const [surveyAnswers, setSurveyAnswers] = useState({ usedEverything:'', leftBehind:'', shouldHavePacked:'', otherFeedback:'' })
  const [surveyDone, setSurveyDone] = useState(false)
  const chatEndRef = useRef(null)
  const destRef = useRef(null)

  // Premium state
  const [premiumUnlocked, setPremiumUnlocked] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [premiumSelectedPlan, setPremiumSelectedPlan] = useState(null)
  const [premiumPasswordInput, setPremiumPasswordInput] = useState('')
  const [premiumPasswordError, setPremiumPasswordError] = useState(false)
  const [numLocations, setNumLocations] = useState(2)
  const [premiumLegs, setPremiumLegs] = useState(
    Array.from({length:5}, () => ({ destInput:'', destination:'', climate:'temperate', tripType:'Leisure', startDate:'', endDate:'', suggestions:[], showSug:false }))
  )
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
  const [showFullscreenAd, setShowFullscreenAd] = useState(false)
  const [weatherAdjustedList, setWeatherAdjustedList] = useState(false)
  const [premiumMode, setPremiumMode] = useState(false)
  const [customItemWeight, setCustomItemWeight] = useState('0.5')
  const [customItemBag, setCustomItemBag] = useState('main')
  const [premiumCustomItemWeight, setPremiumCustomItemWeight] = useState('0.5')
  const [premiumCustomItemBag, setPremiumCustomItemBag] = useState('main')
  const lastGenerateCtx = useRef(null)
  const listTimerRef = useRef(null)
  const [suitcaseFile, setSuitcaseFile] = useState(null)
  const [suitcasePreviewUrl, setSuitcasePreviewUrl] = useState(null)
  const [layerLoading, setLayerLoading] = useState(false)
  const [layerError, setLayerError] = useState('')
  const [layerResult, setLayerResult] = useState(null)
  const [layerToast, setLayerToast] = useState(false)
  const [layerCount, setLayerCount] = useState(0)
  const [visualAidSubTab, setVisualAidSubTab] = useState('guide')
  const [layerCarouselIdx, setLayerCarouselIdx] = useState(0)
  const [premiumChatMessages, setPremiumChatMessages] = useState([{ role:'assistant', content:"I'm your AI-powered packing assistant. Ask me anything about your specific trip, what to pack, TSA rules, or travel advice — I know your exact packing list." }])
  const [premiumChatInput, setPremiumChatInput] = useState('')
  const [premiumChatTyping, setPremiumChatTyping] = useState(false)
  const [premiumChatLoading, setPremiumChatLoading] = useState(false)
  const [premiumChatCount, setPremiumChatCount] = useState(0)
  const [useFallbackChat, setUseFallbackChat] = useState(false)
  const premiumChatEndRef = useRef(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [statCounts, setStatCounts] = useState({ trips: 0, destinations: 0, items: 0, time: 0 })
  const [activeStatIdx, setActiveStatIdx] = useState(null)
  const [prevStatIdx, setPrevStatIdx] = useState(null)
  const [closingStatIdx, setClosingStatIdx] = useState(null)
  const statTransitionRef = useRef(null)
  const closingRef = useRef(null)
  const heroRef = useRef(null)
  const kjPosRef = useRef({ x: 200, y: 200 })
  const kjVelRef = useRef({ vx: 4.5, vy: 3.2 })
  const kjRotRef = useRef(0)
  const kjAnimRef = useRef(null)
  const kjAudioRef = useRef(null)
  const [kjState, setKjState] = useState({ x: 200, y: 200, rot: 0, flip: false, sx: 1, sy: 1 })
  const [kjQuoteIdx, setKjQuoteIdx] = useState(0)
  const [isPhase, setIsPhase] = useState(0)
  const isAudioRef = useRef(null)
  const [isQuoteIdx, setIsQuoteIdx] = useState(0)
  const haMemoryRef = useRef(null)
  const haFilthyRef = useRef(null)
  const haDinnerRef = useRef(null)
  const haDoorknobRef = useRef(null)
  const haLoopCancelled = useRef(false)
  const [minionsPhase, setMinionsPhase] = useState(0)
  const minionsAudioRef = useRef(null)
  const [minionsQuoteIdx, setMinionsQuoteIdx] = useState(0)
  const [iceAgePhase, setIceAgePhase] = useState(0)
  const [iceAgeQuoteIdx, setIceAgeQuoteIdx] = useState(0)
  const scratPosRef = useRef({ x: -200, y: 80 })

  // Itinerary state
  const [itineraryMode, setItineraryMode] = useState('paste')
  const [itineraryText, setItineraryText] = useState('')
  const [itineraryEvents, setItineraryEvents] = useState([])
  const [itineraryEventInput, setItineraryEventInput] = useState('')
  const [itinerarySubmitted, setItinerarySubmitted] = useState(false)
  const [itineraryKeywords, setItineraryKeywords] = useState({})
  const [haPhase, setHaPhase] = useState(0)
  const [haQuoteIdx, setHaQuoteIdx] = useState(0)
  const [haTrapIdx, setHaTrapIdx] = useState(-1)
  const [haDoorknobPhase, setHaDoorknobPhase] = useState(0)
  const [grinchPhase, setGrinchPhase] = useState(0)
  const [grinchQuoteIdx, setGrinchQuoteIdx] = useState(0)
  const [grinchStolenIdx, setGrinchStolenIdx] = useState(-1)
  const [grinchHeartSize, setGrinchHeartSize] = useState(-2)
  const [grinchScheduleIdx, setGrinchScheduleIdx] = useState(-1)
  const grinchLoopCancelled = useRef(false)
  const acornPosRef = useRef({ x: 120, y: 80 })
  const scratAnimRef = useRef(null)
  const [scratState, setScratState] = useState({ sx: -200, sy: 80, ax: 120, ay: 80, flip: false })
  const [iaSplit, setIaSplit] = useState(false)

  const handleStatClick = (idx) => {
    if (statTransitionRef.current) clearTimeout(statTransitionRef.current)
    if (closingRef.current) clearTimeout(closingRef.current)
    const closing = activeStatIdx === idx
    if (activeStatIdx !== null) {
      setPrevStatIdx(activeStatIdx)
      statTransitionRef.current = setTimeout(() => setPrevStatIdx(null), 1100)
    }
    if (closing) {
      setClosingStatIdx(activeStatIdx)
      closingRef.current = setTimeout(() => setClosingStatIdx(null), 1050)
    }
    setActiveStatIdx(closing ? null : idx)
  }

  useEffect(() => {
    try {
      const l = localStorage.getItem('pp_lists'); if (l) setSavedLists(JSON.parse(l))
      const d = localStorage.getItem('pp_dark'); if (d !== null) setDark(d === '1')
      const p = localStorage.getItem('pp_profile'); if (p) setProfile(JSON.parse(p))
      const sc = localStorage.getItem('pp_suitcase'); if (sc) { const found = SUITCASES.find(s => s.id === sc); if (found) setSelectedSuitcase(found) }
      const ht = localStorage.getItem('pp_hotel'); if (ht) setHotelType(ht)
      const pcc = localStorage.getItem('pp_pc_count'); if (pcc) setPremiumChatCount(parseInt(pcc) || 0)
      const lc = localStorage.getItem('pp_layer_count'); if (lc) setLayerCount(parseInt(lc) || 0)
    } catch(e) {}
  }, [])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:'smooth' }) }, [chatMessages, chatTyping])
  useEffect(() => { premiumChatEndRef.current?.scrollIntoView({ behavior:'smooth' }) }, [premiumChatMessages, premiumChatTyping])

  useEffect(() => {
    const h = (e) => { if (destRef.current && !destRef.current.contains(e.target)) setShowSug(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!heroVisible) return
    const targets = { trips: Math.round(DESTINATIONS.length * 8 * 28 / 100) * 100, destinations: Math.floor(DESTINATIONS.length / 10) * 10, items: 47, time: 8 }
    const duration = 3400
    const steps = 90
    const interval = duration / steps
    let step = 0
    const t = setInterval(() => {
      step++
      const p = Math.min(step / steps, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setStatCounts({
        trips: Math.round(targets.trips * ease),
        destinations: Math.round(targets.destinations * ease),
        items: Math.round(targets.items * ease),
        time: Math.round(targets.time * ease),
      })
      if (step >= steps) clearInterval(t)
    }, interval)
    return () => clearInterval(t)
  }, [heroVisible])

  const kingJulienMode = /king julien.*madagascar/i.test(destination)
  const interstellarMode = /miller.{0,5}planet/i.test(destination)

  useEffect(() => {
    if (!kingJulienMode) {
      if (kjAnimRef.current) cancelAnimationFrame(kjAnimRef.current)
      return
    }
    const SIZE = 120
    kjPosRef.current = { x: (window.innerWidth - SIZE) * 0.35, y: (window.innerHeight - SIZE) * 0.35 }
    kjVelRef.current = { vx: (Math.random() > 0.5 ? 1 : -1) * (3.5 + Math.random() * 2.5), vy: (Math.random() > 0.5 ? 1 : -1) * (2.8 + Math.random() * 2) }
    kjRotRef.current = 0
    let lastTs = null
    const loop = (ts) => {
      if (!lastTs) lastTs = ts
      const dt = Math.min((ts - lastTs) / 16, 3)
      lastTs = ts
      let { x, y } = kjPosRef.current
      let { vx, vy } = kjVelRef.current
      x += vx * dt; y += vy * dt
      const W = window.innerWidth - SIZE, H = window.innerHeight - SIZE
      let sx = 1, sy = 1
      if (x <= 0) { x = 0; vx = Math.abs(vx); sx = 0.55; sy = 1.5 }
      if (x >= W) { x = W; vx = -Math.abs(vx); sx = 0.55; sy = 1.5 }
      if (y <= 0) { y = 0; vy = Math.abs(vy); sx = 1.5; sy = 0.55 }
      if (y >= H) { y = H; vy = -Math.abs(vy); sx = 1.5; sy = 0.55 }
      kjPosRef.current = { x, y }
      kjVelRef.current = { vx, vy }
      kjRotRef.current = (kjRotRef.current + vx * 0.45 * dt) % 360
      setKjState({ x, y, rot: kjRotRef.current, flip: vx < 0, sx, sy })
      kjAnimRef.current = requestAnimationFrame(loop)
    }
    kjAnimRef.current = requestAnimationFrame(loop)
    return () => { if (kjAnimRef.current) cancelAnimationFrame(kjAnimRef.current) }
  }, [kingJulienMode])

  useEffect(() => {
    if (!kingJulienMode) return
    const iv = setInterval(() => setKjQuoteIdx(i => (i + 1) % KJ_QUOTES.length), 4000)
    return () => clearInterval(iv)
  }, [kingJulienMode])

  useEffect(() => {
    if (kingJulienMode) {
      if (!kjAudioRef.current) {
        kjAudioRef.current = new Audio('/move_it.mp3')
        kjAudioRef.current.loop = true
      }
      kjAudioRef.current.play().catch(() => {})
    } else {
      if (kjAudioRef.current) {
        kjAudioRef.current.pause()
        kjAudioRef.current.currentTime = 0
      }
    }
  }, [kingJulienMode])

  useEffect(() => {
    if (!interstellarMode) {
      setIsPhase(0); setIsQuoteIdx(0)
      if (isAudioRef.current) { isAudioRef.current.pause(); isAudioRef.current.currentTime = 0 }
      return
    }
    setIsPhase(1)
    if (!isAudioRef.current) { isAudioRef.current = new Audio('/cornfield.mp3'); isAudioRef.current.loop = true }
    isAudioRef.current.play().catch(() => {})
    const t1 = setTimeout(() => setIsPhase(2), 5500)
    const t2 = setTimeout(() => setIsPhase(3), 12000)
    const t3 = setTimeout(() => setIsPhase(4), 18500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [interstellarMode])

  useEffect(() => {
    if (isPhase !== 4) return
    const iv = setInterval(() => setIsQuoteIdx(i => (i + 1) % IS_QUOTES.length), 6000)
    return () => clearInterval(iv)
  }, [isPhase])

  const minionsMode = /gru.{0,5}lair/i.test(destination)

  useEffect(() => {
    if (!minionsMode) {
      setMinionsPhase(0); setMinionsQuoteIdx(0)
      if (minionsAudioRef.current) { minionsAudioRef.current.pause(); minionsAudioRef.current.currentTime = 0 }
      return
    }
    if (!minionsAudioRef.current) { minionsAudioRef.current = new Audio('/ymca.mp3'); minionsAudioRef.current.loop = true }
    minionsAudioRef.current.play().catch(() => {})
    setMinionsPhase(1)
    const t1 = setTimeout(() => setMinionsPhase(2), 5500)
    const t2 = setTimeout(() => setMinionsPhase(3), 12000)
    const t3 = setTimeout(() => setMinionsPhase(4), 18500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [minionsMode])

  useEffect(() => {
    if (minionsPhase !== 4) return
    const iv = setInterval(() => setMinionsQuoteIdx(i => (i + 1) % MINIONS_QUOTES.length), 5000)
    return () => clearInterval(iv)
  }, [minionsPhase])

  const iceAgeMode = /antarctica/i.test(destination) && !/gru/i.test(destination)

  useEffect(() => {
    if (!iceAgeMode) {
      setIceAgePhase(0); setIceAgeQuoteIdx(0); setIaSplit(false)
      if (scratAnimRef.current) cancelAnimationFrame(scratAnimRef.current)
      return
    }
    setIceAgePhase(1)
    const t1 = setTimeout(() => { setIceAgePhase(2); setIaSplit(true) }, 4000)
    const t2 = setTimeout(() => { setIaSplit(false); setIceAgePhase(3) }, 7200)
    const t3 = setTimeout(() => setIceAgePhase(4), 10500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [iceAgeMode])

  useEffect(() => {
    if (iceAgePhase !== 4) {
      if (scratAnimRef.current) cancelAnimationFrame(scratAnimRef.current)
      return
    }
    const W = window.innerWidth
    const H = window.innerHeight
    let ax = W * 0.75, ay = H * 0.15
    let avx = -(2.8 + Math.random() * 1.5)
    let avy = (Math.random() - 0.5) * 1.2
    let sx = ax + 180, sy = ay
    const loop = () => {
      ax += avx; ay += avy
      if (ax < -80) { ax = W + 50; ay = H * (0.1 + Math.random() * 0.5); avx = -(2.5 + Math.random() * 2); avy = (Math.random() - 0.5) * 1.5 }
      if (ay < 40) { ay = 40; avy = Math.abs(avy) }
      if (ay > H - 100) { ay = H - 100; avy = -Math.abs(avy) }
      const dx = ax - sx, dy = ay - sy
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist > 5) { const spd = Math.min(dist * 0.07, 6); sx += dx/dist*spd; sy += dy/dist*spd }
      setScratState({ sx, sy, ax, ay, flip: avx > 0 })
      acornPosRef.current = { x: ax, y: ay }
      scratPosRef.current = { x: sx, y: sy }
      scratAnimRef.current = requestAnimationFrame(loop)
    }
    scratAnimRef.current = requestAnimationFrame(loop)
    return () => { if (scratAnimRef.current) cancelAnimationFrame(scratAnimRef.current) }
  }, [iceAgePhase])

  useEffect(() => {
    if (iceAgePhase !== 4) return
    const iv = setInterval(() => setIceAgeQuoteIdx(i => (i + 1) % ICE_AGE_QUOTES.length), 5500)
    return () => clearInterval(iv)
  }, [iceAgePhase])

  const homeAloneMode = /winnetka|671 lincoln|mccallister house|kevin.?s house/i.test(destination) || /winnetka|671 lincoln|mccallister house|kevin.?s house/i.test(destInput)

  useEffect(() => {
    if (!homeAloneMode) {
      haLoopCancelled.current = true
      setHaPhase(0); setHaQuoteIdx(0); setHaTrapIdx(-1); setHaDoorknobPhase(0)
      ;[haMemoryRef, haFilthyRef, haDinnerRef, haDoorknobRef].forEach(r => { if (r.current) { r.current.pause(); r.current.currentTime = 0 } })
      return
    }
    haLoopCancelled.current = false
    haMemoryRef.current = new Audio('/Memory.mp3'); haMemoryRef.current.loop = true; haMemoryRef.current.volume = 0.35
    haFilthyRef.current = new Audio('/Filthy.mp3'); haFilthyRef.current.volume = 0.9
    haDinnerRef.current = new Audio('/Dinner.mp3'); haDinnerRef.current.volume = 0.9
    haDoorknobRef.current = new Audio('/Doorknob.mp3'); haDoorknobRef.current.volume = 0.95
    haMemoryRef.current.play().catch(() => {})
    setHaPhase(1)
    const t1 = setTimeout(() => setHaPhase(2), 4500)
    const t2 = setTimeout(() => { setHaPhase(3); setHaTrapIdx(-1) }, 9000)
    const t3 = setTimeout(() => setHaPhase(4), 14500)
    return () => {
      haLoopCancelled.current = true
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      ;[haMemoryRef, haFilthyRef, haDinnerRef, haDoorknobRef].forEach(r => { if (r.current) { r.current.pause(); r.current.currentTime = 0 } })
    }
  }, [homeAloneMode])

  // Trap list ticker
  useEffect(() => {
    if (haPhase !== 3) return
    let idx = -1
    const iv = setInterval(() => { idx++; setHaTrapIdx(idx); if (idx >= HA_TRAPS.length - 1) clearInterval(iv) }, 700)
    return () => clearInterval(iv)
  }, [haPhase])

  // Overlay audio loop — starts when trap list appears, persists through phase 4
  useEffect(() => {
    if (haPhase !== 3) return
    const wait = (ms) => new Promise(r => setTimeout(r, ms))
    const waitEnd = (audio) => new Promise(r => { if (!audio) { r(); return }; audio.addEventListener('ended', r, { once: true }) })
    const loop = async () => {
      while (!haLoopCancelled.current) {
        setHaQuoteIdx(0)
        if (haFilthyRef.current) { haFilthyRef.current.currentTime = 0; haFilthyRef.current.play().catch(() => {}); await waitEnd(haFilthyRef.current) }
        if (haLoopCancelled.current) return
        await wait(2000)
        if (haLoopCancelled.current) return
        setHaQuoteIdx(1)
        if (haDinnerRef.current) { haDinnerRef.current.currentTime = 0; haDinnerRef.current.play().catch(() => {}); await waitEnd(haDinnerRef.current) }
        if (haLoopCancelled.current) return
        await wait(2000)
      }
    }
    loop()
  }, [haPhase])

  // Phase 4: doorknob sequence (audio already looping from phase 3)
  useEffect(() => {
    if (haPhase !== 4) return
    setHaDoorknobPhase(0)
    let cancelled = false
    const wait = (ms) => new Promise(r => setTimeout(r, ms))
    const waitEnd = (audio) => new Promise(r => { if (!audio) { r(); return }; audio.addEventListener('ended', r, { once: true }) })
    const run = async () => {
      await wait(500); if (cancelled) return
      setHaDoorknobPhase(1)
      await wait(2000); if (cancelled) return
      setHaDoorknobPhase(2)
      await wait(2000); if (cancelled) return
      setHaDoorknobPhase(3)
      setHaQuoteIdx(2)
      if (haDoorknobRef.current) { haDoorknobRef.current.currentTime = 0; haDoorknobRef.current.play().catch(() => {}); await waitEnd(haDoorknobRef.current) }
      if (cancelled) return
      setHaDoorknobPhase(0)
    }
    run()
    return () => { cancelled = true }
  }, [haPhase])

  const toggleDark = () => { const v = !dark; setDark(v); try{ localStorage.setItem('pp_dark', v ? '1' : '0') }catch(e){} }
  const grinchMode = /whoville/i.test(destination) || /whoville/i.test(destInput)

  useEffect(() => {
    if (!grinchMode) {
      grinchLoopCancelled.current = true
      setGrinchPhase(0); setGrinchQuoteIdx(0); setGrinchStolenIdx(-1)
      setGrinchHeartSize(-2); setGrinchScheduleIdx(-1)
      return
    }
    grinchLoopCancelled.current = false
    setGrinchPhase(1)
    const t1 = setTimeout(() => setGrinchPhase(2), 4800)
    const t2 = setTimeout(() => { setGrinchPhase(3); setGrinchStolenIdx(-1) }, 9800)
    const t3 = setTimeout(() => setGrinchPhase(4), 16500)
    return () => {
      grinchLoopCancelled.current = true
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
    }
  }, [grinchMode])

  useEffect(() => {
    if (grinchPhase !== 2) return
    let idx = -1
    const iv = setInterval(() => { idx++; setGrinchScheduleIdx(idx); if (idx >= GRINCH_SCHEDULE.length - 1) clearInterval(iv) }, 560)
    return () => clearInterval(iv)
  }, [grinchPhase])

  useEffect(() => {
    if (grinchPhase !== 3) return
    let idx = -1
    const iv = setInterval(() => { idx++; setGrinchStolenIdx(idx); if (idx >= GRINCH_STOLEN.length - 1) clearInterval(iv) }, 610)
    return () => clearInterval(iv)
  }, [grinchPhase])

  useEffect(() => {
    if (grinchPhase !== 4) return
    let size = -2
    setGrinchHeartSize(size)
    const iv1 = setInterval(() => { size++; setGrinchHeartSize(size); if (size >= 1) clearInterval(iv1) }, 1100)
    const iv2 = setInterval(() => setGrinchQuoteIdx(i => (i + 1) % GRINCH_QUOTES.length), 4500)
    return () => { clearInterval(iv1); clearInterval(iv2) }
  }, [grinchPhase])

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
    const suggested = suggestTripTypes(c, d)
    if (!suggested.includes(tripType)) setTripType(suggested[0])
    setShowSug(false)
  }

  const getDays = () => {
    if (!startDate || !endDate) return 3
    return Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
  }

  const allItems = Object.values(items).flat()
  const mainItems = allItems.filter(i => i.bag === 'main')
  const carryItems = allItems.filter(i => i.bag === 'carry')
  const bootBagItems = allItems.filter(i => i.bag === 'boot bag')
  const mainWeight = mainItems.reduce((s, i) => s + i.weight * i.qty, 0)
  const packedMainWeight = mainItems.filter(i => i.packed).reduce((s, i) => s + i.weight * i.qty, 0)
  const carryWeight = carryItems.reduce((s, i) => s + i.weight * i.qty, 0)
  const bootBagWeight = bootBagItems.reduce((s, i) => s + i.weight * i.qty, 0)
  const packedCount = allItems.filter(i => i.packed).length
  const mainOverLimit = mainWeight > weightLimit
  const packedOverLimit = packedMainWeight > weightLimit

  const togglePacked = (cat, idx) => setItems(p => { const u = {...p}; u[cat] = [...u[cat]]; u[cat][idx] = {...u[cat][idx], packed: !u[cat][idx].packed}; return u })
  const toggleBag = (cat, idx) => setItems(p => { const u = {...p}; u[cat] = [...u[cat]]; const cur = u[cat][idx].bag; u[cat][idx] = {...u[cat][idx], bag: cur === 'main' ? 'carry' : cur === 'carry' ? (bootBagItems.length > 0 ? 'boot bag' : 'main') : cur === 'boot bag' ? 'main' : 'main'}; return u })

  const addCustomItem = () => {
    if (!customItem.trim()) return
    setItems(p => ({ ...p, Clothing: [...(p.Clothing || []), { name: customItem, qty:1, weight: parseFloat(customItemWeight) || 0.5, packed:false, bag: customItemBag }] }))
    setCustomItem('')
  }

  const removeItem = (cat, idx) => setItems(p => { const u = {...p}; u[cat] = u[cat].filter((_,i) => i !== idx); return u })

  const saveList = () => {
    if (!destination) return
    const n = { destination, tripType, startDate, endDate, items, date: new Date().toLocaleDateString() }
    const u = [n, ...savedLists.slice(0, 9)]
    setSavedLists(u)
    try { localStorage.setItem('pp_lists', JSON.stringify(u)) } catch(e) {}
    setSurveyStep(0)
    setSurveyAnswers({ usedEverything:'', leftBehind:'', shouldHavePacked:'', otherFeedback:'' })
    setSurveyDone(false)
    setShowTripSurvey(true)
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

      // Adjust packing list if actual weather differs from climate classification
      const wTemps = wd.daily.temperature_2m_max || []
      const wCodes = wd.daily.weather_code || []
      if (wTemps.length > 0 && lastGenerateCtx.current) {
        const avgH = wTemps.reduce((a, b) => a + b, 0) / wTemps.length
        const snowDays = wCodes.filter(c => [71,73,75,77,85,86].includes(c)).length
        const wClimate = (avgH < 45 || snowDays > 1) ? 'cold' : avgH < 58 ? 'temperate' : avgH < 76 ? 'warm' : 'tropical'
        const ctx = lastGenerateCtx.current
        if (wClimate !== ctx.baseClimate) {
          const result = generateList(ctx.tripType, ctx.days, wClimate, ctx.liters, ctx.gender, ctx.dest, ctx.hotelType, ctx.travelStyle)
          setItems(result.items)
          setLaundryNote(result.laundryNote)
          setClimate(wClimate)
          setWeatherAdjustedList(true)
        }
      }
    } catch(e) {
      setWeatherError(`Weather unavailable: ${e.message}`)
    }
    setWeatherLoading(false)
  }

  // Premium helpers
  const handlePremiumUnlock = () => {
    if (premiumPasswordInput === 'Incubator') {
      setPremiumUnlocked(true); setShowPremiumModal(false); setPremiumPasswordInput(''); setPremiumPasswordError(false); setPremiumSelectedPlan(null)
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
    const suggested = suggestTripTypes(c, d)
    const currentTripType = premiumLegs[idx].tripType
    const newTripType = suggested.includes(currentTripType) ? currentTripType : suggested[0]
    updatePremiumLeg(idx, { destInput: d, destination: d, climate: c, showSug: false, tripType: newTripType })
  }

  const getLegDays = (leg) => {
    if (!leg.startDate || !leg.endDate) return 3
    return Math.max(1, Math.round((new Date(leg.endDate) - new Date(leg.startDate)) / 86400000) + 1)
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
    const allItemSets = resolvedLegs.map(leg => generateList(leg.tripType, getLegDays(leg), leg.climate, selectedSuitcase?.liters ?? 69, profile.gender, leg.destination, hotelType))
    const merged = mergePremiumItems(allItemSets.map(r => r.items))
    const totalDays = resolvedLegs.reduce((s, leg) => s + getLegDays(leg), 0)
    setPremiumItems(merged); setPremiumLaundryNote(totalDays > 10); setPremiumGenerated(true)
    const weatherResults = await fetchPremiumWeather(resolvedLegs)
    const validWeathers = weatherResults.filter(Boolean)
    // Pick visual based on trip types and average temps across all legs
    const allTripTypes = resolvedLegs.map(l => l.tripType)
    const hasSki = allTripTypes.includes('Skiing')
    const hasBiz = allTripTypes.includes('Business')
    const hasSports = allTripTypes.includes('Sports Tournament')
    const firstLegTripType = resolvedLegs[0]?.tripType || 'Leisure'
    if (validWeathers.length > 0) {
      const allTemps = validWeathers.flatMap(w => w.daily.temperature_2m_max || [])
      const overallAvg = allTemps.length > 0 ? allTemps.reduce((a,b) => a+b, 0) / allTemps.length : null
      const isWarm = overallAvg !== null ? (overallAvg >= 72) : resolvedLegs.some(l => l.climate === 'tropical' || l.climate === 'warm' || l.climate === 'desert')
      const hasBeach = allTripTypes.includes('Beach')
      if (overallAvg !== null) {
        if (hasBiz && (isWarm || hasBeach)) setPremiumVisImage(IMG_BIZ_BEACH)
        else if (hasSki && (isWarm || hasBeach)) setPremiumVisImage(IMG_SKI_BEACH)
        else if (hasBiz) setPremiumVisImage(IMG_BIZ)
        else if (hasSki) setPremiumVisImage(IMG_SKI)
        else if (hasSports) setPremiumVisImage(IMG_SPORTS)
        else if (isWarm || hasBeach) setPremiumVisImage(IMG_WARM)
        else if (overallAvg < 50) setPremiumVisImage(IMG_COLD)
        else setPremiumVisImage(IMG_NORM)
      } else {
        const climates = resolvedLegs.map(l => l.climate)
        const warmClimate = climates.some(c => c === 'tropical' || c === 'warm' || c === 'desert')
        if (hasBiz && warmClimate) setPremiumVisImage(IMG_BIZ_BEACH)
        else if (hasSki && warmClimate) setPremiumVisImage(IMG_SKI_BEACH)
        else if (hasSki) setPremiumVisImage(IMG_SKI)
        else if (hasSports) setPremiumVisImage(IMG_SPORTS)
        else setPremiumVisImage(getVisualImage(resolvedLegs[0].climate, firstLegTripType))
      }
    } else {
      const climates = resolvedLegs.map(l => l.climate)
      const warmClimate = climates.some(c => c === 'tropical' || c === 'warm' || c === 'desert')
      if (hasBiz && warmClimate) setPremiumVisImage(IMG_BIZ_BEACH)
      else if (hasSki && warmClimate) setPremiumVisImage(IMG_SKI_BEACH)
      else if (hasSki) setPremiumVisImage(IMG_SKI)
      else if (hasSports) setPremiumVisImage(IMG_SPORTS)
      else setPremiumVisImage(getVisualImage(resolvedLegs[0]?.climate || 'temperate', firstLegTripType))
    }
  }

  const togglePremiumPacked = (cat, idx) => setPremiumItems(p => { const u={...p}; u[cat]=[...u[cat]]; u[cat][idx]={...u[cat][idx], packed:!u[cat][idx].packed}; return u })
  const togglePremiumBag = (cat, idx) => setPremiumItems(p => { const u={...p}; u[cat]=[...u[cat]]; const cur=u[cat][idx].bag; const hasBoot = Object.values(p).flat().some(i => i.bag === 'boot bag'); u[cat][idx]={...u[cat][idx], bag:cur==='main'?'carry':cur==='carry'?(hasBoot?'boot bag':'main'):cur==='boot bag'?'main':'main'}; return u })
  const addPremiumCustomItem = () => {
    if (!premiumCustomItem.trim()) return
    setPremiumItems(p => ({ ...p, Clothing: [...(p.Clothing||[]), { name:premiumCustomItem, qty:1, weight: parseFloat(premiumCustomItemWeight) || 0.5, packed:false, bag: premiumCustomItemBag }] }))
    setPremiumCustomItem('')
  }

  const removePremiumItem = (cat, idx) => setPremiumItems(p => { const u = {...p}; u[cat] = u[cat].filter((_,i) => i !== idx); return u })

  const handleGenerate = async () => {
    const dest = destination || destInput
    if (!dest) return
    setDestination(dest)
    const c = classifyClimate(dest); setClimate(c)
    let resolvedStart = startDate, resolvedEnd = endDate
    if (!startDate || !endDate) {
      const today = new Date()
      resolvedStart = today.toISOString().split('T')[0]
      const end = new Date(today); end.setDate(end.getDate() + 2)
      resolvedEnd = end.toISOString().split('T')[0]
      setStartDate(resolvedStart); setEndDate(resolvedEnd)
    }
    const days = Math.max(1, Math.round((new Date(resolvedEnd) - new Date(resolvedStart)) / 86400000) + 1)
    const liters = selectedSuitcase?.liters ?? 69
    const result = generateList(tripType, days, c, liters, profile.gender, dest, hotelType, profile.travelStyle, itineraryKeywords)
    setItems(result.items)
    setLaundryNote(result.laundryNote)
    setWeatherAdjustedList(false)
    lastGenerateCtx.current = { tripType, days, liters, gender: profile.gender, hotelType, travelStyle: profile.travelStyle, baseClimate: c, dest }
    setListGenerated(false)
    setListLoading(true)
    setVisualAidReady(false)
    setShowFullscreenAd(true)
    fetchWeather(dest, resolvedStart, resolvedEnd)
    setTimeout(() => {
      setVisualAidReady(true)
    }, 6000)
  }

  const sendChat = async (preset) => {
    const text = preset || chatInput
    if (!text?.trim() || chatTyping) return
    setChatInput('')
    setChatMessages(prev => [...prev, { role:'user', content: text }])
    setChatTyping(true)

    // Brief pause before "typing" starts
    await new Promise(r => setTimeout(r, 280))

    const resp = getAIResponse(text, { destination, tripType })
    let i = 0
    setChatMessages(prev => [...prev, { role:'assistant', content:'' }])

    await new Promise(resolve => {
      const timer = setInterval(() => {
        i++
        setChatMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role:'assistant', content: resp.slice(0, i) }
          return updated
        })
        if (i >= resp.length) { clearInterval(timer); resolve() }
      }, 11)
    })
    setChatTyping(false)
  }

  const sendPremiumChat = async (preset) => {
    const text = preset || premiumChatInput
    if (!text?.trim() || premiumChatTyping || premiumChatLoading) return
    if (premiumChatCount >= 10) return
    setPremiumChatInput('')
    setPremiumChatMessages(prev => [...prev, { role:'user', content: text }])
    setPremiumChatLoading(true)

    const tripContext = [
      destination && `Destination: ${destination}`,
      tripType && `Trip type: ${tripType}`,
      climate && `Climate: ${climate}`,
      startDate && endDate && `Dates: ${startDate} to ${endDate} (${getDays()} days)`,
      selectedSuitcase && `Luggage: ${selectedSuitcase.name} (${selectedSuitcase.liters}L)`,
      profile?.gender && `Traveler: ${profile.gender}`,
      Object.keys(items).length > 0 && `Current packing list:\n${Object.entries(items).map(([cat, itms]) => `  ${cat}: ${itms.map(i => i.name).join(', ')}`).join('\n')}`,
    ].filter(Boolean).join('\n')

    const history = premiumChatMessages
      .filter(m => m.role === 'user' || (m.role === 'assistant' && m !== premiumChatMessages[0]))
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const resp = await fetch('/api/premium-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, tripContext, premiumKey: 'Incubator', chatCount: premiumChatCount }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.error || `Server error ${resp.status}`)
      }

      const newCount = premiumChatCount + 1
      setPremiumChatCount(newCount)
      try { localStorage.setItem('pp_pc_count', String(newCount)) } catch(_) {}

      setPremiumChatLoading(false)
      setPremiumChatTyping(true)
      setPremiumChatMessages(prev => [...prev, { role:'assistant', content:'' }])

      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream:true })
        const lines = buf.split('\n')
        buf = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') break
          try {
            const { text: chunk } = JSON.parse(payload)
            if (chunk) {
              setPremiumChatMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role:'assistant', content: updated[updated.length - 1].content + chunk }
                return updated
              })
            }
          } catch(_) {}
        }
      }
    } catch(err) {
      setPremiumChatLoading(false)
      setPremiumChatMessages(prev => [...prev, { role:'assistant', content:`Something went wrong: ${err.message}` }])
    } finally {
      setPremiumChatTyping(false)
    }
  }

  const generateLayers = async () => {
    if (!suitcaseFile || Object.keys(items).length === 0) return
    if (!premiumUnlocked) return
    if (layerCount >= 2) return
    setLayerLoading(true)
    setLayerError('')
    setLayerResult(null)
    setLayerCarouselIdx(0)
    try {
      const arrayBuffer = await suitcaseFile.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
      const imageBase64 = btoa(binary)
      const imageMimeType = suitcaseFile.type || 'image/jpeg'

      const resp = await fetch('/api/generate-layers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, imageMimeType, packingList: items, premiumKey: 'Incubator', layerCount }),
      })
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}))
        throw new Error(errData.error || `Server error ${resp.status}`)
      }

      // Stream SSE — show layers as they arrive
      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') {
            const newCount = layerCount + 1
            setLayerCount(newCount)
            try { localStorage.setItem('pp_layer_count', String(newCount)) } catch(_) {}
            setLayerToast(true)
            setTimeout(() => setLayerToast(false), 5000)
            setLayerLoading(false)
            return
          }
          try {
            const evt = JSON.parse(raw)
            if (evt.type === 'breakdown') {
              setLayerResult({
                suitcaseNote: evt.suitcaseNote,
                layers: evt.layers.map(l => ({ ...l, imageUrl: null })),
              })
            } else if (evt.type === 'layer') {
              setLayerResult(prev => {
                const newLayers = [...(prev?.layers ?? [null, null, null])]
                newLayers[evt.index] = evt.layer
                return { ...prev, layers: newLayers }
              })
            }
          } catch (_) {}
        }
      }
    } catch (err) {
      setLayerError(err.message || 'Something went wrong. Please try again.')
    }
    setLayerLoading(false)
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

  const availableTripTypes = ['Leisure','Business','Beach','Adventure','Family','Backpacking','Skiing','Sports Tournament']
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
    @keyframes spin { to { transform:rotate(360deg) } }
    @keyframes pulse-dot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
    @keyframes vis-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
    @keyframes floatOrb { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(12px,-16px) scale(1.05)} 66%{transform:translate(-8px,8px) scale(0.97)} }
    @keyframes floatOrb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-14px,10px) scale(0.95)} 66%{transform:translate(10px,-12px) scale(1.04)} }
    @keyframes statPop { 0%{opacity:0;transform:translateY(18px) scale(0.92)} 70%{transform:translateY(-3px) scale(1.03)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes pillSlide { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
    @keyframes badgePulse { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,0.35)} 50%{box-shadow:0 0 0 6px rgba(37,99,235,0)} }
    @keyframes shirtCenterRise {
      0%   { transform:translateY(-155px) scaleY(0.04) scaleX(0.25); opacity:0; }
      18%  { opacity:1; transform:translateY(-90px) scaleY(0.22) scaleX(0.55); }
      50%  { transform:translateY(6px) scaleY(1.04) scaleX(1.01); }
      72%  { transform:translateY(-3px) scaleY(0.98) scaleX(1.0); }
      100% { transform:translateY(0) scaleY(1) scaleX(1); opacity:1; }
    }
    @keyframes leftSleeveOpen {
      0%   { transform:perspective(700px) rotateY(-90deg); }
      100% { transform:perspective(700px) rotateY(0deg); }
    }
    @keyframes rightSleeveOpen {
      0%   { transform:perspective(700px) rotateY(90deg); }
      100% { transform:perspective(700px) rotateY(0deg); }
    }
    @keyframes creaseFade { 0%{opacity:0.8} 60%{opacity:0.35} 100%{opacity:0} }
    @keyframes shirtTextIn { 0%,65%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes cardDropIn {
      0%   { transform:translateY(-165px) scale(0.93); opacity:0.15; }
      14%  { opacity:1; }
      75%  { transform:translateY(7px) scale(1.015); opacity:1; }
      100% { transform:translateY(0) scale(1); opacity:1; }
    }
    @keyframes cardRiseOut {
      0%   { transform:translateY(0) scale(1); opacity:1; }
      25%  { transform:translateY(-8px) scale(1.015); opacity:1; }
      86%  { transform:translateY(-158px) scale(0.93); opacity:0.15; }
      100% { transform:translateY(-165px) scale(0.93); opacity:0; }
    }
    .card-drop-in { animation:cardDropIn 1.0s cubic-bezier(0.25,0.1,0.25,1) both; }
    .card-rise-out { animation:cardRiseOut 1.0s cubic-bezier(0.25,0.1,0.25,1) both; }
    .shirt-center  { animation:shirtCenterRise 0.85s 0.72s cubic-bezier(0.22,1,0.36,1) both; transform-origin:top center; }
    .shirt-left    { transform-origin:right center; animation:leftSleeveOpen 0.52s 1.22s cubic-bezier(0.22,1,0.36,1) both; }
    .shirt-right   { transform-origin:left center;  animation:rightSleeveOpen 0.52s 1.40s cubic-bezier(0.22,1,0.36,1) both; }
    .shirt-crease  { animation:creaseFade 1.6s 0.72s both; }
    .shirt-text-in { animation:shirtTextIn 0.45s 1.65s both; }
    .hero-fade-1 { animation:fadeUp 0.7s 0.05s cubic-bezier(0.22,1,0.36,1) both }
    .hero-fade-2 { animation:fadeUp 0.7s 0.18s cubic-bezier(0.22,1,0.36,1) both }
    .hero-fade-3 { animation:fadeUp 0.7s 0.30s cubic-bezier(0.22,1,0.36,1) both }
    .hero-fade-4 { animation:fadeUp 0.7s 0.42s cubic-bezier(0.22,1,0.36,1) both }
    .hero-fade-5 { animation:fadeUp 0.7s 0.54s cubic-bezier(0.22,1,0.36,1) both }
    .suitcase-card-0 { animation:statPop 0.55s 0.32s cubic-bezier(0.22,1,0.36,1) both }
    .suitcase-card-1 { animation:statPop 0.55s 0.42s cubic-bezier(0.22,1,0.36,1) both }
    .suitcase-card-2 { animation:statPop 0.55s 0.52s cubic-bezier(0.22,1,0.36,1) both }
    .suitcase-card-3 { animation:statPop 0.55s 0.62s cubic-bezier(0.22,1,0.36,1) both }
    .suitcase-wrap { transition:filter 220ms ease }
    .suitcase-wrap:hover { filter:drop-shadow(0 8px 20px rgba(37,99,235,0.22)) }
    .hero-badge { animation:badgePulse 2.4s ease-in-out infinite }
    .hero-dot { animation:float 2s ease-in-out infinite }
    .hero-pill-0 { animation:pillSlide 0.5s 0.44s both }
    .hero-pill-1 { animation:pillSlide 0.5s 0.52s both }
    .hero-pill-2 { animation:pillSlide 0.5s 0.60s both }
    .hero-pill-3 { animation:pillSlide 0.5s 0.68s both }
    .hero-pill-4 { animation:pillSlide 0.5s 0.76s both }
    .hero-orb-1 { animation:floatOrb 7s ease-in-out infinite }
    .hero-orb-2 { animation:floatOrb2 9s ease-in-out infinite }
    .spinner { display:inline-block; width:18px; height:18px; border:2.5px solid rgba(37,99,235,0.18); border-top-color:#2563eb; border-radius:50%; animation:spin 0.7s linear infinite; }
    .dot-pulse span { display:inline-block; width:7px; height:7px; border-radius:50%; background:#2563eb; margin:0 2px; }
    .dot-pulse span:nth-child(1){animation:pulse-dot 1.2s ease-in-out 0s infinite}
    .dot-pulse span:nth-child(2){animation:pulse-dot 1.2s ease-in-out 0.2s infinite}
    .dot-pulse span:nth-child(3){animation:pulse-dot 1.2s ease-in-out 0.4s infinite}
    @keyframes isStarTwinkle { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:1;transform:scale(1.8)} }
    @keyframes isStayIn { 0%{opacity:0;letter-spacing:1.5em;filter:blur(12px)} 100%{opacity:1;letter-spacing:0.35em;filter:blur(0)} }
    @keyframes isMorseFlicker { 0%,100%{opacity:0.15} 48%{opacity:1} 52%{opacity:1} }
    @keyframes isDustDrift { 0%{transform:translateY(0) translateX(0);opacity:0.8} 100%{transform:translateY(220px) translateX(var(--is-dx,0px));opacity:0} }
    @keyframes isBookPush { 0%,100%{transform:translateZ(0) translateY(0)} 35%,65%{transform:translateZ(50px) translateY(-6px)} }
    @keyframes isCubeOuter { from{transform:rotateX(22deg) rotateY(0deg)} to{transform:rotateX(22deg) rotateY(360deg)} }
    @keyframes isCubeInner { from{transform:rotateX(-18deg) rotateY(0deg)} to{transform:rotateX(-18deg) rotateY(-360deg)} }
    @keyframes isGlow { 0%,100%{text-shadow:0 0 18px rgba(120,200,255,0.6),0 0 36px rgba(120,200,255,0.2)} 50%{text-shadow:0 0 36px rgba(120,200,255,1),0 0 72px rgba(120,200,255,0.55),0 0 120px rgba(120,200,255,0.2)} }
    @keyframes isOrbGlow { 0%,100%{box-shadow:0 0 40px 20px rgba(255,165,30,0.22),0 0 80px 40px rgba(255,165,30,0.10)} 50%{box-shadow:0 0 70px 35px rgba(255,165,30,0.42),0 0 130px 65px rgba(255,165,30,0.20)} }
    @keyframes isBannerSlide { from{transform:translateY(-110%);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes isFadeIn { from{opacity:0} to{opacity:1} }
    @keyframes isQuoteIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes isTimerTick { 0%,100%{color:rgba(120,200,255,0.75)} 50%{color:rgba(255,210,80,0.95)} }
    @keyframes isOverlayOut { from{opacity:1} to{opacity:0;pointer-events:none} }
    @keyframes isScanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
    @keyframes isCenterPulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.5);opacity:1} }
    @keyframes mnLetterSlam { 0%{opacity:0;transform:scale(2.8) translateY(-24px) rotate(-12deg)} 65%{transform:scale(0.93) translateY(3px) rotate(1deg)} 100%{opacity:1;transform:scale(1) translateY(0) rotate(0deg)} }
    @keyframes mnBananaFloat { 0%{transform:translateX(-50%) translateY(-5vh) rotate(0deg);opacity:1} 100%{transform:translateX(-50%) translateY(65vh) rotate(200deg);opacity:0.5} }
    @keyframes mnGibberish { 0%,100%{opacity:0.18} 50%{opacity:0.75} }
    @keyframes mnMinionRise { from{transform:translateY(110%) scale(0.82);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
    @keyframes mnNameCard { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes mnSpeechPop { from{opacity:0;transform:scale(0.35) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes mnCrowdRise { from{transform:translateY(130px) scale(0.88);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
    @keyframes mnLairZoom { from{transform:scale(1);opacity:0} to{transform:scale(1.1);opacity:1} }
    @keyframes mnGruSlide { from{transform:translateX(-130px) scale(0.88);opacity:0} to{transform:translateX(0) scale(1);opacity:1} }
    @keyframes mnSlamIn { 0%{opacity:0;transform:scale(2.6)} 60%{opacity:1;transform:scale(0.94)} 100%{transform:scale(1)} }
    @keyframes mnBananFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(540deg);opacity:0.5} }
    @keyframes mnPeek { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    @keyframes mnWiggle { 0%,100%{transform:rotate(-3deg) scale(1)} 50%{transform:rotate(3deg) scale(1.05)} }
    @keyframes mnBannerIn { from{transform:translateY(-110%);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes mnQuoteIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes mnYellowPulse { 0%,100%{background:rgba(255,220,0,0.04)} 50%{background:rgba(255,220,0,0.12)} }
    @keyframes mnFadeIn { from{opacity:0} to{opacity:1} }
    @keyframes kjConfettiFall { 0%{transform:translateY(-30px) rotate(0deg) scale(1);opacity:1} 100%{transform:translateY(110vh) rotate(900deg) scale(0.75);opacity:0.5} }
    @keyframes kjBanner { from{transform:translateY(-110%);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes kjBgPulse { 0%,100%{background:rgba(126,34,206,0.10)} 33%{background:rgba(21,128,61,0.08)} 66%{background:rgba(180,83,9,0.09)} }
    @keyframes kjRainbowBorder { 0%,100%{border-color:#a855f7} 25%{border-color:#f59e0b} 50%{border-color:#10b981} 75%{border-color:#ef4444} }
    @keyframes kjBannerGrad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes kjSpeech { from{opacity:0;transform:scale(0.7) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes kjGlow { 0%,100%{filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)) drop-shadow(0 0 20px rgba(168,85,247,0.4))} 50%{filter:drop-shadow(0 0 18px rgba(251,191,36,0.9)) drop-shadow(0 0 36px rgba(251,191,36,0.5))} }
    .kj-img { animation:kjGlow 2s ease-in-out infinite; transition:transform 100ms ease; }
    .kj-speech { animation:kjSpeech 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    .kj-banner { animation:kjBanner 0.65s cubic-bezier(0.22,1,0.36,1) both; }
    .kj-bg { animation:kjBgPulse 3.5s ease-in-out infinite; }
    .kj-header-border { animation:kjRainbowBorder 2s linear infinite !important; }
    ${kingJulienMode ? `
      .pp-header { border-bottom: 2px solid #a855f7 !important; }
      body { background: #1a0533 !important; }
    ` : ''}
    @keyframes iaSnowfall { 0%{transform:translateY(-20px) translateX(0) rotate(0deg);opacity:0} 5%{opacity:1} 90%{opacity:0.7} 100%{transform:translateY(110vh) translateX(var(--drift,20px)) rotate(360deg);opacity:0} }
    @keyframes iaFreezeIn { 0%{opacity:0;filter:blur(8px)} 100%{opacity:1;filter:blur(0)} }
    @keyframes iaIcePulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.02)} }
    @keyframes iaTitleSlam { 0%{opacity:0;transform:scale(0.2) rotate(-8deg);filter:blur(12px)} 60%{transform:scale(1.08) rotate(2deg)} 80%{transform:scale(0.96) rotate(-0.5deg)} 100%{opacity:1;transform:scale(1) rotate(0);filter:blur(0)} }
    @keyframes iaSplitLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-52vw)} }
    @keyframes iaSplitRight { 0%{transform:translateX(0)} 100%{transform:translateX(52vw)} }
    @keyframes iaCrackGrow { 0%{opacity:0;scaleY:0} 50%{opacity:1} 100%{opacity:0.7;scaleY:1} }
    @keyframes iaSlideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes iaQuoteIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes iaScratBob { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-6px) rotate(3deg)} }
    @keyframes iaBannerShimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes iaIceGlow { 0%,100%{filter:drop-shadow(0 0 8px rgba(147,210,255,0.7))} 50%{filter:drop-shadow(0 0 20px rgba(147,210,255,1)) drop-shadow(0 0 40px rgba(200,240,255,0.5))} }
    @keyframes iaCrackFlash { 0%{opacity:0} 20%{opacity:1} 60%{opacity:0.6} 100%{opacity:0} }
    .ia-scrat { animation:iaScratBob 0.6s ease-in-out infinite; }
    .ia-acorn-glow { animation:iaIceGlow 1.8s ease-in-out infinite; }
    @keyframes haSnowfall { 0%{transform:translateY(-20px) translateX(0) rotate(0deg);opacity:0} 5%{opacity:1} 90%{opacity:0.8} 100%{transform:translateY(110vh) translateX(var(--ha-drift,15px)) rotate(420deg);opacity:0} }
    @keyframes haTitleIn { 0%{opacity:0;transform:scale(3.5) rotate(-6deg);filter:blur(16px)} 55%{transform:scale(0.92) rotate(1.5deg)} 75%{transform:scale(1.05) rotate(-0.5deg)} 100%{opacity:1;transform:scale(1) rotate(0);filter:blur(0)} }
    @keyframes haSubIn { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes haVhsFlicker { 0%,100%{opacity:1} 7%{opacity:0.85} 14%{opacity:1} 28%{opacity:0.92} 42%{opacity:1} 56%{opacity:0.88} 70%{opacity:1} }
    @keyframes haScanline { 0%{transform:translateY(-8px)} 100%{transform:translateY(100vh)} }
    @keyframes haScreamPulse { 0%,100%{transform:scale(1) rotate(-1deg)} 30%{transform:scale(1.18) rotate(1.5deg)} 60%{transform:scale(0.92) rotate(-0.8deg)} }
    @keyframes haShockRing { 0%{transform:translate(-50%,-50%) scale(0.2);opacity:0.9;border-width:6px} 100%{transform:translate(-50%,-50%) scale(2.8);opacity:0;border-width:1px} }
    @keyframes haScreamBg { 0%,100%{background:radial-gradient(ellipse at 50% 50%, #8b0000 0%, #3d0000 55%, #1a0000 100%)} 50%{background:radial-gradient(ellipse at 50% 50%, #cc0000 0%, #600000 55%, #250000 100%)} }
    @keyframes haTrapSlide { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
    @keyframes haKevinPeek { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-14px)} }
    @keyframes haMarvPeek { 0%,100%{transform:translateY(0) scaleX(-1)} 40%{transform:translateY(-12px) scaleX(-1)} }
    @keyframes haLightBlink { 0%,100%{opacity:1;filter:blur(0px)} 45%{opacity:0.15;filter:blur(2px)} 55%{opacity:0.15;filter:blur(2px)} }
    @keyframes haLightSwing { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
    @keyframes haBannerIn { from{transform:translateY(-110%)} to{transform:translateY(0)} }
    @keyframes haQuoteIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes haRedPulse { 0%,100%{background:rgba(139,0,0,0.05)} 50%{background:rgba(180,0,0,0.12)} }
    @keyframes haKnock { 0%,100%{transform:translateX(0) rotate(0deg)} 12%{transform:translateX(-6px) rotate(-0.6deg)} 28%{transform:translateX(6px) rotate(0.5deg)} 44%{transform:translateX(-5px) rotate(-0.4deg)} 60%{transform:translateX(4px) rotate(0.3deg)} 76%{transform:translateX(-2px) rotate(-0.2deg)} 90%{transform:translateX(1px)} }
    @keyframes haDoorknobSlide { from{transform:translateX(110px);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes haHandSlide { from{transform:translateX(80px) translateY(20px);opacity:0} to{transform:translateX(0) translateY(0);opacity:1} }
    @keyframes haHandGrab { 0%,100%{transform:scale(1) rotate(0deg)} 40%{transform:scale(1.25) rotate(-8deg)} 70%{transform:scale(0.9) rotate(5deg)} }
    @keyframes haKnockGlow { 0%,100%{box-shadow:0 0 18px 6px rgba(196,30,58,0.55),0 0 0 2px #c41e3a} 50%{box-shadow:0 0 38px 14px rgba(220,30,30,0.8),0 0 0 2px #ff2020} }
    ${homeAloneMode ? `
      .pp-header { border-bottom: 2px solid #c41e3a !important; }
      body { background: #1a0505 !important; }
    ` : ''}
    ${iceAgeMode ? `
      .pp-header { border-bottom: 2px solid #7dd3fc !important; }
      body { background: #0a1628 !important; }
    ` : ''}
    @keyframes grSnowfall { 0%{transform:translateY(-20px) translateX(0) rotate(0deg);opacity:0} 5%{opacity:1} 90%{opacity:0.8} 100%{transform:translateY(110vh) translateX(var(--gr-drift,12px)) rotate(360deg);opacity:0} }
    @keyframes grTitleSlam { 0%{opacity:0;transform:scale(4) rotate(-5deg);filter:blur(18px)} 55%{transform:scale(0.9) rotate(2deg)} 75%{transform:scale(1.06) rotate(-0.5deg)} 100%{opacity:1;transform:scale(1) rotate(0);filter:blur(0)} }
    @keyframes grSubIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes grFaceZoom { 0%{opacity:0;transform:scale(0.3);filter:blur(14px)} 60%{transform:scale(1.05)} 80%{transform:scale(0.97)} 100%{opacity:1;transform:scale(1);filter:blur(0)} }
    @keyframes grShockRing { 0%{transform:translate(-50%,-50%) scale(0.2);opacity:0.9;border-width:6px} 100%{transform:translate(-50%,-50%) scale(3.2);opacity:0;border-width:1px} }
    @keyframes grBgPulse { 0%,100%{background:radial-gradient(ellipse at 50% 50%, #002200 0%, #001100 55%, #000500 100%)} 50%{background:radial-gradient(ellipse at 50% 50%, #003500 0%, #001c00 55%, #000800 100%)} }
    @keyframes grItemSlide { from{opacity:0;transform:translateX(-26px)} to{opacity:1;transform:translateX(0)} }
    @keyframes grScheduleIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes grQuoteIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes grGrinchPeek { 0%,100%{transform:translateY(0)} 45%{transform:translateY(-16px)} }
    @keyframes grMaxPeek { 0%,100%{transform:translateY(0) scaleX(-1)} 40%{transform:translateY(-13px) scaleX(-1)} }
    @keyframes grStampIn { 0%{opacity:0;transform:rotate(-35deg) scale(3.5)} 50%{transform:rotate(8deg) scale(0.88)} 70%{transform:rotate(-5deg) scale(1.06)} 100%{opacity:1;transform:rotate(-10deg) scale(1)} }
    @keyframes grHeistSlide { from{opacity:0;transform:translateX(-90px) rotate(-5deg) scale(0.92)} to{opacity:1;transform:translateX(0) rotate(0deg) scale(1)} }
    @keyframes grLaughBuild { 0%{opacity:0;transform:scale(0.2) translateY(16px) rotate(-8deg)} 60%{transform:scale(1.08) translateY(-3px) rotate(2deg)} 100%{opacity:1;transform:scale(1) translateY(0) rotate(0)} }
    @keyframes grSackBounce { 0%{transform:scale(1) rotate(0deg)} 25%{transform:scale(1.5) rotate(-12deg)} 55%{transform:scale(0.88) rotate(6deg)} 80%{transform:scale(1.12) rotate(-2deg)} 100%{transform:scale(1) rotate(0deg)} }
    @keyframes grHeartBloom { 0%{transform:scale(1)} 15%{transform:scale(3.2) rotate(12deg)} 40%{transform:scale(0.75)} 65%{transform:scale(1.5) rotate(-8deg)} 85%{transform:scale(0.92)} 100%{transform:scale(1)} }
    @keyframes grRedHeart { 0%{opacity:1;transform:translateY(0) rotate(var(--rot,0deg)) translateX(0)} 100%{opacity:0;transform:translateY(-320px) rotate(calc(var(--rot,0deg) + 200deg)) translateX(var(--dx,0px))} }
    @keyframes grEvilMeter { from{width:0} to{width:100%} }
    @keyframes grFlicker { 0%,95%,100%{opacity:1} 96%,99%{opacity:0.6} }
    @keyframes grCommentIn { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
    @keyframes grThreeSizes { 0%{opacity:0;letter-spacing:-0.1em;transform:scale(0.4)} 50%{opacity:1;letter-spacing:0.04em;transform:scale(1.08)} 70%{transform:scale(0.96)} 100%{opacity:1;transform:scale(1);letter-spacing:0.05em} }
    @keyframes grWhoJump { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(10deg)} }
    @keyframes grLightSwing { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
    @keyframes grLightBlink { 0%,100%{opacity:1;filter:blur(0)} 45%{opacity:0.1;filter:blur(2px)} 55%{opacity:0.1;filter:blur(2px)} }
    @keyframes grBannerIn { from{transform:translateY(-110%)} to{transform:translateY(0)} }
    @keyframes grHeartGrow { 0%{transform:scale(1)} 25%{transform:scale(1.7)} 50%{transform:scale(0.85)} 70%{transform:scale(1.25)} 100%{transform:scale(1)} }
    @keyframes grMountainRise { from{transform:translateY(80px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes grStarTwinkle { 0%,100%{opacity:var(--gr-op,0.4)} 50%{opacity:calc(var(--gr-op,0.4) * 0.25)} }
    @keyframes grEvilGlow { 0%,100%{filter:drop-shadow(0 0 14px rgba(0,220,0,0.8))} 50%{filter:drop-shadow(0 0 50px rgba(0,255,0,1)) drop-shadow(0 0 100px rgba(80,255,80,0.5))} }
    @keyframes grOrnamentGlow { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.6) saturate(1.4)} }
    ${grinchMode ? `
      .pp-header { border-bottom: 2px solid #22cc22 !important; }
      body { background: #030d03 !important; }
    ` : ''}
    @media (prefers-reduced-motion:reduce) { *, *::before, *::after { transition-duration:0.01ms !important; animation-duration:0.01ms !important } }
    @media (max-width:640px) {
      .pp-header { flex-wrap:wrap; height:auto !important; padding:10px 14px !important; gap:6px; }
      .pp-tabs { width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; padding-bottom:2px; justify-content:flex-start !important; }
      .pp-tabs::-webkit-scrollbar { display:none; }
      .pp-main { padding:14px 12px !important; }
      .pp-grid-2 { grid-template-columns:1fr !important; }
      .pp-tips-grid { grid-template-columns:1fr !important; }
      .hero-stats { grid-template-columns:repeat(2, 1fr) !important; }
      .pp-chat-messages { min-height:260px !important; max-height:320px !important; }
    }
    @keyframes toastSlideIn { from{opacity:0;transform:translateY(-110%)} to{opacity:1;transform:translateY(0)} }
    @keyframes toastSlideOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-110%)} }
    .layer-toast { animation:toastSlideIn 0.35s cubic-bezier(0.22,1,0.36,1) both }
    .layer-toast-out { animation:toastSlideOut 0.3s ease-in both }
  `

  return (
    <div style={{ fontFamily:"'Sora',sans-serif", minHeight:'100vh', background: grinchMode ? 'linear-gradient(180deg,#030d03 0%,#020a02 60%,#010601 100%)' : homeAloneMode ? 'linear-gradient(180deg,#1a0505 0%,#110303 60%,#0d0202 100%)' : iceAgeMode ? 'linear-gradient(180deg,#0a1628 0%,#0d2040 40%,#0a2535 100%)' : kingJulienMode ? 'linear-gradient(135deg,#1a0533 0%,#0a2010 50%,#2d1000 100%)' : interstellarMode ? '#000510' : minionsMode ? '#0d1a2e' : t.bg, color: grinchMode ? '#d4f4d4' : homeAloneMode ? '#ffe8e8' : iceAgeMode ? '#e0f4ff' : kingJulienMode ? '#fef9e7' : interstellarMode ? '#c8d8e8' : minionsMode ? '#e8f0fe' : t.text }}>
      <style>{CSS}</style>

      {/* ── PACKING LAYERS TOAST (global — shows on any tab) ── */}
      {layerToast && (
        <div className="layer-toast" style={{ position:'fixed', top:'16px', left:'50%', transform:'translateX(-50%)', zIndex:2000, pointerEvents:'auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', background: dark ? '#0d1625' : '#ffffff', border:`1px solid ${t.border}`, borderLeft:`3px solid ${t.accent}`, borderRadius:'10px', padding:'12px 18px', boxShadow:'0 8px 28px rgba(0,0,0,0.18)', fontSize:'14px', fontWeight:'500', color:t.text, whiteSpace:'nowrap', cursor:'pointer' }}
            onClick={() => { setLayerToast(false); setActiveTab('Packing List') }}>
            <span style={{ fontSize:'18px' }}>🧳</span>
            Your packing layers are ready! <span style={{ fontSize:'12px', color:t.accent, marginLeft:'4px' }}>View →</span>
            <button onClick={e => { e.stopPropagation(); setLayerToast(false) }} style={{ background:'none', border:'none', cursor:'pointer', color:t.textMuted, fontSize:'16px', padding:'0 0 0 4px', lineHeight:1 }}>✕</button>
          </div>
        </div>
      )}

      {/* KING JULIEN EASTER EGG */}
      {kingJulienMode && (<>
        {/* Pulsing bg overlay */}
        <div className="kj-bg" style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:5 }} />

        {/* Falling confetti emojis */}
        {KJ_CONFETTI.map(c => (
          <div key={c.id} style={{ position:'fixed', top:0, left:`${c.left}%`, fontSize:`${c.size}px`, zIndex:6, pointerEvents:'none', animationName:'kjConfettiFall', animationDuration:`${c.dur}s`, animationDelay:`${c.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear', willChange:'transform' }}>
            {c.emoji}
          </div>
        ))}

        {/* Bouncing King Julien */}
        <div style={{ position:'fixed', left: kjState.x, top: kjState.y, width:120, height:120, zIndex:70, pointerEvents:'none', transform:`rotate(${kjState.rot}deg) scaleX(${kjState.flip ? -kjState.sx : kjState.sx}) scaleY(${kjState.sy})`, willChange:'transform' }}>
          <img className="kj-img" src="/king_julien.png" alt="King Julien" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
        </div>

        {/* Speech bubble near King Julien */}
        <div key={kjQuoteIdx} className="kj-speech" style={{ position:'fixed', left: Math.min(kjState.x + 130, window.innerWidth - 240), top: Math.max(kjState.y - 10, 70), zIndex:71, pointerEvents:'none', maxWidth:220 }}>
          <div style={{ background:'rgba(255,255,255,0.97)', border:'2.5px solid #a855f7', borderRadius:'14px', padding:'8px 12px', fontSize:'13px', fontWeight:'600', color:'#581c87', lineHeight:1.4, boxShadow:'0 4px 20px rgba(168,85,247,0.4)', position:'relative' }}>
            {KJ_QUOTES[kjQuoteIdx]}
            <div style={{ position:'absolute', left:'-10px', top:'50%', transform:'translateY(-50%)', width:0, height:0, borderTop:'7px solid transparent', borderBottom:'7px solid transparent', borderRight:'10px solid #a855f7' }} />
          </div>
        </div>

        {/* Party banner */}
        <div className="kj-banner" style={{ position:'fixed', top:0, left:0, right:0, zIndex:1003, pointerEvents:'none' }}>
          <div style={{ background:'linear-gradient(90deg,#7e22ce,#b45309,#15803d,#b91c1c,#7e22ce)', backgroundSize:'300% 100%', padding:'7px 16px', textAlign:'center', fontSize:'14px', fontWeight:'700', color:'#fef08a', letterSpacing:'0.04em', animationName:'kjBannerGrad', animationDuration:'4s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            👑&nbsp; Welcome to MY kingdom! I like to MOVE IT MOVE IT! 🕺🎶&nbsp; 👑
          </div>
        </div>
      </>)}

      {/* ── INTERSTELLAR EASTER EGG ── */}
      {interstellarMode && isPhase > 0 && (<>

        {/* Stars — always visible */}
        {IS_STARS.map(s => (
          <div key={s.id} style={{ position:'fixed', left:`${s.x}%`, top:`${s.y}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'#fff', zIndex:7, pointerEvents:'none', animationName:'isStarTwinkle', animationDuration:`${s.dur}s`, animationDelay:`${s.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }} />
        ))}

        {/* ── PHASE 1: STAY ── */}
        {isPhase === 1 && (
          <div style={{ position:'fixed', inset:0, background:'#000', zIndex:200, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'isFadeIn 1.2s ease both' }}>
            {/* Scanline effect */}
            <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)', pointerEvents:'none', zIndex:1 }} />
            {/* Morse code */}
            <div style={{ fontFamily:'monospace', fontSize:12, color:'rgba(255,255,255,0.3)', letterSpacing:'0.35em', marginBottom:48, animationName:'isMorseFlicker', animationDuration:'0.9s', animationIterationCount:'infinite', zIndex:2 }}>
              &bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;&bull;&nbsp;—&nbsp;&nbsp;&nbsp;—&nbsp;&bull;&nbsp;—&nbsp;—
            </div>
            {/* STAY */}
            <div style={{ fontSize:'clamp(64px,12vw,128px)', fontWeight:200, color:'#fff', fontFamily:"'Sora',sans-serif", letterSpacing:'0.35em', animationName:'isStayIn', animationDuration:'2.2s', animationDelay:'0.4s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)', zIndex:2 }}>
              STAY
            </div>
            {/* Subtitle */}
            <div style={{ marginTop:28, fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:300, letterSpacing:'0.2em', animationName:'isFadeIn', animationDuration:'1.5s', animationDelay:'2.2s', animationFillMode:'both', zIndex:2 }}>
              Don't let me leave, Murph.
            </div>
            {/* Dust motes */}
            {IS_DUST.map(d => (
              <div key={d.id} style={{ position:'absolute', left:`${d.x}%`, top:'8%', width:'2px', height:'2px', borderRadius:'50%', background:'rgba(255,195,130,0.65)', pointerEvents:'none', zIndex:3, animationName:'isDustDrift', animationDuration:`${d.dur}s`, animationDelay:`${d.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear', '--is-dx':`${d.dx}px` }} />
            ))}
            <button onClick={() => setIsPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:6, color:'rgba(255,255,255,0.3)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.12em', zIndex:4 }}>skip →</button>
          </div>
        )}

        {/* ── PHASE 2: BOOKSHELF ── */}
        {isPhase === 2 && (
          <div style={{ position:'fixed', inset:0, background:'#0c0800', zIndex:200, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'isFadeIn 1s ease both', overflow:'hidden' }}>
            {/* Gargantua faint bg */}
            <div style={{ position:'absolute', inset:0, backgroundImage:`url('/interstellar.png')`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.06, zIndex:0 }} />
            {/* Ambient floor gradient */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'40%', background:'linear-gradient(to top,#1c0f04,transparent)', zIndex:1 }} />
            {/* Label */}
            <div style={{ fontSize:10, color:'rgba(255,195,100,0.45)', letterSpacing:'0.35em', textTransform:'uppercase', marginBottom:18, zIndex:2, animationName:'isFadeIn', animationDuration:'1s', animationFillMode:'both' }}>
              The books are a message. Read them.
            </div>
            {/* 3 shelves */}
            <div style={{ position:'relative', zIndex:2, width:'min(720px,92vw)', perspective:'500px', perspectiveOrigin:'50% 200%' }}>
              {[0,1,2].map(shelf => (
                <div key={shelf} style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:3, marginBottom:6, borderBottom:`3px solid #3d2610`, paddingBottom:3 }}>
                  {IS_BOOKS.filter(b => b.shelf === shelf).map(book => (
                    <div key={book.id} style={{ width:book.w, height:book.h, background:book.color, borderRadius:'1px 3px 3px 1px', transformStyle:'preserve-3d', animationName:book.pushed?'isBookPush':'none', animationDuration:`${book.pushDur}s`, animationDelay:`${book.pushDelay + shelf * 0.9}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out', boxShadow:'inset -3px 0 6px rgba(0,0,0,0.3),2px 0 5px rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {book.pushed && <div style={{ width:2, height:'55%', background:'rgba(255,195,80,0.35)', borderRadius:1 }} />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* STAY in dust */}
            <div style={{ marginTop:22, fontSize:26, fontWeight:200, letterSpacing:'0.7em', color:'rgba(255,195,80,0.5)', animationName:'isMorseFlicker', animationDuration:'3.5s', animationIterationCount:'infinite', zIndex:2 }}>
              S T A Y
            </div>
            {/* Dust */}
            {IS_DUST.map(d => (
              <div key={d.id} style={{ position:'absolute', left:`${d.x}%`, top:'5%', width:'1.5px', height:'1.5px', borderRadius:'50%', background:'rgba(255,195,120,0.45)', pointerEvents:'none', zIndex:3, animationName:'isDustDrift', animationDuration:`${d.dur*1.6}s`, animationDelay:`${d.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear', '--is-dx':`${d.dx}px` }} />
            ))}
            <button onClick={() => setIsPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(255,195,80,0.15)', borderRadius:6, color:'rgba(255,195,80,0.35)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.12em', zIndex:4 }}>skip →</button>
          </div>
        )}

        {/* ── PHASE 3: TESSERACT ── */}
        {isPhase === 3 && (
          <div style={{ position:'fixed', inset:0, background:'#00001c', zIndex:200, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'isFadeIn 1s ease both', overflow:'hidden' }}>
            {/* Radiating spokes from center */}
            {Array.from({length:16}, (_, i) => (
              <div key={i} style={{ position:'absolute', left:'50%', top:'50%', width:'55vmax', height:'1px', background:`linear-gradient(to right, rgba(100,200,255,${i%2===0?0.35:0.18}), transparent)`, transformOrigin:'0 50%', transform:`rotate(${i*22.5}deg)`, pointerEvents:'none' }} />
            ))}
            {/* interstellar.png faint in bg */}
            <div style={{ position:'absolute', inset:0, backgroundImage:`url('/interstellar.png')`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.12, zIndex:0 }} />
            {/* Tesseract */}
            <div style={{ perspective:'700px', zIndex:2 }}>
              <div style={{ width:200, height:200, position:'relative', transformStyle:'preserve-3d', animationName:'isCubeOuter', animationDuration:'14s', animationTimingFunction:'linear', animationIterationCount:'infinite' }}>
                {/* Outer cube faces */}
                {['translateZ(100px)','rotateY(180deg) translateZ(100px)','rotateY(90deg) translateZ(100px)','rotateY(-90deg) translateZ(100px)','rotateX(90deg) translateZ(100px)','rotateX(-90deg) translateZ(100px)'].map((tf,i) => (
                  <div key={`o${i}`} style={{ position:'absolute', width:200, height:200, border:`1.5px solid rgba(${i<2?'100,200,255':'160,130,255'},0.45)`, background:'rgba(0,10,40,0.04)', transform:tf }} />
                ))}
                {/* Inner cube */}
                <div style={{ position:'absolute', width:100, height:100, top:50, left:50, transformStyle:'preserve-3d', animationName:'isCubeInner', animationDuration:'9s', animationTimingFunction:'linear', animationIterationCount:'infinite' }}>
                  {['translateZ(50px)','rotateY(180deg) translateZ(50px)','rotateY(90deg) translateZ(50px)','rotateY(-90deg) translateZ(50px)','rotateX(90deg) translateZ(50px)','rotateX(-90deg) translateZ(50px)'].map((tf,i) => (
                    <div key={`n${i}`} style={{ position:'absolute', width:100, height:100, border:`1.5px solid rgba(200,150,255,0.55)`, background:'rgba(20,0,50,0.04)', transform:tf }} />
                  ))}
                  {/* Center point */}
                  <div style={{ position:'absolute', width:14, height:14, top:43, left:43, borderRadius:'50%', background:'rgba(180,140,255,0.9)', boxShadow:'0 0 20px rgba(180,140,255,1), 0 0 50px rgba(100,200,255,0.6)', animationName:'isCenterPulse', animationDuration:'2s', animationIterationCount:'infinite' }} />
                </div>
              </div>
            </div>
            {/* Quote */}
            <div style={{ marginTop:44, fontSize:13, color:'rgba(120,200,255,0.85)', letterSpacing:'0.18em', textAlign:'center', maxWidth:380, lineHeight:1.75, animationName:'isGlow', animationDuration:'3s', animationIterationCount:'infinite', zIndex:2, padding:'0 20px' }}>
              LOVE IS THE ONE THING THAT TRANSCENDS TIME AND SPACE
            </div>
            {/* Gravity equation */}
            <div style={{ marginTop:14, fontFamily:'monospace', fontSize:11, color:'rgba(120,200,255,0.35)', letterSpacing:'0.08em', zIndex:2 }}>
              G&#x03BC;&#x03BD; + &#x039B;g&#x03BC;&#x03BD; = 8&#x03C0;G/c&#x2074; T&#x03BC;&#x03BD;
            </div>
            <button onClick={() => setIsPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(100,200,255,0.15)', borderRadius:6, color:'rgba(100,200,255,0.35)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.12em', zIndex:4 }}>skip →</button>
          </div>
        )}

        {/* ── PHASE 4: STEADY STATE ── */}
        {isPhase === 4 && (<>
          {/* Gargantua background */}
          <div style={{ position:'fixed', inset:0, backgroundImage:`url('/interstellar.png')`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.2, zIndex:6, pointerEvents:'none' }} />
          {/* Vignette */}
          <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse at 60% 50%, transparent 25%, rgba(0,1,8,0.78) 100%)', zIndex:8, pointerEvents:'none' }} />
          {/* Mission banner */}
          <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:1003, pointerEvents:'none', animationName:'isBannerSlide', animationDuration:'1s', animationFillMode:'both' }}>
            <div style={{ background:'linear-gradient(90deg,rgba(0,5,20,0.97),rgba(0,10,35,0.97))', borderBottom:'1px solid rgba(100,200,255,0.2)', padding:'7px 20px', display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:'10px 16px' }}>
              <span style={{ fontSize:10, fontWeight:700, color:'rgba(100,200,255,0.95)', letterSpacing:'0.28em' }}>🌌 MILLER'S PLANET</span>
              <span style={{ fontSize:10, color:'rgba(100,200,255,0.3)' }}>│</span>
              <span style={{ fontSize:10, color:'rgba(100,200,255,0.7)', letterSpacing:'0.14em' }}>GARGANTUA SYSTEM</span>
              <span style={{ fontSize:10, color:'rgba(100,200,255,0.3)' }}>│</span>
              <span style={{ fontSize:10, color:'rgba(255,210,70,0.85)', letterSpacing:'0.14em', animationName:'isTimerTick', animationDuration:'3s', animationIterationCount:'infinite' }}>Δt: 1 HR ≈ 7 EARTH YEARS</span>
              <span style={{ fontSize:10, color:'rgba(100,200,255,0.3)' }}>│</span>
              <span style={{ fontSize:10, color:'rgba(100,200,255,0.55)', letterSpacing:'0.1em' }}>ENDURANCE MISSION: ACTIVE</span>
            </div>
          </div>
          {/* Quote carousel */}
          <div key={isQuoteIdx} style={{ position:'fixed', bottom:65, left:'50%', transform:'translateX(-50%)', zIndex:1003, pointerEvents:'none', animationName:'isQuoteIn', animationDuration:'0.9s', animationFillMode:'both', maxWidth:'min(520px,88vw)', textAlign:'center' }}>
            <div style={{ fontSize:13, color:'rgba(150,215,255,0.72)', fontStyle:'italic', letterSpacing:'0.04em', lineHeight:1.65 }}>
              {IS_QUOTES[isQuoteIdx]}
            </div>
          </div>
          {/* TARS status */}
          <div style={{ position:'fixed', bottom:18, right:18, zIndex:1003, pointerEvents:'none', animationName:'isFadeIn', animationDuration:'2s', animationFillMode:'both' }}>
            <div style={{ fontSize:9, color:'rgba(100,200,255,0.45)', fontFamily:'monospace', letterSpacing:'0.16em', textAlign:'right', lineHeight:2 }}>
              TARS: OPERATIONAL<br/>
              HONESTY: 90%&nbsp;│&nbsp;HUMOR: 75%<br/>
              PACK ASSIST: ACTIVE
            </div>
          </div>
          {/* Wormhole ring - decorative corner */}
          <div style={{ position:'fixed', bottom:'-60px', left:'-60px', width:220, height:220, borderRadius:'50%', border:'2px solid rgba(100,200,255,0.12)', boxShadow:'0 0 40px rgba(100,200,255,0.08)', zIndex:6, pointerEvents:'none', animationName:'isOrbGlow', animationDuration:'5s', animationIterationCount:'infinite' }} />
        </>)}

      </>)}

      {/* ── MINIONS EASTER EGG ── */}
      {minionsMode && minionsPhase > 0 && (<>

        {/* ── PHASE 1: B·A·N·A·N·A ── */}
        {minionsPhase === 1 && (
          <div style={{ position:'fixed', inset:0, zIndex:200, background:'#000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'mnFadeIn 0.5s ease both', overflow:'hidden' }}>
            {/* Yellow pulse bg */}
            <div style={{ position:'absolute', inset:0, animationName:'mnYellowPulse', animationDuration:'2s', animationIterationCount:'infinite', pointerEvents:'none' }} />
            {/* Gibberish line */}
            <div style={{ fontSize:12, color:'rgba(255,220,0,0.3)', letterSpacing:'0.3em', marginBottom:44, animationName:'mnGibberish', animationDuration:'1.3s', animationIterationCount:'infinite', zIndex:2 }}>
              bello &nbsp;·&nbsp; tulaliloo &nbsp;·&nbsp; papoy &nbsp;·&nbsp; poopaye
            </div>
            {/* B·A·N·A·N·A letters */}
            <div style={{ display:'flex', gap:'clamp(2px,1.2vw,14px)', alignItems:'center', zIndex:2 }}>
              {['B','A','N','A','N','A','!'].map((l, i) => (
                <span key={i} style={{ fontSize:'clamp(46px,10vw,108px)', fontWeight:900, color: i===6 ? '#fff' : '#ffdc00', display:'inline-block', fontFamily:"'Sora',sans-serif", animationName:'mnLetterSlam', animationDuration:'0.55s', animationDelay:`${i*0.16}s`, animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)', textShadow:'0 0 28px rgba(255,220,0,0.55), 0 4px 0 rgba(0,0,0,0.65)' }}>{l}</span>
              ))}
            </div>
            {/* Subtitle */}
            <div style={{ marginTop:26, fontSize:13, color:'rgba(255,255,255,0.38)', letterSpacing:'0.14em', fontWeight:300, animationName:'mnFadeIn', animationDuration:'1s', animationDelay:'1.6s', animationFillMode:'both', textAlign:'center', maxWidth:380, padding:'0 24px', zIndex:2, lineHeight:1.6 }}>
              They speak very little English.<br/>But they understand banana.
            </div>
            {/* Single banana drifting */}
            <div style={{ position:'absolute', left:'50%', top:'-5vh', fontSize:38, animationName:'mnBananaFloat', animationDuration:'4.5s', animationDelay:'0.3s', animationFillMode:'both', animationTimingFunction:'linear', pointerEvents:'none', zIndex:2 }}>🍌</div>
            <button onClick={() => setMinionsPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(255,220,0,0.18)', borderRadius:6, color:'rgba(255,220,0,0.32)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.1em', zIndex:4 }}>skip →</button>
          </div>
        )}

        {/* ── PHASE 2: MEET THE CREW ── */}
        {minionsPhase === 2 && (
          <div style={{ position:'fixed', inset:0, zIndex:200, background:'linear-gradient(180deg,#080e1e 0%,#0c1830 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', animation:'mnFadeIn 0.8s ease both', overflow:'hidden' }}>
            {/* Banana rain */}
            {MINIONS_BANANAS.map(b => (
              <div key={b.id} style={{ position:'absolute', top:0, left:`${b.left}%`, fontSize:`${b.size}px`, pointerEvents:'none', animationName:'mnBananFall', animationDuration:`${b.dur}s`, animationDelay:`${b.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear' }}>🍌</div>
            ))}
            {/* Header */}
            <div style={{ position:'absolute', top:36, left:0, right:0, textAlign:'center', zIndex:2, animationName:'mnFadeIn', animationDuration:'0.6s', animationFillMode:'both' }}>
              <div style={{ fontSize:11, color:'rgba(255,220,0,0.5)', letterSpacing:'0.4em', textTransform:'uppercase' }}>Meet the most important members of the team</div>
            </div>
            {/* Three minions */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', width:'100%', gap:'clamp(6px,2.5vw,28px)', padding:'0 clamp(6px,3vw,32px) 0', zIndex:2 }}>
              {/* Kevin */}
              <div style={{ flex:1, maxWidth:210, display:'flex', flexDirection:'column', alignItems:'center', animationName:'mnMinionRise', animationDuration:'0.85s', animationDelay:'0.1s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)' }}>
                <div style={{ position:'relative', width:'100%' }}>
                  <div style={{ position:'absolute', top:-8, right:-8, background:'#fffde7', border:'2.5px solid #ffdc00', borderRadius:10, padding:'5px 10px', fontSize:12, fontWeight:700, color:'#3d2a00', whiteSpace:'nowrap', zIndex:3, animationName:'mnSpeechPop', animationDuration:'0.4s', animationDelay:'1.3s', animationFillMode:'both', boxShadow:'0 3px 10px rgba(0,0,0,0.35)' }}>Bello! 👋</div>
                  <img src="/kevin.jpg" alt="Kevin" style={{ width:'100%', objectFit:'contain', display:'block' }} />
                </div>
                <div style={{ marginTop:10, textAlign:'center', animationName:'mnNameCard', animationDuration:'0.5s', animationDelay:'0.7s', animationFillMode:'both' }}>
                  <div style={{ fontSize:'clamp(15px,2.8vw,22px)', fontWeight:900, color:'#ffdc00', letterSpacing:'0.14em' }}>KEVIN</div>
                  <div style={{ fontSize:10, color:'rgba(255,220,0,0.5)', letterSpacing:'0.22em', marginTop:3 }}>THE TALL ONE</div>
                </div>
              </div>
              {/* Bob */}
              <div style={{ flex:'0 0 auto', width:'clamp(90px,18vw,180px)', display:'flex', flexDirection:'column', alignItems:'center', animationName:'mnMinionRise', animationDuration:'0.85s', animationDelay:'0.28s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)' }}>
                <div style={{ position:'relative', width:'100%' }}>
                  <div style={{ position:'absolute', top:-8, left:-16, background:'#fffde7', border:'2.5px solid #ffdc00', borderRadius:10, padding:'5px 10px', fontSize:12, fontWeight:700, color:'#3d2a00', whiteSpace:'nowrap', zIndex:3, animationName:'mnSpeechPop', animationDuration:'0.4s', animationDelay:'1.6s', animationFillMode:'both', boxShadow:'0 3px 10px rgba(0,0,0,0.35)' }}>BANANA! 🍌</div>
                  <img src="/bob.jpg" alt="Bob" style={{ width:'100%', objectFit:'contain', display:'block' }} />
                </div>
                <div style={{ marginTop:10, textAlign:'center', animationName:'mnNameCard', animationDuration:'0.5s', animationDelay:'0.8s', animationFillMode:'both' }}>
                  <div style={{ fontSize:'clamp(15px,2.8vw,22px)', fontWeight:900, color:'#ffdc00', letterSpacing:'0.14em' }}>BOB</div>
                  <div style={{ fontSize:10, color:'rgba(255,220,0,0.5)', letterSpacing:'0.22em', marginTop:3 }}>THE BRAVE ONE</div>
                </div>
              </div>
              {/* Stuart */}
              <div style={{ flex:1, maxWidth:210, display:'flex', flexDirection:'column', alignItems:'center', animationName:'mnMinionRise', animationDuration:'0.85s', animationDelay:'0.45s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)' }}>
                <div style={{ position:'relative', width:'100%' }}>
                  <div style={{ position:'absolute', top:-8, left:-16, background:'#fffde7', border:'2.5px solid #ffdc00', borderRadius:10, padding:'5px 10px', fontSize:12, fontWeight:700, color:'#3d2a00', whiteSpace:'nowrap', zIndex:3, animationName:'mnSpeechPop', animationDuration:'0.4s', animationDelay:'1.9s', animationFillMode:'both', boxShadow:'0 3px 10px rgba(0,0,0,0.35)' }}>Tulaliloo! 💛</div>
                  <img src="/stuart.jpg" alt="Stuart" style={{ width:'100%', objectFit:'contain', display:'block' }} />
                </div>
                <div style={{ marginTop:10, textAlign:'center', animationName:'mnNameCard', animationDuration:'0.5s', animationDelay:'0.9s', animationFillMode:'both' }}>
                  <div style={{ fontSize:'clamp(15px,2.8vw,22px)', fontWeight:900, color:'#ffdc00', letterSpacing:'0.14em' }}>STUART</div>
                  <div style={{ fontSize:10, color:'rgba(255,220,0,0.5)', letterSpacing:'0.22em', marginTop:3 }}>THE COOL ONE</div>
                </div>
              </div>
            </div>
            {/* Crowd rises over them */}
            <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'min(400px,72vw)', zIndex:3, animationName:'mnCrowdRise', animationDuration:'1s', animationDelay:'2.4s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)' }}>
              <img src="/minions_crowd.jpg" alt="The Crew" style={{ width:'100%', objectFit:'contain', display:'block' }} />
            </div>
            <button onClick={() => setMinionsPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(255,220,0,0.18)', borderRadius:6, color:'rgba(255,220,0,0.32)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.1em', zIndex:10 }}>skip →</button>
          </div>
        )}

        {/* ── PHASE 3: THE LAIR ── */}
        {minionsPhase === 3 && (
          <div style={{ position:'fixed', inset:0, zIndex:200, background:'#050e1c', display:'flex', alignItems:'center', justifyContent:'center', animation:'mnFadeIn 0.8s ease both', overflow:'hidden' }}>
            {/* Lair background zoom */}
            <div style={{ position:'absolute', inset:0, backgroundImage:`url('/gru_lair.jpg')`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.5, animationName:'mnLairZoom', animationDuration:'6s', animationFillMode:'both', animationTimingFunction:'ease-out' }} />
            {/* Dark gradient */}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,rgba(5,14,28,0.35) 0%,transparent 45%,rgba(5,14,28,0.6) 100%)' }} />
            {/* Banana rain */}
            {MINIONS_BANANAS.map(b => (
              <div key={b.id} style={{ position:'absolute', top:0, left:`${b.left}%`, fontSize:`${b.size}px`, pointerEvents:'none', animationName:'mnBananFall', animationDuration:`${b.dur}s`, animationDelay:`${b.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear' }}>🍌</div>
            ))}
            {/* Gru — left, large and proud */}
            <div style={{ position:'absolute', bottom:0, left:'clamp(-10px,1vw,16px)', width:'clamp(150px,26vw,300px)', zIndex:3, animationName:'mnGruSlide', animationDuration:'1s', animationDelay:'0.4s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)' }}>
              <img src="/minions_gru.jpg" alt="Gru" style={{ width:'100%', objectFit:'contain', display:'block' }} />
            </div>
            {/* Text right side */}
            <div style={{ position:'relative', zIndex:3, textAlign:'center', marginLeft:'28%', padding:'0 24px' }}>
              <div style={{ fontSize:'clamp(34px,7.5vw,88px)', fontWeight:900, color:'#ffdc00', letterSpacing:'0.06em', animationName:'mnSlamIn', animationDuration:'0.65s', animationDelay:'0.9s', animationFillMode:'both', textShadow:'0 0 28px rgba(255,220,0,0.55), 0 4px 0 rgba(0,0,0,0.8)' }}>
                LIGHTBULB.
              </div>
              <div style={{ marginTop:12, fontSize:15, color:'rgba(255,255,255,0.55)', letterSpacing:'0.18em', fontWeight:300, animationName:'mnFadeIn', animationDuration:'0.8s', animationDelay:'1.7s', animationFillMode:'both' }}>
                "Tonight... the moon!"
              </div>
              {/* Crowd group — bottom of text block */}
              <div style={{ marginTop:22, display:'flex', justifyContent:'center', animationName:'mnFadeIn', animationDuration:'0.9s', animationDelay:'2.2s', animationFillMode:'both' }}>
                <img src="/minions_crowd.jpg" alt="Minions" style={{ width:'clamp(120px,20vw,220px)', objectFit:'contain' }} />
              </div>
            </div>
            <button onClick={() => setMinionsPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(255,220,0,0.18)', borderRadius:6, color:'rgba(255,220,0,0.32)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.1em', zIndex:10 }}>skip →</button>
          </div>
        )}

        {/* ── PHASE 4: STEADY STATE ── */}
        {minionsPhase === 4 && (<>
          {/* Gru background — like Gargantua */}
          <div style={{ position:'fixed', inset:0, backgroundImage:`url('/minions_gru.jpg')`, backgroundSize:'cover', backgroundPosition:'center top', opacity:0.2, zIndex:6, pointerEvents:'none' }} />
          {/* Vignette */}
          <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse at 50% 70%, transparent 22%, rgba(5,12,22,0.86) 100%)', zIndex:7, pointerEvents:'none' }} />
          {/* Sparse banana rain */}
          {MINIONS_BANANAS.filter((_,i) => i%3===0).map(b => (
            <div key={b.id} style={{ position:'fixed', top:0, left:`${b.left}%`, fontSize:`${b.size}px`, zIndex:8, pointerEvents:'none', animationName:'mnBananFall', animationDuration:`${b.dur*1.5}s`, animationDelay:`${b.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear' }}>🍌</div>
          ))}
          {/* Kevin peeks left */}
          <div style={{ position:'fixed', bottom:0, left:'1%', width:'min(108px,15vw)', zIndex:70, pointerEvents:'none', animationName:'mnPeek', animationDuration:'2.3s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <img src="/kevin.jpg" alt="Kevin" style={{ width:'100%', objectFit:'contain', display:'block' }} />
          </div>
          {/* Bob peeks center */}
          <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'min(84px,11vw)', zIndex:70, pointerEvents:'none', animationName:'mnPeek', animationDuration:'1.85s', animationDelay:'0.55s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <img src="/bob.jpg" alt="Bob" style={{ width:'100%', objectFit:'contain', display:'block' }} />
          </div>
          {/* Stuart peeks right */}
          <div style={{ position:'fixed', bottom:0, right:'1%', width:'min(96px,13vw)', zIndex:70, pointerEvents:'none', animationName:'mnPeek', animationDuration:'2.05s', animationDelay:'1.05s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <img src="/stuart.jpg" alt="Stuart" style={{ width:'100%', objectFit:'contain', display:'block' }} />
          </div>
          {/* Crowd group photo — bottom corner */}
          <div style={{ position:'fixed', bottom:78, right:12, width:'min(128px,17vw)', zIndex:69, pointerEvents:'none', opacity:0.88, animationName:'mnWiggle', animationDuration:'3.2s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <img src="/minions_crowd.jpg" alt="The Crew" style={{ width:'100%', objectFit:'contain', display:'block' }} />
          </div>
          {/* Banner */}
          <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:1003, pointerEvents:'none', animationName:'mnBannerIn', animationDuration:'0.9s', animationFillMode:'both' }}>
            <div style={{ background:'linear-gradient(90deg,rgba(8,14,28,0.97),rgba(12,20,45,0.97))', borderBottom:'2px solid rgba(255,220,0,0.32)', padding:'7px 20px', display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:'10px 16px' }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#ffdc00', letterSpacing:'0.28em' }}>🍌 GRU'S SECRET LAIR</span>
              <span style={{ fontSize:10, color:'rgba(255,220,0,0.28)' }}>│</span>
              <span style={{ fontSize:10, color:'rgba(255,220,0,0.7)', letterSpacing:'0.14em' }}>DEPTH: 3,000m</span>
              <span style={{ fontSize:10, color:'rgba(255,220,0,0.28)' }}>│</span>
              <span style={{ fontSize:10, color:'rgba(255,220,0,0.85)', letterSpacing:'0.14em' }}>VECTOR IS NOT A THREAT</span>
              <span style={{ fontSize:10, color:'rgba(255,220,0,0.28)' }}>│</span>
              <span style={{ fontSize:10, color:'rgba(255,220,0,0.6)', letterSpacing:'0.1em' }}>ANTARCTICA BASE: ACTIVE</span>
            </div>
          </div>
          {/* Quote carousel */}
          <div key={minionsQuoteIdx} style={{ position:'fixed', bottom:65, left:'50%', transform:'translateX(-50%)', zIndex:1003, pointerEvents:'none', animationName:'mnQuoteIn', animationDuration:'0.7s', animationFillMode:'both', maxWidth:'min(480px,86vw)', textAlign:'center' }}>
            <div style={{ fontSize:13, color:'rgba(255,230,80,0.8)', fontStyle:'italic', letterSpacing:'0.04em', lineHeight:1.65 }}>
              {MINIONS_QUOTES[minionsQuoteIdx]}
            </div>
          </div>
          {/* Stats */}
          <div style={{ position:'fixed', bottom:20, right:18, zIndex:1003, pointerEvents:'none', animationName:'mnFadeIn', animationDuration:'2s', animationFillMode:'both' }}>
            <div style={{ fontSize:9, color:'rgba(255,220,0,0.38)', fontFamily:'monospace', letterSpacing:'0.16em', textAlign:'right', lineHeight:2 }}>
              MINIONS ON DUTY: 10,400<br/>
              BANANAS CONSUMED: ∞<br/>
              VILLAIN RATING: DESPICABLE
            </div>
          </div>
        </>)}

      </>)}


      {/* ── ICE AGE EASTER EGG ── */}
      {iceAgeMode && iceAgePhase > 0 && (<>

        {/* Always: falling snowflakes */}
        {ICE_SNOWFLAKES.map(s => (
          <div key={s.id} style={{ position:'fixed', top:0, left:`${s.left}%`, fontSize:`${s.size}px`, zIndex:8, pointerEvents:'none', opacity:s.opacity, animationName:'iaSnowfall', animationDuration:`${s.dur}s`, animationDelay:`${s.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear', '--drift':`${s.drift}px`, willChange:'transform' }}>❄</div>
        ))}

        {/* PHASE 1: Frozen intro */}
        {iceAgePhase === 1 && (
          <div style={{ position:'fixed', inset:0, background:'linear-gradient(180deg,#0a1a35 0%,#071528 60%,#030e1e 100%)', zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'iaFreezeIn 0.8s ease both' }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(100,180,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
            {/* Ice chunks decoration */}
            {ICE_CHUNKS.map(c => (
              <div key={c.id} style={{ position:'absolute', left:`${c.x}%`, top:`${c.y}%`, width:c.size, height:c.size*0.6, background:'linear-gradient(135deg,rgba(147,210,255,0.15),rgba(200,240,255,0.05))', border:'1px solid rgba(147,210,255,0.2)', borderRadius:'4px 12px 8px 6px', transform:`rotate(${c.angle}deg)`, opacity:c.opacity, pointerEvents:'none' }} />
            ))}
            <div style={{ fontSize:'clamp(13px,2vw,18px)', fontWeight:'700', letterSpacing:'0.45em', color:'rgba(147,210,255,0.5)', textTransform:'uppercase', marginBottom:'18px', animation:'iaSlideIn 1s 0.3s both' }}>Pack Perfect Presents</div>
            <div style={{ fontSize:'clamp(52px,10vw,110px)', fontWeight:'900', letterSpacing:'-0.01em', color:'#fff', textAlign:'center', lineHeight:0.9, animation:'iaTitleSlam 1.1s 0.7s cubic-bezier(0.22,1,0.36,1) both', textShadow:'0 0 60px rgba(147,210,255,0.6), 0 0 120px rgba(147,210,255,0.3), 0 4px 30px rgba(0,0,0,0.8)' }}>
              ICE<br/><span style={{ color:'#7dd3fc' }}>AGE</span>
            </div>
            <div style={{ marginTop:'22px', fontSize:'clamp(12px,1.6vw,16px)', color:'rgba(147,210,255,0.6)', letterSpacing:'0.2em', textTransform:'uppercase', animation:'iaSlideIn 0.9s 1.4s both' }}>Antarctica Edition</div>
            <div style={{ marginTop:'40px', fontSize:'13px', color:'rgba(100,160,200,0.35)', animation:'iaSlideIn 0.8s 2.2s both' }}>❄ Preparing your frozen expedition... ❄</div>
            <button onClick={() => { setIaSplit(true); setIceAgePhase(2) }} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(147,210,255,0.15)', borderRadius:6, color:'rgba(147,210,255,0.3)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.12em', zIndex:4 }}>skip →</button>
          </div>
        )}

        {/* PHASE 2: PAGE SPLITS IN HALF */}
        {iceAgePhase === 2 && iaSplit && (
          <div style={{ position:'fixed', inset:0, zIndex:350, overflow:'hidden', pointerEvents:'none' }}>
            {/* Left half */}
            <div style={{ position:'absolute', left:0, top:0, width:'50%', height:'100%', background:'linear-gradient(180deg,#0a1a35,#071528)', animation:'iaSplitLeft 1.8s cubic-bezier(0.55,0,0.45,1) 0.4s both', transformOrigin:'left center' }}>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(100,180,255,0.07),transparent)' }} />
              <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'3px', background:'linear-gradient(180deg,transparent,rgba(147,210,255,0.8) 20%,rgba(200,240,255,1) 50%,rgba(147,210,255,0.8) 80%,transparent)', boxShadow:'0 0 20px rgba(147,210,255,0.8), 0 0 40px rgba(147,210,255,0.4)' }} />
              <div style={{ position:'absolute', top:'35%', left:'10%', right:'10%', textAlign:'center' }}>
                <div style={{ fontSize:'clamp(40px,8vw,90px)', fontWeight:'900', color:'#fff', textShadow:'0 0 40px rgba(147,210,255,0.5)' }}>ICE</div>
              </div>
              {/* Ice crack lines on left */}
              {ICE_CRACKS.slice(0,3).map(c => (
                <div key={c.id} style={{ position:'absolute', right:`${c.x-47}%`, top:'30%', width:`${c.len}px`, height:`${c.w}px`, background:'rgba(147,210,255,0.6)', transform:`rotate(${c.angle}deg)`, transformOrigin:'right center', animation:'iaCrackFlash 0.8s 0.3s both', boxShadow:'0 0 6px rgba(147,210,255,0.8)' }} />
              ))}
            </div>
            {/* Right half */}
            <div style={{ position:'absolute', right:0, top:0, width:'50%', height:'100%', background:'linear-gradient(180deg,#071528,#030e1e)', animation:'iaSplitRight 1.8s cubic-bezier(0.55,0,0.45,1) 0.4s both', transformOrigin:'right center' }}>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(100,180,255,0.07),transparent)' }} />
              <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'3px', background:'linear-gradient(180deg,transparent,rgba(147,210,255,0.8) 20%,rgba(200,240,255,1) 50%,rgba(147,210,255,0.8) 80%,transparent)', boxShadow:'0 0 20px rgba(147,210,255,0.8), 0 0 40px rgba(147,210,255,0.4)' }} />
              <div style={{ position:'absolute', top:'35%', left:'10%', right:'10%', textAlign:'center' }}>
                <div style={{ fontSize:'clamp(40px,8vw,90px)', fontWeight:'900', color:'#7dd3fc', textShadow:'0 0 40px rgba(147,210,255,0.6)' }}>AGE</div>
              </div>
              {/* Ice crack lines on right */}
              {ICE_CRACKS.slice(3).map(c => (
                <div key={c.id} style={{ position:'absolute', left:`${47-c.x+47}%`, top:'35%', width:`${c.len}px`, height:`${c.w}px`, background:'rgba(147,210,255,0.6)', transform:`rotate(${-c.angle}deg)`, transformOrigin:'left center', animation:'iaCrackFlash 0.8s 0.3s both', boxShadow:'0 0 6px rgba(147,210,255,0.8)' }} />
              ))}
            </div>
            {/* Crack glow at center */}
            <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:'6px', transform:'translateX(-50%)', background:'linear-gradient(180deg,transparent 0%,rgba(200,240,255,1) 30%,rgba(147,210,255,0.9) 70%,transparent 100%)', boxShadow:'0 0 30px rgba(147,210,255,1), 0 0 60px rgba(147,210,255,0.6)', animation:'iaCrackFlash 2s ease both', zIndex:2 }} />
          </div>
        )}

        {/* PHASE 3: Reassembling */}
        {iceAgePhase === 3 && (
          <div style={{ position:'fixed', inset:0, background:'rgba(10,22,40,0.9)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', animation:'iaFreezeIn 0.6s ease both' }}>
            <div style={{ textAlign:'center', animation:'iaSlideIn 0.8s ease both' }}>
              <div style={{ fontSize:'clamp(38px,7vw,80px)', fontWeight:'900', color:'#fff', letterSpacing:'-0.02em', textShadow:'0 0 50px rgba(147,210,255,0.7), 0 4px 20px rgba(0,0,0,0.8)' }}>
                ICE <span style={{ color:'#7dd3fc' }}>AGE</span>
              </div>
              <div style={{ marginTop:'16px', fontSize:'14px', color:'rgba(147,210,255,0.7)', letterSpacing:'0.15em' }}>THE GLACIER IS LOADING...</div>
              <div style={{ marginTop:'24px', display:'flex', gap:'8px', justifyContent:'center' }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#7dd3fc', opacity:0.3+(i*0.14), animationName:'iaIcePulse', animationDuration:'1.2s', animationDelay:`${i*0.18}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 4: Full ice age theme active */}
        {iceAgePhase === 4 && (<>
          {/* Icy bg overlay */}
          <div style={{ position:'fixed', inset:0, background:'linear-gradient(180deg,rgba(10,22,40,0.4) 0%,transparent 40%,rgba(5,15,28,0.3) 100%)', zIndex:6, pointerEvents:'none' }} />

          {/* Scrat chasing acorn */}
          <div className="ia-acorn-glow" style={{ position:'fixed', left:scratState.ax, top:scratState.ay, width:180, height:180, zIndex:75, pointerEvents:'none', transform:`scaleX(${scratState.flip ? -1 : 1})`, willChange:'transform' }}>
            <img src="/acorn.jpg" alt="acorn" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
          </div>
          <div className="ia-scrat" style={{ position:'fixed', left:scratState.sx - 30, top:scratState.sy - 30, width:260, height:260, zIndex:74, pointerEvents:'none', transform:`scaleX(${scratState.ax < scratState.sx ? -1 : 1})`, willChange:'transform' }}>
            <img src="/scrat.jpg" alt="Scrat" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
          </div>

          {/* Ice age banner at top */}
          <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:1003, pointerEvents:'none', animation:'iaSlideIn 0.8s ease both' }}>
            <div style={{ background:'linear-gradient(90deg,#0c2a5e,#1a4a8a,#0c3060,#1a4a8a,#0c2a5e)', backgroundSize:'300% 100%', padding:'7px 16px', textAlign:'center', fontSize:'13px', fontWeight:'700', color:'#bfecff', letterSpacing:'0.05em', animationName:'iaBannerShimmer', animationDuration:'5s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out', borderBottom:'1px solid rgba(125,211,252,0.3)' }}>
              ❄&nbsp; WELCOME TO ANTARCTICA — ICE AGE EXPEDITION MODE ACTIVE ❄&nbsp; 🦣 Manny, Sid & Diego approve your packing list 🐿️&nbsp; ❄
            </div>
          </div>

          {/* Rotating quote at bottom */}
          <div key={iceAgeQuoteIdx} style={{ position:'fixed', bottom:65, left:'50%', transform:'translateX(-50%)', zIndex:1003, pointerEvents:'none', animationName:'iaQuoteIn', animationDuration:'0.7s', animationFillMode:'both', maxWidth:'min(520px,88vw)', textAlign:'center' }}>
            <div style={{ background:'rgba(10,25,50,0.92)', border:'1px solid rgba(125,211,252,0.35)', borderRadius:'12px', padding:'10px 18px', fontSize:'13px', fontWeight:'500', color:'#bfecff', letterSpacing:'0.02em', boxShadow:'0 4px 20px rgba(0,0,0,0.5), 0 0 20px rgba(125,211,252,0.1)' }}>
              {ICE_AGE_QUOTES[iceAgeQuoteIdx]}
            </div>
          </div>

          {/* Bottom-right ice age watermark */}
          <div style={{ position:'fixed', bottom:18, right:18, zIndex:1010, pointerEvents:'none', animation:'iaFreezeIn 2s ease both' }}>
            <div style={{ fontFamily:'monospace', fontSize:9, color:'rgba(125,211,252,0.35)', letterSpacing:'0.14em', textAlign:'right', lineHeight:2 }}>
              TEMP: -89°C<br/>
              PENGUINS: MANY<br/>
              ACORNS: 1<br/>
              SCRAT: CHASING ❄
            </div>
          </div>
        </>)}

      </>)}

      {/* ── HOME ALONE EASTER EGG ── */}
      {homeAloneMode && haPhase > 0 && (<>

        {/* Always: falling snow */}
        {HA_SNOWFLAKES.map(s => (
          <div key={s.id} style={{ position:'fixed', top:0, left:`${s.left}%`, fontSize:`${s.size}px`, zIndex:8, pointerEvents:'none', opacity:s.opacity, animationName:'haSnowfall', animationDuration:`${s.dur}s`, animationDelay:`${s.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear', '--ha-drift':`${s.drift}px` }}>❄</div>
        ))}

        {/* PHASE 1: VHS intro → HOME ALONE title */}
        {haPhase === 1 && (
          <div style={{ position:'fixed', inset:0, zIndex:300, background:'#0a0000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'haVhsFlicker 0.18s 3', overflow:'hidden' }}>
            {/* Scanline effect */}
            <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)', zIndex:2, pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'rgba(255,255,255,0.06)', animationName:'haScanline', animationDuration:'4s', animationIterationCount:'infinite', animationTimingFunction:'linear', zIndex:3 }} />
            {/* VHS Play badge */}
            <div style={{ position:'absolute', top:18, left:20, display:'flex', alignItems:'center', gap:'6px', zIndex:4, animation:'haSubIn 0.5s 0.3s both' }}>
              <div style={{ width:0, height:0, borderTop:'7px solid transparent', borderBottom:'7px solid transparent', borderLeft:'12px solid #cc0000' }} />
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.28em', color:'rgba(255,80,80,0.8)', textTransform:'uppercase' }}>PLAY</span>
            </div>
            {/* Pack Perfect Presents */}
            <div style={{ fontSize:'clamp(11px,1.7vw,15px)', fontWeight:'600', letterSpacing:'0.5em', color:'rgba(255,180,180,0.45)', textTransform:'uppercase', marginBottom:'20px', animation:'haSubIn 0.9s 0.5s both', zIndex:4 }}>Pack Perfect Presents</div>
            {/* HOME ALONE title */}
            <div style={{ zIndex:4, textAlign:'center', animation:'haTitleIn 1.1s 1s cubic-bezier(0.22,1,0.36,1) both' }}>
              <div style={{ fontSize:'clamp(62px,14vw,148px)', fontWeight:900, lineHeight:0.88, letterSpacing:'-0.02em', textShadow:'0 0 60px rgba(220,30,30,0.7), 0 0 120px rgba(180,0,0,0.4), 0 6px 40px rgba(0,0,0,0.9)' }}>
                <span style={{ color:'#fff' }}>HOME</span><br/>
                <span style={{ color:'#c41e3a' }}>ALONE</span>
              </div>
            </div>
            <div style={{ marginTop:'24px', fontSize:'clamp(11px,1.5vw,14px)', color:'rgba(255,160,160,0.55)', letterSpacing:'0.22em', textTransform:'uppercase', animation:'haSubIn 0.9s 1.9s both', zIndex:4 }}>Christmas 1990 Edition</div>
            <div style={{ marginTop:'36px', fontSize:'13px', color:'rgba(220,80,80,0.3)', animation:'haSubIn 0.8s 2.7s both', zIndex:4 }}>🎄 Kevin is home... alone. Preparing his packing list. 🎄</div>
            <button onClick={() => setHaPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(220,80,80,0.2)', borderRadius:6, color:'rgba(220,80,80,0.35)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.12em', zIndex:10 }}>skip →</button>
          </div>
        )}

        {/* PHASE 2: THE SCREAM */}
        {haPhase === 2 && (
          <div style={{ position:'fixed', inset:0, zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animationName:'haScreamBg', animationDuration:'1.6s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out', overflow:'hidden' }}>
            {/* Shock rings */}
            {[0,1,2,3].map(i => (
              <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:'200px', height:'200px', border:'4px solid rgba(255,80,80,0.6)', borderRadius:'50%', animationName:'haShockRing', animationDuration:'1.8s', animationDelay:`${i*0.45}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-out' }} />
            ))}
            {/* KEVIN! label */}
            <div style={{ fontSize:'clamp(18px,3.5vw,32px)', fontWeight:800, letterSpacing:'0.35em', color:'rgba(255,200,200,0.7)', textTransform:'uppercase', marginBottom:'18px', animation:'haSubIn 0.5s 0.2s both' }}>KEVIN!</div>
            {/* The scream face */}
            <img src="/kevin_face.jpg" alt="Kevin" style={{ width:'clamp(180px,35vw,340px)', objectFit:'contain', zIndex:2, borderRadius:'8px', animationName:'haScreamPulse', animationDuration:'0.55s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out', filter:'drop-shadow(0 0 40px rgba(255,60,60,0.9))' }} />
            {/* AAAAHHHH */}
            <div style={{ fontSize:'clamp(28px,6vw,64px)', fontWeight:900, color:'#fff', letterSpacing:'0.08em', marginTop:'16px', animation:'haTitleIn 0.7s 0.4s both', textShadow:'0 0 30px rgba(255,100,100,0.9)' }}>AAAAHHHH!</div>
            <div style={{ marginTop:'14px', fontSize:'clamp(12px,1.8vw,16px)', color:'rgba(255,180,180,0.6)', letterSpacing:'0.15em', animation:'haSubIn 0.8s 1.1s both' }}>He forgot his packing list.</div>
            <div style={{ marginTop:'6px', fontSize:'12px', color:'rgba(255,140,140,0.38)', animation:'haSubIn 0.8s 1.8s both' }}>and his aftershave.</div>
            <button onClick={() => setHaPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(220,80,80,0.2)', borderRadius:6, color:'rgba(220,80,80,0.35)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.12em', zIndex:10 }}>skip →</button>
          </div>
        )}

        {/* PHASE 3: Booby Trap Packing List */}
        {haPhase === 3 && (
          <div style={{ position:'fixed', inset:0, zIndex:300, background:'linear-gradient(180deg,#120202 0%,#0d0101 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', animationName:'haRedPulse', animationDuration:'2s', animationIterationCount:'infinite' }}>
            {/* Snow */}
            {HA_SNOWFLAKES.filter((_,i) => i%3===0).map(s => (
              <div key={s.id} style={{ position:'absolute', top:0, left:`${s.left}%`, fontSize:`${s.size*0.7}px`, pointerEvents:'none', opacity:s.opacity*0.6, animationName:'haSnowfall', animationDuration:`${s.dur*1.2}s`, animationDelay:`${s.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear', '--ha-drift':`${s.drift}px` }}>❄</div>
            ))}
            <div style={{ position:'relative', zIndex:2, width:'100%', maxWidth:520, padding:'0 24px' }}>
              {/* Header */}
              <div style={{ textAlign:'center', marginBottom:'28px' }}>
                <div style={{ fontSize:'clamp(11px,1.6vw,13px)', fontWeight:700, letterSpacing:'0.4em', color:'rgba(255,120,120,0.5)', textTransform:'uppercase', marginBottom:'10px', animation:'haSubIn 0.6s both' }}>Preparing Defensive Packing List</div>
                <div style={{ fontSize:'clamp(26px,5.5vw,48px)', fontWeight:900, color:'#fff', textShadow:'0 0 30px rgba(196,30,58,0.8)', animation:'haTitleIn 0.8s 0.3s both' }}>Kevin's Way 🛡️</div>
              </div>
              {/* Trap items */}
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {HA_TRAPS.map((trap, i) => (
                  haTrapIdx >= i && (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 16px', background:'rgba(196,30,58,0.08)', border:'1px solid rgba(196,30,58,0.25)', borderRadius:'10px', animationName:'haTrapSlide', animationDuration:'0.4s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)' }}>
                      <span style={{ fontSize:'22px' }}>{trap.icon}</span>
                      <div>
                        <div style={{ fontSize:'14px', fontWeight:'600', color:'#ffd0d0' }}>{trap.name}</div>
                        <div style={{ fontSize:'11px', color:'rgba(255,160,160,0.5)', marginTop:'1px' }}>{trap.note}</div>
                      </div>
                      <div style={{ marginLeft:'auto', fontSize:'11px', color:'rgba(196,30,58,0.7)', fontWeight:600 }}>✓ PACKED</div>
                    </div>
                  )
                ))}
              </div>
            </div>
            <button onClick={() => setHaPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(220,80,80,0.2)', borderRadius:6, color:'rgba(220,80,80,0.35)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.12em', zIndex:10 }}>skip →</button>
          </div>
        )}

        {/* PHASE 4: Steady State */}
        {haPhase === 4 && (<>
          {/* Dark red bg overlay */}
          <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse at 50% 30%, rgba(139,0,0,0.12) 0%, transparent 65%)', zIndex:6, pointerEvents:'none' }} />

          {/* Christmas lights banner */}
          <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:1003, pointerEvents:'none', animationName:'haBannerIn', animationDuration:'0.8s', animationFillMode:'both' }}>
            <div style={{ background:'linear-gradient(90deg,#0d0202,#1a0404,#0d0202)', borderBottom:'1.5px solid rgba(196,30,58,0.4)', padding:'6px 0 4px' }}>
              {/* Wire */}
              <div style={{ position:'absolute', top:'50%', left:0, right:0, height:'2px', background:'rgba(80,40,20,0.7)', transform:'translateY(-50%)' }} />
              {/* Lights */}
              <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center' }}>
                {HA_LIGHTS.map(l => (
                  <div key={l.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', animationName:'haLightSwing', animationDuration:`${2.2+(l.id%5)*0.3}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out', animationDelay:`${l.delay}s` }}>
                    <div style={{ width:'3px', height:'6px', background:'rgba(80,40,20,0.8)' }} />
                    <div style={{ width:'12px', height:'16px', background:l.color, borderRadius:'2px 2px 50% 50%', boxShadow:`0 0 8px 3px ${l.color}88`, animationName:'haLightBlink', animationDuration:`${1.4+(l.id%7)*0.25}s`, animationDelay:`${l.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }} />
                  </div>
                ))}
              </div>
              {/* Banner text */}
              <div style={{ textAlign:'center', marginTop:'4px', fontSize:'11px', fontWeight:'700', color:'rgba(255,180,180,0.7)', letterSpacing:'0.22em', textTransform:'uppercase' }}>
                🎄 MERRY CHRISTMAS, YA FILTHY ANIMALS 🎄
              </div>
            </div>
          </div>

          {/* Kevin peeking bottom-left */}
          <div style={{ position:'fixed', bottom:0, left:'2%', zIndex:70, pointerEvents:'none', animationName:'haKevinPeek', animationDuration:'2.4s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <img src="/kevin_face.jpg" alt="Kevin" style={{ width:'clamp(52px,9vw,90px)', objectFit:'contain', display:'block', borderRadius:'6px 6px 0 0', filter:'drop-shadow(0 0 8px rgba(196,30,58,0.6))' }} />
            <div style={{ fontSize:'9px', color:'rgba(255,160,160,0.5)', textAlign:'center', letterSpacing:'0.1em', fontWeight:600 }}>KEVIN</div>
          </div>


          {/* Wet Bandits peeking bottom-right */}
          <div style={{ position:'fixed', bottom:0, right:'2%', zIndex:70, pointerEvents:'none', animationName:'haMarvPeek', animationDuration:'2.1s', animationDelay:'0.6s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <img src="/marvharry.png" alt="Wet Bandits" style={{ width:'clamp(60px,11vw,110px)', objectFit:'contain', display:'block', borderRadius:'6px 6px 0 0', filter:'drop-shadow(0 0 8px rgba(80,120,255,0.5))' }} />
            <div style={{ fontSize:'9px', color:'rgba(150,180,255,0.5)', textAlign:'center', letterSpacing:'0.1em', fontWeight:600 }}>WET BANDITS</div>
          </div>

          {/* Rotating quotes */}
          <div key={haQuoteIdx} style={{ position:'fixed', bottom:62, left:'50%', transform:'translateX(-50%)', zIndex:1003, pointerEvents:'none', animationName:'haQuoteIn', animationDuration:'0.7s', animationFillMode:'both', maxWidth:'min(520px,88vw)', textAlign:'center' }}>
            <div style={{ background:'rgba(20,2,2,0.93)', border:'1px solid rgba(196,30,58,0.35)', borderRadius:'12px', padding:'10px 18px', fontSize:'13px', fontWeight:'500', color:'#ffd0d0', letterSpacing:'0.02em', boxShadow:'0 4px 20px rgba(0,0,0,0.6), 0 0 20px rgba(196,30,58,0.08)' }}>
              {HA_QUOTES[haQuoteIdx]}
            </div>
          </div>

          {/* Bottom-right watermark */}
          <div style={{ position:'fixed', bottom:18, right:18, zIndex:1010, pointerEvents:'none' }}>
            <div style={{ fontFamily:'monospace', fontSize:9, color:'rgba(196,30,58,0.32)', letterSpacing:'0.14em', textAlign:'right', lineHeight:2 }}>
              WET BANDITS: ACTIVE<br/>
              BOOBY TRAPS: ARMED<br/>
              PIZZA: ORDERED<br/>
              KEVIN: HOME ALONE 🏠
            </div>
          </div>
        </>)}

      </>)}

      {/* ── GRINCH EASTER EGG ── */}
      {grinchMode && grinchPhase > 0 && (<>

        {/* Always: falling snow */}
        {GRINCH_SNOWFLAKES.map(s => (
          <div key={s.id} style={{ position:'fixed', top:0, left:`${s.left}%`, fontSize:`${s.size}px`, zIndex:8, pointerEvents:'none', opacity:s.opacity, animationName:'grSnowfall', animationDuration:`${s.dur}s`, animationDelay:`${s.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear', '--gr-drift':`${s.drift}px` }}>❄</div>
        ))}

        {/* PHASE 1: Mount Crumpit cinematic intro */}
        {grinchPhase === 1 && (
          <div style={{ position:'fixed', inset:0, zIndex:300, background:'radial-gradient(ellipse at 50% 30%, #0a1e0a 0%, #030b03 60%, #000400 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            {/* Stars */}
            {GRINCH_STARS.map(s => (
              <div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'#e8ffe8', opacity:s.opacity, animationName:'grStarTwinkle', animationDuration:`${s.dur}s`, animationDelay:`${s.delay}s`, animationIterationCount:'infinite', '--gr-op':s.opacity }} />
            ))}
            {/* Mountain silhouette */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'38vh', background:'linear-gradient(180deg, transparent 0%, #001400 35%, #000700 100%)', clipPath:'polygon(0% 100%, 0% 68%, 6% 60%, 12% 72%, 18% 42%, 25% 62%, 32% 22%, 38% 50%, 44% 32%, 49% 48%, 54% 26%, 61% 48%, 68% 34%, 74% 52%, 80% 40%, 86% 55%, 92% 42%, 97% 58%, 100% 48%, 100% 100%)', zIndex:1, animationName:'grMountainRise', animationDuration:'1.9s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)' }} />
            {/* Moon */}
            <div style={{ position:'absolute', top:'12%', right:'14%', width:60, height:60, borderRadius:'50%', background:'radial-gradient(circle at 38% 38%, #e8f5e8, #c8eac8)', boxShadow:'0 0 30px 10px rgba(100,200,100,0.15)', opacity:0.7, animation:'grSubIn 2s 0.3s both' }} />
            {/* Content */}
            <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 24px', marginBottom:'12vh' }}>
              <div style={{ fontSize:'clamp(11px,1.5vw,13px)', fontWeight:700, letterSpacing:'0.5em', color:'rgba(100,220,100,0.4)', textTransform:'uppercase', marginBottom:'16px', animation:'grSubIn 0.9s 0.6s both' }}>Pack Perfect Presents</div>
              <div style={{ fontSize:'clamp(13px,1.8vw,15px)', color:'rgba(160,220,160,0.45)', letterSpacing:'0.06em', lineHeight:1.8, marginBottom:'28px', maxWidth:540, animation:'grSubIn 0.9s 1.1s both' }}>
                Every Who down in Whoville liked Christmas a lot...<br/>
                <span style={{ color:'rgba(80,150,80,0.4)', fontStyle:'italic' }}>But the Grinch, who lived just north of Whoville... <strong style={{ color:'rgba(100,180,100,0.6)' }}>did not.</strong></span>
              </div>
              <div style={{ animation:'grTitleSlam 1.1s 1.8s cubic-bezier(0.22,1,0.36,1) both' }}>
                <div style={{ fontSize:'clamp(58px,13vw,138px)', fontWeight:900, lineHeight:0.88, letterSpacing:'-0.02em', textShadow:'0 0 60px rgba(34,200,34,0.6), 0 0 120px rgba(0,140,0,0.3), 0 6px 40px rgba(0,0,0,0.95)' }}>
                  <span style={{ color:'#33ee33' }}>WHO</span><span style={{ color:'rgba(255,255,255,0.9)' }}>VILLE</span>
                </div>
              </div>
              <div style={{ marginTop:'22px', fontSize:'clamp(10px,1.4vw,13px)', color:'rgba(120,200,120,0.38)', letterSpacing:'0.22em', textTransform:'uppercase', animation:'grSubIn 0.9s 2.8s both' }}>Mount Crumpit · Elevation: Very High · Grinch Factor: Extreme</div>
              <div style={{ marginTop:'10px', fontSize:'12px', color:'rgba(80,160,80,0.28)', animation:'grSubIn 0.8s 3.5s both' }}>🎄 Population: Whos. Many, many Whos. 🎄</div>
            </div>
            <button onClick={() => setGrinchPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(34,200,34,0.18)', borderRadius:6, color:'rgba(34,200,34,0.32)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.1em', zIndex:10 }}>skip →</button>
          </div>
        )}

        {/* PHASE 2: WONDERFUL AWFUL IDEA */}
        {grinchPhase === 2 && (
          <div style={{ position:'fixed', inset:0, zIndex:300, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'clamp(16px,3vw,48px)', overflow:'hidden', animationName:'grBgPulse', animationDuration:'1.8s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out', padding:'0 24px' }}>
            {/* Left: Grinch face + laugh buildup */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', flexShrink:0 }}>
              {/* Shock rings behind face */}
              {[0,1,2].map(i => (
                <div key={i} style={{ position:'absolute', width:'200px', height:'200px', border:`${4-i}px solid rgba(34,200,34,${0.7-i*0.2})`, borderRadius:'50%', animationName:'grShockRing', animationDuration:'2s', animationDelay:`${i*0.55}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-out', pointerEvents:'none' }} />
              ))}
              <div style={{ fontSize:'clamp(11px,1.8vw,14px)', fontWeight:800, letterSpacing:'0.35em', color:'rgba(80,240,80,0.65)', textTransform:'uppercase', animation:'grSubIn 0.5s 0.2s both' }}>THEN HE GOT AN IDEA...</div>
              <img src="/grinch.png" alt="The Grinch" style={{ width:'clamp(130px,22vw,220px)', objectFit:'contain', zIndex:2, borderRadius:'8px', animationName:'grFaceZoom grEvilGlow', animationDuration:'0.9s, 1.6s', animationFillMode:'both, none', animationIterationCount:'1, infinite', filter:`drop-shadow(0 0 ${20+grinchScheduleIdx*6}px rgba(0,200,0,0.9))` }} />
              <div style={{ fontSize:'clamp(14px,2.8vw,32px)', fontWeight:900, color:'#33ff33', letterSpacing:'0.02em', animation:'grTitleSlam 0.8s 0.6s both', textShadow:'0 0 20px rgba(0,255,0,0.9)', textAlign:'center' }}>A WONDERFUL,<br/>AWFUL IDEA.</div>
              {/* Evil laugh that builds up */}
              {grinchScheduleIdx >= 0 && (() => {
                const lvl = Math.min(Math.floor(grinchScheduleIdx / 1.3), GRINCH_LAUGHS.length - 1)
                const laugh = GRINCH_LAUGHS[lvl]
                return (
                  <div key={lvl} style={{ fontSize:`${laugh.size}px`, fontWeight:900, color:laugh.color, textShadow:`0 0 ${lvl*8+8}px ${laugh.color}`, animationName:'grLaughBuild', animationDuration:'0.4s', animationFillMode:'both', letterSpacing:'0.02em', textAlign:'center', maxWidth:'clamp(160px,28vw,280px)', lineHeight:1.1 }}>
                    {laugh.text}
                  </div>
                )
              })()}
              {/* Evil meter */}
              {grinchScheduleIdx >= 0 && (
                <div style={{ width:'clamp(120px,18vw,200px)', animation:'grSubIn 0.5s both' }}>
                  <div style={{ fontSize:'9px', color:'rgba(80,200,80,0.5)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'4px' }}>Evil Level</div>
                  <div style={{ height:'6px', background:'rgba(0,60,0,0.4)', borderRadius:3, overflow:'hidden', border:'1px solid rgba(34,150,34,0.3)' }}>
                    <div style={{ height:'100%', background:`linear-gradient(90deg, #00aa00, #33ff33)`, borderRadius:3, width:`${Math.min(((grinchScheduleIdx+1)/GRINCH_SCHEDULE.length)*100, 100)}%`, transition:'width 0.5s ease', boxShadow:'0 0 8px rgba(0,255,0,0.6)' }} />
                  </div>
                  <div style={{ fontSize:'9px', color:'rgba(60,220,60,0.5)', marginTop:'3px', textAlign:'right', fontFamily:'monospace' }}>{Math.min(Math.round(((grinchScheduleIdx+1)/GRINCH_SCHEDULE.length)*100),100)}% EVIL</div>
                </div>
              )}
            </div>
            {/* Right: Schedule */}
            <div style={{ display:'flex', flexDirection:'column', gap:'5px', zIndex:2, width:'100%', maxWidth:380, flexShrink:1 }}>
              <div style={{ fontSize:'clamp(10px,1.3vw,12px)', color:'rgba(120,240,120,0.45)', letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:'6px', animation:'grSubIn 0.8s 1.3s both' }}>📋 The Grinch's Official Schedule:</div>
              {GRINCH_SCHEDULE.map((item, i) => (
                grinchScheduleIdx >= i && (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'7px 12px', background:`rgba(0,${40+i*4},0,0.18)`, border:`1px solid rgba(34,${130+i*8},34,0.28)`, borderRadius:'8px', animationName:'grScheduleIn', animationDuration:'0.32s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)', position:'relative', overflow:'hidden' }}>
                    {/* Glow sweep effect */}
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent 0%,rgba(0,255,0,0.04) 50%,transparent 100%)', pointerEvents:'none' }} />
                    <span style={{ fontSize:'11px', fontWeight:700, color:'rgba(80,220,80,0.7)', minWidth:36, letterSpacing:'0.05em', fontFamily:'monospace', flexShrink:0 }}>{item.time}</span>
                    <span style={{ fontSize:'clamp(11px,1.4vw,13px)', flex:1, color: item.done ? 'rgba(200,255,200,0.85)' : 'rgba(120,180,120,0.5)' }}>{item.task}</span>
                    {item.done
                      ? <span style={{ fontSize:'10px', color:'rgba(0,230,0,0.8)', fontWeight:800, flexShrink:0, textShadow:'0 0 6px rgba(0,220,0,0.5)' }}>✓</span>
                      : <span style={{ fontSize:'10px', color:'rgba(220,220,0,0.55)', fontWeight:700, flexShrink:0 }}>…</span>
                    }
                  </div>
                )
              ))}
            </div>
            <button onClick={() => setGrinchPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(34,200,34,0.18)', borderRadius:6, color:'rgba(34,200,34,0.32)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.1em', zIndex:10 }}>skip →</button>
          </div>
        )}

        {/* PHASE 3: THE HEIST */}
        {grinchPhase === 3 && (
          <div style={{ position:'fixed', inset:0, zIndex:300, background:'linear-gradient(180deg,#020804 0%,#010602 60%,#000300 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', animationName:'grFlicker', animationDuration:'8s', animationIterationCount:'infinite' }}>
            {GRINCH_SNOWFLAKES.filter((_,i)=>i%5===0).map(s => (
              <div key={s.id} style={{ position:'absolute', top:0, left:`${s.left}%`, fontSize:`${s.size*0.6}px`, pointerEvents:'none', opacity:s.opacity*0.35, animationName:'grSnowfall', animationDuration:`${s.dur*1.5}s`, animationDelay:`${s.delay}s`, animationIterationCount:'infinite', animationTimingFunction:'linear', '--gr-drift':`${s.drift}px` }}>❄</div>
            ))}

            {/* Spotlight sweep */}
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,60,0,0.08) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />

            <div style={{ position:'relative', zIndex:2, width:'100%', maxWidth:580, padding:'0 18px', display:'flex', flexDirection:'column', alignItems:'center' }}>
              {/* Header */}
              <div style={{ textAlign:'center', marginBottom:'16px', width:'100%' }}>
                <div style={{ fontSize:'clamp(9px,1.2vw,11px)', fontWeight:700, letterSpacing:'0.5em', color:'rgba(80,200,80,0.38)', textTransform:'uppercase', marginBottom:'6px', animation:'grSubIn 0.6s both' }}>🎅 Operation Christmas Removal · CLASSIFIED 🎅</div>
                <div style={{ fontSize:'clamp(22px,4.5vw,42px)', fontWeight:900, color:'#22dd22', textShadow:'0 0 25px rgba(0,200,0,0.7), 0 0 50px rgba(0,120,0,0.3)', animation:'grTitleSlam 0.8s 0.3s both', letterSpacing:'-0.01em' }}>THE GRINCH'S HAUL 🎄</div>
              </div>

              {/* Sack counter — top right */}
              {grinchStolenIdx >= 0 && (
                <div key={grinchStolenIdx} style={{ position:'fixed', top:18, right:18, zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', animationName:'grSackBounce', animationDuration:'0.55s', animationFillMode:'both' }}>
                  <div style={{ fontSize:'clamp(28px,5vw,48px)' }}>🎅</div>
                  <div style={{ fontSize:'clamp(16px,2.5vw,24px)', fontWeight:900, color:'#22ff22', textShadow:'0 0 12px rgba(0,255,0,0.7)', marginTop:'-4px' }}>{grinchStolenIdx + 1}</div>
                  <div style={{ fontSize:'9px', color:'rgba(80,200,80,0.5)', letterSpacing:'0.15em', textTransform:'uppercase' }}>items stolen</div>
                </div>
              )}

              {/* Items list */}
              <div style={{ display:'flex', flexDirection:'column', gap:'6px', width:'100%' }}>
                {GRINCH_STOLEN.map((item, i) => (
                  grinchStolenIdx >= i && (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'9px 14px', background:'rgba(0,50,0,0.22)', border:'1px solid rgba(34,140,34,0.25)', borderRadius:'9px', animationName:'grHeistSlide', animationDuration:'0.38s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)', position:'relative', overflow:'visible' }}>
                      <span style={{ fontSize:'22px', flexShrink:0 }}>{item.icon}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'clamp(11px,1.6vw,13px)', fontWeight:700, color:'rgba(200,255,200,0.9)' }}>{item.name}</div>
                        <div style={{ fontSize:'10px', color:'rgba(90,170,90,0.5)', marginTop:'1px', fontStyle:'italic' }}>{item.note}</div>
                        {/* Per-item Grinch comment — appears only on newest item */}
                        {grinchStolenIdx === i && (
                          <div style={{ fontSize:'10px', color:'rgba(100,230,100,0.7)', marginTop:'3px', animationName:'grCommentIn', animationDuration:'0.3s', animationFillMode:'both', animationDelay:'0.25s' }}>
                            {GRINCH_HEIST_COMMENTS[i]}
                          </div>
                        )}
                      </div>
                      {/* STOLEN stamp */}
                      <div style={{ position:'relative', flexShrink:0 }}>
                        <div style={{ fontSize:'clamp(8px,1.1vw,10px)', fontWeight:900, color:'#ff3333', border:'2px solid #ff3333', borderRadius:'4px', padding:'2px 6px', letterSpacing:'0.1em', transform:'rotate(-10deg)', display:'inline-block', boxShadow:'0 0 8px rgba(255,0,0,0.4)', animationName:'grStampIn', animationDuration:'0.45s', animationFillMode:'both', animationDelay:'0.2s', background:'rgba(60,0,0,0.3)', textShadow:'0 0 4px rgba(255,0,0,0.6)' }}>STOLEN</div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* All done message */}
              {grinchStolenIdx >= GRINCH_STOLEN.length - 1 && (
                <div style={{ marginTop:'16px', textAlign:'center', animation:'grSubIn 0.6s 0.5s both' }}>
                  <div style={{ fontSize:'clamp(12px,2vw,16px)', fontWeight:800, color:'rgba(34,255,34,0.8)', letterSpacing:'0.1em', textShadow:'0 0 12px rgba(0,220,0,0.6)' }}>💚 CHRISTMAS: SUCCESSFULLY RUINED 💚</div>
                  <div style={{ fontSize:'11px', color:'rgba(80,160,80,0.45)', marginTop:'4px', fontStyle:'italic' }}>"And he did it before the Whos woke up. Naturally." — Narrator</div>
                </div>
              )}
            </div>
            <button onClick={() => setGrinchPhase(4)} style={{ position:'absolute', bottom:22, right:22, background:'transparent', border:'1px solid rgba(34,200,34,0.18)', borderRadius:6, color:'rgba(34,200,34,0.32)', fontSize:11, padding:'5px 13px', cursor:'pointer', letterSpacing:'0.1em', zIndex:10 }}>skip →</button>
          </div>
        )}

        {/* PHASE 4: STEADY STATE — HEART GROWS 3 SIZES */}
        {grinchPhase === 4 && (<>
          {/* Ambient glow shifts from green to red as heart grows */}
          <div style={{ position:'fixed', inset:0, background:`radial-gradient(ellipse at 50% 20%, rgba(${grinchHeartSize >= 1 ? '120,20,20' : '0,80,0'},${grinchHeartSize >= 0 ? 0.14 : 0.07}) 0%, transparent 65%)`, zIndex:6, pointerEvents:'none', transition:'background 1.2s ease' }} />

          {/* Red heart confetti explosion when heart reaches max */}
          {grinchHeartSize >= 1 && GRINCH_HEART_CONFETTI.map(c => (
            <div key={c.id} style={{ position:'fixed', left:`${c.left}%`, bottom:'45%', fontSize:`${c.size}px`, zIndex:1002, pointerEvents:'none', animationName:'grRedHeart', animationDuration:`${c.dur}s`, animationDelay:`${c.delay}s`, animationFillMode:'both', animationTimingFunction:'ease-out', '--rot':`${c.rot}deg`, '--dx':`${c.dx}px` }}>
              {c.id % 4 === 0 ? '🎄' : c.id % 4 === 1 ? '⭐' : '❤️'}
            </div>
          ))}

          {/* THREE SIZES moment — big dramatic text */}
          {grinchHeartSize >= 1 && (
            <div style={{ position:'fixed', top:'18%', left:'50%', transform:'translateX(-50%)', zIndex:1008, pointerEvents:'none', textAlign:'center', width:'min(600px,90vw)', animation:'grSubIn 0.5s 0.1s both' }}>
              <div style={{ fontSize:'clamp(9px,1.3vw,11px)', fontWeight:700, letterSpacing:'0.55em', color:'rgba(255,200,100,0.8)', textTransform:'uppercase', marginBottom:'8px', animation:'grSubIn 0.5s 0.3s both' }}>And then a wonderful thing happened...</div>
              <div style={{ fontSize:'clamp(28px,6vw,64px)', fontWeight:900, color:'#ffeeaa', letterSpacing:'0.05em', textShadow:'0 0 40px rgba(255,200,80,0.7), 0 0 80px rgba(255,150,50,0.3)', animationName:'grThreeSizes', animationDuration:'0.8s', animationDelay:'0.4s', animationFillMode:'both', lineHeight:1.1 }}>
                HIS HEART GREW<br/><span style={{ color:'#ff6666', textShadow:'0 0 50px rgba(255,80,80,0.8)' }}>THREE SIZES.</span>
              </div>
              <div style={{ marginTop:'10px', fontSize:'clamp(11px,1.8vw,15px)', color:'rgba(255,220,150,0.65)', fontStyle:'italic', animation:'grSubIn 0.6s 1.2s both' }}>
                "And what happened then? Well, in Whoville they say<br/>that the Grinch's small heart grew three sizes that day."
              </div>
              <div style={{ marginTop:'14px', fontSize:'clamp(20px,3.5vw,36px)', animation:'grWhoJump 1s 1.8s infinite ease-in-out' }}>
                🎄👑🎅🦌🎁⭐🎊
              </div>
            </div>
          )}

          {/* Whoville Ornament Lights Banner */}
          <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:1003, pointerEvents:'none', animationName:'grBannerIn', animationDuration:'0.8s', animationFillMode:'both' }}>
            <div style={{ background: grinchHeartSize >= 1 ? 'linear-gradient(90deg,#1a0000,#0e0800,#1a0000)' : 'linear-gradient(90deg,#040e04,#071407,#040e04)', borderBottom:`1.5px solid ${grinchHeartSize >= 1 ? 'rgba(200,60,60,0.4)' : 'rgba(34,180,34,0.3)'}`, padding:'6px 0 5px', transition:'background 1.2s ease, border-color 1.2s ease' }}>
              <div style={{ position:'absolute', top:'50%', left:0, right:0, height:'2px', background:'rgba(30,18,10,0.8)', transform:'translateY(-50%)' }} />
              <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center' }}>
                {GRINCH_ORNAMENTS.map(o => (
                  <div key={o.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', animationName:'grLightSwing', animationDuration:`${2+o.dur*0.4}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out', animationDelay:`${o.delay}s` }}>
                    <div style={{ width:'2px', height:'7px', background:'rgba(30,16,8,0.9)' }} />
                    <div style={{ width:'13px', height:'16px', background:o.color, borderRadius:'50% 50% 40% 40%', boxShadow:`0 0 ${grinchHeartSize >= 1 ? 16 : 10}px 4px ${o.color}${grinchHeartSize >= 1 ? 'cc' : '88'}`, animationName:'grLightBlink grOrnamentGlow', animationDuration:`${1.2+o.id*0.19}s, ${1.8+o.id*0.13}s`, animationDelay:`${o.delay}s, ${o.delay*0.5}s`, animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }} />
                  </div>
                ))}
              </div>
              <div style={{ textAlign:'center', marginTop:'5px', fontSize:'10px', fontWeight:700, color: grinchHeartSize >= 1 ? 'rgba(255,180,100,0.8)' : 'rgba(180,255,180,0.6)', letterSpacing:'0.22em', textTransform:'uppercase', transition:'color 1.2s ease' }}>
                {grinchHeartSize >= 1 ? '❤️ MERRY CHRISTMAS FROM WHOVILLE — THE GRINCH IS REFORMED ❤️' : '🎄 WELCOME TO WHOVILLE — MERRY CHRISTMAS TO ALL WHOS 🎄'}
              </div>
            </div>
          </div>

          {/* Grinch peeking bottom-left */}
          <div style={{ position:'fixed', bottom:0, left:'2%', zIndex:70, pointerEvents:'none', animationName:'grGrinchPeek', animationDuration:'2.5s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <img src="/grinch.png" alt="The Grinch" style={{ width:'clamp(50px,9vw,90px)', objectFit:'contain', display:'block', borderRadius:'6px 6px 0 0', filter:`drop-shadow(0 0 ${grinchHeartSize >= 1 ? 16 : 10}px ${grinchHeartSize >= 1 ? 'rgba(255,80,80,0.7)' : 'rgba(0,180,0,0.65)'})` }} />
            <div style={{ fontSize:'9px', color: grinchHeartSize >= 1 ? 'rgba(255,160,100,0.7)' : 'rgba(100,220,100,0.5)', textAlign:'center', letterSpacing:'0.1em', fontWeight:600 }}>
              {grinchHeartSize >= 1 ? 'Reformed 💚' : 'THE GRINCH'}
            </div>
          </div>

          {/* Max peeking bottom-right */}
          <div style={{ position:'fixed', bottom:0, right:'2%', zIndex:70, pointerEvents:'none', animationName:'grMaxPeek', animationDuration:'2.1s', animationDelay:'0.8s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' }}>
            <img src="/max.png" alt="Max" style={{ width:'clamp(45px,8vw,78px)', objectFit:'contain', display:'block', borderRadius:'6px 6px 0 0', filter:`drop-shadow(0 0 8px ${grinchHeartSize >= 1 ? 'rgba(255,180,80,0.7)' : 'rgba(180,120,0,0.5)'})` }} />
            <div style={{ fontSize:'9px', color: grinchHeartSize >= 1 ? 'rgba(255,200,100,0.7)' : 'rgba(200,160,80,0.5)', textAlign:'center', letterSpacing:'0.1em', fontWeight:600 }}>
              {grinchHeartSize >= 1 ? 'Head Reindeer 🏅' : 'MAX 🦌'}
            </div>
          </div>

          {/* Heart grows 3 sizes — top right */}
          <div style={{ position:'fixed', top:72, right:20, zIndex:1005, pointerEvents:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' }}>
            <div style={{ fontSize:'9px', fontWeight:700, color:'rgba(100,210,100,0.4)', letterSpacing:'0.2em', textTransform:'uppercase' }}>Heart Size</div>
            <div key={grinchHeartSize} style={{ fontSize:'clamp(22px,3.2vw,32px)', animationName: grinchHeartSize >= 1 ? 'grHeartBloom' : 'grHeartGrow', animationDuration: grinchHeartSize >= 1 ? '0.9s' : '0.65s', animationFillMode:'both' }}>
              {grinchHeartSize >= 1 ? '❤️' : grinchHeartSize === 0 ? '💛' : '💚'}
            </div>
            <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.08em', color: grinchHeartSize >= 1 ? '#ff8888' : grinchHeartSize === 0 ? '#ffdd44' : 'rgba(100,200,100,0.55)', transition:'color 0.8s' }}>
              {grinchHeartSize < 0 ? `${grinchHeartSize} sizes` : grinchHeartSize === 0 ? 'warming up...' : `+${grinchHeartSize} sizes!!!`}
            </div>
            {grinchHeartSize >= 1 && (
              <div style={{ fontSize:'8px', color:'rgba(255,180,80,0.9)', letterSpacing:'0.1em', animation:'grSubIn 0.5s both', fontWeight:700, textShadow:'0 0 6px rgba(255,150,50,0.6)' }}>GREW 3 SIZES ❤️</div>
            )}
          </div>

          {/* Rotating quotes */}
          <div key={grinchQuoteIdx} style={{ position:'fixed', bottom:62, left:'50%', transform:'translateX(-50%)', zIndex:1003, pointerEvents:'none', animationName:'grQuoteIn', animationDuration:'0.7s', animationFillMode:'both', maxWidth:'min(520px,88vw)', textAlign:'center' }}>
            <div style={{ background: grinchHeartSize >= 1 ? 'rgba(20,5,5,0.95)' : 'rgba(3,10,3,0.94)', border:`1px solid ${grinchHeartSize >= 1 ? 'rgba(200,80,80,0.35)' : 'rgba(34,150,34,0.3)'}`, borderRadius:'12px', padding:'10px 18px', fontSize:'13px', fontWeight:500, color: grinchHeartSize >= 1 ? 'rgba(255,220,200,0.9)' : 'rgba(200,255,200,0.88)', letterSpacing:'0.02em', boxShadow:'0 4px 20px rgba(0,0,0,0.6)', transition:'all 1.2s ease' }}>
              {GRINCH_QUOTES[grinchQuoteIdx]}
            </div>
          </div>

          {/* Bottom-left status board */}
          <div style={{ position:'fixed', bottom:18, left:18, zIndex:1010, pointerEvents:'none' }}>
            <div style={{ fontFamily:'monospace', fontSize:9, color:'rgba(0,160,0,0.3)', letterSpacing:'0.1em', lineHeight:2 }}>
              CHRISTMAS: STOLEN → RETURNED<br/>
              ROAST BEAST: CARVED & SERVED<br/>
              MAX: PROMOTED TO HEAD REINDEER<br/>
              GRINCH: REFORMED ✓<br/>
              HEART: +3 SIZES (VERIFIED)
            </div>
          </div>
        </>)}

      </>)}

      {/* FULLSCREEN AD */}
      {showFullscreenAd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ position:'relative', background: dark ? '#0d1625' : '#ffffff', border:`2px solid ${t.border}`, borderRadius:'16px', width:'100%', maxWidth:'560px', aspectRatio:'16/9', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px' }}>
            <button onClick={() => { setShowFullscreenAd(false); if (listTimerRef.current) clearTimeout(listTimerRef.current); listTimerRef.current = setTimeout(() => { setListLoading(false); setListGenerated(true) }, 3000) }} style={{ position:'absolute', top:'12px', right:'12px', background: dark ? '#1a2d4a' : '#e5e7eb', border:'none', borderRadius:'50%', width:'32px', height:'32px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', color:t.text, lineHeight:1 }}>✕</button>
            <div style={{ fontSize:'11px', fontWeight:'700', color:t.textDim, textTransform:'uppercase', letterSpacing:'0.15em' }}>Advertisement</div>
            <div style={{ fontSize:'36px', fontWeight:'700', color:t.textMuted }}>Ad</div>
          </div>
        </div>
      )}

      {/* PREMIUM PASSWORD MODAL */}
      {showPremiumModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowPremiumModal(false); setPremiumPasswordInput(''); setPremiumPasswordError(false); setPremiumSelectedPlan(null) } }}>
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:'18px', padding:'36px 32px', maxWidth:'420px', width:'100%', textAlign:'center' }}>
            <div style={{ fontSize:'32px', marginBottom:'10px' }}>✦</div>
            <h2 style={{ fontSize:'20px', fontWeight:'600', color:t.text, marginBottom:'6px' }}>Unlock Premium</h2>
            <p style={{ fontSize:'13px', color:t.textMuted, marginBottom:'24px', lineHeight:'1.6' }}>Multi-location packing with live weather per destination</p>

            {!premiumSelectedPlan ? (
              <>
                <div style={{ marginBottom:'20px' }}>
                  <button onClick={() => setPremiumSelectedPlan('yearly')} style={{ width:'100%', border:`2px solid rgba(202,138,4,0.4)`, borderRadius:'14px', padding:'18px 12px', background: dark ? 'rgba(202,138,4,0.07)' : 'rgba(254,243,199,0.5)', cursor:'pointer', transition:'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#ca8a04'} onMouseLeave={e => e.currentTarget.style.borderColor='rgba(202,138,4,0.4)'}>
                    <div style={{ fontSize:'22px', fontWeight:'700', color:'#ca8a04' }}>$18.99</div>
                    <div style={{ fontSize:'12px', color:t.textMuted, marginTop:'4px' }}>per year</div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'18px' }}>
                  <button onClick={() => { setPremiumSelectedPlan(null); setPremiumPasswordInput(''); setPremiumPasswordError(false) }}
                    style={{ background:'transparent', border:`1px solid ${t.border}`, borderRadius:'6px', color:t.textMuted, fontSize:'12px', cursor:'pointer', padding:'3px 10px' }}>← Back</button>
                  <span style={{ fontSize:'13px', color:'#ca8a04', fontWeight:'600' }}>$18.99 / year</span>
                </div>
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
              </>
            )}

            <button onClick={() => { setShowPremiumModal(false); setPremiumPasswordInput(''); setPremiumPasswordError(false); setPremiumSelectedPlan(null) }}
              style={{ background:'transparent', border:'none', color:t.textMuted, fontSize:'13px', cursor:'pointer', width:'100%', padding:'6px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TRIP SURVEY MODAL */}
      {showTripSurvey && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowTripSurvey(false) }}>
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:'18px', padding:'32px 28px', maxWidth:'460px', width:'100%' }}>
            {!surveyDone ? (
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
                  <div>
                    <div style={{ fontSize:'18px', fontWeight:'600', color:t.text }}>List Saved! ✓</div>
                    <div style={{ fontSize:'12px', color:'#10b981', marginTop:'1px', marginBottom:'2px' }}>How did your last trip go?</div>
                    <div style={{ fontSize:'12px', color:t.textMuted }}>Question {surveyStep + 1} of 4</div>
                  </div>
                  <button onClick={() => setShowTripSurvey(false)} style={{ background:'transparent', border:'none', fontSize:'18px', cursor:'pointer', color:t.textMuted }}>✕</button>
                </div>
                <div style={{ background:t.inputBg, borderRadius:'6px', height:'4px', marginBottom:'20px', overflow:'hidden' }}>
                  <div style={{ background:'#10b981', height:'100%', width:`${((surveyStep + 1) / 4) * 100}%`, transition:'width 0.3s' }} />
                </div>

                {surveyStep === 0 && (
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'500', color:t.text, marginBottom:'14px' }}>Did you use everything you packed?</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                      {['Yes, used everything', 'Mostly — left a few things behind', 'No, I overpacked significantly'].map(opt => (
                        <button key={opt} onClick={() => setSurveyAnswers(a => ({ ...a, usedEverything: opt }))}
                          style={{ padding:'11px 14px', borderRadius:'8px', border:`1px solid ${surveyAnswers.usedEverything === opt ? '#10b981' : t.border}`, background: surveyAnswers.usedEverything === opt ? 'rgba(16,185,129,0.1)' : t.inputBg, color: surveyAnswers.usedEverything === opt ? '#10b981' : t.text, fontSize:'14px', cursor:'pointer', textAlign:'left', fontFamily:"'Sora',sans-serif" }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {surveyStep === 1 && (
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'500', color:t.text, marginBottom:'6px' }}>Anything you packed but didn't end up needing?</div>
                    <div style={{ fontSize:'12px', color:t.textMuted, marginBottom:'12px' }}>e.g. "extra jacket", "formal shoes", "3rd pair of shorts"</div>
                    <textarea value={surveyAnswers.leftBehind} onChange={e => setSurveyAnswers(a => ({ ...a, leftBehind: e.target.value }))}
                      placeholder="Leave blank if nothing comes to mind..."
                      rows={3} style={{ ...inputStyle, resize:'vertical', lineHeight:'1.5' }} />
                  </div>
                )}

                {surveyStep === 2 && (
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'500', color:t.text, marginBottom:'6px' }}>Anything you wished you had packed?</div>
                    <div style={{ fontSize:'12px', color:t.textMuted, marginBottom:'12px' }}>e.g. "rain jacket", "extra charger", "nicer shoes"</div>
                    <textarea value={surveyAnswers.shouldHavePacked} onChange={e => setSurveyAnswers(a => ({ ...a, shouldHavePacked: e.target.value }))}
                      placeholder="Leave blank if nothing comes to mind..."
                      rows={3} style={{ ...inputStyle, resize:'vertical', lineHeight:'1.5' }} />
                  </div>
                )}

                {surveyStep === 3 && (
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'500', color:t.text, marginBottom:'6px' }}>Any other packing feedback?</div>
                    <div style={{ fontSize:'12px', color:t.textMuted, marginBottom:'12px' }}>Optional — anything else about your last trip we should know</div>
                    <textarea value={surveyAnswers.otherFeedback} onChange={e => setSurveyAnswers(a => ({ ...a, otherFeedback: e.target.value }))}
                      placeholder="Optional..."
                      rows={3} style={{ ...inputStyle, resize:'vertical', lineHeight:'1.5' }} />
                  </div>
                )}

                <div style={{ display:'flex', gap:'8px', marginTop:'20px' }}>
                  {surveyStep > 0 && (
                    <button onClick={() => setSurveyStep(s => s - 1)} style={{ flex:1, background:'transparent', border:`1px solid ${t.border}`, borderRadius:'8px', padding:'10px', fontSize:'14px', color:t.textMuted, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>← Back</button>
                  )}
                  {surveyStep < 3 ? (
                    <button className="btn-primary" onClick={() => setSurveyStep(s => s + 1)}
                      disabled={surveyStep === 0 && !surveyAnswers.usedEverything}
                      style={{ flex:2, ...btnPrimary, background:'#10b981', opacity: surveyStep === 0 && !surveyAnswers.usedEverything ? 0.5 : 1 }}>
                      Next →
                    </button>
                  ) : (
                    <button className="btn-primary" onClick={() => { setSurveyDone(true); setShowTripSurvey(false) }}
                      style={{ flex:2, ...btnPrimary, background:'#10b981' }}>
                      Submit Feedback ✓
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:'40px', marginBottom:'12px' }}>🎉</div>
                <div style={{ fontSize:'18px', fontWeight:'600', color:t.text, marginBottom:'8px' }}>Thanks for the feedback!</div>
                <div style={{ fontSize:'13px', color:t.textMuted, lineHeight:'1.6' }}>We'll use what you shared to improve your next packing list.</div>
                <button className="btn-primary" onClick={() => setShowTripSurvey(false)} style={{ ...btnPrimary, marginTop:'20px', width:'auto', padding:'10px 28px' }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="pp-header" style={{ background:t.headerBg, borderBottom:`1px solid ${t.border}`, padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'56px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0, cursor:'pointer' }}
          onClick={() => { setActiveTab('Packing List'); setListGenerated(false); setListLoading(false); window.scrollTo({top:0,behavior:'smooth'}) }}>
          <img src="/logo.png" alt="PackPerfect logo" style={{ width:'42px', height:'42px', objectFit:'contain' }} />
          <span style={{ fontSize:'16px', fontWeight:'600', color:t.accent }}>PackPerfect</span>
          {destination && listGenerated && <span style={{ fontSize:'12px', color:t.textMuted, background:t.accentDim, padding:'2px 10px', borderRadius:'999px' }}>{destination}</span>}
        </div>
        <div className="pp-tabs" style={{ display:'flex', gap:'4px', alignItems:'center' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab
            return (
              <button key={tab} className="tab-btn" onClick={() => handleTabClick(tab)} style={{
                padding:'6px 13px', border:'none',
                borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontFamily:"'Sora',sans-serif",
                background: isActive ? t.accentDim : 'transparent',
                color: isActive ? t.accent : t.textMuted,
                fontWeight: isActive ? '500' : '400',
                whiteSpace:'nowrap',
              }}>
                {tab}
              </button>
            )
          })}
          {premiumUnlocked ? (
            <span style={{ padding:'5px 12px', border:'1px solid rgba(202,138,4,0.5)', borderRadius:'6px', fontSize:'12px', background:'rgba(202,138,4,0.1)', color:'#ca8a04', fontWeight:'600', whiteSpace:'nowrap', letterSpacing:'0.02em' }}>✦ Premium</span>
          ) : (
            <button className="tab-btn" onClick={() => setShowPremiumModal(true)} style={{
              padding:'6px 13px', border:'1px solid rgba(202,138,4,0.35)', borderRadius:'6px', cursor:'pointer',
              fontSize:'13px', fontFamily:"'Sora',sans-serif", background:'transparent',
              color:'rgba(202,138,4,0.8)', fontWeight:'400', whiteSpace:'nowrap',
            }}>🔒 Premium</button>
          )}
        </div>
      </div>

      <div className="pp-main" style={{ maxWidth:'860px', margin:'0 auto', padding:'24px 20px' }}>

        {/* ── PACKING LIST ── */}
        {activeTab === 'Packing List' && (
          <div>

            {/* ── PREMIUM MODE TOGGLE ── */}
            {premiumUnlocked && (
              <div style={{ display:'flex', gap:'6px', marginBottom:'12px', background:t.surface, border:`1px solid rgba(202,138,4,0.3)`, borderRadius:'10px', padding:'6px' }}>
                <button className="btn-pill" onClick={() => setPremiumMode(false)} style={{
                  flex:1, padding:'7px 12px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500',
                  background: !premiumMode ? 'rgba(202,138,4,0.15)' : 'transparent',
                  color: !premiumMode ? '#ca8a04' : t.textMuted, fontFamily:"'Sora',sans-serif",
                }}>Single Trip</button>
                <button className="btn-pill" onClick={() => setPremiumMode(true)} style={{
                  flex:1, padding:'7px 12px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500',
                  background: premiumMode ? 'rgba(202,138,4,0.15)' : 'transparent',
                  color: premiumMode ? '#ca8a04' : t.textMuted, fontFamily:"'Sora',sans-serif",
                }}>✦ Multi-Location</button>
              </div>
            )}

            {/* ── HERO SECTION (shown before list is generated, single trip only) ── */}
            {!premiumMode && !listGenerated && !listLoading && heroVisible && (
              <div ref={heroRef} style={{ marginBottom:'28px' }}>

                {/* Main headline + floating orbs */}
                <div className="hero-fade-1" style={{ textAlign:'center', padding:'44px 16px 30px', position:'relative', overflow:'hidden' }}>
                  {/* Background orbs */}
                  <div className="hero-orb-1" style={{ position:'absolute', top:'-20px', left:'8%', width:'180px', height:'180px', borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)', pointerEvents:'none' }} />
                  <div className="hero-orb-2" style={{ position:'absolute', bottom:'-30px', right:'6%', width:'220px', height:'220px', borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />

                  <div className="hero-badge" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:t.accentDim, border:`1px solid ${dark ? 'rgba(37,99,235,0.3)' : 'rgba(37,99,235,0.2)'}`, borderRadius:'999px', padding:'5px 18px', marginBottom:'22px' }}>
                    <span className="hero-dot" style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#2563eb', display:'inline-block' }} />
                    <span style={{ fontSize:'12px', fontWeight:'600', color:t.accent, letterSpacing:'0.07em', textTransform:'uppercase' }}>Smart Packing, Every Trip</span>
                  </div>

                  <h1 style={{ fontSize:'clamp(26px, 5.5vw, 44px)', fontWeight:'600', color:t.text, lineHeight:'1.15', letterSpacing:'-0.025em', marginBottom:'16px' }}>
                    Never forget what matters.<br />
                    <span style={{ background:'linear-gradient(135deg, #2563eb 0%, #1d4ed8 45%, #3b82f6 100%)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'gradientShift 3.5s ease infinite' }}>Pack smarter, travel easier.</span>
                  </h1>
                  <p className="hero-fade-2" style={{ fontSize:'15px', color:t.textMuted, maxWidth:'500px', margin:'0 auto', lineHeight:'1.7' }}>
                    PackPerfect builds personalized packing lists based on your destination, trip type, and real-time weather — so you land prepared, not overpacked.
                  </p>
                </div>

                {/* Stats row */}
                {(() => {
                  const STAT_INFO = [
                    { value: statCounts.trips.toLocaleString(), suffix:'+', label:'Trips to Pack',  icon:'✈️', color:'#2563eb', cls:'suitcase-card-0',
                      explain:`${DESTINATIONS.length} destinations × 8 trip types × 28 possible durations — the total number of unique packing plans PackPerfect can generate for you.` },
                    { value: statCounts.destinations,           suffix:'+', label:'Destinations',   icon:'🌍', color:'#2563eb', cls:'suitcase-card-1',
                      explain:`PackPerfect covers ${DESTINATIONS.length} cities and regions worldwide, spanning every climate zone — from tropical beaches to arctic cities.` },
                    { value: statCounts.items,                  suffix:' avg', label:'Items per List', icon:'🎒', color:'#0891b2', cls:'suitcase-card-2',
                      explain:`The average item count across all trip types and lengths. A 3-day beach trip generates around 28 items; a 2-week adventure can reach 60+. We cap quantities so you're never overpacking.` },
                    { value: statCounts.time,                   suffix:'x',  label:'Faster to Pack', icon:'⚡', color:'#059669', cls:'suitcase-card-3',
                      explain:`From our user surveys, packing from scratch took most people around an hour of planning and second-guessing. With a PackPerfect list in hand, users reported being fully packed in under 10 minutes.` },
                  ]
                  const activeStat = activeStatIdx !== null ? STAT_INFO[activeStatIdx] : null

                  // Renders one suitcase card body (used in both grid ghost and drop zone)
                  const mkCard = (stat, _idx, lidOpen) => {
                    const bc = lidOpen ? stat.color : t.border
                    return <>
                      <div style={{ position:'absolute', top:'2px', left:'50%', transform:'translateX(-50%)', width:'36%', height:'18px', border:`2.5px solid ${bc}`, borderBottom:'none', borderRadius:'8px 8px 0 0', background:t.bg, zIndex:2 }} />
                      <div style={{ border:`2px solid ${bc}`, borderRadius:'12px', background:t.surface, overflow:'visible', boxShadow: lidOpen ? `0 0 0 3px ${stat.color}22, 0 12px 32px ${stat.color}30` : '0 2px 8px rgba(0,0,0,0.07)', position:'relative', perspective:'700px', perspectiveOrigin:'50% 30%' }}>
                        {[{top:'9px',left:'8px'},{top:'9px',right:'8px'},{bottom:'9px',left:'8px'},{bottom:'9px',right:'8px'}].map((pos, ri) => (
                          <div key={ri} style={{ position:'absolute', width:'7px', height:'7px', borderRadius:'50%', background:bc, zIndex:3, ...pos }} />
                        ))}
                        <div style={{ background: dark ? `linear-gradient(180deg,${stat.color}22 0%,${stat.color}0d 100%)` : `linear-gradient(180deg,${stat.color}16 0%,${stat.color}07 100%)`, borderRadius:'10px 10px 0 0', padding:'16px 10px 14px', textAlign:'center', transformOrigin:'0% 50%', transform: lidOpen ? 'perspective(500px) rotateY(165deg)' : 'perspective(500px) rotateY(0deg)', transition:'transform 0.64s cubic-bezier(0.4,0.15,0.15,1)', position:'relative', zIndex:2 }}>
                          <div style={{ fontSize:'28px', lineHeight:1 }}>{stat.icon}</div>
                          <div style={{ position:'absolute', bottom:0, left:'6%', right:'6%', height:'2px', background:`repeating-linear-gradient(90deg,${bc} 0,${bc} 5px,transparent 5px,transparent 10px)` }} />
                          <div style={{ position:'absolute', bottom:'-5px', left:'50%', transform:'translateX(-50%)', width:'18px', height:'9px', background:t.surface, border:`2px solid ${bc}`, borderRadius:'3px', zIndex:4 }} />
                        </div>
                        <div style={{ padding:'14px 8px 16px', textAlign:'center', position:'relative', zIndex:1 }}>
                          <div style={{ fontSize:'clamp(17px, 2.5vw, 23px)', fontWeight:'700', color:stat.color, letterSpacing:'-0.03em', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{stat.value}{stat.suffix}</div>
                          <div style={{ fontSize:'10px', color:t.textMuted, marginTop:'5px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em' }}>{stat.label}</div>
                          <div style={{ fontSize:'9px', color: lidOpen ? stat.color : t.textDim, marginTop:'7px' }}>{lidOpen ? '▲ close' : '▼ open'}</div>
                        </div>
                      </div>
                    </>
                  }

                  return (
                    <>
                      {/* ── Grid + drop zone wrapper (relative for person overlay) ── */}
                      <div style={{ position:'relative' }}>
                      {/* ── Main grid — active slot becomes invisible ghost ── */}
                      <div className="hero-stats" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'12px', marginBottom:'0' }}>
                        {STAT_INFO.map((stat, idx) => {
                          const isActive = activeStatIdx === idx || closingStatIdx === idx
                          const dimmed = activeStatIdx !== null && activeStatIdx !== idx && closingStatIdx !== idx
                          return (
                            <div key={stat.label} className={`suitcase-wrap ${stat.cls}`}
                              style={{ position:'relative', paddingTop:'20px', cursor: isActive ? 'default' : 'pointer', visibility: isActive ? 'hidden' : 'visible', transition:'opacity 300ms ease, transform 300ms ease', opacity: dimmed ? 0.42 : 1, transform: dimmed ? 'scale(0.96)' : 'scale(1)' }}
                              onClick={() => { if (!isActive) handleStatClick(idx) }}>
                              {mkCard(stat, idx, false)}
                            </div>
                          )
                        })}
                      </div>

                      {/* ── Drop zone — sliding cards below the grid ── */}
                      {(prevStatIdx !== null || activeStatIdx !== null || closingStatIdx !== null) && (
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'12px', marginTop:'10px' }}>
                          {STAT_INFO.map((stat, idx) => {
                            const isDropping = idx === activeStatIdx
                            const isRising  = idx === closingStatIdx || (idx === prevStatIdx && prevStatIdx !== activeStatIdx)
                            if (!isDropping && !isRising) return <div key={idx} />
                            return (
                              <div key={`dz-${idx}`} className={isDropping ? 'card-drop-in' : 'card-rise-out'}
                                style={{ position:'relative', paddingTop:'20px', cursor:'pointer' }}
                                onClick={() => handleStatClick(idx)}>
                                {mkCard(stat, idx, isDropping)}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      </div>{/* end relative wrapper */}

                      {/* ── T-shirt: 3-panel unfold, full width below drop zone ── */}
                      {activeStat && (() => {
                        const C = activeStat.color
                        const SHIRT = `M100,0 C85,0 52,12 28,42 C14,60 2,72 0,82 C4,96 28,118 60,132 L60,280 L240,280 L240,132 C272,118 296,96 300,82 C298,72 286,60 272,42 C248,12 215,0 200,0 C196,28 178,44 150,50 C122,44 104,28 100,0 Z`
                        const COLLAR = `M102,1 C105,26 126,42 150,50 C174,42 195,26 198,1 C194,24 176,38 150,44 C124,38 106,24 102,1 Z`
                        const gid = `sg${activeStatIdx}`
                        return (
                          <div key={activeStatIdx} style={{ position:'relative', marginTop:'6px', marginBottom:'24px' }}>
                            {/* Connector line from dropped card column to shirt */}
                            <div style={{ position:'absolute', top:0, left:`calc(${activeStatIdx} * (25% + 3px) + 12.5% - 6px)`, width:'2px', height:'8px', background:`linear-gradient(to bottom,${C}bb,transparent)` }} />
                            <div style={{ maxWidth:'540px', margin:'8px auto 0', position:'relative', height:'330px' }}>

                              {/* LEFT SLEEVE */}
                              <div className="shirt-left" style={{ position:'absolute', left:0, top:0, width:'38%', height:'100%', overflow:'hidden' }}>
                                <svg viewBox="0 0 114 280" style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="none">
                                  <defs>
                                    <linearGradient id={`${gid}L`} x1="100%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor={C} stopOpacity={dark?0.2:0.13}/>
                                      <stop offset="100%" stopColor={C} stopOpacity={dark?0.09:0.05}/>
                                    </linearGradient>
                                  </defs>
                                  <path d={SHIRT} transform="translate(1.5,2)" fill={C} fillOpacity="0.07"/>
                                  <path d={SHIRT} fill={`url(#${gid}L)`} stroke={C} strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round"/>
                                  <path d="M3,80 C10,98 30,118 60,130" fill="none" stroke={C} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round"/>
                                  <g className="shirt-crease">
                                    <line x1="28" y1="44" x2="58" y2="130" stroke={C} strokeOpacity="0.22" strokeWidth="0.8" strokeDasharray="3 3.5"/>
                                    <line x1="8" y1="90" x2="58" y2="172" stroke={C} strokeOpacity="0.14" strokeWidth="0.7" strokeDasharray="2 4"/>
                                  </g>
                                </svg>
                              </div>

                              {/* CENTER BODY */}
                              <div className="shirt-center" style={{ position:'absolute', left:'29%', top:0, width:'42%', height:'100%', overflow:'hidden' }}>
                                <svg viewBox="87 0 126 280" style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="none">
                                  <defs>
                                    <linearGradient id={`${gid}C`} x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor={C} stopOpacity={dark?0.28:0.18}/>
                                      <stop offset="55%" stopColor={C} stopOpacity={dark?0.15:0.09}/>
                                      <stop offset="100%" stopColor={C} stopOpacity={dark?0.08:0.05}/>
                                    </linearGradient>
                                  </defs>
                                  <path d={SHIRT} transform="translate(1.5,2)" fill={C} fillOpacity="0.07"/>
                                  <path d={SHIRT} fill={`url(#${gid}C)`} stroke={C} strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round"/>
                                  <path d={COLLAR} fill={dark?`${C}38`:`${C}26`} stroke={C} strokeOpacity="0.55" strokeWidth="1"/>
                                  <g className="shirt-crease">
                                    <line x1="150" y1="50" x2="150" y2="278" stroke={C} strokeOpacity="0.18" strokeWidth="0.8" strokeDasharray="3 3.5"/>
                                    <line x1="100" y1="138" x2="200" y2="138" stroke={C} strokeOpacity="0.16" strokeWidth="0.7" strokeDasharray="2.5 4"/>
                                    <line x1="100" y1="198" x2="200" y2="198" stroke={C} strokeOpacity="0.11" strokeWidth="0.7" strokeDasharray="2.5 4"/>
                                  </g>
                                </svg>
                              </div>

                              {/* RIGHT SLEEVE */}
                              <div className="shirt-right" style={{ position:'absolute', right:0, top:0, width:'38%', height:'100%', overflow:'hidden' }}>
                                <svg viewBox="186 0 114 280" style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="none">
                                  <defs>
                                    <linearGradient id={`${gid}R`} x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor={C} stopOpacity={dark?0.2:0.13}/>
                                      <stop offset="100%" stopColor={C} stopOpacity={dark?0.09:0.05}/>
                                    </linearGradient>
                                  </defs>
                                  <path d={SHIRT} transform="translate(1.5,2)" fill={C} fillOpacity="0.07"/>
                                  <path d={SHIRT} fill={`url(#${gid}R)`} stroke={C} strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round"/>
                                  <path d="M297,80 C290,98 270,118 240,130" fill="none" stroke={C} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round"/>
                                  <g className="shirt-crease">
                                    <line x1="272" y1="44" x2="242" y2="130" stroke={C} strokeOpacity="0.22" strokeWidth="0.8" strokeDasharray="3 3.5"/>
                                    <line x1="292" y1="90" x2="242" y2="172" stroke={C} strokeOpacity="0.14" strokeWidth="0.7" strokeDasharray="2 4"/>
                                  </g>
                                </svg>
                              </div>

                              {/* Text — centered in shirt body (body starts at ~47% of height) */}
                              <div className="shirt-text-in" style={{ position:'absolute', left:'22%', right:'22%', top:'70%', transform:'translateY(-50%)', textAlign:'center', zIndex:10, pointerEvents:'none' }}>
                                <div style={{ fontSize:'10px', fontWeight:'700', color:C, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'6px' }}>
                                  {activeStat.icon} {activeStat.label}
                                </div>
                                <div style={{ fontSize:'10px', color:t.textMuted, lineHeight:'1.6' }}>
                                  {activeStat.explain}
                                </div>
                              </div>

                            </div>
                          </div>
                        )
                      })()}
                    </>
                  )
                })()}

                {/* Feature pills — individually animated */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', justifyContent:'center', marginBottom:'30px' }}>
                  {[
                    { icon:'🌤️', text:'Live weather-aware lists' },
                    { icon:'🧠', text:'AI packing assistant' },
                    { icon:'⚖️', text:'Weight & bag tracking' },
                    { icon:'📍', text:`${DESTINATIONS.length} global destinations` },
                    { icon:'🌙', text:'Dark mode included' },
                  ].map((f, i) => (
                    <div key={f.text} className={`hero-pill-${i}`} style={{ display:'flex', alignItems:'center', gap:'6px', background:t.surface, border:`1px solid ${t.border}`, borderRadius:'999px', padding:'7px 16px', fontSize:'12px', color:t.textMuted, fontWeight:'500', transition:'border-color 200ms, color 200ms' }}>
                      <span>{f.icon}</span><span>{f.text}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="hero-fade-5" style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'22px' }}>
                  <div style={{ flex:1, height:'1px', background:`linear-gradient(to right, transparent, ${t.border})` }} />
                  <span style={{ fontSize:'11px', fontWeight:'600', color:t.textDim, textTransform:'uppercase', letterSpacing:'0.12em', whiteSpace:'nowrap' }}>Plan your trip</span>
                  <div style={{ flex:1, height:'1px', background:`linear-gradient(to left, transparent, ${t.border})` }} />
                </div>

              </div>
            )}

            {!premiumMode && <div style={{ position:'relative', overflow:'visible' }}>
            {/* Doorknob slides out of box right edge */}
            {homeAloneMode && haDoorknobPhase >= 1 && (
              <div style={{ position:'absolute', right: haDoorknobPhase >= 2 ? -70 : -44, top:'50%', transform:'translateY(-50%)', zIndex:1004, pointerEvents:'none', display:'flex', alignItems:'center', gap:'6px', animationName:'haDoorknobSlide', animationDuration:'0.65s', animationFillMode:'both', animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)' }}>
                <div style={{ fontSize:'clamp(28px,4vw,44px)', lineHeight:1 }}>🔑</div>
                {haDoorknobPhase >= 2 && (
                  <div style={{ fontSize:'clamp(26px,3.8vw,42px)', lineHeight:1, ...(haDoorknobPhase === 3 ? { animationName:'haHandGrab', animationDuration:'0.38s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' } : { animationName:'haHandSlide', animationDuration:'0.5s', animationFillMode:'both' }) }}>✋</div>
                )}
              </div>
            )}
            <div style={{ ...card, borderColor: haDoorknobPhase === 3 ? '#c41e3a' : listGenerated ? t.border : t.borderStrong, ...(haDoorknobPhase === 3 ? { background: dark ? 'rgba(196,30,58,0.13)' : 'rgba(196,30,58,0.07)', boxShadow:'0 0 0 2px #c41e3a, 0 0 32px 10px rgba(196,30,58,0.45), inset 0 0 18px rgba(196,30,58,0.12)', animationName:'haKnock', animationDuration:'0.18s', animationIterationCount:'infinite', animationTimingFunction:'ease-in-out' } : {}) }}>
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

                {startDate && endDate && new Date(endDate) < new Date(startDate) && (
                  <div style={{ fontSize:'13px', color:'#dc2626', padding:'7px 12px', background: dark ? 'rgba(220,38,38,0.08)' : 'rgba(220,38,38,0.06)', borderRadius:'7px', border:'1px solid rgba(220,38,38,0.3)', display:'flex', alignItems:'center', gap:'7px' }}>
                    <span>⚠️</span> Invalid dates — end date is before start date
                  </div>
                )}
                {startDate && endDate && new Date(endDate) >= new Date(startDate) && (
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

                {/* Itinerary */}
                <div>
                  <label style={labelStyle}>Itinerary <span style={{ fontWeight:'400', textTransform:'none', letterSpacing:0, color:t.textDim }}>(optional)</span></label>
                  {/* Toggle */}
                  <div style={{ display:'flex', gap:'6px', marginBottom:'10px' }}>
                    {['paste','type'].map(mode => (
                      <button key={mode} className="btn-pill" onClick={() => { setItineraryMode(mode); setItinerarySubmitted(false) }} style={{
                        ...t.pill(itineraryMode === mode), borderRadius:'999px', padding:'5px 14px',
                        fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif",
                      }}>{mode === 'paste' ? 'Paste Itinerary' : 'Type Events'}</button>
                    ))}
                  </div>

                  {itineraryMode === 'paste' ? (
                    <textarea
                      value={itineraryText}
                      onChange={e => { setItineraryText(e.target.value); setItinerarySubmitted(false) }}
                      placeholder="Paste your booking confirmation, Google doc, notes, or any travel text here…"
                      rows={5}
                      style={{ width:'100%', padding:'10px 13px', background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'8px', fontSize:'13px', color:t.text, outline:'none', resize:'vertical', lineHeight:'1.55', boxSizing:'border-box', fontFamily:"'Sora',sans-serif" }}
                    />
                  ) : (
                    <div>
                      <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
                        <input
                          value={itineraryEventInput}
                          onChange={e => setItineraryEventInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' && itineraryEventInput.trim()) { setItineraryEvents(ev => [...ev, itineraryEventInput.trim()]); setItineraryEventInput(''); setItinerarySubmitted(false) }}}
                          placeholder="Add an event or activity…"
                          style={{ flex:1, padding:'9px 12px', background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'8px', fontSize:'13px', color:t.text, outline:'none', fontFamily:"'Sora',sans-serif" }}
                        />
                        <button onClick={() => { if (itineraryEventInput.trim()) { setItineraryEvents(ev => [...ev, itineraryEventInput.trim()]); setItineraryEventInput(''); setItinerarySubmitted(false) }}} style={{ padding:'9px 14px', background:t.accent, color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif", whiteSpace:'nowrap' }}>+ Add</button>
                      </div>
                      {itineraryEvents.length > 0 && (
                        <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                          {itineraryEvents.map((ev, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 11px', background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'7px', fontSize:'13px', color:t.text }}>
                              <span>{ev}</span>
                              <button onClick={() => { setItineraryEvents(evs => evs.filter((_,j) => j !== i)); setItinerarySubmitted(false) }} style={{ background:'none', border:'none', color:t.textDim, cursor:'pointer', fontSize:'15px', lineHeight:1, padding:'0 2px' }}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit button */}
                  {(itineraryMode === 'paste' ? itineraryText.trim() : itineraryEvents.length > 0) && !itinerarySubmitted && (
                    <button onClick={() => {
                      const raw = itineraryMode === 'paste' ? itineraryText : itineraryEvents.join(' ')
                      setItineraryKeywords(extractItineraryKeywords(raw))
                      setItinerarySubmitted(true)
                    }} style={{ marginTop:'9px', padding:'8px 18px', background:t.accent, color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
                      Confirm Itinerary
                    </button>
                  )}

                  {/* Confirmed state — show detected tags */}
                  {itinerarySubmitted && (() => {
                    const active = Object.entries(itineraryKeywords).filter(([,v]) => v).map(([k]) => k)
                    const labels = { water:'Water Activities', formal:'Formal Events', outdoor:'Outdoor / Hiking', business:'Business', nightlife:'Nightlife', ski:'Skiing', rain:'Rain Gear', cold:'Cold Weather', hot:'Hot Weather' }
                    return (
                      <div style={{ marginTop:'9px', padding:'9px 12px', background: dark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'8px' }}>
                        <div style={{ fontSize:'12px', color:'#10b981', fontWeight:'600', marginBottom: active.length ? '6px' : 0 }}>
                          Itinerary confirmed {active.length ? `— ${active.length} packing categor${active.length > 1 ? 'ies' : 'y'} detected` : '— no specific packing cues found'}
                        </div>
                        {active.length > 0 && (
                          <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                            {active.map(k => (
                              <span key={k} style={{ fontSize:'11px', padding:'3px 9px', background: dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)', color:'#10b981', borderRadius:'999px', border:'1px solid rgba(16,185,129,0.3)', fontWeight:'500' }}>{labels[k]}</span>
                            ))}
                          </div>
                        )}
                        <button onClick={() => setItinerarySubmitted(false)} style={{ marginTop:'7px', background:'none', border:'none', color:t.textDim, fontSize:'11px', cursor:'pointer', padding:0, fontFamily:"'Sora',sans-serif" }}>Edit itinerary</button>
                      </div>
                    )
                  })()}
                </div>

                {/* Hotel / Accommodation Type */}
                <div>
                  <label style={labelStyle}>Where are you staying?</label>
                  <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                    {[
                      { value:'',              label:'Not specified' },
                      { value:'standard',      label:'🏨 Hotel' },
                      { value:'resort',        label:'🏊 Resort (pool)' },
                      { value:'all-inclusive', label:'🌴 All-Inclusive' },
                      { value:'airbnb',        label:'🏠 Airbnb / Rental' },
                      { value:'hostel',        label:'🛏️ Hostel' },
                      { value:'boutique',      label:'✨ Boutique Hotel' },
                    ].map(opt => (
                      <button key={opt.value} className="btn-pill" onClick={() => {
                        setHotelType(opt.value)
                        try { localStorage.setItem('pp_hotel', opt.value) } catch(_) {}
                      }} style={{
                        ...t.pill(hotelType === opt.value),
                        borderRadius:'999px', padding:'5px 14px', fontSize:'13px',
                        fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif",
                      }}>{opt.label}</button>
                    ))}
                  </div>
                  {(hotelType === 'resort' || hotelType === 'all-inclusive') && (
                    <div style={{ marginTop:'8px', padding:'8px 12px', background: dark ? 'rgba(5,150,105,0.1)' : 'rgba(5,150,105,0.06)', border:'1px solid rgba(5,150,105,0.25)', borderRadius:'8px', fontSize:'12px', color:'#059669' }}>
                      🏊 Pool gear added — swimwear, sunscreen, pool slides & waterproof phone pouch.{hotelType === 'all-inclusive' ? ' Plus casual evening outfits.' : ''}
                    </div>
                  )}
                  {hotelType === 'hostel' && (
                    <div style={{ marginTop:'8px', padding:'8px 12px', background: dark ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.06)', border:`1px solid rgba(37,99,235,0.25)`, borderRadius:'8px', fontSize:'12px', color:t.accent }}>
                      🛏️ Hostel extras added — travel padlock, sleep liner & shower flip flops.
                    </div>
                  )}
                </div>

                <button className="btn-primary" onClick={handleGenerate} disabled={listLoading || (startDate && endDate && new Date(endDate) < new Date(startDate))} style={{ ...btnPrimary, marginTop:'4px', opacity: (listLoading || (startDate && endDate && new Date(endDate) < new Date(startDate))) ? 0.5 : 1, cursor: (startDate && endDate && new Date(endDate) < new Date(startDate)) ? 'not-allowed' : 'pointer' }}>
                  {listLoading ? 'Perfecting...' : listGenerated ? 'Regenerate List' : 'Generate Packing List'}
                </button>
              </div>
            </div></div>}

            {!premiumMode && listLoading && (
              <div style={{ ...card, textAlign:'center', padding:'36px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'14px', marginBottom:'14px' }}>
                  <div className="spinner" />
                  <div className="dot-pulse"><span /><span /><span /></div>
                  <div className="spinner" />
                </div>
                <div style={{ fontSize:'14px', color:t.textMuted, fontWeight:'500' }}>Perfecting your packing list…</div>
                <div style={{ fontSize:'12px', color:t.textDim, marginTop:'5px' }}>Perfecting items for your destination and trip type</div>
              </div>
            )}

            {!premiumMode && listGenerated && (
              <div>
                {/* Laundry note for long trips */}
                {laundryNote && (
                  <div style={{ ...card, borderColor:'#f59e0b', background: dark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.06)', padding:'14px 18px' }}>
                    <p style={{ fontSize:'13px', color:'#f59e0b', fontWeight:'500' }}>
                      Long trip detected — list capped at ~1 week of clothing. Plan on using a washing machine or laundromat. Hotels and Airbnbs almost always have laundry, and it beats hauling a month of clothes.
                    </p>
                  </div>
                )}
                {weatherAdjustedList && (
                  <div style={{ ...card, borderColor:'#10b981', background: dark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)', padding:'12px 18px' }}>
                    <p style={{ fontSize:'13px', color:'#10b981', fontWeight:'500' }}>
                      🌡 List updated based on live weather — actual conditions differ from the typical climate for this destination.
                    </p>
                  </div>
                )}

                {/* Weather */}
                {weatherLoading && (
                  <div style={{ ...card, textAlign:'center', color:t.textMuted, fontSize:'13px', padding:'16px' }}>
                    Perfecting forecast for {destination}…
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
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:'14px' }}>
                    <div style={{ fontSize:'13px', fontWeight:'600', color:t.text }}>Weight Tracker</div>
                    {selectedSuitcase && (
                      <div style={{ fontSize:'11px', color:t.textMuted }}>
                        limit adjusted for <span style={{ color:t.accent, fontWeight:'500' }}>{selectedSuitcase.name}</span>
                      </div>
                    )}
                  </div>
                  {selectedSuitcase && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'12px', textAlign:'center' }}>
                      {[
                        { label:'Airline Limit', val:'50.0', sub:'lbs total', color:t.textMuted },
                        { label:'Bag Weight', val:`− ${selectedSuitcase.weightLbs.toFixed(1)}`, sub:`${selectedSuitcase.brand} ${selectedSuitcase.name.split(' ').slice(-1)[0]}`, color:'#f59e0b' },
                        { label:'Your Allowance', val:weightLimit.toFixed(1), sub:'lbs for contents', color:t.accent },
                      ].map(r => (
                        <div key={r.label} style={{ background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'8px', padding:'10px 6px' }}>
                          <div style={{ fontSize:'10px', color:t.textDim, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'4px' }}>{r.label}</div>
                          <div style={{ fontSize:'18px', fontWeight:'700', color:r.color, fontFamily:"'JetBrains Mono',monospace" }}>{r.val}</div>
                          <div style={{ fontSize:'10px', color:t.textDim, marginTop:'2px' }}>{r.sub}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="pp-grid-2" style={{ display:'grid', gridTemplateColumns: bootBagWeight > 0 ? '1fr 1fr 1fr' : '1fr 1fr', gap:'10px', marginBottom:'12px' }}>
                    {[{ label:'Packed in Main', val:packedMainWeight, total:mainWeight, limit:true }, { label:'Carry-On', val:carryWeight, limit:false }, ...(bootBagWeight > 0 ? [{ label:'Boot Bag', val:bootBagWeight, limit:false }] : [])].map(b => (
                      <div key={b.label} style={{ background:t.inputBg, borderRadius:'8px', padding:'12px', textAlign:'center', border:`1px solid ${b.limit && b.val > weightLimit ? '#dc2626' : t.border}` }}>
                        <div style={{ fontSize:'22px', fontWeight:'600', color: b.limit && b.val > weightLimit ? '#dc2626' : t.accent, fontFamily:"'JetBrains Mono',monospace" }}>{b.val.toFixed(1)}</div>
                        <div style={{ fontSize:'11px', color:t.textMuted, marginTop:'2px' }}>{b.label} lbs{b.limit ? ` / ${weightLimit.toFixed(1)} max` : ''}</div>
                        {b.limit && b.total != null && <div style={{ fontSize:'10px', color:t.textDim, marginTop:'2px' }}>({b.total.toFixed(1)} lbs total list)</div>}
                      </div>
                    ))}
                  </div>
                  {packedOverLimit && (
                    <div style={{ fontSize:'12px', color:'#dc2626', padding:'8px 12px', background:'rgba(220,38,38,0.08)', borderRadius:'7px', marginBottom:'10px' }}>
                      {selectedSuitcase
                        ? `Packed items exceed ${weightLimit.toFixed(1)} lbs — your ${selectedSuitcase.name} (${selectedSuitcase.weightLbs} lbs) plus packed items would exceed the 50 lb airline limit. Move items to carry-on or uncheck some.`
                        : 'Packed items exceed 50 lbs — most airlines will charge overweight fees. Move some items to carry-on or uncheck them.'}
                    </div>
                  )}
                  {!packedOverLimit && mainOverLimit && (
                    <div style={{ fontSize:'12px', color:'#f59e0b', padding:'8px 12px', background:'rgba(245,158,11,0.08)', borderRadius:'7px', marginBottom:'10px' }}>
                      ⚠️ Your full list totals {mainWeight.toFixed(1)} lbs — exceeds your {weightLimit.toFixed(1)} lb allowance. Pack selectively or move items to carry-on.
                    </div>
                  )}
                  {bootBagWeight > 0 && (mainWeight + bootBagWeight) > weightLimit && (
                    <div style={{ fontSize:'12px', color:'#f59e0b', padding:'8px 12px', background:'rgba(245,158,11,0.08)', borderRadius:'7px', marginBottom:'10px' }}>
                      ⚠️ Your boot bag ({bootBagWeight.toFixed(1)} lbs) + main suitcase ({mainWeight.toFixed(1)} lbs) together exceed the 50 lb checked bag limit. Airlines typically count the boot bag as a separate checked bag — confirm with your airline, as it may incur overweight or extra bag fees.
                    </div>
                  )}
                  <div style={{ background:t.inputBg, borderRadius:'999px', height:'6px', overflow:'hidden' }}>
                    <div style={{ background: packedOverLimit ? '#dc2626' : t.accent, height:'100%', width:`${Math.min((packedMainWeight/weightLimit)*100,100).toFixed(1)}%`, borderRadius:'999px', transition:'width 0.4s' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:'7px', fontSize:'12px', color:t.textMuted }}>
                    <span>{packedCount}/{allItems.length} packed</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", color: packedOverLimit ? '#dc2626' : t.textMuted }}>
                      Packed: {packedMainWeight.toFixed(1)} / {weightLimit.toFixed(1)} lbs{packedOverLimit ? ' — OVER LIMIT' : ''}
                    </span>
                  </div>
                </div>

                {/* Item lists */}
                {Object.entries(items).map(([cat, catItems]) => catItems.length === 0 ? null : (
                  <div key={cat} style={card}>
                    <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'12px' }}>
                      {cat} <span style={{ color:t.textDim }}>({catItems.length})</span>
                    </div>
                    {catItems.map((item, i) => {
                      const isJersey = item.name === 'Jersey / Team Uniform'
                      return (
                        <div key={i}>
                          {isJersey && (
                            <div style={{ background:'rgba(220,38,38,0.08)', border:'2px solid #dc2626', borderRadius:'8px', padding:'8px 12px', marginBottom:'6px', display:'flex', alignItems:'center', gap:'8px' }}>
                              <span style={{ fontSize:'18px' }}>⚠️</span>
                              <span style={{ fontSize:'13px', fontWeight:'700', color:'#dc2626' }}>DO NOT FORGET YOUR JERSEY!</span>
                            </div>
                          )}
                          <div className="item-row" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 6px', borderRadius:'6px', borderBottom: i < catItems.length-1 ? `1px solid ${t.border}` : 'none' }}>
                            <input type="checkbox" checked={item.packed} onChange={() => togglePacked(cat, i)} style={{ width:'15px', height:'15px', flexShrink:0, cursor:'pointer' }} />
                            <span style={{ flex:1, fontSize: isJersey ? '16px' : '14px', fontWeight: isJersey ? '700' : '400', color: item.packed ? t.textDim : (isJersey ? '#dc2626' : t.text), textDecoration: item.packed ? 'line-through' : 'none' }}>
                              {item.name} <span style={{ color: isJersey ? 'rgba(220,38,38,0.7)' : t.textDim, fontSize:'12px', fontFamily:"'JetBrains Mono',monospace" }}>×{item.qty}</span>
                            </span>
                            <span style={{ fontSize:'11px', color:t.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{item.weight} lb</span>
                            <button onClick={() => toggleBag(cat, i)} style={{
                              fontSize:'11px', background:t.accentDim, color:t.accent, border:`1px solid ${t.borderStrong}`,
                              padding:'2px 10px', borderRadius:'999px', cursor:'pointer', fontWeight:'500', whiteSpace:'nowrap',
                            }}>
                              {item.bag === 'carry' ? 'Carry-On' : item.bag === 'boot bag' ? 'Boot Bag' : 'Main'}
                            </button>
                            {premiumUnlocked && (
                              <button onClick={() => removeItem(cat, i)} title="Remove item" style={{ background:'transparent', border:'none', color:t.textDim, cursor:'pointer', fontSize:'16px', padding:'0 2px', lineHeight:1, flexShrink:0 }}>×</button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}

                {/* Add item */}
                <div style={card}>
                  <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'12px' }}>Add Item</div>
                  <div style={{ display:'grid', gap:'8px' }}>
                    <input value={customItem} onChange={e => setCustomItem(e.target.value)} placeholder="Item name..."
                      onKeyDown={e => e.key === 'Enter' && addCustomItem()} style={inputStyle} />
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                      <div>
                        <label style={labelStyle}>Weight (lbs)</label>
                        <input type="number" value={customItemWeight} onChange={e => setCustomItemWeight(e.target.value)}
                          step="0.1" min="0" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Bag</label>
                        <select value={customItemBag} onChange={e => setCustomItemBag(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
                          <option value="main">Main Bag</option>
                          <option value="carry">Carry-On</option>
                          {bootBagItems.length > 0 && <option value="boot bag">Boot Bag</option>}
                        </select>
                      </div>
                    </div>
                    <button className="btn-primary" onClick={addCustomItem} style={{ ...btnPrimary }}>Add Item</button>
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
            {/* Segmented toggle */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'16px' }}>
              <div style={{ display:'inline-flex', background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'999px', padding:'3px', gap:'2px' }}>
                {[['guide','Visual Guide'],['layers','Layer Visualizer']].map(([key, label]) => (
                  <button key={key} onClick={() => setVisualAidSubTab(key)}
                    style={{ padding:'6px 18px', borderRadius:'999px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600', transition:'background 150ms, color 150ms',
                      background: visualAidSubTab === key ? t.accent : 'transparent',
                      color: visualAidSubTab === key ? '#fff' : t.textMuted }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Guide panel */}
            {visualAidSubTab === 'guide' && (
              <div style={card}>
                <h2 style={{ fontSize:'18px', fontWeight:'600', marginBottom:'12px', color:t.text }}>Visual Packing Aid</h2>
                {!listGenerated && !listLoading && <p style={{ fontSize:'12px', color:t.textDim, marginBottom:'14px' }}>Generate a list first to see the right image for your trip type.</p>}
                {(listLoading || (listGenerated && !visualAidReady)) ? (
                  <div style={{ width:'100%', borderRadius:'12px', background: dark ? '#0d1625' : '#eef2f8', border:`1px solid ${t.border}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', padding:'48px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'12px' }}>
                      <div className="spinner" style={{ width:'22px', height:'22px', borderWidth:'3px' }} />
                      <div className="dot-pulse"><span /><span /><span /></div>
                      <div className="spinner" style={{ width:'22px', height:'22px', borderWidth:'3px' }} />
                    </div>
                    <div style={{ fontSize:'14px', fontWeight:'500', color:t.textMuted }}>Perfecting your visual aid…</div>
                    <div style={{ fontSize:'12px', color:t.textDim }}>Rendering the perfect scene for your trip</div>
                  </div>
                ) : (listGenerated || premiumGenerated) ? (
                  <img src={premiumMode ? premiumVisImage : visImage} alt="Packing visual guide" style={{ width:'100%', borderRadius:'12px', display:'block' }} />
                ) : null}
              </div>
            )}

            {/* Layer Visualizer panel */}
            {visualAidSubTab === 'layers' && (
              <div style={card}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
                  <span style={{ fontSize:'22px' }}>🧳</span>
                  <h2 style={{ fontSize:'18px', fontWeight:'600', color:t.text }}>Suitcase Layer Visualizer</h2>
                </div>
                <p style={{ fontSize:'13px', color:t.textMuted, lineHeight:'1.6', marginBottom:'16px' }}>
                  Upload a photo of your empty suitcase. AI analyzes it and generates 3 visual layer images — bottom, middle, and top — showing exactly what goes where.
                </p>

                {!listGenerated && (
                  <p style={{ fontSize:'12px', color:t.textDim, marginBottom:'14px' }}>Generate a packing list first so the AI knows what to pack.</p>
                )}

                {/* Photo upload */}
                <div style={{ marginBottom:'16px' }}>
                  <label style={labelStyle}>Suitcase Photo</label>
                  <div style={{ display:'flex', gap:'12px', alignItems:'flex-start', flexWrap:'wrap' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:'8px', background:t.inputBg, border:`1.5px dashed ${suitcaseFile ? t.accent : t.border}`, borderRadius:'8px', padding:'10px 16px', cursor:'pointer', fontSize:'13px', color: suitcaseFile ? t.accent : t.textMuted, fontWeight:'500', transition:'border-color 150ms ease, color 150ms ease' }}>
                      <span style={{ fontSize:'18px' }}>📷</span>
                      {suitcaseFile ? suitcaseFile.name : 'Choose photo…'}
                      <input type="file" accept="image/*" style={{ display:'none' }}
                        onChange={e => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          setSuitcaseFile(f)
                          setSuitcasePreviewUrl(URL.createObjectURL(f))
                          setLayerResult(null)
                          setLayerError('')
                        }}
                      />
                    </label>
                    {suitcasePreviewUrl && (
                      <img src={suitcasePreviewUrl} alt="Suitcase preview" style={{ width:'80px', height:'80px', objectFit:'cover', borderRadius:'8px', border:`1px solid ${t.border}` }} />
                    )}
                  </div>
                </div>

                {/* Generate button — premium gate triggers only on click */}
                {premiumUnlocked && layerCount >= 2 ? (
                  <div style={{ background: dark ? 'rgba(239,68,68,0.08)' : 'rgba(254,226,226,0.6)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'20px', textAlign:'center', marginBottom:'16px' }}>
                    <div style={{ fontSize:'24px', marginBottom:'8px' }}>🔒</div>
                    <div style={{ fontSize:'15px', fontWeight:'600', color: dark ? '#fca5a5' : '#b91c1c', marginBottom:'4px' }}>Generation Limit Reached</div>
                    <div style={{ fontSize:'13px', color:t.textMuted }}>You've used both layer visualizer generations (2/2).</div>
                  </div>
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap', marginBottom: (layerLoading || layerError || layerResult) ? '16px' : '0' }}>
                    {premiumUnlocked && (
                      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                        {[0,1].map(i => (
                          <div key={i} style={{ width:'10px', height:'10px', borderRadius:'50%', background: i < layerCount ? t.accent : t.border, border:`1px solid ${i < layerCount ? t.accent : t.borderStrong}` }} />
                        ))}
                        <span style={{ fontSize:'12px', color:t.textMuted }}>{layerCount}/2</span>
                      </div>
                    )}
                    <button className="btn-primary"
                      onClick={() => premiumUnlocked ? generateLayers() : setShowPremiumModal(true)}
                      disabled={premiumUnlocked && (!suitcaseFile || !listGenerated || layerLoading)}
                      style={{ ...btnPrimary, opacity: premiumUnlocked && (!suitcaseFile || !listGenerated || layerLoading) ? 0.55 : 1 }}>
                      {layerLoading ? 'Generating layers…' : 'Generate Packing Layers'}
                    </button>
                  </div>
                )}

                {/* Loading — shown only before breakdown arrives */}
                {layerLoading && !layerResult && (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'14px', padding:'28px 20px', background:t.inputBg, borderRadius:'10px', border:`1px solid ${t.border}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div className="spinner" style={{ width:'22px', height:'22px', borderWidth:'3px' }} />
                      <div className="dot-pulse"><span /><span /><span /></div>
                      <div className="spinner" style={{ width:'22px', height:'22px', borderWidth:'3px' }} />
                    </div>
                    <div style={{ fontSize:'14px', fontWeight:'500', color:t.textMuted }}>Analyzing your suitcase…</div>
                    <div style={{ fontSize:'12px', color:t.textDim }}>Planning your packing layers</div>
                  </div>
                )}

                {/* Error */}
                {layerError && !layerLoading && (
                  <div style={{ background: dark ? 'rgba(239,68,68,0.08)' : 'rgba(254,226,226,0.8)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', padding:'12px 16px', fontSize:'13px', color: dark ? '#fca5a5' : '#b91c1c' }}>
                    ⚠️ {layerError}
                  </div>
                )}

                {/* Carousel results — visible as soon as breakdown arrives, even while images still loading */}
                {layerResult && (() => {
                  const layers = layerResult.layers || []
                  const cur = layers[layerCarouselIdx]
                  const icons = ['📦','🧺','🔒']
                  return (
                    <div>
                      {layerResult.suitcaseNote && (
                        <p style={{ fontSize:'12px', color:t.textMuted, marginBottom:'12px', fontStyle:'italic' }}>{layerResult.suitcaseNote}</p>
                      )}
                      <div style={{ border:`1px solid ${t.border}`, borderRadius:'12px', overflow:'hidden' }}>
                        <div style={{ padding:'12px 16px', background: dark ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.05)', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                            <span style={{ fontSize:'20px' }}>{icons[layerCarouselIdx]}</span>
                            <div>
                              <div style={{ fontSize:'14px', fontWeight:'600', color:t.accent }}>{cur?.label}</div>
                              {cur?.packingTip && <div style={{ fontSize:'12px', color:t.textMuted, marginTop:'2px' }}>{cur.packingTip}</div>}
                            </div>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <button onClick={() => setLayerCarouselIdx(i => Math.max(0, i - 1))} disabled={layerCarouselIdx === 0}
                              style={{ background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'6px', padding:'5px 11px', cursor: layerCarouselIdx === 0 ? 'default' : 'pointer', color:t.text, opacity: layerCarouselIdx === 0 ? 0.35 : 1, fontSize:'16px', lineHeight:1 }}>‹</button>
                            <span style={{ fontSize:'12px', color:t.textMuted, minWidth:'36px', textAlign:'center' }}>{layerCarouselIdx + 1} / {layers.length}</span>
                            <button onClick={() => setLayerCarouselIdx(i => Math.min(layers.length - 1, i + 1))} disabled={layerCarouselIdx === layers.length - 1}
                              style={{ background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'6px', padding:'5px 11px', cursor: layerCarouselIdx === layers.length - 1 ? 'default' : 'pointer', color:t.text, opacity: layerCarouselIdx === layers.length - 1 ? 0.35 : 1, fontSize:'16px', lineHeight:1 }}>›</button>
                          </div>
                        </div>
                        {cur?.imageUrl
                          ? <img src={cur.imageUrl} alt={cur.label} style={{ width:'100%', display:'block', maxHeight:'400px', objectFit:'cover' }} />
                          : layerLoading
                            ? <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px', minHeight:'260px', background: dark ? '#0d1625' : '#f0f2f6' }}>
                                <div className="spinner" style={{ width:'22px', height:'22px', borderWidth:'3px' }} />
                                <div style={{ fontSize:'13px', fontWeight:'500', color:t.textMuted }}>Generating this layer…</div>
                                <div style={{ fontSize:'11px', color:t.textDim }}>Each layer is built on the previous one</div>
                              </div>
                            : <div style={{ padding:'40px', textAlign:'center', color:t.textDim, fontSize:'13px' }}>Image unavailable</div>
                        }
                        {cur?.items?.length > 0 && (
                          <div style={{ padding:'12px 16px', background:t.inputBg }}>
                            <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>Items in this layer</div>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                              {cur.items.map((item, j) => (
                                <span key={j} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:'999px', padding:'3px 10px', fontSize:'12px', color:t.text }}>{item}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ display:'flex', justifyContent:'center', gap:'6px', marginTop:'10px' }}>
                        {layers.map((_, i) => (
                          <button key={i} onClick={() => setLayerCarouselIdx(i)}
                            style={{ width:'8px', height:'8px', borderRadius:'50%', border:'none', background: i === layerCarouselIdx ? t.accent : t.border, cursor:'pointer', padding:0, transition:'background 150ms' }} />
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
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
          premiumUnlocked ? (
            /* Premium users: only the AI chat, no keyword chat */
            <div style={{ ...card, padding:0, overflow:'hidden' }}>
              <div style={{ padding:'18px 22px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'2px' }}>
                    <h2 style={{ fontSize:'18px', fontWeight:'600', color:t.text }}>AI Packing Assistant</h2>
                    <span style={{ fontSize:'11px', fontWeight:'700', color:'#ca8a04', background:'rgba(202,138,4,0.12)', border:'1px solid rgba(202,138,4,0.3)', borderRadius:'999px', padding:'2px 9px' }}>✦ Premium</span>
                  </div>
                  <p style={{ fontSize:'13px', color:t.textMuted }}>
                    {destination ? `${destination} — aware of your full packing list` : 'Real AI, aware of your packing list'}
                  </p>
                </div>
                <div style={{ fontSize:'12px', color:t.textMuted, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'999px', padding:'4px 12px' }}>
                  {premiumChatCount}/10 chats
                </div>
              </div>

              {premiumChatCount >= 10 ? (
                useFallbackChat ? (
                  <>
                    <div style={{ padding:'10px 16px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:'12px', color:t.textMuted }}>Basic assistant — keyword responses</span>
                      <button onClick={() => setUseFallbackChat(false)} style={{ background:'none', border:'none', fontSize:'12px', color:t.textDim, cursor:'pointer', padding:0, fontFamily:"'Sora',sans-serif" }}>← Back</button>
                    </div>
                    <div style={{ padding:'12px 16px', borderBottom:`1px solid ${t.border}`, display:'flex', gap:'7px', flexWrap:'wrap' }}>
                      {['Packing for rain?','Avoid baggage fees?','TSA liquid rules?','Long trip laundry?','Packing cubes worth it?'].map(q => (
                        <button key={q} onClick={() => sendChat(q)} disabled={chatTyping}
                          style={{ background:t.accentDim, border:`1px solid ${t.border}`, borderRadius:'999px', padding:'5px 13px', fontSize:'12px', cursor: chatTyping ? 'default' : 'pointer', color:t.accent, opacity: chatTyping ? 0.5 : 1 }}>
                          {q}
                        </button>
                      ))}
                    </div>
                    <div className="pp-chat-messages" style={{ padding:'16px', minHeight:'300px', maxHeight:'380px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'10px' }}>
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
                  </>
                ) : (
                  <div style={{ padding:'32px 24px', textAlign:'center' }}>
                    <div style={{ fontSize:'32px', marginBottom:'10px' }}>🔒</div>
                    <div style={{ fontSize:'16px', fontWeight:'600', color: dark ? '#fca5a5' : '#b91c1c', marginBottom:'8px' }}>Chat Limit Reached</div>
                    <div style={{ fontSize:'13px', color:t.textMuted, lineHeight:'1.6' }}>You've used all 10 of your premium AI chats.</div>
                    <button onClick={() => setUseFallbackChat(true)} style={{ marginTop:'16px', padding:'9px 22px', background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'8px', fontSize:'13px', color:t.textMuted, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
                      Switch to basic assistant
                    </button>
                  </div>
                )
              ) : (
                <>
                  <div style={{ padding:'12px 16px', borderBottom:`1px solid ${t.border}`, display:'flex', gap:'7px', flexWrap:'wrap' }}>
                    {['Will I fit everything?','What should I leave out?','Best packing order?','Weather-appropriate picks?'].map(q => (
                      <button key={q} onClick={() => sendPremiumChat(q)} disabled={premiumChatTyping || premiumChatLoading}
                        style={{ background:'rgba(202,138,4,0.1)', border:'1px solid rgba(202,138,4,0.25)', borderRadius:'999px', padding:'5px 13px', fontSize:'12px', cursor: (premiumChatTyping || premiumChatLoading) ? 'default' : 'pointer', color:'#ca8a04', opacity: (premiumChatTyping || premiumChatLoading) ? 0.5 : 1 }}>
                        {q}
                      </button>
                    ))}
                  </div>
                  <div className="pp-chat-messages" style={{ padding:'16px', minHeight:'340px', maxHeight:'420px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'10px' }}>
                    {premiumChatMessages.map((msg, i) => {
                      const isLast = i === premiumChatMessages.length - 1
                      const isTypingMsg = premiumChatTyping && isLast && msg.role === 'assistant'
                      return (
                        <div key={i} style={{ display:'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <div className={isTypingMsg ? 'cursor-blink' : ''} style={{
                            maxWidth:'78%', padding:'10px 14px',
                            borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                            background: msg.role === 'user' ? '#ca8a04' : t.inputBg,
                            border: msg.role === 'assistant' ? `1px solid rgba(202,138,4,0.2)` : 'none',
                            color: msg.role === 'user' ? '#fff' : t.text,
                            fontSize:'14px', lineHeight:'1.6',
                          }}>
                            {msg.content}
                          </div>
                        </div>
                      )
                    })}
                    {premiumChatLoading && (
                      <div style={{ display:'flex', justifyContent:'flex-start' }}>
                        <div style={{ padding:'12px 18px', borderRadius:'12px 12px 12px 3px', background:t.inputBg, border:`1px solid rgba(202,138,4,0.2)`, display:'flex', alignItems:'center', gap:'6px' }}>
                          <div className="dot-pulse"><span style={{ background:'#ca8a04' }} /><span style={{ background:'#ca8a04' }} /><span style={{ background:'#ca8a04' }} /></div>
                        </div>
                      </div>
                    )}
                    <div ref={premiumChatEndRef} />
                  </div>
                  <div style={{ padding:'14px 16px', borderTop:`1px solid rgba(202,138,4,0.2)`, display:'flex', gap:'8px' }}>
                    <input value={premiumChatInput} onChange={e => setPremiumChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendPremiumChat()}
                      placeholder="Ask your AI packing assistant..." disabled={premiumChatTyping || premiumChatLoading}
                      style={{ flex:1, padding:'10px 16px', background:t.inputBg, border:`1px solid rgba(202,138,4,0.25)`, borderRadius:'999px', fontSize:'14px', color:t.text, outline:'none', opacity: (premiumChatTyping || premiumChatLoading) ? 0.6 : 1 }} />
                    <button className="btn-primary" onClick={() => sendPremiumChat()} disabled={premiumChatTyping || premiumChatLoading}
                      style={{ ...btnPrimary, width:'auto', padding:'10px 22px', borderRadius:'999px', background:'linear-gradient(135deg,#ca8a04,#d97706)', opacity: (premiumChatTyping || premiumChatLoading) ? 0.6 : 1 }}>Send</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Non-premium: keyword chat with "Use AI" upgrade button */
            <div style={{ ...card, padding:0, overflow:'hidden' }}>
              <div style={{ padding:'18px 22px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px', flexWrap:'wrap' }}>
                <div>
                  <h2 style={{ fontSize:'18px', fontWeight:'600', color:t.text, marginBottom:'3px' }}>Packing Assistant</h2>
                  <p style={{ fontSize:'13px', color:t.textMuted }}>
                    {destination ? `${destination} — ${tripType}` : 'Ask me anything about packing'}
                  </p>
                </div>
                <button onClick={() => setShowPremiumModal(true)}
                  style={{ display:'flex', alignItems:'center', gap:'6px', background:'linear-gradient(135deg,#ca8a04,#d97706)', color:'#fff', border:'none', borderRadius:'999px', padding:'8px 16px', fontSize:'13px', fontWeight:'600', cursor:'pointer', flexShrink:0, fontFamily:"'Sora',sans-serif" }}>
                  ✦ Use AI
                </button>
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
          )
        )}

        {/* ── PREMIUM ── */}
        {premiumMode && activeTab === 'Packing List' && (
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
                    <div style={{ marginTop:'12px' }}>
                      <label style={labelStyle}>Trip Type</label>
                      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                        {['Leisure','Business','Beach','Adventure','Family','Backpacking','Skiing','Sports Tournament'].map(ty => (
                          <button key={ty} className="btn-pill" onClick={() => updatePremiumLeg(idx, { tripType: ty })} style={{
                            ...t.pill(leg.tripType === ty), borderRadius:'999px', padding:'4px 12px',
                            fontSize:'12px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif",
                            border: leg.tripType === ty ? '1px solid #ca8a04' : `1px solid ${t.border}`,
                            background: leg.tripType === ty ? 'rgba(202,138,4,0.15)' : 'transparent',
                            color: leg.tripType === ty ? '#ca8a04' : t.textMuted,
                          }}>{ty}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}

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
                <div style={{ ...card, marginBottom:'12px', padding:'12px' }}>
                  <img src={premiumVisImage} alt="Packing visual" style={{ width:'100%', borderRadius:'10px', display:'block' }} />
                </div>

                {/* Weather per leg */}
                {premiumWeatherLoading && (
                  <div style={{ ...card, textAlign:'center', color:t.textMuted, fontSize:'13px', padding:'16px' }}>
                    Perfecting forecasts for all locations…
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
                  const pMain = pAllItems.filter(i => i.bag === 'main'); const pCarry = pAllItems.filter(i => i.bag === 'carry'); const pBoot = pAllItems.filter(i => i.bag === 'boot bag')
                  const pMainW = pMain.reduce((s,i) => s + i.weight*i.qty, 0); const pPackedMainW = pMain.filter(i => i.packed).reduce((s,i) => s + i.weight*i.qty, 0); const pCarryW = pCarry.reduce((s,i) => s + i.weight*i.qty, 0); const pBootW = pBoot.reduce((s,i) => s + i.weight*i.qty, 0)
                  const pPacked = pAllItems.filter(i => i.packed).length; const pOver = pMainW > weightLimit; const pPackedOver = pPackedMainW > weightLimit
                  return (
                    <div style={card}>
                      <div style={{ fontSize:'13px', fontWeight:'600', color:t.text, marginBottom:'14px' }}>Weight Tracker</div>
                      {selectedSuitcase && (
                        <div style={{ fontSize:'12px', color:t.textMuted, padding:'8px 12px', background:t.accentDim, border:`1px solid ${t.borderStrong}`, borderRadius:'7px', marginBottom:'12px' }}>
                          <span style={{ color:t.accent, fontWeight:'500' }}>{selectedSuitcase.name}</span> weighs <span style={{ fontFamily:"'JetBrains Mono',monospace" }}>{selectedSuitcase.weightLbs} lbs</span> — you have <span style={{ fontFamily:"'JetBrains Mono',monospace", color:t.text, fontWeight:'600' }}>{weightLimit.toFixed(1)} lbs</span> left for contents (50 − {selectedSuitcase.weightLbs} = {weightLimit.toFixed(1)} lbs).
                        </div>
                      )}
                      <div className="pp-grid-2" style={{ display:'grid', gridTemplateColumns: pBootW > 0 ? '1fr 1fr 1fr' : '1fr 1fr', gap:'10px', marginBottom:'12px' }}>
                        {[{ label:'Packed in Main', val:pPackedMainW, total:pMainW, limit:true }, { label:'Carry-On', val:pCarryW, limit:false }, ...(pBootW > 0 ? [{ label:'Boot Bag', val:pBootW, limit:false }] : [])].map(b => (
                          <div key={b.label} style={{ background:t.inputBg, borderRadius:'8px', padding:'12px', textAlign:'center', border:`1px solid ${b.limit && b.val > weightLimit ? '#dc2626' : t.border}` }}>
                            <div style={{ fontSize:'22px', fontWeight:'600', color: b.limit && b.val > weightLimit ? '#dc2626' : '#ca8a04', fontFamily:"'JetBrains Mono',monospace" }}>{b.val.toFixed(1)}</div>
                            <div style={{ fontSize:'11px', color:t.textMuted, marginTop:'2px' }}>{b.label} lbs{b.limit ? ` / ${weightLimit.toFixed(1)} max` : ''}</div>
                            {b.limit && b.total != null && <div style={{ fontSize:'10px', color:t.textDim, marginTop:'2px' }}>({b.total.toFixed(1)} lbs total list)</div>}
                          </div>
                        ))}
                      </div>
                      {pPackedOver && <div style={{ fontSize:'12px', color:'#dc2626', padding:'8px 12px', background:'rgba(220,38,38,0.08)', borderRadius:'7px', marginBottom:'10px' }}>{selectedSuitcase ? `Packed items exceed ${weightLimit.toFixed(1)} lbs — bag weight (${selectedSuitcase.weightLbs} lbs) plus packed items would exceed the 50 lb airline limit. Move items to carry-on or uncheck some.` : 'Packed items exceed 50 lbs — move some to carry-on or uncheck them.'}</div>}
                      {!pPackedOver && pOver && <div style={{ fontSize:'12px', color:'#f59e0b', padding:'8px 12px', background:'rgba(245,158,11,0.08)', borderRadius:'7px', marginBottom:'10px' }}>⚠️ Your full list totals {pMainW.toFixed(1)} lbs — exceeds your {weightLimit.toFixed(1)} lb allowance. Pack selectively or move items to carry-on.</div>}
                      {pBootW > 0 && (pMainW + pBootW) > weightLimit && (
                        <div style={{ fontSize:'12px', color:'#f59e0b', padding:'8px 12px', background:'rgba(245,158,11,0.08)', borderRadius:'7px', marginBottom:'10px' }}>
                          ⚠️ Your boot bag ({pBootW.toFixed(1)} lbs) + main suitcase ({pMainW.toFixed(1)} lbs) together exceed the 50 lb checked bag limit. Airlines typically count the boot bag as a separate checked bag — confirm with your airline, as it may incur overweight or extra bag fees.
                        </div>
                      )}
                      <div style={{ background:t.inputBg, borderRadius:'999px', height:'6px', overflow:'hidden' }}>
                        <div style={{ background: pPackedOver ? '#dc2626' : '#ca8a04', height:'100%', width:`${Math.min((pPackedMainW/weightLimit)*100,100).toFixed(1)}%`, borderRadius:'999px', transition:'width 0.4s' }} />
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'7px', fontSize:'12px', color:t.textMuted }}>
                        <span>{pPacked}/{pAllItems.length} packed</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", color: pPackedOver ? '#dc2626' : t.textMuted }}>Packed: {pPackedMainW.toFixed(1)} / {weightLimit.toFixed(1)} lbs{pPackedOver ? ' — OVER LIMIT' : ''}</span>
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
                    {catItems.map((item, i) => {
                      const isJersey = item.name === 'Jersey / Team Uniform'
                      return (
                        <div key={i}>
                          {isJersey && (
                            <div style={{ background:'rgba(220,38,38,0.08)', border:'2px solid #dc2626', borderRadius:'8px', padding:'8px 12px', marginBottom:'6px', display:'flex', alignItems:'center', gap:'8px' }}>
                              <span style={{ fontSize:'18px' }}>⚠️</span>
                              <span style={{ fontSize:'13px', fontWeight:'700', color:'#dc2626' }}>DO NOT FORGET YOUR JERSEY!</span>
                            </div>
                          )}
                          <div className="item-row" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 6px', borderRadius:'6px', borderBottom: i < catItems.length-1 ? `1px solid ${t.border}` : 'none' }}>
                            <input type="checkbox" checked={item.packed} onChange={() => togglePremiumPacked(cat, i)} style={{ width:'15px', height:'15px', flexShrink:0, cursor:'pointer' }} />
                            <span style={{ flex:1, fontSize: isJersey ? '16px' : '14px', fontWeight: isJersey ? '700' : '400', color: item.packed ? t.textDim : (isJersey ? '#dc2626' : t.text), textDecoration: item.packed ? 'line-through' : 'none' }}>
                              {item.name} <span style={{ color: isJersey ? 'rgba(220,38,38,0.7)' : t.textDim, fontSize:'12px', fontFamily:"'JetBrains Mono',monospace" }}>×{item.qty}</span>
                            </span>
                            <span style={{ fontSize:'11px', color:t.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{item.weight} lb</span>
                            <button onClick={() => togglePremiumBag(cat, i)} style={{
                              fontSize:'11px', background:'rgba(202,138,4,0.1)', color:'#ca8a04', border:'1px solid rgba(202,138,4,0.3)',
                              padding:'2px 10px', borderRadius:'999px', cursor:'pointer', fontWeight:'500', whiteSpace:'nowrap',
                            }}>
                              {item.bag === 'carry' ? 'Carry-On' : item.bag === 'boot bag' ? 'Boot Bag' : 'Main'}
                            </button>
                            <button onClick={() => removePremiumItem(cat, i)} title="Remove item" style={{ background:'transparent', border:'none', color:t.textDim, cursor:'pointer', fontSize:'16px', padding:'0 2px', lineHeight:1, flexShrink:0 }}>×</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}

                {/* Add custom item */}
                <div style={card}>
                  <div style={{ fontSize:'11px', fontWeight:'600', color:'#ca8a04', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'12px' }}>Add Item</div>
                  <div style={{ display:'grid', gap:'8px' }}>
                    <input value={premiumCustomItem} onChange={e => setPremiumCustomItem(e.target.value)} placeholder="Item name..."
                      onKeyDown={e => e.key === 'Enter' && addPremiumCustomItem()} style={inputStyle} />
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                      <div>
                        <label style={labelStyle}>Weight (lbs)</label>
                        <input type="number" value={premiumCustomItemWeight} onChange={e => setPremiumCustomItemWeight(e.target.value)}
                          step="0.1" min="0" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Bag</label>
                        <select value={premiumCustomItemBag} onChange={e => setPremiumCustomItemBag(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
                          <option value="main">Main Bag</option>
                          <option value="carry">Carry-On</option>
                          <option value="boot bag">Boot Bag</option>
                        </select>
                      </div>
                    </div>
                    <button className="btn-primary" onClick={addPremiumCustomItem}
                      style={{ ...btnPrimary, background:'#ca8a04' }}>Add Item</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === 'Profile' && (
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
                  <label style={labelStyle}>Gender</label>
                  <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                    {['Male','Female','Prefer not to say'].map(s => (
                      <button key={s} className="btn-pill" onClick={() => saveProfile({ gender: s })} style={{ ...t.pill(profile.gender === s), borderRadius:'999px', padding:'5px 14px', fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>{s}</button>
                    ))}
                  </div>
                  <div style={{ fontSize:'11px', color:t.textMuted, marginTop:'5px' }}>Helps tailor clothing suggestions in your packing list</div>
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

                {/* Trip feedback survey button */}
                <div style={{ paddingTop:'6px' }}>
                  <button className="btn-ghost" onClick={() => { setShowTripSurvey(true); setSurveyStep(0); setSurveyAnswers({ usedEverything:'', leftBehind:'', shouldHavePacked:'', otherFeedback:'' }); setSurveyDone(false) }}
                    style={{ width:'100%', background: dark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.35)', borderRadius:'10px', padding:'14px 16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:'600', color:'#10b981' }}>Just finished your trip?</div>
                      <div style={{ fontSize:'12px', color:t.textMuted, marginTop:'2px' }}>Take a quick survey — we'll use your feedback next time</div>
                    </div>
                    <span style={{ fontSize:'18px' }}>✈️</span>
                  </button>
                  {surveyDone && (
                    <div style={{ marginTop:'8px', padding:'10px 14px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'8px', fontSize:'13px', color:'#10b981' }}>
                      Thanks for the feedback! We'll tailor your next list based on what you shared.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Suitcase Selector */}
            <div style={card}>
              <div style={{ fontSize:'11px', fontWeight:'600', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'18px' }}>My Suitcase</div>
              <div style={{ display:'grid', gap:'12px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  <div>
                    <label style={labelStyle}>Brand</label>
                    <select value={suitcaseBrandFilter} onChange={e => setSuitcaseBrandFilter(e.target.value)}
                      style={{ ...inputStyle, cursor:'pointer' }}>
                      <option value=''>All Brands</option>
                      {SUITCASE_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Model</label>
                    <select value={selectedSuitcase?.id ?? ''} onChange={e => {
                      const found = SUITCASES.find(s => s.id === e.target.value) || null
                      setSelectedSuitcase(found)
                      try { localStorage.setItem('pp_suitcase', found ? found.id : '') } catch(_) {}
                    }} style={{ ...inputStyle, cursor:'pointer' }}>
                      <option value=''>Select a suitcase...</option>
                      {SUITCASES.filter(s => !suitcaseBrandFilter || s.brand === suitcaseBrandFilter).map(s => (
                        <option key={s.id} value={s.id}>{s.brand} — {s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedSuitcase && (() => {
                  const sc = selectedSuitcase
                  const sizeColor = sc.size === 'carry-on' ? '#3b82f6' : sc.size === 'large' ? '#8b5cf6' : t.accent
                  const sizeLabel = sc.size === 'carry-on' ? 'Carry-On' : sc.size === 'medium' ? 'Checked Medium' : 'Checked Large'
                  const capEffect = sc.liters < 45 ? 'Carry-on mode: clothing quantities reduced to fit' : sc.liters > 80 ? 'Large bag: extra room allows more clothing' : 'Standard capacity: no adjustments'
                  return (
                    <div style={{ background:t.cardAlt ?? t.surface, border:`1px solid ${t.borderStrong}`, borderRadius:'10px', padding:'14px', display:'grid', gap:'10px' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ fontSize:'14px', fontWeight:'600', color:t.text }}>{sc.brand} {sc.name}</div>
                        <span style={{ background:sizeColor, color:'#fff', fontSize:'11px', fontWeight:'600', padding:'3px 9px', borderRadius:'999px', letterSpacing:'0.04em' }}>{sizeLabel}</span>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'8px', textAlign:'center' }}>
                        {[['Dimensions', sc.dimensions], ['Capacity', `${sc.liters} L`], ['Bag Weight', `${sc.weightLbs} lbs`]].map(([label, val]) => (
                          <div key={label} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:'8px', padding:'8px 4px' }}>
                            <div style={{ fontSize:'10px', color:t.textMuted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'3px' }}>{label}</div>
                            <div style={{ fontSize:'13px', fontWeight:'600', color:t.text }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                        <div style={{ fontSize:'11px', color: sc.liters < 45 ? '#3b82f6' : sc.liters > 80 ? '#8b5cf6' : t.accent }}>
                          {sc.liters < 45 ? '✈️' : sc.liters > 80 ? '🧳' : '🗃️'} {capEffect}
                        </div>
                      </div>
                      <button className="btn-ghost" onClick={() => { setSelectedSuitcase(null); try { localStorage.removeItem('pp_suitcase') } catch(_) {} }}
                        style={{ background:'transparent', border:`1px solid ${t.border}`, borderRadius:'7px', padding:'5px 12px', fontSize:'12px', color:t.textMuted, cursor:'pointer', alignSelf:'start', width:'fit-content' }}>
                        Clear Selection
                      </button>
                    </div>
                  )
                })()}

                {!selectedSuitcase && (
                  <div style={{ fontSize:'12px', color:t.textMuted, padding:'4px 0' }}>
                    Select your suitcase to tailor packing quantities to your bag's capacity.
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
              <p style={{ fontSize:'13px', color:t.textMuted }}>Airlines allow <strong style={{ color:t.text }}>50 lbs</strong> total for a checked bag — that includes the bag itself. If you've selected a suitcase, the weight tracker automatically subtracts the bag's weight so the limit shown is what's left for your contents (50 − bag weight = available capacity). Carry-on has no enforced limit here.</p>
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

        {activeTab === 'About' && (
          <div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <img src="/img-team.jpg" alt="PackPerfect team" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div style={card}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: t.text, marginBottom: '10px' }}>About Us – PackPerfect</div>
              <p style={{ fontSize: '14px', color: t.textMuted, lineHeight: '1.7', marginBottom: '16px' }}>
                At PackPerfect, we believe packing shouldn't be stressful—it should be simple, efficient, and even a little satisfying.
              </p>
              <p style={{ fontSize: '14px', color: t.textMuted, lineHeight: '1.7', marginBottom: '20px' }}>
                PackPerfect was created to solve a problem almost every traveler faces: overpacking, underpacking, and the frustration of not knowing how to fit everything into your bag. Instead of generic lists, we offer step-by-step visual guidance that shows you exactly how to pack smarter.
              </p>
              <div style={{ fontSize: '13px', fontWeight: '600', color: t.text, marginBottom: '12px' }}>Our app helps you:</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Maximize space in your suitcase', 'Stay organized with easy-to-follow visuals', 'Pack efficiently for any trip'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: t.textMuted }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '14px', color: t.textMuted, lineHeight: '1.7', marginBottom: '28px' }}>
                Whether you're heading on a weekend getaway or a long vacation, PackPerfect takes the guesswork out of packing—so you can focus on enjoying your trip.
              </p>
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '24px' }}>
                <div style={{ fontSize: '17px', fontWeight: '700', color: t.text, marginBottom: '10px' }}>Our Team</div>
                <p style={{ fontSize: '14px', color: t.textMuted, lineHeight: '1.7', marginBottom: '18px' }}>
                  PackPerfect is built by a team of students in INCubator at Roslyn High School. By combining creativity and cooperation we made our app to solve the issue of packing.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { name: 'Hannah Friedmann', role: 'CEO', desc: 'Vision, product strategy, and leadership' },
                    { name: 'Noah Cepler', role: 'CFO', desc: 'Financial planning and business strategy' },
                    { name: 'Alana Borkon', role: 'COO', desc: 'Operations and team management' },
                    { name: 'Jude Rock', role: 'CTO', desc: 'Designing, presentations, and innovation' },
                    { name: 'Ben Zarkin', role: 'CMO', desc: 'Marketing, branding, and user growth' },
                  ].map(({ name, role, desc }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ minWidth: '44px', fontSize: '11px', fontWeight: '700', color: t.accent, background: dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)', borderRadius: '6px', padding: '3px 6px', textAlign: 'center', marginTop: '1px' }}>{role}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: t.text }}>{name}</div>
                        <div style={{ fontSize: '13px', color: t.textMuted }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BANNER AD */}
      {(
        <div style={{ borderTop:`1px solid ${t.border}`, padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:'100%', maxWidth:'860px', height:'72px', background: dark ? '#0a1523' : '#f0f3f8', border:`1px dashed ${t.border}`, borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
            <span style={{ fontSize:'10px', fontWeight:'700', color:t.textDim, textTransform:'uppercase', letterSpacing:'0.15em' }}>Advertisement</span>
            <span style={{ fontSize:'20px', fontWeight:'700', color:t.textDim }}>Ad</span>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ padding:'14px 20px', textAlign:'center' }}>
        <span style={{ fontSize:'12px', color:t.textDim }}>
          site by{' '}
          <a href="https://vilas.studio" target="_blank" rel="noopener noreferrer" style={{ color:t.textDim, textDecoration:'underline' }}>
            vilas.studio
          </a>
        </span>
      </div>
    </div>
  )
}

