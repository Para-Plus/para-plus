/**
 * Client API pour communiquer avec le backend Django
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  User,
  InscriptionData,
  ConnexionData,
  AuthResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Créer une instance axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer le refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Si erreur 401 et que ce n'est pas déjà une tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          try {
            const response = await axios.post(`${API_URL}/token/refresh/`, {
              refresh: refreshToken,
            });

            const { access } = response.data;
            localStorage.setItem('access_token', access);

            // Réessayer la requête originale avec le nouveau token
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Si le refresh échoue, déconnecter l'utilisateur
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/connexion';
            return Promise.reject(refreshError);
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

// === Authentification ===

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
};

// === Produits ===

export const produitsApi = {
  /**
   * Obtenir la liste des produits
   */
  getAll: async (params?: {
    page?: number;
    search?: string;
    type_produit?: string;
    categorie?: string;
  }) => {
    const response = await apiClient.get('/produits/', { params });
    return response.data;
  },

  /**
   * Obtenir un produit par slug
   */
  getBySlug: async (slug: string) => {
    const response = await apiClient.get(`/produits/${slug}/`);
    return response.data;
  },
};

// === Catégories ===

export const categoriesApi = {
  /**
   * Obtenir la liste des catégories
   */
  getAll: async () => {
    const response = await apiClient.get('/produits/categories/');
    return response.data;
  },
};

// === Panier ===

export const panierApi = {
  /**
   * Obtenir le panier de l'utilisateur
   */
  get: async () => {
    const response = await apiClient.get('/panier/');
    return response.data;
  },

  /**
   * Ajouter un article au panier
   */
  ajouterArticle: async (data: {
    produit_id: string;
    quantite: number;
  }) => {
    const response = await apiClient.post('/panier/ajouter/', data);
    return response.data;
  },

  /**
   * Retirer un article du panier
   */
  retirerArticle: async (produitId: string) => {
    const response = await apiClient.delete(`/panier/retirer/${produitId}/`);
    return response.data;
  },

  /**
   * Vider le panier
   */
  vider: async () => {
    const response = await apiClient.delete('/panier/vider/');
    return response.data;
  },
};

// === Commandes ===

export const commandesApi = {
  /**
   * Obtenir la liste des commandes de l'utilisateur
   */
  getAll: async () => {
    const response = await apiClient.get('/commandes/');
    return response.data;
  },

  /**
   * Obtenir une commande par numéro
   */
  getByNumero: async (numero: string) => {
    const response = await apiClient.get(`/commandes/${numero}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle commande
   */
  create: async (data: any) => {
    const response = await apiClient.post('/commandes/creer/', data);
    return response.data;
  },
};

// === Locations ===

export const locationsApi = {
  /**
   * Obtenir la liste des locations de l'utilisateur
   */
  getAll: async () => {
    const response = await apiClient.get('/locations/');
    return response.data;
  },

  /**
   * Vérifier la disponibilité d'un produit pour location
   */
  verifierDisponibilite: async (data: {
    produit_id: string;
    date_debut: string;
    date_fin: string;
  }) => {
    const response = await apiClient.post('/locations/disponibilite/', data);
    return response.data;
  },

  /**
   * Réserver une location
   */
  reserver: async (data: any) => {
    const response = await apiClient.post('/locations/reserver/', data);
    return response.data;
  },
};

// === Paiements ===

export const paiementsApi = {
  /**
   * Créer un paiement
   */
  create: async (data: any) => {
    const response = await apiClient.post('/paiements/creer/', data);
    return response.data;
  },

  /**
   * Vérifier le statut d'un paiement
   */
  getStatut: async (paiementId: string) => {
    const response = await apiClient.get(`/paiements/${paiementId}/statut/`);
    return response.data;
  },
};

export default apiClient;
