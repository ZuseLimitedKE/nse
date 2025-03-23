"use server"
import { Errors, MyError } from "@/constants/errors";
import { StoreStockPurchase } from "@/constants/types";
import database from "@/db";

export async function store_stock_purchase(args: StoreStockPurchase) {
    try {
        // Store in db
        await database.storeStockPurchase(args);
    } catch(err) {
        console.log("Error storing stock purchase", err);
        throw new MyError(Errors.NOT_STORE_STOCK_PURCHASE);
    }
}