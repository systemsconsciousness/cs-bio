'use client';

import { useCallback, useRef } from 'react';

export const useSectionScroll = () => {
  const isScrollingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // More gentle, continuous easing function
  const easeInOutSine = (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  };

  // Smoother, more luxurious easing
  const smoothLuxuryEase = (t: number): number => {
    // Combine sine with cubic for ultra-smooth feel
    const sine = easeInOutSine(t);
    const cubic = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    return sine * 0.7 + cubic * 0.3; // Blend for perfect smoothness
  };

  const stopScrolling = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isScrollingRef.current = false;
  };

  const smoothScrollToElement = (element: HTMLElement, duration: number = 1800): Promise<void> => {
    return new Promise((resolve, reject) => {
      const start = window.pageYOffset;
      const target = element.offsetTop - 80; // Account for fixed header
      const distance = target - start;
      let startTime: number | null = null;

      const animate = (currentTime: number) => {
        if (!isScrollingRef.current) {
          reject(new Error('Scroll interrupted'));
          return;
        }

        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Apply smooth luxury easing
        const ease = smoothLuxuryEase(progress);
        window.scrollTo(0, start + distance * ease);

        if (timeElapsed < duration) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    });
  };

  const scrollThroughSections = useCallback(async () => {
    // Define the sections in order
    const sections = ['about', 'work', 'portfolio', 'blog', 'contact'];
    
    // Set scrolling state
    isScrollingRef.current = true;
    
    // Ultra-smooth, luxurious timing - start immediately
    const scrollDuration = 1800; // 1.8 seconds per scroll - smooth and luxurious
    const pauseDuration = 1600; // 1.6 seconds pause - enough to appreciate each section

    try {
      for (let i = 0; i < sections.length; i++) {
        if (!isScrollingRef.current) break; // Check if interrupted
        
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        
        if (element) {
          // Immediately start scrolling to the section
          await smoothScrollToElement(element, scrollDuration);
          
          // Pause before moving to next section (except on last section)
          if (i < sections.length - 1 && isScrollingRef.current) {
            await new Promise((resolve, reject) => {
              timeoutRef.current = setTimeout(() => {
                if (isScrollingRef.current) {
                  resolve(void 0);
                } else {
                  reject(new Error('Scroll interrupted'));
                }
              }, pauseDuration);
            });
          }
        }
      }
    } catch {
      // Scroll was interrupted, this is normal
    } finally {
      isScrollingRef.current = false;
    }
  }, [smoothScrollToElement]);

  // Add event listeners to detect user interaction and stop scrolling
  const addInterruptListeners = useCallback(() => {
    const handleUserInteraction = () => {
      stopScrolling();
    };

    // Listen for various user interactions
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);

    // Return cleanup function
    return () => {
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  return { scrollThroughSections, stopScrolling, addInterruptListeners };
};
