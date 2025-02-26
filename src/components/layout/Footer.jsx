// src/components/layout/Footer.jsx
'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Site Info */}
          <div>
            <Link href="/" className="inline-block font-bold text-xl mb-4">
              SIT
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Hand-picked places to eat, see, and do in cities around the world.
            </p>
          </div>
          
          {/* Cities */}
          <div>
            <h3 className="font-bold mb-4">Cities</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/london" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  London
                </Link>
              </li>
              <li>
                <Link 
                  href="/paris" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  Paris
                </Link>
              </li>
              <li>
                <Link 
                  href="/tokyo" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  Tokyo
                </Link>
              </li>
              <li>
                <Link 
                  href="/new-york" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  New York
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-bold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400 text-sm">
          © {currentYear} SIT City Guide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}