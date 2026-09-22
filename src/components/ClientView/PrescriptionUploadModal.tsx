import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  UploadCloud, 
  Camera, 
  CreditCard, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  User, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { MOCK_PHARMACIES, SAMPLE_CHIFA_CARD, MOCK_MEDICINES } from '../../data/mockData';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { 
    language, 
    t, 
    chifaCard, 
    setChifaCard, 
    createNewOrder, 
    selectedPharmacyId, 
    selectedWilaya, 
    selectedCommune 
  } = useApp();

  const [prescriptionImage, setPrescriptionImage] = useState<string>(
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
  );
  const [doctorName, setDoctorName] = useState<string>('Dr. T. Cherif (Mustapha Bacha)');
  const [patientNotes, setPatientNotes] = useState<string>('Traitement urgent pour état fébrile et renouvellement insuline.');
  const [patientName, setPatientName] = useState<string>('Abderrahim Salem');
  const [patientPhone, setPatientPhone] = useState<string>('0555 42 19 80');
  const [patientAddress, setPatientAddress] = useState<string>('28 Rue Didouche Mourad, Alger Centre');

  if (!isOpen) return null;

  const handleUseSamplePrescription = () => {
    setPrescriptionImage(
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'
    );
    setDoctorName('Dr. S. Khellaf (Pneumologue El Biar)');
    setPatientNotes('Augmentin 1g + Ventoline 100µg en urgence.');
  };

  const handleAutofillChifa = () => {
    setChifaCard(SAMPLE_CHIFA_CARD);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto populate prescription items with sample prescribed medicines
    const prescribedItems = [
      { medicine: MOCK_MEDICINES[1], quantity: 1 }, // Augmentin
      { medicine: MOCK_MEDICINES[4], quantity: 1 }, // Ventoline
    ];

    const newOrderId = createNewOrder({
      items: prescribedItems,
      prescriptionUrl: prescriptionImage,
      prescriptionDoctor: doctorName,
      prescriptionNotes: patientNotes,
      clientName: patientName,
      clientPhone: patientPhone,
      address: patientAddress,
      paymentMethod: chifaCard.enabled ? 'chifa_direct' : 'cash_on_delivery',
    });

    onSuccess(newOrderId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {t.uploadPrescription}
              </h3>
              <p className="text-xs text-emerald-100">
                {t.uploadSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Prescription Photo Upload / Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                Photo de l'ordonnance médicale
              </label>
              <button
                type="button"
                onClick={handleUseSamplePrescription}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                + Utiliser exemple ordonnance
              </button>
            </div>

            <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50/40 text-center relative group">
              {prescriptionImage ? (
                <div className="relative">
                  <img
                    src={prescriptionImage}
                    alt="Prescription médicale"
                    className="w-full h-44 object-cover rounded-xl shadow-xs border border-emerald-200"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleUseSamplePrescription}
                      className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Changer l'image
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Ordonnance prête pour analyse pharmacien
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center">
                  <UploadCloud className="w-10 h-10 text-emerald-600 mb-2" />
                  <p className="text-sm font-bold text-slate-800">Prenez une photo ou importez le fichier</p>
                  <p className="text-xs text-slate-500 mt-1">Formats acceptés : JPG, PNG, PDF (Max 10 Mo)</p>
                </div>
              )}
            </div>
          </div>

          {/* Carte Chifa Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-slate-900">
                  Carte Chifa (Tiers-Payant Algérie 🇩🇿)
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutofillChifa}
                className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Remplir avec ma carte Chifa
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">
                  N° Sécurité Sociale (NSS - 12 chiffres)
                </label>
                <input
                  type="text"
                  value={chifaCard.nss}
                  onChange={(e) => setChifaCard({ ...chifaCard, nss: e.target.value })}
                  placeholder="Ex: 861016160124"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">
                  Caisse d'Assurance
                </label>
                <select
                  value={chifaCard.caisse}
                  onChange={(e) => setChifaCard({ ...chifaCard, caisse: e.target.value as 'CNAS' | 'CASNOS' })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="CNAS">CNAS (Salariés & Ayants droit)</option>
                  <option value="CASNOS">CASNOS (Non-salariés & Indépendants)</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="aldCheckbox"
                checked={chifaCard.isChroniqueALD}
                onChange={(e) => setChifaCard({ ...chifaCard, isChroniqueALD: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="aldCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                Affection Longue Durée (ALD / Maladie Chronique - Prise en charge à 100%)
              </label>
            </div>
          </div>

          {/* Delivery & Doctor Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Nom du Patient
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">
                Numéro de téléphone (+213)
              </label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-700 font-bold block mb-1">
              Adresse de livraison ({selectedCommune}, Alger)
            </label>
            <input
              type="text"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Transmettre à la Pharmacie</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
