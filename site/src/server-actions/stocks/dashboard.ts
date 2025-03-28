"use server"

import { Errors, MyError } from "@/constants/errors";
import database from "@/db";

export async function getTotalPortfolioValue(user_address: string): Promise<number> {
    try {
        // Get prices of all stocks
        const priceStocks = await database.getStockPricesFromDB();

        // Get stocks of a user
        const userStocks = await database.getStocksOwnedByUser(user_address);

        // Multiply and sum price
        let value = 0;
        if (userStocks) {
            for (let s of userStocks.stocks) {
                for (let price of priceStocks) {
                    if (s.symbol === price.symbol) {
                        value += (s.number_stocks * price.price);
                    }
                }
            }
        }

        return value;
    } catch(err) {
        console.log("Error getting total portfolio value", err);
        if (err instanceof MyError) {
            throw err;
        }
        throw new MyError(Errors.UNKNOWN);
    }
}