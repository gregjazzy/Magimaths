'use client';

import React from 'react';

export const PageSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 h-8 w-3/4 rounded mb-4"></div>
    <div className="space-y-3">
      <div className="bg-gray-200 h-4 w-full rounded"></div>
      <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
      <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
    </div>
  </div>
);

export const ChapterCardSkeleton: React.FC = () => (
  <div className="animate-pulse bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
    </div>
    <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
    <div className="bg-gray-200 h-4 w-full rounded mb-4"></div>
    <div className="flex items-center justify-between">
      <div className="bg-gray-200 h-4 w-16 rounded"></div>
      <div className="bg-gray-200 h-8 w-24 rounded-lg"></div>
    </div>
  </div>
);

export const ExerciseCardSkeleton: React.FC = () => (
  <div className="animate-pulse bg-white rounded-xl p-4 shadow-lg">
    <div className="bg-gray-200 h-6 w-1/2 rounded mb-4"></div>
    <div className="bg-gray-200 h-16 w-full rounded mb-4"></div>
    <div className="bg-gray-200 h-10 w-32 rounded"></div>
  </div>
);