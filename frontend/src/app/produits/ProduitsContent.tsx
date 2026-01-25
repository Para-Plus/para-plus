/**
 * Contenu de la page produits (client component)
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CarteProduit from '@/components/produits/CarteProduit';
import FiltresProduits from '@/components/produits/FiltresProduits';
import { produitsApi } from '@/lib/api/index';
import type { Produit, FiltreProduits, ResultatProduits } from '@/types/produit';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function ProduitsContent() {
  const searchParams = useSearchParams();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [resultat, setResultat] = useState<ResultatProduits | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  // Filtres
  const [filtres, setFiltres] = useState<FiltreProduits>({
    page: 1,
    limite: 12
  });

  // Recherche
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    // Initialiser les filtres depuis l'URL
    const typeUrl = searchParams.get('type');
    const categorieUrl = searchParams.get('categorie');

    setFiltres((prev) => ({
      ...prev,
      type_produit: (typeUrl as any) || undefined,
      categorie_id: categorieUrl || undefined
    }));
  }, [searchParams]);

  useEffect(() => {
    chargerProduits();
  }, [filtres]);

  const chargerProduits = async () => {
    try {
      setChargement(true);
      setErreur(null);
      const data = await produitsApi.lister(filtres);
      setProduits(data.produits);
      setResultat(data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setErreur('Impossible de charger les produits. Veuillez réessayer.');
    } finally {
      setChargement(false);
    }
  };

  const handleRecherche = (e: React.FormEvent) => {
    e.preventDefault();
    setFiltres({
      ...filtres,
      recherche: recherche || undefined,
      page: 1
    });
  };

  const handleChangerPage = (nouvellePage: number) => {
    setFiltres({
      ...filtres,
      page: nouvellePage
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReinitialiserFiltres = () => {
    setFiltres({
      page: 1,
      limite: 12
    });
    setRecherche('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Nos Produits</h1>

        {/* Barre de recherche */}
        <form onSubmit={handleRecherche} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            Rechercher
          </button>
        </form>

        {/* Résultats */}
        {resultat && (
          <p className="mt-4 text-gray-600">
            {resultat.total} produit{resultat.total > 1 ? 's' : ''} trouvé{resultat.total > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtres sidebar */}
        <aside className="lg:col-span-1">
          <FiltresProduits
            filtres={filtres}
            onChangerFiltres={setFiltres}
            onReinitialiser={handleReinitialiserFiltres}
          />
        </aside>

        {/* Liste des produits */}
        <main className="lg:col-span-3">
          {chargement ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              <span className="ml-3 text-gray-600">Chargement des produits...</span>
            </div>
          ) : erreur ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800">{erreur}</p>
              <button
                onClick={chargerProduits}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          ) : produits.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">Aucun produit trouvé</p>
              <button
                onClick={handleReinitialiserFiltres}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              {/* Grille de produits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {produits.map((produit) => (
                  <CarteProduit key={produit.id} produit={produit} />
                ))}
              </div>

              {/* Pagination */}
              {resultat && resultat.pages_total > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleChangerPage(filtres.page! - 1)}
                    disabled={filtres.page === 1}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                      filtres.page === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: resultat.pages_total }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handleChangerPage(page)}
                        className={`w-10 h-10 rounded-lg ${
                          page === filtres.page
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleChangerPage(filtres.page! + 1)}
                    disabled={filtres.page === resultat.pages_total}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                      filtres.page === resultat.pages_total
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
