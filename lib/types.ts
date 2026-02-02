// ============================================
// TYPE DEFINITIONS
// File ini berisi semua struktur data aplikasi
// ============================================

// 1️⃣ TASK INTERFACE (Struktur Data Tugas)
export interface Task {
  id: string;                    // ID unik tugas (misal: "task_1")
  title: string;                 // Nama tugas (misal: "Bikin Laporan PKL")
  subject: string;               // Mata pelajaran (misal: "PKL")
  deadline: string;              // Tanggal deadline (format: "2026-02-10")
  priority: "Rendah" | "Sedang" | "Tinggi";  // Prioritas (hanya 3 pilihan ini)
  isCompleted: boolean;          // Status selesai (true/false)
  createdAt: string;             // Tanggal dibuat (format: "2026-02-01")
}

// 2️⃣ SCHEDULE INTERFACE (Struktur Data Jadwal)
export interface Schedule {
  id: string;                    // ID unik jadwal
  day: Day;                      // Hari (Senin - Minggu)
  subject: string;               // Mata pelajaran
  startTime: string;             // Jam mulai (format: "07:00")
  endTime: string;               // Jam selesai (format: "09:00")
  room?: string;                 // Ruangan (opsional, tanda "?" artinya boleh kosong)
}

// 3️⃣ DAY TYPE (Tipe Data Hari)
export type Day = 
  | "Senin" 
  | "Selasa" 
  | "Rabu" 
  | "Kamis" 
  | "Jumat" 
  | "Sabtu" 
  | "Minggu";

// 4️⃣ SUBJECT TYPE (Daftar Mata Pelajaran)
export type Subject = 
  | "Matematika"
  | "Bahasa Indonesia"
  | "Bahasa Inggris"
  | "Fisika"
  | "Kimia"
  | "Biologi"
  | "Sejarah"
  | "Geografi"
  | "Ekonomi"
  | "PKL"
  | "PPKN"
  | "Penjaskes"
  | "Seni Budaya"
  | "Produktif TKJ"
  | "Produktif RPL"
  | "Lainnya";

// 5️⃣ STATS INTERFACE (Struktur Data Statistik Dashboard)
export interface TaskStats {
  total: number;                 // Total semua tugas
  completed: number;             // Tugas yang sudah selesai
  pending: number;               // Tugas yang belum selesai
  todayTasks: number;            // Tugas hari ini
  completionRate: number;        // Persentase selesai (0-100)
}

// 6️⃣ FILTER OPTIONS (Opsi untuk Filter Tugas)
export interface FilterOptions {
  subject?: string;              // Filter by mata pelajaran
  priority?: "Rendah" | "Sedang" | "Tinggi";  // Filter by prioritas
  status?: "all" | "completed" | "pending";   // Filter by status
  searchQuery?: string;          // Keyword pencarian
}

// 7️⃣ SORT OPTIONS (Opsi untuk Sorting Tugas)
export type SortOption = 
  | 'deadline-asc'      // Deadline terdekat dulu
  | 'deadline-desc'     // Deadline terjauh dulu
  | 'priority-high'     // Prioritas tinggi dulu
  | 'priority-low'      // Prioritas rendah dulu
  | 'title-asc'         // Nama A-Z
  | 'title-desc'        // Nama Z-A
  | 'created-new'       // Terbaru dulu
  | 'created-old';      // Terlama dulu

// 8️⃣ QUICK FILTER OPTIONS (Filter Cepat)
export type QuickFilter = 'all' | 'today' | 'week' | 'overdue';