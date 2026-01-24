/**
 * Types TypeScript pour le panier
 */

export interface ArticlePanier {
  produit_id: string;
  nom_produit: string;
  quantite: number;
  prix_unitaire: number;
  image_url?: string;
}

export interface Panier {
  id: string;
  client_id: string;
  articles: ArticlePanier[];
  montant_total: number;
  date_creation: string;
  date_modification: string;
}
