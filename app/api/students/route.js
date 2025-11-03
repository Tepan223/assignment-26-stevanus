let students = [
  { id: 1, name: "Stevanus", grade: "11 RPL" },
  { id: 2, name: "Pipin", grade: "11 RPL" },
];

export async function GET() {
  return new Response(JSON.stringify(students), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();

  const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1;
  const newStudent = { id: newId, ...body };

  students.push(newStudent);

  return new Response(JSON.stringify(newStudent), { status: 201 });
}
