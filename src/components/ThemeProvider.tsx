'use client';

import { useEffect } from 'react';
import { SiteConfiguration } from '@/lib/contentstack';

interface ThemeProviderProps {
  siteConfig: SiteConfiguration | null;
  children: React.ReactNode;
}

const ThemeProvider = ({ siteConfig, children }: ThemeProviderProps) => {
  useEffect(() => {
    const root = document.documentElement;
    
    if (siteConfig?.primary_color) {
      // Convert hex to RGB and then to HSL
      const primaryHsl = hexToHsl(siteConfig.primary_color);
      if (primaryHsl) {
        // Set CSS custom properties in the format Tailwind expects
        root.style.setProperty('--accent', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
        // Set contrasting foreground color
        root.style.setProperty('--accent-foreground', primaryHsl.l > 50 ? '210 40% 2%' : '0 0% 98%');
      }
    }
    
    if (siteConfig?.secondary_color) {
      const secondaryHsl = hexToHsl(siteConfig.secondary_color);
      if (secondaryHsl) {
        // Use secondary color for border and subtle accents
        root.style.setProperty('--border', `${secondaryHsl.h} ${Math.max(secondaryHsl.s - 20, 10)}% ${Math.min(secondaryHsl.l + 30, 80)}%`);
      }
    }
    
    // Always ensure we have fallback values
    if (!siteConfig?.primary_color) {
      root.style.setProperty('--accent', '217 91% 60%'); // Default blue
      root.style.setProperty('--accent-foreground', '0 0% 98%');
    }
    if (!siteConfig?.secondary_color) {
      root.style.setProperty('--border', '214 32% 91%'); // Default border
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
