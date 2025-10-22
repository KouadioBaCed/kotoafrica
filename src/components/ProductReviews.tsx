import { useState } from 'react';
import { Star, Send, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';
import type { Review } from '../types';

type ProductReviewsProps = {
  productId: string;
  productName: string;
};

// Données mock pour le développement
const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'u1',
    productId: 'p1',
    rating: 5,
    comment: 'Excellent produit! La qualité est au rendez-vous. Livraison rapide et bien emballé.',
    createdAt: '2025-01-10T14:30:00',
    userName: 'Kouadio Jean',
    userAvatar: undefined,
    status: 'approved',
    moderatedAt: '2025-01-10T15:00:00',
  },
  {
    id: '2',
    userId: 'u2',
    productId: 'p1',
    rating: 4,
    comment: 'Bon produit, conforme à la description. Juste un petit délai de livraison.',
    createdAt: '2025-01-08T10:20:00',
    userName: 'Diallo Fatou',
    userAvatar: undefined,
    status: 'approved',
    moderatedAt: '2025-01-08T11:00:00',
  },
  {
    id: '3',
    userId: 'u3',
    productId: 'p1',
    rating: 5,
    comment: 'Très satisfait de mon achat. Je recommande vivement!',
    createdAt: '2025-01-05T16:45:00',
    userName: 'Yao Marie',
    userAvatar: undefined,
    status: 'approved',
    moderatedAt: '2025-01-05T17:00:00',
  },
];

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Filtrer uniquement les avis approuvés
  const approvedReviews = mockReviews.filter(r => r.status === 'approved');

  // Calculer la moyenne des notes
  const averageRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitting(false);
    setSubmitted(true);
    setShowReviewForm(false);

    // Reset après 3 secondes
    setTimeout(() => {
      setSubmitted(false);
      setRating(5);
      setComment('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#4A2C2A]">Avis clients</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-[#FFD835] text-[#FFD835]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-700">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500">
              ({approvedReviews.length} avis)
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-[#1BAA70] text-white px-6 py-3 rounded-lg hover:bg-[#158f5d] transition font-semibold"
        >
          Laisser un avis
        </button>
      </div>

      {/* Message de succès */}
      {submitted && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Merci pour votre avis!</p>
              <p className="text-sm text-green-600">
                Votre avis sera publié après validation par notre équipe.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire d'avis */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-bold text-[#4A2C2A] mb-4">
            Votre avis sur "{productName}"
          </h4>

          {/* Notation */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Votre note
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition ${
                      star <= rating
                        ? 'fill-[#FFD835] text-[#FFD835]'
                        : 'text-gray-300 hover:text-[#FFD835]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Commentaire */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Votre commentaire
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
              placeholder="Partagez votre expérience avec ce produit..."
            />
          </div>

          {/* Note sur la modération */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Votre avis sera vérifié par notre équipe avant publication. Nous nous engageons à publier tous les avis authentiques, qu'ils soient positifs ou négatifs.
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="flex-1 bg-[#1BAA70] text-white py-3 rounded-lg hover:bg-[#158f5d] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Envoi en cours...' : 'Publier mon avis'}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste des avis approuvés */}
      <div className="space-y-4">
        {approvedReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun avis pour le moment. Soyez le premier à donner votre avis!</p>
          </div>
        ) : (
          approvedReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1BAA70] text-white flex items-center justify-center font-bold text-lg">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{review.userName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-[#FFD835] text-[#FFD835]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>

              {/* Badge vérifié */}
              <div className="mt-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Avis vérifié</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
