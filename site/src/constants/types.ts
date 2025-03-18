import {z} from "zod";
import { Errors } from "./errors";

export const tokenizeStockSchema = z.object({
    symbol: z.string({message: Errors.INVALID_SYMBOL}),
    name: z.string({message: Errors.INVALID_NAME}),
    stockID: z.string({message: Errors.INVALID_STOCK_ID})
});

export type TokenizeStock = z.infer<typeof tokenizeStockSchema>;