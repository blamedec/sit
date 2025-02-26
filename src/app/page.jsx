// src/app/page.jsx
import Link from 'next/link';

export default function Home() {
  // City data
  const cities = [
    { id: 'london', name: 'London', description: 'Explore the vibrant capital of England' },
    { id: 'paris', name: 'Paris', description: 'Discover the city of lights and love' },
    { id: 'tokyo', name: 'Tokyo', description: 'Experience the blend of tradition and future' },
    { id: 'new-york', name: 'New York', description: 'The city that never sleeps awaits' },
    { id: 'madrid', name: 'Madrid', description: 'Immerse yourself in Spanish culture' },
    { id: 'leeds', name: 'Leeds', description: 'Experience this vibrant Yorkshire city' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            SIT
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Hand-picked places to eat, see, and do in cities around the world.
        </p>
      </section>
      
      {/* Cities Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Explore Cities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Link 
              key={city.id}
              href={`/${city.id}`}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl p-6 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {city.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {city.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}