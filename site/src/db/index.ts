import { Errors, MyError } from "@/constants/errors";
import {
  STOCK_PRICES_COLLECTIONS,
  STOCK_PURCHASES,
  STOCKPRICES,
  STOCKPURCHASES,
  STOCKS,
  STOCKS_COLLECTION,
} from "./collections";

interface GetStocks {
  id: string;
  name: string;
  symbol: string;
}

export class MyDatabase {
  async createStockInDB(args: STOCKS) {
    try {
      await STOCKS_COLLECTION.insertOne(args);
    } catch (err) {
      console.log("Error creating stock", err);
      throw new MyError(Errors.NOT_CREATE_STOCK_DB);
    }
  }
  async checkIfStockExists(symbol: string){
    try{
        const stock = await STOCKS_COLLECTION.findOne({ symbol });
        return stock !== null;
    }
    catch(err){
        console.log("Error checking if stock exists", err);
        throw new MyError("Error checking if stock exists");
    }
  }

  async getStocks(): Promise<GetStocks[]> {
    try {
      const stocks: GetStocks[] = [];
      const cursor = STOCKS_COLLECTION.find(
        {},
        { projection: { id: 1, name: 1, symbol: 1 } },
      );
      for await (const doc of cursor) {
        stocks.push({
          id: doc._id.toString(),
          name: doc.name,
          symbol: doc.symbol,
        });
      }
      return stocks;
    } catch (err) {
      console.log("Error getting stocks from DB", err);
      throw new MyError(Errors.NOT_GET_STOCKS_DB);
    }
  }

  async getStockPricesFromDB(): Promise<STOCKPRICES[]> {
    try {
      const stocks: STOCKPRICES[] = [];
      const cursor = STOCK_PRICES_COLLECTIONS.find();
      for await (const doc of cursor) {
        stocks.push({
          symbol: doc.symbol,
          change: doc.change,
          price: doc.price,
        });
      }

      return stocks;
    } catch (err) {
      console.log("Error getting stock prices from db", err);
      throw new MyError(Errors.NOT_GET_STOCK_PRICES_DB);
    }
  }

  async updateStockPricesInDB(args: STOCKPRICES[]) {
    try {
      // Delete previous records
      await STOCK_PRICES_COLLECTIONS.deleteMany({});

      // Insert new records
      await STOCK_PRICES_COLLECTIONS.insertMany(args);
    } catch (err) {
      console.log("Could not update stock prices in db", err);
      throw new MyError(Errors.NOT_UPDATE_STOCK_PRICES_DB);
    }
  }

  async storeStockPurchase(args: STOCKPURCHASES) {
    try {
      await STOCK_PURCHASES.insertOne(args);
    } catch(err) {
      console.log("Could not store stock purchase", err);
      throw new MyError(Errors.NOT_STORE_STOCK_PURCHASE_DB);
    }
  }
}

const database = new MyDatabase();
export default database;
