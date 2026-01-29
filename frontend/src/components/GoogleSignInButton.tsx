/**
 * Composant bouton de connexion Google OAuth
 */

'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'continue_with'
}: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      onError?.('Aucun token reçu de Google');
      return;
    }

    setLoading(true);

    // Exécuter de manière asynchrone sans bloquer
    loginWithGoogle(credentialResponse.credential)
      .then(() => {
        onSuccess?.();
      })
      .catch((error: any) => {
        const errorMessage = error?.response?.data?.error || error?.message || 'Erreur lors de la connexion avec Google';
        onError?.(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleError = () => {
    onError?.('Erreur lors de la connexion avec Google');
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-3 border border-gray-300 rounded-lg bg-white">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-700">Connexion en cours...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        text={text}
        shape="rectangular"
        size="large"
      />
    </div>
  );
}
