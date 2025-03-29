import { NextResponse } from 'next/server';
import { CreateStockTokenSchema } from '@/types/stocks';
import smartContract from '@/contract';
import database from '@/db';
export async function POST(request: Request) {
    console.log("Hit the endpoint");
    try {
        console.log("Tried it");
        const body = await request.json();
        console.log("Body=>",body);
        console.log("Here too");
        // Validate the request body against the schema
        const parsedBody = CreateStockTokenSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json({ error: 'Invalid input', details: parsedBody.error }, { status: 400 });
        }
        //Check if the stock with the symbol exists
        const stockExists = await database.checkIfStockExists(parsedBody.data.symbol);
        if (stockExists) {
            return NextResponse.json({ error: 'Stock with the symbol already exists' }, { status: 400 });
        }
        //Call the function to create the token onchain
        const tokenId = await smartContract.createStock({ symbol: parsedBody.data.symbol, name: parsedBody.data.name, totalShares: parsedBody.data.totalShares, });
        console.log("Token Id=>",tokenId);
        //Save the stock token to the database
        await database.createStockInDB({ stockID: tokenId, symbol: parsedBody.data.symbol, name: parsedBody.data.name, totalShares: parsedBody.data.totalShares, todayPrice: parsedBody.data.sharePrice });
        return NextResponse.json({ success: true, message: "Token created successfully" }, { status: 201 });
    } catch (error) {
        console.log("Error=>",error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}