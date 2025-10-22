import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Package, Clock, CheckCircle, XCircle, Truck, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

type Order = {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_first_paid: boolean;
  payment_second_paid: boolean;
  created_at: string;
  order_items: Array<{
    quantity: number;
    unit_price: number;
    products: {
      name: string;
      images: string[];
    };
  }>;
};

export function OrdersPage() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (profile) {
      loadOrders();
    }
  }, [profile]);

  async function loadOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(quantity, unit_price, products(name, images))')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filtrer les commandes
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => order.status === statusFilter);
  }, [orders, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-[#1C3D73]" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-[#1BAA70]" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'shipping':
        return 'En cours d\'expédition';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FFD835] border-t-[#4A2C2A]"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Aucune commande</h2>
          <p className="text-gray-500">Vous n'avez pas encore passé de commande</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#4A2C2A] mb-2">Mes Commandes</h1>
          <p className="text-gray-600">
            {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtre par statut */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-4">
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
              Toutes
            </button>
            <button
              onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => { setStatusFilter('confirmed'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'confirmed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Confirmée
            </button>
            <button
              onClick={() => { setStatusFilter('shipping'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'shipping'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              En expédition
            </button>
            <button
              onClick={() => { setStatusFilter('delivered'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'delivered'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Livrée
            </button>
            <button
              onClick={() => { setStatusFilter('cancelled'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Annulée
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {paginatedOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#FFD835] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#4A2C2A] font-medium">Numéro de commande</p>
                    <p className="text-xl font-bold text-[#4A2C2A]">{order.order_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#4A2C2A] font-medium">Date</p>
                    <p className="text-lg font-semibold text-[#4A2C2A]">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="font-semibold">{getStatusLabel(order.status)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-[#1BAA70]">
                      {order.total.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Articles</h3>
                  <div className="space-y-3">
                    {order.order_items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.products.images[0]}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.products.name}</p>
                          <p className="text-sm text-gray-500">
                            Qté: {item.quantity} × {item.unit_price.toLocaleString()} FCFA
                          </p>
                        </div>
                        <p className="font-bold text-gray-800">
                          {(item.quantity * item.unit_price).toLocaleString()} FCFA
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Paiement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`rounded-lg p-4 ${
                        order.payment_first_paid
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Premier paiement (50%)
                        </span>
                        {order.payment_first_paid && (
                          <CheckCircle className="w-5 h-5 text-[#1BAA70]" />
                        )}
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        {(order.total / 2).toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.payment_first_paid ? 'Payé' : 'En attente'}
                      </p>
                    </div>

                    <div
                      className={`rounded-lg p-4 ${
                        order.payment_second_paid
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Second paiement (50%)
                        </span>
                        {order.payment_second_paid && (
                          <CheckCircle className="w-5 h-5 text-[#1BAA70]" />
                        )}
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        {(order.total / 2).toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.payment_second_paid ? 'Payé' : 'À la livraison'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
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
          </div>
        )}
      </div>
    </div>
  );
}
