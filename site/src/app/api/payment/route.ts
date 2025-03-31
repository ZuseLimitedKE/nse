import markRequestAsPaid from "@/server-actions/mpesa/markPaid";

export async function POST(request: Request) {
  // Check if the payment was succesful
  const data = await request.json();
  if (!data.Body.stkCallback.CallbackMetadata) {
    // Not succesful
    console.log("Payment request was not succesful");
    return Response.json({ message: "Okay" }, { status: 200 });
  }

  // Succesful response
  const mpesa_id = data.Body.stkCallback.MerchantRequestID;
  if (mpesa_id) {
    try {
      await markRequestAsPaid(mpesa_id);
    } catch(err) {
      console.log("Error marking payment as paid", err);
    }
  }

  return Response.json({ message: "Okay" }, { status: 200 });
}