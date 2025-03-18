import { SmartContract } from "@/contract";
import { Errors, MyError } from "@/constants/errors";
import { MyDatabase } from "@/db";
export interface CreateStock {
    symbol: string,
    name: string,
    todayPrice: number,
    stockID: string | undefined
}

export async function createStock(args: CreateStock, database: MyDatabase, smarContract: SmartContract) {
    try {
        // Create stock in smart contract
        const tokenAddress = await smarContract.createStockToken({symbol: args.symbol, name: args.name});
        // Create stock in DB
        await database.createStockInDB({...args, tokenAddress});
    } catch(err) {
        console.log("Error creating stock", err);
        throw new MyError(Errors.NOT_CREATE_STOCK);
    }
}

