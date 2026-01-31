/**
 * Page de sélection du rôle après première connexion Google
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { User, ShoppingBag } from 'lucide-react';

export default function ChoisirRolePage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelection = async (role: 'client' | 'vendeur') => {
    setLoading(true);
    setError('');

    try {
      await apiClient.patch('/auth/choisir-role/', { role });
      await refreshUser(); // Rafraîchir les données utilisateur
      router.push('/'); // Rediriger vers l'accueil
    } catch (err: any) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Bienvenue sur Para-plus.tn!
          </h1>
          <p className="text-lg text-gray-600">
            Pour continuer, choisissez votre profil
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Client Card */}
          <button
            onClick={() => handleRoleSelection('client')}
            disabled={loading}
            className="group relative p-8 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <ShoppingBag className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Client</h3>
              <p className="text-gray-600 text-sm">
                Je souhaite acheter ou louer des produits parapharmacie et matériel médical
              </p>
            </div>
          </button>

          {/* Vendeur Card */}
          <button
            onClick={() => handleRoleSelection('vendeur')}
            disabled={loading}
            className="group relative p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vendeur</h3>
              <p className="text-gray-600 text-sm">
                Je souhaite vendre mes produits sur la plateforme Para-plus.tn
              </p>
            </div>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-700">Enregistrement en cours...</span>
          </div>
        )}

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Vous pourrez modifier votre rôle plus tard dans les paramètres de votre compte
        </p>
      </div>
    </div>
  );
}
