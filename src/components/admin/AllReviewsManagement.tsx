import { useState, useMemo } from 'react';
import { Star, Edit, Trash2, X, Save, Filter, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import type { Review } from '../../types';

// Données mock - tous les avis (pending, approved, rejected)
const mockAllReviews: Review[] = [
  {
    id: '1',
    userId: 'u1',
    productId: 'p1',
    rating: 5,
    comment: 'Excellent produit! La qualité est au rendez-vous.',
    createdAt: '2025-01-10T14:30:00',
    userName: 'Kouadio Jean',
    status: 'approved',
    moderatedAt: '2025-01-10T15:00:00',
  },
  {
    id: '2',
    userId: 'u2',
    productId: 'p1',
    rating: 4,
    comment: 'Bon produit, conforme à la description.',
    createdAt: '2025-01-08T10:20:00',
    userName: 'Diallo Fatou',
    status: 'approved',
    moderatedAt: '2025-01-08T11:00:00',
  },
  {
    id: '3',
    userId: 'u3',
    productId: 'p2',
    rating: 5,
    comment: 'Très satisfait de mon achat. Je recommande vivement!',
    createdAt: '2025-01-05T16:45:00',
    userName: 'Yao Marie',
    status: 'approved',
    moderatedAt: '2025-01-05T17:00:00',
  },
  {
    id: '4',
    userId: 'u4',
    productId: 'p2',
    rating: 5,
    comment: 'Produit conforme à mes attentes. Très bonne qualité!',
    createdAt: '2025-01-16T10:30:00',
    userName: 'Koné Ibrahim',
    status: 'pending',
  },
  {
    id: '5',
    userId: 'u5',
    productId: 'p3',
    rating: 3,
    comment: 'Le produit est correct mais j\'ai eu un petit problème avec l\'emballage.',
    createdAt: '2025-01-16T09:15:00',
    userName: 'Traoré Awa',
    status: 'pending',
  },
];

export function AllReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>(mockAllReviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les avis
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (statusFilter !== 'all' && review.status !== statusFilter) return false;
      if (ratingFilter !== 'all' && review.rating.toString() !== ratingFilter) return false;
      return true;
    });
  }, [reviews, statusFilter, ratingFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, currentPage]);

  // Statistiques
  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0',
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleSaveEdit = (reviewId: string) => {
    setReviews(prev => prev.map(r =>
      r.id === reviewId
        ? { ...r, rating: editForm.rating, comment: editForm.comment }
        : r
    ));
    setEditingId(null);
    // TODO: Appeler l'API Supabase pour sauvegarder
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ rating: 5, comment: '' });
  };

  const handleDelete = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setReviews(prev => prev.filter(r => r.id !== reviewToDelete));
    setShowDeleteModal(false);
    setReviewToDelete(null);
    // TODO: Appeler l'API Supabase pour supprimer
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approuvé', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800' },
    };

    const { label, color } = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#4A2C2A] mb-2">Tous les Avis Clients</h2>
        <p className="text-gray-600">Consultez, modifiez et gérez tous les avis clients</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border-2 border-[#1BAA70] rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">Total avis</div>
          <div className="text-3xl font-bold text-[#1BAA70]">{stats.total}</div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">Note moyenne</div>
          <div className="text-3xl font-bold text-[#FFD835]">{stats.averageRating}/5</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">Approuvés</div>
          <div className="text-3xl font-bold text-green-700">{stats.approved}</div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">En attente</div>
          <div className="text-3xl font-bold text-yellow-700">{stats.pending}</div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">Rejetés</div>
          <div className="text-3xl font-bold text-red-700">{stats.rejected}</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-[#4A2C2A]" />
          <span className="text-sm font-semibold text-[#4A2C2A]">Filtres</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="approved">Approuvés</option>
              <option value="pending">En attente</option>
              <option value="rejected">Rejetés</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <select
              value={ratingFilter}
              onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>
        </div>
        {(statusFilter !== 'all' || ratingFilter !== 'all') && (
          <button
            onClick={() => {
              setStatusFilter('all');
              setRatingFilter('all');
              setCurrentPage(1);
            }}
            className="mt-3 text-sm text-[#1BAA70] hover:text-[#158f5d] font-semibold"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {paginatedReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun avis trouvé</p>
          </div>
        ) : (
          paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#1BAA70] transition"
            >
              {editingId === review.id ? (
                // Mode édition
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-[#4A2C2A]">Modifier l'avis</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(review.id)}
                        className="px-4 py-2 bg-[#1BAA70] text-white rounded-lg hover:bg-[#158f5d] transition font-semibold flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Sauvegarder
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Note
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 transition ${
                                star <= editForm.rating
                                  ? 'fill-[#FFD835] text-[#FFD835]'
                                  : 'text-gray-300 hover:text-[#FFD835]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Commentaire
                      </label>
                      <textarea
                        value={editForm.comment}
                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Mode affichage
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-[#1BAA70] text-white flex items-center justify-center font-bold text-lg">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{review.userName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleString('fr-FR')}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ID Produit: {review.productId} • ID Avis: {review.id}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating
                                ? 'fill-[#FFD835] text-[#FFD835]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-bold text-gray-700">{review.rating}/5</span>
                      </div>
                      {getStatusBadge(review.status)}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {review.moderatedAt && (
                        <span className="text-xs text-gray-500">
                          Modéré le {new Date(review.moderatedAt).toLocaleDateString('fr-FR')}
                          {review.moderatedBy && ` par ${review.moderatedBy}`}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages} ({filteredReviews.length} résultat{filteredReviews.length > 1 ? 's' : ''})
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

      {/* Modal de suppression */}
      {showDeleteModal && reviewToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#4A2C2A]">Supprimer cet avis</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement cet avis ? Cette action est irréversible.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
