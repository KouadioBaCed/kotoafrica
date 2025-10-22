import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { QuoteRequestPage } from './pages/QuoteRequestPage';

// Composant wrapper pour gérer la navigation
function AppContent() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleNavigate = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produit/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#FFD835] border-t-[#4A2C2A]"></div>
          <p className="mt-4 text-gray-600 font-semibold">Chargement de KÔTO AFRICA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header pour toutes les pages */}
      <Header onNavigate={handleNavigate} currentPage={window.location.pathname.replace('/', '') || 'home'} />

      <Routes>
        {/* Toutes les routes */}
        <Route path="/" element={<HomePage onProductClick={handleProductClick} />} />
        <Route path="/login" element={<LoginPage onNavigate={handleNavigate} />} />
        <Route path="/cart" element={<CartPage onNavigate={handleNavigate} />} />
        <Route path="/checkout" element={<CheckoutPage onNavigate={handleNavigate} />} />
        <Route path="/produit/:id" element={<ProductDetailWrapper onNavigate={handleNavigate} />} />
        <Route path="/orders" element={user ? <OrdersPage /> : <LoginPage onNavigate={handleNavigate} />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <LoginPage onNavigate={handleNavigate} />} />
        <Route path="/demande-devis" element={<QuoteRequestPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

// Wrapper pour ProductDetailPage avec useParams
function ProductDetailWrapper({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { id } = useParams<{ id: string }>();
  return id ? <ProductDetailPage productId={id} onNavigate={onNavigate} /> : null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
