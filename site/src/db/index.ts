import { Errors, MyError } from "@/constants/errors";
import { STOCKS, STOCKS_COLLECTION } from "./collections";

interface GetStocks {
    id: string,
    name: string, 
    symbol: string
}

export class MyDatabase {
    async createStockInDB(args: STOCKS) {
        try {
            await STOCKS_COLLECTION.insertOne(args);
        } catch(err) {
            console.log("Error creating stock", err);
            throw new MyError(Errors.NOT_CREATE_STOCK_DB);
        }
    }

    async getStocks(): Promise<GetStocks[]>{
        try {
            let stocks: GetStocks[] = [];
            const cursor = STOCKS_COLLECTION.find({}, {projection: {id: 1, name: 1, symbol: 1}});
            for await (const doc of cursor) {
                stocks.push({id: doc._id.toString(), name: doc.name, symbol: doc.symbol});
            }
            return stocks;
        } catch(err) {
            console.log("Error getting stocks from DB", err);
            throw new MyError(Errors.NOT_GET_STOCKS_DB)
        }
    }
}

const database = new MyDatabase();
export default database;