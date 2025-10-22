import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import {
  ShoppingCart,
  MapPin,
  Clock,
  Package,
  Star,
  Truck,
  ArrowLeft,
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  origin: 'africa' | 'asia';
  stock_quantity: number;
  weight_kg: number;
  delivery_days: number;
  images: string[];
  is_available: boolean;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
};

type ProductDetailPageProps = {
  productId: string;
  onNavigate: (page: string) => void;
};

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const { addToCart } = useCart();
  const { user, profile } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [productId]);

  async function loadProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(first_name, last_name)')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }

  async function handleAddToCart() {
    if (!user || !product) return;

    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      alert('Produit ajouté au panier !');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FFD835] border-t-[#4A2C2A]"></div>
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Produit non trouvé</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#1BAA70] text-white px-6 py-3 rounded-lg hover:bg-[#158f5d] transition font-semibold"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const originLabel = product.origin === 'africa' ? 'Afrique' : 'Asie';
  const originColor = product.origin === 'africa' ? 'bg-[#1BAA70]' : 'bg-[#1C3D73]';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 text-[#4A2C2A] hover:text-[#1C3D73] mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au catalogue</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Image principale */}
            <div className="relative">
              <img
                src={product.images[selectedImageIndex]}
                alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                className="w-full h-96 object-cover"
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Galerie de miniatures */}
            {product.images.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                        selectedImageIndex === index
                          ? 'ring-4 ring-[#1BAA70] scale-105'
                          : 'ring-2 ring-gray-200 hover:ring-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Miniature ${index + 1}`}
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="inline-block bg-[#FFD835] text-[#4A2C2A] text-sm font-semibold px-4 py-2 rounded-full">
                {product.category}
              </span>
              <span
                className={`${originColor} text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1`}
              >
                <MapPin className="w-4 h-4" />
                <span>{originLabel}</span>
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-[#4A2C2A] mb-4">
              {product.name}
            </h1>

            {reviews.length > 0 && (
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating)
                          ? 'text-[#FFD835] fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} avis)
                </span>
              </div>
            )}

            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

            <div className="bg-[#FFF9E6] border-2 border-[#FFD835] rounded-lg p-6 mb-6">
              <div className="text-4xl font-extrabold text-[#1BAA70] mb-2">
                {product.price.toLocaleString()} <span className="text-2xl">FCFA</span>
              </div>
              <p className="text-sm text-gray-600">Prix unitaire</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Livraison</span>
                </div>
                <p className="font-bold text-[#4A2C2A]">{product.delivery_days} jours</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">En stock</span>
                </div>
                <p className="font-bold text-[#4A2C2A]">{product.stock_quantity} unités</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm">Poids</span>
                </div>
                <p className="font-bold text-[#4A2C2A]">{product.weight_kg} kg</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Origine</span>
                </div>
                <p className="font-bold text-[#4A2C2A]">{originLabel}</p>
              </div>
            </div>

            {user && product.is_available && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantité
                </label>
                <div className="flex items-center space-x-4 mb-6">
                  <input
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70] text-center font-bold"
                  />
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="flex-1 bg-[#1BAA70] text-white py-3 rounded-lg hover:bg-[#158f5d] transition font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{adding ? 'Ajout...' : 'Ajouter au panier'}</span>
                  </button>
                </div>
              </div>
            )}

            {!product.is_available && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                Produit actuellement indisponible
              </div>
            )}
          </div>
        </div>

        {/* Section Description Détaillée */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-[#4A2C2A] mb-6 border-b-2 border-[#FFD835] pb-3">
            Description détaillée
          </h2>

          <div className="space-y-6">
            {/* Description principale */}
            <div>
              <h3 className="text-xl font-semibold text-[#1C3D73] mb-3">À propos du produit</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Caractéristiques détaillées */}
            <div>
              <h3 className="text-xl font-semibold text-[#1C3D73] mb-3">Caractéristiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Package className="w-6 h-6 text-[#1BAA70] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Catégorie</p>
                    <p className="text-gray-600">{product.category}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                  <MapPin className="w-6 h-6 text-[#1BAA70] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Origine</p>
                    <p className="text-gray-600">{originLabel}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Truck className="w-6 h-6 text-[#1BAA70] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Poids</p>
                    <p className="text-gray-600">{product.weight_kg} kg par unité</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Clock className="w-6 h-6 text-[#1BAA70] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Délai de livraison</p>
                    <p className="text-gray-600">{product.delivery_days} jours ouvrés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations de livraison */}
            <div className="bg-[#FFF9E6] border-l-4 border-[#FFD835] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#1C3D73] mb-3 flex items-center space-x-2">
                <Truck className="w-6 h-6" />
                <span>Informations de livraison</span>
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-[#1BAA70] font-bold">•</span>
                  <span>Livraison disponible dans toute la région</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#1BAA70] font-bold">•</span>
                  <span>Délai estimé : {product.delivery_days} jours ouvrés après confirmation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#1BAA70] font-bold">•</span>
                  <span>Emballage soigné pour garantir la qualité du produit</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#1BAA70] font-bold">•</span>
                  <span>Suivi de commande disponible en temps réel</span>
                </li>
              </ul>
            </div>

            {/* Disponibilité et stock */}
            <div>
              <h3 className="text-xl font-semibold text-[#1C3D73] mb-3">Disponibilité</h3>
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-full font-semibold ${
                  product.is_available && product.stock_quantity > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.is_available && product.stock_quantity > 0
                    ? `En stock - ${product.stock_quantity} unités disponibles`
                    : 'Rupture de stock'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#4A2C2A] mb-6">
            Avis clients ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">Aucun avis pour le moment</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.profiles.first_name} {review.profiles.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-[#FFD835] fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
