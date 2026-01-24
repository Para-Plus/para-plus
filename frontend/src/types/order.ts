/**
 * Types TypeScript pour les commandes
 */

export type StatutCommande =
  | 'en_attente'
  | 'confirmee'
  | 'en_preparation'
  | 'expediee'
  | 'livree'
  | 'annulee';

export interface ArticleCommande {
  produit_id: string;
  nom_produit: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
}

export interface AdresseLivraison {
  rue: string;
  ville: string;
  code_postal: string;
  telephone: string;
}

export interface Commande {
  id: string;
  client_id: string;
  numero_commande: string;
  articles: ArticleCommande[];
  montant_total: number;
  frais_livraison: number;
  montant_final: number;
  statut: StatutCommande;
  adresse_livraison: AdresseLivraison;
  paiement_id?: string;
  est_payee: boolean;
  notes_client?: string;
  notes_vendeur?: string;
  date_commande: string;
  date_livraison_estimee?: string;
  date_livraison_effective?: string;
}
