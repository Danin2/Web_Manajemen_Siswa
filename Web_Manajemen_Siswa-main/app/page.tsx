// ============================================
// DASHBOARD PAGE
// Halaman utama dengan statistik & ringkasan
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Task, Schedule } from '@/lib/types';
import { calculateTaskStats, getTodayTasks, getTodaySchedules } from '@/lib/taskHelpers';
import StatCard from '@/components/StatCard';
import TaskItem from '@/components/TaskItem';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data saat pertama kali (ambil dari API / MongoDB)
 // Load data saat pertama kali (ambil dari API / MongoDB)
useEffect(() => {
  let mounted = true;

  async function fetchData() {
    try {
      const [tRes, sRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/schedules'),
      ]);
      
      const [tJson, sJson] = await Promise.all([tRes.json(), sRes.json()]);

      if (!mounted) return;

      // ✅ Ambil array dari .data
      const tasksData = tJson.data || [];
      const schedulesData = sJson.data || [];

      // ✅ Map pakai tasksData (BUKAN tJson!)
      const tasksNormalized: Task[] = tasksData.map((t: any) => ({
        id: t.id ?? t._id ?? String(t._id ?? ''),
        title: t.title,
        subject: t.subject,
        deadline: t.dueDate ? new Date(t.dueDate).toISOString() : t.deadline ?? '',
        priority: t.priority ?? 'Sedang',
        isCompleted: t.isCompleted ?? (t.status === 'completed'),
        createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : (t.createdAt ?? ''),
      }));

      // ✅ Map pakai schedulesData (BUKAN sJson!)
      const schedulesNormalized: Schedule[] = schedulesData.map((s: any) => ({
        id: s.id ?? s._id ?? String(s._id ?? ''),
        day: s.day,
        subject: s.subject,
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room,
      }));

      setTasks(tasksNormalized);
      setSchedules(schedulesNormalized);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
      setTasks([]);
      setSchedules([]);
    } finally {
      if (mounted) setIsLoading(false);
    }
  }

  fetchData();

  return () => { mounted = false; };
}, []);

  // Hitung statistik
  const stats = calculateTaskStats(tasks);
  const todayTasks = getTodayTasks(tasks);
  const todaySchedules = getTodaySchedules(schedules);

  if (isLoading) {
  return <LoadingSpinner message="Sedang muat..." />;
}

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Pagi';
    if (hour < 17) return '☀️ Siang';
    return '🌙 Malam';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <p className="text-white/80 text-lg font-medium mb-2">{getGreeting()}, Pelajar! 👋</p>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            Dashboard Kamu
          </h1>
          <p className="text-white/90 text-lg max-w-lg">
            Kelola tugas & jadwal dengan cara yang lebih keren. Stay on top! 🚀
          </p>
        </div>
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Tasks */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100 dark:border-purple-900/30">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Tugas</p>
          <div className="flex items-end justify-between relative z-10">
            <div>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{stats.total}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Tugas menanti</p>
            </div>
            <span className="text-4xl">📚</span>
          </div>
        </div>

        {/* Completed */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100 dark:border-green-900/30">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Selesai</p>
          <div className="flex items-end justify-between relative z-10">
            <div>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">{stats.completed}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Kerja bagus!</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>

        {/* Pending */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100 dark:border-orange-900/30">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Pending</p>
          <div className="flex items-end justify-between relative z-10">
            <div>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">{stats.pending}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Segera dikerjakan</p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-cyan-100 dark:border-cyan-900/30">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Progress</p>
          <div className="flex items-end justify-between relative z-10">
            <div>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{stats.completionRate}%</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Hampir selesai</p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>
      </div>

      {/* Progress Bar - Modern */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Overall Progress</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">{stats.completionRate}</span>
              <span className="text-lg font-bold text-gray-500">%</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sudah selesai {stats.completed} dari {stats.total} tugas</p>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full transition-all duration-700 shadow-lg"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Grid: Today's Tasks & Schedule - Modern Design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Tasks */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-3 text-3xl">📝</span>
              Tugas Hari Ini
              <span className="ml-auto text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
                {todayTasks.length} tugas
              </span>
            </h2>
            
            <div className="space-y-3">
              {todayTasks.length > 0 ? (
                todayTasks.map(task => (
                  <div 
                    key={task.id}
                    className="group p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-700 dark:to-gray-700 hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 border border-gray-200 dark:border-gray-600 hover:border-purple-300 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.subject}</p>
                      </div>
                      <span className={`ml-2 px-3 py-1 rounded-lg text-xs font-bold ${
                        task.priority === 'Tinggi' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        task.priority === 'Sedang' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🎉</p>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Tidak ada tugas hari ini!
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Nikmati istirahatmu</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-3 text-3xl">📅</span>
              Jadwal Hari Ini
              <span className="ml-auto text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                {todaySchedules.length} jadwal
              </span>
            </h2>
            
            <div className="space-y-3">
              {todaySchedules.length > 0 ? (
                todaySchedules.map(schedule => (
                  <div 
                    key={schedule.id}
                    className="group p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-700 dark:to-gray-700 hover:from-cyan-50 hover:to-blue-50 dark:hover:from-cyan-900/20 dark:hover:to-blue-900/20 border border-gray-200 dark:border-gray-600 hover:border-cyan-300 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {schedule.subject}
                        </p>
                        {schedule.room && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">📍 {schedule.room}</p>
                        )}
                      </div>
                      <div className="ml-3 text-right">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">⏰</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold mt-1">
                          {schedule.startTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">😌</p>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Tidak ada jadwal hari ini
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Hari yang santai</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}