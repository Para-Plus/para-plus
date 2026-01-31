/**
 * Page de profil utilisateur
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/index';
import { User, Lock, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function ProfilPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  // État pour les informations du profil
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
  });

  // État pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    ancien_mot_de_passe: '',
    nouveau_mot_de_passe: '',
    confirmation_mot_de_passe: '',
  });

  // États pour les messages et chargement
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Rediriger si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion');
    }
  }, [user, authLoading, router]);

  // Charger les données utilisateur dans le formulaire
  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        ville: user.ville || '',
        code_postal: user.code_postal || '',
      });
    }
  }, [user]);

  // Gérer les changements dans le formulaire de profil
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer les changements dans le formulaire de mot de passe
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Soumettre les modifications du profil
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await authApi.modifierProfil(formData);
      await refreshUser();
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });

      // Faire disparaître le message après 3 secondes
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Erreur lors de la mise à jour du profil'
      });
    } finally {
      setLoading(false);
    }
  };

  // Soumettre le changement de mot de passe
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    // Valider que les mots de passe correspondent
    if (passwordData.nouveau_mot_de_passe !== passwordData.confirmation_mot_de_passe) {
      setPasswordMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setPasswordLoading(false);
      return;
    }

    // Valider la longueur du mot de passe
    if (passwordData.nouveau_mot_de_passe.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      setPasswordLoading(false);
      return;
    }

    try {
      await authApi.changerMotDePasse(
        passwordData.ancien_mot_de_passe,
        passwordData.nouveau_mot_de_passe
      );

      setPasswordMessage({ type: 'success', text: 'Mot de passe changé avec succès !' });

      // Réinitialiser le formulaire
      setPasswordData({
        ancien_mot_de_passe: '',
        nouveau_mot_de_passe: '',
        confirmation_mot_de_passe: '',
      });

      // Faire disparaître le message après 3 secondes
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch (error: any) {
      setPasswordMessage({
        type: 'error',
        text: error.response?.data?.error || 'Erreur lors du changement de mot de passe'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
              <p className="text-gray-600">Gérez vos informations personnelles</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                user.role === 'vendeur'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {user.role === 'vendeur' ? 'Vendeur' : 'Client'}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                user.est_actif
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {user.est_actif ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>

          {/* Informations compte */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Membre depuis</p>
              <p className="font-medium text-gray-900">
                {new Date(user.date_inscription).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire de modification du profil */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
          </div>

          {/* Message de succès/erreur */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmitProfile}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Prénom */}
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </div>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </div>
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Adresse section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Adresse</h3>
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                {/* Adresse */}
                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Ville */}
                  <div>
                    <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      id="ville"
                      name="ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Code postal */}
                  <div>
                    <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      id="code_postal"
                      name="code_postal"
                      value={formData.code_postal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </form>
        </div>

        {/* Formulaire de changement de mot de passe */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Changer le mot de passe</h2>
          </div>

          {/* Message de succès/erreur pour le mot de passe */}
          {passwordMessage && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              passwordMessage.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {passwordMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={passwordMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {passwordMessage.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmitPassword}>
            <div className="space-y-6 mb-6">
              {/* Ancien mot de passe */}
              <div>
                <label htmlFor="ancien_mot_de_passe" className="block text-sm font-medium text-gray-700 mb-2">
                  Ancien mot de passe *
                </label>
                <input
                  type="password"
                  id="ancien_mot_de_passe"
                  name="ancien_mot_de_passe"
                  value={passwordData.ancien_mot_de_passe}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label htmlFor="nouveau_mot_de_passe" className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe *
                </label>
                <input
                  type="password"
                  id="nouveau_mot_de_passe"
                  name="nouveau_mot_de_passe"
                  value={passwordData.nouveau_mot_de_passe}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">Minimum 8 caractères</p>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmation_mot_de_passe" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe *
                </label>
                <input
                  type="password"
                  id="confirmation_mot_de_passe"
                  name="confirmation_mot_de_passe"
                  value={passwordData.confirmation_mot_de_passe}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Changement en cours...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Changer le mot de passe
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
