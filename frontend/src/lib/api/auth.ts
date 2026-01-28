/**
 * API client pour l'authentification
 */

import { apiClient } from '../api';
import type { User, InscriptionData, ConnexionData, AuthResponse } from '@/types/user';

export const authApi = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  inscription: async (data: InscriptionData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/inscription/', data);
    return response.data;
  },

  /**
   * Connexion d'un utilisateur
   */
  connexion: async (data: ConnexionData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/connexion/', data);
    return response.data;
  },

  /**
   * Déconnexion d'un utilisateur
   */
  deconnexion: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/deconnexion/', { refresh: refreshToken });
  },

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  getProfil: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profil/');
    return response.data;
  },

  /**
   * Modifier le profil de l'utilisateur
   */
  modifierProfil: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<{ user: User }>('/auth/profil/modifier/', data);
    return response.data.user;
  },

  /**
   * Changer le mot de passe
   */
  changerMotDePasse: async (
    ancienMotDePasse: string,
    nouveauMotDePasse: string
  ): Promise<void> => {
    await apiClient.post('/auth/changer-mot-de-passe/', {
      ancien_mot_de_passe: ancienMotDePasse,
      nouveau_mot_de_passe: nouveauMotDePasse,
    });
  },

  /**
   * Authentification avec Google OAuth
   */
  googleAuth: async (credential: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google/', { credential });
    return response.data;
  },
};
