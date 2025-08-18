'use client'

import React, { Suspense } from 'react'
import { LazyCPPage } from '@/lib/lazyPages'
import { PageSkeleton } from '@/components/loading/LoadingSkeletons'

export default function CPPageLazy() {
  return (
    <Suspense fallback={<PageSkeleton className="min-h-screen p-8" />}>
      <LazyCPPage />
    </Suspense>
  )
}
