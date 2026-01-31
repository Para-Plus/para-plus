/**
 * Page d'ajout de produit (vendeur uniquement)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { produitsApi, categoriesApi } from '@/lib/api/index';
import type { TypeProduit, Categorie } from '@/types/produit';
import { Package, ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react';

export default function AjouterProduitPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    prix_promo: '',
    type_produit: 'parapharmacie' as TypeProduit,
    categorie_id: '',
    marque: '',
    stock: '',
    disponible_location: false,
    prix_location_jour: '',
    images_urls: '', // URLs séparées par des virgules
  });

  // Vérifier les permissions et charger les catégories
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
      chargerCategories();
    }
  }, [user, authLoading, router]);

  const chargerCategories = async () => {
    try {
      const data = await categoriesApi.lister();
      setCategories(data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      setErreur('Impossible de charger les catégories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErreur(null);

    try {
      // Préparer les données
      const produitData = {
        nom: formData.nom,
        description: formData.description,
        prix: parseFloat(formData.prix),
        prix_promo: formData.prix_promo ? parseFloat(formData.prix_promo) : undefined,
        type_produit: formData.type_produit,
        categorie_id: formData.categorie_id,
        marque: formData.marque || undefined,
        stock: parseInt(formData.stock),
        disponible_location: formData.disponible_location,
        prix_location_jour: formData.disponible_location && formData.prix_location_jour
          ? parseFloat(formData.prix_location_jour)
          : undefined,
        disponible: true,
        images: formData.images_urls
          ? formData.images_urls.split(',').map(url => url.trim()).filter(url => url)
          : [],
      };

      await produitsApi.creer(produitData);

      // Rediriger vers le dashboard
      router.push('/vendeur/dashboard');
    } catch (error: any) {
      setErreur(error.response?.data?.error || 'Erreur lors de la création du produit');
      setLoading(false);
    }
  };

  if (authLoading || loadingCategories) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'vendeur') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/vendeur/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ajouter un produit</h1>
              <p className="text-gray-600">Créez une nouvelle fiche produit</p>
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

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Nom du produit */}
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Thermomètre digital"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Décrivez votre produit..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Type de produit */}
              <div>
                <label htmlFor="type_produit" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de produit *
                </label>
                <select
                  id="type_produit"
                  name="type_produit"
                  value={formData.type_produit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="parapharmacie">Parapharmacie</option>
                  <option value="pharmacie">Pharmacie</option>
                  <option value="medical">Matériel médical</option>
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label htmlFor="categorie_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  id="categorie_id"
                  name="categorie_id"
                  value={formData.categorie_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Marque */}
            <div>
              <label htmlFor="marque" className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <input
                type="text"
                id="marque"
                name="marque"
                value={formData.marque}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Omron"
              />
            </div>

            {/* URLs des images */}
            <div>
              <label htmlFor="images_urls" className="block text-sm font-medium text-gray-700 mb-2">
                URLs des images (séparées par des virgules)
              </label>
              <textarea
                id="images_urls"
                name="images_urls"
                value={formData.images_urls}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://exemple.com/image1.jpg, https://exemple.com/image2.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Entrez les URLs complètes des images, séparées par des virgules
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Prix */}
              <div>
                <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (TND) *
                </label>
                <input
                  type="number"
                  id="prix"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Prix promo */}
              <div>
                <label htmlFor="prix_promo" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix promo (TND)
                </label>
                <input
                  type="number"
                  id="prix_promo"
                  name="prix_promo"
                  value={formData.prix_promo}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Location */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="disponible_location"
                  name="disponible_location"
                  checked={formData.disponible_location}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="disponible_location" className="text-sm font-medium text-gray-700">
                  Disponible en location
                </label>
              </div>

              {formData.disponible_location && (
                <div className="ml-8">
                  <label htmlFor="prix_location_jour" className="block text-sm font-medium text-gray-700 mb-2">
                    Prix de location par jour (TND) *
                  </label>
                  <input
                    type="number"
                    id="prix_location_jour"
                    name="prix_location_jour"
                    value={formData.prix_location_jour}
                    onChange={handleChange}
                    required={formData.disponible_location}
                    min="0"
                    step="0.01"
                    className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.push('/vendeur/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Créer le produit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
