/**
 * Types TypeScript pour les produits
 */

export type TypeProduit = 'parapharmacie' | 'pharmacie' | 'medical';

export interface Categorie {
  id: string;
  nom: string;
  slug: string;
  description?: string;
  parent_id?: string;
  icone?: string;
  date_creation: string;
}

export interface Produit {
  id: string;
  nom: string;
  slug: string;
  description: string;
  prix: number;
  prix_promo?: number;
  type_produit: TypeProduit;
  categorie_id: string;
  categorie?: Categorie;
  marque?: string;
  stock: number;
  disponible: boolean;
  images: string[];
  vendeur_id: string;
  vendeur?: {
    id: string;
    nom: string;
    prenom: string;
  };
  disponible_location: boolean;
  prix_location_jour?: number;
  caracteristiques?: Record<string, any>;
  date_creation: string;
  date_modification: string;
}

export interface FiltreProduits {
  type_produit?: TypeProduit;
  categorie_id?: string;
  prix_min?: number;
  prix_max?: number;
  disponible_location?: boolean;
  recherche?: string;
  page?: number;
  limite?: number;
  tri?: 'prix_asc' | 'prix_desc' | 'recent' | 'populaire';
}

export interface ResultatProduits {
  produits: Produit[];
  total: number;
  page: number;
  pages_total: number;
}
