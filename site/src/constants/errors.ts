export class MyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MyError";
    }
}

export enum Errors {
    INVALID_SETUP="Set up environment variables correctly",
    NOT_CREATE_STOCK = "Could not create stock",
    NOT_CREATE_STOCK_DB = "Could not create stock in DB",
    NOT_CREATE_STOCK_TOKEN = "Could not create stock token",
    INVALID_SYMBOL = "Stock symbol must be a string",
    INVALID_NAME = "Stock name must be a string",
    INVALID_STOCK_ID = "Stock id must be a string"
}