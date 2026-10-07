// Choosy Master Seed Data
// Matches /supabase/migrations/001_initial_schema.sql

const seedUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo@choosy.ai',
  full_name: 'Manohar (Demo User)',
  tier: 'pro',
  credits_balance: 450
};

const seedPreferences = {
  id: '00000000-0000-0000-0000-000000000002',
  user_id: '00000000-0000-0000-0000-000000000001',
  default_currency: 'INR',
  default_risk_tolerance: 'medium',
  preferred_location: {
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    lat: 16.5062,
    lng: 80.6480
  },
  domain_preferences: {
    shopping: { importance: 'value_and_durability', delivery_urgency: 'medium' },
    travel: { style: 'balanced', budget_pacing: 'planned', safety_priority: 'high' },
    health: { prioritize_distance: true, prefer_verified_fees: true, emergency_access: true },
    technology: { future_proofing: 'high', prefer_warranty: true }
  },
  is_personalization_enabled: true
};

const seedDecisions = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Best Laptop for College, AI & Gaming under ₹1.25L',
    description: 'Evaluation of high-performance laptops balancing local AI experimentation (CUDA/CoreML), gaming, battery life, and campus portability.',
    domain: 'shopping',
    subdomain: 'electronics',
    goal: 'Best laptop for college programming, AI experimentation, and gaming under ₹1,25,000',
    budget: 125000,
    currency: 'INR',
    status: 'ready',
    confidence_score: 92.4,
    robustness_score: 89.0,
    stability_level: 'HIGH',
    winning_alternative_id: '20000000-0000-0000-0000-000000000001',
    runner_up_alternative_id: '20000000-0000-0000-0000-000000000002',
    recommendation_summary: 'Lenovo Legion Pro 5i edges out competitors as the optimal choice. It provides a full-power RTX 4060 GPU with 140W TGP crucial for running 7B parameter LLMs locally via Ollama/PyTorch, while staying comfortably under budget with verified dual-channel RAM expandability.',
    tradeoff_analysis: 'Trade-off: Legion Pro 5i offers top AI/gaming throughput (+26%) but weighs 2.36kg with an average 5.5-hour battery life compared to MacBook Air M3 (18h battery, 1.24kg) which cannot run high-end PC games.',
    risk_summary: 'Key Risk: Battery longevity during 6+ hour college lectures without power outlets requires USB-PD 100W power bank or eco-mode switching.',
    missing_info: [
      { field: 'Long-term thermal degradation data', status: 'estimated_from_benchmarks' },
      { field: 'On-site warranty claim turnaround time', status: 'user_verified' }
    ],
    constraints: [
      { id: 'c1', type: 'hard', criterion: 'Price', operator: '<=', value: 125000, description: 'Maximum ceiling ₹1,25,000' },
      { id: 'c2', type: 'soft', criterion: 'RAM', operator: '>=', value: 16, description: 'Minimum 16GB RAM for AI models' }
    ],
    created_at: new Date('2026-10-01T10:00:00Z').toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Compare Top Dermatologists & Skin Specialists in Vijayawada',
    description: 'Objective comparison of verified dermatology clinics and multi-specialty hospitals near Vijayawada based on distance, verified consultation fee, emergency infrastructure, and patient satisfaction.',
    domain: 'health',
    subdomain: 'dermatology',
    goal: 'Find the most qualified dermatologist in Vijayawada with transparent consultation fees and reasonable distance',
    budget: 1500,
    currency: 'INR',
    status: 'ready',
    confidence_score: 94.0,
    robustness_score: 91.5,
    stability_level: 'HIGH',
    winning_alternative_id: '30000000-0000-0000-0000-000000000001',
    runner_up_alternative_id: '30000000-0000-0000-0000-000000000002',
    recommendation_summary: 'Manipal Hospital Dermatology Wing (Dr. R. K. Varma) ranks highest overall. Offers 24x7 emergency backup, comprehensive dermatopathology diagnostics, transparent ₹800 consultation fee, and 3.4 km proximity to MG Road center.',
    tradeoff_analysis: 'Trade-off: Standalone clinic (Dr. Sudha Skin Clinic) has a lower consultation fee (₹600 vs ₹800) and shorter OPD wait times (20 mins vs 45 mins), but lacks in-house advanced laser dermatosurgery and emergency ward.',
    risk_summary: 'SAFETY NOTICE: Choosy provides verified administrative & operational facts to assist clinic selection. This is NOT medical advice or diagnostic assessment. For acute symptoms, consult an emergency physician immediately.',
    missing_info: [
      { field: 'Real-time today token availability', status: 'telephone_verified' },
      { field: 'Insurance cash-less approval speed', status: 'estimated' }
    ],
    constraints: [
      { id: 'c_fee', type: 'hard', criterion: 'Consultation Fee', operator: '<=', value: 1500, description: 'Maximum OPD fee ₹1,500' },
      { id: 'c_dist', type: 'soft', criterion: 'Distance', operator: '<=', value: 12, description: 'Within 12 km radius of Vijayawada Central' }
    ],
    created_at: new Date('2026-10-02T11:00:00Z').toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: '4-Day Vacation from Vijayawada under ₹30,000 Budget',
    description: 'Comparative evaluation of weekend and short-vacation destinations accessible from Vijayawada via train or short flight, with complete itemized budget allocations.',
    domain: 'travel',
    subdomain: 'vacation',
    goal: 'Plan the most rejuvenating 4-day trip from Vijayawada with total expenditure within ₹30,000',
    budget: 30000,
    currency: 'INR',
    status: 'ready',
    confidence_score: 90.8,
    robustness_score: 88.5,
    stability_level: 'HIGH',
    winning_alternative_id: '40000000-0000-0000-0000-000000000001',
    runner_up_alternative_id: '40000000-0000-0000-0000-000000000003',
    recommendation_summary: 'Araku Valley & Visakhapatnam Coastal Escape wins as the highest-scoring value trip. Direct Vande Bharat / Janmabhoomi Express connection keeps transport at only ₹3,800, leaving ₹12,000 for boutique coffee resort stay and activities while staying ₹5,200 under the ₹30k ceiling.',
    tradeoff_analysis: 'Trade-off: Goa offers vibrant nightlife and beach variety (+18% entertainment), but round-trip travel costs (flight/train) and peak-season hotel rates push total expense to ₹28,900 leaving almost zero contingency buffer.',
    risk_summary: 'Key Risk: Monsoonal or cyclone alerts on the Andhra coast during October-November can affect Borra Caves and ghat road travel.',
    missing_info: [
      { field: 'Dynamic surge taxi fares at Goa airport', status: 'estimated' },
      { field: 'Train ticket tatkal availability', status: 'verified' }
    ],
    constraints: [
      { id: 'tr_b', type: 'hard', criterion: 'Total Budget', operator: '<=', value: 30000, description: 'Strict ceiling ₹30,000 including ₹2,000 buffer' },
      { id: 'tr_d', type: 'hard', criterion: 'Trip Duration', operator: '==', value: 4, description: '4 Days / 3 Nights' }
    ],
    created_at: new Date('2026-10-03T12:00:00Z').toISOString()
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Best All-Round Smartphone Under ₹30,000',
    description: 'Evaluating mid-range smartphones across Camera (OIS sensor), Battery stamina, Chipset sustained performance, Software support, and Display quality.',
    domain: 'shopping',
    subdomain: 'smartphones',
    goal: 'Find the smartphone with best balance of camera, 4-year software longevity, and fast daily performance under ₹30k',
    budget: 30000,
    currency: 'INR',
    status: 'ready',
    confidence_score: 93.5,
    robustness_score: 91.0,
    stability_level: 'HIGH',
    winning_alternative_id: '50000000-0000-0000-0000-000000000001',
    runner_up_alternative_id: '50000000-0000-0000-0000-000000000002',
    recommendation_summary: 'OnePlus Nord 4 takes the crown. Features an all-metal unibody with Snapdragon 7+ Gen 3 (near flagship 1.4M AnTuTu score), 5500mAh battery with 100W charging, and 4 years of guaranteed OS updates at ₹29,999.',
    tradeoff_analysis: 'Trade-off: POCO F6 gives marginally higher raw gaming FPS (+8%) but Nord 4 offers vastly superior battery longevity (1.5 days vs 1 day) and 6 years of software security patches vs 3 years.',
    risk_summary: 'Risk: Metal chassis lacks wireless charging and slightly limits NFC antenna sweet-spot.',
    missing_info: [
      { field: 'Long-term low-light camera portrait blur quality', status: 'verified_by_dxomark' }
    ],
    constraints: [
      { id: 'sp_b', type: 'hard', criterion: 'Price', operator: '<=', value: 30000, description: 'Strict ceiling ₹30,000' }
    ],
    created_at: new Date('2026-10-04T14:00:00Z').toISOString()
  }
];

