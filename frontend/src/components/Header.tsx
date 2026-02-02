/**
 * Header commun pour toutes les pages
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, UserCircle, ShoppingBag, Search, X } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [rechercheOuverte, setRechercheOuverte] = useState(false);
  const [termesRecherche, setTermesRecherche] = useState('');

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRechercheOuverte(false);
      }
    };

    if (rechercheOuverte) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [rechercheOuverte]);

  const handleRecherche = (e: React.FormEvent) => {
    e.preventDefault();
    if (termesRecherche.trim()) {
      setRechercheOuverte(false);
      router.push(`/produits?recherche=${encodeURIComponent(termesRecherche)}`);
      setTermesRecherche('');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700">
            Para-plus.tn
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/produits" className="text-gray-700 hover:text-green-600 font-medium">
              Produits
            </Link>
            <Link href="/location" className="text-gray-700 hover:text-green-600 font-medium">
              Location
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Recherche */}
            <button
              onClick={() => setRechercheOuverte(true)}
              className="flex items-center gap-2 text-gray-700 hover:text-green-600"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
              <span className="hidden lg:inline">Rechercher</span>
            </button>

            {/* Panier */}
            <Link
              href="/panier"
              className="flex items-center gap-2 text-gray-700 hover:text-green-600"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Panier</span>
            </Link>

            {/* User menu */}
            {user ? (
              <div className="flex items-center gap-4">
                {/* Dashboard Client */}
                {user.role === 'client' && (
                  <Link
                    href="/client/dashboard"
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="hidden sm:inline">Mes Commandes</span>
                  </Link>
                )}

                {/* Dashboard Vendeur */}
                {user.role === 'vendeur' && (
                  <>
                    <Link
                      href="/vendeur/dashboard"
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                    >
                      <Package className="w-5 h-5" />
                      <span className="hidden sm:inline">Mes Produits</span>
                    </Link>
                    <Link
                      href="/vendeur/commandes"
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="hidden sm:inline">Mes Commandes</span>
                    </Link>
                  </>
                )}

                {/* Profil */}
                <Link
                  href="/profil"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">Profil</span>
                </Link>

                {/* Déconnexion */}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/connexion"
                  className="text-gray-700 hover:text-green-600 font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de recherche */}
      {rechercheOuverte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {/* En-tête du modal */}
            <div className="flex items-center gap-4 p-6 border-b border-gray-200">
              <Search className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <form onSubmit={handleRecherche} className="flex-1">
                <input
                  type="text"
                  value={termesRecherche}
                  onChange={(e) => setTermesRecherche(e.target.value)}
                  placeholder="Rechercher des produits..."
                  autoFocus
                  className="w-full text-xl outline-none placeholder-gray-400"
                />
              </form>
              <button
                onClick={() => setRechercheOuverte(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Suggestions */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                Recherches populaires
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Thermomètre',
                  'Masque',
                  'Fauteuil roulant',
                  'Béquilles',
                  'Glucomètre',
                  'Tensomètre',
                  'Vitamines',
                  'Désinfectant'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setTermesRecherche(suggestion);
                      setRechercheOuverte(false);
                      router.push(`/produits?recherche=${encodeURIComponent(suggestion)}`);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-green-100 hover:text-green-700 rounded-full text-sm font-medium transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Catégories rapides */}
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 mt-8">
                Catégories
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <Link
                  href="/produits?type=parapharmacie"
                  onClick={() => setRechercheOuverte(false)}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Parapharmacie</span>
                </Link>

                <Link
                  href="/produits?type=pharmacie"
                  onClick={() => setRechercheOuverte(false)}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Pharmacie</span>
                </Link>

                <Link
                  href="/location"
                  onClick={() => setRechercheOuverte(false)}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Location</span>
                </Link>
              </div>

              {/* Raccourci clavier */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                <span>Appuyez sur <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> pour fermer</span>
                <span>Ou <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> pour rechercher</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
