// ============================================
// SCHEDULE PAGE - MODERN UI
// Halaman untuk menampilkan & kelola jadwal
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Schedule, Day } from '@/lib/types';
import ScheduleCard from '@/components/ScheduleCard';
import Modal from '@/components/Modal';
import ScheduleForm from '@/components/ScheduleForm';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // View mode: 'week' atau 'day'
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState<Day>('Senin');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>(undefined);

  const days: Day[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Load data dari API
  useEffect(() => {
    fetchSchedules();
    
    // Set selectedDay ke hari ini
    const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    setSelectedDay(today);
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedules');
      const json = await res.json();
      
      const schedulesNormalized: Schedule[] = (json.data || []).map((s: any) => ({
        id: s.id ?? s._id ?? String(s._id ?? ''),
        day: s.day,
        subject: s.subject,
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room,
      }));
      
      setSchedules(schedulesNormalized);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler Functions
  const handleAddNew = () => {
    setEditingSchedule(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin mau hapus jadwal ini?')) return;

    try {
      await fetch(`/api/schedules?id=${id}`, { method: 'DELETE' });
      setSchedules(schedules.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleFormSubmit = async (scheduleData: Schedule) => {
    try {
      if (editingSchedule) {
        // Update
        await fetch('/api/schedules', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scheduleData),
        });
        setSchedules(schedules.map(s => s.id === scheduleData.id ? scheduleData : s));
      } else {
        // Create
        const res = await fetch('/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scheduleData),
        });
        const json = await res.json();
        setSchedules([...schedules, json.data]);
      }
      
      setIsModalOpen(false);
      setEditingSchedule(undefined);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingSchedule(undefined);
  };

  // Sort by time
  const sortedSchedules = [...schedules].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  // Filter by selected day (untuk day view)
  const todaySchedules = sortedSchedules.filter(s => s.day === selectedDay);

  // Group by day (untuk week view)
  const schedulesByDay: Record<Day, Schedule[]> = {
    Senin: [],
    Selasa: [],
    Rabu: [],
    Kamis: [],
    Jumat: [],
    Sabtu: [],
    Minggu: [],
  };

  sortedSchedules.forEach(s => {
    schedulesByDay[s.day].push(s);
  });

  if (isLoading) {
    return <LoadingSpinner message="Memuat jadwal..." />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 space-y-6">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
              📅 Jadwal Pelajaran
            </h1>
            <p className="text-white/90 text-lg">
              Atur jadwal pelajaran mingguan kamu dengan rapi
            </p>
          </div>
          <button 
            className="group px-8 py-4 bg-white text-cyan-600 rounded-2xl hover:bg-cyan-50 transition-all duration-300 font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
            onClick={handleAddNew}
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">➕</span>
            Tambah Jadwal
          </button>
        </div>
      </div>

      {/* View Mode Toggle - Modern Pills */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* View Mode Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('week')}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 ${
                viewMode === 'week'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-xl">📊</span>
              Tampilan Mingguan
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 ${
                viewMode === 'day'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-xl">📋</span>
              Tampilan Harian
            </button>
          </div>

          {/* Day Selector (untuk day view) */}
          {viewMode === 'day' && (
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as Day)}
              className="px-6 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 font-bold cursor-pointer"
            >
              {days.map(day => (
                <option key={day} value={day}>📅 {day}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      {schedules.length === 0 ? (
        // Empty State - Modern
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-16 text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
          <div className="text-8xl mb-6 animate-bounce">📅</div>
          <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-3">
            Belum ada jadwal
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Klik tombol "Tambah Jadwal" untuk membuat jadwal pertama kamu!
          </p>
          <button 
            className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-black hover:-translate-y-1 flex items-center gap-2 mx-auto"
            onClick={handleAddNew}
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">➕</span>
            Tambah Jadwal Pertama
          </button>
        </div>
      ) : viewMode === 'week' ? (
        // Week View - Modern Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {days.map(day => (
            <div 
              key={day} 
              className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Day Header with Gradient */}
              <div className={`p-4 bg-gradient-to-r ${
                day === 'Senin' ? 'from-red-500 to-pink-500' :
                day === 'Selasa' ? 'from-orange-500 to-yellow-500' :
                day === 'Rabu' ? 'from-green-500 to-emerald-500' :
                day === 'Kamis' ? 'from-cyan-500 to-blue-500' :
                day === 'Jumat' ? 'from-blue-500 to-purple-500' :
                day === 'Sabtu' ? 'from-purple-500 to-pink-500' :
                'from-pink-500 to-rose-500'
              }`}>
                <h3 className="text-xl font-black text-white text-center tracking-tight">
                  {day}
                </h3>
                <p className="text-white/80 text-center text-sm font-medium mt-1">
                  {schedulesByDay[day].length} jadwal
                </p>
              </div>

              {/* Schedule Items */}
              <div className="p-4 space-y-3">
                {schedulesByDay[day].length > 0 ? (
                  schedulesByDay[day].map(schedule => (
                    <div
                      key={schedule.id}
                      className="group p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-cyan-900/20 dark:hover:to-blue-900/20 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-cyan-300"
                      onClick={() => handleEdit(schedule)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                            {schedule.subject}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-1">
                            ⏰ {schedule.startTime} - {schedule.endTime}
                          </p>
                          {schedule.room && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                              📍 {schedule.room}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2">😴</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Tidak ada jadwal
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Day View - Detail Cards
        <div>
          {todaySchedules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todaySchedules.map(schedule => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-16 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
              <div className="text-8xl mb-6">📭</div>
              <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-3">
                Tidak ada jadwal di hari {selectedDay}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Klik tombol "Tambah Jadwal" untuk membuat jadwal baru!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary - Modern Stats */}
      {schedules.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
          <div className="flex flex-wrap gap-8 justify-center text-center">
            <div className="group">
              <p className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {schedules.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Jadwal</p>
            </div>
            {days.map(day => (
              <div key={day} className="group">
                <p className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {schedulesByDay[day].length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">{day}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingSchedule ? '✏️ Edit Jadwal' : '➕ Tambah Jadwal Baru'}
      >
        <ScheduleForm
          schedule={editingSchedule}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>
    </main>
  );
}