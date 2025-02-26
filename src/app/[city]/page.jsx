// src/app/[city]/page.jsx
import { notFound } from 'next/navigation';
import CityHero from '@/components/city/CityHero';
import PlaceGrid from '@/components/places/PlaceGrid';
import SearchBar from '@/components/search/SearchBar';
import FilterTags from '@/components/search/FilterTags';
import { SearchProvider } from '@/context/SearchContext';
import { getPlacesByCity } from '@/lib/airtable';

// Define valid cities
const VALID_CITIES = ['london', 'tokyo', 'paris', 'madrid', 'leeds', 'new-york'];

// This pattern completely avoids using params.city in a way that Next.js 15 has issues with
export default function CityPage({ params }) {
  // We don't destructure or access params.city directly in the component definition
  
  // Define a client component that will render the actual content
  return <CityPageContent citySlug={params?.city} />;
}

// Use a Server Component to load the data
async function CityPageContent({ citySlug }) {
  // Format and validate the city
  const cityStr = String(citySlug || '');
  
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
    <SearchProvider>
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
          <>
            <div className="sticky top-20 z-10 bg-white dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <SearchBar />
                <FilterTags />
              </div>
            </div>
            
            {places.length === 0 ? (
              <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
                <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">No Places Found</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  We don't have any places listed for {formattedCity} yet. Check back soon!
                </p>
              </div>
            ) : (
              <>
                {eatPlaces.length > 0 && (
                  <section id="eat" className="space-y-6">
                    <h2 className="text-4xl font-bold tracking-tight">EAT</h2>
                    <PlaceGrid places={eatPlaces} />
                  </section>
                )}
                
                {seePlaces.length > 0 && (
                  <section id="see" className="space-y-6">
                    <h2 className="text-4xl font-bold tracking-tight">SEE</h2>
                    <PlaceGrid places={seePlaces} />
                  </section>
                )}
                
                {doPlaces.length > 0 && (
                  <section id="do" className="space-y-6">
                    <h2 className="text-4xl font-bold tracking-tight">DO</h2>
                    <PlaceGrid places={doPlaces} />
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </SearchProvider>
  );
}

// Generate static paths for all cities - use a static pattern to avoid params.city issues
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