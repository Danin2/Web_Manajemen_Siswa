// ============================================
// LOADING SPINNER COMPONENT
// Reusable loading indicator
// ============================================

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Memuat..." }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}