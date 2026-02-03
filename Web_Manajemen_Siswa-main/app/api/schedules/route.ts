// ============================================
// API ROUTE: /api/schedules
// TEMPORARY: Return empty array (no database)
// ============================================

import { NextResponse } from 'next/server';

// GET - Ambil semua schedules
export async function GET() {
  // TEMPORARY: Return data dummy
  return NextResponse.json({
    success: true,
    data: [
      { id: '1', day: 'Senin', subject: 'Matematika', startTime: '07:00', endTime: '09:00', room: 'Kelas 12 RPL' },
      { id: '2', day: 'Senin', subject: 'Bahasa Indonesia', startTime: '09:00', endTime: '11:00', room: 'Kelas 12 RPL' },
      { id: '3', day: 'Selasa', subject: 'Bahasa Inggris', startTime: '07:00', endTime: '09:00', room: 'Kelas 12 RPL' },
      { id: '4', day: 'Rabu', subject: 'Fisika', startTime: '07:00', endTime: '09:00', room: 'Lab IPA' },
    ]
  });
}

// POST - Tambah schedule baru (dummy)
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    data: { id: Date.now().toString(), ...body }
  });
}

// PUT - Update schedule (dummy)
export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    data: body
  });
}

// DELETE - Hapus schedule (dummy)
export async function DELETE(request: Request) {
  return NextResponse.json({
    success: true,
    message: 'Schedule deleted'
  });
}