const seedCriteria = [
  // Laptop Criteria
  { id: '10000000-0000-0000-0000-000000000001', decision_id: '11111111-1111-1111-1111-111111111111', name: 'AI & Compute Performance', description: 'GPU compute power (CUDA cores, Tensor cores, TGP) for model training and inference', weight: 25.0, scale_type: 'higher_is_better', unit: 'TFLOPS / TGP', is_hard_constraint: false, sort_order: 1 },
  { id: '10000000-0000-0000-0000-000000000002', decision_id: '11111111-1111-1111-1111-111111111111', name: 'Price & Value', description: 'Effective market price within ₹1.25L budget with bundle discounts', weight: 20.0, scale_type: 'lower_is_better', unit: 'INR', is_hard_constraint: true, sort_order: 2 },
  { id: '10000000-0000-0000-0000-000000000003', decision_id: '11111111-1111-1111-1111-111111111111', name: 'Battery Life & Portability', description: 'College campus battery endurance under coding/web browsing workloads and weight', weight: 20.0, scale_type: 'higher_is_better', unit: 'Hours', is_hard_constraint: false, sort_order: 3 },
  { id: '10000000-0000-0000-0000-000000000004', decision_id: '11111111-1111-1111-1111-111111111111', name: 'Gaming Capability', description: 'Frame rates on AAA titles at 1440p / 1080p high settings', weight: 15.0, scale_type: 'higher_is_better', unit: 'FPS', is_hard_constraint: false, sort_order: 4 },
  { id: '10000000-0000-0000-0000-000000000005', decision_id: '11111111-1111-1111-1111-111111111111', name: 'Build & Thermal Reliability', description: 'Chassis rigidity, cooling system efficiency, keyboard ergonomics for coding', weight: 10.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 5 },
  { id: '10000000-0000-0000-0000-000000000006', decision_id: '11111111-1111-1111-1111-111111111111', name: 'Upgradability & Long-Term Value', description: 'Upgradable RAM slots, secondary M.2 NVMe SSD slot, 3-year warranty options', weight: 10.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 6 },

  // Healthcare Criteria
  { id: '20000000-1000-0000-0000-000000000001', decision_id: '22222222-2222-2222-2222-222222222222', name: 'Specialty Expertise & Doctor Seniority', description: 'Doctor qualifications (MD/DNB Dermatology, fellowship) and clinical experience years', weight: 30.0, scale_type: 'higher_is_better', unit: 'Years / Rank', is_hard_constraint: false, sort_order: 1 },
  { id: '20000000-1000-0000-0000-000000000002', decision_id: '22222222-2222-2222-2222-222222222222', name: 'Distance & Travel Time from Center', description: 'Proximity from Benz Circle / MG Road Vijayawada in km and estimated traffic minutes', weight: 20.0, scale_type: 'lower_is_better', unit: 'km', is_hard_constraint: false, sort_order: 2 },
  { id: '20000000-1000-0000-0000-000000000003', decision_id: '22222222-2222-2222-2222-222222222222', name: 'Verified Consultation Fee', description: 'Published OPD fee for initial specialist consultation with fee transparency score', weight: 20.0, scale_type: 'lower_is_better', unit: 'INR', is_hard_constraint: true, sort_order: 3 },
  { id: '20000000-1000-0000-0000-000000000004', decision_id: '22222222-2222-2222-2222-222222222222', name: 'Patient Satisfaction & Hygiene Rating', description: 'Aggregated verified patient reviews, clinic hygiene, and staff courteousness', weight: 15.0, scale_type: 'higher_is_better', unit: 'Stars / 5', is_hard_constraint: false, sort_order: 4 },
  { id: '20000000-1000-0000-0000-000000000005', decision_id: '22222222-2222-2222-2222-222222222222', name: 'Facility Infrastructure & Emergency Care', description: 'Diagnostic lab in-house, pharmacy, minor OT, and 24x7 emergency backup', weight: 15.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 5 },

  // Travel Criteria
  { id: '30000000-2000-0000-0000-000000000001', decision_id: '33333333-3333-3333-3333-333333333333', name: 'Budget Efficiency & Cost Buffer', description: 'Total expense relative to ₹30,000 with emergency buffer preserved', weight: 25.0, scale_type: 'lower_is_better', unit: 'INR', is_hard_constraint: true, sort_order: 1 },
  { id: '30000000-2000-0000-0000-000000000002', decision_id: '33333333-3333-3333-3333-333333333333', name: 'Travel Convenience & Transit Time', description: 'Direct transit options from Vijayawada (train/direct flight) avoiding fatigue', weight: 20.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 2 },
  { id: '30000000-2000-0000-0000-000000000003', decision_id: '33333333-3333-3333-3333-333333333333', name: 'Scenery & Experiential Quality', description: 'Natural landscape, sightseeing quality, climate, and cultural uniqueness', weight: 20.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 3 },
  { id: '30000000-2000-0000-0000-000000000004', decision_id: '33333333-3333-3333-3333-333333333333', name: 'Accommodation & Culinary Quality', description: 'Quality of 3-star/boutique resort stays and local culinary experiences', weight: 20.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 4 },
  { id: '30000000-2000-0000-0000-000000000005', decision_id: '33333333-3333-3333-3333-333333333333', name: 'Safety & Weather Reliability', description: 'Moderate temperature, low crime risk, and stable road transit', weight: 15.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 5 },

  // Smartphone Criteria
  { id: '40000000-3000-0000-0000-000000000001', decision_id: '44444444-4444-4444-4444-444444444444', name: 'Camera Quality & OIS Stabilization', description: 'Sony LYT/IMX primary sensor with OIS, 4K video, low-light image processing', weight: 25.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 1 },
  { id: '40000000-3000-0000-0000-000000000002', decision_id: '44444444-4444-4444-4444-444444444444', name: 'Battery Endurance & Charging Speed', description: 'Battery capacity (mAh) + charging wattage (W) + screen-on-time endurance', weight: 25.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 2 },
  { id: '40000000-3000-0000-0000-000000000003', decision_id: '44444444-4444-4444-4444-444444444444', name: 'Processor Performance & Thermals', description: 'Snapdragon/Dimensity 4nm chip with sustained performance without throttling', weight: 20.0, scale_type: 'higher_is_better', unit: 'AnTuTu / Score', is_hard_constraint: false, sort_order: 3 },
  { id: '40000000-3000-0000-0000-000000000004', decision_id: '44444444-4444-4444-4444-444444444444', name: 'Software Support & UI Cleanliness', description: 'Number of promised Android OS upgrades and absence of aggressive bloatware', weight: 15.0, scale_type: 'higher_is_better', unit: 'Years Support', is_hard_constraint: false, sort_order: 4 },
  { id: '40000000-3000-0000-0000-000000000005', decision_id: '44444444-4444-4444-4444-444444444444', name: 'Display & Build Quality', description: '120Hz 1.5K AMOLED panel, peak nit brightness, IP rating for water/dust protection', weight: 15.0, scale_type: 'higher_is_better', unit: 'Score /10', is_hard_constraint: false, sort_order: 5 }
];

