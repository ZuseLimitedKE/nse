
import {
    AccountId,
    PrivateKey,
    Client,
    TokenCreateTransaction,
    TokenType, TransferTransaction, TokenInfoQuery,
    TokenInfo
} from "@hashgraph/sdk";
import 'dotenv/config'
interface CreateStockTokenArgs {
    symbol: string;
    name: string;
    totalShares: number;
}
interface BuyTokenArgs {
    tokenId: string;
    userWalletAddress: string;
    amount: number;
}

export class SmartContract {
    client: Client;
    constructor(client: Client) { this.client = client; }
    async createStock(args: CreateStockTokenArgs): Promise<string> {
        try {
            // Your account ID and private key from string value
            const MY_ACCOUNT_ID = AccountId.fromString(process.env.ACCOUNTID!);
            const MY_PRIVATE_KEY = PrivateKey.fromStringED25519(process.env.PRIVATEKEY!);
            //Set the operator with the account ID and private key
            client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);
            //Create the transaction and freeze for manual signing
            const txTokenCreate = await new TokenCreateTransaction()
                .setTokenName(args.name)
                .setTokenSymbol(args.symbol)
                .setTokenType(TokenType.FungibleCommon)
                .setTreasuryAccountId(MY_ACCOUNT_ID)
                .setInitialSupply(args.totalShares)
                .freezeWith(client);
            //Sign the transaction with the token treasury account private key
            const signTxTokenCreate = await txTokenCreate.sign(MY_PRIVATE_KEY);
            //Sign the transaction with the client operator private key and submit to a Hedera network
            const txTokenCreateResponse = await signTxTokenCreate.execute(client);
            //Get the receipt of the transaction
            const receiptTokenCreateTx = await txTokenCreateResponse.getReceipt(client);
            //Get the token ID from the receipt
            const tokenId = receiptTokenCreateTx.tokenId!;
            return tokenId.toString()
        }
        catch (error) {
            console.error("Error creating stock token:", error);
            throw error;
        }
        finally {
            if (client) client.close();
        }
    }
    async buyStock(args: BuyTokenArgs): Promise<string> {
        try {
            //Create the transfer transaction
            const txTransfer = await new TransferTransaction()
                .addTokenTransfer(args.tokenId, args.userWalletAddress, args.amount) //Fill in the token ID 
                .freezeWith(client);

            //Sign with the sender account private key
            const signTxTransfer = await txTransfer.sign(PrivateKey.fromStringED25519(process.env.PRIVATEKEY!));

            //Sign with the client operator private key and submit to a Hedera network
            const txTransferResponse = await signTxTransfer.execute(client);

            //Get the Transaction ID
            const txTransferId = txTransferResponse.transactionId.toString();
            return txTransferId;
        }
        catch (error) {
            console.error("Error buying stock:", error);
            throw error;
        }
        finally {
            if (client) client.close();
        }
    }
    async sellStock(args: BuyTokenArgs): Promise<string> {
        try {
            //Create the transfer transaction
            const txTransfer = await new TransferTransaction()
                .addTokenTransfer(args.tokenId, args.userWalletAddress, -args.amount) //Fill in the token ID 
                .freezeWith(client);

            //Sign with the sender account private key
            const signTxTransfer = await txTransfer.sign(PrivateKey.fromStringED25519(process.env.PRIVATEKEY!));

            //Sign with the client operator private key and submit to a Hedera network
            const txTransferResponse = await signTxTransfer.execute(client);

            //Get the Transaction ID
            const txTransferId = txTransferResponse.transactionId.toString();
            return txTransferId;
        }
        catch (error) {
            console.error("Error selling stock:", error);
            throw error;
        }
        finally {
            if (client) client.close();
        }
    }
    async getTokeNInformation(tokenId: string): Promise<TokenInfo> {
        try {
            const tokenInfoQuery = new TokenInfoQuery()
                .setTokenId(tokenId);
            //Sign with the client operator private key, submit the query to the network and get the token supply
            const tokenInfoQueryResponse = await tokenInfoQuery.execute(client);
            return tokenInfoQueryResponse;
        }
        catch (error) {
            console.log("Error getting token information:", error);
            throw error;
        }
        finally {
            if (client) client.close();
        }
    }

}
const client: Client = Client.forTestnet();
const smartContract = new SmartContract(client);
export default smartContract;
