/**
 * Types TypeScript pour les produits
 */

export type TypeProduit = 'parapharmacie' | 'pharmacie' | 'medical';

export interface Categorie {
  id: string;
  nom: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  est_active: boolean;
  date_creation: string;
}

export interface Produit {
  id: string;
  nom: string;
  slug: string;
  description: string;
  type_produit: TypeProduit;
  prix: number;
  stock: number;
  categorie: string | Categorie;
  vendeur_id: string;
  images: string[];
  disponible_location: boolean;
  prix_location_jour?: number;
  est_actif: boolean;
  est_en_vedette: boolean;
  date_creation: string;
  date_modification: string;
}
