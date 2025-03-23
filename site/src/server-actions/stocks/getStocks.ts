"use server";
import { Errors, MyError } from "@/constants/errors";
import database from "@/db";
import axios from "axios";
import * as cheerio from "cheerio";
import { StockData } from "@/types";

// List of user agent strings to rotate
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
];

export async function getStocks(): Promise<StockData[]> {
  try {
    const [dbStocks, stockPrices] = await Promise.all([
      database.getStocks(),
      getStockPrices(),
    ]);

    return dbStocks.map((s) => ({
      id: s.id,
      symbol: s.symbol,
      name: s.name,
      price: stockPrices.find((sy) => sy.symbol === s.symbol)?.price ?? 0.0,
      change: stockPrices.find((sy) => sy.symbol === s.symbol)?.change ?? 0.0,
    }));
  } catch (err) {
    console.error("Error getting stock data:", err);
    throw new MyError(Errors.NOT_GET_STOCKS);
  }
}

// Cache configuration
interface StockPrice {
  symbol: string;
  price: number;
  change: number;
}
// in memory cache
let stockPriceCache: { data: StockPrice[]; timestamp: number } | null = null;
const cacheTimeToLive = 5 * 60 * 1000; // 5 minutes
let fetchingPromise: Promise<StockPrice[]> | null = null;

async function getStockPrices(): Promise<StockPrice[]> {
  // Check if cache is valid
  if (
    stockPriceCache &&
    Date.now() - stockPriceCache.timestamp < cacheTimeToLive
  ) {
    console.log("...using cached stock prices");
    return structuredClone(stockPriceCache.data);
  }

  // Prevent multiple concurrent fetches
  if (fetchingPromise) {
    console.log("...waiting for ongoing fetch");
    return fetchingPromise;
  }

  try {
    // Fetch new data
    fetchingPromise = fetchStockPrices();

    const data = await fetchingPromise;
    stockPriceCache = { data, timestamp: Date.now() };

    return structuredClone(data);
  } catch (err) {
    console.error("...web scraping failed:", err);

    if (stockPriceCache) {
      console.log("...using stale cache");
      return structuredClone(stockPriceCache.data);
    }

    return [];
  } finally {
    fetchingPromise = null; // Reset promise after fetch completes
  }
}

// Scraping function
async function fetchStockPrices(): Promise<StockPrice[]> {
  console.log("...attempting to scrape with a 5-second timeout");

  const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
  const { data } = await axios.get("https://afx.kwayisi.org/nse/", {
    timeout: 5000,
    headers: { "User-Agent": ua },
  });

  const $ = cheerio.load(data);
  const stockPrices: StockPrice[] = [];

  $("div.t > table > tbody > tr").each((_idx, el) => {
    const row = $(el).extract({
      symbol: { selector: "td:first" },
      price: { selector: "td:eq(3)" },
      change: { selector: "td:eq(4)" },
    });

    stockPrices.push({
      symbol: row.symbol ?? "",
      price: row.price ? Number.parseFloat(row.price) : 0.0,
      change: row.change ? Number.parseFloat(row.change) : 0.0,
    });
  });

  console.log("...saving to cache");
  return stockPrices;
}
