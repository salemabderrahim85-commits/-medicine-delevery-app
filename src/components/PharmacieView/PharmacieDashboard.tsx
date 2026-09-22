import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { 
  Building2, 
  FileText, 
  CheckCircle, 
  Clock, 
  Bike, 
  Search, 
  CreditCard, 
  ShieldCheck, 
  Eye, 
  AlertTriangle, 
  Phone, 
  ExternalLink,
  Check,
  X,
  PackageCheck
} from 'lucide-react';
import { MOCK_PHARMACIES } from '../../data/mockData';

export const PharmacieDashboard: React.FC = () => {
  const { 
    orders, 
    validatePrescriptionByPharmacist, 
    advanceOrderStatus, 
    assignCourierToOrder, 
    t, 
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [isGardeMode, setIsGardeMode] = useState<boolean>(true);

  // Pharmacy info
  const pharmacy = MOCK_PHARMACIES[0];

  // Filtering orders
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'pending') return order.status === 'pending_prescription';
    if (activeTab === 'preparing') return order.status === 'preparing';
    if (activeTab === 'ready') return order.status === 'ready_for_pickup' || order.status === 'courier_assigned';
    return true;
  });

  // Calculate statistics
  const pendingCount = orders.filter((o) => o.status === 'pending_prescription').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready_for_pickup').length;
  const totalChifaDeductions = orders.reduce((sum, o) => sum + (o.chifaDeductionDZD || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Pharmacy Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-emerald-500/20">
            🏥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                {pharmacy.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                Agrément N° 16-8942
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Titulaire : {pharmacy.pharmacistName} • {pharmacy.address}
            </p>
          </div>
        </div>

        {/* Garde status toggle */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-900 block">
              Service de Garde 24h/24
            </span>
            <span className="text-[11px] text-slate-500">
              {isGardeMode ? '🟢 Officine ouverte de nuit' : '⚪ Service normal'}
            </span>
          </div>
          <button
            onClick={() => setIsGardeMode(!isGardeMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              isGardeMode
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {isGardeMode ? 'Actif' : 'Inactif'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Ordonnances à valider</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-amber-600">{pendingCount}</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FileText className="w-5 h-5" />
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">En préparation officine</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-emerald-700">{preparingCount}</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Prêts pour coursier</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-teal-700">{readyCount}</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <PackageCheck className="w-5 h-5" />
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Télétransmission Chifa</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-black text-slate-900">{totalChifaDeductions} DA</span>
            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </span>
          </div>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'all', label: 'Toutes les commandes' },
          { id: 'pending', label: `À Valider (${pendingCount})` },
          { id: 'preparing', label: `En Préparation (${preparingCount})` },
          { id: 'ready', label: `Prêtes au Comptoir (${readyCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table / Cards */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <p className="text-sm font-bold text-slate-500">Aucune commande dans cette section.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const hasPrescription = !!order.prescriptionUrl;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left details */}
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">• {order.createdAt}</span>

                    {/* Status badge */}
                    {order.status === 'pending_prescription' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Ordonnance à valider
                      </span>
                    )}
                    {order.status === 'preparing' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        En préparation
                      </span>
                    )}
                    {order.status === 'ready_for_pickup' && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                        Prêt pour coursier
                      </span>
                    )}
                    {order.status === 'picked_up' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                        🛵 En route avec livreur
                      </span>
                    )}
                    {order.status === 'delivered' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        ✓ Livré
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-800">
                    Patient : {order.clientName} ({order.clientPhone})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    📍 {order.deliveryAddress}, {order.commune}
                  </p>

                  {/* Items summary */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {order.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {item.medicine.name} (x{item.quantity})
                      </span>
                    ))}
                  </div>

                  {/* Carte Chifa indicator */}
                  {order.chifaCard && (
                    <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-1 inline-flex">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Chifa {order.chifaCard.caisse} • NSS : {order.chifaCard.nss} • Déduction : {order.chifaDeductionDZD} DA
                      </span>
                    </div>
                  )}
                </div>

                {/* Right actions */}
                <div className="flex flex-wrap items-center gap-2 self-stretch md:self-center justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  
                  {/* Inspect prescription button */}
                  {hasPrescription && (
                    <button
                      onClick={() => setInspectingOrder(order)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                      <span>Inspecter Ordonnance</span>
                    </button>
                  )}

                  {/* Validate prescription */}
                  {order.status === 'pending_prescription' && (
                    <button
                      onClick={() => validatePrescriptionByPharmacist(order.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.validateOrder}</span>
                    </button>
                  )}

                  {/* Mark ready */}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => advanceOrderStatus(order.id, 'ready_for_pickup')}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>{t.markReady}</span>
                    </button>
                  )}

                  {/* Dispatch courier */}
                  {order.status === 'ready_for_pickup' && (
                    <button
                      onClick={() => assignCourierToOrder(order.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Affecter Coursier Sofiane</span>
                    </button>
                  )}

                  {/* Price display */}
                  <div className="text-right pl-2">
                    <span className="text-xs text-slate-400 block">Total net</span>
                    <span className="text-sm font-black text-slate-900">
                      {order.totalToPayDZD} DA
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Prescription Inspection Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-sm">
                  Inspection Ordonnance Médicale - {inspectingOrder.orderNumber}
                </h4>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={inspectingOrder.prescriptionUrl}
                  alt="Ordonnance"
                  className="w-full h-64 object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Médecin Prescripteur :</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {inspectingOrder.prescriptionDoctor || 'Dr. T. Cherif (Mustapha Bacha)'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Patient :</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {inspectingOrder.clientName}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Télétransmission Carte Chifa :</span>
                  <p className="font-bold text-emerald-700 mt-0.5">
                    {inspectingOrder.chifaCard
                      ? `Validée • ${inspectingOrder.chifaCard.caisse} (Taux: ${inspectingOrder.chifaCard.isChroniqueALD ? '100% ALD' : '80%'})`
                      : 'Non demandée'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Posologie / Instructions :</span>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {inspectingOrder.prescriptionNotes || 'Respecter posologie du médecin.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setInspectingOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Fermer
                </button>
                {inspectingOrder.status === 'pending_prescription' && (
                  <button
                    onClick={() => {
                      validatePrescriptionByPharmacist(inspectingOrder.id);
                      setInspectingOrder(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Valider cette Ordonnance</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
