'use client';

import dynamic from 'next/dynamic';
import { PageSkeleton } from '@/components/loading/LoadingSkeletons';

// Pages CP
export const LazyCPPage = dynamic(() => import('@/app/cp/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

export const LazyCE1Page = dynamic(() => import('@/app/ce1/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

export const LazyCE2Page = dynamic(() => import('@/app/ce2/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

export const LazyCM1Page = dynamic(() => import('@/app/cm1/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

export const LazyCM2Page = dynamic(() => import('@/app/cm2/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

// Chapitres CP
export const LazyCPAdditionsSimples = dynamic(() => import('@/app/chapitre/cp-additions-simples/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

export const LazyCPSoustractionsSimples = dynamic(() => import('@/app/chapitre/cp-soustractions-simples/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

export const LazyCPMultiplicationsSimples = dynamic(() => import('@/app/chapitre/cp-multiplications-simples/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

// Chapitres CE1
export const LazyCE1QuatreOperations = dynamic(() => import('@/app/chapitre/ce1-quatre-operations/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

export const LazyCE1FractionsSimples = dynamic(() => import('@/app/chapitre/ce1-fractions-simples/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: true
});

// Pages lourdes avec lazy loading prioritaire
export const LazyAdditionsJusqua100 = dynamic(() => import('@/app/chapitre/cp-additions-simples/additions-jusqu-100/page'), {
  loading: () => <PageSkeleton className="min-h-screen p-8" />,
  ssr: false // Page très lourde, pas de SSR
});
