/**
 * Composant carte produit
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Produit } from '@/types/produit';
import { ShoppingCart, Clock } from 'lucide-react';

interface CarteProduitProps {
  produit: Produit;
}

export default function CarteProduit({ produit }: CarteProduitProps) {
  const prixAffiche = produit.prix_promo || produit.prix;
  const aPromo = !!produit.prix_promo;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/produits/${produit.slug}`}>
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          {produit.images && produit.images.length > 0 ? (
            <Image
              src={produit.images[0]}
              alt={produit.nom}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Pas d'image
            </div>
          )}

          {/* Badge promo */}
          {aPromo && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
              PROMO
            </div>
          )}

          {/* Badge location */}
          {produit.disponible_location && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Location
            </div>
          )}

          {/* Badge rupture de stock */}
          {!produit.disponible && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-gray-800 text-white px-4 py-2 rounded font-bold">
                Rupture de stock
              </span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          {/* Catégorie */}
          {produit.categorie && (
            <p className="text-sm text-gray-500 mb-1">{produit.categorie.nom}</p>
          )}

          {/* Nom */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-600">
            {produit.nom}
          </h3>

          {/* Marque */}
          {produit.marque && (
            <p className="text-sm text-gray-600 mb-2">Marque: {produit.marque}</p>
          )}

          {/* Prix */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-green-600">
              {prixAffiche.toFixed(2)} TND
            </span>
            {aPromo && (
              <span className="text-sm text-gray-500 line-through">
                {produit.prix.toFixed(2)} TND
              </span>
            )}
          </div>

          {/* Prix location */}
          {produit.disponible_location && produit.prix_location_jour && (
            <p className="text-sm text-blue-600 mb-3">
              Location: {produit.prix_location_jour.toFixed(2)} TND/jour
            </p>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4 pb-4">
        <Link
          href={`/produits/${produit.slug}`}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
            produit.disponible
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {produit.disponible ? 'Ajouter au panier' : 'Indisponible'}
        </Link>
      </div>
    </div>
  );
}
