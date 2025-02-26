// src/components/search/FilterTagsWrapper.jsx
'use client';

import { Suspense } from 'react';
import FilterTags from './FilterTags';

export default function FilterTagsWrapper() {
  return (
    <Suspense fallback={<div className="flex gap-2 h-8">
      <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
      <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
    </div>}>
      <FilterTags />
    </Suspense>
  );
}