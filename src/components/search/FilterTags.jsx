// src/components/search/FilterTags.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Coffee, Eye, Activity, X, ChevronDown, Tag } from 'lucide-react';
import { useSearchContext } from '@/context/SearchContext';

export default function FilterTags({ allPlaces = [] }) {
  const { activeFilters, toggleFilter, clearFilters } = useSearchContext();
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [commonTags, setCommonTags] = useState([]);
  const [additionalTags, setAdditionalTags] = useState([]);
  const dropdownRef = useRef(null);
  
  // Define common tag IDs that should always appear (if they exist in the data)
  const PINNED_COMMON_TAG_IDS = [
    'michelin-starred', 'old-locals', 'hidden-gem', 'listening-bar',
    'must-book', 'coffee'
  ];
  
  // Category filters
  const categories = [
    { id: 'EAT', icon: <Coffee size={16} /> },
    { id: 'SEE', icon: <Eye size={16} /> },
    { id: 'DO', icon: <Activity size={16} /> },
  ];
  
  // Extract and categorize tags from places data
  useEffect(() => {
    if (allPlaces && allPlaces.length > 0) {
      // Extract all unique tags from places
      const tagCounts = {};
      
      // Process all places and their tags
      allPlaces.forEach(place => {
        if (!place) return;
        
        let placeTags = [];
        
        // Handle different tag formats
        if (Array.isArray(place.tags)) {
          placeTags = place.tags.flatMap(tag => {
            if (typeof tag === 'string') {
              return tag.split(',').map(t => t.trim());
            }
            return String(tag);
          });
        } else if (typeof place.tags === 'string') {
          placeTags = place.tags.split(',').map(tag => tag.trim());
        }
        
        // Count each tag's occurrence
        placeTags.forEach(tag => {
          // Normalize the tag for consistency
          const normalizedTag = String(tag).trim();
          if (!normalizedTag) return;
          
          const tagId = normalizedTag.toLowerCase().replace(/\s+/g, '-');
          
          if (!tagCounts[tagId]) {
            tagCounts[tagId] = {
              id: tagId,
              label: normalizedTag,
              count: 0
            };
          }
          tagCounts[tagId].count += 1;
        });
      });
      
      // Convert to array
      const tagArray = Object.values(tagCounts);
      
      // Sort by count (most frequent first)
      tagArray.sort((a, b) => b.count - a.count);
      
      // Separate common and additional tags
      const pinnedTags = [];
      const frequentTags = [];
      const otherTags = [];
      
      tagArray.forEach(tag => {
        if (PINNED_COMMON_TAG_IDS.includes(tag.id)) {
          pinnedTags.push(tag);
        } else if (frequentTags.length < (5 - pinnedTags.length) && tag.count > 1) {
          frequentTags.push(tag);
        } else {
          otherTags.push(tag);
        }
      });
      
      // Set state with our categorized tags
      setAllTags(tagArray);
      setCommonTags([...pinnedTags, ...frequentTags]);
      setAdditionalTags(otherTags);
      
      console.log('Extracted tags:', tagArray.length, 'Common tags:', [...pinnedTags, ...frequentTags].length);
    }
  }, [allPlaces]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTagDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Check if a filter is active
  const isFilterActive = (type, value) => {
    return activeFilters.some(filter => filter.type === type && filter.value === value);
  };
  
  // No tags available
  if (allTags.length === 0 && allPlaces.length > 0) {
    console.log('No tags available from places data');
  }
  
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
      
      {/* Common tag filters - shown directly */}
      <div className="hidden md:flex flex-wrap gap-2">
        {commonTags.map((tag) => (
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
            {tag.label}
            {tag.count > 1 && <span className="ml-1 text-xs opacity-70">({tag.count})</span>}
          </motion.button>
        ))}
      </div>
      
      {/* All Tags Dropdown - only show if there are tags */}
      {allTags.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
            className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          >
            <Tag size={14} className="mr-1" />
            All Tags
            <ChevronDown size={14} className={`ml-1 transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>
          
          <AnimatePresence>
            {isTagDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg z-30"
              >
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-sm">All Available Tags ({allTags.length})</h4>
                </div>
                
                <div className="p-3 grid grid-cols-2 gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        toggleFilter('tag', tag.id);
                        // Optionally close dropdown after selection on mobile
                        if (window.innerWidth < 768) {
                          setIsTagDropdownOpen(false);
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-1 rounded text-sm ${
                        isFilterActive('tag', tag.id)
                          ? 'bg-purple-500 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="truncate mr-1">{tag.label}</span>
                      <span className="text-xs opacity-70">{tag.count}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
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