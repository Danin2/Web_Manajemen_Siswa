// ============================================
// STAT CARD COMPONENT
// Card untuk menampilkan statistik (reusable)
// ============================================

interface StatCardProps {
  title: string;           // Judul card (misal: "Total Tugas")
  value: number | string;  // Nilai (angka atau text)
  icon?: string;           // Icon emoji (opsional)
  color?: string;          // Warna aksen (opsional)
}

export default function StatCard({ 
  title, 
  value, 
  icon = "📊", 
  color = "blue" 
}: StatCardProps) {
  
  // Mapping warna ke class Tailwind
  const colorClasses = {
    blue: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
    green: "border-green-500 bg-green-50 dark:bg-green-900/20",
    yellow: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    red: "border-red-500 bg-red-50 dark:bg-red-900/20",
  };

  return (
    <div 
      className={`
        border-l-4 rounded-lg p-6
        bg-white dark:bg-gray-800
        shadow-md hover:shadow-lg
        transition-shadow duration-300
        ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}
      `}
    >
      {/* Icon */}
      <div className="text-3xl mb-2">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}