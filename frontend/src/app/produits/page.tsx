/**
 * Page liste des produits
 */

import { Suspense } from 'react';
import Header from '@/components/Header';
import ProduitsContent from './ProduitsContent';
import { Loader2 } from 'lucide-react';

export default function ProduitsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            <span className="ml-3 text-gray-600">Chargement...</span>
          </div>
        </div>
      }>
        <ProduitsContent />
      </Suspense>
    </div>
  );
}
