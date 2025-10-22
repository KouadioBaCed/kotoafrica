import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from '../components/ui';
import { LogIn, UserPlus } from 'lucide-react';

type LoginPageProps = {
  onNavigate: (page: string) => void;
};

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'error', visible: false });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    postal_code: '',
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(loginData.email, loginData.password);
      onNavigate('home');
    } catch (err: any) {
      const msg = err.message || 'Erreur de connexion';
      setError(msg);
      setToast({ message: msg, type: 'error', visible: true });
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email: signUpData.email,
        password: signUpData.password,
        password2: signUpData.confirmPassword,
        first_name: signUpData.first_name,
        last_name: signUpData.last_name,
        phone: signUpData.phone,
        address: signUpData.address,
        postal_code: signUpData.postal_code,
      });
      onNavigate('home');
    } catch (err: any) {
      const msg = err.message || "Erreur lors de l'inscription";
      setError(msg);
      setToast({ message: msg, type: 'error', visible: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD835] to-[#FFC107] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#4A2C2A]">KÔTO AFRICA</h2>
          <p className="text-sm text-gray-600 italic mt-1">L'Afrique connectée au monde</p>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1 mb-8">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 rounded-md font-semibold transition ${
              !isSignUp
                ? 'bg-white text-[#4A2C2A] shadow'
                : 'text-gray-600 hover:text-[#4A2C2A]'
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-2" />
            Connexion
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 rounded-md font-semibold transition ${
              isSignUp
                ? 'bg-white text-[#4A2C2A] shadow'
                : 'text-gray-600 hover:text-[#4A2C2A]'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Inscription
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isSignUp ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1BAA70] text-white py-3 rounded-lg hover:bg-[#158f5d] transition font-bold text-lg disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  value={signUpData.first_name}
                  onChange={(e) => setSignUpData({ ...signUpData, first_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={signUpData.last_name}
                  onChange={(e) => setSignUpData({ ...signUpData, last_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone WhatsApp
              </label>
              <input
                type="tel"
                required
                value={signUpData.phone}
                onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                placeholder="+225 XX XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse
              </label>
              <input
                type="text"
                required
                value={signUpData.address}
                onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Code postal
              </label>
              <input
                type="text"
                required
                value={signUpData.postal_code}
                onChange={(e) => setSignUpData({ ...signUpData, postal_code: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                placeholder="225"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer mot de passe
              </label>
              <input
                type="password"
                required
                value={signUpData.confirmPassword}
                onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1BAA70] text-white py-3 rounded-lg hover:bg-[#158f5d] transition font-bold text-lg disabled:opacity-50"
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>
        )}
      </div>
        <Toast
          message={toast.message}
          type={toast.type as any}
          isVisible={toast.visible}
          onClose={() => setToast({ ...toast, visible: false })}
        />
    </div>
  );
}
