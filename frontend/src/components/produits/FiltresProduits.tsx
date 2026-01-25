/**
 * Composant filtres produits
 */

'use client';

import { useState, useEffect } from 'react';
import type { FiltreProduits, TypeProduit, Categorie } from '@/types/produit';
import { categoriesApi } from '@/lib/api/index';
import { X } from 'lucide-react';

interface FiltresProduitsProps {
  filtres: FiltreProduits;
  onChangerFiltres: (filtres: FiltreProduits) => void;
  onReinitialiser: () => void;
}

export default function FiltresProduits({
  filtres,
  onChangerFiltres,
  onReinitialiser
}: FiltresProduitsProps) {
  const [categories, setCategories] = useState<Categorie[]>([]);

  useEffect(() => {
    chargerCategories();
  }, []);

  const chargerCategories = async () => {
    try {
      const data = await categoriesApi.lister();
      setCategories(data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const handleTypeChange = (type: TypeProduit | '') => {
    onChangerFiltres({
      ...filtres,
      type_produit: type || undefined,
      page: 1
    });
  };

  const handleCategorieChange = (categorieId: string) => {
    onChangerFiltres({
      ...filtres,
      categorie_id: categorieId || undefined,
      page: 1
    });
  };

  const handlePrixChange = (min: string, max: string) => {
    onChangerFiltres({
      ...filtres,
      prix_min: min ? parseFloat(min) : undefined,
      prix_max: max ? parseFloat(max) : undefined,
      page: 1
    });
  };

  const handleLocationChange = (disponible: boolean | undefined) => {
    onChangerFiltres({
      ...filtres,
      disponible_location: disponible,
      page: 1
    });
  };

  const handleTriChange = (tri: FiltreProduits['tri']) => {
    onChangerFiltres({
      ...filtres,
      tri: tri || undefined
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
        <button
          onClick={onReinitialiser}
          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>

      {/* Type de produit */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de produit
        </label>
        <select
          value={filtres.type_produit || ''}
          onChange={(e) => handleTypeChange(e.target.value as TypeProduit | '')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Tous les types</option>
          <option value="parapharmacie">Parapharmacie</option>
          <option value="pharmacie">Pharmacie</option>
          <option value="medical">Médical</option>
        </select>
      </div>

      {/* Catégorie */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie
        </label>
        <select
          value={filtres.categorie_id || ''}
          onChange={(e) => handleCategorieChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Prix */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prix (TND)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filtres.prix_min || ''}
            onChange={(e) => handlePrixChange(e.target.value, filtres.prix_max?.toString() || '')}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filtres.prix_max || ''}
            onChange={(e) => handlePrixChange(filtres.prix_min?.toString() || '', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Disponibilité location
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              checked={filtres.disponible_location === undefined}
              onChange={() => handleLocationChange(undefined)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Tous</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={filtres.disponible_location === true}
              onChange={() => handleLocationChange(true)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Location disponible</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={filtres.disponible_location === false}
              onChange={() => handleLocationChange(false)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Achat uniquement</span>
          </label>
        </div>
      </div>

      {/* Tri */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trier par
        </label>
        <select
          value={filtres.tri || ''}
          onChange={(e) => handleTriChange(e.target.value as FiltreProduits['tri'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Par défaut</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
          <option value="recent">Plus récents</option>
          <option value="populaire">Plus populaires</option>
        </select>
      </div>
    </div>
  );
}
