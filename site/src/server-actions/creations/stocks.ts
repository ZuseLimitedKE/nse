import { SmartContract } from "@/contract";
import { Errors, MyError } from "@/constants/errors";
import { MyDatabase } from "@/db";
import { TokenizeStock } from "@/constants/types";

export async function createStock(args: TokenizeStock, database: MyDatabase, smarContract: SmartContract) {
    try {
        // TODO: Function to get current stock price
        const todayPrice = 100;

        // Create stock in smart contract
        const tokenAddress = await smarContract.createStockToken({symbol: args.symbol, name: args.name});
        // Create stock in DB
        await database.createStockInDB({...args, tokenAddress, todayPrice});
    } catch(err) {
        console.log("Error creating stock", err);
        throw new MyError(Errors.NOT_CREATE_STOCK);
    }
}

