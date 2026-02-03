// ============================================
// LOCALSTORAGE HELPER FUNCTIONS
// File ini berisi fungsi untuk simpan/ambil data
// ============================================

import { Task, Schedule } from './types';

// 🔑 KEY CONSTANTS (Nama kunci di LocalStorage)
const STORAGE_KEYS = {
  TASKS: 'smk-tasks',          // Key untuk simpan tugas
  SCHEDULES: 'smk-schedules',  // Key untuk simpan jadwal
  THEME: 'smk-theme',          // Key untuk dark mode (nanti dipakai)
} as const;

// ============================================
// TASK FUNCTIONS (Fungsi untuk Tugas)
// ============================================

/**
 * 💾 Simpan semua tugas ke LocalStorage
 * @param tasks - Array tugas yang mau disimpan
 */
export function saveTasks(tasks: Task[]): void {
  try {
    // Convert object jadi string JSON
    const tasksJSON = JSON.stringify(tasks);
    
    // Simpan ke LocalStorage
    localStorage.setItem(STORAGE_KEYS.TASKS, tasksJSON);
    
    console.log('✅ Tugas berhasil disimpan:', tasks.length, 'tugas');
  } catch (error) {
    console.error('❌ Error saat simpan tugas:', error);
  }
}

/**
 * 📂 Ambil semua tugas dari LocalStorage
 * @returns Array tugas (kalau kosong, return array kosong [])
 */
export function loadTasks(): Task[] {
  try {
    // Ambil data dari LocalStorage
    const tasksJSON = localStorage.getItem(STORAGE_KEYS.TASKS);
    
    // Kalau gak ada data, return array kosong
    if (!tasksJSON) {
      console.log('ℹ️ Belum ada tugas tersimpan');
      return [];
    }
    
    // Convert string JSON jadi object
    const tasks: Task[] = JSON.parse(tasksJSON);
    
    console.log('✅ Tugas berhasil dimuat:', tasks.length, 'tugas');
    return tasks;
  } catch (error) {
    console.error('❌ Error saat load tugas:', error);
    return []; // Kalau error, return array kosong
  }
}

// ============================================
// SCHEDULE FUNCTIONS (Fungsi untuk Jadwal)
// ============================================

/**
 * 💾 Simpan semua jadwal ke LocalStorage
 * @param schedules - Array jadwal yang mau disimpan
 */
export function saveSchedules(schedules: Schedule[]): void {
  try {
    const schedulesJSON = JSON.stringify(schedules);
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, schedulesJSON);
    console.log('✅ Jadwal berhasil disimpan:', schedules.length, 'jadwal');
  } catch (error) {
    console.error('❌ Error saat simpan jadwal:', error);
  }
}

/**
 * 📂 Ambil semua jadwal dari LocalStorage
 * @returns Array jadwal (kalau kosong, return array kosong [])
 */
export function loadSchedules(): Schedule[] {
  try {
    const schedulesJSON = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    
    if (!schedulesJSON) {
      console.log('ℹ️ Belum ada jadwal tersimpan');
      return [];
    }
    
    const schedules: Schedule[] = JSON.parse(schedulesJSON);
    console.log('✅ Jadwal berhasil dimuat:', schedules.length, 'jadwal');
    return schedules;
  } catch (error) {
    console.error('❌ Error saat load jadwal:', error);
    return [];
  }
}

// ============================================
// UTILITY FUNCTIONS (Fungsi Pembantu)
// ============================================

/**
  * 🆔 Generate ID unik untuk tugas/jadwal
 * @param prefix - Awalan ID (misal: 'task' atau 'schedule')
 * @returns String ID unik (misal: 'task_1738425678901_abc123')
 */
export function generateId(prefix: 'task' | 'schedule'): string {
  // Timestamp + Random string (untuk avoid duplicate)
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * 🗑️ Hapus SEMUA data (reset aplikasi)
 * HATI-HATI! Fungsi ini gak bisa di-undo!
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
    console.log('✅ Semua data berhasil dihapus');
  } catch (error) {
    console.error('❌ Error saat hapus data:', error);
  }
}

/**
 * 📊 Cek total storage yang dipakai (opsional, untuk debugging)
 * @returns Ukuran storage dalam KB
 */
export function getStorageSize(): number {
  let totalSize = 0;
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }
  
  // Convert ke KB (1 KB = 1024 bytes)
  const sizeInKB = (totalSize / 1024).toFixed(2);
  console.log(`📦 Storage terpakai: ${sizeInKB} KB`);
  
  return parseFloat(sizeInKB);
}