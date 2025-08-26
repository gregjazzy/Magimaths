import dynamic from 'next/dynamic';

// Fonction utilitaire pour créer des composants lazy loadés
export function createLazyComponent(path: string) {
  return dynamic(() => import(path), {
    loading: () => <div>Chargement...</div>,
    ssr: false
  });
}

// Map des chapitres avec lazy loading
export const LAZY_CHAPTERS = {
  'ce1-quatre-operations-soustraction-100': () => import('../app/chapitre/ce1-quatre-operations/soustraction-ce1/soustractions-100/page'),
  // Ajoutez d'autres chapitres ici
};

