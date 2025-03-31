import { Errors, MyError } from "@/constants/errors";
import {
  STOCK_PRICES_COLLECTIONS,
  STOCK_PURCHASES_COLLECTION,
  STOCKPRICES,
  STOCKPURCHASES,
  STOCKS,
  STOCKS_COLLECTION,
  USER_STOCKS_COLLECTION,
  USERSTOCKS,
} from "./collections";
import { ObjectId } from "mongodb";
import { PaymentStatus } from "@/constants/status";

interface GetStocks {
  id: string;
  name: string;
  symbol: string;
}

interface UpdateStockAmount {
  user_address: string,
  stock_symbol: string,
  stock_name: string,
  number_stock: number,
  operation: "buy" | "sell"
}

interface USERSTOCKSWITHID extends USERSTOCKS {
  _id: ObjectId
}

interface STOCKPURCHASESWITHID extends STOCKPURCHASES {
  _id: ObjectId
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
  async checkIfStockExists(symbol: string): Promise<string | null>{
    try{
        const stock = await STOCKS_COLLECTION.findOne({ symbol });
        if (stock) {
          return stock.tokenID;
        } else {
          return null;
        }
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
      await STOCK_PURCHASES_COLLECTION.insertOne(args);
    } catch (err) {
      console.log("Could not store stock purchase", err);
      throw new MyError(Errors.NOT_STORE_STOCK_PURCHASE_DB);
    }
  }

  private async _userHasStockOwnRecord(user_address: string): Promise<USERSTOCKSWITHID | null> {
    try {
      const document = await USER_STOCKS_COLLECTION.findOne({ user_address: user_address });
      if (document) {
        return document;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new MyError(Errors.NOT_CHECK_USER_STOCKS_DB);
    }
  }

  private async _createNewUserStockRecord(args: UpdateStockAmount) {
    try {
      await USER_STOCKS_COLLECTION.insertOne({
        user_address: args.user_address,
        stocks: [
          {
            symbol: args.stock_symbol,
            name: args.stock_name,
            number_stocks: args.number_stock
          }
        ]
      });
    } catch (err) {
      console.log(err);
      throw new MyError(Errors.NOT_CREATE_NEW_USER_STOCKS_DB);
    }
  }

  private async _replaceUserStocksRecord(args: USERSTOCKSWITHID) {
    try {
      await USER_STOCKS_COLLECTION.replaceOne({_id: args._id}, args);
    } catch(err) {
      console.log("Could not replace document", err);
      throw new MyError(Errors.NOT_REPLACE_USER_STOCK);
    }
  }

  async updateNumberStocksOwnedByUser(args: UpdateStockAmount) {
    try {
      // Check if user already has a record
      const userRecord = await this._userHasStockOwnRecord(args.user_address);

      // If so update users record
      if (userRecord) {
        // Check if user has record of the stock
        let doesUserOwnStock = false;
        let stockIndex = 0;
        while (stockIndex < userRecord.stocks.length) {
          if (userRecord.stocks[stockIndex].symbol === args.stock_symbol) {
            doesUserOwnStock = true;
            break;
          }
          stockIndex++;
        }

        // If user owns update the value
        if (doesUserOwnStock) {
          // If buy increment
          if (args.operation == "buy") {
            userRecord.stocks[stockIndex].number_stocks += args.number_stock;
          } else {
            // Minus but make sure its positive
            if (userRecord.stocks[stockIndex].number_stocks < args.number_stock) {
              throw new MyError(Errors.CANNOT_SELL_MORE_THAN_OWNED);
            } else {
              userRecord.stocks[stockIndex].number_stocks -= args.number_stock;
            }
          }
        } else {
          // Create new value
          if (args.operation === "buy") {
            userRecord.stocks.push({
              symbol: args.stock_symbol,
              name: args.stock_name,
              number_stocks: args.number_stock
            })
          } else {
            // Throw error cause cannot create new sell record
            throw new MyError(Errors.NOT_CREATE_NEW_STOCK_RECORD_SELL);
          }
        }

        // Update db
        await this._replaceUserStocksRecord(userRecord);
      }
      // Otherwise create new record
      else {
        if (args.operation == "buy") {
          await this._createNewUserStockRecord(args);
        } else {
          throw new MyError(Errors.NOT_CREATE_NEW_RECORD_SELL);
        }
      }

    } catch (err) {
      console.log("Error updating record", err);
      if (err instanceof MyError) {
        if (err.message === Errors.NOT_CREATE_NEW_RECORD_SELL || err.message === Errors.NOT_CREATE_NEW_STOCK_RECORD_SELL || err.message === Errors.CANNOT_SELL_MORE_THAN_OWNED) {
          throw err;
        } else {
          throw new MyError(Errors.UNKNOWN)
        }
      } 

      throw new MyError(Errors.UNKNOWN);
    }
  }

  async getStocksOwnedByUser(user_address: string): Promise<USERSTOCKS | null> {
    try {
      const stocks = await USER_STOCKS_COLLECTION.findOne({user_address});
      return stocks
    } catch(err) {
      console.log("Error getting stocks owned by user", err);
      throw new MyError(Errors.NOT_GET_USER_STOCKS);
    }
  }

  async getStockPurchases(user_address: string): Promise<STOCKPURCHASES[]> {
    try {
      const stockPurchases: STOCKPURCHASES[] = [];
      const cursor = STOCK_PURCHASES_COLLECTION.find({user_wallet: user_address}).sort({purchase_date: 1});

      for await (const doc of cursor) {
        stockPurchases.push(doc);
      }

      return stockPurchases
    } catch(err) {
      console.log("Error getting stock purchases", err);
      throw new MyError(Errors.NOT_GET_USER_TRANSACTIONS);
    }
  }

  async updateSalePurchaseStatus(id: ObjectId, status: PaymentStatus) {
    try {
      await STOCK_PURCHASES_COLLECTION.updateOne({_id: id}, {$set: {status}});
    } catch(err) {
      console.log("Error upeating stock purchase status");
      throw new MyError(Errors.NOT_UPDATE_PURCHASE_STATUS_DB);
    }
  }

  async getRequestFromID(mpesa_id: string): Promise<STOCKPURCHASESWITHID | null> {
    try {
      const doc = await STOCK_PURCHASES_COLLECTION.findOne({mpesa_request_id: mpesa_id});
      return doc ?? null;
    } catch(err) {
      console.log("Could not get purchase from mpesa id", mpesa_id, err);
      throw new MyError(Errors.NOT_GET_MPESA_PAYMENT);
    }
  }

  async getTokenDetails(symbol: string): Promise<STOCKS | null> {
    try {
      const doc = await STOCKS_COLLECTION.findOne({symbol});
      return doc ?? null;
    } catch(err) {
      console.log("Could not get token details of", symbol, err);
      throw new MyError(Errors.NOT_GET_STOCK_DB);
    }
  }
}

const database = new MyDatabase();
export default database;