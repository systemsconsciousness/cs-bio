'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();

  useEffect(() => {
    // If we're on the blog page or any blog post, set active section to 'blog'
    if (pathname.startsWith('/blog')) {
      setActiveSection('blog');
      return;
    }

    const sections = ['home', 'about', 'work', 'portfolio', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Account for header height
      
      // Check if we're at the very top
      if (window.scrollY < 50) {
        setActiveSection('home');
        return;
      }
      
      // Find the current section based on scroll position
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    // Set initial state
    handleScroll();
    
    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return activeSection;
};