const seedAlternatives = [
  // Laptop Alternatives
  {
    id: '20000000-0000-0000-0000-000000000001',
    decision_id: '11111111-1111-1111-1111-111111111111',
    title: 'Lenovo Legion Pro 5i (Core i7-14650HX, RTX 4060 140W)',
    description: '16" WQXGA 240Hz 500 nits, 16GB DDR5 (expandable to 64GB), 1TB Gen4 SSD, ColdFront 5.0 thermals.',
    price: 119990,
    currency: 'INR',
    overall_score: 88.6,
    normalized_score: 88.6,
    rank: 1,
    source_type: 'verified_feed',
    primary_url: 'https://www.lenovo.com/in/en/laptops/legion-laptops/legion-5-series/legion-pro-5i-gen-9',
    availability_status: 'available',
    specs: {
      cpu: 'Intel Core i7-14650HX (16 cores)',
      gpu: 'NVIDIA RTX 4060 8GB GDDR6 (140W TGP)',
      ram: '16GB DDR5 5600MHz (2x SODIMM Slots)',
      storage: '1TB NVMe PCIe 4.0 SSD',
      display: '16-inch 2560x1600 240Hz 500 nits IPS',
      weight: '2.36 kg',
      battery: '80Whr (5.5 hrs)'
    },
    rating: 4.7,
    review_count: 1420
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    decision_id: '11111111-1111-1111-1111-111111111111',
    title: 'ASUS ROG Zephyrus G14 (Ryzen 7 8845HS, RTX 4060 90W)',
    description: '14" 3K OLED 120Hz, 16GB LPDDR5X, 1TB SSD, Premium CNC aluminum chassis, ultraportable 1.5kg.',
    price: 124990,
    currency: 'INR',
    overall_score: 84.8,
    normalized_score: 84.8,
    rank: 2,
    source_type: 'verified_feed',
    primary_url: 'https://rog.asus.com/in/laptops/rog-zephyrus/rog-zephyrus-g14-2024/',
    availability_status: 'available',
    specs: {
      cpu: 'AMD Ryzen 7 8845HS with NPU (Ryzen AI)',
      gpu: 'NVIDIA RTX 4060 8GB (90W TGP)',
      ram: '16GB LPDDR5X (Soldered)',
      storage: '1TB NVMe SSD',
      display: '14-inch 2.8K 120Hz OLED 0.2ms',
      weight: '1.50 kg',
      battery: '73Whr (8.5 hrs)'
    },
    rating: 4.6,
    review_count: 890
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    decision_id: '11111111-1111-1111-1111-111111111111',
    title: 'Apple MacBook Air 15" M3 (16GB Unified Memory, 512GB SSD)',
    description: '15.3" Liquid Retina, 8-core CPU, 10-core GPU, 16-core Neural Engine, silent fanless design, up to 18h battery.',
    price: 124900,
    currency: 'INR',
    overall_score: 79.2,
    normalized_score: 79.2,
    rank: 3,
    source_type: 'verified_feed',
    primary_url: 'https://www.apple.com/in/macbook-air/',
    availability_status: 'available',
    specs: {
      cpu: 'Apple M3 (8-core CPU)',
      gpu: '10-core GPU with Hardware Ray Tracing',
      ram: '16GB Unified Memory',
      storage: '512GB SSD',
      display: '15.3-inch Retina 500 nits True Tone',
      weight: '1.51 kg',
      battery: '66.5Whr (17.5 hrs)',
      os: 'macOS Sonoma'
    },
    rating: 4.8,
    review_count: 3200
  },
  {
    id: '20000000-0000-0000-0000-000000000004',
    decision_id: '11111111-1111-1111-1111-111111111111',
    title: 'Acer Predator Helios Neo 16 (Core i7-14700HX, RTX 4060 140W)',
    description: '16" WQXGA 165Hz IPS, 16GB DDR5, 1TB SSD, 5th Gen AeroBlade 3D metal fans.',
    price: 109990,
    currency: 'INR',
    overall_score: 81.5,
    normalized_score: 81.5,
    rank: 4,
    source_type: 'verified_feed',
    primary_url: 'https://store.acer.com/en-in/predator-helios-neo-16',
    availability_status: 'available',
    specs: {
      cpu: 'Intel Core i7-14700HX (20 cores)',
      gpu: 'NVIDIA RTX 4060 8GB (140W TGP)',
      ram: '16GB DDR5 5600MHz',
      storage: '1TB NVMe SSD',
      display: '16-inch 2560x1600 165Hz 100% sRGB',
      weight: '2.60 kg',
      battery: '90Whr (4.5 hrs)'
    },
    rating: 4.4,
    review_count: 650
  },

  // Healthcare Alternatives
  {
    id: '30000000-0000-0000-0000-000000000001',
    decision_id: '22222222-2222-2222-2222-222222222222',
    title: 'Manipal Hospitals — Department of Dermatology',
    description: 'NABH accredited tertiary hospital. Senior consultant Dr. R. K. Varma (MD, DNB, 18 yrs exp). Comprehensive clinical & cosmetic dermatology.',
    price: 800,
    currency: 'INR',
    overall_score: 91.2,
    normalized_score: 91.2,
    rank: 1,
    source_type: 'verified_feed',
    primary_url: 'https://www.manipalhospitals.com/vijayawada/',
    availability_status: 'appointments_available',
    location_info: {
      address: 'Near Benz Circle, Tadepalli / Vijayawada Bypass',
      city: 'Vijayawada',
      lat: 16.4862,
      lng: 80.6120,
      distance_km: 3.8,
      travel_time_mins: 11
    },
    specs: {
      specialist: 'Dr. R. K. Varma, MD, DNB (Derm)',
      experience_years: 18,
      facility_type: 'Super Specialty Hospital',
      emergency_available: true
    },
    contact_info: {
      phone: '+91 866 667 7777',
      hours: 'OPD: Mon-Sat 09:00 AM - 05:00 PM; Emergency 24x7',
      emergency_contact: '1057 / +91 866 249 9999'
    },
    rating: 4.7,
    review_count: 840
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    decision_id: '22222222-2222-2222-2222-222222222222',
    title: "Dr. Sudha's Skin & Cosmetology Centre",
    description: 'Dedicated private dermatology clinic. Dr. P. Sudha (MBBS, MD Dermatology - AIIMS gold medalist, 14 yrs exp).',
    price: 600,
    currency: 'INR',
    overall_score: 87.5,
    normalized_score: 87.5,
    rank: 2,
    source_type: 'verified_feed',
    primary_url: 'https://drsudhaskinclinic.com',
    availability_status: 'appointments_available',
    location_info: {
      address: 'Near DV Manor, MG Road, Suryaraopet',
      city: 'Vijayawada',
      lat: 16.5090,
      lng: 80.6472,
      distance_km: 1.2,
      travel_time_mins: 4
    },
    specs: {
      specialist: 'Dr. P. Sudha, MD (AIIMS)',
      experience_years: 14,
      facility_type: 'Specialty Skin Clinic',
      emergency_available: false
    },
    contact_info: {
      phone: '+91 866 257 4411',
      hours: 'Mon-Sat: 10:00 AM - 02:00 PM, 05:00 PM - 08:30 PM',
      emergency_contact: 'None (OPD only)'
    },
    rating: 4.8,
    review_count: 620
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    decision_id: '22222222-2222-2222-2222-222222222222',
    title: 'Ramesh Hospitals — Skin & Aesthetics Unit',
    description: 'Renowned multi-specialty healthcare facility. Dr. K. Naveen (MD, 12 yrs exp). Full medical phototherapy unit.',
    price: 750,
    currency: 'INR',
    overall_score: 85.0,
    normalized_score: 85.0,
    rank: 3,
    source_type: 'verified_feed',
    primary_url: 'https://rameshhospitals.com/vijayawada',
    availability_status: 'appointments_available',
    location_info: {
      address: 'Collector Office Road, Nagarampalem / Vijayawada',
      city: 'Vijayawada',
      lat: 16.5140,
      lng: 80.6550,
      distance_km: 2.5,
      travel_time_mins: 8
    },
    specs: {
      specialist: 'Dr. K. Naveen, MD',
      experience_years: 12,
      facility_type: 'Multi-Specialty Hospital',
      emergency_available: true
    },
    contact_info: {
      phone: '+91 866 248 8888',
      hours: 'Mon-Sat: 09:30 AM - 04:30 PM',
      emergency_contact: '+91 866 248 8800'
    },
    rating: 4.5,
    review_count: 510
  },
  {
    id: '30000000-0000-0000-0000-000000000004',
    decision_id: '22222222-2222-2222-2222-222222222222',
    title: 'Skin Care Laser Clinic (Eluru Road)',
    description: 'Independent laser & aesthetic dermatology center. Dr. M. Srinivas (DNB). Consultation fee ₹500.',
    price: 500,
    currency: 'INR',
    overall_score: 78.3,
    normalized_score: 78.3,
    rank: 4,
    source_type: 'verified_feed',
    primary_url: 'https://vijayawadaskincare.in',
    availability_status: 'limited_stock',
    location_info: {
      address: 'Opp Old Bus Stand, Eluru Road',
      city: 'Vijayawada',
      lat: 16.5180,
      lng: 80.6320,
      distance_km: 3.1,
      travel_time_mins: 10
    },
    specs: {
      specialist: 'Dr. M. Srinivas, DNB',
      experience_years: 9,
      facility_type: 'Private Clinic',
      emergency_available: false
    },
    contact_info: {
      phone: '+91 866 242 1200',
      hours: 'Mon-Sat: 11:00 AM - 01:30 PM, 06:00 PM - 09:00 PM',
      emergency_contact: 'None'
    },
    rating: 4.3,
    review_count: 290
  },

  // Travel Alternatives
  {
    id: '40000000-0000-0000-0000-000000000001',
    decision_id: '33333333-3333-3333-3333-333333333333',
    title: 'Araku Valley & Vizag Coastal Gateway (4 Days / 3 Nights)',
    description: 'Scenic coffee plantations, Borra Caves, Katiki waterfalls, and Rushikonda beach. Direct high-speed Vande Bharat train from Vijayawada.',
    price: 24800,
    currency: 'INR',
    overall_score: 90.4,
    normalized_score: 90.4,
    rank: 1,
    source_type: 'verified_feed',
    primary_url: 'https://tourism.ap.gov.in',
    availability_status: 'available',
    location_info: {
      origin: 'Vijayawada Junction',
      destination: 'Araku / Visakhapatnam',
      transit_mode: 'Train (Vande Bharat / Janmabhoomi)',
      transit_time_hrs: 4.5
    },
    specs: {
      budget_breakdown: {
        transport: 4200,
        hotel: 9600,
        food: 4800,
        activities: 3400,
        local_transit: 2800,
        contingency_buffer: 2000,
        total: 24800
      },
      weather: 'Pleasant 19-27°C, morning mist',
      hotel_type: 'APTDC Haritha Hill Resort / 3-Star Boutique'
    },
    rating: 4.7,
    review_count: 1890
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    decision_id: '33333333-3333-3333-3333-333333333333',
    title: 'Goa Beach & Heritage Retreat (4 Days / 3 Nights)',
    description: 'North/South Goa beaches, Portuguese architecture in Fontainhas, sunset river cruise, seafood exploration.',
    price: 28900,
    currency: 'INR',
    overall_score: 83.6,
    normalized_score: 83.6,
    rank: 2,
    source_type: 'verified_feed',
    primary_url: 'https://goa-tourism.com',
    availability_status: 'limited_stock',
    location_info: {
      origin: 'Vijayawada (VGA)',
      destination: 'Goa (GOI/GOX)',
      transit_mode: 'Amaravati Express Train / Flight',
      transit_time_hrs: 7.5
    },
    specs: {
      budget_breakdown: {
        transport: 9800,
        hotel: 9900,
        food: 5200,
        activities: 2500,
        local_transit: 1500,
        contingency_buffer: 500,
        total: 28900
      },
      weather: 'Tropical 24-32°C, sunny coastal',
      hotel_type: 'Boutique Heritage Villa, Candolim'
    },
    rating: 4.6,
    review_count: 3400
  },
  {
    id: '40000000-0000-0000-0000-000000000003',
    decision_id: '33333333-3333-3333-3333-333333333333',
    title: 'Pondicherry & French Quarter Cultural Tour (4 Days / 3 Nights)',
    description: 'Cobblestone French streets, Promenade Beach, Auroville Matrimandir, cycling tours and French-Tamil fusion cuisine.',
    price: 26400,
    currency: 'INR',
    overall_score: 85.2,
    normalized_score: 85.2,
    rank: 3,
    source_type: 'verified_feed',
    primary_url: 'https://pondytourism.in',
    availability_status: 'available',
    location_info: {
      origin: 'Vijayawada Junction',
      destination: 'Puducherry',
      transit_mode: 'Circar Express / Overnight AC Bus',
      transit_time_hrs: 11.0
    },
    specs: {
      budget_breakdown: {
        transport: 5400,
        hotel: 10500,
        food: 5500,
        activities: 2600,
        local_transit: 1400,
        contingency_buffer: 1000,
        total: 26400
      },
      weather: 'Breezy 26-30°C coastal',
      hotel_type: 'Heritage French Haveli Hotel'
    },
    rating: 4.5,
    review_count: 2150
  },
  {
    id: '40000000-0000-0000-0000-000000000004',
    decision_id: '33333333-3333-3333-3333-333333333333',
    title: 'Ooty & Nilgiri Toy Train Mountain Getaway (4 Days / 3 Nights)',
    description: 'Nilgiri Mountain Railway (UNESCO), tea gardens of Coonoor, Doddabetta Peak, botanical gardens.',
    price: 29800,
    currency: 'INR',
    overall_score: 81.1,
    normalized_score: 81.1,
    rank: 4,
    source_type: 'verified_feed',
    primary_url: 'https://www.tamilnadutourism.tn.gov.in',
    availability_status: 'available',
    location_info: {
      origin: 'Vijayawada',
      destination: 'Coimbatore to Ooty Ghat',
      transit_mode: 'Train to Coimbatore + Mountain Taxi',
      transit_time_hrs: 14.0
    },
    specs: {
      budget_breakdown: {
        transport: 8800,
        hotel: 11200,
        food: 5000,
        activities: 2800,
        local_transit: 2000,
        contingency_buffer: 0,
        total: 29800
      },
      weather: 'Chilly 12-20°C, woolens required',
      hotel_type: 'Colonial Mountain Resort'
    },
    rating: 4.4,
    review_count: 1670
  },

  // Smartphone Alternatives
  {
    id: '50000000-0000-0000-0000-000000000001',
    decision_id: '44444444-4444-4444-4444-444444444444',
    title: 'OnePlus Nord 4 5G (8GB / 256GB)',
    description: 'All-metal unibody design. Snapdragon 7+ Gen 3, 50MP Sony LYT-600 with OIS, 5500mAh battery + 100W SUPERVOOC. 4 OS upgrades + 6 yrs security.',
    price: 29999,
    currency: 'INR',
    overall_score: 91.8,
    normalized_score: 91.8,
    rank: 1,
    source_type: 'verified_feed',
    primary_url: 'https://www.oneplus.in/nord-4',
    availability_status: 'available',
    specs: {
      soc: 'Snapdragon 7+ Gen 3 (4nm)',
      antutu: '1,410,000',
      battery: '5500 mAh (100W wired)',
      camera: '50MP OIS Sony LYT-600 + 8MP Ultra-wide',
      display: '6.74-inch 1.5K 120Hz AMOLED 2150 nits',
      software_updates: '4 Android + 6 Security'
    },
    rating: 4.7,
    review_count: 4120
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    decision_id: '44444444-4444-4444-4444-444444444444',
    title: 'POCO F6 5G (8GB / 256GB)',
    description: 'Snapdragon 8s Gen 3 flagship-tier silicon, 50MP Sony IMX882 OIS, 5000mAh battery with 90W turbo charge.',
    price: 27999,
    currency: 'INR',
    overall_score: 86.4,
    normalized_score: 86.4,
    rank: 2,
    source_type: 'verified_feed',
    primary_url: 'https://www.poco.in/poco-f6',
    availability_status: 'available',
    specs: {
      soc: 'Snapdragon 8s Gen 3 (4nm)',
      antutu: '1,530,000',
      battery: '5000 mAh (90W wired)',
      camera: '50MP OIS Sony IMX882',
      display: '6.67-inch 1.5K 120Hz AMOLED 2400 nits',
      software_updates: '3 Android + 4 Security'
    },
    rating: 4.5,
    review_count: 3180
  },
  {
    id: '50000000-0000-0000-0000-000000000003',
    decision_id: '44444444-4444-4444-4444-444444444444',
    title: 'Motorola Edge 50 Fusion (12GB / 256GB)',
    description: 'Symmetrical curved 144Hz pOLED, Sony LYT-700C OIS sensor, IP68 underwater protection, vegan leather back.',
    price: 24999,
    currency: 'INR',
    overall_score: 85.7,
    normalized_score: 85.7,
    rank: 3,
    source_type: 'verified_feed',
    primary_url: 'https://www.motorola.in/smartphones-motorola-edge-50-fusion',
    availability_status: 'available',
    specs: {
      soc: 'Snapdragon 7s Gen 2 (4nm)',
      antutu: '620,000',
      battery: '5000 mAh (68W TurboPower)',
      camera: '50MP OIS Sony LYT-700C + 13MP Macro/UW',
      display: '6.7-inch FHD+ 144Hz curved pOLED',
      ip_rating: 'IP68'
    },
    rating: 4.6,
    review_count: 2890
  },
  {
    id: '50000000-0000-0000-0000-000000000004',
    decision_id: '44444444-4444-4444-4444-444444444444',
    title: 'Samsung Galaxy A35 5G (8GB / 128GB)',
    description: 'Exynos 1380, Super AMOLED 120Hz with Vision Booster, IP67 rating, Samsung Knox Vault, 4 OS upgrades.',
    price: 28999,
    currency: 'INR',
    overall_score: 79.9,
    normalized_score: 79.9,
    rank: 4,
    source_type: 'verified_feed',
    primary_url: 'https://www.samsung.com/in/smartphones/galaxy-a/galaxy-a35-5g',
    availability_status: 'available',
    specs: {
      soc: 'Exynos 1380 (5nm)',
      antutu: '590,000',
      battery: '5000 mAh (25W wired, charger not in box)',
      camera: '50MP OIS + 8MP UW + 5MP Macro',
      display: '6.6-inch FHD+ Super AMOLED 120Hz',
      software_updates: '4 Android + 5 Security'
    },
    rating: 4.3,
    review_count: 1920
  }
];

