// src/components/layout/ThemeToggle.jsx
'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full focus:outline-none"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={false}
      animate={{ 
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' 
      }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-6 h-6">
        <motion.div
          initial={false}
          animate={{
            opacity: theme === 'dark' ? 0 : 1,
            scale: theme === 'dark' ? 0.5 : 1,
            rotateZ: theme === 'dark' ? 45 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Sun className="text-yellow-500" />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            opacity: theme === 'dark' ? 1 : 0,
            scale: theme === 'dark' ? 1 : 0.5,
            rotateZ: theme === 'dark' ? 0 : -45,
          }}
          transition={{ duration: 0.2 }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Moon className="text-blue-300" />
        </motion.div>
      </div>
    </motion.button>
  );
}