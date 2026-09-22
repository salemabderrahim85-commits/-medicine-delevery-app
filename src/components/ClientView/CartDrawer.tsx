import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  FileText 
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrescription: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenPrescription,
}) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    chifaCard, 
    setChifaCard, 
    t, 
    language 
  } = useApp();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.medicine.priceDZD * item.quantity, 0);

  // Chifa calculations
  let chifaDeduction = 0;
  if (chifaCard.enabled) {
    chifaDeduction = cart.reduce((sum, item) => {
      const rate = chifaCard.isChroniqueALD ? 1.0 : item.medicine.chifaRefundRate;
      return sum + Math.round(item.medicine.priceDZD * item.quantity * rate);
    }, 0);
  }

  const deliveryFee = 250;
  const netTotal = Math.max(0, subtotal - chifaDeduction) + deliveryFee;
  const hasPrescriptionItems = cart.some((i) => i.medicine.requiresPrescription);

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs">
        <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{t.cart}</h3>
                <p className="text-xs text-slate-500">
                  {cart.length} {cart.length > 1 ? 'articles' : 'article'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">{t.cartEmpty}</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Ajoutez des médicaments depuis le catalogue ou scannez directement votre ordonnance.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPrescription();
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors border border-emerald-200 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  {t.uploadPrescription}
                </button>
              </div>
            ) : (
              <>
                {/* Warning if items require prescription */}
                {hasPrescriptionItems && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold block">Ordonnance requise</span>
                      <span>Certains médicaments sélectionnés nécessitent la validation d'une ordonnance par le pharmacien.</span>
                    </div>
                  </div>
                )}

                {cart.map((item) => (
                  <div
                    key={item.medicine.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.medicine.image}
                      alt={item.medicine.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {item.medicine.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {item.medicine.dosage} • {item.medicine.labo}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-emerald-700">
                          {item.medicine.priceDZD} {t.priceUnit}
                        </span>
                        {item.medicine.chifaRefundRate > 0 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            Chifa {item.medicine.chifaRefundRate * 100}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.medicine.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.medicine.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.medicine.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Carte Chifa Tiers-Payant Toggle in Cart */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold text-slate-900">
                        {t.chifaCardTitle}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chifaCard.enabled}
                        onChange={(e) => setChifaCard({ ...chifaCard, enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  {chifaCard.enabled && (
                    <div className="mt-2 pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-800 flex items-center justify-between">
                      <span>NSS : {chifaCard.nss || 'Non renseigné'}</span>
                      <span className="font-bold">{chifaCard.caisse} {chifaCard.isChroniqueALD ? '(ALD 100%)' : '(80%)'}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Cart Footer / Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-bold">{subtotal} {t.priceUnit}</span>
              </div>

              {chifaCard.enabled && chifaDeduction > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.chifaDeduction}
                  </span>
                  <span>- {chifaDeduction} {t.priceUnit}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-slate-600">
                <span>{t.deliveryFee}</span>
                <span className="font-bold">{deliveryFee} {t.priceUnit}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-900">{t.totalToPay}</span>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-700">
                    {netTotal} {t.priceUnit}
                  </span>
                  <p className="text-[10px] text-slate-500">TTC • Paiement à la réception</p>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <span>{t.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderCompleted={() => {
            setIsCheckoutOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
