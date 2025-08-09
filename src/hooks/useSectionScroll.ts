'use client';

import { useCallback } from 'react';

export const useSectionScroll = () => {
  const scrollThroughSections = useCallback(async () => {
    // Define the sections in order
    const sections = ['about', 'work', 'portfolio', 'blog', 'contact'];
    
    // Duration for each scroll and pause
    const scrollDuration = 800; // ms to scroll to section
    const pauseDuration = 1200; // ms to pause at each section
    
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
