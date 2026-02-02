// ============================================
// DASHBOARD PAGE
// Halaman utama dengan statistik & ringkasan
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Task, Schedule } from '@/lib/types';
import { loadTasks, loadSchedules } from '@/lib/localStorage';
import { calculateTaskStats, getTodayTasks, getTodaySchedules } from '@/lib/taskHelpers';
import StatCard from '@/components/StatCard';
import TaskItem from '@/components/TaskItem';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data saat pertama kali
  useEffect(() => {
    const loadedTasks = loadTasks();
    const loadedSchedules = loadSchedules();
    
    setTasks(loadedTasks);
    setSchedules(loadedSchedules);
    setIsLoading(false);
  }, []);

  // Hitung statistik
  const stats = calculateTaskStats(tasks);
  const todayTasks = getTodayTasks(tasks);
  const todaySchedules = getTodaySchedules(schedules);

  if (isLoading) {
  return <LoadingSpinner message="Memuat tugas..." />;
}

  return (
   <main className="p-6 space-y-8">
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Selamat datang! Kelola tugas dan jadwal kamu di sini.
      </p>
      
      {/* Seed Data Button (BARU - untuk demo/testing) */}
      {tasks.length === 0 && schedules.length === 0 && (
        <div className="mt-4">
          <button
            onClick={() => {
              // Import dynamic (supaya gak di-bundle kalau gak dipake)
              import('@/lib/seedData').then(module => {
                module.seedAllData();
                // Reload halaman untuk lihat data
                window.location.reload();
              });
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
          >
            🌱 Isi Data Dummy (untuk Demo)
          </button>
        </div>
      )}
    </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tugas" 
          value={stats.total} 
          icon="📚" 
          color="blue" 
        />
        <StatCard 
          title="Selesai" 
          value={stats.completed} 
          icon="✅" 
          color="green" 
        />
        <StatCard 
          title="Belum Selesai" 
          value={stats.pending} 
          icon="⏳" 
          color="yellow" 
        />
        <StatCard 
          title="Progress" 
          value={`${stats.completionRate}%`} 
          icon="📊" 
          color="blue" 
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Progress Keseluruhan
          </h2>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {stats.completionRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            className="bg-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Grid: Today's Tasks & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="mr-2">📝</span>
            Tugas Hari Ini
            <span className="ml-auto text-sm font-normal text-gray-600 dark:text-gray-400">
              {todayTasks.length} tugas
            </span>
          </h2>
          
          <div className="space-y-3">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  🎉 Tidak ada tugas hari ini!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="mr-2">📅</span>
            Jadwal Hari Ini
            <span className="ml-auto text-sm font-normal text-gray-600 dark:text-gray-400">
              {todaySchedules.length} jadwal
            </span>
          </h2>
          
          <div className="space-y-3">
            {todaySchedules.length > 0 ? (
              todaySchedules.map(schedule => (
                <div 
                  key={schedule.id}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {schedule.subject}
                    </p>
                    {schedule.room && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {schedule.room}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {schedule.startTime} - {schedule.endTime}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  📚 Tidak ada jadwal hari ini
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}