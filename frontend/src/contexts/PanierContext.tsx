/**
 * Context pour gérer le panier
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { panierApi } from '@/lib/api/index';
import type { Panier } from '@/types/panier';
import { useAuth } from './AuthContext';

interface PanierContextType {
  panier: Panier | null;
  chargement: boolean;
  chargerPanier: () => Promise<void>;
  nombreArticles: number;
}

const PanierContext = createContext<PanierContextType | undefined>(undefined);

export function PanierProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [panier, setPanier] = useState<Panier | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (user) {
      chargerPanier();
    } else {
      setPanier(null);
      setChargement(false);
    }
  }, [user]);

  const chargerPanier = async () => {
    try {
      setChargement(true);
      const data = await panierApi.obtenir();
      setPanier(data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      setPanier(null);
    } finally {
      setChargement(false);
    }
  };

  const nombreArticles = panier?.articles.length || 0;

  return (
    <PanierContext.Provider
      value={{
        panier,
        chargement,
        chargerPanier,
        nombreArticles
      }}
    >
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  const context = useContext(PanierContext);
  if (context === undefined) {
    throw new Error('usePanier doit être utilisé dans un PanierProvider');
  }
  return context;
}
