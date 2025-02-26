'use client';

import { Suspense } from 'react';
import SearchBar from './SearchBar';

export default function SearchBarWrapper() {
  return (
    <Suspense fallback={<div className="w-full h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>}>
      <SearchBar />
    </Suspense>
  );
}