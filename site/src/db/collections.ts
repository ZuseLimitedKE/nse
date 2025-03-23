import client from "./connection";

const dbName = "orion";
const stocksCollection = "stocks";
const stockPricesCollection = "stockPrices";
const stockPurchases = "stockPurchases";
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

export interface STOCKPURCHASES {
  mpesa_request_id?: string,
  txHash?: string,
  user_wallet: string,
  stock_symbol: string,
  name: string,
  amount_shares: number,
  buy_price: number,
  purchase_date: Date,
  status: string
}

// Collections
export const STOCKS_COLLECTION = database.collection<STOCKS>(stocksCollection);
export const STOCK_PRICES_COLLECTIONS = database.collection<STOCKPRICES>(stockPricesCollection);
export const STOCK_PURCHASES = database.collection<STOCKPURCHASES>(stockPurchases);
