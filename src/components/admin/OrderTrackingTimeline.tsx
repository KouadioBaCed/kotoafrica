import { Check, Clock, Package, Plane, Ship, Truck, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Order, OrderDetailedStatus, ShippingMethod } from '../../types';

interface OrderTrackingTimelineProps {
  order: Order;
}

const getShippingMethodInfo = (method?: ShippingMethod) => {
  switch (method) {
    case 'maritime':
      return { icon: Ship, label: 'Maritime', duration: '45-60 jours', color: 'text-blue-600 bg-blue-50' };
    case 'aerien':
      return { icon: Plane, label: 'Aérien', duration: '7-15 jours', color: 'text-purple-600 bg-purple-50' };
    case 'express':
      return { icon: Zap, label: 'Express', duration: '3-7 jours', color: 'text-orange-600 bg-orange-50' };
    default:
      return { icon: Truck, label: 'Standard', duration: 'À définir', color: 'text-gray-600 bg-gray-50' };
  }
};

const getStatusInfo = (status: OrderDetailedStatus) => {
  const statusMap: Record<OrderDetailedStatus, { label: string; color: string }> = {
    order_placed: { label: 'Commande passée', color: 'bg-yellow-500' },
    supplier_contacted: { label: 'Fournisseur contacté', color: 'bg-blue-500' },
    order_processing: { label: 'En traitement', color: 'bg-indigo-500' },
    picked_up: { label: 'Récupéré par KÔTO', color: 'bg-purple-500' },
    in_transit_to_africa: { label: 'En transit vers l\'Afrique', color: 'bg-cyan-500' },
    customs_clearance: { label: 'Dédouanement', color: 'bg-orange-500' },
    arrived_warehouse: { label: 'Arrivé à Abidjan', color: 'bg-teal-500' },
    out_for_delivery: { label: 'En livraison', color: 'bg-pink-500' },
    delivered: { label: 'Livré', color: 'bg-green-500' },
    cancelled: { label: 'Annulé', color: 'bg-red-500' },
  };
  return statusMap[status] || { label: status, color: 'bg-gray-500' };
};

const allStatuses: OrderDetailedStatus[] = [
  'order_placed',
  'supplier_contacted',
  'order_processing',
  'picked_up',
  'in_transit_to_africa',
  'customs_clearance',
  'arrived_warehouse',
  'out_for_delivery',
  'delivered',
];

export function OrderTrackingTimeline({ order }: OrderTrackingTimelineProps) {
  const shippingInfo = getShippingMethodInfo(order.shippingMethod);
  const ShippingIcon = shippingInfo.icon;

  // Détermine l'index du statut actuel
  const currentStatusIndex = order.detailedStatus
    ? allStatuses.indexOf(order.detailedStatus)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header avec mode de livraison */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#4A2C2A]">Suivi de la commande {order.trackingNumber}</h3>
          {order.shippingMethod && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${shippingInfo.color}`}>
              <ShippingIcon className="w-5 h-5" />
              <div>
                <p className="font-semibold">{shippingInfo.label}</p>
                <p className="text-xs opacity-80">{shippingInfo.duration}</p>
              </div>
            </div>
          )}
        </div>

        {/* Info fournisseur pour produits asiatiques */}
        {order.isAsianProduct && order.supplierInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Package className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Produit d'Asie - {order.supplierInfo.name}</p>
                {order.supplierInfo.contactDate && (
                  <p className="text-sm text-blue-700">
                    Fournisseur contacté le {new Date(order.supplierInfo.contactDate).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Date estimée de livraison */}
        {order.estimatedDelivery && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <p className="text-green-900">
              <span className="font-semibold">Livraison estimée :</span>{' '}
              {new Date(order.estimatedDelivery).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>

      {/* Timeline des statuts */}
      <div className="relative">
        {/* Ligne verticale */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {order.statusHistory && order.statusHistory.length > 0 ? (
            // Afficher l'historique réel si disponible
            order.statusHistory.map((update, index) => {
              const statusInfo = getStatusInfo(update.status);
              return (
                <div key={index} className="relative flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full ${statusInfo.color} flex items-center justify-center z-10`}>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-[#4A2C2A]">{statusInfo.label}</p>
                      <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                      {update.location && (
                        <p className="text-sm text-gray-500 mt-1">📍 {update.location}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(update.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Afficher les étapes par défaut basées sur le statut actuel
            allStatuses.map((status, index) => {
              const statusInfo = getStatusInfo(status);
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              // Pour les produits non-asiatiques, sauter certaines étapes
              if (!order.isAsianProduct && ['supplier_contacted', 'order_processing', 'picked_up'].includes(status)) {
                return null;
              }

              return (
                <div key={status} className="relative flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                      isCompleted
                        ? `${statusInfo.color} text-white`
                        : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-offset-2 ring-[#FFD835]' : ''}`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className={`font-semibold ${isCompleted ? 'text-[#4A2C2A]' : 'text-gray-400'}`}>
                      {statusInfo.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-[#1BAA70] mt-1">En cours...</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
