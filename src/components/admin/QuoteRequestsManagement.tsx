import { useState, useMemo } from 'react';
import { Eye, X, Filter, ChevronLeft, ChevronRight, MessageSquare, CheckCircle, Clock, Phone, User, Package } from 'lucide-react';

type QuoteRequest = {
  id: string;
  fullName: string;
  whatsapp: string;
  description: string;
  color: string;
  quantity: number;
  shoeSize: string;
  clothingSize: string;
  gender: 'homme' | 'femme' | 'enfant';
  photoUrl?: string;
  status: 'pending' | 'processing' | 'quoted' | 'completed' | 'cancelled';
  createdAt: string;
};

// Données mock
const mockQuoteRequests: QuoteRequest[] = [
  {
    id: 'QR-001',
    fullName: 'Kouadio Jean-Pierre',
    whatsapp: '+225 07 12 34 56 78',
    description: 'Chemise en coton blanc avec broderie personnalisée',
    color: 'Blanc',
    quantity: 5,
    shoeSize: '',
    clothingSize: 'L',
    gender: 'homme',
    status: 'pending',
    createdAt: '2025-01-18T10:30:00',
  },
  {
    id: 'QR-002',
    fullName: 'Traoré Aminata',
    whatsapp: '+225 05 98 76 54 32',
    description: 'Chaussures de sport Nike Air Max 270',
    color: 'Noir et rouge',
    quantity: 2,
    shoeSize: '38',
    clothingSize: '',
    gender: 'femme',
    status: 'processing',
    createdAt: '2025-01-17T14:15:00',
  },
  {
    id: 'QR-003',
    fullName: 'Yao Marie',
    whatsapp: '+225 01 23 45 67 89',
    description: 'Ensemble pagne pour mariage traditionnel',
    color: 'Wax multicolore',
    quantity: 1,
    shoeSize: '',
    clothingSize: 'M',
    gender: 'femme',
    status: 'quoted',
    createdAt: '2025-01-16T09:00:00',
  },
];

export function QuoteRequestsManagement() {
  const [requests, setRequests] = useState<QuoteRequest[]>(mockQuoteRequests);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les demandes
  const filteredRequests = useMemo(() => {
    if (statusFilter === 'all') return requests;
    return requests.filter(req => req.status === statusFilter);
  }, [requests, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

  // Statistiques
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    processing: requests.filter(r => r.status === 'processing').length,
    quoted: requests.filter(r => r.status === 'quoted').length,
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: Package },
      quoted: { label: 'Devis envoyé', color: 'bg-purple-100 text-purple-800', icon: MessageSquare },
      completed: { label: 'Complété', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: X },
    };

    const { label, color, icon: Icon } = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
        <Icon className="w-4 h-4" />
        {label}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#4A2C2A] mb-2">Demandes de Devis</h2>
        <p className="text-gray-600">Gérez les demandes de devis personnalisées des clients</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-[#1BAA70] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total demandes</div>
              <div className="text-3xl font-bold text-[#1BAA70]">{stats.total}</div>
            </div>
            <MessageSquare className="w-10 h-10 text-[#1BAA70]" />
          </div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">En attente</div>
              <div className="text-3xl font-bold text-yellow-700">{stats.pending}</div>
            </div>
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">En cours</div>
              <div className="text-3xl font-bold text-blue-700">{stats.processing}</div>
            </div>
            <Package className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Devis envoyés</div>
              <div className="text-3xl font-bold text-purple-700">{stats.quoted}</div>
            </div>
            <CheckCircle className="w-10 h-10 text-purple-600" />
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
            Toutes ({requests.length})
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
            onClick={() => { setStatusFilter('processing'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'processing'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            En cours ({stats.processing})
          </button>
          <button
            onClick={() => { setStatusFilter('quoted'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'quoted'
                ? 'bg-purple-500 text-white'
                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
          >
            Devis envoyés ({stats.quoted})
          </button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Produit demandé</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Quantité</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-[#4A2C2A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Aucune demande trouvée
                  </td>
                </tr>
              ) : (
                paginatedRequests.map(request => (
                  <tr key={request.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#4A2C2A]">{request.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-semibold text-[#4A2C2A]">{request.fullName}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {request.whatsapp}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                        {request.description}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-[#1BAA70]">{request.quantity}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages} ({filteredRequests.length} résultat{filteredRequests.length > 1 ? 's' : ''})
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

      {/* Modal de détails */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#4A2C2A]">Détails de la demande</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations client */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-[#4A2C2A] mb-3">Informations client</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Nom complet</div>
                    <div className="font-semibold text-gray-800">{selectedRequest.fullName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">WhatsApp</div>
                    <div className="font-semibold text-[#1BAA70]">{selectedRequest.whatsapp}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Pour</div>
                    <div className="font-semibold text-gray-800 capitalize">{selectedRequest.gender}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Date de demande</div>
                    <div className="font-semibold text-gray-800">
                      {new Date(selectedRequest.createdAt).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails du produit */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-[#4A2C2A] mb-3">Détails du produit</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Description</div>
                    <div className="font-semibold text-gray-800">{selectedRequest.description}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Couleur</div>
                      <div className="font-semibold text-gray-800">{selectedRequest.color || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Quantité</div>
                      <div className="font-semibold text-[#1BAA70] text-xl">{selectedRequest.quantity}</div>
                    </div>
                  </div>
                  {selectedRequest.shoeSize && (
                    <div>
                      <div className="text-sm text-gray-600">Pointure</div>
                      <div className="font-semibold text-gray-800">{selectedRequest.shoeSize}</div>
                    </div>
                  )}
                  {selectedRequest.clothingSize && (
                    <div>
                      <div className="text-sm text-gray-600">Taille</div>
                      <div className="font-semibold text-gray-800">{selectedRequest.clothingSize}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo */}
              {selectedRequest.photoUrl && (
                <div>
                  <h3 className="font-bold text-[#4A2C2A] mb-3">Photo du produit</h3>
                  <img
                    src={selectedRequest.photoUrl}
                    alt="Produit demandé"
                    className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}

              {/* Actions rapides */}
              <div className="border-t pt-4">
                <h3 className="font-bold text-[#4A2C2A] mb-3">Actions</h3>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/${selectedRequest.whatsapp.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-center"
                  >
                    Contacter sur WhatsApp
                  </a>
                  <button className="flex-1 bg-[#1BAA70] text-white py-3 rounded-lg hover:bg-[#158f5d] transition font-semibold">
                    Envoyer un devis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
