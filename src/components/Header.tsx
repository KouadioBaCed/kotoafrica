import { ShoppingCart, User, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Toast } from './ui';
import { useState } from 'react';

type HeaderProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
};

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  return (
    <>
    <header className="bg-[#FFD835] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <img src='/koto_africa_logo.png' alt="Logo Koto Africa" className="h-100 w-20 mr-3" />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-[#4A2C2A] hover:text-[#1C3D73] font-semibold transition ${
                currentPage === 'home' ? 'border-b-2 border-[#4A2C2A]' : ''
              }`}
            >
              Catalogue
            </button>
            {user && (
              <>
                <button
                  onClick={() => onNavigate('orders')}
                  className={`text-[#4A2C2A] hover:text-[#1C3D73] font-semibold transition ${
                    currentPage === 'orders' ? 'border-b-2 border-[#4A2C2A]' : ''
                  }`}
                >
                  Mes Commandes
                </button>
                {/* Support different backend/front user shapes - check role/user_type === 'admin' */}
                {(() => {
                  const p: any = profile;
                  return p && (p.user_type === 'admin' || p.role === 'admin');
                })() && (
                  // <button
                  //   onClick={() => onNavigate('admin')}
                  //   className={`text-[#4A2C2A] hover:text-[#1C3D73] font-semibold transition ${
                  //     currentPage === 'admin' ? 'border-b-2 border-[#4A2C2A]' : ''
                  //   }`}
                  // >
                  //   Administration
                  // </button>
                  <></>
                )}
              </>
            )}

            {/* MODE DEVELOPPEMENT - Accès admin sans authentification
                Show only when user is admin OR when not authenticated in DEV and
                explicit env flag VITE_ALLOW_DEV_ADMIN === '1' is set. */}
            {((() => { const p: any = profile; return p && (p.user_type === 'admin' || p.role === 'admin'); })() || (!user && import.meta.env.DEV && (import.meta.env.VITE_ALLOW_DEV_ADMIN === '1'))) && (
              <button
                onClick={() => onNavigate('admin')}
                className={`text-[#4A2C2A] hover:text-[#1C3D73] font-semibold transition bg-red-100 px-3 py-1 rounded ${
                  currentPage === 'admin' ? 'border-b-2 border-[#4A2C2A]' : ''
                }`}
              >
                🔧 Administration
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Icône panier - toujours visible */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-[#4A2C2A] hover:text-[#1C3D73] transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1BAA70] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <>
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 text-[#4A2C2A] hover:text-[#1C3D73] transition"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:inline font-semibold">
                    {(() => {
                      const p: any = profile;
                      return p?.user_code || p?.customId || p?.custom_id || p?.username || p?.name || p?.email;
                    })()}
                  </span>
                </button>
                <button
                  onClick={async () => {
                    const ok = await signOut();
                    if (ok) setToast({ message: 'Déconnecté avec succès', type: 'success', visible: true });
                    else setToast({ message: 'Erreur lors de la déconnexion', type: 'error', visible: true });
                    onNavigate('home');
                  }}
                  className="p-2 text-[#4A2C2A] hover:text-[#1C3D73] transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-[#4A2C2A] text-white px-6 py-2 rounded-lg hover:bg-[#1C3D73] transition font-semibold"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
    <Toast
      message={toast.message}
      type={toast.type as any}
      isVisible={toast.visible}
      onClose={() => setToast({ ...toast, visible: false })}
    />
    </>
  );
}
