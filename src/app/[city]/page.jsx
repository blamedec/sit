// src/app/[city]/page.jsx
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CityHero from '@/components/city/CityHero';
import { getPlacesByCity } from '@/lib/airtable';
import CityContent from './CityContent';

// Define valid cities
const VALID_CITIES = ['london', 'tokyo', 'paris', 'madrid', 'leeds', 'new-york'];

// This function allows us to statically generate the city pages
export function generateStaticParams() {
  return VALID_CITIES.map(city => ({ city }));
}

// Metadata without using params.city directly
export function generateMetadata({ params }) {
  const citySlug = params?.city || '';
  const formattedCity = String(citySlug).split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    title: `${formattedCity} - SIT City Guide | Places to Eat, See, and Do`,
    description: `Curated recommendations for the best places to eat, things to see, and activities to do in ${formattedCity}.`,
  };
}

// Main server component
export default async function CityPage({ params }) {
  // Format and validate the city
  const cityStr = String(params?.city || '');
  
  if (!VALID_CITIES.includes(cityStr)) {
    notFound();
  }
  
  const formattedCity = cityStr.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  console.log(`Rendering city page for: ${cityStr}`);
  
  // Get the city's places, with error handling
  let places = [];
  let error = null;
  
  try {
    // Fetch places data
    places = await getPlacesByCity(cityStr);
    
    // Data validation
    if (!Array.isArray(places)) {
      console.error("Places data is not an array:", places);
      places = [];
    }
    
    // Debug what we got
    console.log(`Found ${places.length} places for ${cityStr}`);
    
  } catch (e) {
    console.error(`Error fetching data for ${cityStr}:`, e);
    error = e.message;
  }
  
  // Group places by category
  const eatPlaces = places.filter(place => place.category === 'EAT');
  const seePlaces = places.filter(place => place.category === 'SEE');
  const doPlaces = places.filter(place => place.category === 'DO');
  
  // Debug the places data
  console.log(`EAT places: ${eatPlaces.length}, SEE places: ${seePlaces.length}, DO places: ${doPlaces.length}`);
  
  return (
    <div className="space-y-10">
      <CityHero city={formattedCity} />
      
      {error ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-center">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading City Data</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We're having trouble loading data for {formattedCity}. Please try again later.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {process.env.NODE_ENV === 'development' ? `Error details: ${error}` : null}
          </p>
        </div>
      ) : (
        <Suspense fallback={<div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse h-96"></div>}>
          <CityContent 
            places={places} 
            eatPlaces={eatPlaces} 
            seePlaces={seePlaces} 
            doPlaces={doPlaces} 
            formattedCity={formattedCity} 
          />
        </Suspense>
      )}
    </div>
  );
}