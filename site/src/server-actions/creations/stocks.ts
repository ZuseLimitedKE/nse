import { Errors, MyError } from "../constants/errors";
import { STOCKS, STOCKS_COLLECTION } from "../db/collections";

export async function createStock(args: STOCKS) {
    try {
        // Create stock in smart contract

        // Create stock in DB
        await createStockInDB(args);
    } catch(err) {
        console.log("Error creating stock", err);
        throw new MyError(Errors.NOT_CREATE_STOCK);
    }
}

async function createStockInDB(args: STOCKS) {
    try {
        await STOCKS_COLLECTION.insertOne(args);
    } catch(err) {
        console.log("Error creating stock", err);
        throw new MyError(Errors.NOT_CREATE_STOCK_DB);
    }
}