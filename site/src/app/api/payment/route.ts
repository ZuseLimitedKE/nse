// import markRequestAsPaid from "@/server-actions/mpesa/markPaid";

export async function POST(request: Request) {
  try {
    // Getting event
    const event = await request.json();

    if (event?.event?.data?.) {
    }
  } catch(err) {

  } finally {
    return Response.json({ message: "Okay" }, { status: 200 });
  }
}