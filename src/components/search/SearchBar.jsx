// src/components/search/SearchBar.jsx
'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchContext } from '@/context/SearchContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearchContext();
  const [inputValue, setInputValue] = useState(searchTerm);
  
  // Update input value when search term changes (for sync with URL params)
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);
  
  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [inputValue, setSearchTerm]);
  
  const handleClear = () => {
    setInputValue('');
    setSearchTerm('');
  };
  
  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search 
          size={18} 
          className="absolute left-3 text-gray-400 dark:text-gray-500" 
        />
        
        <input
          type="text"
          placeholder="Search for places..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 pr-10 py-2 w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
        />
        
        <AnimatePresence>
          {inputValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Clear search"
            >
              <X size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}