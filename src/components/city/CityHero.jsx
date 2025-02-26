// src/components/city/CityHero.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// City-specific data for hero sections
const CITY_DATA = {
  'London': {
    subtitle: 'Explore the historic and vibrant capital of England',
    imageUrl: '/images/cities/london-hero.jpg',
    gradient: 'from-blue-600 to-purple-600',
    iconName: 'big-ben'
  },
  'Paris': {
    subtitle: 'Discover the city of lights, love, and extraordinary cuisine',
    imageUrl: '/images/cities/paris-hero.jpg',
    gradient: 'from-blue-500 to-pink-500',
    iconName: 'eiffel-tower'
  },
  'Tokyo': {
    subtitle: 'Experience the perfect blend of tradition and future',
    imageUrl: '/images/cities/tokyo-hero.jpg',
    gradient: 'from-red-500 to-pink-500',
    iconName: 'torii-gate'
  },
  'New York': {
    subtitle: 'The city that never sleeps awaits your exploration',
    imageUrl: '/images/cities/new-york-hero.jpg',
    gradient: 'from-yellow-500 to-red-500',
    iconName: 'statue-of-liberty'
  },
  'Madrid': {
    subtitle: 'Immerse yourself in Spanish culture and exquisite food',
    imageUrl: '/images/cities/madrid-hero.jpg',
    gradient: 'from-yellow-400 to-red-600',
    iconName: 'plaza-mayor'
  },
  'Leeds': {
    subtitle: 'Experience this vibrant and evolving Yorkshire city',
    imageUrl: '/images/cities/leeds-hero.jpg',
    gradient: 'from-green-500 to-blue-500',
    iconName: 'town-hall'
  }
};

// Default data if city is not in our list
const DEFAULT_CITY_DATA = {
  subtitle: 'Explore hand-picked places to eat, see, and do',
  imageUrl: '/images/cities/default-hero.jpg',
  gradient: 'from-blue-600 to-purple-600',
  iconName: 'map'
};

export default function CityHero({ city }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Get city data or use default
  const cityData = CITY_DATA[city] || DEFAULT_CITY_DATA;
  
  // Set isClient to true after mount to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div className="relative">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 h-72 md:h-96 overflow-hidden -z-10">
        {isClient && (
          <>
            {/* Skeleton loader */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
            )}
            
            {/* Background image */}
            <Image
              src={cityData.imageUrl}
              alt={`${city} cityscape`}
              fill
              className={`object-cover object-center ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
              priority
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // Still mark as loaded on error to remove skeleton
            />
            
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cityData.gradient} opacity-70 dark:opacity-80`} />
            
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black opacity-20 dark:opacity-50" />
          </>
        )}
      </div>
      
      {/* Hero content */}
      <div className="relative pt-16 pb-20 z-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
            {city}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl drop-shadow-md">
            {cityData.subtitle}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <a 
              href="#eat" 
              className="px-6 py-2 bg-white/90 text-gray-900 font-medium rounded-full hover:bg-white transition-colors shadow-md"
            >
              EAT
            </a>
            <a 
              href="#see" 
              className="px-6 py-2 bg-white/90 text-gray-900 font-medium rounded-full hover:bg-white transition-colors shadow-md"
            >
              SEE
            </a>
            <a 
              href="#do" 
              className="px-6 py-2 bg-white/90 text-gray-900 font-medium rounded-full hover:bg-white transition-colors shadow-md"
            >
              DO
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}