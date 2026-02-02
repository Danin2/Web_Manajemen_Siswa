// ============================================
// SCHEDULE PAGE
// Halaman untuk menampilkan & kelola jadwal
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Schedule, Day } from '@/lib/types';
import { loadSchedules, saveSchedules } from '@/lib/localStorage';
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

  // Load data
  useEffect(() => {
    const loadedSchedules = loadSchedules();
    setSchedules(loadedSchedules);
    setIsLoading(false);

    // Set selectedDay ke hari ini
    const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    setSelectedDay(today);
  }, []);

  // ========== HANDLER FUNCTIONS ==========

  const handleAddNew = () => {
    setEditingSchedule(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin mau hapus jadwal ini?')) {
      const updatedSchedules = schedules.filter(s => s.id !== id);
      setSchedules(updatedSchedules);
      saveSchedules(updatedSchedules);
    }
  };

  const handleFormSubmit = (scheduleData: Schedule) => {
    if (editingSchedule) {
      // UPDATE
      const updatedSchedules = schedules.map(s => 
        s.id === scheduleData.id ? scheduleData : s
      );
      setSchedules(updatedSchedules);
      saveSchedules(updatedSchedules);
    } else {
      // CREATE
      const updatedSchedules = [...schedules, scheduleData];
      setSchedules(updatedSchedules);
      saveSchedules(updatedSchedules);
    }
    setIsModalOpen(false);
    setEditingSchedule(undefined);
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingSchedule(undefined);
  };

  // ========== FILTER & SORT ==========

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
  return <LoadingSpinner message="Memuat tugas..." />;
}

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            📅 Jadwal Pelajaran
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Atur jadwal pelajaran mingguan kamu
          </p>
        </div>
        <button 
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-md"
          onClick={handleAddNew}
        >
          ➕ Tambah Jadwal
        </button>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              📊 Tampilan Mingguan
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              📋 Tampilan Harian
            </button>
          </div>

          {/* Day Selector (untuk day view) */}
          {viewMode === 'day' && (
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as Day)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      {schedules.length === 0 ? (
        // Empty State
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Belum ada jadwal
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Klik tombol "Tambah Jadwal" untuk membuat jadwal pertama kamu!
          </p>
          <button 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            onClick={handleAddNew}
          >
            ➕ Tambah Jadwal Pertama
          </button>
        </div>
      ) : viewMode === 'week' ? (
        // Week View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {days.map(day => (
            <div key={day} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {day}
              </h3>
              {schedulesByDay[day].length > 0 ? (
                <div className="space-y-3">
                  {schedulesByDay[day].map(schedule => (
                    <div
                      key={schedule.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => handleEdit(schedule)}
                    >
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {schedule.subject}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                      {schedule.room && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          📍 {schedule.room}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Belum ada jadwal
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Day View
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Tidak ada jadwal di hari {selectedDay}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Klik tombol "Tambah Jadwal" untuk membuat jadwal baru!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {schedules.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex flex-wrap gap-6 justify-center text-center">
            <div>
              <p className="text-2xl font-bold text-blue-500">{schedules.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Jadwal</p>
            </div>
            {days.map(day => (
              <div key={day}>
                <p className="text-2xl font-bold text-green-500">
                  {schedulesByDay[day].length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{day}</p>
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