import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Camera, X, MessageCircle } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { products as productData } from '../data/products';
import { searchProductsByImage } from '../utils/imageAnalysis';
import { useAuth } from '../contexts/AuthContext';

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

type HomePageProps = {
  onProductClick: (productId: string) => void;
};

export function HomePage({ onProductClick }: HomePageProps) {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageSearchActive, setImageSearchActive] = useState(false);
  const [imageSearchResults, setImageSearchResults] = useState<Product[]>([]);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Textile', 'Vêtements', 'Accessoires', 'Électronique', 'Maison', 'Art & Déco'];

  // Compter les filtres actifs
  const activeFiltersCount = [
    selectedOrigin !== 'all',
    selectedCategory !== 'all',
    sortBy !== 'price_asc', // Changé de 'recent' à 'price_asc' car c'est le défaut maintenant
  ].filter(Boolean).length;

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedOrigin, selectedCategory, sortBy, imageSearchActive, imageSearchResults]);

  // Fermer le dropdown au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showFilters && !target.closest('.filter-dropdown')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  async function loadProducts() {
    try {
      // Utiliser les données en dur au lieu de Supabase
      setProducts(productData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterProducts() {
    let filtered = [...products];

    // Recherche par image - utiliser les résultats de l'analyse
    if (imageSearchActive) {
      filtered = imageSearchResults;
    } else if (searchQuery) {
      // Recherche textuelle normale
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Appliquer les filtres uniquement si ce n'est pas une recherche par image
    if (!imageSearchActive) {
      if (selectedOrigin !== 'all') {
        filtered = filtered.filter((p) => p.origin === selectedOrigin);
      }

      if (selectedCategory !== 'all') {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }
    }

    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'delivery') {
      filtered.sort((a, b) => a.delivery_days - b.delivery_days);
    }

    setFilteredProducts(filtered);
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageDataUrl = reader.result as string;
        setUploadedImage(imageDataUrl);
        setImageSearchActive(true);
        setIsAnalyzingImage(true);
        setSearchQuery(''); // Effacer la recherche textuelle

        try {
          // Analyser l'image et rechercher des produits similaires
          const results = await searchProductsByImage(imageDataUrl, products);
          setImageSearchResults(results);
        } catch (error) {
          console.error('Erreur lors de l\'analyse de l\'image:', error);
          setImageSearchResults([]);
        } finally {
          setIsAnalyzingImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImageSearch = () => {
    setUploadedImage(null);
    setImageSearchActive(false);
    setImageSearchResults([]);
    setIsAnalyzingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendImageViaWhatsApp = () => {
    // Format international: +225 sans le premier 0
    const whatsappNumber = '225544136351';

    // Construire le message avec les coordonnées de l'utilisateur
    let message = "Bonjour KÔTO AFRICA,\n\n";
    message += "Je recherche un produit similaire à l'image que j'ai uploadée.\n\n";

    if (user && profile) {
      message += "Mes coordonnées :\n";
      message += `Nom: ${profile.full_name || 'Non renseigné'}\n`;
      message += `Email: ${user.email}\n`;
      message += `Téléphone: ${profile.phone || 'Non renseigné'}\n`;
      message += `Adresse: ${profile.address || 'Non renseigné'}, ${profile.city || ''}\n`;
    } else {
      message += "Je souhaite être contacté pour trouver ce produit.\n";
    }

    message += "\nMerci de m'aider à trouver ce produit !";

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);

    // Créer le lien WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-[#FFD835] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#4A2C2A] mb-4">
              Découvrez nos produits
            </h1>
            <p className="text-lg text-[#4A2C2A] font-medium">
              Une sélection de produits africains et asiatiques de qualité
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={imageSearchActive}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#4A2C2A] focus:outline-none focus:ring-2 focus:ring-[#1BAA70] text-lg ${
                    imageSearchActive ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* Bouton de recherche par image */}
              <div className="relative group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="h-full px-4 bg-white border-2 border-[#4A2C2A] text-[#4A2C2A] rounded-xl hover:bg-gray-50 transition flex items-center justify-center cursor-pointer"
                  title="Rechercher par image"
                >
                  <Camera className="w-5 h-5" />
                </label>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10 w-48">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                    Rechercher par image
                    <div className="absolute top-full right-4 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative filter-dropdown">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-full px-4 bg-[#4A2C2A] text-white rounded-xl hover:bg-[#3A1C1A] transition flex items-center justify-center gap-2 relative"
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline font-semibold">Filtres</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#1BAA70] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Dropdown des filtres */}
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 sm:p-6 z-50 filter-dropdown">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-[#4A2C2A]" />
                        <h3 className="text-lg font-bold text-[#4A2C2A]">Filtres</h3>
                      </div>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Origine
                        </label>
                        <select
                          value={selectedOrigin}
                          onChange={(e) => setSelectedOrigin(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                        >
                          <option value="all">Toutes</option>
                          <option value="africa">Afrique</option>
                          <option value="asia">Asie</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Catégorie
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                        >
                          <option value="all">Toutes</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Trier par
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                        >
                          <option value="recent">Plus récents</option>
                          <option value="price_asc">Prix croissant</option>
                          <option value="price_desc">Prix décroissant</option>
                          <option value="delivery">Livraison rapide</option>
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedOrigin('all');
                          setSelectedCategory('all');
                          setSortBy('price_asc');
                        }}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                      >
                        Réinitialiser
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Affichage de l'image uploadée */}
            {uploadedImage && (
              <div className="mt-4 bg-white rounded-xl border-2 border-[#1BAA70] p-4 flex items-center gap-4">
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Image recherchée"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={clearImageSearch}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#4A2C2A]">Recherche par image</p>
                  {isAnalyzingImage ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1BAA70] border-t-transparent"></div>
                      Analyse de l'image en cours...
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {imageSearchResults.length > 0
                        ? `${imageSearchResults.length} produit${imageSearchResults.length > 1 ? 's' : ''} similaire${imageSearchResults.length > 1 ? 's' : ''} trouvé${imageSearchResults.length > 1 ? 's' : ''}`
                        : 'Aucun produit similaire trouvé'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-bold text-[#4A2C2A]">{filteredProducts.length}</span> produit
            {filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FFD835] border-t-[#4A2C2A]"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        ) : isAnalyzingImage ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1BAA70] border-t-[#4A2C2A]"></div>
            <p className="mt-4 text-gray-600">Analyse de l'image en cours...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4">
              {imageSearchActive ? (
                <>
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-bold text-gray-700 mb-2">Aucun produit similaire trouvé</p>
                  <p className="text-gray-600 mb-4">Essayez avec une autre image ou contactez-nous via WhatsApp</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={sendImageViaWhatsApp}
                      className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition font-semibold"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Envoyer via WhatsApp
                    </button>
                    <button
                      onClick={clearImageSearch}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      Effacer la recherche
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-xl text-gray-600">Aucun produit trouvé</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de détails du produit */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
