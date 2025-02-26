// src/lib/airtable.js
import { cache } from 'react';

// Config flags
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                     !process.env.AIRTABLE_API_KEY || 
                     !process.env.AIRTABLE_BASE_ID;

// Airtable base ID and API key from environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PLACES_TABLE = 'Places';

// Check if Airtable is configured
const isAirtableConfigured = !USE_MOCK_DATA && AIRTABLE_API_KEY && AIRTABLE_BASE_ID;

// Fetch options for Airtable API requests - use revalidate for static generation
const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  next: { revalidate: 3600 }, // Revalidate every hour
};

// Log configuration information for debugging
console.log('Airtable Configuration:');
console.log(`- API Key: ${AIRTABLE_API_KEY ? '✓ Set (first 4 chars: ' + AIRTABLE_API_KEY.slice(0, 4) + '...)' : '✗ Not Set'}`);
console.log(`- Base ID: ${AIRTABLE_BASE_ID ? '✓ Set (first 4 chars: ' + AIRTABLE_BASE_ID.slice(0, 4) + '...)' : '✗ Not Set'}`);
console.log(`- Use Mock Data: ${USE_MOCK_DATA ? 'Yes' : 'No'}`);

/**
 * Fetch all places from Airtable or mock data
 */
export const getAllPlaces = cache(async () => {
  if (!isAirtableConfigured) {
    console.log('⚠️ Using mock data: Airtable is not configured.');
    return Object.values(MOCK_DATA).flat();
  }
  
  console.log('🔄 Fetching all places from Airtable...');
  
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PLACES_TABLE}?view=Grid%20view`,
      fetchOptions
    );
    
    if (!response.ok) {
      console.error(`❌ Airtable API error: ${response.status} ${response.statusText}`);
      throw new Error(`Error fetching from Airtable: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.records ? data.records.length : 0} places from Airtable`);
    
    // Transform Airtable records to our app's data structure
    return data.records ? data.records.map(transformAirtableRecord) : [];
  } catch (error) {
    console.error('❌ Failed to fetch places from Airtable:', error);
    
    // Fallback to mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Falling back to mock data');
      return Object.values(MOCK_DATA).flat();
    }
    
    // In production, return an empty array
    return [];
  }
});

/**
 * Fetch places filtered by city from Airtable or mock data
 */
export const getPlacesByCity = cache(async (city) => {
  if (!city) {
    console.error('❌ No city provided to getPlacesByCity');
    return [];
  }
  
  const cityStr = String(city).toLowerCase();
  
  if (!isAirtableConfigured) {
    console.log(`⚠️ Using mock data for city ${cityStr}: Airtable is not configured.`);
    return MOCK_DATA[cityStr] || [];
  }
  
  console.log(`🔄 Fetching places for city: ${cityStr} from Airtable...`);
  
  try {
    // Using filterByFormula to get only places for the specified city
    // Note: LOWER() ensures case-insensitive matching
    const formula = encodeURIComponent(`LOWER({City}) = '${cityStr.toLowerCase()}'`);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PLACES_TABLE}?filterByFormula=${formula}`;
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      console.error(`❌ Airtable API error: ${response.status} ${response.statusText}`);
      throw new Error(`Error fetching city data from Airtable: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.records ? data.records.length : 0} places for ${cityStr} from Airtable`);
    
    // Debug the first record if available
    if (data.records && data.records.length > 0) {
      const firstRecord = data.records[0];
      console.log('Sample record fields:', Object.keys(firstRecord.fields));
      if (firstRecord.fields.Tags) {
        console.log('Tags type:', typeof firstRecord.fields.Tags, Array.isArray(firstRecord.fields.Tags));
      }
    }
    
    // Transform Airtable records to our app's data structure
    return data.records ? data.records.map(transformAirtableRecord) : [];
  } catch (error) {
    console.error(`❌ Failed to fetch places for ${cityStr} from Airtable:`, error);
    
    // Fallback to mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Falling back to mock data for ${cityStr}`);
      return MOCK_DATA[cityStr] || [];
    }
    
    // In production, return an empty array
    return [];
  }
});

/**
 * Transform Airtable record to app data structure
 */
function transformAirtableRecord(record) {
  const { id, fields } = record;
  
  // Debug the fields
  console.log(`Processing record ID: ${id}, Name: ${fields.Name || 'unknown'}`);
  
  // Parse tags - handle both arrays and comma-separated strings
  let tags = [];
  if (fields.Tags) {
    if (Array.isArray(fields.Tags)) {
      // If it's already an array, use it
      tags = fields.Tags;
    } else if (typeof fields.Tags === 'string') {
      // If it's a string, split by commas and trim whitespace
      tags = fields.Tags.split(',').map(tag => tag.trim());
    } else {
      // Fallback for unexpected type
      tags = [String(fields.Tags)];
    }
  }
  
  console.log(`Processed tags for ${fields.Name}:`, tags);
  
  // Return the transformed record with careful type handling
  return {
    id,
    name: fields.Name || '',
    description: fields.Description || '',
    category: fields.Category || '',
    city: fields.City || '',
    address: fields.Address || '',
    tags: tags,
    mustVisit: Boolean(fields.MustVisit),
    website: fields.Website || '',
    instagramUrl: fields.InstagramURL || '',
    location: fields.Location
      ? {
          lat: fields.Location.latitude,
          lng: fields.Location.longitude,
        }
      : null,
    imageUrl: fields.Images && fields.Images.length > 0
      ? fields.Images[0].thumbnails?.large?.url || fields.Images[0].url
      : `/images/placeholder-${(fields.Category || 'default').toLowerCase()}.jpg`,
    rating: fields.Rating || null,
  };
}

// Mock data for fallback and testing
const MOCK_DATA = {
  london: [
    {
      id: 'london1',
      name: 'The Ivy',
      description: 'Iconic restaurant offering modern British cuisine in a stylish setting.',
      category: 'EAT',
      city: 'london',
      address: '1-5 West Street, London WC2H 9NQ',
      tags: ['Fine Dining', 'Classic', 'British'],
      mustVisit: true,
      website: 'https://theivyweststreet.com/',
      instagramUrl: 'https://instagram.com/theivywestst',
      imageUrl: '/images/placeholder-eat.jpg',
      location: {
        lat: 51.5115,
        lng: -0.1273
      }
    },
    {
      id: 'london2',
      name: 'British Museum',
      description: 'World-famous museum of art and antiquities from ancient and living cultures.',
      category: 'SEE',
      city: 'london',
      address: 'Great Russell St, London WC1B 3DG',
      tags: ['History', 'Art', 'Culture'],
      mustVisit: true,
      website: 'https://www.britishmuseum.org/',
      instagramUrl: 'https://instagram.com/britishmuseum',
      imageUrl: '/images/placeholder-see.jpg',
      location: {
        lat: 51.5194,
        lng: -0.1269
      }
    },
    {
      id: 'london3',
      name: 'Hyde Park',
      description: 'One of London\'s largest and most famous parks with over 350 acres to explore.',
      category: 'DO',
      city: 'london',
      address: 'Hyde Park, London W2 2UH',
      tags: ['Outdoors', 'Nature', 'Walking'],
      mustVisit: false,
      website: 'https://www.royalparks.org.uk/parks/hyde-park',
      instagramUrl: 'https://instagram.com/royalparks',
      imageUrl: '/images/placeholder-do.jpg',
      location: {
        lat: 51.5073,
        lng: -0.1657
      }
    }
  ],
  // ... other cities ...
};