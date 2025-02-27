// src/components/places/PlaceCard.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Instagram } from 'lucide-react';
import MustVisitBadge from './MustVisitBadge';

export default function PlaceCard({ place }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Debug info
  console.log(`Rendering PlaceCard for: ${place?.name || 'unknown'}`);
  
  // Safe guard against undefined props
  if (!place) {
    console.error("PlaceCard received undefined place prop");
    return null;
  }
  
  // Destructure with defaults for safety
  const {
    id = Math.random().toString(36).substr(2, 9),
    name = "Unknown Place",
    description = "No description available",
    imageUrl = "",
    category = "",
    tags = [],
    mustVisit = false,
    website = "",
    instagramUrl = "",
    location = null,
    address = "Address not available"
  } = place;
  
  // Parse tag information - handle various formats
  let processedTags = [];
  
  // If it's an array of strings, use it directly
  if (Array.isArray(tags)) {
    // Each tag could be a string or an object
    processedTags = tags.flatMap(tag => {
      if (typeof tag === 'string') {
        // For comma-separated strings in array elements
        return tag.split(',').map(t => t.trim());
      }
      return String(tag);
    });
  } 
  // If it's a single string, split by commas
  else if (typeof tags === 'string') {
    processedTags = tags.split(',').map(tag => tag.trim());
  }
  
  // Take only the first 3 tags for display
  const displayTags = processedTags.slice(0, 3);
  
  // Fallback image paths
  const fallbackImage = `/images/placeholder-${category.toLowerCase()}.jpg`;
  const defaultImage = '/images/placeholder-default.jpg';
  
  // Image to display (with fallbacks)
  const displayImage = imageError ? fallbackImage : (imageUrl || fallbackImage || defaultImage);
  
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 h-full hover:shadow-xl hover:-translate-y-1">
      {/* Image container */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        {/* Skeleton loader while image is loading */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        
        <Image
          src={displayImage}
          alt={name}
          className={`object-cover transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          priority={mustVisit}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            console.log(`Image failed to load for ${name}, using fallback`);
            setImageLoading(false);
            setImageError(true);
          }}
        />
        
        {/* Must Visit Badge */}
        {mustVisit && (
          <div className="absolute top-4 right-4 z-10">
            <MustVisitBadge />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 text-sm font-bold rounded">
          {category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {name}
        </h3>
        
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {displayTags.map((tag, index) => (
            <span 
              key={`${id}-tag-${index}`}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
          {/* NEW CODE: Show count of remaining tags */}
          {processedTags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              +{processedTags.length - 3} more
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-2">
          {description}
        </p>
        
        {/* Location with hover effect */}
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-4">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
        
        {/* Links */}
        <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          {website && (
            <Link 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 flex items-center text-sm hover:underline"
            >
              Website
              <ExternalLink size={14} className="ml-1" />
            </Link>
          )}
          
          {instagramUrl && (
            <Link 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 dark:text-pink-400 flex items-center text-sm hover:underline"
            >
              Instagram
              <Instagram size={14} className="ml-1" />
            </Link>
          )}
          
          {/* NEW CODE: Use address for map link if location is not available */}
          {(location || address) && (
            <Link 
              href={location 
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.lat)},${encodeURIComponent(location.lng)}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
              }
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 flex items-center text-sm hover:underline"
            >
              Map
              <MapPin size={14} className="ml-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}