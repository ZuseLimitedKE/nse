import {z} from "zod";
import { Errors } from "./errors";

export const tokenizeStockSchema = z.object({
    symbol: z.string({message: Errors.INVALID_SYMBOL}).max(9, {message: Errors.INVALID_SYMBOL}),
    name: z.string({message: Errors.INVALID_NAME}),
    stockID: z.string({message: Errors.INVALID_STOCK_ID}).optional()
});

export const stkPushSchema = z.object({
    amount: z.number({message: Errors.INVALID_AMOUNT}).gt(0, {message: Errors.INVALID_AMOUNT}).int({message: Errors.INVALID_AMOUNT}),
    customer_phone_number: z.string({message: Errors.INVALID_PHONE_NUMBER}).regex(/254\d{9}/, {message: Errors.INVALID_PHONE_NUMBER}),
    stock_symbol: z.string({message: Errors.INVALID_SYMBOL}).max(9, {message: Errors.INVALID_SYMBOL}),
})

export type TokenizeStock = z.infer<typeof tokenizeStockSchema>;
export type STKPush = z.infer<typeof stkPushSchema>;