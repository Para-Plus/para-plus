/**
 * Page de détail d'une commande
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { commandesApi } from '@/lib/api/index';
import type { Commande, StatutCommande, StatutPaiement } from '@/types/commande';
import { useAuth } from '@/contexts/AuthContext';
import {
  Loader2,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Truck
} from 'lucide-react';

// Utilitaires pour les badges de statut
const getStatutCommandeStyle = (statut: StatutCommande) => {
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

const getStatutCommandeIcon = (statut: StatutCommande) => {
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

const getStatutCommandeTexte = (statut: StatutCommande) => {
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

const getStatutPaiementStyle = (statut: StatutPaiement) => {
  switch (statut) {
    case 'en_attente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'paye':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'echoue':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'rembourse':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatutPaiementTexte = (statut: StatutPaiement) => {
  switch (statut) {
    case 'en_attente':
      return 'En attente';
    case 'paye':
      return 'Payé';
    case 'echoue':
      return 'Échec';
    case 'rembourse':
      return 'Remboursé';
    default:
      return statut;
  }
};

export default function DetailCommandePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const commandeId = params.id as string;

  const [commande, setCommande] = useState<Commande | null>(null);
  const [chargement, setChargement] = useState(true);
  const [annulation, setAnnulation] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/connexion');
      return;
    }
    chargerCommande();
  }, [user, commandeId]);

  const chargerCommande = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const data = await commandesApi.obtenir(commandeId);
      setCommande(data);
    } catch (error: any) {
      console.error('Erreur chargement commande:', error);
      setErreur(error.response?.data?.error || 'Commande introuvable');
    } finally {
      setChargement(false);
    }
  };

  const handleAnnuler = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) return;

    try {
      setAnnulation(true);
      const data = await commandesApi.annuler(commandeId);
      setCommande(data);
    } catch (error: any) {
      console.error('Erreur annulation:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'annulation');
    } finally {
      setAnnulation(false);
    }
  };

  if (!user) {
    return null;
  }

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Chargement de la commande...</span>
        </div>
      </div>
    );
  }

  if (erreur || !commande) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-800 text-lg mb-4">{erreur || 'Commande introuvable'}</p>
            <Link
              href="/client/dashboard"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const peutAnnuler = commande.statut_commande === 'en_attente';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Commande #{commande.numero_commande}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Passée le {new Date(commande.date_commande).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Badge statut commande */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatutCommandeStyle(
                  commande.statut_commande
                )}`}
              >
                {getStatutCommandeIcon(commande.statut_commande)}
                <span className="font-medium">
                  {getStatutCommandeTexte(commande.statut_commande)}
                </span>
              </div>

              {/* Badge statut paiement */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatutPaiementStyle(
                  commande.statut_paiement
                )}`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="font-medium">
                  {getStatutPaiementTexte(commande.statut_paiement)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Articles commandés */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Articles commandés
              </h2>

              <div className="space-y-4">
                {commande.articles.map((article, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-4 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{article.nom_produit}</h3>
                      <p className="text-sm text-gray-600">
                        Quantité: {article.quantite} × {article.prix_unitaire.toFixed(2)} TND
                      </p>
                      {article.type_article === 'location' && (
                        <div className="mt-1 text-sm text-blue-600">
                          <span className="font-medium">Location</span>
                          {article.date_debut_location && article.date_fin_location && (
                            <span className="ml-2">
                              Du {new Date(article.date_debut_location).toLocaleDateString('fr-FR')}
                              {' '}au {new Date(article.date_fin_location).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{article.prix_total.toFixed(2)} TND</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Adresse de livraison
              </h2>

              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">{commande.adresse_livraison.nom_complet}</p>
                <p>{commande.adresse_livraison.telephone}</p>
                <p>{commande.adresse_livraison.adresse}</p>
                <p>
                  {commande.adresse_livraison.code_postal} {commande.adresse_livraison.ville}
                </p>
                <p className="font-medium">{commande.adresse_livraison.gouvernorat}</p>
                {commande.adresse_livraison.instructions && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Instructions:</span>{' '}
                      {commande.adresse_livraison.instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Méthode de paiement */}
            {commande.methode_paiement && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Paiement
                </h2>

                <p className="text-gray-700">
                  {commande.methode_paiement === 'cod'
                    ? 'Paiement à la livraison (en espèces)'
                    : commande.methode_paiement}
                </p>
              </div>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 space-y-6">
              {/* Récapitulatif */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Sous-total</span>
                    <span>{commande.total_articles.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Frais de livraison</span>
                    <span>{commande.frais_livraison.toFixed(2)} TND</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-green-600">
                        {commande.total_commande.toFixed(2)} TND
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date de livraison estimée */}
              {commande.date_livraison_estimee && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-2 text-sm">
                    <Truck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Livraison estimée</p>
                      <p className="text-gray-600">
                        {new Date(commande.date_livraison_estimee).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {peutAnnuler && (
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={handleAnnuler}
                    disabled={annulation}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-400"
                  >
                    {annulation ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Annulation...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        Annuler la commande
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Vous pouvez annuler tant que la commande n'est pas confirmée
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
