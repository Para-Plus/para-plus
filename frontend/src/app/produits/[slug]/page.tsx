/**
 * Page détail produit
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import CarteProduit from '@/components/produits/CarteProduit';
import { produitsApi, panierApi } from '@/lib/api/index';
import type { Produit } from '@/types/produit';
import type { TypeArticle } from '@/types/panier';
import {
  ShoppingCart,
  Clock,
  Loader2,
  Check,
  Star,
  Package,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProduitDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [produit, setProduit] = useState<Produit | null>(null);
  const [produitsSimilaires, setProduitsSimilaires] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ajoutPanier, setAjoutPanier] = useState(false);
  const [messageSucces, setMessageSucces] = useState('');

  // État formulaire
  const [typeArticle, setTypeArticle] = useState<TypeArticle>('achat');
  const [quantite, setQuantite] = useState(1);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [imageActive, setImageActive] = useState(0);

  useEffect(() => {
    chargerProduit();
  }, [slug]);

  const chargerProduit = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const data = await produitsApi.obtenirParSlug(slug);
      setProduit(data);

      // Charger produits similaires
      const similaires = await produitsApi.similaires(data.id);
      setProduitsSimilaires(similaires);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
      setErreur('Produit introuvable');
    } finally {
      setChargement(false);
    }
  };

  const handleAjouterPanier = async () => {
    if (!produit) return;

    if (typeArticle === 'location' && (!dateDebut || !dateFin)) {
      alert('Veuillez sélectionner les dates de location');
      return;
    }

    try {
      setAjoutPanier(true);
      await panierApi.ajouter({
        produit_id: produit.id,
        quantite,
        type_article: typeArticle,
        date_debut_location: typeArticle === 'location' ? dateDebut : undefined,
        date_fin_location: typeArticle === 'location' ? dateFin : undefined
      });

      setMessageSucces('Produit ajouté au panier !');
      setTimeout(() => setMessageSucces(''), 3000);
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setAjoutPanier(false);
    }
  };

  const calculerJoursLocation = () => {
    if (!dateDebut || !dateFin) return 0;
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diff = fin.getTime() - debut.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculerPrixTotal = () => {
    if (!produit) return 0;

    if (typeArticle === 'achat') {
      const prix = produit.prix_promo || produit.prix;
      return prix * quantite;
    } else {
      const jours = calculerJoursLocation();
      return (produit.prix_location_jour || 0) * jours * quantite;
    }
  };

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Chargement du produit...</span>
        </div>
      </div>
    );
  }

  if (erreur || !produit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-800 text-lg mb-4">{erreur}</p>
            <Link
              href="/produits"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Retour aux produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const prixAffiche = produit.prix_promo || produit.prix;
  const aPromo = !!produit.prix_promo;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Message succès */}
      {messageSucces && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in">
          <Check className="w-5 h-5" />
          {messageSucces}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-green-600">Accueil</Link>
          <span>/</span>
          <Link href="/produits" className="hover:text-green-600">Produits</Link>
          <span>/</span>
          <span className="text-gray-900">{produit.nom}</span>
        </nav>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative h-96 bg-white rounded-lg overflow-hidden">
              {produit.images && produit.images.length > 0 ? (
                <Image
                  src={produit.images[imageActive]}
                  alt={produit.nom}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Pas d'image
                </div>
              )}

              {/* Navigation images */}
              {produit.images && produit.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImageActive((prev) => (prev > 0 ? prev - 1 : produit.images.length - 1))}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setImageActive((prev) => (prev < produit.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Miniatures */}
            {produit.images && produit.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {produit.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageActive(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                      imageActive === idx ? 'border-green-600' : 'border-gray-300'
                    }`}
                  >
                    <Image src={img} alt={`${produit.nom} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="space-y-6">
            {/* En-tête */}
            <div>
              {produit.categorie && (
                <p className="text-sm text-gray-600 mb-2">{produit.categorie.nom}</p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{produit.nom}</h1>
              {produit.marque && (
                <p className="text-gray-600">Marque: <span className="font-semibold">{produit.marque}</span></p>
              )}
            </div>

            {/* Prix */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-green-600">
                  {prixAffiche.toFixed(2)} TND
                </span>
                {aPromo && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {produit.prix.toFixed(2)} TND
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -{Math.round((1 - prixAffiche / produit.prix) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {produit.disponible_location && produit.prix_location_jour && (
                <p className="text-blue-600 font-medium">
                  Location disponible: {produit.prix_location_jour.toFixed(2)} TND/jour
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {produit.disponible ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">En stock ({produit.stock} disponibles)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Rupture de stock</span>
                </>
              )}
            </div>

            {/* Type d'article (achat ou location) */}
            {produit.disponible_location && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900 mb-3">Type d'article:</p>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="achat"
                      checked={typeArticle === 'achat'}
                      onChange={(e) => setTypeArticle(e.target.value as TypeArticle)}
                      className="mr-2"
                    />
                    <span>Achat</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="location"
                      checked={typeArticle === 'location'}
                      onChange={(e) => setTypeArticle(e.target.value as TypeArticle)}
                      className="mr-2"
                    />
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Location
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Dates de location */}
            {typeArticle === 'location' && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <p className="font-medium text-gray-900">Période de location:</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Date début</label>
                    <input
                      type="date"
                      value={dateDebut}
                      onChange={(e) => setDateDebut(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Date fin</label>
                    <input
                      type="date"
                      value={dateFin}
                      onChange={(e) => setDateFin(e.target.value)}
                      min={dateDebut || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {dateDebut && dateFin && (
                  <p className="text-sm text-gray-700">
                    Durée: <span className="font-semibold">{calculerJoursLocation()} jours</span>
                  </p>
                )}
              </div>
            )}

            {/* Quantité */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">Quantité:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantite}</span>
                <button
                  onClick={() => setQuantite((q) => Math.min(produit.stock, q + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                  disabled={!produit.disponible}
                >
                  +
                </button>
              </div>
            </div>

            {/* Prix total */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">Prix total:</span>
                <span className="text-2xl font-bold text-green-600">
                  {calculerPrixTotal().toFixed(2)} TND
                </span>
              </div>
              {typeArticle === 'location' && dateDebut && dateFin && (
                <p className="text-sm text-gray-600 mt-1">
                  {quantite} × {calculerJoursLocation()} jours × {produit.prix_location_jour?.toFixed(2)} TND/jour
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAjouterPanier}
                disabled={!produit.disponible || ajoutPanier || !user}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold text-lg transition-colors ${
                  !produit.disponible || !user
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {ajoutPanier ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {!user ? 'Connectez-vous pour acheter' : 'Ajouter au panier'}
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{produit.description}</p>
            </div>

            {/* Caractéristiques */}
            {produit.caracteristiques && Object.keys(produit.caracteristiques).length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Caractéristiques</h2>
                <dl className="space-y-2">
                  {Object.entries(produit.caracteristiques).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="w-1/3 text-gray-600">{key}:</dt>
                      <dd className="w-2/3 font-medium text-gray-900">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Vendeur */}
            {produit.vendeur && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Vendeur</h2>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {produit.vendeur.prenom} {produit.vendeur.nom}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4" />
                      <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Produits similaires */}
        {produitsSimilaires.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {produitsSimilaires.map((p) => (
                <CarteProduit key={p.id} produit={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
