import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: true, // Default to dark mode
      
      toggleTheme: () => {
        const newMode = !get().isDarkMode;
        set({ isDarkMode: newMode });
        
        // Update document class for Tailwind
        if (newMode) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light-mode');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light-mode');
        }
      },
      
      initTheme: () => {
        const isDark = get().isDarkMode;
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light-mode');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light-mode');
        }
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);
