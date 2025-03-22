import { Errors, MyError } from "@/constants/errors";
import database from "@/db";
import axios from "axios";
import * as cheerio from 'cheerio';

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
        let stocks: StockData[] = [];
        const dbStocks = await database.getStocks();

        const stockPrices = await getStockPrices();
        // Get price and change of each
        dbStocks.map(async (s) => {

        })
    } catch(err) {
        console.log("Error getting stock data", err);
        throw new MyError(Errors.NOT_GET_STOCKS);
    }
}

interface StockPrice {
    symbol: string,
    price: number,
    change: number
}
async function getStockPrices(): Promise<StockPrice[]> {
    try {
        // Load the site
        const { data } = await axios.get("https://afx.kwayisi.org/nse/");

        // Extract data from site
        const $ = cheerio.load(data);

        $("div.t > table > tbody > tr").each((_idx, el) => {
            console.log(_idx, el);
        })
        return [];
    } catch(err) {
        console.log("Could not stock prices", err);
        throw new MyError(Errors.NOT_GET_STOCK_PRICES);
    }
}

(async () => {
    const data = await getStockPrices();
    console.log(data);
})();