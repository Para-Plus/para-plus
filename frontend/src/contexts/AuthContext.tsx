/**
 * Contexte d'authentification pour gérer l'état utilisateur
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { auth as authUtils } from '@/lib/auth';
import type { User, ConnexionData, InscriptionData } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: ConnexionData) => Promise<void>;
  register: (data: InscriptionData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au montage
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = authUtils.getUser();
      const token = authUtils.getAccessToken();

      if (storedUser && token) {
        setUser(storedUser);

        // Vérifier que le token est toujours valide
        try {
          const freshUser = await authApi.getProfil();
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
          // Token invalide, déconnecter
          authUtils.logout();
          setUser(null);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Connexion
  const login = async (data: ConnexionData) => {
    try {
      const response = await authApi.connexion(data);
      authUtils.login(response.access, response.refresh, response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  // Inscription
  const register = async (data: InscriptionData) => {
    try {
      const response = await authApi.inscription(data);
      authUtils.login(response.access, response.refresh, response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      const refreshToken = authUtils.getRefreshToken();
      if (refreshToken) {
        await authApi.deconnexion(refreshToken);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      authUtils.logout();
      setUser(null);
    }
  };

  // Rafraîchir les données utilisateur
  const refreshUser = async () => {
    try {
      const freshUser = await authApi.getProfil();
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
