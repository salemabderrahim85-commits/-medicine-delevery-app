import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Check, 
  X, 
  MapPin, 
  Phone, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  Truck,
  Building2
} from 'lucide-react';
import { ALGERIA_WILAYAS, MOCK_PHARMACIES } from '../../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const { 
    cart, 
    chifaCard, 
    createNewOrder, 
    selectedWilaya, 
    setSelectedWilaya, 
    selectedCommune, 
    setSelectedCommune, 
    selectedPharmacyId,
    t, 
    language 
  } = useApp();

  const [clientName, setClientName] = useState('Abderrahim Salem');
  const [clientPhone, setClientPhone] = useState('0555 42 19 80');
  const [address, setAddress] = useState('28 Rue Didouche Mourad, Alger Centre');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'edahabia_cib' | 'chifa_direct'>('cash_on_delivery');

  if (!isOpen) return null;

  const currentWilayaObj = ALGERIA_WILAYAS.find((w) => w.code === selectedWilaya) || ALGERIA_WILAYAS[0];

  const subtotal = cart.reduce((sum, item) => sum + item.medicine.priceDZD * item.quantity, 0);
  let chifaDeduction = 0;
  if (chifaCard.enabled) {
    chifaDeduction = cart.reduce((sum, item) => {
      const rate = chifaCard.isChroniqueALD ? 1.0 : item.medicine.chifaRefundRate;
      return sum + Math.round(item.medicine.priceDZD * item.quantity * rate);
    }, 0);
  }
  const deliveryFee = 250;
  const netTotal = Math.max(0, subtotal - chifaDeduction) + deliveryFee;

  const handleWilayaChange = (code: string) => {
    setSelectedWilaya(code);
    const target = ALGERIA_WILAYAS.find((w) => w.code === code);
    if (target && target.communes.length > 0) {
      setSelectedCommune(target.communes[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewOrder({
      items: cart,
      clientName,
      clientPhone,
      address,
      paymentMethod,
    });
    onOrderCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Finaliser la Commande Express 🇩🇿
              </h3>
              <p className="text-xs text-emerald-200">
                Livraison garantie en 30 à 45 minutes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.clientPhone}
              </label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Wilaya & Commune selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.selectWilaya}
              </label>
              <select
                value={selectedWilaya}
                onChange={(e) => handleWilayaChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              >
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} - {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.selectCommune}
              </label>
              <select
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              >
                {currentWilayaObj.communes.map((comm) => (
                  <option key={comm} value={comm}>
                    {comm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t.enterAddress}
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Mode de paiement
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">{t.cashOnDelivery}</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800">Recommandé</span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'edahabia_cib'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'edahabia_cib'}
                    onChange={() => setPaymentMethod('edahabia_cib')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">{t.edahabiaCIB}</span>
                </div>
                <span className="text-[11px] text-slate-500">Satim / Algérie Poste</span>
              </label>
            </div>
          </div>

          {/* Financials Recap */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Médicaments ({cart.length} articles)</span>
              <span>{subtotal} DA</span>
            </div>
            {chifaCard.enabled && chifaDeduction > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Remboursement Carte Chifa</span>
                <span>- {chifaDeduction} DA</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Livraison express {selectedCommune}</span>
              <span>{deliveryFee} DA</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
              <span>Total à payer</span>
              <span className="text-emerald-700 text-base">{netTotal} DA</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Retour
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirmer la commande</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
