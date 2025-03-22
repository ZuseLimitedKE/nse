import { Errors, MyError } from "@/constants/errors";

interface StockData {
    id: number,
    symbol: string,
    name: string,
    price: string,
    change: string,
}
export async function getStocks(): Promise<StockData[]> {
    try {
        // Get stocks listed in database

        // Get price and change of each
    } catch(err) {
        console.log("Error getting stock data", err);
        throw new MyError(Errors.NOT_GET_STOCKS);
    }
}