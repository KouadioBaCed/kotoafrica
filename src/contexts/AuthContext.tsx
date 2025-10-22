import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, type User, type RegisterData, type LoginData } from '../services/authService';

type AuthContextType = {
  user: User | null;
  profile?: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<boolean>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
};

type SignUpData = {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  postal_code: string;
  city?: string;
  country?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const initAuth = async () => {
      try {
        const savedUser = authService.getUser();
        if (savedUser && authService.isAuthenticated()) {
          // Essayer de récupérer les données utilisateur à jour
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // Si l'erreur est 401, le token a expiré
            console.log('Token expiré, utilisation des données en cache');
            setUser(savedUser);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.removeTokens();
        authService.removeUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  async function signIn(usernameOrEmail: string, password: string) {
    try {
      setLoading(true);
      const response = await authService.login({
        username: usernameOrEmail,
        password,
      });
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  }

  async function signUp(data: SignUpData) {
    try {
      setLoading(true);

      // Générer le nom d'utilisateur à partir de l'email si nécessaire
      const username = data.email.split('@')[0];

      const registerData: RegisterData = {
        username,
        email: data.email,
        password: data.password,
        password2: data.password2,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        address: data.address,
        postal_code: data.postal_code,
        city: data.city || '',
        country: data.country || 'Côte d\'Ivoire',
      };

      const response = await authService.register(registerData);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(data: Partial<User>) {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  }

  const isAuthenticated = !!user && authService.isAuthenticated();

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
