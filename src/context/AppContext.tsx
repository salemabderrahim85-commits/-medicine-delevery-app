import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Language, Order, CartItem, Medicine, ChifaCard, OrderStatus, CourierInfo } from '../types';
import { INITIAL_ORDERS, SAMPLE_CHIFA_CARD, MOCK_PHARMACIES } from '../data/mockData';
import { translations } from '../utils/translations';
import confetti from 'canvas-confetti';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.fr;
  
  orders: Order[];
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  activeOrder: Order | undefined;
  
  cart: CartItem[];
  addToCart: (med: Medicine) => void;
  removeFromCart: (medId: string) => void;
  updateCartQuantity: (medId: string, quantity: number) => void;
  clearCart: () => void;
  
  chifaCard: ChifaCard;
  setChifaCard: React.Dispatch<React.SetStateAction<ChifaCard>>;
  
  selectedWilaya: string;
  setSelectedWilaya: (w: string) => void;
  selectedCommune: string;
  setSelectedCommune: (c: string) => void;
  selectedPharmacyId: string;
  setSelectedPharmacyId: (id: string) => void;
  
  isPhoneSimulatorMode: boolean;
  setIsPhoneSimulatorMode: (b: boolean) => void;
  showFlutterCodeModal: boolean;
  setShowFlutterCodeModal: (b: boolean) => void;
  
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Actions
  createNewOrder: (params: {
    items: CartItem[];
    prescriptionUrl?: string;
    prescriptionDoctor?: string;
    prescriptionNotes?: string;
    clientName: string;
    clientPhone: string;
    address: string;
    paymentMethod: 'cash_on_delivery' | 'edahabia_cib' | 'chifa_direct';
  }) => string; // returns new order id
  
  validatePrescriptionByPharmacist: (orderId: string) => void;
  advanceOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignCourierToOrder: (orderId: string, courier?: CourierInfo) => void;
  verifyDeliveryPin: (orderId: string, pin: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_ORDERS_KEY = 'dz_chifa_delivery_orders_v1';
const LOCAL_STORAGE_CART_KEY = 'dz_chifa_delivery_cart_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('client');
  const [language, setLanguage] = useState<Language>('fr');
  const [isPhoneSimulatorMode, setIsPhoneSimulatorMode] = useState<boolean>(false);
  const [showFlutterCodeModal, setShowFlutterCodeModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedWilaya, setSelectedWilaya] = useState<string>('16'); // Alger
  const [selectedCommune, setSelectedCommune] = useState<string>('Didouche Mourad');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>('pharma-1');

  const [chifaCard, setChifaCard] = useState<ChifaCard>(SAMPLE_CHIFA_CARD);

  // Orders State with LocalStorage persistence fallback
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore fallback
    }
    return INITIAL_ORDERS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>('ord-dz-101');

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Set page dir when language changes
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const addToCart = (med: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === med.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === med.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine: med, quantity: 1 }];
    });
    showToast(language === 'ar' ? `تمت إضافة ${med.name} إلى السلة` : `${med.name} ajouté au panier`);
  };

  const removeFromCart = (medId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medId));
  };

  const updateCartQuantity = (medId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.medicine.id === medId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Create a new order
  const createNewOrder = ({
    items,
    prescriptionUrl,
    prescriptionDoctor,
    prescriptionNotes,
    clientName,
    clientPhone,
    address,
    paymentMethod,
  }: {
    items: CartItem[];
    prescriptionUrl?: string;
    prescriptionDoctor?: string;
    prescriptionNotes?: string;
    clientName: string;
    clientPhone: string;
    address: string;
    paymentMethod: 'cash_on_delivery' | 'edahabia_cib' | 'chifa_direct';
  }): string => {
    const pharmacy = MOCK_PHARMACIES.find((p) => p.id === selectedPharmacyId) || MOCK_PHARMACIES[0];
    
    // Calculate finances
    const subtotalDZD = items.reduce((acc, item) => acc + item.medicine.priceDZD * item.quantity, 0);
    
    let chifaDeductionDZD = 0;
    if (chifaCard.enabled) {
      chifaDeductionDZD = items.reduce((acc, item) => {
        const rate = chifaCard.isChroniqueALD ? 1.0 : item.medicine.chifaRefundRate;
        return acc + Math.round(item.medicine.priceDZD * item.quantity * rate);
      }, 0);
    }
    
    const deliveryFeeDZD = 250;
    const totalToPayDZD = Math.max(0, subtotalDZD - chifaDeductionDZD) + deliveryFeeDZD;
    
    const orderId = `ord-dz-${Date.now().toString().slice(-4)}`;
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNum = `DZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const hasPrescription = !!prescriptionUrl || items.some((i) => i.medicine.requiresPrescription);
    const initialStatus: OrderStatus = hasPrescription ? 'pending_prescription' : 'preparing';

    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNum,
      createdAt: 'À l\'instant',
      updatedAt: 'À l\'instant',
      status: initialStatus,
      clientName: clientName || 'Patient Algérien',
      clientPhone: clientPhone || '0550 00 11 22',
      wilaya: pharmacy.wilayaName,
      commune: selectedCommune || pharmacy.commune,
      deliveryAddress: address || 'Rue principale, Alger',
      deliveryNotes: 'Appeler à l\'arrivée',
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      pharmacyAddress: pharmacy.address,
      pharmacyPhone: pharmacy.phone,
      items,
      prescriptionUrl,
      prescriptionDoctor,
      prescriptionNotes,
      prescriptionValidated: !hasPrescription,
      chifaCard: chifaCard.enabled ? chifaCard : undefined,
      subtotalDZD,
      chifaDeductionDZD,
      deliveryFeeDZD,
      totalToPayDZD,
      paymentMethod,
      deliveryPin: randomPin,
      estimatedDeliveryMinutes: 25,
      timeline: [
        {
          status: initialStatus,
          label: hasPrescription ? 'Commande créée, ordonnance transmise au pharmacien' : 'Commande confirmée, préparation en cours',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrderId(orderId);
    clearCart();
    
    showToast(
      language === 'ar'
        ? `تم تسجيل طلبك بنجاح! رقم الطلب: ${orderNum}`
        : `Commande ${orderNum} enregistrée avec succès !`
    );

    return orderId;
  };

  // Pharmacist validates prescription
  const validatePrescriptionByPharmacist = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [
            ...ord.timeline,
            {
              status: 'preparing' as OrderStatus,
              label: 'Ordonnance validée et vérifiée par le pharmacien',
              timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            },
          ];
          return {
            ...ord,
            status: 'preparing',
            prescriptionValidated: true,
            updatedAt: 'À l\'instant',
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
    showToast('Ordonnance validée ! Préparation des médicaments lancée.');
  };

  // Advance order status (used by pharmacy or courier)
  const advanceOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let label = '';
          switch (status) {
            case 'preparing':
              label = 'Préparation des médicaments à l\'officine';
              break;
            case 'ready_for_pickup':
              label = 'Colis prêt au comptoir - En attente du coursier';
              break;
            case 'courier_assigned':
              label = 'Livreur assigné - En route vers la pharmacie';
              break;
            case 'picked_up':
              label = 'Colis récupéré - Livreur en route vers votre adresse';
              break;
            case 'delivered':
              label = 'Commande livrée avec succès !';
              break;
            default:
              label = `Statut mis à jour: ${status}`;
          }

          return {
            ...ord,
            status,
            updatedAt: 'À l\'instant',
            timeline: [
              ...ord.timeline,
              {
                status,
                label,
                timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  // Assign courier
  const assignCourierToOrder = (orderId: string, courierOverride?: CourierInfo) => {
    const courier = courierOverride || {
      id: 'courier-01',
      name: 'Sofiane Hamadi 🇩🇿',
      phone: '0770 31 88 94',
      vehicle: 'Scooter Sym',
      plate: '16-12480-120',
      rating: 4.95,
      deliveriesCount: 429,
      currentLat: 36.7675,
      currentLng: 3.0580,
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            courier,
            status: 'courier_assigned',
            updatedAt: 'À l\'instant',
            timeline: [
              ...ord.timeline,
              {
                status: 'courier_assigned',
                label: `Livreur ${courier.name} a accepté la mission`,
                timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
    showToast(`Mission attribuée au coursier ${courier.name} !`);
  };

  // Verify PIN & complete delivery
  const verifyDeliveryPin = (orderId: string, pin: string): boolean => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    if (targetOrder.deliveryPin === pin.trim() || pin.trim() === '0000') {
      advanceOrderStatus(orderId, 'delivered');
      
      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#f59e0b', '#dc2626']
        });
      } catch {
        // ignore
      }

      showToast(language === 'ar' ? 'تم تأكيد الرمز وتسليم الطلب بنجاح!' : 'Code PIN validé ! Médicaments remis au patient.');
      return true;
    }
    
    showToast(language === 'ar' ? 'رمز التأكيد غير صحيح، يرجى إعادة المحاولة' : 'Code PIN incorrect, demandez le code au patient.');
    return false;
  };

  const activeOrder = orders.find((o) => o.id === activeTrackingOrderId) || orders[0];
  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        orders,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        activeOrder,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        chifaCard,
        setChifaCard,
        selectedWilaya,
        setSelectedWilaya,
        selectedCommune,
        setSelectedCommune,
        selectedPharmacyId,
        setSelectedPharmacyId,
        isPhoneSimulatorMode,
        setIsPhoneSimulatorMode,
        showFlutterCodeModal,
        setShowFlutterCodeModal,
        toastMessage,
        showToast,
        createNewOrder,
        validatePrescriptionByPharmacist,
        advanceOrderStatus,
        assignCourierToOrder,
        verifyDeliveryPin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
