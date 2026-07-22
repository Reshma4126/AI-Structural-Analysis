export const currentUser = {
  name: 'Eleanor Vance',
  role: 'Principal Structural Engineer',
  email: 'e.vance@precisionlabs.ai',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  company: 'Precision Structural Labs',
  license: 'PE #884920-CA',
};

export const initialProjects = [
  {
    id: 'PRJ-2026-001',
    name: 'Hudson Yards Tower A',
    type: 'High-Rise Steel Core',
    status: 'In Review',
    healthScore: 94,
    beamsCount: 42,
    location: 'New York, NY',
    lastModified: '2026-07-20 14:32',
    author: 'Eleanor Vance',
    code: 'AISC 360-16 LRFD',
    safetyFactor: 1.48,
    weightSavings: '12.4%',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    description: 'Primary structural optimization for transfer girders and perimeter cantilever beams.',
  },
  {
    id: 'PRJ-2026-002',
    name: 'Golden Gate Retrofit',
    type: 'Bridge Deck Expansion',
    status: 'Approved',
    healthScore: 98,
    beamsCount: 128,
    location: 'San Francisco, CA',
    lastModified: '2026-07-19 09:15',
    author: 'Marcus Chen',
    code: 'AASHTO LRFD-9',
    safetyFactor: 1.65,
    weightSavings: '18.1%',
    thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&auto=format&fit=crop&q=80',
    description: 'Dynamic seismic re-evaluation of stiffening trusses under lateral loading scenarios.',
  },
  {
    id: 'PRJ-2026-003',
    name: 'Marina Bay Sands Expansion',
    type: 'Long-Span Roof Truss',
    status: 'AI Optimized',
    healthScore: 91,
    beamsCount: 64,
    location: 'Singapore',
    lastModified: '2026-07-18 16:45',
    author: 'Eleanor Vance',
    code: 'Eurocode 3 (EN 1993)',
    safetyFactor: 1.38,
    weightSavings: '24.7%',
    thumbnail: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&auto=format&fit=crop&q=80',
    description: 'AI recommendation engine applied for weight reduction on 45m canopy steel arches.',
  },
  {
    id: 'PRJ-2026-004',
    name: 'Berlin Central Station Concourse',
    type: 'Commercial Atrium',
    status: 'Draft',
    healthScore: 86,
    beamsCount: 38,
    location: 'Berlin, Germany',
    lastModified: '2026-07-15 11:20',
    author: 'Sophie Muller',
    code: 'Eurocode 3',
    safetyFactor: 1.29,
    weightSavings: '8.5%',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=400&auto=format&fit=crop&q=80',
    description: 'Pedestrian walkway glass support beams with combined torsional & flexural checks.',
  }
];

export const sampleBeamCalculations = {
  id: 'BM-2026-884',
  name: 'Beam B-104 (Transfer Girder)',
  projectId: 'PRJ-2026-001',
  standard: 'AISC 360-16 LRFD',
  steelGrade: 'ASTM A992 (Fy = 50 ksi)',
  spanLength: 12.5, // meters
  deadLoad: 35.0, // kN/m
  liveLoad: 45.0, // kN/m
  pointLoad: 120.0, // kN at 6.25m
  currentProfile: 'W24x76',
  recommendedProfile: 'W21x62',
  geometry: {
    depth: 540, // mm
    width: 230, // mm
    webThickness: 11.2, // mm
    flangeThickness: 17.3, // mm
  },
  structuralResults: {
    maxBendingMoment: 612.4, // kN·m
    momentCapacity: 742.0, // kN·m
    maxShearForce: 245.8, // kN
    shearCapacity: 310.5, // kN
    maxDeflection: 24.2, // mm
    deflectionLimit: 34.7, // mm (L/360)
    flexuralRatio: 0.825,
    shearRatio: 0.792,
    deflectionRatio: 0.697,
    overallSafetyFactor: 1.48,
    healthScore: 94,
    status: 'PASSED',
  },
  shapValues: [
    { feature: 'Span Length (L)', impact: +0.32, category: 'Geometry' },
    { feature: 'Distributed Live Load (Wl)', impact: +0.28, category: 'Load' },
    { feature: 'Steel Yield Strength (Fy)', impact: -0.21, category: 'Material' },
    { feature: 'Flange Thickness (tf)', impact: -0.19, category: 'Geometry' },
    { feature: 'Beam Depth (d)', impact: -0.15, category: 'Geometry' },
    { feature: 'Point Load (P)', impact: +0.11, category: 'Load' },
    { feature: 'Elastic Modulus (E)', impact: -0.04, category: 'Material' },
  ],
  sensitivityData: {
    depthVariation: [
      { depth: 450, safetyFactor: 1.05, weight: 68.2, stress: 94.2 },
      { depth: 480, safetyFactor: 1.18, weight: 72.5, stress: 84.7 },
      { depth: 510, safetyFactor: 1.32, weight: 77.0, stress: 75.8 },
      { depth: 540, safetyFactor: 1.48, weight: 81.4, stress: 67.5 },
      { depth: 570, safetyFactor: 1.65, weight: 86.1, stress: 60.6 },
      { depth: 600, safetyFactor: 1.82, weight: 91.0, stress: 54.9 },
    ]
  },
  aiRecommendations: [
    {
      profile: 'W21x62',
      weightKgPerM: 92.3,
      depthMm: 533,
      safetyFactor: 1.41,
      weightSavingPercent: 18.4,
      costReductionUSD: 2450,
      carbonReductionKg: 1840,
      status: 'HIGHLY RECOMMENDED',
      reasoning: 'Reduces section depth while optimizing plastic section modulus (Zx) near capacity limit.',
    },
    {
      profile: 'W24x68',
      weightKgPerM: 101.2,
      depthMm: 603,
      safetyFactor: 1.56,
      weightSavingPercent: 10.5,
      costReductionUSD: 1400,
      carbonReductionKg: 1050,
      status: 'MODERATE SAVINGS',
      reasoning: 'Provides higher flexural stiffness with lower lateral-torsional buckling susceptibility.',
    },
    {
      profile: 'IPE 500 (Custom)',
      weightKgPerM: 107.0,
      depthMm: 500,
      safetyFactor: 1.35,
      weightSavingPercent: 5.2,
      costReductionUSD: 700,
      carbonReductionKg: 520,
      status: 'ALTERNATIVE',
      reasoning: 'Eurocode alternative section matching minimum headroom constraint.',
    }
  ]
};

export const notificationsList = [
  { id: 1, title: 'AI Recommendation Ready', time: '10 mins ago', text: 'Section W21x62 optimized for Beam B-104 with 18.4% weight saving.', unread: true },
  { id: 2, title: 'Project Verification Passed', time: '1 hour ago', text: 'Hudson Yards Tower A passed AISC 360-16 LRFD structural check.', unread: true },
  { id: 3, title: 'Report Downloaded', time: '3 hours ago', text: 'Engineering Report PDF generated for Golden Gate Retrofit.', unread: false }
];
