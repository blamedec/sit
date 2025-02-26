// src/components/layout/Header.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Map } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

// Available cities
const CITIES = [
  { id: 'london', name: 'London' },
  { id: 'tokyo', name: 'Tokyo' },
  { id: 'paris', name: 'Paris' },
  { id: 'madrid', name: 'Madrid' },
  { id: 'leeds', name: 'Leeds' },
  { id: 'new-york', name: 'New York' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Determine the current city from the URL
  const currentCity = CITIES.find(city => pathname === `/${city.id}`) || null;
  
  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              SIT
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* City Selector */}
            <div className="relative group">
              <button
                className="flex items-center space-x-2 py-2 font-medium focus:outline-none"
              >
                <Map size={18} />
                <span>{currentCity ? currentCity.name : 'Select City'}</span>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute hidden group-hover:block top-full left-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-20">
                {CITIES.map((city) => (
                  <Link
                    key={city.id}
                    href={`/${city.id}`}
                    className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      currentCity?.id === city.id ? 'font-bold text-blue-600 dark:text-blue-400' : ''
                    }`}
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Category Links */}
            {currentCity && (
              <>
                <Link 
                  href={`#eat`} 
                  className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  EAT
                </Link>
                <Link 
                  href={`#see`} 
                  className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  SEE
                </Link>
                <Link 
                  href={`#do`} 
                  className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  DO
                </Link>
              </>
            )}
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="ml-3 p-2 rounded-md focus:outline-none"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 pb-6 space-y-2">
              <div className="font-medium py-2 text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                <Map size={18} />
                <span>Cities</span>
              </div>
              
              <div className="space-y-1 ml-2">
                {CITIES.map((city) => (
                  <Link
                    key={city.id}
                    href={`/${city.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-1 ${
                      currentCity?.id === city.id ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
              
              {currentCity && (
                <>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <Link 
                      href={`#eat`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      EAT
                    </Link>
                    <Link 
                      href={`#see`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      SEE
                    </Link>
                    <Link 
                      href={`#do`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      DO
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}