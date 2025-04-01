"use server"

import { Errors, MyError } from "@/constants/errors";
import database from "@/db"
import "../../../envConfig";

export async function getIfUserHasOwnedStock(address: string, symbol: string): Promise<boolean> {
    try {
        return false;
        // Get stocks owned by user
        const stocks = await database.getStocksOwnedByUser(address);

        if (!stocks || !stocks.stocks) {
            return false;
        }

        for (let s of stocks.stocks) {
            if (s.symbol === symbol) {
                return true;
            }
        }

        return false;
    } catch(err) {
        console.log("Error getting if user owned stock");
        throw new MyError(Errors.NOT_GET_USER_OWN_STOCK);
    }
}