import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

// GET – ambil semua jadwal
export async function GET() {
  try {
    const db = await connectDB();
    const schedules = await db
      .collection('schedules')
      .find({})
      .toArray();

    return NextResponse.json(schedules, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/schedule error:', error.message);
    // Return empty array on auth failure instead of 500
    return NextResponse.json([], { status: 200 });
  }
}

// POST – tambah jadwal
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectDB();

    const result = await db.collection('schedules').insertOne(body);

    return NextResponse.json({ message: 'Schedule added', insertedId: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/schedule error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create schedule' },
      { status: 500 }
    );
  }
}

// PUT – edit jadwal
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const db = await connectDB();

    const result = await db.collection('schedules').updateOne(
      { id: body.id },
      { $set: body }
    );

    return NextResponse.json({ message: 'Schedule updated', modifiedCount: result.modifiedCount }, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/schedule error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE – hapus jadwal
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const db = await connectDB();

    const result = await db.collection('schedules').deleteOne({ id });

    return NextResponse.json({ message: 'Schedule deleted', deletedCount: result.deletedCount }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/schedule error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
