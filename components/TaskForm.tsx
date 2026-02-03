// ============================================
// TASK FORM COMPONENT
// Form untuk tambah/edit tugas
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Task, Subject } from '@/lib/types';
import { generateId } from '@/lib/localStorage';

interface TaskFormProps {
  task?: Task;                              // Task yang mau diedit (opsional)
  onSubmit: (task: Task) => void;          // Callback saat submit
  onCancel: () => void;                     // Callback saat cancel
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<string>('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');

  // Daftar mata pelajaran (sesuai dengan types.ts)
  const subjects: Subject[] = [
    "Matematika",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Fisika",
    "Kimia",
    "Biologi",
    "Sejarah",
    "Geografi",
    "Ekonomi",
    "PKL",
    "PPKN",
    "Penjaskes",
    "Seni Budaya",
    "Produktif TKJ",
    "Produktif RPL",
    "Lainnya"
  ];

  // Load data saat edit mode
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setSubject(task.subject);
      // Format deadline untuk input datetime-local
      const formattedDeadline = new Date(task.deadline).toISOString().slice(0, 16);
      setDeadline(formattedDeadline);
      setPriority(task.priority);
    }
  }, [task]);

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Prevent reload halaman

    // Validasi
    if (!title.trim()) {
      alert('Nama tugas tidak boleh kosong!');
      return;
    }
    if (!subject) {
      alert('Pilih mata pelajaran!');
      return;
    }
    if (!deadline) {
      alert('Pilih deadline!');
      return;
    }

    // Buat object task
    const taskData: Task = {
      id: task?.id || generateId('task'),         // Pakai ID lama atau generate baru
      title: title.trim(),
      subject,
      deadline: new Date(deadline).toISOString(), // Convert ke ISO string
      priority,
      isCompleted: task?.isCompleted || false,    // Tetap pakai status lama atau false
      createdAt: task?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Nama Tugas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nama Tugas <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Bikin Laporan PKL"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
      </div>

      {/* Mata Pelajaran */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mata Pelajaran <span className="text-red-500">*</span>
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Pilih Mata Pelajaran --</option>
          {subjects.map(subj => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Deadline <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Format: Tanggal dan Jam
        </p>
      </div>

      {/* Prioritas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Prioritas
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['Rendah', 'Sedang', 'Tinggi'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${priority === p
                  ? p === 'Tinggi' 
                    ? 'bg-red-500 text-white'
                    : p === 'Sedang'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              {p === 'Tinggi' && '🔴'} 
              {p === 'Sedang' && '🟡'} 
              {p === 'Rendah' && '🟢'}
              {' '}{p}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          {task ? '💾 Simpan Perubahan' : '➕ Tambah Tugas'}
        </button>
      </div>
    </form>
  );
}