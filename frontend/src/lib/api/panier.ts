/**
 * API client pour le panier
 */

import { apiClient } from '../api';
import type { Panier, AjouterPanierData, ModifierQuantiteData } from '@/types/panier';

export const panierApi = {
  /**
   * Récupérer le panier de l'utilisateur connecté
   */
  async obtenir(): Promise<Panier> {
    const response = await apiClient.get<Panier>('/panier/');
    return response.data;
  },

  /**
   * Ajouter un article au panier
   */
  async ajouter(data: AjouterPanierData): Promise<Panier> {
    const response = await apiClient.post<Panier>('/panier/ajouter/', data);
    return response.data;
  },

  /**
   * Modifier la quantité d'un article
   */
  async modifierQuantite(data: ModifierQuantiteData): Promise<Panier> {
    const response = await apiClient.put<Panier>('/panier/modifier/', data);
    return response.data;
  },

  /**
   * Supprimer un article du panier
   */
  async supprimerArticle(articleId: string): Promise<Panier> {
    const response = await apiClient.delete<Panier>(`/panier/article/${articleId}/`);
    return response.data;
  },

  /**
   * Vider le panier
   */
  async vider(): Promise<void> {
    await apiClient.delete('/panier/vider/');
  }
};
