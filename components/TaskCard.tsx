// ============================================
// TASK CARD COMPONENT
// Card untuk menampilkan detail tugas lengkap
// ============================================

import { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;    // Fungsi untuk tandai selesai
  onEdit: (task: Task) => void;              // Fungsi untuk edit
  onDelete: (id: string) => void;            // Fungsi untuk hapus
}

export default function TaskCard({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: TaskCardProps) {
  
  // Mapping prioritas ke warna
  const priorityColors = {
    Tinggi: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    Sedang: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Rendah: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  // Format tanggal deadline
  const deadlineDate = new Date(task.deadline);
  const formattedDate = deadlineDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = deadlineDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Cek apakah deadline sudah lewat
  const isOverdue = new Date() > deadlineDate && !task.isCompleted;

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 
        rounded-lg shadow-md 
        p-5 
        border-l-4 
        transition-all duration-300
        hover:shadow-lg
        ${task.isCompleted 
          ? 'border-green-500 opacity-75' 
          : isOverdue 
            ? 'border-red-500' 
            : 'border-blue-500'
        }
      `}
    >
      {/* Header: Title & Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`
              mt-1 w-5 h-5 rounded border-2 
              flex items-center justify-center
              transition-colors
              ${task.isCompleted 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
              }
            `}
          >
            {task.isCompleted && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 
              className={`
                text-lg font-semibold
                ${task.isCompleted 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : 'text-gray-800 dark:text-white'
                }
              `}
            >
              {task.title}
            </h3>
          </div>
        </div>

        {/* Priority Badge */}
        <span 
          className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${priorityColors[task.priority]}
          `}
        >
          {task.priority}
        </span>
      </div>

      {/* Subject */}
      <div className="mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          📚 {task.subject}
        </span>
      </div>

      {/* Deadline */}
      <div className="mb-4 space-y-1">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formattedTime}</span>
        </div>
        {isOverdue && (
          <div className="flex items-center text-sm text-red-600 dark:text-red-400 font-semibold">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Terlambat!
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
        >
          🗑️ Hapus
        </button>
      </div>
    </div>
  );
}