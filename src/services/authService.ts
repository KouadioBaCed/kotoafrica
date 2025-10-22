// API Base URL is centralized in src/config.ts (uses Vite env variables)
import { API_BASE_URL, api } from '../config';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'client' | 'admin' | 'african_supplier' | 'asian_supplier';
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
  custom_id: string;
  date_joined: string;
  is_staff: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export interface RegisterData {
  username: string;
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
}

export interface LoginData {
  username: string;
  password: string;
}

class AuthService {
  private getHeaders(withAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (withAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Token Management
  setTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  removeTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // User Management
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  removeUser(): void {
    localStorage.removeItem('user');
  }

  // Authentication API Calls
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
  const response = await fetch(api('/auth/register/'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }

      const result: AuthResponse = await response.json();
      this.setTokens(result.tokens);
      this.setUser(result.user);
      return result;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
  const response = await fetch(api('/auth/login/'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la connexion');
      }

      const result: AuthResponse = await response.json();
      this.setTokens(result.tokens);
      this.setUser(result.user);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
  await fetch(api('/auth/logout/'), {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeTokens();
      this.removeUser();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
  const response = await fetch(api('/auth/profile/'), {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const user: User = await response.json();
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
  const response = await fetch(api('/auth/profile/update/'), {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
      }

      const result = await response.json();
      this.setUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

  const response = await fetch(api('/auth/token/refresh/'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return data.access;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.removeTokens();
      this.removeUser();
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
