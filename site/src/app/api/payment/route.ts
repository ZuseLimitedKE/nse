// import markRequestAsPaid from "@/server-actions/mpesa/markPaid";

export async function POST(request: Request) {
  try {
    // Getting event
    const event = await request.json();
    console.log(event);
  } catch(err) {
    console.log(err);
  } finally {
    return Response.json({ message: "Okay" }, { status: 200 });
  }
}