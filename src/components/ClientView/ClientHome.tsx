import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicineCategory, Medicine } from '../../types';
import { 
  Search, 
  FileText, 
  CreditCard, 
  MapPin, 
  Clock, 
  Sparkles, 
  Plus, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  Building2, 
  Filter, 
  Activity, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { MOCK_MEDICINES, MOCK_PHARMACIES, ALGERIA_WILAYAS } from '../../data/mockData';

interface ClientHomeProps {
  onOpenPrescription: () => void;
  onOpenTracking: (orderId: string) => void;
}

export const ClientHome: React.FC<ClientHomeProps> = ({
  onOpenPrescription,
  onOpenTracking,
}) => {
  const { 
    addToCart, 
    orders, 
    activeTrackingOrderId, 
    selectedWilaya, 
    setSelectedWilaya, 
    selectedCommune, 
    setSelectedCommune, 
    selectedPharmacyId, 
    setSelectedPharmacyId, 
    chifaCard, 
    t, 
    language 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MedicineCategory>('tous');
  const [onlyGardePharmacies, setOnlyGardePharmacies] = useState(false);

  // Active in-flight order if any
  const latestActiveOrder = orders.find(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  const categories: { id: MedicineCategory; label: string; icon: string }[] = [
    { id: 'tous', label: t.allCategories, icon: '💊' },
    { id: 'antalgique', label: t.antalgic, icon: '🩹' },
    { id: 'antibiotique', label: t.antibiotic, icon: '🔬' },
    { id: 'diabete_cardio', label: t.diabetesCardio, icon: '❤️' },
    { id: 'vitamines', label: t.vitamins, icon: '⚡' },
    { id: 'respiratoire', label: t.respiratory, icon: '🫁' },
    { id: 'bebe_maternite', label: t.babyMaternity, icon: '🍼' },
    { id: 'premiers_secours', label: t.firstAid, icon: '🏥' },
  ];

  // Filter medicines
  const filteredMedicines = MOCK_MEDICINES.filter((med) => {
    const matchesSearch = 
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.labo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'tous' || med.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter pharmacies
  const filteredPharmacies = MOCK_PHARMACIES.filter((pharma) => {
    if (onlyGardePharmacies && !pharma.isGarde) return false;
    return true;
  });

  const currentWilaya = ALGERIA_WILAYAS.find((w) => w.code === selectedWilaya) || ALGERIA_WILAYAS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Active Order Banner if an order is being delivered */}
      {latestActiveOrder && (
        <div 
          onClick={() => onOpenTracking(latestActiveOrder.id)}
          className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-emerald-400 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute -inset-1 rounded-2xl bg-emerald-400 opacity-70 animate-ping"></span>
              <div className="relative w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Truck className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Commande en cours : {latestActiveOrder.orderNumber}
                </span>
                <span className="text-xs text-slate-300">
                  {latestActiveOrder.estimatedDeliveryMinutes} min restantes
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                {latestActiveOrder.status === 'picked_up'
                  ? '🛵 Livreur en route vers votre domicile à Alger'
                  : latestActiveOrder.status === 'courier_assigned'
                  ? '🛵 Livreur en route vers la pharmacie'
                  : '🏥 Préparation des médicaments en pharmacie'}
              </h4>
              <p className="text-xs text-slate-300">
                Pharmacie {latestActiveOrder.pharmacyName} • Code PIN secret : <span className="font-mono font-bold text-emerald-400">{latestActiveOrder.deliveryPin}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white text-xs font-bold transition-colors shrink-0">
            <span>{t.liveTracking}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {/* Hero Banner with Algerian Health Identity */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-emerald-700/40">
        
        {/* Background decorations */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-teal-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
            <span>🇩🇿 Premier Réseau Santé & Tiers-Payant en Algérie</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Vos Médicaments Livrés en <span className="text-emerald-400">30 à 45 min</span> avec Carte Chifa.
          </h2>

          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Commandez vos traitements urgents ou ordonnances médicales depuis les pharmacies de garde à Alger, Oran, Constantine et toutes les wilayas. Prise en charge CNAS / CASNOS directe.
          </p>

          {/* Call to action buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPrescription}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-emerald-950 font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{t.uploadPrescription}</span>
            </button>

            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs">
              <CreditCard className="w-4 h-4 text-emerald-300" />
              <span className="font-semibold">Tiers-payant 80% & 100% ALD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Bar & Pharmacy Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
              Zone de commande
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={selectedWilaya}
                onChange={(e) => {
                  setSelectedWilaya(e.target.value);
                  const target = ALGERIA_WILAYAS.find((w) => w.code === e.target.value);
                  if (target) setSelectedCommune(target.communes[0]);
                }}
                className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer"
              >
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} - Wilaya de {w.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer"
              >
                {currentWilaya.communes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Night pharmacy switch */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyGardePharmacies}
              onChange={(e) => setOnlyGardePharmacies(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Pharmacies de Garde de Nuit (24/7)
            </span>
          </label>
        </div>
      </div>

      {/* Selected Nearby Pharmacies Strip */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Pharmacies Partenaires à Proximité
          </h3>
          <span className="text-xs text-slate-500">
            {filteredPharmacies.length} officines disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPharmacies.map((pharma) => {
            const isSelected = pharma.id === selectedPharmacyId;
            return (
              <div
                key={pharma.id}
                onClick={() => setSelectedPharmacyId(pharma.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {pharma.name}
                      </h4>
                      {pharma.isGarde && (
                        <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black">
                          Garde 24/7
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{pharma.pharmacistName}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                    ★ {pharma.rating}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 mt-2 truncate">
                  📍 {pharma.address}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold">
                    Livraison en ~{Math.round(pharma.distanceKm * 8 + 15)} min
                  </span>
                  <span className="text-slate-500 font-medium">
                    {pharma.distanceKm} km
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchMedicine}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-emerald-600 shadow-xs"
            />
          </div>

          <button
            onClick={onOpenPrescription}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>{t.uploadPrescription}</span>
          </button>
        </div>

        {/* Categories Carousel / Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Medicine Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-900 text-base">
            Catalogue des Médicaments ({filteredMedicines.length})
          </h3>
          <span className="text-xs text-slate-500">
            Tarifs réglementés en Dinars Algériens (DA)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={med.image}
                    alt={med.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Chifa badge */}
                  {med.chifaRefundRate > 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-black flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                      Chifa {med.chifaRefundRate * 100}%
                    </div>
                  )}
                  {/* Prescription required badge */}
                  {med.requiresPrescription ? (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                      Ordonnance
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-slate-900/80 text-white text-[10px] font-medium shadow-xs">
                      En vente libre
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {med.labo}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {med.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 italic">
                    {med.genericName} • {med.dosage}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {med.description}
                  </p>
                </div>
              </div>

              {/* Bottom Price & Add button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-900">
                    {med.priceDZD} {t.priceUnit}
                  </span>
                  {med.chifaRefundRate > 0 && (
                    <span className="block text-[10px] text-emerald-700 font-bold">
                      Reste à charge: ~{Math.round(med.priceDZD * (1 - med.chifaRefundRate))} DA
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(med)}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addToCart}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
