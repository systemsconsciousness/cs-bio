'use client';

import { useCallback } from 'react';

export const useSectionScroll = () => {
  const scrollThroughSections = useCallback(async () => {
    // Define the sections in order
    const sections = ['about', 'work', 'portfolio', 'blog', 'contact'];
    
    // Duration for each scroll and pause - much slower and more luxurious
    const scrollDuration = 1800; // ms to scroll to section (was 800)
    const pauseDuration = 2500; // ms to pause at each section (was 1200)
    
    for (let i = 0; i < sections.length; i++) {
      const sectionId = sections[i];
      const element = document.getElementById(sectionId);
      
      if (element) {
        // Smooth scroll to the section
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Wait for scroll to complete + pause time
        const waitTime = i === sections.length - 1 ? scrollDuration : scrollDuration + pauseDuration;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }, []);

  return { scrollThroughSections };
};
