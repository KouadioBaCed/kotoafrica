import { useState, useMemo } from 'react';
import { Eye, Truck, Package, CheckCircle, Clock, XCircle, X, Ship, Plane, Zap, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockOrders, mockUsers } from '../../data/mockData';
import { OrderTrackingTimeline } from './OrderTrackingTimeline';

export function OrdersManagement() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [shippingFilter, setShippingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const itemsPerPage = 10;

  const selectedOrder = selectedOrderId ? mockOrders.find(o => o.id === selectedOrderId) : null;

  const handleStatusUpdate = (orderId: string, currentStatus: string) => {
    setOrderToUpdate(orderId);
    setNewStatus(currentStatus);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = () => {
    // Ici, vous appellerez l'API pour mettre à jour le statut
    console.log(`Mise à jour de la commande ${orderToUpdate} vers le statut ${newStatus}`);
    setShowStatusModal(false);
    setOrderToUpdate(null);
    // TODO: Appeler l'API Supabase pour mettre à jour le statut
  };

  // Filtrer les commandes
  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      // Filtre par statut
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;

      // Filtre par paiement
      if (paymentFilter !== 'all' && order.paymentStatus !== paymentFilter) return false;

      // Filtre par mode d'envoi
      if (shippingFilter !== 'all' && order.shippingMethod !== shippingFilter) return false;

      // Recherche par numéro de commande ou nom client
      if (searchQuery) {
        const user = mockUsers.find(u => u.id === order.userId);
        const query = searchQuery.toLowerCase();
        const matchesTracking = order.trackingNumber?.toLowerCase().includes(query);
        const matchesUser = user?.name.toLowerCase().includes(query);
        if (!matchesTracking && !matchesUser) return false;
      }

      return true;
    });
  }, [statusFilter, paymentFilter, shippingFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Réinitialiser la page quand les filtres changent
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const getShippingMethodBadge = (method?: string) => {
    if (!method) {
      return <span className="text-xs text-gray-400">-</span>;
    }

    const methods = {
      maritime: { icon: Ship, label: 'Maritime', color: 'bg-blue-100 text-blue-800' },
      aerien: { icon: Plane, label: 'Aérien', color: 'bg-purple-100 text-purple-800' },
      express: { icon: Zap, label: 'Express', color: 'bg-orange-100 text-orange-800' },
    };

    const config = methods[method as keyof typeof methods];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: Truck },
      delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const statusConfig = {
      completed: { label: 'Complet', color: 'bg-green-100 text-green-800' },
      partial: { label: 'Partiel', color: 'bg-yellow-100 text-yellow-800' },
      pending: { label: 'En attente', color: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#4A2C2A] font-poppins">Gestion des Commandes</h2>
            <p className="text-gray-600 mt-1">
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} {statusFilter !== 'all' || paymentFilter !== 'all' || shippingFilter !== 'all' || searchQuery ? 'filtrée(s)' : 'au total'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#1BAA70] text-white rounded-lg hover:bg-[#158f5d] transition-colors font-semibold">
              Exporter
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#4A2C2A]">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
              <input
                type="text"
                placeholder="N° commande, client..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
              />
            </div>

            {/* Filtre par statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut commande</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>

            {/* Filtre par paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut paiement</label>
              <select
                value={paymentFilter}
                onChange={(e) => { setPaymentFilter(e.target.value); handleFilterChange(); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
              >
                <option value="all">Tous les paiements</option>
                <option value="completed">Complet</option>
                <option value="partial">Partiel</option>
                <option value="pending">En attente</option>
              </select>
            </div>

            {/* Filtre par mode d'envoi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode d'envoi</label>
              <select
                value={shippingFilter}
                onChange={(e) => { setShippingFilter(e.target.value); handleFilterChange(); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
              >
                <option value="all">Tous les modes</option>
                <option value="maritime">Maritime</option>
                <option value="aerien">Aérien</option>
                <option value="express">Express</option>
              </select>
            </div>
          </div>

          {/* Bouton réinitialiser */}
          {(statusFilter !== 'all' || paymentFilter !== 'all' || shippingFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setPaymentFilter('all');
                setShippingFilter('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-sm text-[#1BAA70] hover:text-[#158f5d] font-semibold"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-poppins font-semibold text-[#4A2C2A]">N° Commande</th>
                <th className="text-left py-3 px-4 font-poppins font-semibold text-[#4A2C2A]">Client</th>
                <th className="text-left py-3 px-4 font-poppins font-semibold text-[#4A2C2A]">Date</th>
                <th className="text-left py-3 px-4 font-poppins font-semibold text-[#4A2C2A]">Mode</th>
                <th className="text-left py-3 px-4 font-poppins font-semibold text-[#4A2C2A]">Montant</th>
                <th className="text-left py-3 px-4 font-poppins font-semibold text-[#4A2C2A]">Paiement</th>
                <th className="text-left py-3 px-4 font-poppins font-semibold text-[#4A2C2A]">Statut</th>
                <th className="text-left py-3 px-4 font-poppins font-semibold text-[#4A2C2A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(order => {
                const user = mockUsers.find(u => u.id === order.userId);
                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#1BAA70]" />
                        <span className="font-semibold text-[#4A2C2A]">{order.trackingNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-poppins font-semibold text-[#4A2C2A]">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.customId}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4">
                      {getShippingMethodBadge(order.shippingMethod)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-[#1BAA70]">
                        {order.total.toLocaleString('fr-FR')} FCFA
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {getPaymentBadge(order.paymentStatus)}
                        <p className="text-xs text-gray-600">
                          {order.paidAmount.toLocaleString('fr-FR')} FCFA payé
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, order.status)}
                          className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                          title="Mettre à jour le statut"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages} ({filteredOrders.length} résultat{filteredOrders.length > 1 ? 's' : ''})
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#1BAA70] text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques des commandes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-yellow-800">En attente</p>
              <p className="text-2xl font-bold text-yellow-900">
                {mockOrders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-800">Confirmées</p>
              <p className="text-2xl font-bold text-blue-900">
                {mockOrders.filter(o => o.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-800">Expédiées</p>
              <p className="text-2xl font-bold text-purple-900">
                {mockOrders.filter(o => o.status === 'shipped').length}
              </p>
            </div>
            <Truck className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-800">Livrées</p>
              <p className="text-2xl font-bold text-green-900">
                {mockOrders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Modal de suivi détaillé */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#4A2C2A]">Détails de la commande</h2>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <OrderTrackingTimeline order={selectedOrder} />

              {/* Informations supplémentaires */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-[#4A2C2A] mb-2">Informations client</h4>
                  <p className="text-sm text-gray-700">
                    {mockUsers.find(u => u.id === selectedOrder.userId)?.name}
                  </p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-[#4A2C2A] mb-2">Produits commandés</h4>
                  {selectedOrder.products.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="text-gray-700">
                        {item.product.name} x{item.quantity}
                      </p>
                      <p className="text-gray-600">{item.price.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de mise à jour du statut */}
      {showStatusModal && orderToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#4A2C2A]">Mettre à jour le statut</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Commande: <span className="font-semibold">{orderToUpdate}</span>
              </p>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nouveau statut
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="flex-1 px-4 py-3 bg-[#1BAA70] text-white rounded-lg hover:bg-[#158f5d] transition-colors font-semibold"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
