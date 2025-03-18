import { Errors, MyError } from "@/constants/errors";

interface CreateStockTokenArgs {
    symbol: string,
    name: string
}

export class SmartContract {
    async createStockToken(args: CreateStockTokenArgs): Promise<string> {
        try {
            //TODO: Call function for minting stock
            return "address";
        } catch(err) {
            console.log("Error creating stock token", err);
            throw new MyError(Errors.NOT_CREATE_STOCK_TOKEN);
        }
    }
}

const smartContract = new SmartContract();
export default smartContract;