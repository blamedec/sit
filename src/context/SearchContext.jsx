// src/context/SearchContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Create context
const SearchContext = createContext();

// Create a ClientOnly wrapper component for the search provider
export function SearchProvider({ children }) {
  return (
    <ClientOnlySearchProvider>
      {children}
    </ClientOnlySearchProvider>
  );
}

// This component will only render on the client side
function ClientOnlySearchProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize state from URL parameters - safely with null checks
  const [searchTerm, setSearchTermState] = useState(() => {
    // Only access searchParams on the client
    if (typeof window === 'undefined') return '';
    return searchParams?.get('q') || '';
  });
  
  const [activeFilters, setActiveFilters] = useState(() => {
    // Don't run this logic on the server
    if (typeof window === 'undefined') return [];
    
    const filters = [];
    
    // Safely access searchParams
    if (!searchParams) return filters;
    
    // Parse category filters
    const category = searchParams.get('category');
    if (category) {
      category.split(',').forEach(value => {
        filters.push({ type: 'category', value });
      });
    }
    
    // Parse tag filters
    const tags = searchParams.get('tags');
    if (tags) {
      tags.split(',').forEach(value => {
        filters.push({ type: 'tag', value });
      });
    }
    
    // Parse mustVisit filter
    if (searchParams.get('mustVisit') === 'true') {
      filters.push({ type: 'mustVisit', value: true });
    }
    
    return filters;
  });
  
  const [searchResults, setSearchResults] = useState([]);
  
  // Initialize params once the component is mounted
  useEffect(() => {
    // This runs only on the client side
    if (!searchParams) return;
    
    setSearchTermState(searchParams.get('q') || '');
    
    const filters = [];
    
    // Parse category filters
    const category = searchParams.get('category');
    if (category) {
      category.split(',').forEach(value => {
        filters.push({ type: 'category', value });
      });
    }
    
    // Parse tag filters
    const tags = searchParams.get('tags');
    if (tags) {
      tags.split(',').forEach(value => {
        filters.push({ type: 'tag', value });
      });
    }
    
    // Parse mustVisit filter
    if (searchParams.get('mustVisit') === 'true') {
      filters.push({ type: 'mustVisit', value: true });
    }
    
    setActiveFilters(filters);
  }, [searchParams]);
  
  // Update URL when filters or search term change
  useEffect(() => {
    if (!searchParams || !router) return;
    
    const params = new URLSearchParams(searchParams.toString());
    
    // Update search term parameter
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }
    
    // Update category parameters
    const categoryFilters = activeFilters
      .filter(filter => filter.type === 'category')
      .map(filter => filter.value);
    
    if (categoryFilters.length > 0) {
      params.set('category', categoryFilters.join(','));
    } else {
      params.delete('category');
    }
    
    // Update tag parameters
    const tagFilters = activeFilters
      .filter(filter => filter.type === 'tag')
      .map(filter => filter.value);
    
    if (tagFilters.length > 0) {
      params.set('tags', tagFilters.join(','));
    } else {
      params.delete('tags');
    }
    
    // Update mustVisit parameter
    const hasMustVisitFilter = activeFilters.some(filter => 
      filter.type === 'mustVisit' && filter.value === true
    );
    
    if (hasMustVisitFilter) {
      params.set('mustVisit', 'true');
    } else {
      params.delete('mustVisit');
    }
    
    // Update the URL with the new parameters
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [searchTerm, activeFilters, pathname, router, searchParams]);
  
  // Wrapper for setSearchTerm to prevent direct updates
  const setSearchTerm = (value) => {
    setSearchTermState(value);
  };
  
  // Add a filter
  const addFilter = (type, value) => {
    const filterExists = activeFilters.some(
      filter => filter.type === type && filter.value === value
    );
    
    if (!filterExists) {
      setActiveFilters([...activeFilters, { type, value }]);
    }
  };
  
  // Remove a filter
  const removeFilter = (type, value) => {
    setActiveFilters(
      activeFilters.filter(
        filter => !(filter.type === type && filter.value === value)
      )
    );
  };
  
  // Toggle a filter (add if not present, remove if present)
  const toggleFilter = (type, value) => {
    const filterExists = activeFilters.some(
      filter => filter.type === type && filter.value === value
    );
    
    if (filterExists) {
      removeFilter(type, value);
    } else {
      addFilter(type, value);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };
  
  // Enhanced search with relevance scoring
  const searchPlaces = (places, term) => {
    if (!term) return places;
    
    const normalizedTerm = term.toLowerCase().trim();
    const searchTerms = normalizedTerm.split(/\s+/).filter(Boolean);
    
    return places
      .map(place => {
        // Start with a base score of 0
        let score = 0;
        
        // Check for matches in name (highest priority)
        const nameLower = place.name.toLowerCase();
        if (nameLower.includes(normalizedTerm)) {
          score += 10;
          // Exact match gets extra points
          if (nameLower === normalizedTerm) {
            score += 5;
          }
        }
        
        // Check if any search terms are in the name
        searchTerms.forEach(term => {
          if (nameLower.includes(term)) {
            score += 3;
          }
        });
        
        // Check for matches in description
        const descLower = place.description.toLowerCase();
        if (descLower.includes(normalizedTerm)) {
          score += 5;
        }
        searchTerms.forEach(term => {
          if (descLower.includes(term)) {
            score += 2;
          }
        });
        
        // Check for matches in tags
        if (place.tags) {
          const matchingTags = place.tags.filter(tag => 
            tag.toLowerCase().includes(normalizedTerm) ||
            searchTerms.some(term => tag.toLowerCase().includes(term))
          );
          
          score += matchingTags.length * 3;
        }
        
        // Check for matches in address
        if (place.address && place.address.toLowerCase().includes(normalizedTerm)) {
          score += 2;
        }
        
        return { ...place, score };
      })
      .filter(place => place.score > 0)
      .sort((a, b) => b.score - a.score);
  };
  
  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        activeFilters,
        searchResults,
        setSearchResults,
        addFilter,
        removeFilter,
        toggleFilter,
        clearFilters,
        searchPlaces,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}