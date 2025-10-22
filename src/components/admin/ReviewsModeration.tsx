import { useState } from 'react';
import { CheckCircle, XCircle, Star, Clock, Eye, Trash2, MessageSquare, X, TrendingUp } from 'lucide-react';
import type { Review } from '../../types';

// Données mock pour le développement
const mockPendingReviews: Review[] = [
  {
    id: '4',
    userId: 'u4',
    productId: 'p2',
    rating: 5,
    comment: 'Produit conforme à mes attentes. Très bonne qualité!',
    createdAt: '2025-01-16T10:30:00',
    userName: 'Koné Ibrahim',
    userAvatar: undefined,
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
    userAvatar: undefined,
    status: 'pending',
  },
  {
    id: '6',
    userId: 'u6',
    productId: 'p1',
    rating: 2,
    comment: 'Déçu par la qualité. Le produit ne correspond pas aux photos.',
    createdAt: '2025-01-15T16:20:00',
    userName: 'Bamba Karim',
    userAvatar: undefined,
    status: 'pending',
  },
];

const mockApprovedReviews: Review[] = [
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
    moderatedBy: 'Admin',
  },
];

const mockRejectedReviews: Review[] = [
  {
    id: '7',
    userId: 'u7',
    productId: 'p4',
    rating: 1,
    comment: 'Contenu inapproprié volontairement rejeté pour test',
    createdAt: '2025-01-14T12:00:00',
    userName: 'Test User',
    status: 'rejected',
    moderatedAt: '2025-01-14T12:30:00',
    moderatedBy: 'Admin',
  },
];

export function ReviewsModeration() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [reviewToReply, setReviewToReply] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleApprove = (reviewId: string) => {
    // TODO: Implémenter l'approbation
    alert(`Avis ${reviewId} approuvé`);
    setSelectedReview(null);
  };

  const handleReject = (reviewId: string) => {
    // TODO: Implémenter le rejet
    alert(`Avis ${reviewId} rejeté`);
    setSelectedReview(null);
  };

  const handleDelete = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // TODO: Implémenter la suppression
    console.log(`Suppression de l'avis ${reviewToDelete}`);
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const handleReply = (review: Review) => {
    setReviewToReply(review);
    setReplyText('');
    setShowReplyModal(true);
  };

  const submitReply = () => {
    // TODO: Implémenter l'envoi de la réponse
    console.log(`Réponse à l'avis ${reviewToReply?.id}: ${replyText}`);
    setShowReplyModal(false);
    setReviewToReply(null);
    setReplyText('');
  };

  // Calcul des statistiques de satisfaction
  const allReviews = [...mockPendingReviews, ...mockApprovedReviews];
  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0';
  const ratingDistribution = {
    5: allReviews.filter(r => r.rating === 5).length,
    4: allReviews.filter(r => r.rating === 4).length,
    3: allReviews.filter(r => r.rating === 3).length,
    2: allReviews.filter(r => r.rating === 2).length,
    1: allReviews.filter(r => r.rating === 1).length,
  };
  const satisfactionRate = totalReviews > 0
    ? ((allReviews.filter(r => r.rating >= 4).length / totalReviews) * 100).toFixed(0)
    : '0';

  const reviews = activeTab === 'pending'
    ? mockPendingReviews
    : activeTab === 'approved'
    ? mockApprovedReviews
    : mockRejectedReviews;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#4A2C2A] mb-2">Modération des avis</h2>
        <p className="text-gray-600">Gérez les avis clients avant leur publication</p>
      </div>

      {/* Statistiques de satisfaction globale */}
      <div className="bg-gradient-to-br from-[#1BAA70] to-[#158f5d] rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-xl font-bold">Satisfaction Globale</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm opacity-90 mb-1">Note moyenne</div>
            <div className="text-4xl font-extrabold">{averageRating}/5</div>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(parseFloat(averageRating))
                      ? 'fill-[#FFD835] text-[#FFD835]'
                      : 'text-white opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-1">Taux de satisfaction</div>
            <div className="text-4xl font-extrabold">{satisfactionRate}%</div>
            <div className="text-xs opacity-75 mt-1">Avis 4-5 étoiles</div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-1">Total d'avis</div>
            <div className="text-4xl font-extrabold">{totalReviews}</div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-3">Distribution</div>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{rating}★</span>
                  <div className="flex-1 bg-white bg-opacity-30 rounded-full h-2">
                    <div
                      className="bg-[#FFD835] h-full rounded-full"
                      style={{
                        width: `${totalReviews > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right">{ratingDistribution[rating as keyof typeof ratingDistribution]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">En attente</div>
              <div className="text-3xl font-bold text-yellow-700">{mockPendingReviews.length}</div>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Approuvés</div>
              <div className="text-3xl font-bold text-green-700">{mockApprovedReviews.length}</div>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Rejetés</div>
              <div className="text-3xl font-bold text-red-700">{mockRejectedReviews.length}</div>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b flex gap-1 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'pending'
              ? 'border-b-2 border-[#1BAA70] text-[#1BAA70]'
              : 'text-gray-600 hover:text-[#1BAA70]'
          }`}
        >
          En attente ({mockPendingReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'approved'
              ? 'border-b-2 border-[#1BAA70] text-[#1BAA70]'
              : 'text-gray-600 hover:text-[#1BAA70]'
          }`}
        >
          Approuvés ({mockApprovedReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'rejected'
              ? 'border-b-2 border-[#1BAA70] text-[#1BAA70]'
              : 'text-gray-600 hover:text-[#1BAA70]'
          }`}
        >
          Rejetés ({mockRejectedReviews.length})
        </button>
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun avis dans cette catégorie</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#1BAA70] transition"
            >
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
                    <div className="text-xs text-gray-400">ID Produit: {review.productId}</div>
                  </div>
                </div>
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
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {/* Statut et actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {review.status === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      ⏳ En attente
                    </span>
                  )}
                  {review.status === 'approved' && (
                    <>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        ✓ Approuvé
                      </span>
                      {review.moderatedAt && (
                        <span className="text-xs text-gray-500">
                          le {new Date(review.moderatedAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </>
                  )}
                  {review.status === 'rejected' && (
                    <>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        ✗ Rejeté
                      </span>
                      {review.moderatedAt && (
                        <span className="text-xs text-gray-500">
                          le {new Date(review.moderatedAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approuver
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeter
                      </button>
                    </>
                  )}

                  {review.status === 'approved' && (
                    <button
                      onClick={() => handleReply(review)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Répondre
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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

      {/* Modal de réponse */}
      {showReplyModal && reviewToReply && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#4A2C2A]">Répondre à l'avis</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Avis original */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-semibold">{reviewToReply.userName}</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= reviewToReply.rating
                          ? 'fill-[#FFD835] text-[#FFD835]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{reviewToReply.comment}</p>
            </div>

            {/* Zone de réponse */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Votre réponse
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Écrivez votre réponse..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={submitReply}
                disabled={!replyText.trim()}
                className="flex-1 px-4 py-3 bg-[#1BAA70] text-white rounded-lg hover:bg-[#158f5d] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
