'use client';

import { useCallback } from 'react';

export const useSectionScroll = () => {
  // Enhanced easing functions for rolling wave effect
  const easeInOutQuart = (t: number): number => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  };

  // Rolling wave easing - creates a more fluid, ocean-like movement
  const rollingWaveEase = (t: number): number => {
    // Combine multiple easing curves for wave-like motion
    const primary = easeInOutQuart(t);
    const wave = Math.sin(t * Math.PI) * 0.1; // Subtle wave overlay
    return Math.max(0, Math.min(1, primary + wave * (1 - t))); // Stronger wave at start
  };

  const smoothScrollToElement = (element: HTMLElement, duration: number = 2200): Promise<void> => {
    return new Promise((resolve) => {
      const start = window.pageYOffset;
      const target = element.offsetTop;
      const distance = target - start;
      let startTime: number | null = null;

      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Apply rolling wave easing function
        const ease = rollingWaveEase(progress);
        window.scrollTo(0, start + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  };

  const scrollThroughSections = useCallback(async () => {
    // Define the sections in order
    const sections = ['about', 'work', 'portfolio', 'blog', 'contact'];
    
    // Faster, more fluid rolling wave timing
    const scrollDuration = 2200; // 2.2 seconds per scroll (was 3000ms) - faster movement
    const pauseDuration = 2000; // 2 seconds pause (was 2800ms) - shorter pauses for flow
    
    for (let i = 0; i < sections.length; i++) {
      const sectionId = sections[i];
      const element = document.getElementById(sectionId);
      
      if (element) {
        // Custom eased scroll to the section
        await smoothScrollToElement(element, scrollDuration);
        
        // Pause before moving to next section (except on last section)
        if (i < sections.length - 1) {
          await new Promise(resolve => setTimeout(resolve, pauseDuration));
        }
      }
    }
  }, []);

  return { scrollThroughSections };
};
