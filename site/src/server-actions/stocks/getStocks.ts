"use server";
import { Errors, MyError } from "@/constants/errors";
import database from "@/db";
import axios from "axios";
import * as cheerio from "cheerio";
import { StockData } from "@/types";

export async function getStocks(): Promise<StockData[]> {
  try {
    // Get stocks listed in database
    const stocks: StockData[] = [];
    const dbStocks = await database.getStocks();

    const stockPrices = await getStockPrices();
    // Get price and change of each
    dbStocks.map((s) => {
      const entry = stockPrices.find((sy) => sy.symbol === s.symbol);

      stocks.push({
        id: s.id,
        symbol: s.symbol,
        name: s.name,
        price: entry?.price ?? 0.0,
        change: entry?.change ?? 0.0,
      });
    });
    return stocks;
  } catch (err) {
    console.log("Error getting stock data", err);
    throw new MyError(Errors.NOT_GET_STOCKS);
  }
}

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
}
async function getStockPrices(): Promise<StockPrice[]> {
  try {
    // Load the site
    const stockPrices: StockPrice[] = [];

    const { data } = await axios.get("https://afx.kwayisi.org/nse/", {
      timeout: 5000,
    });

    // Extract data from site
    const $ = cheerio.load(data);

    $("div.t > table > tbody > tr").each((_idx, el) => {
      const data = $(el).extract({
        symbol: {
          selector: "td:first",
        },
        price: {
          selector: "td:eq(3)",
        },
        change: {
          selector: "td:eq(4)",
        },
      });
      stockPrices.push({
        symbol: data.symbol ?? "",
        price: data.price ? Number.parseFloat(data.price) : 0.0,
        change: data.change ? Number.parseFloat(data.change) : 0.0,
      });
    });
    return stockPrices;
  } catch (err) {
    console.log("Web Scraping failed , using fallback values", err);
    //throw new MyError(Errors.NOT_GET_STOCK_PRICES);
    //TODO: FIND A WAY OF GETTING FALLBACK DATA
    return [];
  }
}