const seedEvidence = [
  {
    id: 'e1',
    decision_id: '11111111-1111-1111-1111-111111111111',
    alternative_id: '20000000-0000-0000-0000-000000000001',
    criterion_id: '10000000-0000-0000-0000-000000000001',
    claim: 'RTX 4060 delivers 140W max TGP with full CUDA & Tensor Core access for PyTorch 2.4 and TensorRT LLM execution',
    source_name: 'Official Manufacturer Specification',
    source_url: 'https://psref.lenovo.com',
    provider: 'retail_api',
    verification_status: 'verified',
    confidence: 99,
    retrieved_at: '2026-10-07T09:15:00Z',
    data_timestamp: '2026-10-07T00:00:00Z',
    raw_snippet: 'TGP 140W, Boost Clock 2370MHz, MUX Switch + NVIDIA Advanced Optimus'
  },
  {
    id: 'e2',
    decision_id: '11111111-1111-1111-1111-111111111111',
    alternative_id: '20000000-0000-0000-0000-000000000001',
    criterion_id: '10000000-0000-0000-0000-000000000002',
    claim: 'Market price verified at ₹1,19,990 across major Indian authorized e-commerce partners as of current week',
    source_name: 'Authorized Retail Store Verification',
    source_url: 'https://www.lenovo.com/in',
    provider: 'retail_api',
    verification_status: 'verified',
    confidence: 96,
    retrieved_at: '2026-10-07T08:30:00Z',
    data_timestamp: '2026-10-07T00:00:00Z',
    raw_snippet: 'Price ₹1,19,990 inclusive of all taxes, free 3-year ADP bundle promo'
  },
  {
    id: 'e3',
    decision_id: '11111111-1111-1111-1111-111111111111',
    alternative_id: '20000000-0000-0000-0000-000000000003',
    criterion_id: '10000000-0000-0000-0000-000000000003',
    claim: 'Real-world college coding battery test averages 5 hours 28 minutes on hybrid GPU mode',
    source_name: 'Independent Lab Hardware Review',
    source_url: 'https://notebookcheck.net',
    provider: 'web_review',
    verification_status: 'verified',
    confidence: 91,
    retrieved_at: '2026-10-06T14:20:00Z',
    data_timestamp: '2026-10-06T00:00:00Z',
    raw_snippet: 'WiFi script at 150 nits measured 332 minutes; heavy compile scripts reduce to ~2.5 hours'
  },
  {
    id: 'e4',
    decision_id: '22222222-2222-2222-2222-222222222222',
    alternative_id: '30000000-0000-0000-0000-000000000001',
    criterion_id: '20000000-1000-0000-0000-000000000003',
    claim: 'Consultation fee verified as ₹800 at hospital billing counter & official portal',
    source_name: 'Manipal Hospitals Reception Desk & Tariff Schedule',
    source_url: 'https://www.manipalhospitals.com',
    provider: 'provider_direct',
    verification_status: 'verified',
    confidence: 99,
    retrieved_at: '2026-10-07T11:00:00Z',
    data_timestamp: '2026-10-07T00:00:00Z',
    raw_snippet: 'Super Specialty OPD tariff: General ₹800, validity 7 days for follow up'
  },
  {
    id: 'e5',
    decision_id: '22222222-2222-2222-2222-222222222222',
    alternative_id: '30000000-0000-0000-0000-000000000002',
    criterion_id: '20000000-1000-0000-0000-000000000003',
    claim: 'Consultation fee is ₹600 for first visit, ₹400 for re-visit within 14 days',
    source_name: 'Dr. Sudha Clinic Front Desk Verification',
    source_url: 'https://drsudhaskinclinic.com',
    provider: 'telephone_verified',
    verification_status: 'verified',
    confidence: 97,
    retrieved_at: '2026-10-07T10:45:00Z',
    data_timestamp: '2026-10-07T00:00:00Z',
    raw_snippet: 'OPD consultation ₹600, token system prior appointment needed'
  }
];

