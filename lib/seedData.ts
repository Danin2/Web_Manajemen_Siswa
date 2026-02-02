// ============================================
// SEED DATA
// Data dummy untuk testing & demo
// ============================================

import { Task, Schedule } from './types';
import { saveTasks, saveSchedules, generateId } from './localStorage';

/**
 * 🌱 Generate dummy tasks
 */
export function generateDummyTasks(): Task[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const tasks: Task[] = [
    // Tugas Hari Ini
    {
      id: generateId('task'),
      title: 'Mengerjakan Soal Matematika Bab 5',
      subject: 'Matematika',
      deadline: new Date(today.setHours(17, 0, 0, 0)).toISOString(),
      priority: 'Tinggi',
      isCompleted: false,
      createdAt: '2026-01-28'
    },
    {
      id: generateId('task'),
      title: 'Membaca Materi Sejarah tentang Kolonialisme',
      subject: 'Sejarah',
      deadline: new Date(today.setHours(20, 0, 0, 0)).toISOString(),
      priority: 'Sedang',
      isCompleted: false,
      createdAt: '2026-01-29'
    },
    
    // Tugas Besok
    {
      id: generateId('task'),
      title: 'Menulis Essay Bahasa Inggris',
      subject: 'Bahasa Inggris',
      deadline: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
      priority: 'Tinggi',
      isCompleted: false,
      createdAt: '2026-01-27'
    },
    {
      id: generateId('task'),
      title: 'Lab Kimia: Praktikum Asam Basa',
      subject: 'Kimia',
      deadline: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
      priority: 'Sedang',
      isCompleted: false,
      createdAt: '2026-01-30'
    },
    
    // Tugas Minggu Depan
    {
      id: generateId('task'),
      title: 'Bikin Laporan PKL Chapter 1-3',
      subject: 'PKL',
      deadline: new Date(nextWeek.setHours(16, 0, 0, 0)).toISOString(),
      priority: 'Tinggi',
      isCompleted: false,
      createdAt: '2026-01-25'
    },
    {
      id: generateId('task'),
      title: 'Presentasi Kelompok Ekonomi',
      subject: 'Ekonomi',
      deadline: new Date(nextWeek.setHours(9, 0, 0, 0)).toISOString(),
      priority: 'Sedang',
      isCompleted: false,
      createdAt: '2026-01-26'
    },
    {
      id: generateId('task'),
      title: 'Tugas Fisika: Soal Gerak Parabola',
      subject: 'Fisika',
      deadline: new Date(nextWeek.setHours(15, 30, 0, 0)).toISOString(),
      priority: 'Rendah',
      isCompleted: false,
      createdAt: '2026-01-29'
    },
    
    // Tugas yang Sudah Selesai
    {
      id: generateId('task'),
      title: 'Membuat Program Java OOP',
      subject: 'Produktif RPL',
      deadline: '2026-01-30T16:00:00',
      priority: 'Tinggi',
      isCompleted: true,
      createdAt: '2026-01-20'
    },
    {
      id: generateId('task'),
      title: 'Baca Novel Bahasa Indonesia',
      subject: 'Bahasa Indonesia',
      deadline: '2026-01-29T18:00:00',
      priority: 'Rendah',
      isCompleted: true,
      createdAt: '2026-01-22'
    },
    {
      id: generateId('task'),
      title: 'Konfigurasi Jaringan di Packet Tracer',
      subject: 'Produktif TKJ',
      deadline: '2026-01-28T14:00:00',
      priority: 'Sedang',
      isCompleted: true,
      createdAt: '2026-01-21'
    },
  ];

  return tasks;
}

/**
 * 🌱 Generate dummy schedules
 */
export function generateDummySchedules(): Schedule[] {
  const schedules: Schedule[] = [
    // Senin
    {
      id: generateId('schedule'),
      day: 'Senin',
      subject: 'Matematika',
      startTime: '07:00',
      endTime: '09:00',
      room: 'Kelas 12 RPL'
    },
    {
      id: generateId('schedule'),
      day: 'Senin',
      subject: 'Bahasa Indonesia',
      startTime: '09:00',
      endTime: '11:00',
      room: 'Kelas 12 RPL'
    },
    {
      id: generateId('schedule'),
      day: 'Senin',
      subject: 'Produktif RPL',
      startTime: '12:30',
      endTime: '15:30',
      room: 'Lab Komputer 1'
    },
    
    // Selasa
    {
      id: generateId('schedule'),
      day: 'Selasa',
      subject: 'Bahasa Inggris',
      startTime: '07:00',
      endTime: '09:00',
      room: 'Kelas 12 RPL'
    },
    {
      id: generateId('schedule'),
      day: 'Selasa',
      subject: 'Fisika',
      startTime: '09:00',
      endTime: '11:00',
      room: 'Lab IPA'
    },
    {
      id: generateId('schedule'),
      day: 'Selasa',
      subject: 'PKL',
      startTime: '12:30',
      endTime: '16:00',
      room: 'Ruang PKL'
    },
    
    // Rabu
    {
      id: generateId('schedule'),
      day: 'Rabu',
      subject: 'Kimia',
      startTime: '07:00',
      endTime: '09:00',
      room: 'Lab IPA'
    },
    {
      id: generateId('schedule'),
      day: 'Rabu',
      subject: 'Sejarah',
      startTime: '09:00',
      endTime: '11:00',
      room: 'Kelas 12 RPL'
    },
    {
      id: generateId('schedule'),
      day: 'Rabu',
      subject: 'Produktif RPL',
      startTime: '12:30',
      endTime: '15:30',
      room: 'Lab Komputer 2'
    },
    
    // Kamis
    {
      id: generateId('schedule'),
      day: 'Kamis',
      subject: 'Ekonomi',
      startTime: '07:00',
      endTime: '09:00',
      room: 'Kelas 12 RPL'
    },
    {
      id: generateId('schedule'),
      day: 'Kamis',
      subject: 'PPKN',
      startTime: '09:00',
      endTime: '11:00',
      room: 'Kelas 12 RPL'
    },
    {
      id: generateId('schedule'),
      day: 'Kamis',
      subject: 'Matematika',
      startTime: '12:30',
      endTime: '14:30',
      room: 'Kelas 12 RPL'
    },
    
    // Jumat
    {
      id: generateId('schedule'),
      day: 'Jumat',
      subject: 'Penjaskes',
      startTime: '07:00',
      endTime: '09:00',
      room: 'Lapangan'
    },
    {
      id: generateId('schedule'),
      day: 'Jumat',
      subject: 'Seni Budaya',
      startTime: '09:00',
      endTime: '10:30',
      room: 'Ruang Seni'
    },
  ];

  return schedules;
}

/**
 * 🌱 Seed all data
 */
export function seedAllData() {
  const tasks = generateDummyTasks();
  const schedules = generateDummySchedules();
  
  saveTasks(tasks);
  saveSchedules(schedules);
  
  console.log('✅ Data dummy berhasil di-seed!');
  console.log(`   - ${tasks.length} tugas`);
  console.log(`   - ${schedules.length} jadwal`);
}