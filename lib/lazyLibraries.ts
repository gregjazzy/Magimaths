import dynamic from 'next/dynamic';

// Framer Motion components
export const LazyMotionDiv = dynamic(() => import('../components/motion/MotionWrapper').then(mod => mod.MotionDiv), {
  ssr: false
});

export const LazyMotionSpan = dynamic(() => import('../components/motion/MotionWrapper').then(mod => mod.MotionSpan), {
  ssr: false
});

export const LazyMotionButton = dynamic(() => import('../components/motion/MotionWrapper').then(mod => mod.MotionButton), {
  ssr: false
});

export const LazyAnimatePresence = dynamic(() => import('framer-motion').then(mod => mod.AnimatePresence), {
  ssr: false
});

// Utility function to create lazy loaded components
export function createLazyComponent<T>(importFn: () => Promise<T>) {
  return dynamic(() => importFn(), {
    ssr: false,
    loading: () => <div>Chargement...</div>
  });
}

