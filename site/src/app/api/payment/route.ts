export async function GET(request: Request) {
  console.log(request);
  return Response.json({ message: "Okay" }, { status: 200 });
}