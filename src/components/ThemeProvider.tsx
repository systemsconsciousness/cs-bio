'use client';

import { useEffect } from 'react';
import { SiteConfiguration } from '@/lib/contentstack';

interface ThemeProviderProps {
  siteConfig: SiteConfiguration | null;
  children: React.ReactNode;
}

const ThemeProvider = ({ siteConfig, children }: ThemeProviderProps) => {
  useEffect(() => {
    if (siteConfig?.primary_color || siteConfig?.secondary_color) {
      const root = document.documentElement;
      
      if (siteConfig.primary_color) {
        // Convert hex to HSL for better color manipulation
        const primaryHsl = hexToHsl(siteConfig.primary_color);
        if (primaryHsl) {
          root.style.setProperty('--accent', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
          // Create a darker variant for hover states
          root.style.setProperty('--accent-foreground', primaryHsl.l > 50 ? '0 0% 100%' : '0 0% 0%');
        }
      }
      
      if (siteConfig.secondary_color) {
        const secondaryHsl = hexToHsl(siteConfig.secondary_color);
        if (secondaryHsl) {
          // Use secondary color for muted elements
          root.style.setProperty('--muted', `${secondaryHsl.h} ${secondaryHsl.s}% ${Math.min(secondaryHsl.l + 40, 95)}%`);
          root.style.setProperty('--muted-foreground', `${secondaryHsl.h} ${Math.max(secondaryHsl.s - 10, 0)}% ${Math.max(secondaryHsl.l - 20, 15)}%`);
        }
      }
    }
  }, [siteConfig?.primary_color, siteConfig?.secondary_color]);

  return <>{children}</>;
};

// Helper function to convert hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export default ThemeProvider;
