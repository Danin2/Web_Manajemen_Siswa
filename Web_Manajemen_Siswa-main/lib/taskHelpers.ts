// ============================================
// TASK HELPER FUNCTIONS
// Fungsi untuk kalkulasi statistik tugas
// ============================================

import { Task, TaskStats } from './types';

/**
 * 📊 Hitung statistik tugas
 * @param tasks - Array semua tugas
 * @returns Object TaskStats
 */
export function calculateTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter(t => t.isCompleted).length;
  const pending = total - completed;
  
  // Hitung tugas hari ini
  const today = new Date().toISOString().split('T')[0]; // Format: "2026-02-01"
  const todayTasks = tasks.filter(t => {
    const taskDate = t.deadline.split('T')[0];
    return taskDate === today;
  }).length;
  
  // Hitung completion rate (persentase)
  const completionRate = total > 0 
    ? Math.round((completed / total) * 100) 
    : 0;
  
  return {
    total,
    completed,
    pending,
    todayTasks,
    completionRate,
  };
}

/**
 * 📅 Filter tugas hari ini
 * @param tasks - Array tugas
 * @returns Tugas yang deadline-nya hari ini
 */
export function getTodayTasks(tasks: Task[]): Task[] {
  const today = new Date().toISOString().split('T')[0];
  
  return tasks.filter(t => {
    const taskDate = t.deadline.split('T')[0];
    return taskDate === today && !t.isCompleted;
  }).sort((a, b) => {
    // Urutkan by deadline time
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
}

/**
 * 📅 Filter jadwal hari ini
 * @param schedules - Array jadwal
 * @returns Jadwal hari ini
 */
export function getTodaySchedules(schedules: any[]): any[] {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const today = days[new Date().getDay()];
  
  return schedules
    .filter(s => s.day === today)
    .sort((a, b) => {
      // Urutkan by waktu mulai
      return a.startTime.localeCompare(b.startTime);
    });
}