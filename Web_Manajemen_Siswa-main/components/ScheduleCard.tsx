// ============================================
// SCHEDULE CARD COMPONENT - MODERN UI
// Card untuk menampilkan 1 jadwal pelajaran
// ============================================

import { Schedule } from '@/lib/types';

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleCard({ schedule, onEdit, onDelete }: ScheduleCardProps) {
  
  // Color mapping per day
  const dayColors: Record<string, string> = {
    Senin: 'from-red-500 to-pink-500',
    Selasa: 'from-orange-500 to-yellow-500',
    Rabu: 'from-green-500 to-emerald-500',
    Kamis: 'from-cyan-500 to-blue-500',
    Jumat: 'from-blue-500 to-purple-500',
    Sabtu: 'from-purple-500 to-pink-500',
    Minggu: 'from-pink-500 to-rose-500',
  };

  const gradientClass = dayColors[schedule.day] || 'from-blue-500 to-purple-500';

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Top Gradient Bar */}
      <div className={`h-2 bg-gradient-to-r ${gradientClass}`}></div>

      <div className="p-6">
        {/* Day Badge */}
        <div className="mb-4">
          <span className={`inline-block px-4 py-2 rounded-xl text-sm font-black bg-gradient-to-r ${gradientClass} text-white`}>
            {schedule.day}
          </span>
        </div>

        {/* Subject */}
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 transition-all">
          {schedule.subject}
        </h3>

        {/* Time */}
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-lg">
            {schedule.startTime} - {schedule.endTime}
          </span>
        </div>

        {/* Room (optional) */}
        {schedule.room && (
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-semibold">📍 {schedule.room}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onEdit(schedule)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-bold hover:-translate-y-0.5"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(schedule.id)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-bold hover:-translate-y-0.5"
          >
            🗑️ Hapus
          </button>
        </div>
      </div>
    </div>
  );
}