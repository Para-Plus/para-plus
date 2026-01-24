/**
 * Page d'accueil Para-plus.tn
 */

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">Para-plus.tn</h1>
          <nav className="flex gap-4">
            <Link
              href="/connexion"
              className="px-4 py-2 text-gray-700 hover:text-green-600 transition"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Inscription
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Votre Marketplace Santé et Bien-être
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez notre large gamme de produits parapharmacie, pharmacie, matériel médical
            et louez du matériel paramédical en toute simplicité.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/produits"
              className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            >
              Découvrir les produits
            </Link>
            <Link
              href="/location"
              className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg text-lg font-semibold hover:bg-green-50 transition"
            >
              Louer du matériel
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Large Catalogue</h3>
            <p className="text-gray-600">
              Des milliers de produits parapharmacie, pharmacie et matériel médical disponibles
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Location Flexible</h3>
            <p className="text-gray-600">
              Louez du matériel paramédical pour la durée dont vous avez besoin
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
            <p className="text-gray-600">
              Recevez vos commandes rapidement partout en Tunisie
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-green-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Devenez Vendeur sur Para-plus.tn</h3>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez notre marketplace et développez votre activité
          </p>
          <Link
            href="/inscription?role=vendeur"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            S'inscrire comme vendeur
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Para-plus.tn</h4>
              <p className="text-gray-400">
                Marketplace santé et bien-être en Tunisie
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/produits" className="hover:text-white">Produits</Link></li>
                <li><Link href="/location" className="hover:text-white">Location</Link></li>
                <li><Link href="/categories" className="hover:text-white">Catégories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Aide</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/conditions" className="hover:text-white">Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">contact@para-plus.tn</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Para-plus.tn - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
