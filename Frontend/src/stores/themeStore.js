import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false, // Default to light mode
      
      toggleTheme: () => {
        // Disabled dark mode to keep it simple and standard light mode
        set({ isDarkMode: false });
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light-mode');
      },
      
      initTheme: () => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light-mode');
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);
