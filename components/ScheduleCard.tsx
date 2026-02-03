// ============================================
// SCHEDULE CARD COMPONENT
// Card untuk menampilkan 1 jadwal pelajaran
// ============================================

import { Schedule } from '@/lib/types';

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleCard({ schedule, onEdit, onDelete }: ScheduleCardProps) {
  
  // Random color per subject (untuk visual variety)
  const subjectColors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  ];

  // Hash subject name untuk dapat warna konsisten
  const getColorForSubject = (subject: string) => {
    const hash = subject.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return subjectColors[hash % subjectColors.length];
  };

  const colorClass = getColorForSubject(schedule.subject);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      {/* Time */}
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-semibold">{schedule.startTime} - {schedule.endTime}</span>
      </div>

      {/* Subject */}
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        {schedule.subject}
      </h3>

      {/* Day Badge */}
      <div className="mb-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {schedule.day}
        </span>
      </div>

      {/* Room (optional) */}
      {schedule.room && (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>{schedule.room}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onEdit(schedule)}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(schedule.id)}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
        >
          🗑️ Hapus
        </button>
      </div>
    </div>
  );
}