import { NextResponse } from "next/server";
import { students } from "../route";

export async function PUT(req, { params }) {
  const { id } = await params;
  const { name, grade } = await req.json();

  const index = students.findIndex((s) => s.id == id);

  if (index === -1) {
    return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });
  }

  students[index] = { ...students[index], name, grade };

  return NextResponse.json(students[index], { status: 200 });
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  const index = students.findIndex((s) => s.id == id);

  if (index === -1) {
    return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });
  }

  students.splice(index, 1);

  return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
}