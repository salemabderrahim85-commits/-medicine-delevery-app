export type Role = 'client' | 'pharmacie' | 'livreur';
export type Language = 'fr' | 'ar';

export type MedicineCategory = 
  | 'tous'
  | 'antalgique'
  | 'antibiotique'
  | 'diabete_cardio'
  | 'vitamines'
  | 'respiratoire'
  | 'bebe_maternite'
  | 'premiers_secours';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: string;
  category: MedicineCategory;
  priceDZD: number;
  requiresPrescription: boolean;
  inStock: boolean;
  chifaRefundRate: number; // e.g., 0.8 (80%) or 1.0 (100% ALD) or 0
  image: string;
  description: string;
  labo: string; // e.g., Saidal, Sanofi Algérie, Biopharm, Hikma
}

export interface Pharmacy {
  id: string;
  name: string;
  pharmacistName: string;
  wilayaCode: string;
  wilayaName: string;
  commune: string;
  address: string;
  phone: string;
  isGarde: boolean; // Pharmacie de garde (ouvert nuit / 24h)
  rating: number;
  openHours: string;
  distanceKm: number;
  lat: number;
  lng: number;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface ChifaCard {
  enabled: boolean;
  nss: string; // 12-digit Algerian National Social Security number
  fullName: string;
  caisse: 'CNAS' | 'CASNOS';
  isChroniqueALD: boolean; // 100% reimbursement for chronic condition
  expirationDate: string;
}

export type OrderStatus = 
  | 'pending_prescription' // En attente de validation de l'ordonnance
  | 'preparing'            // Pharmacie prépare les médicaments
  | 'ready_for_pickup'     // Prêt au comptoir pour le livreur
  | 'courier_assigned'     // Livreur en route vers pharmacie
  | 'picked_up'            // Colis récupéré, en route vers le client
  | 'delivered'            // Livré avec confirmation PIN
  | 'cancelled';

export interface CourierInfo {
  id: string;
  name: string;
  phone: string;
  vehicle: 'Moto Yamaha' | 'Scooter Sym' | 'Vélo électrique' | 'Voiture';
  plate: string;
  rating: number;
  deliveriesCount: number;
  currentLat: number;
  currentLng: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  
  // Client details
  clientName: string;
  clientPhone: string;
  wilaya: string;
  commune: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  
  // Pharmacy
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
  
  // Items & prescription
  items: CartItem[];
  prescriptionUrl?: string;
  prescriptionDoctor?: string;
  prescriptionNotes?: string;
  prescriptionValidated?: boolean;
  
  // Chifa
  chifaCard?: ChifaCard;
  
  // Financials in DZD
  subtotalDZD: number;
  chifaDeductionDZD: number;
  deliveryFeeDZD: number;
  totalToPayDZD: number;
  paymentMethod: 'cash_on_delivery' | 'edahabia_cib' | 'chifa_direct';
  
  // Tracking
  deliveryPin: string; // 4 digit security code given by patient to courier
  courier?: CourierInfo;
  estimatedDeliveryMinutes: number;
  
  // Timeline events
  timeline: {
    status: OrderStatus;
    label: string;
    timestamp: string;
  }[];
}

export interface Wilaya {
  code: string;
  name: string;
  communes: string[];
}
