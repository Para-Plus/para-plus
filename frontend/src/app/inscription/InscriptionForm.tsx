/**
 * Formulaire d'inscription (composant client)
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import type { InscriptionData } from '@/types';

export default function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const roleFromUrl = searchParams.get('role') as 'client' | 'vendeur' | null;

  const [formData, setFormData] = useState<InscriptionData>({
    email: '',
    mot_de_passe: '',
    confirmation_mot_de_passe: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: roleFromUrl || 'client',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      router.push('/'); // Rediriger vers l'accueil après inscription
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.email?.[0] ||
          'Erreur lors de l\'inscription'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Google Sign In */}
      <div className="mb-6">
        <GoogleSignInButton
          text="signup_with"
          onSuccess={() => router.push('/')}
          onError={(error) => setError(error)}
        />
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Ou avec email</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Type de compte *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="client">Client</option>
            <option value="vendeur">Vendeur</option>
          </select>
        </div>

        {/* Nom et Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="+216 12 345 678"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe * (min. 8 caractères)
          </label>
          <input
            type="password"
            id="mot_de_passe"
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Confirmation mot de passe */}
        <div>
          <label
            htmlFor="confirmation_mot_de_passe"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirmer le mot de passe *
          </label>
          <input
            type="password"
            id="confirmation_mot_de_passe"
            name="confirmation_mot_de_passe"
            value={formData.confirmation_mot_de_passe}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>
    </>
  );
}
