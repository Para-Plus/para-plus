/**
 * Page d'inscription
 */

import { Suspense } from 'react';
import InscriptionForm from './InscriptionForm';
import Link from 'next/link';

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-green-600">
            Para-plus.tn
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Créer un compte</h2>
          <p className="mt-2 text-gray-600">
            Inscrivez-vous pour commencer vos achats
          </p>
        </div>

        {/* Form avec Suspense */}
        <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
          <InscriptionForm />
        </Suspense>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600">
          Vous avez déjà un compte?{' '}
          <Link href="/connexion" className="text-green-600 font-semibold hover:text-green-700">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
