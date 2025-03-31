export async function GET(request: Request) {
  console.log(request, "GET request");
  return Response.json({ message: "Okay" }, { status: 200 });
}

export async function POST(request: Request) {
  console.log(request, "POST request");
  console.log(request.body);
  console.log(await request.json())
  console.log("Anthony sucks")
  return Response.json({ message: "Okay" }, { status: 200 });
}