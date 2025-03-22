export async function POST(request: Request) {
    const res = await request.json()
    console.log(request);
    return Response.json({ res })
  }