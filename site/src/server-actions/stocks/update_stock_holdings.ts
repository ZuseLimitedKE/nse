"use server"

import {UpdateUserStockHoldings} from "@/constants/types";
import database from "@/db";

export default async function updateUserStockHoldings(args: UpdateUserStockHoldings) {
    try {
        // Update in db
        await database.updateNumberStocksOwnedByUser(args);
    } catch(err) {
        throw err;
    }
}