"use server"
import { Errors, MyError } from "@/constants/errors";
import { StoreStockPurchase } from "@/constants/types";

export async function store_stock_purchase(args: StoreStockPurchase) {
    try {
        // Store in db
    } catch(err) {
        console.log("Error storing stock purchase", err);
        throw new MyError(Errors.NOT_STORE_STOCK_PURCHASE);
    }
}