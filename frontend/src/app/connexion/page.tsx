/**
 * Page de connexion
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import type { ConnexionData } from '@/types';

export default function ConnexionPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<ConnexionData>({
    email: '',
    mot_de_passe: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await login(formData);
      router.push('/'); // Rediriger vers l'accueil après connexion
    } catch (err: any) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.error ||
          'Email ou mot de passe incorrect'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-green-600">
            Para-plus.tn
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Google Sign In */}
        <div className="mb-6">
          <GoogleSignInButton
            text="signin_with"
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="mot_de_passe"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            <Link href="/mot-de-passe-oublie" className="text-sm text-green-600 hover:text-green-700">
              Mot de passe oublié?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-600">
          Vous n'avez pas de compte?{' '}
          <Link href="/inscription" className="text-green-600 font-semibold hover:text-green-700">
            S'inscrire
          </Link>
        </p>

        {/* Vendor Link */}
        <div className="mt-6">
          <Link
            href="/inscription?role=vendeur"
            className="w-full block text-center px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Devenir vendeur
          </Link>
        </div>
      </div>
    </div>
  );
}
