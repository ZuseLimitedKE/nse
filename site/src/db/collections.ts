import client from "./connection";

const dbName = "orion";
const stocksCollection = "stocks";
const database = client.db(dbName);

// Types
export interface STOCKS {
    symbol: string,
    name: string,
    todayPrice: number,
    tokenAddress: string,
    stockID: string | undefined
}

// Collections
export const STOCKS_COLLECTION = database.collection<STOCKS>(stocksCollection);