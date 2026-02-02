// ============================================
// DARK MODE CUSTOM HOOK
// Hook untuk manage dark mode state & LocalStorage
// ============================================

import { useState, useEffect } from 'react';

/**
 * 🌙 Custom Hook untuk Dark Mode
 * @returns [isDark, toggleDark] - State & fungsi toggle
 */
export function useDarkMode(): [boolean, () => void] {
  // State untuk track dark mode (default: false = light mode)
  const [isDark, setIsDark] = useState(false);

  // 📌 useEffect untuk load preferensi saat pertama kali
  useEffect(() => {
    // Cek LocalStorage ada preferensi gak
    const savedTheme = localStorage.getItem('smk-theme');
    
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []); // Array kosong = cuma jalan sekali saat mount

  // 🔄 Fungsi untuk toggle dark mode
  const toggleDark = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      
      // Update class di <html>
      if (newValue) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('smk-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('smk-theme', 'light');
      }
      
      return newValue;
    });
  };

  return [isDark, toggleDark];
}