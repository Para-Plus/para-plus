/**
 * Page panier
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { panierApi } from '@/lib/api/index';
import type { Panier, ArticlePanier } from '@/types/panier';
import { useAuth } from '@/contexts/AuthContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Loader2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PanierPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [panier, setPanier] = useState<Panier | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [actionEnCours, setActionEnCours] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/connexion');
      return;
    }
    chargerPanier();
  }, [user]);

  const chargerPanier = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const data = await panierApi.obtenir();
      setPanier(data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      setErreur('Impossible de charger le panier');
    } finally {
      setChargement(false);
    }
  };

  const handleModifierQuantite = async (articleId: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite < 1) return;

    try {
      setActionEnCours(articleId);
      const data = await panierApi.modifierQuantite({
        article_id: articleId,
        quantite: nouvelleQuantite
      });
      setPanier(data);
    } catch (error) {
      console.error('Erreur modification quantité:', error);
      alert('Erreur lors de la modification de la quantité');
    } finally {
      setActionEnCours(null);
    }
  };

  const handleSupprimerArticle = async (articleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      setActionEnCours(articleId);
      const data = await panierApi.supprimerArticle(articleId);
      setPanier(data);
    } catch (error) {
      console.error('Erreur suppression article:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setActionEnCours(null);
    }
  };

  const handleViderPanier = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider votre panier ?')) return;

    try {
      setActionEnCours('vider');
      await panierApi.vider();
      setPanier(null);
    } catch (error) {
      console.error('Erreur vidage panier:', error);
      alert('Erreur lors du vidage du panier');
    } finally {
      setActionEnCours(null);
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
          <span className="ml-3 text-gray-600">Chargement du panier...</span>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-800 text-lg mb-4">{erreur}</p>
            <button
              onClick={chargerPanier}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const panierVide = !panier || panier.articles.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

        {panierVide ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">
              Découvrez nos produits et commencez vos achats !
            </p>
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              Découvrir les produits
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              {/* En-tête */}
              <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
                <span className="text-gray-600">
                  {panier.articles.length} article{panier.articles.length > 1 ? 's' : ''}
                </span>
                <button
                  onClick={handleViderPanier}
                  disabled={actionEnCours === 'vider'}
                  className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  {actionEnCours === 'vider' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Vider le panier
                </button>
              </div>

              {/* Articles */}
              {panier.articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-4"
                >
                  {/* Image */}
                  <Link
                    href={`/produits/${article.produit.slug}`}
                    className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    {article.produit.images && article.produit.images.length > 0 ? (
                      <Image
                        src={article.produit.images[0]}
                        alt={article.produit.nom}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Pas d'image
                      </div>
                    )}
                  </Link>

                  {/* Détails */}
                  <div className="flex-1">
                    <Link
                      href={`/produits/${article.produit.slug}`}
                      className="font-semibold text-gray-900 hover:text-green-600 mb-1 block"
                    >
                      {article.produit.nom}
                    </Link>

                    <div className="text-sm text-gray-600 mb-2">
                      {article.type_article === 'location' ? (
                        <div className="flex items-center gap-1 text-blue-600">
                          <span className="font-medium">Location</span>
                          {article.date_debut_location && article.date_fin_location && (
                            <span>
                              ({article.jours_location} jours) - Du{' '}
                              {new Date(article.date_debut_location).toLocaleDateString('fr-FR')} au{' '}
                              {new Date(article.date_fin_location).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span>Achat</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantité */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleModifierQuantite(article.id, article.quantite - 1)}
                          disabled={actionEnCours === article.id || article.quantite <= 1}
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{article.quantite}</span>
                        <button
                          onClick={() => handleModifierQuantite(article.id, article.quantite + 1)}
                          disabled={
                            actionEnCours === article.id ||
                            article.quantite >= article.produit.stock
                          }
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Prix */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {article.prix_unitaire.toFixed(2)} TND
                          {article.type_article === 'location' && '/jour'}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {article.prix_total.toFixed(2)} TND
                        </p>
                      </div>

                      {/* Supprimer */}
                      <button
                        onClick={() => handleSupprimerArticle(article.id)}
                        disabled={actionEnCours === article.id}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        {actionEnCours === article.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Sous-total</span>
                    <span>{panier.total.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Frais de livraison</span>
                    <span className="text-green-600">Calculés au checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-green-600">{panier.total.toFixed(2)} TND</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold mb-3"
                >
                  Passer la commande
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/produits"
                  className="w-full block text-center text-green-600 hover:text-green-700 font-medium"
                >
                  Continuer mes achats
                </Link>

                {/* Infos */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      Les prix et disponibilités sont confirmés au moment du paiement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
