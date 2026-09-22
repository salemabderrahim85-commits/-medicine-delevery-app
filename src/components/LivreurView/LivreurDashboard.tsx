import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { 
  Bike, 
  MapPin, 
  Building2, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  KeyRound, 
  ArrowRight, 
  Navigation, 
  Wallet, 
  CheckCircle,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { LiveMap } from '../TrackingMap/LiveMap';

export const LivreurDashboard: React.FC = () => {
  const { 
    orders, 
    advanceOrderStatus, 
    assignCourierToOrder, 
    verifyDeliveryPin, 
    t, 
    language 
  } = useApp();

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // My active mission (assigned or picked up)
  const activeMission = orders.find(
    (o) => o.status === 'courier_assigned' || o.status === 'picked_up'
  );

  // Available unassigned orders ready for courier pickup
  const availableOrders = orders.filter(
    (o) => o.status === 'ready_for_pickup'
  );

  // Delivered orders history
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const handleAcceptMission = (orderId: string) => {
    assignCourierToOrder(orderId, {
      id: 'courier-01',
      name: 'Sofiane Hamadi 🇩🇿',
      phone: '0770 31 88 94',
      vehicle: 'Scooter Sym',
      plate: '16-12480-120',
      rating: 4.95,
      deliveriesCount: 429,
      currentLat: 36.7675,
      currentLng: 3.0580,
    });
  };

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMission) return;
    const ok = verifyDeliveryPin(activeMission.id, pinInput);
    if (!ok) {
      setPinError(true);
      setTimeout(() => setPinError(false), 3000);
    } else {
      setPinInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Courier Status Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg shadow-amber-500/20">
            🛵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black">Sofiane Hamadi</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold">
                ★ 4.95 (428 courses)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Scooter Sym Orbit • Alger Centre & Hydra • Matr. 16-12480-120
            </p>
          </div>
        </div>

        {/* Online / Offline switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              isOnline
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-300 animate-ping' : 'bg-slate-500'}`} />
            <span>{isOnline ? t.riderStatusOnline : t.riderStatusOffline}</span>
          </button>
        </div>
      </div>

      {/* Courier Earnings Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t.todayEarnings}
          </span>
          <span className="text-lg sm:text-2xl font-black text-emerald-700 mt-1 block">
            3 450 DA
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t.completedDeliveries}
          </span>
          <span className="text-lg sm:text-2xl font-black text-slate-900 mt-1 block">
            {deliveredOrders.length + 8}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Pourboires
          </span>
          <span className="text-lg sm:text-2xl font-black text-amber-600 mt-1 block">
            600 DA
          </span>
        </div>
      </div>

      {/* ACTIVE MISSION SECTION (If active) */}
      {activeMission ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              Course en cours : {activeMission.orderNumber}
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
              Gain course : {activeMission.deliveryFeeDZD} DA
            </span>
          </div>

          {/* Interactive live map view */}
          <LiveMap order={activeMission} />

          {/* Rider action controls */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Action Coursier Immédiate
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeMission.clientPhone}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler Patient</span>
                </a>
              </div>
            </div>

            {/* Workflow steps for courier */}
            {activeMission.status === 'courier_assigned' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-amber-950">
                    Rendez-vous à : {activeMission.pharmacyName}
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    📍 {activeMission.pharmacyAddress}
                  </p>
                </div>
                <button
                  onClick={() => advanceOrderStatus(activeMission.id, 'picked_up')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  ✓ Colis Récupéré au Comptoir
                </button>
              </div>
            )}

            {activeMission.status === 'picked_up' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h4 className="font-bold text-sm text-emerald-950">
                    Livrer à : {activeMission.clientName}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    📍 {activeMission.deliveryAddress}, {activeMission.commune}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 italic">
                    Note : "{activeMission.deliveryNotes || 'Sonner à l\'interphone'}"
                  </p>
                </div>

                {/* Secret PIN Entry to finish delivery */}
                <form onSubmit={handleConfirmDelivery} className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Code PIN de Confirmation Patient
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      (Code patient : {activeMission.deliveryPin})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Entrez le code à 4 chiffres"
                      className="flex-1 px-4 py-2.5 text-center font-mono font-black text-base tracking-widest bg-slate-800 border border-slate-700 rounded-xl focus:outline-emerald-500 text-white placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all cursor-pointer"
                    >
                      Valider Livraison
                    </button>
                  </div>

                  {pinError && (
                    <p className="text-xs text-rose-400 font-semibold text-center">
                      Code PIN incorrect ! Demandez le code au patient ({activeMission.deliveryPin}).
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* AVAILABLE MISSIONS TO ACCEPT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Bike className="w-5 h-5 text-emerald-600" />
            <span>Missions Médicales Disponibles ({availableOrders.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Rayon Alger 10 km</span>
        </div>

        {availableOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
            <p className="text-sm font-bold text-slate-500">
              Aucune nouvelle commande en attente de coursier pour l'instant.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Passez sur l'onglet Pharmacie pour préparer et marquer une commande prête !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">
                      +{order.deliveryFeeDZD} DA
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">{order.pharmacyName}</span>
                        <p className="text-[11px] text-slate-500 truncate">{order.pharmacyAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">Destination : {order.commune}</span>
                        <p className="text-[11px] text-slate-500 truncate">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    ~{order.estimatedDeliveryMinutes} min • {order.items.length} médicaments
                  </span>
                  <button
                    onClick={() => handleAcceptMission(order.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{t.acceptMission}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
