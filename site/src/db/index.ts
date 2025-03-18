import { Errors, MyError } from "@/constants/errors";
import { STOCKS, STOCKS_COLLECTION } from "./collections";

export class MyDatabase {
    async createStockInDB(args: STOCKS) {
        try {
            await STOCKS_COLLECTION.insertOne(args);
        } catch(err) {
            console.log("Error creating stock", err);
            throw new MyError(Errors.NOT_CREATE_STOCK_DB);
        }
    }
}

const database = new MyDatabase();
export default database;