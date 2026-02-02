"use client";

import { useEffect, useState } from "react";
import { Schedule } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ScheduleCard from '@/components/ScheduleCard';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/schedule');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      // Normalize: ensure each item has `id` field (fallback to _id)
      const normalized: Schedule[] = data.map((s: any) => ({
        id: s.id ?? s._id ?? String(s._id),
        day: s.day,
        subject: s.subject,
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room,
        _id: s._id,
      }));
      setSchedules(normalized);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil jadwal');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
    try {
      const res = await fetch('/api/schedule', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Gagal hapus jadwal');
      await fetchSchedules();
    } catch (err: any) {
      alert(err.message || 'Error saat menghapus');
    }
  };

  const handleEdit = (schedule: Schedule) => {
    alert('Edit jadwal lewat MongoDB Compass atau fitur edit belum diimplementasi.');
  };

  if (isLoading) return <LoadingSpinner message="Memuat jadwal..." />;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  const daysOrder = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
  const grouped: Record<string, Schedule[]> = {};
  daysOrder.forEach(d => (grouped[d] = []));
  schedules.forEach(s => {
    const day = s.day ?? 'Lainnya';
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(s);
  });

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📅 Jadwal Pelajaran</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Ringkasan jadwal kelas — data diambil dari MongoDB.</p>
        </div>
      </div>

      <div className="space-y-8">
        {daysOrder.map(day => (
          <section key={day}>
            <h2 className="text-xl font-semibold mb-4">{day}</h2>
            {grouped[day].length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center text-gray-500">Tidak ada jadwal</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[day].map(s => (
                  <ScheduleCard key={s.id} schedule={s} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
