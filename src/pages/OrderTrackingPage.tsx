import { useState } from 'react';
import { Package, MapPin, Truck, CheckCircle, Clock, Ship, Plane } from 'lucide-react';
import { formatFCFA } from '../utils/logistics';
import type { Order, OrderStatusUpdate, OrderDetailedStatus } from '../types';

type OrderTrackingPageProps = {
  onNavigate: (page: string) => void;
};

// Données mock pour le développement
const mockOrders: Order[] = [
  {
    id: 'KA-225-001234',
    userId: 'u1',
    products: [],
    total: 125000,
    status: 'shipped',
    paymentStatus: 'partial',
    paidAmount: 50000,
    createdAt: '2025-01-10T10:00:00',
    updatedAt: '2025-01-15T14:30:00',
    shippingAddress: 'Cocody, Abidjan, Côte d\'Ivoire',
    trackingNumber: 'TRK-2025-001234',
    shippingMethod: 'aerien',
    estimatedDelivery: '2025-01-22',
    detailedStatus: 'in_transit_to_africa',
    isAsianProduct: true,
    supplierInfo: {
      name: 'Shanghai Electronics Co.',
      contactDate: '2025-01-10T12:00:00',
      orderConfirmedDate: '2025-01-11T09:00:00',
    },
    statusHistory: [
      {
        status: 'order_placed',
        date: '2025-01-10T10:00:00',
        description: 'Commande passée avec succès',
        location: 'Plateforme KÔTO Africa',
      },
      {
        status: 'supplier_contacted',
        date: '2025-01-10T12:00:00',
        description: 'Fournisseur contacté en Chine',
        location: 'Shanghai, Chine',
      },
      {
        status: 'order_processing',
        date: '2025-01-11T09:00:00',
        description: 'Commande en cours de préparation',
        location: 'Shanghai, Chine',
      },
      {
        status: 'picked_up',
        date: '2025-01-13T15:00:00',
        description: 'Colis récupéré par KÔTO Africa',
        location: 'Shanghai, Chine',
      },
      {
        status: 'in_transit_to_africa',
        date: '2025-01-15T14:30:00',
        description: 'En transit vers l\'Afrique (Vol CA892)',
        location: 'En vol',
      },
    ],
  },
  {
    id: 'KA-225-001235',
    userId: 'u1',
    products: [],
    total: 75000,
    status: 'delivered',
    paymentStatus: 'completed',
    paidAmount: 75000,
    createdAt: '2025-01-05T14:00:00',
    updatedAt: '2025-01-12T16:00:00',
    shippingAddress: 'Marcory, Abidjan, Côte d\'Ivoire',
    trackingNumber: 'TRK-2025-001235',
    shippingMethod: 'express',
    estimatedDelivery: '2025-01-12',
    detailedStatus: 'delivered',
    isAsianProduct: false,
    statusHistory: [
      {
        status: 'order_placed',
        date: '2025-01-05T14:00:00',
        description: 'Commande passée',
        location: 'Plateforme KÔTO Africa',
      },
      {
        status: 'arrived_warehouse',
        date: '2025-01-06T10:00:00',
        description: 'Arrivé à l\'entrepôt',
        location: 'Abidjan, Côte d\'Ivoire',
      },
      {
        status: 'out_for_delivery',
        date: '2025-01-12T08:00:00',
        description: 'En cours de livraison',
        location: 'Abidjan',
      },
      {
        status: 'delivered',
        date: '2025-01-12T16:00:00',
        description: 'Livré avec succès',
        location: 'Marcory, Abidjan',
      },
    ],
  },
];

const statusConfig: Record<OrderDetailedStatus, { label: string; color: string; icon: any }> = {
  order_placed: { label: 'Commande passée', color: 'bg-blue-500', icon: CheckCircle },
  supplier_contacted: { label: 'Fournisseur contacté', color: 'bg-purple-500', icon: MapPin },
  order_processing: { label: 'En préparation', color: 'bg-orange-500', icon: Clock },
  picked_up: { label: 'Récupéré', color: 'bg-yellow-500', icon: Package },
  in_transit_to_africa: { label: 'En transit', color: 'bg-blue-600', icon: Plane },
  customs_clearance: { label: 'Dédouanement', color: 'bg-purple-600', icon: MapPin },
  arrived_warehouse: { label: 'Arrivé entrepôt', color: 'bg-green-500', icon: Package },
  out_for_delivery: { label: 'En livraison', color: 'bg-green-600', icon: Truck },
  delivered: { label: 'Livré', color: 'bg-green-700', icon: CheckCircle },
  cancelled: { label: 'Annulé', color: 'bg-red-500', icon: CheckCircle },
};

