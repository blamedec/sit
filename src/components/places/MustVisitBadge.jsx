// src/components/places/MustVisitBadge.jsx
'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function MustVisitBadge() {
  return (
    <motion.div
      className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-xs flex items-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <Star size={14} className="mr-1 fill-current" />
      MUST VISIT
    </motion.div>
  );
}