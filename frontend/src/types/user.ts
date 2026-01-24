/**
 * Types TypeScript pour les utilisateurs
 */

export type UserRole = 'client' | 'vendeur';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role: UserRole;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  est_actif: boolean;
  est_verifie: boolean;
  date_inscription: string;
  derniere_connexion?: string;
}

export interface InscriptionData {
  email: string;
  mot_de_passe: string;
  confirmation_mot_de_passe: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role?: UserRole;
}

export interface ConnexionData {
  email: string;
  mot_de_passe: string;
}

export interface AuthResponse {
  message: string;
  access: string;
  refresh: string;
  user: User;
}