const seedReviewInsights = [
  {
    alternative_id: '20000000-0000-0000-0000-000000000001',
    overall_rating: 4.7,
    review_count: 1420,
    positive_themes: [
      'Thermals stay under 78°C during heavy CUDA inference',
      'Keyboard tactile response is exceptional for long coding sessions',
      'Bright 500 nits matte display avoids classroom glare'
    ],
    negative_themes: [
      'Power brick weighs 860g making the travel pack heavy',
      'Speakers are average for media playback'
    ],
    recurring_issues: [
      'Factory Vantage software requires initial clean setup',
      'Battery life drops fast if dGPU remains active in background'
    ],
    review_confidence: 'high',
    sample_quotes: [
      'Trained a LoRA adapter on RTX 4060 without any throttling. Quiet fans compared to last gen.',
      'Best college purchase if you prioritize engineering horsepower over ultra-lightweight portability.'
    ]
  },
  {
    alternative_id: '30000000-0000-0000-0000-000000000001',
    overall_rating: 4.7,
    review_count: 840,
    positive_themes: [
      'Prompt diagnostic biopsy and dermatopathology support',
      'Doctor patiently explained skin barrier restoration routine',
      '24x7 pharmacy inside hospital premises'
    ],
    negative_themes: [
      'OPD waiting time can extend up to 45 minutes on Saturdays',
      'Parking gets crowded during peak hours'
    ],
    recurring_issues: [
      'Prior appointment booking recommended to avoid queue'
    ],
    review_confidence: 'high',
    sample_quotes: [
      'Dr. Varma accurately diagnosed my persistent contact dermatitis. Excellent tertiary care setup.'
    ]
  }
];

