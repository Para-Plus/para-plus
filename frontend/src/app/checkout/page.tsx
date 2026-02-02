/**
 * Page checkout - finalisation de commande
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { panierApi, commandesApi } from '@/lib/api/index';
import type { Panier } from '@/types/panier';
import type { AdresseLivraison, CreerCommandeData } from '@/types/commande';
import { useAuth } from '@/contexts/AuthContext';
import {
  Loader2,
  ShoppingCart,
  MapPin,
  CreditCard,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const gouvernoratsTunisie = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
  'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba',
  'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana',
  'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [panier, setPanier] = useState<Panier | null>(null);
  const [chargement, setChargement] = useState(true);
  const [traitement, setTraitement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [etape, setEtape] = useState<'livraison' | 'paiement' | 'confirmation'>('livraison');

  // Formulaire adresse
  const [adresse, setAdresse] = useState<AdresseLivraison>({
    nom_complet: user ? `${user.prenom} ${user.nom}` : '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    gouvernorat: '',
    instructions: ''
  });

  // Méthode de paiement
  const [methodePaiement, setMethodePaiement] = useState<string>('');

  const fraisLivraison = 7.0; // 7 TND frais de livraison standard

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
      if (!data || data.articles.length === 0) {
        router.push('/panier');
        return;
      }
      setPanier(data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      setErreur('Impossible de charger le panier');
    } finally {
      setChargement(false);
    }
  };

  const handleChangerAdresse = (champ: keyof AdresseLivraison, valeur: string) => {
    setAdresse((prev) => ({ ...prev, [champ]: valeur }));
  };

  const validerEtapeLivraison = () => {
    if (!adresse.nom_complet.trim()) {
      alert('Veuillez entrer votre nom complet');
      return false;
    }
    if (!adresse.telephone.trim() || adresse.telephone.length < 8) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return false;
    }
    if (!adresse.adresse.trim()) {
      alert('Veuillez entrer votre adresse');
      return false;
    }
    if (!adresse.ville.trim()) {
      alert('Veuillez entrer votre ville');
      return false;
    }
    if (!adresse.code_postal.trim()) {
      alert('Veuillez entrer votre code postal');
      return false;
    }
    if (!adresse.gouvernorat) {
      alert('Veuillez sélectionner votre gouvernorat');
      return false;
    }
    return true;
  };

  const handleContinuerVersPaiement = () => {
    if (validerEtapeLivraison()) {
      setEtape('paiement');
    }
  };

  const handlePasserCommande = async () => {
    if (!methodePaiement) {
      alert('Veuillez sélectionner une méthode de paiement');
      return;
    }

    try {
      setTraitement(true);
      setErreur(null);

      const commandeData: CreerCommandeData = {
        adresse_livraison: adresse,
        methode_paiement: methodePaiement
      };

      const commande = await commandesApi.creer(commandeData);

      // Rediriger vers la page de confirmation
      setEtape('confirmation');

      // Rediriger après 3 secondes
      setTimeout(() => {
        router.push(`/commandes/${commande.id}`);
      }, 3000);
    } catch (error) {
      console.error('Erreur création commande:', error);
      setErreur('Erreur lors de la création de la commande. Veuillez réessayer.');
      setTraitement(false);
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
          <span className="ml-3 text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  if (erreur && !panier) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-800 text-lg mb-4">{erreur}</p>
            <Link
              href="/panier"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au panier
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalCommande = (panier?.total || 0) + fraisLivraison;

  // Page de confirmation
  if (etape === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Commande confirmée !
            </h1>
            <p className="text-gray-600 mb-6">
              Merci pour votre commande. Vous allez recevoir un email de confirmation.
            </p>
            {traitement && (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Redirection vers vos commandes...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href="/panier"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au panier
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser la commande</h1>
        </div>

        {/* Indicateur d'étapes */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                etape === 'livraison'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <span className={etape === 'livraison' ? 'font-semibold' : 'text-gray-600'}>
              Livraison
            </span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                etape === 'paiement'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <CreditCard className="w-4 h-4" />
            </div>
            <span className={etape === 'paiement' ? 'font-semibold' : 'text-gray-600'}>
              Paiement
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            {/* Étape Livraison */}
            {etape === 'livraison' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Adresse de livraison
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={adresse.nom_complet}
                      onChange={(e) => handleChangerAdresse('nom_complet', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Prénom et Nom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={adresse.telephone}
                      onChange={(e) => handleChangerAdresse('telephone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse complète *
                    </label>
                    <input
                      type="text"
                      value={adresse.adresse}
                      onChange={(e) => handleChangerAdresse('adresse', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Numéro, rue, bâtiment..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville *
                      </label>
                      <input
                        type="text"
                        value={adresse.ville}
                        onChange={(e) => handleChangerAdresse('ville', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        value={adresse.code_postal}
                        onChange={(e) => handleChangerAdresse('code_postal', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="XXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gouvernorat *
                    </label>
                    <select
                      value={adresse.gouvernorat}
                      onChange={(e) => handleChangerAdresse('gouvernorat', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionnez un gouvernorat</option>
                      {gouvernoratsTunisie.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions de livraison (optionnel)
                    </label>
                    <textarea
                      value={adresse.instructions}
                      onChange={(e) => handleChangerAdresse('instructions', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Code d'accès, étage, etc."
                    />
                  </div>
                </div>

                <button
                  onClick={handleContinuerVersPaiement}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Continuer vers le paiement
                </button>
              </div>
            )}

            {/* Étape Paiement */}
            {etape === 'paiement' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Méthode de paiement
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
                    <input
                      type="radio"
                      name="paiement"
                      value="cod"
                      checked={methodePaiement === 'cod'}
                      onChange={(e) => setMethodePaiement(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Paiement à la livraison</p>
                      <p className="text-sm text-gray-600">
                        Payez en espèces lors de la réception de votre commande
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500 opacity-50">
                    <input
                      type="radio"
                      name="paiement"
                      value="carte"
                      disabled
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Carte bancaire</p>
                      <p className="text-sm text-gray-600">
                        Bientôt disponible
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-500 opacity-50">
                    <input
                      type="radio"
                      name="paiement"
                      value="virement"
                      disabled
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Virement bancaire</p>
                      <p className="text-sm text-gray-600">
                        Bientôt disponible
                      </p>
                    </div>
                  </label>
                </div>

                {erreur && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{erreur}</p>
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => setEtape('livraison')}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handlePasserCommande}
                    disabled={traitement}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {traitement ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      'Confirmer la commande'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Récapitulatif
              </h2>

              {/* Articles */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {panier?.articles.map((article) => (
                  <div key={article.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {article.produit.nom} × {article.quantite}
                    </span>
                    <span className="font-medium">{article.prix_total.toFixed(2)} TND</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total</span>
                  <span>{panier?.total.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Frais de livraison</span>
                  <span>{fraisLivraison.toFixed(2)} TND</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{totalCommande.toFixed(2)} TND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
