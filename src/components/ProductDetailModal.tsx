import { useState } from 'react';
import { X, ShoppingCart, MapPin, Clock, Package, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  origin: 'africa' | 'asia';
  stock_quantity: number;
  delivery_days: number;
  weight_kg: number;
  volume_m3: number;
  images: string[];
  is_available: boolean;
};

type ProductDetailModalProps = {
  product: Product;
  onClose: () => void;
};

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        weight_kg: product.weight_kg,
        volume_m3: product.volume_m3,
      });
      setTimeout(() => {
        setAdding(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAdding(false);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const originLabel = product.origin === 'africa' ? 'Afrique' : 'Asie';
  const originColor = product.origin === 'africa' ? 'bg-[#1BAA70]' : 'bg-[#1C3D73]';

  // Calcul du prix "environ" (variation de +/- 5%)
  const minPrice = (product.price * 0.95).toFixed(2);
  const maxPrice = (product.price * 1.05).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-[#4A2C2A]">Détails du produit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galerie d'images */}
            <div>
              <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                        selectedImageIndex === index
                          ? 'ring-4 ring-[#1BAA70]'
                          : 'ring-2 ring-gray-200 hover:ring-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informations du produit */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#FFD835] text-[#4A2C2A] text-sm font-semibold px-4 py-1.5 rounded-full">
                  {product.category}
                </span>
                <span className={`${originColor} text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1`}>
                  <MapPin className="w-4 h-4" />
                  <span>{originLabel}</span>
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-[#4A2C2A] mb-4">
                {product.name}
              </h1>

              <div className="bg-gradient-to-r from-[#FFF9E6] to-[#FFD835]/20 border-2 border-[#FFD835] rounded-xl p-6 mb-6">
                <div className="text-sm text-gray-600 mb-1">Prix estimé</div>
                <div className="text-4xl font-extrabold text-[#1BAA70] mb-1">
                  Environ ${product.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  (entre ${minPrice} et ${maxPrice})
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A2C2A] mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Livraison</span>
                  </div>
                  <p className="font-bold text-[#4A2C2A]">{product.delivery_days} jours</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Stock</span>
                  </div>
                  <p className="font-bold text-[#4A2C2A]">{product.stock_quantity} unités</p>
                </div>
              </div>

              <div className="bg-[#FFF9E6] border-l-4 border-[#FFD835] p-4 rounded-lg mb-6">
                <div className="flex items-start gap-2">
                  <Truck className="w-5 h-5 text-[#1BAA70] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Informations de livraison</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Livraison disponible dans toute la région</li>
                      <li>• Emballage soigné garantissant la qualité</li>
                      <li>• Suivi de commande en temps réel</li>
                    </ul>
                  </div>
                </div>
              </div>

              {product.is_available ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantité
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock_quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70] text-center font-bold"
                    />
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="w-full bg-[#1BAA70] text-white py-4 rounded-lg hover:bg-[#158f5d] transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{adding ? 'Ajout en cours...' : 'Ajouter au panier'}</span>
                  </button>
                </div>
              ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center font-semibold">
                  Produit actuellement indisponible
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
