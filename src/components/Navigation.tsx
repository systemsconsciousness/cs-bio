'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  siteName?: string;
}

const Navigation = ({ siteName }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Smooth scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false); // Close mobile menu
  };

  const updateThemeClasses = (dark: boolean) => {
    const html = document.documentElement;
    
    // Remove existing theme classes
    html.classList.remove('dark', 'light');
    
    // Add appropriate class
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.add('light');
    }
  };

  useEffect(() => {
    // Check if user has a saved preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateFromSystemPreference = () => {
      const currentSavedTheme = localStorage.getItem('theme');
      
      // Only update if user hasn't set a manual preference
      if (!currentSavedTheme) {
        const systemPrefersDark = mediaQuery.matches;
        setIsDark(systemPrefersDark);
        updateThemeClasses(systemPrefersDark);
      }
    };
    
    // Initial setup
    let shouldBeDark: boolean;
    
    if (savedTheme === 'dark') {
      shouldBeDark = true;
    } else if (savedTheme === 'light') {
      shouldBeDark = false;
    } else {
      // No saved preference, use system preference
      shouldBeDark = mediaQuery.matches;
    }
    
    setIsDark(shouldBeDark);
    updateThemeClasses(shouldBeDark);
    
    // Listen for system theme changes
    mediaQuery.addEventListener('change', updateFromSystemPreference);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', updateFromSystemPreference);
    };
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    updateThemeClasses(newIsDark);
    
    // Save user preference
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const resetToSystemTheme = () => {
    // Remove saved preference to go back to system default
    localStorage.removeItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(systemPrefersDark);
    updateThemeClasses(systemPrefersDark);
  };

  const navItems = [
    { id: 'home', label: 'Home', isExternal: false },
    { id: 'about', label: 'About', isExternal: false },
    { id: 'work', label: 'Experience', isExternal: false },
    { id: 'portfolio', label: 'Portfolio', isExternal: false },
    { href: '/blog', label: 'Blog', isExternal: true },
    { id: 'contact', label: 'Contact', isExternal: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
                          <button
                  onClick={() => window.location.href = '/'}
                  className="font-bold text-xl text-foreground hover:text-accent transition-colors cursor-pointer"
                >
                  {siteName || 'CS'}
                </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              item.isExternal ? (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id!)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                >
                  {item.label}
                </button>
              )
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              onDoubleClick={resetToSystemTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              aria-label="Toggle theme (double-click to reset to system)"
              title="Click to toggle theme, double-click to use system preference"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map((item) => (
                item.isExternal ? (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id!)}
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors w-full text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;