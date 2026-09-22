import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ClientHome } from './components/ClientView/ClientHome';
import { DeliveryTracking } from './components/ClientView/DeliveryTracking';
import { CartDrawer } from './components/ClientView/CartDrawer';
import { PrescriptionUploadModal } from './components/ClientView/PrescriptionUploadModal';
import { PharmacieDashboard } from './components/PharmacieView/PharmacieDashboard';
import { LivreurDashboard } from './components/LivreurView/LivreurDashboard';
import { FlutterCodeModal } from './components/FlutterCodeModal';
import { 
  Pill, 
  Smartphone, 
  Wifi, 
  Battery, 
  Signal, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    role, 
    isPhoneSimulatorMode, 
    setIsPhoneSimulatorMode, 
    toastMessage, 
    setActiveTrackingOrderId 
  } = useApp();

  const [clientView, setClientView] = useState<'catalog' | 'tracking'>('catalog');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState<boolean>(false);

  const renderCurrentView = () => {
    if (role === 'pharmacie') {
      return <PharmacieDashboard />;
    }
    if (role === 'livreur') {
      return <LivreurDashboard />;
    }
    // Client role
    if (clientView === 'tracking') {
      return <DeliveryTracking onBack={() => setClientView('catalog')} />;
    }
    return (
      <ClientHome
        onOpenPrescription={() => setIsPrescriptionModalOpen(true)}
        onOpenTracking={(orderId) => {
          setActiveTrackingOrderId(orderId);
          setClientView('tracking');
        }}
      />
    );
  };

  const appBody = (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="flex-1 pb-16">
        {renderCurrentView()}
      </main>

      {/* Floating Bottom Bar for Algerian Patients */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">ChifaExpress DZ 🇩🇿</span>
            <span>•</span>
            <span>Réseau National des Pharmacies d'Algérie</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Agrément Ministère de la Santé</span>
            <span>Sécurité Sociale CNAS / CASNOS</span>
            <span>Conforme Satim / BaridiMob</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenPrescription={() => setIsPrescriptionModalOpen(true)}
      />

      <PrescriptionUploadModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSuccess={(newOrderId) => {
          setActiveTrackingOrderId(newOrderId);
          setClientView('tracking');
        }}
      />

      <FlutterCodeModal />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 max-w-sm backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold leading-snug">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );

  // If Mobile Flutter Simulator Mode is active
  if (isPhoneSimulatorMode) {
    return (
      <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider bg-emerald-600 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" /> Simulateur Flutter Mobile (iOS / Android 🇩🇿)
          </span>
          <button
            onClick={() => setIsPhoneSimulatorMode(false)}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Quitter le mode simulateur
          </button>
        </div>

        {/* Smartphone Bezel */}
        <div className="relative w-full max-w-[410px] h-[850px] bg-black rounded-[50px] p-3 shadow-2xl ring-1 ring-slate-700/50 shadow-emerald-500/10 flex flex-col">
          
          {/* Dynamic Island / Notch & Top phone sensors */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
          </div>

          {/* Status Bar */}
          <div className="h-9 px-6 pt-2 flex items-center justify-between text-slate-800 text-[11px] font-bold z-40 bg-white rounded-t-[40px] select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Phone Screen Inner View */}
          <div className="flex-1 overflow-y-auto bg-slate-50 rounded-b-[40px] relative scrollbar-none">
            {appBody}
          </div>

          {/* Home indicator bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none" />
        </div>
      </div>
    );
  }

  return appBody;
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
