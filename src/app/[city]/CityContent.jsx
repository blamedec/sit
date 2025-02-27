// src/app/[city]/CityContent.jsx
'use client';

import { useState } from 'react';
import { SearchProvider } from '@/context/SearchContext';
import PlaceGrid from '@/components/places/PlaceGrid';
import SearchBar from '@/components/search/SearchBar';
import FilterTags from '@/components/search/FilterTags';

export default function CityContent({ places = [], eatPlaces = [], seePlaces = [], doPlaces = [], formattedCity = '' }) {
  // Debug info
  console.log(`Rendering CityContent for ${formattedCity} with ${places.length} total places`);
  console.log(`Categories: EAT: ${eatPlaces.length}, SEE: ${seePlaces.length}, DO: ${doPlaces.length}`);
  
  // First tag in each section will be visible
  const hasSections = {
    eat: eatPlaces.length > 0,
    see: seePlaces.length > 0,
    do: doPlaces.length > 0
  };
  
  return (
    <SearchProvider>
      <div className="space-y-10">
        <div className="sticky top-20 z-10 bg-white dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar />
            {/* Pass all places to FilterTags for tag extraction */}
            <FilterTags allPlaces={places} />
          </div>
        </div>
        
        {hasSections.eat && (
          <section id="eat" className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">EAT</h2>
            <PlaceGrid places={eatPlaces} />
          </section>
        )}
        
        {hasSections.see && (
          <section id="see" className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">SEE</h2>
            <PlaceGrid places={seePlaces} />
          </section>
        )}
        
        {hasSections.do && (
          <section id="do" className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">DO</h2>
            <PlaceGrid places={doPlaces} />
          </section>
        )}
        
        {/* Show a message if no places were found */}
        {!hasSections.eat && !hasSections.see && !hasSections.do && (
          <div className="py-12 text-center">
            <h3 className="text-2xl font-bold mb-4">No places found for {formattedCity}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon as we add more recommendations!
            </p>
          </div>
        )}
      </div>
    </SearchProvider>
  );
}