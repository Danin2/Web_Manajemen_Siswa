// ============================================
// SORT HELPER FUNCTIONS
// Fungsi untuk sorting & filtering tugas
// ============================================

import { Task, SortOption } from './types';

/**
 * 🔀 Sort tasks berdasarkan option
 * @param tasks - Array tugas
 * @param sortBy - Opsi sorting
 * @returns Array tugas yang sudah diurutkan
 */
export function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
  const sorted = [...tasks]; // Copy array (jangan ubah original)

  switch (sortBy) {
    case 'deadline-asc':
      // Deadline terdekat dulu
      return sorted.sort((a, b) => 
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );

    case 'deadline-desc':
      // Deadline terjauh dulu
      return sorted.sort((a, b) => 
        new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      );

    case 'priority-high':
      // Tinggi → Sedang → Rendah
      const priorityOrder = { Tinggi: 1, Sedang: 2, Rendah: 3 };
      return sorted.sort((a, b) => 
        priorityOrder[a.priority] - priorityOrder[b.priority]
      );

    case 'priority-low':
      // Rendah → Sedang → Tinggi
      const reversePriorityOrder = { Rendah: 1, Sedang: 2, Tinggi: 3 };
      return sorted.sort((a, b) => 
        reversePriorityOrder[a.priority] - reversePriorityOrder[b.priority]
      );

    case 'title-asc':
      // A → Z
      return sorted.sort((a, b) => 
        a.title.localeCompare(b.title)
      );

    case 'title-desc':
      // Z → A
      return sorted.sort((a, b) => 
        b.title.localeCompare(a.title)
      );

    case 'created-new':
      // Terbaru dulu
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'created-old':
      // Terlama dulu
      return sorted.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    default:
      return sorted;
  }
}

/**
 * 📅 Filter tugas berdasarkan quick filter
 * @param tasks - Array tugas
 * @param quickFilter - Opsi quick filter
 * @returns Array tugas yang sudah difilter
 */
export function applyQuickFilter(tasks: Task[], quickFilter: string): Task[] {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Hitung akhir minggu ini (Minggu)
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
  const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

  switch (quickFilter) {
    case 'today':
      // Tugas hari ini (belum selesai)
      return tasks.filter(t => {
        const taskDate = t.deadline.split('T')[0];
        return taskDate === today && !t.isCompleted;
      });

    case 'week':
      // Tugas minggu ini (belum selesai)
      return tasks.filter(t => {
        const taskDate = t.deadline.split('T')[0];
        return taskDate >= today && taskDate <= endOfWeekStr && !t.isCompleted;
      });

    case 'overdue':
      // Tugas terlambat (deadline sudah lewat tapi belum selesai)
      return tasks.filter(t => {
        const taskDeadline = new Date(t.deadline);
        return taskDeadline < now && !t.isCompleted;
      });

    case 'all':
    default:
      return tasks;
  }
}