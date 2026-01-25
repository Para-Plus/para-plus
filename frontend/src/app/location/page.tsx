/**
 * Page location - Matériel médical à louer
 */

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CarteProduit from '@/components/produits/CarteProduit';
import { produitsApi } from '@/lib/api/index';
import type { Produit, FiltreProduits } from '@/types/produit';
import { Clock, Search, Loader2, Info } from 'lucide-react';

export default function LocationPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    chargerProduitsLocation();
  }, []);

  const chargerProduitsLocation = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const filtres: FiltreProduits = {
        disponible_location: true,
        type_produit: 'medical',
        limite: 50
      };
      const data = await produitsApi.lister(filtres);
      setProduits(data.produits);
    } catch (error) {
      console.error('Erreur chargement produits location:', error);
      setErreur('Impossible de charger les produits de location');
    } finally {
      setChargement(false);
    }
  };

  const handleRecherche = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtrer localement pour la démo
    // En production, on ferait un nouvel appel API
  };

  const produitsFiltres = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Location de Matériel Médical</h1>
            </div>
            <p className="text-xl opacity-90 mb-6">
              Louez du matériel paramédical de qualité pour la durée dont vous avez besoin.
              Simple, rapide et économique.
            </p>
            <div className="flex items-start gap-3 bg-white bg-opacity-20 rounded-lg p-4">
              <Info className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Comment ça marche ?</p>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>1. Choisissez votre matériel et la durée de location</li>
                  <li>2. Ajoutez au panier et finalisez votre commande</li>
                  <li>3. Recevez le matériel à domicile</li>
                  <li>4. Retournez-le à la fin de la période de location</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recherche */}
        <div className="mb-8">
          <form onSubmit={handleRecherche} className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher du matériel médical à louer..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Catégories populaires */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { nom: 'Fauteuils roulants', icone: '♿' },
              { nom: 'Lits médicalisés', icone: '🛏️' },
              { nom: 'Béquilles & Cannes', icone: '🦯' },
              { nom: 'Oxygénothérapie', icone: '💨' },
              { nom: 'Déambulateurs', icone: '🚶' },
              { nom: 'Matériel de soin', icone: '💊' },
              { nom: 'Aide au quotidien', icone: '🏠' },
              { nom: 'Autres équipements', icone: '⚕️' }
            ].map((cat) => (
              <button
                key={cat.nom}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-4xl mb-2">{cat.icone}</div>
                <p className="font-medium text-gray-900">{cat.nom}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Avantages */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Pourquoi louer chez Para-plus.tn ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Économique</h3>
              <p className="text-gray-600">
                Louez au lieu d'acheter et économisez jusqu'à 70%
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualité garantie</h3>
              <p className="text-gray-600">
                Matériel vérifié, désinfecté et en parfait état
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Livraison rapide</h3>
              <p className="text-gray-600">
                Livraison et installation à domicile partout en Tunisie
              </p>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Matériel disponible à la location
          </h2>

          {chargement ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Chargement du matériel...</span>
            </div>
          ) : erreur ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800">{erreur}</p>
              <button
                onClick={chargerProduitsLocation}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          ) : produitsFiltres.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">
                {recherche
                  ? 'Aucun matériel trouvé pour cette recherche'
                  : 'Aucun matériel disponible à la location pour le moment'}
              </p>
              {recherche && (
                <button
                  onClick={() => setRecherche('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Réinitialiser la recherche
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                {produitsFiltres.length} équipement{produitsFiltres.length > 1 ? 's' : ''} disponible{produitsFiltres.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {produitsFiltres.map((produit) => (
                  <CarteProduit key={produit.id} produit={produit} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* FAQ */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quelle est la durée minimale de location ?
              </h3>
              <p className="text-gray-600">
                La durée minimale de location est généralement de 1 jour. Certains équipements peuvent avoir des durées minimales différentes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Comment se passe la livraison ?
              </h3>
              <p className="text-gray-600">
                Nous livrons le matériel à votre domicile et assurons l'installation si nécessaire. À la fin de la période de location, nous venons récupérer le matériel.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Le matériel est-il assuré ?
              </h3>
              <p className="text-gray-600">
                Oui, tout notre matériel est assuré. En cas de dommage, une franchise peut s'appliquer selon les conditions de location.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Puis-je prolonger ma location ?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez prolonger votre location en nous contactant avant la fin de la période initiale. Le tarif de location journalier s'appliquera pour la période supplémentaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
