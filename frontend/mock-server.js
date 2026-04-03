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
  {
    id: 'mut',
    name: 'Mangosuthu University of Technology',
    abbreviation: 'MUT',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    establishedYear: 1979,
    campusCount: 1,
    residenceCount: 10,
    reviewCount: 420,
    avgRating: 3.9,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80',
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
    id: 'tut',
    name: 'Tshwane University of Technology',
    abbreviation: 'TUT',
    city: 'Pretoria',
    province: 'Gauteng',
    establishedYear: 2004,
    campusCount: 6,
    residenceCount: 15,
    reviewCount: 780,
    avgRating: 3.8,
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1600&q=80',
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
    id: 'cput',
    name: 'Cape Peninsula University of Technology',
    abbreviation: 'CPUT',
    city: 'Cape Town',
    province: 'Western Cape',
    establishedYear: 2005,
    campusCount: 5,
    residenceCount: 12,
    reviewCount: 560,
    avgRating: 3.9,
    imageUrl: 'https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=1600&q=80',
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
    id: 'cut',
    name: 'Central University of Technology',
    abbreviation: 'CUT',
    city: 'Bloemfontein',
    province: 'Free State',
    establishedYear: 2004,
    campusCount: 2,
    residenceCount: 13,
    reviewCount: 490,
    avgRating: 3.7,
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80',
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
      amenities: ['Free WiFi', 'Laundry', '24/7 Security'],
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

  dut: [
    {
      id: 'dut-steve-biko',
      universityId: 'dut',
      name: 'Steve Biko Campus Residence',
      campus: 'Steve Biko Campus',
      campusType: 'on_campus',
      avgRating: 4.3,
      reviewCount: 142,
      amenities: ['Free WiFi', 'Laundry', '24/7 Security', 'Study Room'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      description: 'Modern on-campus residence at DUT\'s main Steve Biko campus in central Durban.',
      province: 'KwaZulu-Natal',
    },
    {
      id: 'dut-ritson',
      universityId: 'dut',
      name: 'Ritson Campus Residence',
      campus: 'Ritson Campus',
      campusType: 'on_campus',
      avgRating: 4.0,
      reviewCount: 98,
      amenities: ['Free WiFi', 'Dining Hall', 'Parking'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      description: 'Affordable student accommodation on the Ritson campus close to the city centre.',
      province: 'KwaZulu-Natal',
    },
    {
      id: 'dut-ML-sultan',
      universityId: 'dut',
      name: 'ML Sultan Residence',
      campus: 'ML Sultan Campus',
      campusType: 'off_campus',
      avgRating: 3.8,
      reviewCount: 76,
      amenities: ['Shuttle', 'Free WiFi', 'Laundry'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1562664348-a27f2e71a0c1?w=800&q=80',
      description: 'Off-campus residence near the ML Sultan campus with shuttle service to all DUT campuses.',
      province: 'KwaZulu-Natal',
    },
  ],

  mut: [
    {
      id: 'mut-main',
      universityId: 'mut',
      name: 'Mangosuthu Main Residence',
      campus: 'Umlazi Campus',
      campusType: 'on_campus',
      avgRating: 3.9,
      reviewCount: 112,
      amenities: ['Free WiFi', 'Dining Hall', '24/7 Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'The primary on-campus residence at Mangosuthu University in Umlazi, Durban South.',
      province: 'KwaZulu-Natal',
    },
    {
      id: 'mut-annexe',
      universityId: 'mut',
      name: 'MUT Annexe',
      campus: 'Umlazi Campus',
      campusType: 'off_campus',
      avgRating: 3.6,
      reviewCount: 58,
      amenities: ['Shuttle', 'Laundry'],
      roomTypes: ['Single', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
      description: 'Affordable off-campus overflow accommodation with shuttle service to the main campus.',
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
      description: 'One of Wits\'s premier residences located on East Campus with a legendary community culture.',
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
    {
      id: 'wits-dalrymple',
      universityId: 'wits',
      name: 'Dalrymple House',
      campus: 'West Campus',
      campusType: 'off_campus',
      avgRating: 4.1,
      reviewCount: 134,
      amenities: ['Free WiFi', 'Shuttle', 'Gym'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1562664348-a27f2e71a0c1?w=800&q=80',
      description: 'Off-campus residence a short walk from Wits West Campus with a social atmosphere.',
      province: 'Gauteng',
    },
  ],

  uj: [
    {
      id: 'uj-auckland-park',
      universityId: 'uj',
      name: 'Auckland Park Residence',
      campus: 'Auckland Park Kingsway Campus',
      campusType: 'on_campus',
      avgRating: 4.1,
      reviewCount: 198,
      amenities: ['Free WiFi', 'Laundry', 'Dining Hall', '24/7 Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
      description: 'The main on-campus residence at UJ\'s Auckland Park Kingsway campus in Johannesburg.',
      province: 'Gauteng',
    },
    {
      id: 'uj-doornfontein',
      universityId: 'uj',
      name: 'Doornfontein Residence',
      campus: 'Doornfontein Campus',
      campusType: 'on_campus',
      avgRating: 3.8,
      reviewCount: 124,
      amenities: ['Free WiFi', 'Study Room', 'Parking'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      description: 'On-campus accommodation at UJ\'s engineering and built environment campus.',
      province: 'Gauteng',
    },
    {
      id: 'uj-soweto',
      universityId: 'uj',
      name: 'Soweto Campus Residence',
      campus: 'Soweto Campus',
      campusType: 'on_campus',
      avgRating: 4.0,
      reviewCount: 87,
      amenities: ['Free WiFi', 'Dining Hall', 'Shuttle'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'On-campus residence at UJ\'s Soweto campus, serving students from the education faculty.',
      province: 'Gauteng',
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
    {
      id: 'up-mamelodi',
      universityId: 'up',
      name: 'Mamelodi Residence',
      campus: 'Mamelodi Campus',
      campusType: 'on_campus',
      avgRating: 3.9,
      reviewCount: 143,
      amenities: ['Free WiFi', 'Dining Hall', '24/7 Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1562664348-a27f2e71a0c1?w=800&q=80',
      description: 'Residence serving students at UP\'s Mamelodi campus for natural and agricultural sciences.',
      province: 'Gauteng',
    },
  ],

  tut: [
    {
      id: 'tut-arcadia',
      universityId: 'tut',
      name: 'Arcadia Student Village',
      campus: 'Arcadia Campus',
      campusType: 'on_campus',
      avgRating: 3.8,
      reviewCount: 167,
      amenities: ['Free WiFi', 'Laundry', 'Study Room'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'On-campus student village at TUT\'s Arcadia campus in the heart of Pretoria.',
      province: 'Gauteng',
    },
    {
      id: 'tut-soshanguve',
      universityId: 'tut',
      name: 'Soshanguve Residence',
      campus: 'Soshanguve Campus',
      campusType: 'on_campus',
      avgRating: 3.6,
      reviewCount: 92,
      amenities: ['Dining Hall', '24/7 Security', 'Parking'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      description: 'Affordable on-campus accommodation at TUT\'s Soshanguve campus north of Pretoria.',
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
    {
      id: 'uct-fuller',
      universityId: 'uct',
      name: 'Fuller Hall',
      campus: 'Upper Campus',
      campusType: 'on_campus',
      avgRating: 4.2,
      reviewCount: 198,
      amenities: ['Free WiFi', 'Laundry', 'Dining Hall'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1562664348-a27f2e71a0c1?w=800&q=80',
      description: 'Women\'s residence on Upper Campus with a welcoming community and beautiful surroundings.',
      province: 'Western Cape',
    },
  ],

  cput: [
    {
      id: 'cput-bellville',
      universityId: 'cput',
      name: 'Bellville Campus Residence',
      campus: 'Bellville Campus',
      campusType: 'on_campus',
      avgRating: 3.9,
      reviewCount: 134,
      amenities: ['Free WiFi', 'Laundry', 'Dining Hall'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'On-campus accommodation at CPUT\'s Bellville campus in the northern suburbs of Cape Town.',
      province: 'Western Cape',
    },
    {
      id: 'cput-district-six',
      universityId: 'cput',
      name: 'District Six Student Village',
      campus: 'Cape Town Campus',
      campusType: 'off_campus',
      avgRating: 4.0,
      reviewCount: 89,
      amenities: ['Free WiFi', 'Shuttle', 'Study Room'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      description: 'Student village near the city campus with excellent access to Cape Town\'s public transport.',
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
      amenities: ['Free WiFi', 'Laundry', 'Study Room', '24/7 Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      description: 'Traditional Stellenbosch residence with a rich cultural history.',
      province: 'Western Cape',
    },
    {
      id: 'sun-eendrag',
      universityId: 'sun',
      name: 'Eendrag',
      campus: 'Main Campus',
      campusType: 'on_campus',
      avgRating: 4.4,
      reviewCount: 211,
      amenities: ['Free WiFi', 'Dining Hall', 'Gym', 'Laundry'],
      roomTypes: ['Single', 'Double', 'En-suite'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'Large co-ed residence on Main Campus known for its sporting culture and social events.',
      province: 'Western Cape',
    },
    {
      id: 'sun-huis-ten-bosch',
      universityId: 'sun',
      name: 'Huis Ten Bosch',
      campus: 'Main Campus',
      campusType: 'off_campus',
      avgRating: 4.2,
      reviewCount: 156,
      amenities: ['Free WiFi', 'Shuttle', 'Study Room'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1562664348-a27f2e71a0c1?w=800&q=80',
      description: 'Off-campus private residence a short walk from Stellenbosch town and the university.',
      province: 'Western Cape',
    },
  ],

  ufs: [
    {
      id: 'ufs-veritas',
      universityId: 'ufs',
      name: 'Veritas',
      campus: 'Main Campus',
      campusType: 'on_campus',
      avgRating: 4.2,
      reviewCount: 234,
      amenities: ['Free WiFi', 'Dining Hall', 'Laundry', '24/7 Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'One of UFS\'s most established residences with a proud tradition on the main campus.',
      province: 'Free State',
    },
    {
      id: 'ufs-soetdoring',
      universityId: 'ufs',
      name: 'Soetdoring',
      campus: 'Main Campus',
      campusType: 'on_campus',
      avgRating: 4.0,
      reviewCount: 178,
      amenities: ['Free WiFi', 'Gym', 'Study Room'],
      roomTypes: ['Single', 'Double', 'Triple'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      description: 'Popular co-ed residence on the UFS main campus known for its lively community.',
      province: 'Free State',
    },
    {
      id: 'ufs-armentum',
      universityId: 'ufs',
      name: 'Armentum',
      campus: 'South Campus',
      campusType: 'on_campus',
      avgRating: 3.8,
      reviewCount: 121,
      amenities: ['Dining Hall', 'Laundry', 'Parking'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      description: 'Residence on UFS South Campus catering mainly to first-year students.',
      province: 'Free State',
    },
  ],

  cut: [
    {
      id: 'cut-bloemfontein',
      universityId: 'cut',
      name: 'CUT Bloemfontein Residence',
      campus: 'Bloemfontein Campus',
      campusType: 'on_campus',
      avgRating: 3.7,
      reviewCount: 143,
      amenities: ['Free WiFi', 'Laundry', 'Dining Hall'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=800&q=80',
      description: 'On-campus student accommodation at CUT\'s Bloemfontein campus.',
      province: 'Free State',
    },
    {
      id: 'cut-welkom',
      universityId: 'cut',
      name: 'Welkom Campus Residence',
      campus: 'Welkom Campus',
      campusType: 'on_campus',
      avgRating: 3.6,
      reviewCount: 67,
      amenities: ['Free WiFi', '24/7 Security'],
      roomTypes: ['Single', 'Double'],
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
      description: 'Student residence at CUT\'s Welkom campus in the Free State goldfields region.',
      province: 'Free State',
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
  'ukzn-denison': [
    { reviewId: 'r-den1', residenceId: 'ukzn-denison', rating: 4, comment: 'Great community in PMB. Food in the dining hall could be better but the atmosphere makes up for it.', category: 'general', createdAt: '2024-08-10T09:00:00Z', anonymous: true },
    { reviewId: 'r-den2', residenceId: 'ukzn-denison', rating: 3, comment: 'Internet is unreliable. Management needs to upgrade the infrastructure.', category: 'wifi', createdAt: '2024-07-15T11:00:00Z', anonymous: true },
  ],
  'ukzn-mazisi': [
    { reviewId: 'r-maz1', residenceId: 'ukzn-mazisi', rating: 5, comment: 'Love the en-suite option. Very modern and clean. The study rooms are always well-maintained.', category: 'general', createdAt: '2024-09-03T08:00:00Z', anonymous: true },
    { reviewId: 'r-maz2', residenceId: 'ukzn-mazisi', rating: 4, comment: 'Great location on Howard College. Dining hall food is decent and consistent.', category: 'food', createdAt: '2024-08-20T14:00:00Z', anonymous: true },
  ],
  'wits-barnato': [
    { reviewId: 'r6', residenceId: 'wits-barnato', rating: 5, comment: 'Barnato is legendary at Wits. The culture, the people, the location — nothing compares.', category: 'general', createdAt: '2024-09-10T08:00:00Z', anonymous: true },
    { reviewId: 'r7', residenceId: 'wits-barnato', rating: 5, comment: 'Safety is excellent. Have never felt unsafe here, and the wardens are very responsive.', category: 'safety', createdAt: '2024-08-22T12:00:00Z', anonymous: true },
    { reviewId: 'r-bar3', residenceId: 'wits-barnato', rating: 4, comment: 'Rooms are on the smaller side but the social life more than makes up for it.', category: 'general', createdAt: '2024-07-30T10:00:00Z', anonymous: true },
  ],
  'wits-jubilee': [
    { reviewId: 'r-jub1', residenceId: 'wits-jubilee', rating: 4, comment: 'Modern building, clean rooms, great facilities. The elevator saves a lot of time.', category: 'general', createdAt: '2024-09-01T09:00:00Z', anonymous: true },
    { reviewId: 'r-jub2', residenceId: 'wits-jubilee', rating: 5, comment: 'Best res at Wits in terms of facilities. The en-suite rooms are worth the extra cost.', category: 'amenities', createdAt: '2024-08-14T15:00:00Z', anonymous: true },
  ],
  'wits-international': [
    { reviewId: 'r-int1', residenceId: 'wits-international', rating: 5, comment: 'Amazing mix of cultures. You make international friends from day one. The study rooms are always quiet.', category: 'community', createdAt: '2024-09-05T10:00:00Z', anonymous: true },
    { reviewId: 'r-int2', residenceId: 'wits-international', rating: 4, comment: 'Security is great and WiFi is reliable. Would recommend to any first-year.', category: 'safety', createdAt: '2024-08-18T13:00:00Z', anonymous: true },
  ],
  'uct-tugwell': [
    { reviewId: 'r8', residenceId: 'uct-tugwell', rating: 5, comment: 'Waking up to a view of Table Mountain every morning never gets old. Tugwell is special.', category: 'general', createdAt: '2024-09-05T07:30:00Z', anonymous: true },
    { reviewId: 'r9', residenceId: 'uct-tugwell', rating: 4, comment: 'The dining hall food is hit or miss but the building itself is beautiful and well maintained.', category: 'food', createdAt: '2024-08-18T13:00:00Z', anonymous: true },
    { reviewId: 'r-tug3', residenceId: 'uct-tugwell', rating: 5, comment: 'The location on upper campus means you\'re five minutes from everything. Incredible views too.', category: 'general', createdAt: '2024-07-22T10:00:00Z', anonymous: true },
  ],
  'uct-smuts': [
    { reviewId: 'r-smu1', residenceId: 'uct-smuts', rating: 5, comment: 'Historic and full of tradition. The community here is unlike any other res at UCT.', category: 'community', createdAt: '2024-09-08T09:00:00Z', anonymous: true },
    { reviewId: 'r-smu2', residenceId: 'uct-smuts', rating: 4, comment: 'Security is excellent and the WiFi rarely goes down. Study rooms are always open.', category: 'wifi', createdAt: '2024-08-25T11:00:00Z', anonymous: true },
  ],
  'uct-kopano': [
    { reviewId: 'r-kop1', residenceId: 'uct-kopano', rating: 4, comment: 'Newer res so everything is modern. Gym is a great added bonus. Parking can be tough.', category: 'amenities', createdAt: '2024-09-02T10:00:00Z', anonymous: true },
    { reviewId: 'r-kop2', residenceId: 'uct-kopano', rating: 4, comment: 'The dining hall has a good variety. Mixed accommodation works really well here.', category: 'food', createdAt: '2024-08-10T14:00:00Z', anonymous: true },
  ],
  'sun-metanoia': [
    { reviewId: 'r10', residenceId: 'sun-metanoia', rating: 5, comment: 'Best res at Stellenbosch hands down. The pool and gym make it worth every cent.', category: 'amenities', createdAt: '2024-09-12T10:00:00Z', anonymous: true },
    { reviewId: 'r11', residenceId: 'sun-metanoia', rating: 5, comment: 'The community here is incredible. Monthly events, strong traditions, amazing vibe.', category: 'community', createdAt: '2024-08-30T15:00:00Z', anonymous: true },
    { reviewId: 'r-met3', residenceId: 'sun-metanoia', rating: 5, comment: 'Nothing like it in SA. The facilities are world-class and the people are even better.', category: 'general', createdAt: '2024-07-20T09:00:00Z', anonymous: true },
  ],
  'sun-huis-marais': [
    { reviewId: 'r-mar1', residenceId: 'sun-huis-marais', rating: 4, comment: 'Rich history and great culture. Laundry facilities are always well maintained.', category: 'general', createdAt: '2024-09-06T11:00:00Z', anonymous: true },
    { reviewId: 'r-mar2', residenceId: 'sun-huis-marais', rating: 5, comment: 'The study room environment is excellent. Security feels safe around the clock.', category: 'safety', createdAt: '2024-08-16T14:00:00Z', anonymous: true },
  ],
  'up-sonop': [
    { reviewId: 'r-son1', residenceId: 'up-sonop', rating: 5, comment: 'Sonop is legendary at UP. The gym and dining hall are top tier. Best first-year experience.', category: 'general', createdAt: '2024-09-09T09:00:00Z', anonymous: true },
    { reviewId: 'r-son2', residenceId: 'up-sonop', rating: 4, comment: 'Great facilities and strong community. Security is tight which makes you feel very safe.', category: 'safety', createdAt: '2024-08-28T12:00:00Z', anonymous: true },
    { reviewId: 'r-son3', residenceId: 'up-sonop', rating: 5, comment: 'The dining hall is the best I\'ve seen at any SA university. Really impressive.', category: 'food', createdAt: '2024-07-15T10:00:00Z', anonymous: true },
  ],
  'up-mineralia': [
    { reviewId: 'r-min1', residenceId: 'up-mineralia', rating: 4, comment: 'Solid academic environment. Study rooms are quiet and well-equipped.', category: 'general', createdAt: '2024-09-04T10:00:00Z', anonymous: true },
    { reviewId: 'r-min2', residenceId: 'up-mineralia', rating: 4, comment: 'Good WiFi and parking. Laundry facilities could use more machines during peak times.', category: 'amenities', createdAt: '2024-08-12T13:00:00Z', anonymous: true },
  ],
  'ufs-veritas': [
    { reviewId: 'r-ver1', residenceId: 'ufs-veritas', rating: 4, comment: 'Great res with strong traditions. The dining hall serves consistent, decent meals.', category: 'general', createdAt: '2024-09-07T09:00:00Z', anonymous: true },
    { reviewId: 'r-ver2', residenceId: 'ufs-veritas', rating: 4, comment: 'Security is reliable and WiFi works well. Laundry facilities get busy on weekends.', category: 'amenities', createdAt: '2024-08-21T11:00:00Z', anonymous: true },
  ],
  'dut-steve-biko': [
    { reviewId: 'r-dut1', residenceId: 'dut-steve-biko', rating: 4, comment: 'Well-located in central Durban. WiFi is reliable and the study rooms are always accessible.', category: 'general', createdAt: '2024-09-11T09:00:00Z', anonymous: true },
    { reviewId: 'r-dut2', residenceId: 'dut-steve-biko', rating: 4, comment: 'Security is good. Laundry facilities are a bit limited but manageable.', category: 'safety', createdAt: '2024-08-26T14:00:00Z', anonymous: true },
  ],
  'uj-auckland-park': [
    { reviewId: 'r-uj1', residenceId: 'uj-auckland-park', rating: 4, comment: 'Great location on the main campus. Dining hall has variety and WiFi is solid.', category: 'general', createdAt: '2024-09-08T10:00:00Z', anonymous: true },
    { reviewId: 'r-uj2', residenceId: 'uj-auckland-park', rating: 4, comment: 'Security is excellent. The common areas are clean and well maintained.', category: 'safety', createdAt: '2024-08-17T13:00:00Z', anonymous: true },
  ],
}

// ─── Helper functions ─────────────────────────────────────────────────────────

function makeMockJWT(email, universityId = 'ukzn') {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    email,
    sub: 'mock-user-id',
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    'custom:university_id': universityId,
  })).toString('base64url')
  return `${header}.${payload}.mock-signature`
}

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
    if (query.q) {
      const q = query.q.toLowerCase()
      results = results.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.abbreviation.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q)
      )
    }
    // Support both { items } and flat array consumers
    return jsonResponse(res, 200, { items: results, universities: results, total: results.length })
  }

  // ── GET /universities/:id/residences ──
  const uniResMatch = urlPath.match(/^\/universities\/([^/]+)\/residences$/)
  if (method === 'GET' && uniResMatch) {
    const id = uniResMatch[1]
    const residences = RESIDENCES[id] || []
    const sorted = sortResidences(residences, query.sort)
    return jsonResponse(res, 200, { items: sorted, residences: sorted, total: sorted.length })
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
    let results = getAllResidences().map(r => {
      const uni = UNIVERSITIES.find(u => u.id === r.universityId)
      return { ...r, universityName: uni?.name || '', universityAbbr: uni?.abbreviation || '' }
    })

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

    if (query.province) {
      results = results.filter(r => r.province?.toLowerCase() === query.province.toLowerCase())
    }

    if (query.universityIds) {
      const ids = query.universityIds.split(',').filter(Boolean)
      if (ids.length) results = results.filter(r => ids.includes(r.universityId))
    }

    if (query.minRating) {
      const min = parseFloat(query.minRating)
      if (!isNaN(min) && min > 0) results = results.filter(r => r.avgRating >= min)
    }

    if (query.amenities) {
      const requested = query.amenities.split(',').filter(Boolean).map(a => a.toLowerCase())
      results = results.filter(r =>
        requested.every(req => r.amenities?.some(a => a.toLowerCase().includes(req)))
      )
    }

    if (query.roomType) {
      const types = query.roomType.split(',').filter(Boolean).map(t => t.toLowerCase())
      results = results.filter(r =>
        r.roomTypes?.some(rt => types.some(t => rt.toLowerCase().includes(t)))
      )
    }

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

  // ── GET /users/me/reviews ──
  if (method === 'GET' && urlPath === '/users/me/reviews') {
    return jsonResponse(res, 200, {
      reviews: [
        {
          reviewId: 'my-r1',
          residenceId: 'ukzn-ansell-may',
          residenceName: 'Ansell May Hall',
          universityAbbr: 'UKZN',
          campus: 'Howard College',
          campusType: 'on_campus',
          avgRating: 4.3,
          roomQuality: 4,
          wouldRecommend: true,
          yearLived: '2023',
          comment: 'Great vibes and very close to the Jammie. Would recommend to any first year.',
          createdAt: '2024-03-15T10:00:00Z',
          anonymous: true,
        },
        {
          reviewId: 'my-r2',
          residenceId: 'ukzn-village',
          residenceName: 'The Village Residency',
          universityAbbr: 'UKZN',
          campus: 'Westville',
          campusType: 'off_campus',
          avgRating: 3.8,
          roomQuality: 4,
          wouldRecommend: true,
          yearLived: '2022',
          comment: 'A bit far from the main gate but the rooms are spacious and the shuttle is reliable.',
          createdAt: '2024-01-20T14:00:00Z',
          anonymous: true,
        },
      ],
    })
  }

  // ── GET /residences/:id/reviews ──
  const reviewsMatch = urlPath.match(/^\/residences\/([^/]+)\/reviews$/)
  if (method === 'GET' && reviewsMatch) {
    const reviews = REVIEWS[reviewsMatch[1]] || []
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const start = (page - 1) * limit
    return jsonResponse(res, 200, {
      items: reviews.slice(start, start + limit),
      total: reviews.length,
      page,
      totalPages: Math.ceil(reviews.length / limit),
    })
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
    // Persist in memory for the session
    if (!REVIEWS[postReviewMatch[1]]) REVIEWS[postReviewMatch[1]] = []
    REVIEWS[postReviewMatch[1]].unshift(newReview)
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
    const email = body.email || 'student@ukzn.ac.za'
    return jsonResponse(res, 200, {
      idToken: makeMockJWT(email),
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      email,
      sub: 'mock-user-id',
    })
  }

  // 404
  jsonResponse(res, 404, { error: 'Not found' })
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`\n🎓 RateYourRes mock server running at http://localhost:${PORT}`)
  console.log(`\n  Universities: ${UNIVERSITIES.length}`)
  console.log(`  Residences:   ${Object.values(RESIDENCES).flat().length}`)
  console.log(`  Reviews:      ${Object.values(REVIEWS).flat().length}`)
  console.log('\nEndpoints:')
  console.log('  GET  /universities?province=&city=&q=')
  console.log('  GET  /universities/:id')
  console.log('  GET  /universities/:id/residences?sort=')
  console.log('  GET  /residences/:id')
  console.log('  GET  /residences/search?q=&province=&universityIds=&minRating=&amenities=&roomType=&onCampus=&sort=&page=&limit=')
  console.log('  GET  /residences/:id/reviews?page=&limit=')
  console.log('  POST /residences/:id/reviews')
  console.log('  POST /auth/signup | /auth/verify | /auth/resend | /auth/signin\n')
})
