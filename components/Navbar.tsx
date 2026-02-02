// ============================================
// NAVBAR COMPONENT
// Navigasi utama aplikasi
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  const pathname = usePathname(); // Ambil URL saat ini

  // 📌 Daftar menu navigasi
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/tasks', label: 'Tugas' },
    { href: '/schedule', label: 'Jadwal' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Judul */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                SMK Task Manager
              </span>
            </Link>
          </div>

          {/* Menu Navigasi */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg
                    font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center">
            <DarkModeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Menu (Opsional - nanti kita tambahkan) */}
      <div className="md:hidden px-4 pb-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-3 py-2 rounded-lg
                font-medium transition-colors
                ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}