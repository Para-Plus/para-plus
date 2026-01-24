/**
 * Types TypeScript pour les locations
 */

export type StatutLocation = 'reservee' | 'en_cours' | 'terminee' | 'annulee';

export interface Location {
  id: string;
  produit_id: string;
  nom_produit: string;
  client_id: string;
  vendeur_id: string;
  date_debut: string;
  date_fin: string;
  nombre_jours: number;
  prix_par_jour: number;
  prix_total: number;
  caution: number;
  statut: StatutLocation;
  adresse_livraison?: {
    rue: string;
    ville: string;
    code_postal: string;
  };
  notes_client?: string;
  paiement_id?: string;
  est_payee: boolean;
  caution_rendue: boolean;
  date_reservation: string;
  date_retour_effective?: string;
}
