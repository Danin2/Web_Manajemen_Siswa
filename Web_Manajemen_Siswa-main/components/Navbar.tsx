// ============================================
// NAVBAR COMPONENT
// Navigasi utama aplikasi dengan desain modern
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 📌 Daftar menu navigasi dengan icon
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/tasks', label: 'Tugas' },
    { href: '/schedule', label: 'Jadwal'},
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Judul dengan Gradient */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition duration-300">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                SMK Task Manager
              </span>
            </Link>
          </div>

          {/* Menu Navigasi Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-5 py-2.5 rounded-xl
                    font-medium transition-all duration-300
                    flex items-center space-x-2
                    ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }
                  `}
                >
                  {/* Background untuk active state */}
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"></span>
                  )}
                  
                  {/* Hover effect */}
                  {!isActive && (
                    <span className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  )}
                  
                  <span className="relative">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dengan Animasi */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 py-3 space-y-2 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  relative flex items-center space-x-3 px-4 py-3 rounded-xl
                  font-medium transition-all duration-300
                  ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"></span>
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}