/**
 * Dashboard vendeur - Gestion des commandes
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { commandesApi } from '@/lib/api/index';
import type { Commande, StatutCommande } from '@/types/commande';
import { useAuth } from '@/contexts/AuthContext';
import {
  Package,
  DollarSign,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Truck,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  ArrowLeft,
  Filter,
} from 'lucide-react';

// Statuts disponibles pour les vendeurs
const statutsVendeur: StatutCommande[] = ['confirmee', 'en_preparation', 'expediee', 'livree'];

const getStatutColor = (statut: StatutCommande) => {
  switch (statut) {
    case 'en_attente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmee':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'en_preparation':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'expediee':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'livree':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'annulee':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatutIcon = (statut: StatutCommande) => {
  switch (statut) {
    case 'en_attente':
      return <Clock className="w-4 h-4" />;
    case 'confirmee':
      return <CheckCircle className="w-4 h-4" />;
    case 'en_preparation':
      return <Package className="w-4 h-4" />;
    case 'expediee':
      return <Truck className="w-4 h-4" />;
    case 'livree':
      return <CheckCircle className="w-4 h-4" />;
    case 'annulee':
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatutLabel = (statut: StatutCommande) => {
  switch (statut) {
    case 'en_attente':
      return 'En attente';
    case 'confirmee':
      return 'Confirmée';
    case 'en_preparation':
      return 'En préparation';
    case 'expediee':
      return 'Expédiée';
    case 'livree':
      return 'Livrée';
    case 'annulee':
      return 'Annulée';
    default:
      return statut;
  }
};

export default function VendeurCommandesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [commandesFiltrees, setCommandesFiltrees] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [commandeDetailId, setCommandeDetailId] = useState<string | null>(null);
  const [modificationStatut, setModificationStatut] = useState<string | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<StatutCommande | 'tous'>('tous');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/connexion');
        return;
      }
      if (user.role !== 'vendeur') {
        router.push('/');
        return;
      }
      chargerCommandes();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Filtrer les commandes selon le filtre sélectionné
    if (filtreStatut === 'tous') {
      setCommandesFiltrees(commandes);
    } else {
      setCommandesFiltrees(commandes.filter(c => c.statut_commande === filtreStatut));
    }
  }, [filtreStatut, commandes]);

  const chargerCommandes = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const data = await commandesApi.parVendeur();
      // Trier par date décroissante
      const commandesTriees = data.sort((a, b) =>
        new Date(b.date_commande).getTime() - new Date(a.date_commande).getTime()
      );
      setCommandes(commandesTriees);
      setCommandesFiltrees(commandesTriees);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      setErreur('Impossible de charger vos commandes');
    } finally {
      setChargement(false);
    }
  };

  const handleModifierStatut = async (commandeId: string, nouveauStatut: StatutCommande) => {
    if (!confirm(`Confirmer le changement de statut vers "${getStatutLabel(nouveauStatut)}" ?`)) {
      return;
    }

    try {
      setModificationStatut(commandeId);
      await commandesApi.modifierStatut(commandeId, nouveauStatut);
      await chargerCommandes(); // Recharger les commandes
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur lors de la modification du statut');
    } finally {
      setModificationStatut(null);
    }
  };

  const toggleDetails = (id: string) => {
    setCommandeDetailId(commandeDetailId === id ? null : id);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'vendeur') {
    return null;
  }

  if (chargement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  // Calcul des statistiques
  const stats = {
    totalCommandes: commandes.length,
    revenuTotal: commandes
      .filter(c => c.statut_commande !== 'annulee')
      .reduce((sum, c) => sum + c.total_commande, 0),
    enCours: commandes.filter(c =>
      ['en_attente', 'confirmee', 'en_preparation', 'expediee'].includes(c.statut_commande)
    ).length,
    livrees: commandes.filter(c => c.statut_commande === 'livree').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href="/vendeur/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des commandes</h1>
              <p className="text-gray-600">Suivez et gérez les commandes de vos produits</p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total commandes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Commandes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCommandes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Revenu total */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenu Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.revenuTotal.toFixed(2)} TND
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* En cours */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En Cours</p>
                <p className="text-3xl font-bold text-gray-900">{stats.enCours}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Livrées */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Livrées</p>
                <p className="text-3xl font-bold text-gray-900">{stats.livrees}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {erreur && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{erreur}</p>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtrer par statut</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltreStatut('tous')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtreStatut === 'tous'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({commandes.length})
            </button>
            <button
              onClick={() => setFiltreStatut('en_attente')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtreStatut === 'en_attente'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente ({commandes.filter(c => c.statut_commande === 'en_attente').length})
            </button>
            <button
              onClick={() => setFiltreStatut('confirmee')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtreStatut === 'confirmee'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmées ({commandes.filter(c => c.statut_commande === 'confirmee').length})
            </button>
            <button
              onClick={() => setFiltreStatut('en_preparation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtreStatut === 'en_preparation'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En préparation ({commandes.filter(c => c.statut_commande === 'en_preparation').length})
            </button>
            <button
              onClick={() => setFiltreStatut('expediee')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtreStatut === 'expediee'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expédiées ({commandes.filter(c => c.statut_commande === 'expediee').length})
            </button>
            <button
              onClick={() => setFiltreStatut('livree')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtreStatut === 'livree'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Livrées ({commandes.filter(c => c.statut_commande === 'livree').length})
            </button>
            <button
              onClick={() => setFiltreStatut('annulee')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtreStatut === 'annulee'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annulées ({commandes.filter(c => c.statut_commande === 'annulee').length})
            </button>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Commandes {filtreStatut !== 'tous' && `- ${getStatutLabel(filtreStatut)}`}
          </h2>

          {commandesFiltrees.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {filtreStatut === 'tous'
                  ? 'Aucune commande pour le moment'
                  : `Aucune commande ${getStatutLabel(filtreStatut).toLowerCase()}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {commandesFiltrees.map((commande) => (
                <div
                  key={commande.id}
                  className="border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                >
                  {/* En-tête de la commande */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Commande #{commande.numero_commande}
                          </h3>
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatutColor(
                              commande.statut_commande
                            )}`}
                          >
                            {getStatutIcon(commande.statut_commande)}
                            <span className="font-medium text-sm">
                              {getStatutLabel(commande.statut_commande)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(commande.date_commande).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {commande.total_commande.toFixed(2)} TND
                          </p>
                        </div>

                        <button
                          onClick={() => toggleDetails(commande.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {commandeDetailId === commande.id ? (
                            <ChevronUp className="w-6 h-6 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Résumé rapide */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {commande.articles.length} article{commande.articles.length > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {commande.adresse_livraison.ville}, {commande.adresse_livraison.gouvernorat}
                      </div>
                    </div>
                  </div>

                  {/* Détails dépliables */}
                  {commandeDetailId === commande.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      {/* Articles */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Articles commandés</h4>
                        <div className="space-y-2">
                          {commande.articles.map((article, index) => (
                            <div
                              key={index}
                              className="bg-white p-4 rounded-lg flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{article.nom_produit}</p>
                                <p className="text-sm text-gray-600">
                                  {article.quantite} x {article.prix_unitaire.toFixed(2)} TND
                                  {article.type_article === 'location' && ' (Location)'}
                                </p>
                              </div>
                              <p className="font-bold text-gray-900">
                                {article.prix_total.toFixed(2)} TND
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Adresse de livraison */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Adresse de livraison
                        </h4>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="font-medium text-gray-900">
                            {commande.adresse_livraison.nom_complet}
                          </p>
                          <p className="text-gray-600">{commande.adresse_livraison.telephone}</p>
                          <p className="text-gray-600 mt-2">
                            {commande.adresse_livraison.adresse}
                            <br />
                            {commande.adresse_livraison.code_postal}{' '}
                            {commande.adresse_livraison.ville}
                            <br />
                            {commande.adresse_livraison.gouvernorat}
                          </p>
                          {commande.adresse_livraison.instructions && (
                            <p className="text-sm text-gray-500 mt-2 italic">
                              Instructions: {commande.adresse_livraison.instructions}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Modifier le statut */}
                      {commande.statut_commande !== 'annulee' &&
                        commande.statut_commande !== 'livree' && (
                          <div className="pt-6 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Modifier le statut
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {statutsVendeur
                                .filter(s => s !== commande.statut_commande)
                                .map(statut => (
                                  <button
                                    key={statut}
                                    onClick={() => handleModifierStatut(commande.id, statut)}
                                    disabled={modificationStatut === commande.id}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${getStatutColor(
                                      statut
                                    )} border hover:opacity-80 disabled:opacity-50`}
                                  >
                                    {modificationStatut === commande.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      getStatutIcon(statut)
                                    )}
                                    {getStatutLabel(statut)}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
