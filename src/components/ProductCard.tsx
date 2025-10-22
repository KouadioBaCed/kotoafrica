import { ShoppingCart, MapPin, Clock, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

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

type ProductCardProps = {
  product: Product;
  onClick: () => void;
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setAdding(true);
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg',
        weight_kg: product.weight_kg,
        volume_m3: product.volume_m3,
      });
      setTimeout(() => setAdding(false), 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAdding(false);
    }
  };

  const originLabel = product.origin === 'africa' ? 'Afrique' : 'Asie';
  const originColor = product.origin === 'africa' ? 'bg-[#1BAA70]' : 'bg-[#1C3D73]';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className={`absolute top-3 right-3 ${originColor} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1`}>
          <MapPin className="w-3 h-3" />
          <span>{originLabel}</span>
        </div>
        {!product.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Indisponible</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <span className="inline-block bg-[#FFD835] text-[#4A2C2A] text-xs font-semibold px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#4A2C2A] mb-2 line-clamp-1 group-hover:text-[#1C3D73] transition">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-0.5">À partir de</div>
            <span className="text-2xl font-bold text-[#1BAA70]">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-xs space-x-1">
            <Clock className="w-3 h-3" />
            <span>{product.delivery_days}j</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-xs space-x-1">
            <Package className="w-3 h-3" />
            <span>{product.stock_quantity} en stock</span>
          </div>

          {product.is_available && (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="bg-[#1BAA70] text-white px-4 py-2 rounded-lg hover:bg-[#158f5d] transition font-semibold text-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{adding ? 'Ajout...' : 'Ajouter'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