export function OrderTrackingPage({ onNavigate }: OrderTrackingPageProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(mockOrders[0]);

  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>Sélectionnez une commande</p>
        </div>
      </div>
    );
  }

  const currentStatusIndex = selectedOrder.statusHistory?.length ? selectedOrder.statusHistory.length - 1 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#4A2C2A] mb-2">Suivi de commande</h1>
          <p className="text-gray-600">Suivez l'état de vos commandes en temps réel</p>
        </div>

        {/* Sélecteur de commande */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sélectionner une commande
          </label>
          <select
            value={selectedOrder.id}
            onChange={(e) => setSelectedOrder(mockOrders.find(o => o.id === e.target.value) || null)}
            className="w-full md:w-auto px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70] font-semibold"
          >
            {mockOrders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.id} - {formatFCFA(order.total)} - {order.status}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de la commande */}
          <div className="lg:col-span-1 space-y-4">
            {/* Carte principale */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-[#4A2C2A] mb-4">Détails de la commande</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Numéro de suivi</div>
                  <div className="font-semibold text-gray-800">{selectedOrder.trackingNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date de commande</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Mode de transport</div>
                  <div className="flex items-center gap-2">
                    {selectedOrder.shippingMethod === 'aerien' && <Plane className="w-4 h-4 text-blue-600" />}
                    {selectedOrder.shippingMethod === 'maritime' && <Ship className="w-4 h-4 text-blue-600" />}
                    {selectedOrder.shippingMethod === 'express' && <Plane className="w-4 h-4 text-green-600" />}
                    <span className="font-semibold text-gray-800">
                      {selectedOrder.shippingMethod === 'aerien' ? 'Aérien' :
                       selectedOrder.shippingMethod === 'maritime' ? 'Maritime' : 'Express'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Livraison estimée</div>
                  <div className="font-semibold text-[#1BAA70]">
                    {new Date(selectedOrder.estimatedDelivery || '').toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Adresse de livraison</div>
                  <div className="font-semibold text-gray-800">{selectedOrder.shippingAddress}</div>
                </div>
              </div>
            </div>

            {/* Statut de paiement */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-[#4A2C2A] mb-4">Paiement</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant total</span>
                  <span className="font-bold text-gray-800">{formatFCFA(selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant payé</span>
                  <span className="font-bold text-green-600">{formatFCFA(selectedOrder.paidAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reste à payer</span>
                  <span className="font-bold text-orange-600">
                    {formatFCFA(selectedOrder.total - selectedOrder.paidAmount)}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedOrder.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : selectedOrder.paymentStatus === 'partial'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedOrder.paymentStatus === 'completed' ? '✓ Payé' :
                     selectedOrder.paymentStatus === 'partial' ? '◐ Partiel' : '✗ Non payé'}
                  </span>
                </div>
              </div>
            </div>

            {/* Info fournisseur (si produit asiatique) */}
            {selectedOrder.isAsianProduct && selectedOrder.supplierInfo && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-2">🌏 Produit d'Asie</h4>
                <div className="text-sm space-y-1">
                  <div className="text-gray-700">
                    <span className="font-semibold">Fournisseur:</span> {selectedOrder.supplierInfo.name}
                  </div>
                  {selectedOrder.supplierInfo.orderConfirmedDate && (
                    <div className="text-gray-600">
                      Confirmé le {new Date(selectedOrder.supplierInfo.orderConfirmedDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timeline de suivi */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-[#4A2C2A] mb-6">Progression de la commande</h3>

              {/* Barre de progression */}
              <div className="mb-8">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1BAA70] to-[#158f5d] transition-all duration-500"
                    style={{ width: `${((currentStatusIndex + 1) / (selectedOrder.statusHistory?.length || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                {selectedOrder.statusHistory?.map((update, index) => {
                  const config = statusConfig[update.status];
                  const Icon = config.icon;
                  const isLast = index === selectedOrder.statusHistory!.length - 1;
                  const isCompleted = index <= currentStatusIndex;

                  return (
                    <div key={index} className="relative">
                      {!isLast && (
                        <div
                          className={`absolute left-6 top-12 bottom-0 w-0.5 ${
                            isCompleted ? 'bg-[#1BAA70]' : 'bg-gray-300'
                          }`}
                        />
                      )}

                      <div className="flex gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? config.color : 'bg-gray-300'
                        } text-white transition-all duration-300 ${
                          isLast ? 'ring-4 ring-green-200' : ''
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                {config.label}
                              </h4>
                              <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                                {update.description}
                              </p>
                              {update.location && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                  <MapPin className="w-3 h-3" />
                                  {update.location}
                                </div>
                              )}
                            </div>
                            <div className={`text-sm ${isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(update.date).toLocaleString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message de statut actuel */}
              {selectedOrder.detailedStatus && selectedOrder.detailedStatus !== 'delivered' && (
                <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">Statut actuel</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Votre colis est actuellement en transit. La livraison est estimée au{' '}
                        <span className="font-semibold">
                          {new Date(selectedOrder.estimatedDelivery || '').toLocaleDateString('fr-FR')}
                        </span>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.detailedStatus === 'delivered' && (
                <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Commande livrée !</p>
                      <p className="text-sm text-green-700 mt-1">
                        Votre commande a été livrée avec succès. Merci de votre confiance!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