const seedScenarios = [
  {
    id: 's1',
    decision_id: '11111111-1111-1111-1111-111111111111',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Campus Mobility First (Portability 40%)',
    description: 'Simulates a scenario where daily campus commuting without charging plugs becomes the paramount factor.',
    parameters: {
      weight_overrides: {
        'Battery Life & Portability': 40.0,
        'AI & Compute Performance': 15.0
      }
    },
    winner_id: '20000000-0000-0000-0000-000000000002',
    previous_winner_id: '20000000-0000-0000-0000-000000000001',
    winner_changed: true,
    score_delta: 4.2,
    explanation: 'Under this scenario, ASUS ROG Zephyrus G14 overtakes Legion Pro 5i due to its 1.5kg chassis and 8.5-hour endurance, though AI compute is reduced by 22%.'
  },
  {
    id: 's2',
    decision_id: '33333333-3333-3333-3333-333333333333',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Budget Constrained to ₹25,000',
    description: 'Simulates a ₹5,000 reduction in vacation budget.',
    parameters: {
      budget_override: 25000
    },
    winner_id: '40000000-0000-0000-0000-000000000001',
    previous_winner_id: '40000000-0000-0000-0000-000000000001',
    winner_changed: false,
    score_delta: 0.0,
    explanation: 'Araku Valley remains the sole viable contender at ₹24,800. Goa (₹28.9k) and Ooty (₹29.8k) are disqualified by the hard budget constraint.'
  }
];

