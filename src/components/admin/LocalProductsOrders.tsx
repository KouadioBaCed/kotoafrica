import { useState, useMemo } from 'react';
import { Package, Filter, ChevronLeft, ChevronRight, MapPin, Calendar, DollarSign, User } from 'lucide-react';
import { mockOrders, mockUsers } from '../../data/mockData';

export function LocalProductsOrders() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer seulement les commandes de produits locaux
  // TODO: Ajouter un champ isLocal dans Order type pour identifier les produits locaux
  const localOrders = mockOrders.filter(order => {
    // Pour le moment, on considère les commandes avec shipping_method !== 'aerien' comme locales
    return order.shippingMethod !== 'aerien' && order.shippingMethod !== 'express';
  });

  // Filtrer par statut
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return localOrders;
    return localOrders.filter(order => order.status === statusFilter);
  }, [statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Statistiques
  const stats = {
    total: localOrders.length,
    revenue: localOrders.reduce((sum, order) => sum + order.total, 0),
    pending: localOrders.filter(o => o.status === 'pending').length,
    completed: localOrders.filter(o => o.status === 'delivered').length,
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
    };

    const { label, color } = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#4A2C2A] mb-2">Commandes de Produits Locaux</h2>
        <p className="text-gray-600">Gérez les commandes de produits fabriqués localement en Côte d'Ivoire</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-[#1BAA70] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total commandes</div>
              <div className="text-3xl font-bold text-[#1BAA70]">{stats.total}</div>
            </div>
            <Package className="w-10 h-10 text-[#1BAA70]" />
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Revenu total</div>
              <div className="text-2xl font-bold text-green-700">
                {stats.revenue.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">En attente</div>
              <div className="text-3xl font-bold text-yellow-700">{stats.pending}</div>
            </div>
            <Package className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Complétées</div>
              <div className="text-3xl font-bold text-green-700">{stats.completed}</div>
            </div>
            <Package className="w-10 h-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-[#4A2C2A]" />
          <span className="text-sm font-semibold text-[#4A2C2A]">Filtrer par statut</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#1BAA70] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes ({localOrders.length})
          </button>
          <button
            onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            En attente ({stats.pending})
          </button>
          <button
            onClick={() => { setStatusFilter('delivered'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'delivered'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            Livrées ({stats.completed})
          </button>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">N° Commande</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Livraison</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Montant</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Statut</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
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
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-semibold text-[#4A2C2A]">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.customId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            <p className="text-gray-700 font-medium">Locale</p>
                            <p className="text-gray-500 text-xs">Côte d'Ivoire</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-[#1BAA70]">
                          {order.total.toLocaleString('fr-FR')} FCFA
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(order.status)}
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
          <div className="border-t p-4 flex items-center justify-between">
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
    </div>
  );
}
