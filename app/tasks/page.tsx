// ============================================
// TASKS PAGE (UPDATED dengan Sort & Quick Filter)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Task, SortOption, QuickFilter } from '@/lib/types';  // 👈 Import types baru
import { loadTasks, saveTasks } from '@/lib/localStorage';
import { sortTasks, applyQuickFilter } from '@/lib/sortHelpers';  // 👈 Import helpers
import TaskCard from '@/components/TaskCard';
import Modal from '@/components/Modal';
import TaskForm from '@/components/TaskForm';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');  // 👈 BARU
  
  // Sort & Quick Filter States (BARU!)
  const [sortBy, setSortBy] = useState<SortOption>('deadline-asc');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Load data dari LocalStorage
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  // ========== HANDLER FUNCTIONS (Tetap sama) ==========

  const handleToggleComplete = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin mau hapus tugas ini?')) {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    }
  };

  const handleAddNew = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (taskData: Task) => {
    if (editingTask) {
      const updatedTasks = tasks.map(task => 
        task.id === taskData.id ? taskData : task
      );
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    } else {
      const updatedTasks = [...tasks, taskData];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    }
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  // ========== FILTER & SORT LOGIC (UPDATED!) ==========

  // Step 1: Apply Quick Filter
  let processedTasks = applyQuickFilter(tasks, quickFilter);

  // Step 2: Apply Regular Filters
  processedTasks = processedTasks.filter(task => {
    // Filter by status
    if (filterStatus === 'completed' && !task.isCompleted) return false;
    if (filterStatus === 'pending' && task.isCompleted) return false;

    // Filter by subject
    if (filterSubject !== 'all' && task.subject !== filterSubject) return false;

    // Filter by priority (BARU!)
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Step 3: Apply Sorting
  const filteredTasks = sortTasks(processedTasks, sortBy);

  // Get unique subjects untuk dropdown
  const subjects = ['all', ...Array.from(new Set(tasks.map(t => t.subject)))];

  if (isLoading) {
  return <LoadingSpinner message="Memuat tugas..." />;
}

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            📝 Daftar Tugas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola semua tugas kamu di sini
          </p>
        </div>
        <button 
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-md"
          onClick={handleAddNew}
        >
          ➕ Tambah Tugas
        </button>
      </div>

      {/* Quick Filters (BARU!) */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: '📋 Semua', color: 'blue' },
          { value: 'today', label: '📅 Hari Ini', color: 'green' },
          { value: 'week', label: '🗓️ Minggu Ini', color: 'purple' },
          { value: 'overdue', label: '⚠️ Terlambat', color: 'red' },
        ].map(qf => (
          <button
            key={qf.value}
            onClick={() => setQuickFilter(qf.value as QuickFilter)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${quickFilter === qf.value
                ? `bg-${qf.color}-500 text-white`
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }
            `}
          >
            {qf.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar (UPDATED!) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Cari tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Belum Selesai</option>
            <option value="completed">Sudah Selesai</option>
          </select>

          {/* Filter Subject */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Mata Pelajaran</option>
            {subjects.slice(1).map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          {/* Filter Priority (BARU!) */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Prioritas</option>
            <option value="Tinggi">🔴 Tinggi</option>
            <option value="Sedang">🟡 Sedang</option>
            <option value="Rendah">🟢 Rendah</option>
          </select>
        </div>

        {/* Sort Options (BARU!) */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🔀 Urutkan Berdasarkan:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="deadline-asc">⏰ Deadline Terdekat</option>
            <option value="deadline-desc">⏰ Deadline Terjauh</option>
            <option value="priority-high">🔴 Prioritas Tinggi Dulu</option>
            <option value="priority-low">🟢 Prioritas Rendah Dulu</option>
            <option value="title-asc">🔤 Nama A → Z</option>
            <option value="title-desc">🔤 Nama Z → A</option>
            <option value="created-new">📅 Terbaru Dulu</option>
            <option value="created-old">📅 Terlama Dulu</option>
          </select>
        </div>

        {/* Active Filters Info */}
        {(searchQuery || filterStatus !== 'all' || filterSubject !== 'all' || filterPriority !== 'all' || quickFilter !== 'all') && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {filteredTasks.length} dari {tasks.length} tugas
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterSubject('all');
                setFilterPriority('all');
                setQuickFilter('all');
                setSortBy('deadline-asc');
              }}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              🔄 Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Tasks Grid (Tetap sama) */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {tasks.length === 0 
              ? 'Belum ada tugas' 
              : 'Tidak ada tugas yang sesuai filter'
            }
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {tasks.length === 0
              ? 'Klik tombol "Tambah Tugas" untuk membuat tugas pertama kamu!'
              : 'Coba ubah filter atau kata kunci pencarian'
            }
          </p>
          {tasks.length === 0 && (
            <button 
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              onClick={handleAddNew}
            >
              ➕ Tambah Tugas Pertama
            </button>
          )}
        </div>
      )}

      {/* Summary Footer (Tetap sama) */}
      {tasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex flex-wrap gap-6 justify-center text-center">
            <div>
              <p className="text-2xl font-bold text-blue-500">{tasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tugas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {tasks.filter(t => t.isCompleted).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Selesai</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">
                {tasks.filter(t => !t.isCompleted).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Belum Selesai</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingTask ? '✏️ Edit Tugas' : '➕ Tambah Tugas Baru'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>
    </main>
  );
}