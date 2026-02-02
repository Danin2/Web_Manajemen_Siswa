// ============================================
// TASK ITEM COMPONENT
// Menampilkan 1 item tugas dalam bentuk compact
// ============================================

import { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  // Mapping prioritas ke warna & emoji
  const priorityConfig = {
    Tinggi: { color: "text-red-600 dark:text-red-400", emoji: "🔴" },
    Sedang: { color: "text-yellow-600 dark:text-yellow-400", emoji: "🟡" },
    Rendah: { color: "text-green-600 dark:text-green-400", emoji: "🟢" },
  };

  const config = priorityConfig[task.priority];

  // Format waktu deadline
  const deadlineTime = new Date(task.deadline).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
      {/* Left: Task Info */}
      <div className="flex items-center space-x-3 flex-1">
        {/* Priority Indicator */}
        <span className="text-xl">{config.emoji}</span>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
            {task.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {task.subject}
          </p>
        </div>
      </div>

      {/* Right: Deadline */}
      <div className="flex items-center space-x-2 ml-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {deadlineTime}
        </span>
        <span className={`text-xs font-semibold ${config.color}`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
}