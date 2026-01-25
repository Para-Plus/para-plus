/**
 * Types TypeScript pour les commandes
 */

export type StatutCommande = 'en_attente' | 'confirmee' | 'en_preparation' | 'expediee' | 'livree' | 'annulee';
export type StatutPaiement = 'en_attente' | 'paye' | 'echoue' | 'rembourse';

export interface AdresseLivraison {
  nom_complet: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
  gouvernorat: string;
  instructions?: string;
}

export interface ArticleCommande {
  produit_id: string;
  nom_produit: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
  type_article: 'achat' | 'location';
  date_debut_location?: string;
  date_fin_location?: string;
}

export interface Commande {
  id: string;
  numero_commande: string;
  utilisateur_id: string;
  articles: ArticleCommande[];
  total_articles: number;
  frais_livraison: number;
  total_commande: number;
  adresse_livraison: AdresseLivraison;
  statut_commande: StatutCommande;
  statut_paiement: StatutPaiement;
  methode_paiement?: string;
  date_commande: string;
  date_livraison_estimee?: string;
}

export interface CreerCommandeData {
  adresse_livraison: AdresseLivraison;
  methode_paiement: string;
  notes?: string;
}
