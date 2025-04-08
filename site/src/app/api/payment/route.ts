import { createHmac } from "crypto";
import "../../../../envConfig";
import database from "@/db";
import { PaymentStatus } from "@/constants/status";

export async function POST(request: Request) {
  try {
    // validate event
    const event = await request.json();
    const hash = createHmac('sha512', process.env.PAYSTACK_SECRET).update(JSON.stringify(event)).digest('hex');
    if (hash === request.headers.get('x-paystack-signature')) {
      if (event?.event === "charge.success") {
        if (event?.data?.reference) {
          console.log("Event", event);
          const reference: string = event?.data?.reference;
          console.log("Reference", reference);

          // Mark payment request as paid
          await database.updateStockPurchaseStatus(reference, PaymentStatus.PAID);
        }
      } else {
        console.log("Not handled", event);
      }
    } else {
      // invalid
      console.log("invalid event", request);
    }
  } catch (err) {
    console.log(err);
  } finally {
    return Response.json({ message: "Okay" }, { status: 200 });
  }
}