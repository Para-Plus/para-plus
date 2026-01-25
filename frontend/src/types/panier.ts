/**
 * Types TypeScript pour le panier
 */

export type TypeArticle = 'achat' | 'location';

export interface ArticlePanier {
  id: string;
  produit_id: string;
  produit: {
    id: string;
    nom: string;
    slug: string;
    prix: number;
    prix_promo?: number;
    prix_location_jour?: number;
    images: string[];
    stock: number;
  };
  quantite: number;
  type_article: TypeArticle;
  date_debut_location?: string;
  date_fin_location?: string;
  jours_location?: number;
  prix_unitaire: number;
  prix_total: number;
}

export interface Panier {
  id: string;
  utilisateur_id: string;
  articles: ArticlePanier[];
  total: number;
  date_modification: string;
}

export interface AjouterPanierData {
  produit_id: string;
  quantite: number;
  type_article: TypeArticle;
  date_debut_location?: string;
  date_fin_location?: string;
}

export interface ModifierQuantiteData {
  article_id: string;
  quantite: number;
}
