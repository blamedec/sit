// src/app/[city]/CityContent.jsx
'use client';

import { SearchProvider } from '@/context/SearchContext';
import SearchBar from '@/components/search/SearchBar';
import FilterTags from '@/components/search/FilterTags';
import PlaceGrid from '@/components/places/PlaceGrid';

export default function CityContent({ 
  places, 
  eatPlaces, 
  seePlaces, 
  doPlaces, 
  formattedCity 
}) {
  return (
    <SearchProvider>
      <div className="sticky top-20 z-10 bg-white dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <SearchBar />
          <FilterTags />
        </div>
      </div>
      
      {places.length === 0 ? (
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
          <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">No Places Found</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We don't have any places listed for {formattedCity} yet. Check back soon!
          </p>
        </div>
      ) : (
        <>
          {eatPlaces.length > 0 && (
            <section id="eat" className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">EAT</h2>
              <PlaceGrid places={eatPlaces} />
            </section>
          )}
          
          {seePlaces.length > 0 && (
            <section id="see" className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">SEE</h2>
              <PlaceGrid places={seePlaces} />
            </section>
          )}
          
          {doPlaces.length > 0 && (
            <section id="do" className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">DO</h2>
              <PlaceGrid places={doPlaces} />
            </section>
          )}
        </>
      )}
    </SearchProvider>
  );
}