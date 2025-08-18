'use client'

import React, { Suspense } from 'react'
import { LazyAdditionsJusqua100 } from '@/lib/lazyPages'
import { PageSkeleton } from '@/components/loading/LoadingSkeletons'

export default function AdditionsJusqua100Lazy() {
  return (
    <Suspense fallback={<PageSkeleton className="min-h-screen p-8" />}>
      <LazyAdditionsJusqua100 />
    </Suspense>
  )
}
