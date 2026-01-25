/**
 * API client pour les produits
 */

import { apiClient } from '../api';
import type { Produit, FiltreProduits, ResultatProduits, Categorie } from '@/types/produit';

export const produitsApi = {
  /**
   * Récupérer la liste des produits avec filtres
   */
  async lister(filtres?: FiltreProduits): Promise<ResultatProduits> {
    const params = new URLSearchParams();

    if (filtres?.type_produit) params.append('type_produit', filtres.type_produit);
    if (filtres?.categorie_id) params.append('categorie_id', filtres.categorie_id);
    if (filtres?.prix_min !== undefined) params.append('prix_min', filtres.prix_min.toString());
    if (filtres?.prix_max !== undefined) params.append('prix_max', filtres.prix_max.toString());
    if (filtres?.disponible_location !== undefined) params.append('disponible_location', filtres.disponible_location.toString());
    if (filtres?.recherche) params.append('recherche', filtres.recherche);
    if (filtres?.page) params.append('page', filtres.page.toString());
    if (filtres?.limite) params.append('limite', filtres.limite.toString());
    if (filtres?.tri) params.append('tri', filtres.tri);

    const response = await apiClient.get<ResultatProduits>(`/produits/?${params.toString()}`);
    return response.data;
  },

  /**
   * Récupérer un produit par son slug
   */
  async obtenirParSlug(slug: string): Promise<Produit> {
    const response = await apiClient.get<Produit>(`/produits/${slug}/`);
    return response.data;
  },

  /**
   * Récupérer les produits similaires
   */
  async similaires(produitId: string, limite: number = 4): Promise<Produit[]> {
    const response = await apiClient.get<Produit[]>(`/produits/${produitId}/similaires/?limite=${limite}`);
    return response.data;
  },

  /**
   * Créer un nouveau produit (vendeur uniquement)
   */
  async creer(data: Partial<Produit>): Promise<Produit> {
    const response = await apiClient.post<Produit>('/produits/', data);
    return response.data;
  },

  /**
   * Mettre à jour un produit (vendeur uniquement)
   */
  async modifier(id: string, data: Partial<Produit>): Promise<Produit> {
    const response = await apiClient.put<Produit>(`/produits/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer un produit (vendeur uniquement)
   */
  async supprimer(id: string): Promise<void> {
    await apiClient.delete(`/produits/${id}/`);
  },

  /**
   * Récupérer les produits d'un vendeur
   */
  async parVendeur(vendeurId: string): Promise<Produit[]> {
    const response = await apiClient.get<Produit[]>(`/produits/vendeur/${vendeurId}/`);
    return response.data;
  }
};

export const categoriesApi = {
  /**
   * Récupérer toutes les catégories
   */
  async lister(): Promise<Categorie[]> {
    const response = await apiClient.get<Categorie[]>('/categories/');
    return response.data;
  },

  /**
   * Récupérer une catégorie par son slug
   */
  async obtenirParSlug(slug: string): Promise<Categorie> {
    const response = await apiClient.get<Categorie>(`/categories/${slug}/`);
    return response.data;
  },

  /**
   * Récupérer les sous-catégories d'une catégorie
   */
  async sousCategories(categorieId: string): Promise<Categorie[]> {
    const response = await apiClient.get<Categorie[]>(`/categories/${categorieId}/sous-categories/`);
    return response.data;
  }
};
