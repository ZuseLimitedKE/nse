import { Success } from "@/constants/success";
import { tokenizeStockSchema } from "@/constants/types";
import smartContract from "@/contract";
import database from "@/db";
import { createStock } from "@/server-actions/creations/stocks";

export async function POST(request: Request) {
  const res = await request.json();
  const parsed = tokenizeStockSchema.safeParse(res);
  if (parsed.success) {
    await createStock(parsed.data, database, smartContract);
    return Response.json({ message: Success.STOCK_TOKENIZED });
  } else {
    const errors = parsed.error.issues.map((i) => i.message);
    return Response.json({ error: [errors] }, { status: 400 });
  }
}
