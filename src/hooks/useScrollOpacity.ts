'use client';

import { useEffect, useState } from 'react';

export const useScrollOpacity = (fadeDistance: number = 400) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Calculate opacity based on scroll position
      // Starts fading at scroll position 0, fully faded at fadeDistance
      const newOpacity = Math.max(0, 1 - (scrollY / fadeDistance));
      
      setOpacity(newOpacity);
    };

    // Set initial opacity
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fadeDistance]);

  return opacity;
};
