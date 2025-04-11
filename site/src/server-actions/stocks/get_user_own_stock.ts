"use server";

import { Errors, MyError } from "@/constants/errors";
import database from "@/db";
import "../../../envConfig";

export async function getIfUserHasOwnedStock(
  address: string,
  tokenID: string,
): Promise<boolean> {
  try {
    // Get stocks owned by user
    const stocks = await database.getStocksOwnedByUser(address);

    if (!stocks || !stocks.stocks) {
      return false;
    }

    for (const s of stocks.stocks) {
      if (s.tokenId === tokenID) {
        return true;
      }
    }

    return false;
  } catch (err) {
    console.error(err);
    console.log("Error getting if user owned stock");
    throw new MyError(Errors.NOT_GET_USER_OWN_STOCK);
  }
}
