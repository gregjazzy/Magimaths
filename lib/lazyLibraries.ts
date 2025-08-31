import dynamic from 'next/dynamic';

// Framer Motion components
export const LazyMotion = dynamic(
  () => import('framer-motion').then((mod) => {
    const { motion } = mod;
    return motion;
  }),
  { ssr: false }
);

export const LazyAnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => {
    const { AnimatePresence } = mod;
    return AnimatePresence;
  }),
  { ssr: false }
);

// Math components (à adapter selon vos besoins)
export const LazyMathJax = dynamic(() => import('react-mathjax'), {
  ssr: false,
  loading: () => <div>Chargement des formules...</div>
});

// Chart components (à adapter selon vos besoins)
export const LazyChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => <div>Chargement du graphique...</div>
});

// Animation components
export const LazyLottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Chargement de l'animation...</div>
});

// Utility function to create lazy loaded components
export function createLazyComponent<T>(importFn: () => Promise<T>) {
  return dynamic(() => importFn(), {
    ssr: false,
    loading: () => <div>Chargement...</div>
  });
}

