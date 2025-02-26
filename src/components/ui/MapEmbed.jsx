// src/components/ui/MapEmbed.jsx
'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

export default function MapEmbed({ location, address, name }) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // If no location data, just show the address and a link to Google Maps
  if (!location) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm">{address || 'Location unavailable'}</span>
        </div>
        
        {address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center"
          >
            View on Google Maps
            <span className="ml-1">↗</span>
          </a>
        )}
      </div>
    );
  }
  
  // Build Google Maps embed URL
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${location.lat},${location.lng}&zoom=15`;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm">{address || 'Location unavailable'}</span>
        </div>
        
        <button
          onClick={() => setShowMap(!showMap)}
          className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
        >
          {showMap ? 'Hide map' : 'Show map'}
        </button>
      </div>
      
      {showMap && (
        <div className="relative overflow-hidden rounded-lg h-60 bg-gray-100 dark:bg-gray-800">
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Loading map...
            </div>
          )}
          
          <iframe
            title={`Map showing location of ${name}`}
            src={googleMapsUrl}
            className={`absolute inset-0 w-full h-full border-none transition-opacity duration-300 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsMapLoaded(true)}
          />
        </div>
      )}
      
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center"
      >
        Open in Google Maps
        <span className="ml-1">↗</span>
      </a>
    </div>
  );
}