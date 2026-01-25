/**
 * Export de toutes les API
 */

export { authApi } from './auth';
export { produitsApi, categoriesApi } from './produits';
export { panierApi } from './panier';
export { commandesApi } from './commandes';

// Ré-export de apiClient pour compatibilité
export { default as apiClient } from '../api';
