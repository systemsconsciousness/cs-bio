'use client';

import { useCallback } from 'react';

export const useSectionScroll = () => {
  // Custom eased scroll function
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const smoothScrollToElement = (element: HTMLElement, duration: number = 3000): Promise<void> => {
    return new Promise((resolve) => {
      const start = window.pageYOffset;
      const target = element.offsetTop;
      const distance = target - start;
      let startTime: number | null = null;

      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Apply easing function
        const ease = easeInOutCubic(progress);
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
    
    // Much slower, more luxurious timing
    const scrollDuration = 3000; // 3 seconds per scroll (was 1800ms)
    const pauseDuration = 2800; // 2.8 seconds pause (was 2500ms)
    
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
