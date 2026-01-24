/**
 * Utilitaires pour la gestion de l'authentification
 */

import type { User } from '@/types';

export const auth = {
  /**
   * Sauvegarder les tokens et l'utilisateur
   */
  login: (accessToken: string, refreshToken: string, user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  /**
   * Supprimer les tokens et l'utilisateur
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Obtenir le token d'accès
   */
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  /**
   * Obtenir le refresh token
   */
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },

  /**
   * Obtenir l'utilisateur connecté
   */
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated: (): boolean => {
    return !!auth.getAccessToken();
  },

  /**
   * Vérifier si l'utilisateur est un vendeur
   */
  isVendeur: (): boolean => {
    const user = auth.getUser();
    return user?.role === 'vendeur';
  },

  /**
   * Vérifier si l'utilisateur est un client
   */
  isClient: (): boolean => {
    const user = auth.getUser();
    return user?.role === 'client';
  },
};
