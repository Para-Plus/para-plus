/**
 * API client pour les commandes
 */

import { apiClient } from '../api';
import type { Commande, CreerCommandeData } from '@/types/commande';

export const commandesApi = {
  /**
   * Récupérer toutes les commandes de l'utilisateur
   */
  async lister(): Promise<Commande[]> {
    const response = await apiClient.get<Commande[]>('/commandes/');
    return response.data;
  },

  /**
   * Récupérer une commande par son ID
   */
  async obtenir(id: string): Promise<Commande> {
    const response = await apiClient.get<Commande>(`/commandes/${id}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle commande depuis le panier
   */
  async creer(data: CreerCommandeData): Promise<Commande> {
    const response = await apiClient.post<Commande>('/commandes/creer/', data);
    return response.data;
  },

  /**
   * Annuler une commande
   */
  async annuler(id: string): Promise<Commande> {
    const response = await apiClient.post<Commande>(`/commandes/${id}/annuler/`);
    return response.data;
  },

  /**
   * Récupérer les commandes d'un vendeur
   */
  async parVendeur(): Promise<Commande[]> {
    const response = await apiClient.get<Commande[]>('/commandes/vendeur/');
    return response.data;
  }
};
