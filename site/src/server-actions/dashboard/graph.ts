"use server"

import { Errors, MyError } from "@/constants/errors";
import { GetGraphData } from "@/constants/types";
import database from "@/db";

interface GraphData {
    value: number,
    date: Date
}

export enum GraphDataMode {
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}

export default async function getGraphData(args: GetGraphData): Promise<GraphData[]> {
    try {
        if (args.from > args.to) {
            console.log("From date can't be after to date");
            throw new MyError(Errors.INVALID_FROM_TO_DATE);
        }

        // Return data from database
        const purchases = await database.getStockPurchases(args.user_address);
        return [];
    } catch(err) {
        console.log("Error getting graph data", err);
        if (err instanceof MyError) {
            throw err;
        }
        throw new MyError(Errors.NOT_GET_GRAPH_DATA)
    }   
}

function _getDatesInRange(from: Date, to: Date, mode: GraphDataMode): Date[] {
    if (from === to) {
        return [from];
    }

    const dates = [];
    // First element is from date
    dates.push(from);

    let dateToAdd = new Date(from);
    // Get all dates that are beginning of next week or month but less than to
    while (dateToAdd < to) {
        const newDate = new Date(dateToAdd);

        if (mode === GraphDataMode.MONTHLY) {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (mode === GraphDataMode.WEEKLY) {
            newDate.setDate(newDate.getDate() + 7);
        }

        if (newDate < to) {
            dates.push(newDate);
        }
        dateToAdd = new Date(newDate);
    }

    dates.push(to);

    return dates;
}

(async () => {
    const from = new Date(2025, 0, 1);
    const to = new Date(2025, 2, 30)
    const dates = _getDatesInRange(from, to, GraphDataMode.WEEKLY);
    console.log(dates)
})();