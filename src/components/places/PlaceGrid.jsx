// src/components/places/PlaceGrid.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchContext } from '@/context/SearchContext';
import PlaceCard from './PlaceCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlaceGrid({ places = [] }) {
  const { 
    searchTerm, 
    activeFilters, 
    setSearchResults 
  } = useSearchContext();
  
  const [displayedPlaces, setDisplayedPlaces] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    initialPlaces: 0,
    filteredPlaces: 0,
    filterApplied: false
  });
  
  // Log initial places for debugging
  useEffect(() => {
    console.log(`PlaceGrid received ${places.length} places`);
    if (places.length > 0) {
      console.log('First place:', places[0]);
    }
    
    setDebugInfo(prev => ({
      ...prev,
      initialPlaces: places.length
    }));
  }, [places]);
  
  // Basic filtering based on search term and filters
  useEffect(() => {
    setIsFiltering(true);
    
    // Debounce the filtering to avoid UI jank
    const timeoutId = setTimeout(() => {
      let filteredPlaces = [...places];
      const hasFilters = searchTerm || activeFilters.length > 0;
      
      if (hasFilters) {
        // Apply text search
        if (searchTerm) {
          const searchTermLower = searchTerm.toLowerCase();
          filteredPlaces = filteredPlaces.filter(place => 
            place.name.toLowerCase().includes(searchTermLower) ||
            place.description.toLowerCase().includes(searchTermLower) ||
            (place.tags && place.tags.some(tag => 
              typeof tag === 'string' && tag.toLowerCase().includes(searchTermLower)
            ))
          );
        }
        
        // Apply category filters
        if (activeFilters.length > 0) {
          const categoryFilters = activeFilters.filter(filter => filter.type === 'category');
          const tagFilters = activeFilters.filter(filter => filter.type === 'tag');
          const mustVisitFilter = activeFilters.some(filter => filter.type === 'mustVisit');
          
          if (categoryFilters.length > 0) {
            filteredPlaces = filteredPlaces.filter(place =>
              categoryFilters.some(filter => place.category === filter.value)
            );
          }
          
          if (tagFilters.length > 0) {
            filteredPlaces = filteredPlaces.filter(place =>
              place.tags && tagFilters.some(filter => {
                // Handle array of tags or single string tag
                if (Array.isArray(place.tags)) {
                  return place.tags.some(tag => 
                    typeof tag === 'string' && tag.includes(filter.value)
                  );
                } else if (typeof place.tags === 'string') {
                  return place.tags.includes(filter.value);
                }
                return false;
              })
            );
          }
          
          if (mustVisitFilter) {
            filteredPlaces = filteredPlaces.filter(place => place.mustVisit);
          }
        }
      }
      
      // Update debug info
      setDebugInfo({
        initialPlaces: places.length,
        filteredPlaces: filteredPlaces.length,
        filterApplied: hasFilters
      });
      
      setSearchResults(filteredPlaces);
      setDisplayedPlaces(filteredPlaces);
      setIsFiltering(false);
      
      console.log(`PlaceGrid filtering complete. Showing ${filteredPlaces.length} of ${places.length} places`);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [places, searchTerm, activeFilters, setSearchResults]);
  
  // Animation variants for grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  // If filtering is in progress, show a loading state
  if (isFiltering) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-100 dark:bg-gray-800 rounded-lg h-[350px] animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  // Debug overlay in development mode
  const showDebug = process.env.NODE_ENV === 'development';
  
  // If no places are found after filtering
  if (displayedPlaces.length === 0) {
    return (
      <div>
        {showDebug && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded text-sm">
            <div>Debug: Initial places: {debugInfo.initialPlaces}</div>
            <div>Filtered places: {debugInfo.filteredPlaces}</div>
            <div>Filter applied: {debugInfo.filterApplied ? 'Yes' : 'No'}</div>
          </div>
        )}
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <h3 className="text-2xl font-bold mb-2">No places found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filters
          </p>
          
          {(searchTerm || activeFilters.length > 0) && (
            <button 
              onClick={() => window.location.href = window.location.pathname}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Clear all filters
            </button>
          )}
        </motion.div>
      </div>
    );
  }
  
  return (
    <div>
      {showDebug && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded text-sm">
          <div>Debug: Initial places: {debugInfo.initialPlaces}</div>
          <div>Filtered places: {debugInfo.filteredPlaces}</div>
          <div>Filter applied: {debugInfo.filterApplied ? 'Yes' : 'No'}</div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={`grid-${searchTerm}-${activeFilters.length}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {displayedPlaces.map((place, index) => (
            <motion.div key={`${place.id || index}`} variants={item} layout>
              <PlaceCard place={place} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}