/**
 * Dashboard client - Historique des commandes
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { commandesApi } from '@/lib/api/index';
import type { Commande, StatutCommande } from '@/types/commande';
import { useAuth } from '@/contexts/AuthContext';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [commandeDetailId, setCommandeDetailId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/connexion');
        return;
      }
      if (user.role !== 'client') {
        router.push('/');
        return;
      }
      chargerCommandes();
    }
  }, [user, authLoading, router]);

  const chargerCommandes = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const data = await commandesApi.lister();
      // Trier par date décroissante (plus récentes d'abord)
      const commandesTriees = data.sort((a, b) =>
        new Date(b.date_commande).getTime() - new Date(a.date_commande).getTime()
      );
      setCommandes(commandesTriees);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      setErreur('Impossible de charger vos commandes');
    } finally {
      setChargement(false);
    }
  };

  const handleAnnulerCommande = async (id: string, numero: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir annuler la commande ${numero} ?`)) return;

    try {
      await commandesApi.annuler(id);
      await chargerCommandes(); // Recharger les commandes
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur lors de l\'annulation de la commande');
    }
  };

  const toggleDetails = (id: string) => {
    setCommandeDetailId(commandeDetailId === id ? null : id);
  };

  // Fonction pour obtenir le badge de statut
  const getStatutBadge = (statut: StatutCommande) => {
    const config = {
      en_attente: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'En attente' },
      confirmee: { icon: CheckCircle, color: 'bg-blue-100 text-blue-700', label: 'Confirmée' },
      en_preparation: { icon: Package, color: 'bg-purple-100 text-purple-700', label: 'En préparation' },
      expediee: { icon: Truck, color: 'bg-indigo-100 text-indigo-700', label: 'Expédiée' },
      livree: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Livrée' },
      annulee: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Annulée' },
    };

    const { icon: Icon, color, label } = config[statut];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4" />
        {label}
      </span>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'client') {
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
    totalDepense: commandes
      .filter(c => c.statut_commande !== 'annulee')
      .reduce((sum, c) => sum + c.total_commande, 0),
    commandesEnCours: commandes.filter(
      c => !['livree', 'annulee'].includes(c.statut_commande)
    ).length,
    derniereCommande: commandes[0]?.date_commande
      ? new Date(commandes[0].date_commande).toLocaleDateString('fr-FR')
      : 'Aucune',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Dashboard</h1>
          <p className="text-gray-600">Suivez vos commandes et votre historique d'achats</p>
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
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total dépensé */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Dépensé</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalDepense.toFixed(2)} TND
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Commandes en cours */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En Cours</p>
                <p className="text-3xl font-bold text-gray-900">{stats.commandesEnCours}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Dernière commande */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dernière Commande</p>
                <p className="text-lg font-bold text-gray-900">{stats.derniereCommande}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
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

        {/* Liste des commandes */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des commandes</h2>

          {commandes.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Aucune commande pour le moment</p>
              <p className="text-gray-500 mb-6">Commencez à parcourir nos produits !</p>
              <button
                onClick={() => router.push('/')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Découvrir les produits
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {commandes.map((commande) => (
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
                          {getStatutBadge(commande.statut_commande)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(commande.date_commande).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
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
                        {commande.adresse_livraison.ville}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${
                          commande.statut_paiement === 'paye' ? 'bg-green-500' :
                          commande.statut_paiement === 'en_attente' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></span>
                        Paiement: {
                          commande.statut_paiement === 'paye' ? 'Payé' :
                          commande.statut_paiement === 'en_attente' ? 'En attente' :
                          commande.statut_paiement === 'echoue' ? 'Échoué' :
                          'Remboursé'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Détails dépliables */}
                  {commandeDetailId === commande.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      {/* Bouton voir détails */}
                      <div className="mb-6">
                        <Link
                          href={`/commandes/${commande.id}`}
                          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Voir les détails complets
                        </Link>
                      </div>

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
                                {article.type_article === 'location' && article.date_debut_location && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Du {new Date(article.date_debut_location).toLocaleDateString('fr-FR')}
                                    {article.date_fin_location &&
                                      ` au ${new Date(article.date_fin_location).toLocaleDateString('fr-FR')}`
                                    }
                                  </p>
                                )}
                              </div>
                              <p className="font-bold text-gray-900">
                                {article.prix_total.toFixed(2)} TND
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Récapitulatif des prix */}
                      <div className="mb-6 bg-white p-4 rounded-lg">
                        <div className="flex justify-between text-gray-600 mb-2">
                          <span>Sous-total</span>
                          <span>{commande.total_articles.toFixed(2)} TND</span>
                        </div>
                        <div className="flex justify-between text-gray-600 mb-2">
                          <span>Frais de livraison</span>
                          <span>{commande.frais_livraison.toFixed(2)} TND</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t">
                          <span>Total</span>
                          <span>{commande.total_commande.toFixed(2)} TND</span>
                        </div>
                      </div>

                      {/* Adresse de livraison */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Adresse de livraison
                        </h4>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="font-medium text-gray-900">{commande.adresse_livraison.nom_complet}</p>
                          <p className="text-gray-600">{commande.adresse_livraison.telephone}</p>
                          <p className="text-gray-600 mt-2">
                            {commande.adresse_livraison.adresse}<br />
                            {commande.adresse_livraison.code_postal} {commande.adresse_livraison.ville}<br />
                            {commande.adresse_livraison.gouvernorat}
                          </p>
                          {commande.adresse_livraison.instructions && (
                            <p className="text-sm text-gray-500 mt-2 italic">
                              Instructions: {commande.adresse_livraison.instructions}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {commande.statut_commande === 'en_attente' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAnnulerCommande(commande.id, commande.numero_commande)}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Annuler la commande
                          </button>
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
