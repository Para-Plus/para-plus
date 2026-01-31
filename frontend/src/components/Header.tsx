/**
 * Header commun pour toutes les pages
 */

'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, UserCircle } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

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
                  <Link
                    href="/vendeur/dashboard"
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                  >
                    <Package className="w-5 h-5" />
                    <span className="hidden sm:inline">Mes Produits</span>
                  </Link>
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
    </header>
  );
}
