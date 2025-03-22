"use server";
import { Errors, MyError } from "@/constants/errors";
import { TokenizeStock } from "@/constants/types";
import { revalidatePath } from "next/cache";
import smartContract from "@/contract";
import database from "@/db";

export async function createStock(
  args: TokenizeStock,
) {
  try {
    // TODO: Function to get current stock price
    const todayPrice = 100;

    // Create stock in smart contract
    const tokenAddress = await smartContract.createStockToken({
      symbol: args.symbol,
      name: args.name,
    });
    // Create stock in DB
    await database.createStockInDB({ ...args, tokenAddress, todayPrice });
  } catch (err) {
    console.log("Error creating stock", err);
    throw new MyError(Errors.NOT_CREATE_STOCK);
  }
}
interface IStocks {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
}
//THIS IS JUST A DUMMY FUNCTION DON'T REMOVE IT - ANTHONY
export async function getDummyStocks(): Promise<IStocks[]> {
  // Get random price variations to ensure data changes
  const getVariation = () =>
    (Math.random() > 0.5 ? 1 : -1) * parseInt((Math.random() * 10).toFixed(2));

  await new Promise((resolve) => {
    //simulate a network call
    setTimeout(resolve, 1000);
  });
  const stocks = [
    {
      id: 1,
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 18500.45 + getVariation(),
      change: 2.34,
    },
    {
      id: 2,
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 32750.78 + getVariation(),
      change: 1.12,
    },
    {
      id: 3,
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 15320.9 + getVariation(),
      change: -0.87,
    },
    {
      id: 4,
      symbol: "AMZN",
      name: "Amazon.com",
      price: 28950.65 + getVariation(),
      change: 0.56,
    },
    {
      id: 5,
      symbol: "META",
      name: "Meta Platforms",
      price: 9870.23 + getVariation(),
      change: -1.45,
    },
    {
      id: 6,
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 6540.78 + getVariation(),
      change: 3.21,
    },
    {
      id: 7,
      symbol: "NFLX",
      name: "Netflix Inc.",
      price: 12450.34 + getVariation(),
      change: 0.78,
    },
    {
      id: 8,
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: 21340.56 + getVariation(),
      change: 4.56,
    },
    {
      id: 9,
      symbol: "AMD",
      name: "AMD Corp.",
      price: 18320.2 + getVariation(),
      change: 2.0,
    },
  ];
  revalidatePath("/marketplace");
  return stocks;
}
