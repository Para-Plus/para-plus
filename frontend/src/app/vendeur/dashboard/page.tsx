/**
 * Dashboard vendeur - Gestion des produits
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { produitsApi, commandesApi } from '@/lib/api/index';
import type { Produit } from '@/types/produit';
import type { Commande } from '@/types/commande';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function VendeurDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ongletActif, setOngletActif] = useState<'produits' | 'commandes'>('produits');

  useEffect(() => {
    if (!user) {
      router.push('/connexion');
      return;
    }
    if (user.role !== 'vendeur') {
      router.push('/');
      return;
    }
    chargerDonnees();
  }, [user]);

  const chargerDonnees = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const [produitsData, commandesData] = await Promise.all([
        produitsApi.parVendeur(user!.id),
        commandesApi.parVendeur()
      ]);
      setProduits(produitsData);
      setCommandes(commandesData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setErreur('Impossible de charger les données');
    } finally {
      setChargement(false);
    }
  };

  const handleSupprimerProduit = async (id: string, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${nom}" ?`)) return;

    try {
      await produitsApi.supprimer(id);
      setProduits((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Erreur suppression produit:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  if (!user || user.role !== 'vendeur') {
    return null;
  }

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  // Statistiques
  const stats = {
    totalProduits: produits.length,
    produitsActifs: produits.filter((p) => p.disponible).length,
    totalVentes: commandes.length,
    chiffreAffaires: commandes
      .filter((c) => c.statut_paiement === 'paye')
      .reduce((sum, c) => sum + c.total_commande, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord vendeur
          </h1>
          <p className="text-gray-600">
            Gérez vos produits et suivez vos ventes
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Produits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProduits}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {stats.produitsActifs} actifs
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.produitsActifs}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Disponibles à la vente
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVentes}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Total des ventes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">CA</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.chiffreAffaires.toFixed(0)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Chiffre d'affaires (TND)
            </p>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setOngletActif('produits')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  ongletActif === 'produits'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Mes Produits
              </button>
              <button
                onClick={() => setOngletActif('commandes')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  ongletActif === 'commandes'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Commandes
              </button>
            </nav>
          </div>

          {/* Contenu - Produits */}
          {ongletActif === 'produits' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mes Produits</h2>
                <Link
                  href="/vendeur/produits/ajouter"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter un produit
                </Link>
              </div>

              {erreur ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-red-800">{erreur}</p>
                </div>
              ) : produits.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Vous n'avez pas encore de produits</p>
                  <Link
                    href="/vendeur/produits/ajouter"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter votre premier produit
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Produit
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Prix
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {produits.map((produit) => (
                        <tr key={produit.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {produit.images && produit.images.length > 0 ? (
                                  <Image
                                    src={produit.images[0]}
                                    alt={produit.nom}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-gray-400">
                                    <Package className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{produit.nom}</p>
                                <p className="text-sm text-gray-600">{produit.type_produit}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-gray-900">
                              {produit.prix.toFixed(2)} TND
                            </p>
                            {produit.prix_promo && (
                              <p className="text-sm text-green-600">
                                Promo: {produit.prix_promo.toFixed(2)} TND
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`font-medium ${
                              produit.stock > 10 ? 'text-green-600' :
                              produit.stock > 0 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {produit.stock}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {produit.disponible ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Actif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                Inactif
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/produits/${produit.slug}`}
                                className="p-2 text-gray-600 hover:text-green-600"
                                title="Voir"
                              >
                                <Eye className="w-5 h-5" />
                              </Link>
                              <Link
                                href={`/vendeur/produits/${produit.id}/modifier`}
                                className="p-2 text-gray-600 hover:text-blue-600"
                                title="Modifier"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleSupprimerProduit(produit.id, produit.nom)}
                                className="p-2 text-gray-600 hover:text-red-600"
                                title="Supprimer"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Contenu - Commandes */}
          {ongletActif === 'commandes' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Commandes reçues</h2>

              {commandes.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune commande pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commandes.map((commande) => (
                    <div
                      key={commande.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Commande #{commande.numero_commande}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(commande.date_commande).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {commande.total_commande.toFixed(2)} TND
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            commande.statut_commande === 'livree' ? 'bg-green-100 text-green-700' :
                            commande.statut_commande === 'en_preparation' ? 'bg-blue-100 text-blue-700' :
                            commande.statut_commande === 'expediee' ? 'bg-purple-100 text-purple-700' :
                            commande.statut_commande === 'annulee' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {commande.statut_commande.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {commande.articles.map((article, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {article.nom_produit} × {article.quantite}
                            </span>
                            <span className="font-medium">
                              {article.prix_total.toFixed(2)} TND
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Client:</span>{' '}
                          {commande.adresse_livraison.nom_complet}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Adresse:</span>{' '}
                          {commande.adresse_livraison.adresse}, {commande.adresse_livraison.ville}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
