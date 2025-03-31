export async function GET(request: Request) {
  console.log(request, "GET request");
  return Response.json({ message: "Okay" }, { status: 200 });
}

export async function POST(request: Request) {
  console.log(request, "POST request");
  return Response.json({ message: "Okay" }, { status: 200 });
}