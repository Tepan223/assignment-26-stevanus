import { NextResponse } from "next/server";

export let students = [
  { id: 1, name: "Lionel Liauw", grade: "12 RPL" },
  { id: 2, name: "Budi Santoso", grade: "11 TKJ" },
];

export async function GET() {
  return NextResponse.json(students);
}

export async function POST(req) {
  const body = await req.json();

  const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1;
  
  const newStudent = { 
    id: newId, 
    name: body.name, 
    grade: body.grade 
  };

  students.push(newStudent);

  return NextResponse.json(newStudent, { status: 201 });
}