import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { 
  Bike, 
  MapPin, 
  Building2, 
  Navigation, 
  Phone, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LiveMapProps {
  order: Order;
  onAdvanceStatus?: (status: OrderStatus) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({ order, onAdvanceStatus }) => {
  const { language, t, advanceOrderStatus, verifyDeliveryPin } = useApp();
  const [courierProgress, setCourierProgress] = useState<number>(0.65); // 0 to 1
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Animate courier slight jitter/movement along trajectory to simulate active GPS
  useEffect(() => {
    if (order.status === 'picked_up' || order.status === 'courier_assigned') {
      const interval = setInterval(() => {
        setCourierProgress((prev) => {
          if (prev >= 0.95) return 0.95;
          return Number((prev + 0.02).toFixed(3));
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [order.status]);

  // Route path calculations for SVG
  // Pharmacy (Start): (80, 160)
  // Waypoint 1: (180, 120)
  // Waypoint 2: (260, 210)
  // Destination Patient (End): (360, 90)
  
  // Interpolated courier coordinates
  const getCourierCoordinates = (t: number) => {
    const p0 = { x: 70, y: 160 };
    const p1 = { x: 170, y: 110 };
    const p2 = { x: 260, y: 220 };
    const p3 = { x: 370, y: 90 };

    if (t <= 0.33) {
      const subT = t / 0.33;
      return {
        x: p0.x + (p1.x - p0.x) * subT,
        y: p0.y + (p1.y - p0.y) * subT,
      };
    } else if (t <= 0.66) {
      const subT = (t - 0.33) / 0.33;
      return {
        x: p1.x + (p2.x - p1.x) * subT,
        y: p2.y + (p2.y - p1.y) * subT,
      };
    } else {
      const subT = (t - 0.66) / 0.34;
      return {
        x: p2.x + (p3.x - p2.x) * subT,
        y: p2.y + (p3.y - p2.y) * subT,
      };
    }
  };

  const courierPos = getCourierCoordinates(courierProgress);

  const handleSimulateNextStep = () => {
    if (order.status === 'pending_prescription') {
      advanceOrderStatus(order.id, 'preparing');
    } else if (order.status === 'preparing') {
      advanceOrderStatus(order.id, 'ready_for_pickup');
    } else if (order.status === 'ready_for_pickup') {
      advanceOrderStatus(order.id, 'courier_assigned');
      setCourierProgress(0.2);
    } else if (order.status === 'courier_assigned') {
      advanceOrderStatus(order.id, 'picked_up');
      setCourierProgress(0.5);
    } else if (order.status === 'picked_up') {
      setCourierProgress(0.95);
      advanceOrderStatus(order.id, 'delivered');
    }
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyDeliveryPin(order.id, enteredPin);
    if (!success) {
      setPinError(true);
      setTimeout(() => setPinError(false), 3000);
    } else {
      setEnteredPin('');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Map Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                GPS Live Algérie 🇩🇿
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {order.status === 'delivered' ? 'Livré' : `${order.estimatedDeliveryMinutes} min`}
              </span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">
              {order.pharmacyName} → {order.commune}, {order.wilaya}
            </h3>
          </div>
        </div>

        {/* Quick simulation button for testing */}
        <button
          onClick={handleSimulateNextStep}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          title="Avancer automatiquement l'étape pour observer le flux en direct"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Simuler Étape Suivante</span>
        </button>
      </div>

      {/* Interactive Simulated Vector Map */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-950 overflow-hidden select-none">
        
        {/* Realistic Algerian Map Grid & District Names */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 440 280" preserveAspectRatio="none">
          {/* Subtle street map roads */}
          <g stroke="#334155" strokeWidth="6" opacity="0.25" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="50" x2="430" y2="70" />
            <line x1="20" y1="160" x2="420" y2="170" />
            <line x1="30" y1="240" x2="410" y2="230" />
            <line x1="80" y1="20" x2="100" y2="270" />
            <line x1="220" y1="10" x2="210" y2="270" />
            <line x1="360" y1="20" x2="350" y2="270" />
            <path d="M 40,90 Q 200,40 380,120" fill="none" strokeWidth="8" />
            <path d="M 60,200 Q 220,130 400,220" fill="none" strokeWidth="8" />
          </g>

          {/* Delivery Route Path */}
          <path
            d="M 70,160 Q 170,110 260,220 T 370,90"
            fill="none"
            stroke="#059669"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="8 6"
            className="animate-[dash_20s_linear_infinite]"
          />

          {/* Traveled portion glow */}
          <circle cx={courierPos.x} cy={courierPos.y} r="18" fill="#10b981" opacity="0.15" />
          <circle cx={courierPos.x} cy={courierPos.y} r="10" fill="#10b981" opacity="0.3" />
        </svg>

        {/* Algerian Districts labels */}
        <div className="absolute top-4 left-6 text-[11px] font-semibold text-slate-500 pointer-events-none">
          Didouche Mourad
        </div>
        <div className="absolute top-10 right-12 text-[11px] font-semibold text-slate-500 pointer-events-none">
          Hydra / Sidi Yahia
        </div>
        <div className="absolute bottom-6 left-12 text-[11px] font-semibold text-slate-500 pointer-events-none">
          Bab El Oued / Casbah
        </div>
        <div className="absolute bottom-6 right-8 text-[11px] font-semibold text-slate-500 pointer-events-none">
          Kouba / Mustapha
        </div>

        {/* Start Point: Pharmacy */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
          style={{ left: '16%', top: '57%' }}
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold border border-slate-700 whitespace-nowrap shadow-sm">
            🏥 {order.pharmacyName}
          </span>
        </div>

        {/* Courier Scooter Marker */}
        {order.status !== 'delivered' && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center transition-all duration-700 ease-out"
            style={{ 
              left: `${(courierPos.x / 440) * 100}%`, 
              top: `${(courierPos.y / 280) * 100}%` 
            }}
          >
            <div className="relative">
              <span className="absolute -inset-2 rounded-full bg-amber-400 opacity-75 animate-ping"></span>
              <div className="relative w-11 h-11 rounded-2xl bg-amber-500 border-2 border-white text-slate-950 flex items-center justify-center shadow-xl">
                <Bike className="w-6 h-6 stroke-[2.3]" />
              </div>
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] shadow-sm flex items-center gap-1">
              <span>{order.courier ? order.courier.name.split(' ')[0] : 'Livreur DZ'}</span>
              <span className="text-[9px] bg-slate-950/20 px-1 rounded">🛵</span>
            </div>
          </div>
        )}

        {/* Destination Point: Patient */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
          style={{ left: '84%', top: '32%' }}
        >
          <div className={`w-10 h-10 rounded-2xl border-2 border-white text-white flex items-center justify-center shadow-lg ${
            order.status === 'delivered' ? 'bg-emerald-600 ring-4 ring-emerald-500/30' : 'bg-rose-600 shadow-rose-950/50'
          }`}>
            <MapPin className="w-5 h-5" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold border border-slate-700 whitespace-nowrap shadow-sm">
            🏠 Patient ({order.commune})
          </span>
        </div>

        {/* Live Traffic / GPS Status Bar in Map */}
        <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-100">
              {order.status === 'delivered' 
                ? 'Mission accomplie' 
                : order.status === 'picked_up' 
                ? 'En route vers votre adresse' 
                : order.status === 'courier_assigned'
                ? 'Livreur en approche de la pharmacie'
                : 'Pharmacie en cours de préparation'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Alger Centre • Circulation fluide
          </div>
        </div>
      </div>

      {/* Order Info & Courier Contact Card */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Courier profile */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm">
                🛵
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {order.courier ? order.courier.name : 'Sofiane Hamadi 🇩🇿'}
                  </h4>
                  <span className="text-xs text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                    ★ 4.95
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {order.courier ? `${order.courier.vehicle} • ${order.courier.plate}` : 'Scooter Sym • Alger 16'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${order.courier?.phone || '0770318894'}`}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                title={t.callCourier}
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/213770318894`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                title="WhatsApp Alger"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Security PIN Code Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Code Secret de Livraison
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Communiquez ce code au livreur à la réception des médicaments
                </p>
              </div>
              <div className="text-xl font-mono font-black text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-xs tracking-widest">
                {order.deliveryPin}
              </div>
            </div>

            {/* Quick PIN submission test if in delivery stage */}
            {order.status !== 'delivered' ? (
              <form onSubmit={handleConfirmPin} className="mt-2.5 flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="Tester validation code PIN (ex: 4829)"
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Valider
                </button>
              </form>
            ) : (
              <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t.orderDeliveredSuccess}
              </div>
            )}
            {pinError && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1">
                Code PIN incorrect. Entrez {order.deliveryPin}
              </p>
            )}
          </div>
        </div>

        {/* Live Timeline Steps */}
        <div className="mt-4 pt-4 border-t border-slate-200/80">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Étapes de préparation & acheminement
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { key: 'pending_prescription', label: '1. Ordonnance', active: true },
              { key: 'preparing', label: '2. En Préparation', active: ['preparing', 'ready_for_pickup', 'courier_assigned', 'picked_up', 'delivered'].includes(order.status) },
              { key: 'ready_for_pickup', label: '3. Prêt au Comptoir', active: ['ready_for_pickup', 'courier_assigned', 'picked_up', 'delivered'].includes(order.status) },
              { key: 'picked_up', label: '4. En Livraison', active: ['courier_assigned', 'picked_up', 'delivered'].includes(order.status) },
              { key: 'delivered', label: '5. Livré', active: order.status === 'delivered' },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  step.active
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${step.active ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span className="text-[11px] font-bold block leading-tight">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
