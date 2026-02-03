import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET → ambil semua task
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("task_schedule_app");

    const tasks = await db
      .collection("tasks")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/tasks error:', error.message);
    // Return empty array on auth failure instead of 500
    return NextResponse.json([], { status: 200 });
  }
}

// POST → tambah task baru
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("task_schedule_app");

    const newTask = {
      title: body.title,
      description: body.description,
      status: "pending",
      dueDate: new Date(body.dueDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("tasks").insertOne(newTask);

    return NextResponse.json({
      _id: result.insertedId,
      ...newTask,
    }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create task' },
      { status: 500 }
    );
  }
}
