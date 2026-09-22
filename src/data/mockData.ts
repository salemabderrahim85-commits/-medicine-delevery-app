import { Medicine, Pharmacy, Order, Wilaya, ChifaCard } from '../types';

export const ALGERIA_WILAYAS: Wilaya[] = [
  {
    code: '16',
    name: 'Alger',
    communes: ['Hydra', 'El Biar', 'Kouba', 'Sidi M\'Hamed', 'Didouche Mourad', 'Bab El Oued', 'Bab Ezzouar', 'Dely Ibrahim', 'Bachdjerrah', 'Bir Mourad Raïs']
  },
  {
    code: '31',
    name: 'Oran',
    communes: ['Oran Centre', 'Front de Mer', 'Bir El Djir', 'Es Senia', 'Akid Lotfi', 'Canastel', 'Maraval']
  },
  {
    code: '25',
    name: 'Constantine',
    communes: ['Constantine Centre', 'Ali Mendjeli', 'El Khroub', 'Ziadia', 'Sidi Mabrouk', 'Belhadj']
  },
  {
    code: '09',
    name: 'Blida',
    communes: ['Blida Centre', 'Ouled Yaïch', 'Boufarik', 'Beni Mered', 'Chiffa', 'Larbaa']
  },
  {
    code: '15',
    name: 'Tizi Ouzou',
    communes: ['Tizi Ouzou Centre', 'Nouvelle Ville', 'Azazga', 'Draa Ben Khedda', 'Boghni']
  },
  {
    code: '19',
    name: 'Sétif',
    communes: ['Sétif Centre', 'Ain Arnat', 'El Eulma', 'Ain Oulmene']
  },
  {
    code: '06',
    name: 'Béjaïa',
    communes: ['Béjaïa Ville', 'Ihddaden', 'Tichy', 'Amizour', 'Akbou']
  },
  {
    code: '23',
    name: 'Annaba',
    communes: ['Annaba Centre', 'Sidi Amar', 'El Bouni', 'Plage Chapuis', 'Pont Blanc']
  }
];

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Doliprane 1000 mg',
    genericName: 'Paracétamol',
    dosage: '1000 mg',
    form: 'Comprimés effervescents (Boîte de 8)',
    category: 'antalgique',
    priceDZD: 240,
    requiresPrescription: false,
    inStock: true,
    chifaRefundRate: 0.8,
    labo: 'Sanofi Algérie',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60',
    description: 'Traitement symptomatique des douleurs d\'intensité légère à modérée et/ou des états fébriles.'
  },
  {
    id: 'med-2',
    name: 'Augmentin 1 g / 125 mg',
    genericName: 'Amoxicilline / Acide Clavulanique',
    dosage: '1g / 125mg',
    form: 'Poudre pour suspension buvable en sachets (Boîte de 14)',
    category: 'antibiotique',
    priceDZD: 1150,
    requiresPrescription: true,
    inStock: true,
    chifaRefundRate: 0.8,
    labo: 'GSK / Saidal',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&auto=format&fit=crop&q=60',
    description: 'Antibiotique à large spectre indiqué pour les infections respiratoires, ORL et dentaires.'
  },
  {
    id: 'med-3',
    name: 'Aspegic 100 mg Nourrissons',
    genericName: 'Acétylsalicylate de lysine',
    dosage: '100 mg',
    form: 'Sachets poudre orale (Boîte de 20)',
    category: 'antalgique',
    priceDZD: 320,
    requiresPrescription: false,
    inStock: true,
    chifaRefundRate: 0.8,
    labo: 'Sanofi Algérie',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&auto=format&fit=crop&q=60',
    description: 'Antalgique et antipyrétique pédiatrique pour fièvre et douleurs chez l\'enfant.'
  },
  {
    id: 'med-4',
    name: 'Glucophage 850 mg',
    genericName: 'Chlorhydrate de Metformine',
    dosage: '850 mg',
    form: 'Comprimés pelliculés (Boîte de 30)',
    category: 'diabete_cardio',
    priceDZD: 580,
    requiresPrescription: true,
    inStock: true,
    chifaRefundRate: 1.0, // 100% Chifa Chronique ALD
    labo: 'Merck / Biopharm',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&auto=format&fit=crop&q=60',
    description: 'Antidiabétique oral de première intention pour diabète de type 2 (100% remboursable Chifa).'
  },
  {
    id: 'med-5',
    name: 'Ventoline 100 µg',
    genericName: 'Salbutamol',
    dosage: '100 µg / dose',
    form: 'Suspension pour inhalation buccale (Flacon 200 doses)',
    category: 'respiratoire',
    priceDZD: 620,
    requiresPrescription: true,
    inStock: true,
    chifaRefundRate: 1.0,
    labo: 'GSK Algérie',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=300&auto=format&fit=crop&q=60',
    description: 'Bronchodilatateur d\'action rapide pour la crise d\'asthme et la bronchite obstructive.'
  },
  {
    id: 'med-6',
    name: 'Vitamine C 1000 mg Saidal',
    genericName: 'Acide Ascorbique',
    dosage: '1000 mg',
    form: 'Comprimés à croquer / effervescents (Tube de 20)',
    category: 'vitamines',
    priceDZD: 290,
    requiresPrescription: false,
    inStock: true,
    chifaRefundRate: 0,
    labo: 'Groupe Saidal Algérie',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&auto=format&fit=crop&q=60',
    description: 'Tonus et renforcement immunitaire lors des états de fatigue passagère.'
  },
  {
    id: 'med-7',
    name: 'Spasfon Lyoc 80 mg',
    genericName: 'Phloroglucinol',
    dosage: '80 mg',
    form: 'Lyophilisats oraux (Boîte de 10)',
    category: 'antalgique',
    priceDZD: 410,
    requiresPrescription: false,
    inStock: true,
    chifaRefundRate: 0.8,
    labo: 'Teva / Inpha Medis',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=60',
    description: 'Traitement des spasmes douloureux d\'origine digestive, biliaire ou gynécologique.'
  },
  {
    id: 'med-8',
    name: 'Bétadine Dermique 10%',
    genericName: 'Povidone iodée',
    dosage: '10%',
    form: 'Flacon solution antiseptique 125 ml',
    category: 'premiers_secours',
    priceDZD: 380,
    requiresPrescription: false,
    inStock: true,
    chifaRefundRate: 0.8,
    labo: 'Meda Pharma',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&auto=format&fit=crop&q=60',
    description: 'Antisepsie des plaies, brûlures superficielles et du champ opératoire.'
  },
  {
    id: 'med-9',
    name: 'Sérum Physiologique Saidal',
    genericName: 'Chlorure de Sodium 0.9%',
    dosage: '0.9%',
    form: 'Boîte de 30 unidoses stériles de 5 ml',
    category: 'bebe_maternite',
    priceDZD: 260,
    requiresPrescription: false,
    inStock: true,
    chifaRefundRate: 0.8,
    labo: 'Saidal Algérie',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60',
    description: 'Lavage nasal et oculaire des nourrissons, enfants et adultes.'
  },
  {
    id: 'med-10',
    name: 'Lantus Solostar 100 UI/ml',
    genericName: 'Insuline Glargine',
    dosage: '100 UI/ml',
    form: 'Stylos préremplis jetables (Boîte de 5 stylos)',
    category: 'diabete_cardio',
    priceDZD: 4850,
    requiresPrescription: true,
    inStock: true,
    chifaRefundRate: 1.0, // 100% Chifa Chronique ALD
    labo: 'Sanofi Algérie',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&auto=format&fit=crop&q=60',
    description: 'Analogue de l\'insuline à longue durée d\'action pour patients diabétiques insulino-dépendants.'
  }
];

