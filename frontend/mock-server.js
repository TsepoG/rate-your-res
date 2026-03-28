/**
 * RateYourRes Mock Server
 * Runs on http://localhost:4000
 * No dependencies — uses Node built-in http module only.
 * Start with: node mock-server.js
 */

import http from 'http'

// ─── Mock Data ───────────────────────────────────────────────────────────────

const UNIVERSITIES = [
  {
    id: 'ukzn',
    name: 'University of KwaZulu-Natal',
    abbreviation: 'UKZN',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    establishedYear: 1910,
    campusCount: 4,
    residenceCount: 28,
    reviewCount: 1240,
    avgRating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80',
  },
  {
    id: 'wits',
    name: 'University of the Witwatersrand',
    abbreviation: 'Wits',
    city: 'Johannesburg',
    province: 'Gauteng',
    establishedYear: 1922,
    campusCount: 2,
    residenceCount: 22,
    reviewCount: 1800,
    avgRating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1600&q=80',
  },
  {
    id: 'uct',
    name: 'University of Cape Town',
    abbreviation: 'UCT',
    city: 'Cape Town',
    province: 'Western Cape',
    establishedYear: 1829,
    campusCount: 3,
    residenceCount: 25,
    reviewCount: 2400,
    avgRating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1580697529088-bee7f50533ef?w=1600&q=80',
  },
  {
    id: 'sun',
    name: 'Stellenbosch University',
    abbreviation: 'SU',
    city: 'Stellenbosch',
    province: 'Western Cape',
    establishedYear: 1918,
    campusCount: 2,
    residenceCount: 22,
    reviewCount: 1900,
    avgRating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1531370379003-f33ac6b26524?w=1600&q=80',
  },
  {
    id: 'up',
    name: 'University of Pretoria',
    abbreviation: 'UP',
    city: 'Pretoria',
    province: 'Gauteng',
    establishedYear: 1908,
    campusCount: 4,
    residenceCount: 30,
    reviewCount: 2100,
    avgRating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&q=80',
  },
  {
    id: 'uj',
    name: 'University of Johannesburg',
    abbreviation: 'UJ',
    city: 'Johannesburg',
    province: 'Gauteng',
    establishedYear: 2005,
    campusCount: 4,
    residenceCount: 18,
    reviewCount: 1100,
    avgRating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80',
  },
  {
    id: 'ufs',
    name: 'University of the Free State',
    abbreviation: 'UFS',
    city: 'Bloemfontein',
    province: 'Free State',
    establishedYear: 1904,
    campusCount: 3,
    residenceCount: 28,
    reviewCount: 1200,
    avgRating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1600431521340-491eca880813?w=1600&q=80',
  },
  {
    id: 'dut',
    name: 'Durban University of Technology',
    abbreviation: 'DUT',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    establishedYear: 2002,
    campusCount: 5,
    residenceCount: 18,
    reviewCount: 850,
    avgRating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80',
  },
]

