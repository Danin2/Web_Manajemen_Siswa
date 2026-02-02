// ============================================
// MODAL COMPONENT
// Component reusable untuk popup/dialog
// ============================================

'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;                    // Modal terbuka atau tidak
  onClose: () => void;                // Fungsi untuk tutup modal
  title: string;                      // Judul modal
  children: React.ReactNode;          // Konten modal (form, dll)
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  
  // Prevent scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup saat component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Tutup modal saat tekan ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Kalau modal tertutup, jangan render apa-apa
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop (background gelap) */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}  // Klik backdrop = tutup modal
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}  // Prevent close saat klik modal
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}