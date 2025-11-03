
import { NextResponse } from "next/server";
import studentsData from "../route";

let students = studentsData.students || [];

export async function PUT(req, { params }) {
  const { id } = params;
  const { name, grade } = await req.json();

  const index = students.findIndex((s) => s.id == id);
  if (index === -1) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

  students[index] = { ...students[index], name, grade };
  return NextResponse.json(students[index], { status: 200 });
}

export async function DELETE(req, { params }) {
  const { id } = params;
  students = students.filter((s) => s.id != id);

  return NextResponse.json({ message: "Deleted successfully" });
}