export const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: 'pharma-1',
    name: 'Pharmacie Ibn Sina',
    pharmacistName: 'Dr. Amina Benali',
    wilayaCode: '16',
    wilayaName: 'Alger',
    commune: 'Didouche Mourad',
    address: '42 Rue Didouche Mourad (Près de la Grande Poste), Alger Centre',
    phone: '021 73 45 12 / 0550 12 34 56',
    isGarde: true,
    rating: 4.9,
    openHours: 'Ouvert 24h/24 (Pharmacie de Garde)',
    distanceKm: 1.2,
    lat: 36.7692,
    lng: 3.0588
  },
  {
    id: 'pharma-2',
    name: 'Pharmacie El Hana',
    pharmacistName: 'Dr. Karim Meziane',
    wilayaCode: '16',
    wilayaName: 'Alger',
    commune: 'Hydra',
    address: '15 Boulevard Sidi Yahia, Hydra, Alger',
    phone: '023 48 90 11 / 0661 78 90 23',
    isGarde: false,
    rating: 4.8,
    openHours: '08:00 - 21:00',
    distanceKm: 3.4,
    lat: 36.7423,
    lng: 3.0392
  },
  {
    id: 'pharma-3',
    name: 'Pharmacie Bab El Oued',
    pharmacistName: 'Dr. Yacine Kaci',
    wilayaCode: '16',
    wilayaName: 'Alger',
    commune: 'Bab El Oued',
    address: '8 Boulevard Colonel Lotfi, Bab El Oued, Alger',
    phone: '021 96 11 20',
    isGarde: true,
    rating: 4.7,
    openHours: 'Ouvert 24h/24 (Pharmacie de Garde)',
    distanceKm: 2.1,
    lat: 36.7885,
    lng: 3.0531
  },
  {
    id: 'pharma-4',
    name: 'Pharmacie de la Liberté',
    pharmacistName: 'Dr. Sarah Boukhalfa',
    wilayaCode: '16',
    wilayaName: 'Alger',
    commune: 'Kouba',
    address: '22 Avenue des Frères Abdeslami, Kouba, Alger',
    phone: '021 28 64 30',
    isGarde: false,
    rating: 4.8,
    openHours: '08:30 - 20:30',
    distanceKm: 4.8,
    lat: 36.7265,
    lng: 3.0841
  },
  {
    id: 'pharma-5',
    name: 'Pharmacie El Bahia',
    pharmacistName: 'Dr. Mohamed Belkacem',
    wilayaCode: '31',
    wilayaName: 'Oran',
    commune: 'Front de Mer',
    address: '12 Boulevard de l\'ALN, Front de Mer, Oran',
    phone: '041 33 22 11',
    isGarde: true,
    rating: 4.9,
    openHours: 'Ouvert 24h/24 (Pharmacie de Garde)',
    distanceKm: 1.5,
    lat: 35.7052,
    lng: -0.6432
  }
];

