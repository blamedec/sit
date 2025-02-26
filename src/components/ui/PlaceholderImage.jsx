// src/components/ui/PlaceholderImage.jsx
'use client';

import { useEffect, useRef } from 'react';

const COLORS = {
  EAT: { bg: '#FECACA', text: '#991B1B' }, // Red
  SEE: { bg: '#BFDBFE', text: '#1E40AF' }, // Blue
  DO: { bg: '#C7D2FE', text: '#3730A3' },  // Indigo
  DEFAULT: { bg: '#E5E7EB', text: '#374151' } // Gray
};

export default function PlaceholderImage({ 
  category = 'DEFAULT', 
  city = '', 
  name = '',
  width = 600, 
  height = 400,
  className = ''
}) {
  const canvasRef = useRef(null);
  
  // Draw the placeholder on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const colorSet = COLORS[category] || COLORS.DEFAULT;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Fill background
    ctx.fillStyle = colorSet.bg;
    ctx.fillRect(0, 0, width, height);
    
    // Draw pattern
    ctx.fillStyle = colorSet.text + '20'; // Semi-transparent
    const patternSize = 30;
    for (let i = 0; i < width; i += patternSize) {
      for (let j = 0; j < height; j += patternSize) {
        if ((i + j) % (patternSize * 2) === 0) {
          ctx.fillRect(i, j, patternSize, patternSize);
        }
      }
    }
    
    // Draw border
    ctx.strokeStyle = colorSet.text + '40';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, width, height);
    
    // Draw category
    ctx.fillStyle = colorSet.text;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(category, width / 2, height / 3);
    
    // Draw city and name if provided
    if (city || name) {
      ctx.font = '18px sans-serif';
      ctx.fillText(city, width / 2, height / 2);
      
      if (name) {
        ctx.font = 'bold 20px sans-serif';
        
        // Handle long names with wrapping
        const words = name.split(' ');
        let line = '';
        let y = height / 2 + 30;
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > width - 40 && i > 0) {
            ctx.fillText(line, width / 2, y);
            line = words[i] + ' ';
            y += 24;
          } else {
            line = testLine;
          }
        }
        
        ctx.fillText(line, width / 2, y);
      }
    }
    
    // Draw SIT logo
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('SIT', width / 2, height - 20);
  }, [category, city, name, width, height]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ 
        width: '100%', 
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );
}