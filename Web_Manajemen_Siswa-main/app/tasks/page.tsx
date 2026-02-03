// ============================================
// TASKS PAGE - MODERN UI
// Halaman untuk menampilkan & kelola semua tugas
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
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
  const [filterPriority, setFilterPriority] = useState<string>('all');
  
  // Quick Filter States
  const [quickFilter, setQuickFilter] = useState<'all' | 'today' | 'week' | 'overdue'>('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Load data dari API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const json = await res.json();
      
      const tasksNormalized: Task[] = (json.data || []).map((t: any) => ({
        id: t.id ?? t._id ?? String(t._id ?? ''),
        title: t.title,
        subject: t.subject,
        deadline: t.deadline,
        priority: t.priority ?? 'Sedang',
        isCompleted: t.isCompleted ?? false,
        createdAt: t.createdAt ?? '',
      }));
      
      setTasks(tasksNormalized);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler Functions
  const handleToggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !task.isCompleted }),
      });
      
      const updatedTasks = tasks.map(t => 
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin mau hapus tugas ini?')) return;

    try {
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
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

  const handleFormSubmit = async (taskData: Task) => {
    try {
      if (editingTask) {
        // Update
        await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
      } else {
        // Create
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        const json = await res.json();
        setTasks([...tasks, json.data]);
      }
      
      setIsModalOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  // Filter & Sort Logic
  const applyQuickFilter = (tasksArray: Task[]) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

    switch (quickFilter) {
      case 'today':
        return tasksArray.filter(t => {
          const taskDate = t.deadline.split('T')[0];
          return taskDate === today && !t.isCompleted;
        });
      case 'week':
        return tasksArray.filter(t => {
          const taskDate = t.deadline.split('T')[0];
          return taskDate >= today && taskDate <= endOfWeekStr && !t.isCompleted;
        });
      case 'overdue':
        return tasksArray.filter(t => {
          const taskDeadline = new Date(t.deadline);
          return taskDeadline < now && !t.isCompleted;
        });
      default:
        return tasksArray;
    }
  };

  let processedTasks = applyQuickFilter(tasks);

  processedTasks = processedTasks.filter(task => {
    if (filterStatus === 'completed' && !task.isCompleted) return false;
    if (filterStatus === 'pending' && task.isCompleted) return false;
    if (filterSubject !== 'all' && task.subject !== filterSubject) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const subjects = ['all', ...Array.from(new Set(tasks.map(t => t.subject)))];

  if (isLoading) {
    return <LoadingSpinner message="Memuat tugas..." />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 space-y-6">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
              📝 Daftar Tugas
            </h1>
            <p className="text-white/90 text-lg">
              Kelola semua tugas kamu di sini dengan mudah
            </p>
          </div>
          <button 
            className="group px-8 py-4 bg-white text-purple-600 rounded-2xl hover:bg-purple-50 transition-all duration-300 font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
            onClick={handleAddNew}
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">➕</span>
            Tambah Tugas
          </button>
        </div>
      </div>

      {/* Quick Filters - Modern Pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { value: 'all', label: '📋 Semua', gradient: 'from-blue-500 to-cyan-500' },
          { value: 'today', label: '📅 Hari Ini', gradient: 'from-green-500 to-emerald-500' },
          { value: 'week', label: '🗓️ Minggu Ini', gradient: 'from-purple-500 to-pink-500' },
          { value: 'overdue', label: '⚠️ Terlambat', gradient: 'from-red-500 to-orange-500' },
        ].map(qf => (
          <button
            key={qf.value}
            onClick={() => setQuickFilter(qf.value as any)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 ${
              quickFilter === qf.value
                ? `bg-gradient-to-r ${qf.gradient} text-white shadow-lg`
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {qf.label}
          </button>
        ))}
      </div>

      {/* Search & Filter - Modern Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-xl group-focus-within:scale-110 transition-transform">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Cari tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 font-medium"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 font-medium cursor-pointer"
          >
            <option value="all">📊 Semua Status</option>
            <option value="pending">⏳ Belum Selesai</option>
            <option value="completed">✅ Sudah Selesai</option>
          </select>

          {/* Filter Subject */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 font-medium cursor-pointer"
          >
            <option value="all">📚 Semua Mata Pelajaran</option>
            {subjects.slice(1).map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          {/* Filter Priority */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 font-medium cursor-pointer"
          >
            <option value="all">⭐ Semua Prioritas</option>
            <option value="Tinggi">🔴 Tinggi</option>
            <option value="Sedang">🟡 Sedang</option>
            <option value="Rendah">🟢 Rendah</option>
          </select>
        </div>

        {/* Active Filters Info */}
        {(searchQuery || filterStatus !== 'all' || filterSubject !== 'all' || filterPriority !== 'all' || quickFilter !== 'all') && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Menampilkan <span className="font-bold text-purple-600 dark:text-purple-400">{processedTasks.length}</span> dari <span className="font-bold">{tasks.length}</span> tugas
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterSubject('all');
                setFilterPriority('all');
                setQuickFilter('all');
              }}
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>🔄</span> Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Tasks Grid */}
      {processedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedTasks.map(task => (
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
        // Empty State - Modern
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-16 text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
          <div className="text-8xl mb-6 animate-bounce">📭</div>
          <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-3">
            {tasks.length === 0 
              ? 'Belum ada tugas' 
              : 'Tidak ada tugas yang sesuai filter'
            }
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            {tasks.length === 0
              ? 'Klik tombol "Tambah Tugas" untuk membuat tugas pertama kamu!'
              : 'Coba ubah filter atau kata kunci pencarian'
            }
          </p>
          {tasks.length === 0 && (
            <button 
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-black hover:-translate-y-1 flex items-center gap-2 mx-auto"
              onClick={handleAddNew}
            >
              <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">➕</span>
              Tambah Tugas Pertama
            </button>
          )}
        </div>
      )}

      {/* Summary Footer - Modern Stats */}
      {tasks.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>
          <div className="flex flex-wrap gap-8 justify-center text-center">
            <div className="group">
              <p className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{tasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Tugas</p>
            </div>
            <div className="group">
              <p className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {tasks.filter(t => t.isCompleted).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Selesai</p>
            </div>
            <div className="group">
              <p className="text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                {tasks.filter(t => !t.isCompleted).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Belum Selesai</p>
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