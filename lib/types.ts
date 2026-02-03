// ============================================
// TYPE DEFINITIONS
// Semua struktur data aplikasi
// ============================================

/* =======================
   1️⃣ DAY TYPE
======================= */
export type Day =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat"
  | "Sabtu"
  | "Minggu";

/* =======================
   2️⃣ SUBJECT TYPE
======================= */
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

/* =======================
   3️⃣ TASK INTERFACE
======================= */
export interface Task {
  _id?: string;              // ID MongoDB (auto)
  id: string;                // ID custom (uuid / nanoid)
  title: string;
  subject: Subject;
  deadline: string;          // YYYY-MM-DD
  priority: "Rendah" | "Sedang" | "Tinggi";
  isCompleted: boolean;
  createdAt: string;         // ISO Date string
}

/* =======================
   4️⃣ SCHEDULE INTERFACE
======================= */
export interface Schedule {
  _id?: string;              // ID MongoDB
  id: string;                // ID custom
  day: Day;
  subject: Subject;
  startTime: string;         // HH:mm
  endTime: string;           // HH:mm
  room?: string;
}

/* =======================
   5️⃣ TASK STATS
======================= */
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  todayTasks: number;
  completionRate: number;    // 0 - 100
}

/* =======================
   6️⃣ FILTER OPTIONS
======================= */
export interface FilterOptions {
  subject?: Subject;
  priority?: "Rendah" | "Sedang" | "Tinggi";
  status?: "all" | "completed" | "pending";
  searchQuery?: string;
}

/* =======================
   7️⃣ SORT OPTIONS
======================= */
export type SortOption =
  | "deadline-asc"
  | "deadline-desc"
  | "priority-high"
  | "priority-low"
  | "title-asc"
  | "title-desc"
  | "created-new"
  | "created-old";

/* =======================
   8️⃣ QUICK FILTER
======================= */
export type QuickFilter =
  | "all"
  | "today"
  | "week"
  | "overdue";
