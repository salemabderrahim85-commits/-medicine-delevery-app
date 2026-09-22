import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Bike, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { LiveMap } from '../TrackingMap/LiveMap';

interface DeliveryTrackingProps {
  onBack: () => void;
}

export const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ onBack }) => {
  const { 
    orders, 
    activeTrackingOrderId, 
    setActiveTrackingOrderId, 
    t, 
    language 
  } = useApp();

  const currentOrder = 
    orders.find((o) => o.id === activeTrackingOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Aucune commande sélectionnée.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Retour au catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Header with Back Button and Order Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </button>

        {/* Switch among active orders */}
        {orders.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveTrackingOrderId(o.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  o.id === currentOrder.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live Map & GPS Trajectory */}
      <LiveMap order={currentOrder} />

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
        
        {/* Header summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Commande Médicale Algérie 🇩🇿
              </span>
              <span className="text-xs text-slate-400">• {currentOrder.createdAt}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              N° {currentOrder.orderNumber}
            </h3>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 block">Total Net à la réception</span>
            <span className="text-2xl font-black text-emerald-700">
              {currentOrder.totalToPayDZD} {t.priceUnit}
            </span>
          </div>
        </div>

        {/* Medicines list in order */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Médicaments inclus ({currentOrder.items.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3"
              >
                <img
                  src={item.medicine.image}
                  alt={item.medicine.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 truncate">
                    {item.medicine.name}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Quantité : {item.quantity} • {item.medicine.dosage}
                  </p>
                  <span className="text-xs font-black text-slate-800">
                    {item.medicine.priceDZD * item.quantity} DA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carte Chifa & Breakdown */}
        {currentOrder.chifaCard && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Prise en charge Carte Chifa {currentOrder.chifaCard.caisse}
              </span>
              <span>- {currentOrder.chifaDeductionDZD} DA</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Assuré social : {currentOrder.chifaCard.fullName} • NSS : {currentOrder.chifaCard.nss} • Taux : {currentOrder.chifaCard.isChroniqueALD ? '100% Maladie Chronique ALD' : '80%'}
            </p>
          </div>
        )}

        {/* Addresses Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Pharmacie Expéditrice
            </span>
            <h5 className="font-bold text-xs text-slate-900 mt-1">
              {currentOrder.pharmacyName}
            </h5>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {currentOrder.pharmacyAddress}
            </p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">
              📞 {currentOrder.pharmacyPhone}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Adresse de Réception Client
            </span>
            <h5 className="font-bold text-xs text-slate-900 mt-1">
              {currentOrder.clientName} ({currentOrder.commune}, {currentOrder.wilaya})
            </h5>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {currentOrder.deliveryAddress}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 italic">
              {currentOrder.deliveryNotes || 'Aucune note particulière'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