const RESIDENCES = {
  ukzn: [
    {
      id: 'ukzn-ansell-may',
      universityId: 'ukzn',
      name: 'Ansell May Hall',
      campus: 'Howard College Campus',
      campusType: 'on_campus',
      avgRating: 4.8,
      reviewCount: 128,
      amenities: ['Free WiFi', 'Laundry', '24/7 Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      description: 'One of UKZN\'s most popular residences, situated on the Howard College campus with easy access to all faculty buildings.',
      province: 'KwaZulu-Natal',
    },
    {
      id: 'ukzn-village',
      universityId: 'ukzn',
      name: 'The Village Residency',
      campus: 'Westville Campus',
      campusType: 'off_campus',
      avgRating: 4.2,
      reviewCount: 84,
      amenities: ['Shuttle', 'Gym', 'Pool'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      description: 'Modern off-campus residency with great amenities near the Westville campus.',
      province: 'KwaZulu-Natal',
    },
    {
      id: 'ukzn-denison',
      universityId: 'ukzn',
      name: 'Denison Hall',
      campus: 'PMB Campus',
      campusType: 'on_campus',
      avgRating: 3.9,
      reviewCount: 312,
      amenities: ['Parking', 'Dining Hall', 'Elevator'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      description: 'Traditional hall of residence on the Pietermaritzburg campus with a strong community culture.',
      province: 'KwaZulu-Natal',
    },
    {
      id: 'ukzn-mazisi',
      universityId: 'ukzn',
      name: 'Mazisi Kunene',
      campus: 'Howard College Campus',
      campusType: 'on_campus',
      avgRating: 4.5,
      reviewCount: 201,
      amenities: ['Free WiFi', 'Study Room', 'Dining Hall'],
      roomTypes: ['Single', 'En-suite'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'A modern residence named after the renowned poet, offering en-suite options.',
      province: 'KwaZulu-Natal',
    },
    {
      id: 'ukzn-margaret',
      universityId: 'ukzn',
      name: 'Margaret Snell Hall',
      campus: 'Howard College Campus',
      campusType: 'on_campus',
      avgRating: 4.3,
      reviewCount: 97,
      amenities: ['Free WiFi', 'Laundry', 'Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
      description: 'Historic women\'s residence with a warm community atmosphere on Howard College campus.',
      province: 'KwaZulu-Natal',
    },
    {
      id: 'ukzn-southern',
      universityId: 'ukzn',
      name: 'Southern Cross',
      campus: 'Westville Campus',
      campusType: 'on_campus',
      avgRating: 4.0,
      reviewCount: 156,
      amenities: ['Free WiFi', 'Gym', 'Parking'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1562664348-a27f2e71a0c1?w=800&q=80',
      description: 'Popular mixed residence at Westville campus with modern facilities.',
      province: 'KwaZulu-Natal',
    },
  ],

  wits: [
    {
      id: 'wits-barnato',
      universityId: 'wits',
      name: 'Barnato Hall',
      campus: 'East Campus',
      campusType: 'on_campus',
      avgRating: 4.8,
      reviewCount: 342,
      amenities: ['Free WiFi', 'Laundry', '24/7 Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      description: 'One of Wits\'s premier residences located on East Campus.',
      province: 'Gauteng',
    },
    {
      id: 'wits-jubilee',
      universityId: 'wits',
      name: 'Jubilee Hall',
      campus: 'West Campus',
      campusType: 'on_campus',
      avgRating: 4.4,
      reviewCount: 218,
      amenities: ['Free WiFi', 'Dining Hall', 'Elevator'],
      roomTypes: ['Single', 'Double', 'En-suite'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'Modern multi-story residence with excellent facilities on West Campus.',
      province: 'Gauteng',
    },
    {
      id: 'wits-international',
      universityId: 'wits',
      name: 'International House',
      campus: 'East Campus',
      campusType: 'on_campus',
      avgRating: 4.6,
      reviewCount: 189,
      amenities: ['Free WiFi', 'Study Room', 'Laundry', '24/7 Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
      description: 'Diverse residence welcoming both local and international students.',
      province: 'Gauteng',
    },
  ],

  uct: [
    {
      id: 'uct-tugwell',
      universityId: 'uct',
      name: 'Tugwell Hall',
      campus: 'Upper Campus',
      campusType: 'on_campus',
      avgRating: 4.5,
      reviewCount: 412,
      amenities: ['Elevator', 'Dining Hall', 'Shuttle'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'Iconic UCT residence with stunning views of Table Mountain.',
      province: 'Western Cape',
    },
    {
      id: 'uct-smuts',
      universityId: 'uct',
      name: 'Smuts Hall',
      campus: 'Upper Campus',
      campusType: 'on_campus',
      avgRating: 4.7,
      reviewCount: 287,
      amenities: ['Free WiFi', 'Laundry', '24/7 Security', 'Study Room'],
      roomTypes: ['Single', 'Double', 'En-suite'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      description: 'Historic men\'s residence with strong traditions and a great social culture.',
      province: 'Western Cape',
    },
    {
      id: 'uct-kopano',
      universityId: 'uct',
      name: 'Kopano Residence',
      campus: 'Middle Campus',
      campusType: 'on_campus',
      avgRating: 4.3,
      reviewCount: 156,
      amenities: ['Free WiFi', 'Gym', 'Dining Hall', 'Parking'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
      description: 'One of UCT\'s newer residences with modern facilities and mixed accommodation.',
      province: 'Western Cape',
    },
  ],

  sun: [
    {
      id: 'sun-metanoia',
      universityId: 'sun',
      name: 'Metanoia',
      campus: 'Main Campus',
      campusType: 'on_campus',
      avgRating: 4.9,
      reviewCount: 523,
      amenities: ['Gym', 'Pool', 'Free WiFi'],
      roomTypes: ['Single', 'Double', 'En-suite'],
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
      description: 'Stellenbosch\'s most prestigious residence with world-class facilities.',
      province: 'Western Cape',
    },
    {
      id: 'sun-huis-marais',
      universityId: 'sun',
      name: 'Huis Marais',
      campus: 'Main Campus',
      campusType: 'on_campus',
      avgRating: 4.5,
      reviewCount: 298,
      amenities: ['Free WiFi', 'Laundry', 'Study Room', 'Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      description: 'Traditional Stellenbosch residence with a rich cultural history.',
      province: 'Western Cape',
    },
  ],

  up: [
    {
      id: 'up-sonop',
      universityId: 'up',
      name: 'Sonop',
      campus: 'Hatfield Campus',
      campusType: 'on_campus',
      avgRating: 4.6,
      reviewCount: 445,
      amenities: ['Free WiFi', 'Gym', 'Dining Hall', '24/7 Security'],
      roomTypes: ['Single', 'Double', 'En-suite'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'UP\'s flagship residence with exceptional facilities and a vibrant community.',
      province: 'Gauteng',
    },
    {
      id: 'up-mineralia',
      universityId: 'up',
      name: 'Mineralia',
      campus: 'Hatfield Campus',
      campusType: 'on_campus',
      avgRating: 4.3,
      reviewCount: 312,
      amenities: ['Free WiFi', 'Laundry', 'Study Room', 'Parking'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
      description: 'Well-established residence offering a strong academic environment.',
      province: 'Gauteng',
    },
    {
      id: 'up-daar',
      universityId: 'up',
      name: 'Daar Residence',
      campus: 'Groenkloof Campus',
      campusType: 'on_campus',
      avgRating: 4.1,
      reviewCount: 198,
      amenities: ['Free WiFi', 'Shuttle', 'Dining Hall'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      description: 'Education campus residence perfect for students in teaching programmes.',
      province: 'Gauteng',
    },
  ],
}

const REVIEWS = {
  'ukzn-ansell-may': [
    { reviewId: 'r1', residenceId: 'ukzn-ansell-may', rating: 5, comment: 'Absolutely loved living here. The community is welcoming, facilities are well maintained, and the location on Howard College campus is unbeatable.', category: 'general', createdAt: '2024-08-15T10:00:00Z', anonymous: true },
    { reviewId: 'r2', residenceId: 'ukzn-ansell-may', rating: 4, comment: 'WiFi can be slow during peak hours but overall a great place to stay. The security is top notch.', category: 'wifi', createdAt: '2024-07-20T14:30:00Z', anonymous: true },
    { reviewId: 'r3', residenceId: 'ukzn-ansell-may', rating: 5, comment: 'Best decision I made was to stay here in first year. Made lifelong friends.', category: 'community', createdAt: '2024-06-10T09:00:00Z', anonymous: true },
  ],
  'ukzn-village': [
    { reviewId: 'r4', residenceId: 'ukzn-village', rating: 4, comment: 'The shuttle service is convenient but the gym equipment needs upgrading. Pool is a great bonus.', category: 'amenities', createdAt: '2024-09-01T11:00:00Z', anonymous: true },
    { reviewId: 'r5', residenceId: 'ukzn-village', rating: 4, comment: 'Good value for money. Off-campus but the location is walkable to Westville.', category: 'general', createdAt: '2024-08-05T16:00:00Z', anonymous: true },
  ],
  'wits-barnato': [
    { reviewId: 'r6', residenceId: 'wits-barnato', rating: 5, comment: 'Barnato is legendary at Wits. The culture, the people, the location — nothing compares.', category: 'general', createdAt: '2024-09-10T08:00:00Z', anonymous: true },
    { reviewId: 'r7', residenceId: 'wits-barnato', rating: 5, comment: 'Safety is excellent. Have never felt unsafe here, and the wardens are very responsive.', category: 'safety', createdAt: '2024-08-22T12:00:00Z', anonymous: true },
  ],
  'uct-tugwell': [
    { reviewId: 'r8', residenceId: 'uct-tugwell', rating: 5, comment: 'Waking up to a view of Table Mountain every morning never gets old. Tugwell is special.', category: 'general', createdAt: '2024-09-05T07:30:00Z', anonymous: true },
    { reviewId: 'r9', residenceId: 'uct-tugwell', rating: 4, comment: 'The dining hall food is hit or miss but the building itself is beautiful and well maintained.', category: 'food', createdAt: '2024-08-18T13:00:00Z', anonymous: true },
  ],
  'sun-metanoia': [
    { reviewId: 'r10', residenceId: 'sun-metanoia', rating: 5, comment: 'Best res at Stellenbosch hands down. The pool and gym make it worth every cent.', category: 'amenities', createdAt: '2024-09-12T10:00:00Z', anonymous: true },
    { reviewId: 'r11', residenceId: 'sun-metanoia', rating: 5, comment: 'The community here is incredible. Monthly events, strong traditions, amazing vibe.', category: 'community', createdAt: '2024-08-30T15:00:00Z', anonymous: true },
  ],
}

// ─── Helper functions ─────────────────────────────────────────────────────────

function getAllResidences() {
  return Object.values(RESIDENCES).flat()
}

function jsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(JSON.stringify(data))
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(body)) } catch { resolve({}) }
    })
  })
}

function getQueryParams(url) {
  const params = {}
  const queryStr = url.split('?')[1]
  if (!queryStr) return params
  queryStr.split('&').forEach(pair => {
    const [k, v] = pair.split('=')
    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '')
  })
  return params
}

function sortResidences(residences, sortBy) {
  const copy = [...residences]
  if (sortBy === 'most_reviewed') return copy.sort((a, b) => b.reviewCount - a.reviewCount)
  if (sortBy === 'az') return copy.sort((a, b) => a.name.localeCompare(b.name))
  return copy.sort((a, b) => b.avgRating - a.avgRating) // top_rated / recommended default
}

// ─── Request handler ──────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0]
  const method = req.method
  const query = getQueryParams(req.url)

  // Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    return res.end()
  }

  console.log(`${method} ${req.url}`)

  // ── GET /universities ──
  if (method === 'GET' && urlPath === '/universities') {
    let results = [...UNIVERSITIES]
    if (query.province) results = results.filter(u => u.province.toLowerCase() === query.province.toLowerCase())
    if (query.city) results = results.filter(u => u.city.toLowerCase() === query.city.toLowerCase())
    return jsonResponse(res, 200, { items: results, total: results.length })
  }

  // ── GET /universities/:id/residences ──
  const uniResMatch = urlPath.match(/^\/universities\/([^/]+)\/residences$/)
  if (method === 'GET' && uniResMatch) {
    const id = uniResMatch[1]
    const residences = RESIDENCES[id] || []
    const sorted = sortResidences(residences, query.sort)
    return jsonResponse(res, 200, { items: sorted, total: sorted.length })
  }

  // ── GET /universities/:id ──
  const uniMatch = urlPath.match(/^\/universities\/([^/]+)$/)
  if (method === 'GET' && uniMatch) {
    const uni = UNIVERSITIES.find(u => u.id === uniMatch[1])
    if (!uni) return jsonResponse(res, 404, { error: 'University not found' })
    return jsonResponse(res, 200, uni)
  }

  // ── GET /residences/search ──
  if (method === 'GET' && urlPath === '/residences/search') {
    // Enrich residences with university info
    let results = getAllResidences().map(r => {
      const uni = UNIVERSITIES.find(u => u.id === r.universityId)
      return { ...r, universityName: uni?.name || '', universityAbbr: uni?.abbreviation || '' }
    })

    // Full-text search across multiple fields
    if (query.q) {
      const q = query.q.toLowerCase()
      results = results.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.campus.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.universityName.toLowerCase().includes(q) ||
        r.universityAbbr.toLowerCase().includes(q) ||
        r.province?.toLowerCase().includes(q) ||
        r.amenities?.some(a => a.toLowerCase().includes(q))
      )
    }

    // Province filter (single value)
    if (query.province) {
      results = results.filter(r => r.province?.toLowerCase() === query.province.toLowerCase())
    }

    // University IDs filter (comma-separated)
    if (query.universityIds) {
      const ids = query.universityIds.split(',').filter(Boolean)
      if (ids.length) results = results.filter(r => ids.includes(r.universityId))
    }

    // Min rating filter
    if (query.minRating) {
      const min = parseFloat(query.minRating)
      if (!isNaN(min) && min > 0) results = results.filter(r => r.avgRating >= min)
    }

    // Amenities filter (comma-separated — residence must have ALL requested amenities)
    if (query.amenities) {
      const requested = query.amenities.split(',').filter(Boolean).map(a => a.toLowerCase())
      results = results.filter(r =>
        requested.every(req => r.amenities?.some(a => a.toLowerCase().includes(req)))
      )
    }

    // Room type filter (comma-separated — residence must have ANY of the types)
    if (query.roomType) {
      const types = query.roomType.split(',').filter(Boolean).map(t => t.toLowerCase())
      results = results.filter(r =>
        r.roomTypes?.some(rt => types.some(t => rt.toLowerCase().includes(t)))
      )
    }

    // On campus filter
    if (query.onCampus === 'true') {
      results = results.filter(r => r.campusType === 'on_campus')
    }

    const sorted = sortResidences(results, query.sort)
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 12
    const start = (page - 1) * limit
    return jsonResponse(res, 200, {
      residences: sorted.slice(start, start + limit),
      total: sorted.length,
      page,
      totalPages: Math.ceil(sorted.length / limit),
    })
  }

  // ── GET /residences/:id/reviews ──
  const reviewsMatch = urlPath.match(/^\/residences\/([^/]+)\/reviews$/)
  if (method === 'GET' && reviewsMatch) {
    const reviews = REVIEWS[reviewsMatch[1]] || []
    return jsonResponse(res, 200, { items: reviews, total: reviews.length })
  }

  // ── POST /residences/:id/reviews ──
  const postReviewMatch = urlPath.match(/^\/residences\/([^/]+)\/reviews$/)
  if (method === 'POST' && postReviewMatch) {
    const body = await parseBody(req)
    const newReview = {
      reviewId: `r-${Date.now()}`,
      residenceId: postReviewMatch[1],
      ...body,
      createdAt: new Date().toISOString(),
      anonymous: true,
    }
    return jsonResponse(res, 201, newReview)
  }

  // ── GET /residences/:id ──
  const resMatch = urlPath.match(/^\/residences\/([^/]+)$/)
  if (method === 'GET' && resMatch) {
    const res_ = getAllResidences().find(r => r.id === resMatch[1])
    if (!res_) return jsonResponse(res, 404, { error: 'Residence not found' })
    const uni = UNIVERSITIES.find(u => u.id === res_.universityId)
    return jsonResponse(res, 200, { ...res_, university: uni })
  }

  // ── Auth endpoints (mock — always succeed) ──
  if (method === 'POST' && urlPath === '/auth/signup') {
    return jsonResponse(res, 200, { message: 'Verification code sent to your email.' })
  }
  if (method === 'POST' && urlPath === '/auth/verify') {
    return jsonResponse(res, 200, { message: 'Email verified successfully.' })
  }
  if (method === 'POST' && urlPath === '/auth/resend') {
    return jsonResponse(res, 200, { message: 'Code resent.' })
  }
  if (method === 'POST' && urlPath === '/auth/signin') {
    const body = await parseBody(req)
    return jsonResponse(res, 200, {
      idToken: 'mock-id-token',
      accessToken: 'mock-access-token',
      email: body.email || 'student@ukzn.ac.za',
      sub: 'mock-user-id',
    })
  }

  // 404
  jsonResponse(res, 404, { error: 'Not found' })
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`\n🎓 RateYourRes mock server running at http://localhost:${PORT}`)
  console.log('\nAvailable endpoints:')
  console.log('  GET  /universities')
  console.log('  GET  /universities/:id')
  console.log('  GET  /universities/:id/residences')
  console.log('  GET  /residences/:id')
  console.log('  GET  /residences/search')
  console.log('  GET  /residences/:id/reviews')
  console.log('  POST /residences/:id/reviews')
  console.log('  POST /auth/signup | /auth/verify | /auth/signin\n')
})
