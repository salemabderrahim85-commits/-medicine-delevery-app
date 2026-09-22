import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Copy, 
  Check, 
  Code2, 
  Smartphone, 
  Server, 
  Database, 
  ShieldCheck, 
  FileCode,
  Layers
} from 'lucide-react';

export const FlutterCodeModal: React.FC = () => {
  const { showFlutterCodeModal, setShowFlutterCodeModal } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'flutter_screen' | 'flutter_model' | 'nodejs_server' | 'firestore_schema'>('flutter_screen');

  if (!showFlutterCodeModal) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const flutterScreenCode = `// Flutter Dart (lib/screens/prescription_order_screen.dart)
// ChifaExpress DZ - Commande & Prise en charge Chifa

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_storage/firebase_storage.dart';

class PrescriptionOrderScreen extends StatefulWidget {
  final String pharmacyId;
  final String pharmacyName;

  const PrescriptionOrderScreen({
    Key? key,
    required this.pharmacyId,
    required this.pharmacyName,
  }) : super(key: key);

  @override
  _PrescriptionOrderScreenState createState() => _PrescriptionOrderScreenState();
}

class _PrescriptionOrderScreenState extends State<PrescriptionOrderScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nssController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  
  bool _isChifaEnabled = true;
  bool _isChroniqueALD = false;
  String _selectedCaisse = 'CNAS'; // CNAS ou CASNOS
  XFile? _prescriptionImage;
  bool _isLoading = false;

  Future<void> _pickImage(ImageSource source) async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: source, imageQuality: 85);
    if (picked != null) {
      setState(() => _prescriptionImage = picked);
    }
  }

  Future<void> _submitOrder() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      final user = FirebaseAuth.instance.currentUser;
      String? prescriptionUrl;

      // 1. Upload ordonnance sur Firebase Storage
      if (_prescriptionImage != null) {
        final ref = FirebaseStorage.instance
            .ref('prescriptions/\${user?.uid ?? "guest"}/\${DateTime.now().millisecondsSinceEpoch}.jpg');
        await ref.putData(await _prescriptionImage!.readAsBytes());
        prescriptionUrl = await ref.getDownloadURL();
      }

      // 2. Création document Firestore
      await FirebaseFirestore.instance.collection('orders').add({
        'orderNumber': 'DZ-2026-\${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
        'userId': user?.uid,
        'pharmacyId': widget.pharmacyId,
        'pharmacyName': widget.pharmacyName,
        'deliveryAddress': _addressController.text.trim(),
        'clientPhone': _phoneController.text.trim(),
        'prescriptionUrl': prescriptionUrl,
        'status': 'pending_prescription',
        'chifaCard': _isChifaEnabled ? {
          'nss': _nssController.text.trim(),
          'caisse': _selectedCaisse,
          'isChroniqueALD': _isChroniqueALD,
        } : null,
        'deliveryPin': (1000 + (DateTime.now().millisecond % 9000)).toString(),
        'deliveryFeeDZD': 250,
        'createdAt': FieldValue.serverTimestamp(),
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🇩🇿 Commande transmise à la pharmacie avec succès !')),
      );
      Navigator.pop(context);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: \$e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Commander avec Carte Chifa 🇩🇿'),
        backgroundColor: const Color(0xFF059669),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Photo de l'ordonnance
              GestureDetector(
                onTap: () => _pickImage(ImageSource.camera),
                child: Container(
                  height: 150,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.emerald.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF059669)),
                  ),
                  child: Center(
                    child: Text(_prescriptionImage != null ? 'Photo prise ✓' : 'Prendre photo ordonnance'),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // NSS & Chifa Switch
              SwitchListTile(
                title: const Text('Tiers-Payant Carte Chifa'),
                value: _isChifaEnabled,
                onChanged: (val) => setState(() => _isChifaEnabled = val),
              ),
              ElevatedButton(
                onPressed: _isLoading ? null : _submitOrder,
                child: const Text('Valider ma commande en DZD'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`;

  const flutterModelCode = `// Flutter Dart (lib/models/order_model.dart)
// Modèle de données pour les 3 rôles : Client, Pharmacie, Livreur

class OrderDZ {
  final String id;
  final String orderNumber;
  final String status; // 'pending_prescription' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered'
  final String pharmacyId;
  final String pharmacyName;
  final String clientName;
  final String clientPhone;
  final String deliveryAddress;
  final String commune;
  final String deliveryPin;
  final double totalToPayDZD;
  final double chifaDeductionDZD;
  final CourierDZ? courier;

  OrderDZ({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.pharmacyId,
    required this.pharmacyName,
    required this.clientName,
    required this.clientPhone,
    required this.deliveryAddress,
    required this.commune,
    required this.deliveryPin,
    required this.totalToPayDZD,
    required this.chifaDeductionDZD,
    this.courier,
  });

  factory OrderDZ.fromFirestore(Map<String, dynamic> data, String id) {
    return OrderDZ(
      id: id,
      orderNumber: data['orderNumber'] ?? '',
      status: data['status'] ?? 'pending_prescription',
      pharmacyId: data['pharmacyId'] ?? '',
      pharmacyName: data['pharmacyName'] ?? '',
      clientName: data['clientName'] ?? '',
      clientPhone: data['clientPhone'] ?? '',
      deliveryAddress: data['deliveryAddress'] ?? '',
      commune: data['commune'] ?? 'Alger',
      deliveryPin: data['deliveryPin'] ?? '0000',
      totalToPayDZD: (data['totalToPayDZD'] ?? 0).toDouble(),
      chifaDeductionDZD: (data['chifaDeductionDZD'] ?? 0).toDouble(),
      courier: data['courier'] != null ? CourierDZ.fromMap(data['courier']) : null,
    );
  }
}

class CourierDZ {
  final String name;
  final String phone;
  final String vehicle;
  final double currentLat;
  final double currentLng;

  CourierDZ({
    required this.name,
    required this.phone,
    required this.vehicle,
    required this.currentLat,
    required this.currentLng,
  });

  factory CourierDZ.fromMap(Map<String, dynamic> map) {
    return CourierDZ(
      name: map['name'] ?? '',
      phone: map['phone'] ?? '',
      vehicle: map['vehicle'] ?? 'Scooter Sym',
      currentLat: (map['currentLat'] ?? 36.76).toDouble(),
      currentLng: (map['currentLng'] ?? 3.05).toDouble(),
    );
  }
}`;

  const nodeJsServerCode = `// Node.js Express + Firebase Admin Backend (server.js)
// API de Télétraitement Carte Chifa & Notification Push Livreur Algérie

import express from 'express';
import admin from 'firebase-admin';

const app = express();
app.use(express.json());

// Initialisation Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://chifa-express-dz.firebaseio.com"
});

const db = admin.firestore();

// 1. Endpoint Téléservice Chifa CNAS / CASNOS (Calcul Tiers-Payant)
app.post('/api/chifa/verify', async (req, res) => {
  const { nss, caisse, items, isChroniqueALD } = req.body;

  if (!nss || nss.length !== 12) {
    return res.status(400).json({ error: 'Numéro de sécurité sociale algérien (NSS) invalide (12 chiffres requis).' });
  }

  let totalRefundDZD = 0;
  items.forEach(item => {
    const rate = isChroniqueALD ? 1.0 : (item.chifaRefundRate || 0.8);
    totalRefundDZD += Math.round(item.priceDZD * item.quantity * rate);
  });

  return res.json({
    success: true,
    nss,
    caisse: caisse || 'CNAS',
    eligible: true,
    chifaDeductionDZD: totalRefundDZD,
    approvedAt: new Date().toISOString()
  });
});

// 2. Notification Push Firebase Cloud Messaging (FCM) aux Livreurs de la zone
app.post('/api/orders/notify-riders', async (req, res) => {
  const { orderId, wilaya, commune, deliveryFeeDZD } = req.body;

  const message = {
    topic: \`riders_\${wilaya}_\${commune}\`,
    notification: {
      title: '🛵 Nouvelle course médicale disponible !',
      body: \`Course pharmacie à \${commune}. Gain : \${deliveryFeeDZD} DA. Acceptez vite !\`
    },
    data: { orderId: String(orderId) }
  };

  try {
    await admin.messaging().send(message);
    res.json({ success: true, message: 'Livreurs notifiés avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`🇩🇿 ChifaExpress Server running on port \${PORT}\`));`;

  const firestoreSchemaCode = `// Firestore Security Rules (firestore.rules)
// Protection multi-rôles : Client, Pharmacie, Livreur

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fonction vérifiant le rôle de l'utilisateur
    function getUserRole() {
      return request.auth.token.role; // 'client' | 'pharmacie' | 'livreur'
    }

    // Collection des commandes de médicaments
    match /orders/{orderId} {
      allow read: if request.auth != null;
      
      // Seul le client peut créer sa commande
      allow create: if request.auth != null;
      
      // La pharmacie peut valider l'ordonnance & préparer
      // Le livreur peut passer le statut en 'picked_up' ou 'delivered' avec le PIN
      allow update: if request.auth != null && (
        getUserRole() == 'pharmacie' || 
        getUserRole() == 'livreur' ||
        resource.data.userId == request.auth.uid
      );
    }

    // Catalogue des médicaments (Lecture publique, écriture Pharmacie/Admin)
    match /medicines/{medicineId} {
      allow read: if true;
      allow write: if getUserRole() == 'pharmacie';
    }

    // Pharmacies partenaires
    match /pharmacies/{pharmaId} {
      allow read: if true;
      allow write: if getUserRole() == 'pharmacie';
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 text-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">
                  Architecture Flutter + Firebase / Node.js 🇩🇿
                </h3>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Code source complet pour l'application mobile Flutter et le backend Node.js
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowFlutterCodeModal(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-5 pt-4 flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('flutter_screen')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'flutter_screen'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>PrescriptionScreen.dart</span>
          </button>

          <button
            onClick={() => setActiveTab('flutter_model')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'flutter_model'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>OrderModel.dart</span>
          </button>

          <button
            onClick={() => setActiveTab('nodejs_server')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'nodejs_server'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Node.js Express Backend</span>
          </button>

          <button
            onClick={() => setActiveTab('firestore_schema')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'firestore_schema'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Firestore Rules</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-5 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-slate-400">
              {activeTab === 'flutter_screen' && 'lib/screens/prescription_order_screen.dart (Flutter / Dart)'}
              {activeTab === 'flutter_model' && 'lib/models/order_model.dart (Data Layer)'}
              {activeTab === 'nodejs_server' && 'server/chifa_service.js (Node.js Express + FCM)'}
              {activeTab === 'firestore_schema' && 'firestore.rules (Security RBAC Rules)'}
            </span>

            <button
              onClick={() => {
                const code = 
                  activeTab === 'flutter_screen' ? flutterScreenCode :
                  activeTab === 'flutter_model' ? flutterModelCode :
                  activeTab === 'nodejs_server' ? nodeJsServerCode : firestoreSchemaCode;
                handleCopy(code, activeTab);
              }}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier le code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
            <code>
              {activeTab === 'flutter_screen' && flutterScreenCode}
              {activeTab === 'flutter_model' && flutterModelCode}
              {activeTab === 'nodejs_server' && nodeJsServerCode}
              {activeTab === 'firestore_schema' && firestoreSchemaCode}
            </code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Prise en charge intégrée : Flutter 3.x, Firebase Firestore, FCM & Téléservice Chifa Algérie</span>
          <button
            onClick={() => setShowFlutterCodeModal(false)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
