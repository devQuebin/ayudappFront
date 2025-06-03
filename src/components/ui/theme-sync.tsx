"use client";

import { useEffect, useState } from 'react';

// A custom hook that safely handles client-side theme synchronization
export function useThemeSync() {
  // Keep track of whether we're on the client side
  const [isMounted, setIsMounted] = useState(false);

  // This effect will only run on the client
  useEffect(() => {
    setIsMounted(true);

    // Only run theme sync on client
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if no theme is set in localStorage
      if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', e.matches);
        document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light';
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isMounted;
}