export const SAMPLE_CHIFA_CARD: ChifaCard = {
  enabled: true,
  nss: '861016160124', // 12-digit Algerian social security
  fullName: 'Abderrahim Salem',
  caisse: 'CNAS',
  isChroniqueALD: true,
  expirationDate: '12/2027'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-dz-101',
    orderNumber: 'DZ-2026-8941',
    createdAt: 'Il y a 18 min',
    updatedAt: 'Il y a 2 min',
    status: 'picked_up', // Courier is on the way to client
    clientName: 'Abderrahim Salem',
    clientPhone: '0555 42 19 80',
    wilaya: 'Alger',
    commune: 'Didouche Mourad',
    deliveryAddress: '28 Rue Didouche Mourad, Bâtiment C, 3ème étage, Alger Centre',
    deliveryNotes: 'Sonnez à l\'interphone "Salem", ascenseur disponible.',
    pharmacyId: 'pharma-1',
    pharmacyName: 'Pharmacie Ibn Sina',
    pharmacyAddress: '42 Rue Didouche Mourad, Alger Centre',
    pharmacyPhone: '021 73 45 12',
    items: [
      { medicine: MOCK_MEDICINES[0], quantity: 2 }, // Doliprane 1000mg
      { medicine: MOCK_MEDICINES[3], quantity: 1 }, // Glucophage 850mg (Chronique ALD)
      { medicine: MOCK_MEDICINES[5], quantity: 1 }  // Vitamine C
    ],
    prescriptionUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    prescriptionDoctor: 'Dr. T. Cherif - Spécialiste Médecine Interne, Hôpital Mustapha Bacha',
    prescriptionNotes: '1 comprimé Doliprane matin et soir si douleur. Glucophage 1 cp au milieu du repas.',
    prescriptionValidated: true,
    chifaCard: SAMPLE_CHIFA_CARD,
    subtotalDZD: 1350,
    chifaDeductionDZD: 964, // (2*240*0.8 + 580*1.0)
    deliveryFeeDZD: 250,
    totalToPayDZD: 636, // 1350 - 964 + 250
    paymentMethod: 'cash_on_delivery',
    deliveryPin: '4829',
    estimatedDeliveryMinutes: 12,
    courier: {
      id: 'courier-01',
      name: 'Sofiane Hamadi 🇩🇿',
      phone: '0770 31 88 94',
      vehicle: 'Scooter Sym',
      plate: '16-12480-120',
      rating: 4.95,
      deliveriesCount: 428,
      currentLat: 36.7660,
      currentLng: 3.0570
    },
    timeline: [
      { status: 'pending_prescription', label: 'Commande et ordonnance reçues', timestamp: '14:20' },
      { status: 'preparing', label: 'Ordonnance validée par Pharmacie Ibn Sina', timestamp: '14:24' },
      { status: 'ready_for_pickup', label: 'Médicaments préparés et emballés', timestamp: '14:29' },
      { status: 'courier_assigned', label: 'Livreur Sofiane a accepté la course', timestamp: '14:31' },
      { status: 'picked_up', label: 'Colis récupéré en pharmacie - En route vers le client', timestamp: '14:36' }
    ]
  },
  {
    id: 'ord-dz-102',
    orderNumber: 'DZ-2026-8942',
    createdAt: 'Il y a 6 min',
    updatedAt: 'Il y a 6 min',
    status: 'pending_prescription',
    clientName: 'Nadia Boumaza',
    clientPhone: '0661 88 23 10',
    wilaya: 'Alger',
    commune: 'Hydra',
    deliveryAddress: 'Cité des Pins, Villa 14, Hydra, Alger',
    pharmacyId: 'pharma-2',
    pharmacyName: 'Pharmacie El Hana',
    pharmacyAddress: '15 Boulevard Sidi Yahia, Hydra, Alger',
    pharmacyPhone: '023 48 90 11',
    items: [
      { medicine: MOCK_MEDICINES[1], quantity: 1 }, // Augmentin 1g
      { medicine: MOCK_MEDICINES[6], quantity: 2 }  // Spasfon Lyoc
    ],
    prescriptionUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    prescriptionDoctor: 'Dr. S. Khellaf - Pneumologue El Biar',
    prescriptionNotes: 'Augmentin 1 sachet matin et soir pendant 7 jours.',
    prescriptionValidated: false,
    chifaCard: {
      enabled: true,
      nss: '790514160431',
      fullName: 'Nadia Boumaza',
      caisse: 'CNAS',
      isChroniqueALD: false,
      expirationDate: '06/2028'
    },
    subtotalDZD: 1970,
    chifaDeductionDZD: 1576, // 80%
    deliveryFeeDZD: 300,
    totalToPayDZD: 694,
    paymentMethod: 'cash_on_delivery',
    deliveryPin: '1905',
    estimatedDeliveryMinutes: 35,
    timeline: [
      { status: 'pending_prescription', label: 'Ordonnance en attente de vérification par le pharmacien', timestamp: '14:42' }
    ]
  },
  {
    id: 'ord-dz-103',
    orderNumber: 'DZ-2026-8943',
    createdAt: 'Il y a 32 min',
    updatedAt: 'Il y a 10 min',
    status: 'ready_for_pickup',
    clientName: 'Karim Brahimi',
    clientPhone: '0792 14 55 60',
    wilaya: 'Alger',
    commune: 'Bab El Oued',
    deliveryAddress: '14 Rue Triolet, 2ème étage, Bab El Oued',
    pharmacyId: 'pharma-3',
    pharmacyName: 'Pharmacie Bab El Oued',
    pharmacyAddress: '8 Boulevard Colonel Lotfi, Bab El Oued',
    pharmacyPhone: '021 96 11 20',
    items: [
      { medicine: MOCK_MEDICINES[4], quantity: 1 }, // Ventoline
      { medicine: MOCK_MEDICINES[7], quantity: 1 }  // Bétadine
    ],
    prescriptionValidated: true,
    chifaCard: {
      enabled: true,
      nss: '910819160211',
      fullName: 'Karim Brahimi',
      caisse: 'CASNOS',
      isChroniqueALD: true,
      expirationDate: '09/2026'
    },
    subtotalDZD: 1000,
    chifaDeductionDZD: 924,
    deliveryFeeDZD: 250,
    totalToPayDZD: 326,
    paymentMethod: 'edahabia_cib',
    deliveryPin: '7721',
    estimatedDeliveryMinutes: 20,
    timeline: [
      { status: 'pending_prescription', label: 'Ordonnance reçue', timestamp: '14:15' },
      { status: 'preparing', label: 'Vérification Chifa CASNOS OK', timestamp: '14:20' },
      { status: 'ready_for_pickup', label: 'Prête - En attente d\'un coursier à proximité', timestamp: '14:28' }
    ]
  }
];
