// ============================================
// SCHEDULE FORM COMPONENT
// Form untuk tambah/edit jadwal
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Schedule, Day, Subject } from '@/lib/types';
import { generateId } from '@/lib/localStorage';

interface ScheduleFormProps {
  schedule?: Schedule;
  onSubmit: (schedule: Schedule) => void;
  onCancel: () => void;
}

export default function ScheduleForm({ schedule, onSubmit, onCancel }: ScheduleFormProps) {
  const [day, setDay] = useState<Day>('Senin');
  const [subject, setSubject] = useState<string>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');

  // Daftar hari
  const days: Day[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Daftar mata pelajaran (sama dengan Task)
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
    if (schedule) {
      setDay(schedule.day);
      setSubject(schedule.subject);
      setStartTime(schedule.startTime);
      setEndTime(schedule.endTime);
      setRoom(schedule.room || '');
    }
  }, [schedule]);

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!subject) {
      alert('Pilih mata pelajaran!');
      return;
    }
    if (!startTime || !endTime) {
      alert('Isi waktu mulai dan selesai!');
      return;
    }
    if (startTime >= endTime) {
      alert('Waktu selesai harus lebih dari waktu mulai!');
      return;
    }

    // Buat object schedule
    const scheduleData: Schedule = {
      id: schedule?.id || generateId('schedule'),
      day,
      subject,
      startTime,
      endTime,
      room: room.trim() || undefined,  // Kalau kosong, jadi undefined
    };

    onSubmit(scheduleData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Hari */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hari <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {days.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              className={`
                px-3 py-2 rounded-lg font-medium transition-colors text-sm
                ${day === d
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              {d}
            </button>
          ))}
        </div>
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

      {/* Waktu Mulai & Selesai */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Waktu Mulai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Waktu Selesai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Ruangan (Opsional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ruangan (Opsional)
        </label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Contoh: Lab Komputer 1"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
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
          {schedule ? '💾 Simpan Perubahan' : '➕ Tambah Jadwal'}
        </button>
      </div>
    </form>
  );
}