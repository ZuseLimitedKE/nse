"use server";
import { Errors, MyError } from "@/constants/errors";
import { revalidatePath } from "next/cache";
import smartContract from "@/contract";
import database from "@/db";
import { CreateStockTokenArgs } from "@/types/stocks";

export async function createStock(args: CreateStockTokenArgs) {
  try {
    //Check if the stock with the symbol exists
    const stockExists = await database.checkIfStockExists(args.symbol);
    if (stockExists) {
        return stockExists;
    }
    //Call the function to create the token onchain
    const tokenId = await smartContract.createStock({ symbol: args.symbol, name: args.name, totalShares: args.totalShares, });
    //Save the stock token to the database
    await database.createStockInDB({ tokenID: tokenId, symbol: args.symbol, name: args.name, totalShares: args.totalShares, todayPrice: args.sharePrice });
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
