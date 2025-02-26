// src/components/search/FilterTags.jsx
'use client';

import { motion } from 'framer-motion';
import { Star, Coffee, Eye, Activity, X } from 'lucide-react';
import { useSearchContext } from '@/context/SearchContext';

// Common tags that appear across cities
const COMMON_TAGS = [
  { id: 'michelin-starred', label: 'Michelin-Starred', icon: null },
  { id: 'rooftop', label: 'Rooftop', icon: null },
  { id: 'hidden-gem', label: 'Hidden Gem', icon: null },
  { id: 'family-friendly', label: 'Family-Friendly', icon: null },
];

export default function FilterTags({ cityTags = [] }) {
  const { activeFilters, toggleFilter, clearFilters } = useSearchContext();
  
  // Combine common tags with city-specific tags
  const allTags = [...COMMON_TAGS, ...cityTags];
  
  // Category filters
  const categories = [
    { id: 'EAT', icon: <Coffee size={16} /> },
    { id: 'SEE', icon: <Eye size={16} /> },
    { id: 'DO', icon: <Activity size={16} /> },
  ];
  
  // Check if a filter is active
  const isFilterActive = (type, value) => {
    return activeFilters.some(filter => filter.type === type && filter.value === value);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Must Visit filter */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleFilter('mustVisit', true)}
        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isFilterActive('mustVisit', true)
            ? 'bg-yellow-500 text-black'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}
      >
        <Star size={14} className="mr-1" />
        Must Visit
      </motion.button>
      
      {/* Category filters */}
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleFilter('category', category.id)}
          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isFilterActive('category', category.id)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {category.icon}
          <span className="ml-1">{category.id}</span>
        </motion.button>
      ))}
      
      {/* Tag filters (responsive - show fewer on mobile) */}
      <div className="hidden md:flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <motion.button
            key={tag.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleFilter('tag', tag.id)}
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isFilterActive('tag', tag.id)
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {tag.icon && <span className="mr-1">{tag.icon}</span>}
            {tag.label}
          </motion.button>
        ))}
      </div>
      
      {/* Clear filters button (only show when filters are active) */}
      {activeFilters.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="flex items-center px-3 py-1 ml-2 rounded-full text-sm font-medium bg-red-500 text-white"
        >
          <X size={14} className="mr-1" />
          Clear Filters
        </motion.button>
      )}
    </div>
  );
}