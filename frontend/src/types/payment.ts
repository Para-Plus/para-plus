/**
 * Types TypeScript pour les paiements
 */

export type MethodePaiement = 'carte' | 'paypal' | 'stripe' | 'especes' | 'virement';
export type StatutPaiement = 'en_attente' | 'reussi' | 'echoue' | 'rembourse' | 'annule';

export interface Paiement {
  id: string;
  client_id: string;
  commande_id?: string;
  location_id?: string;
  montant: number;
  devise: string;
  methode_paiement: MethodePaiement;
  statut: StatutPaiement;
  transaction_id?: string;
  reference_externe?: string;
  donnees_processeur?: Record<string, any>;
  date_paiement: string;
  date_validation?: string;
  date_remboursement?: string;
  description?: string;
  message_erreur?: string;
}
