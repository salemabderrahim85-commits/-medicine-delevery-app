import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { 
  Pill, 
  ShoppingBag, 
  Bike, 
  Building2, 
  Smartphone, 
  Code2, 
  Globe, 
  PhoneCall, 
  ShieldCheck 
} from 'lucide-react';

interface HeaderProps {
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    t, 
    cart, 
    orders, 
    isPhoneSimulatorMode, 
    setIsPhoneSimulatorMode,
    setShowFlutterCodeModal 
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Pharmacist pending count
  const pendingValidationCount = orders.filter(
    (o) => o.status === 'pending_prescription' || o.status === 'preparing'
  ).length;

  // Courier active / ready count
  const availableDeliveriesCount = orders.filter(
    (o) => o.status === 'ready_for_pickup' || o.status === 'courier_assigned' || o.status === 'picked_up'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Algerian Healthcare Emergency Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🇩🇿 {t.emergencyNumbers}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-200 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Tiers-Payant Carte Chifa CNAS / CASNOS
            </span>
            <span className="text-emerald-400 font-bold">•</span>
            <span>Pharmacies de Garde 24/7</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setRole('client')}>
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                <Pill className="w-6 h-6 stroke-[2.2]" />
                <span className="absolute -bottom-1 -right-1 text-xs">🇩🇿</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                    <span>Chifa<span className="text-emerald-600">Express</span></span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      DZ
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {t.tagline}
                </p>
              </div>
            </div>

            {/* Mobile Actions: Cart & Lang */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" />
                {language === 'fr' ? 'العربية' : 'Français'}
              </button>

              {role === 'client' && onOpenCart && (
                <button
                  onClick={onOpenCart}
                  className="relative p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Role Switcher Tabs - The Core Feature */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-inner w-full md:w-auto justify-center">
            <button
              onClick={() => setRole('client')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                role === 'client'
                  ? 'bg-white text-emerald-700 shadow-sm font-bold ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>{t.client}</span>
            </button>

            <button
              onClick={() => setRole('pharmacie')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                role === 'pharmacie'
                  ? 'bg-white text-emerald-700 shadow-sm font-bold ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t.pharmacy}</span>
              {pendingValidationCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-500 text-white font-bold rounded-full">
                  {pendingValidationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setRole('livreur')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                role === 'livreur'
                  ? 'bg-white text-emerald-700 shadow-sm font-bold ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>{t.courier}</span>
              {availableDeliveriesCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-emerald-600 text-white font-bold rounded-full">
                  {availableDeliveriesCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Right Controls: Flutter Code, Phone Frame simulator, Language, Cart */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Flutter Code Modal trigger */}
            <button
              onClick={() => setShowFlutterCodeModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Voir code Flutter & Node.js Firebase"
            >
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Flutter + Firebase Code</span>
            </button>

            {/* Mobile / Desktop Simulator Toggle */}
            <button
              onClick={() => setIsPhoneSimulatorMode(!isPhoneSimulatorMode)}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPhoneSimulatorMode
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Mode Simulateur Téléphone Flutter"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden lg:inline">{isPhoneSimulatorMode ? 'Plein Écran' : 'Simulateur Mobile'}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
            </button>

            {/* Cart Button (Client role only) */}
            {role === 'client' && onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.cart}</span>
                {totalCartCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-white text-emerald-700 rounded-full text-[11px] font-black">
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