const seedAlerts = [
  {
    id: 'a1',
    decision_id: '11111111-1111-1111-1111-111111111111',
    alternative_id: '20000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000001',
    alert_type: 'price_drop',
    target_field: 'price',
    condition_op: 'less_than',
    threshold_value: '115000',
    frequency: 'daily',
    is_enabled: true,
    created_at: new Date('2026-10-05T08:00:00Z').toISOString()
  }
];

const seedCreditsLedger = [
  {
    id: 'cl1',
    user_id: '00000000-0000-0000-0000-000000000001',
    operation: 'signup_grant',
    amount: 500,
    balance_after: 500,
    metadata: { reason: 'Initial platform welcome credit allocation' },
    created_at: new Date('2026-10-01T00:00:00Z').toISOString()
  },
  {
    id: 'cl2',
    user_id: '00000000-0000-0000-0000-000000000001',
    operation: 'deep_analysis',
    amount: -25,
    balance_after: 475,
    metadata: { decision: 'Laptop evaluation' },
    created_at: new Date('2026-10-01T10:15:00Z').toISOString()
  },
  {
    id: 'cl3',
    user_id: '00000000-0000-0000-0000-000000000001',
    operation: 'analyze_reviews',
    amount: -25,
    balance_after: 450,
    metadata: { decision: 'Healthcare comparison' },
    created_at: new Date('2026-10-02T11:20:00Z').toISOString()
  }
];

module.exports = {
  seedUser,
  seedPreferences,
  seedDecisions,
  seedCriteria,
  seedAlternatives,
  seedEvidence,
  seedReviewInsights,
  seedScenarios,
  seedAlerts,
  seedCreditsLedger
};
