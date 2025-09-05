'use client';

import React from 'react';
import SimplePositionCard from '@/components/chapter/SimplePositionCard';

export default function DessusPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <SimplePositionCard />
      </div>
    </div>
  );
}