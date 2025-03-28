import { z } from "zod";
import { Errors } from "./errors";

export const tokenizeStockSchema = z.object({
  symbol: z
    .string({ message: Errors.INVALID_SYMBOL })
    .max(9, { message: Errors.INVALID_SYMBOL }),
  name: z.string({ message: Errors.INVALID_NAME }),
  stockID: z.string({ message: Errors.INVALID_STOCK_ID }).optional(),
});

export const stkPushSchema = z.object({
  amount: z
    .number({ message: Errors.INVALID_AMOUNT })
    .gt(0, { message: Errors.INVALID_AMOUNT })
    .int({ message: Errors.INVALID_AMOUNT }),
  customer_phone_number: z
    .string({ message: Errors.INVALID_PHONE_NUMBER })
    .regex(/254\d{9}/, { message: Errors.INVALID_PHONE_NUMBER }),
  stock_symbol: z
    .string({ message: Errors.INVALID_SYMBOL })
    .max(9, { message: Errors.INVALID_SYMBOL }),
});

export const storeStockPurchase = z.object({
  mpesa_request_id: z.string().optional(),
  txHash: z.string().optional(),
  stock_symbol: z
    .string({ message: Errors.INVALID_SYMBOL })
    .max(9, { message: Errors.INVALID_SYMBOL }),
  name: z.string({ message: Errors.INVALID_NAME }),
  amount_shares: z
    .number({ message: Errors.INVALID_AMOUNT })
    .gt(0, { message: Errors.INVALID_AMOUNT })
    .int({ message: Errors.INVALID_AMOUNT }),
  buy_price: z.number({ message: Errors.INVALID_BUY_PRICE })
    .gt(0, { message: Errors.INVALID_BUY_PRICE }),
  purchase_date: z.date(),
  user_wallet: z.string({ message: Errors.INVALID_WALLET }).min(42, { message: Errors.INVALID_WALLET })
});

export const sendMoneyTransferSchema = z.object({
  customer_name: z.string(),
  customer_phone_number: z.string().regex(/0[71]\d{8}/), // Not start with 254
  customer_email: z.string().email(),
  amount: z
    .number({ message: Errors.INVALID_SELL_PRICE })
    .gt(0, { message: Errors.INVALID_SELL_PRICE }),
});


const operation_options = ["buy", "sell"] as const;
export const updateUserStockHoldingsSchema = z.object({
  user_address: z.string({ message: Errors.INVALID_WALLET }).min(42, { message: Errors.INVALID_WALLET }),
  stock_symbol: z
    .string({ message: Errors.INVALID_SYMBOL })
    .max(9, { message: Errors.INVALID_SYMBOL }),
  stock_name: z.string({ message: Errors.INVALID_NAME }),
  number_stock: z
    .number({ message: Errors.INVALID_AMOUNT })
    .gt(0, { message: Errors.INVALID_AMOUNT })
    .int({ message: Errors.INVALID_AMOUNT }),
  operation: z.enum(operation_options)
})

export type TokenizeStock = z.infer<typeof tokenizeStockSchema>;
export type STKPush = z.infer<typeof stkPushSchema>;
export type StoreStockPurchase = z.infer<typeof storeStockPurchase>;
export type SendMoneyTransfer = z.infer<typeof sendMoneyTransferSchema>;
export type UpdateUserStockHoldings = z.infer<typeof updateUserStockHoldingsSchema>;
