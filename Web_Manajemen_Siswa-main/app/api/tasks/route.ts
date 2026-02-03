// ============================================
// API ROUTE: /api/tasks
// TEMPORARY: Return empty array (no database)
// ============================================

import { NextResponse } from 'next/server';

// GET - Ambil semua tasks
export async function GET() {
  // TEMPORARY: Return data dummy
  return NextResponse.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'Mengerjakan Soal Matematika',
        subject: 'Matematika',
        deadline: new Date().toISOString(),
        priority: 'Tinggi',
        isCompleted: false,
        createdAt: '2026-01-28'
      },
      {
        id: '2',
        title: 'Membaca Materi Sejarah',
        subject: 'Sejarah',
        deadline: new Date().toISOString(),
        priority: 'Sedang',
        isCompleted: true,
        createdAt: '2026-01-29'
      }
    ]
  });
}

// POST - Tambah task baru (dummy)
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    data: { id: Date.now().toString(), ...body }
  });
}

// PUT - Update task (dummy)
export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    data: body
  });
}

// DELETE - Hapus task (dummy)
export async function DELETE(request: Request) {
  return NextResponse.json({
    success: true,
    message: 'Task deleted'
  });
}