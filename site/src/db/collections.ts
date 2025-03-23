import client from "./connection";

const dbName = "orion";
const stocksCollection = "stocks";
const stockPricesCollection = "stockPrices";
const database = client.db(dbName);

// Types
export interface STOCKS {
  symbol: string;
  name: string;
  todayPrice: number;
  tokenAddress: string;
  stockID?: string;
}

export interface STOCKPRICES {
  symbol: string,
  price: number,
  change: number
}

// Collections
export const STOCKS_COLLECTION = database.collection<STOCKS>(stocksCollection);
export const STOCK_PRICES_COLLECTIONS = database.collection<STOCKPRICES>(stockPricesCollection);
