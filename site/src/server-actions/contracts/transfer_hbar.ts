"use server"

import smartContract from "@/contract";
import "../../../envConfig";
import { Errors, MyError } from "@/constants/errors";

export async function transferHbar(args: { userAddress: string, amount: number}) {
    try {
        await smartContract.transferHbar(args);
    } catch(err) {
        console.log("Error transfering hbar", err);
        throw new MyError(Errors.NOT_TRANSFER_HBAR);
    } 
}