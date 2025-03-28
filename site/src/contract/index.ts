import { Errors, MyError } from "@/constants/errors";
import Web3, { Web3Account } from "web3";
import { contract, web3 } from "./account";

interface CreateStockTokenArgs {
    symbol: string;
    name: string;
    identifier: string;
    totalShares: number;
    sharePrice: number
}
interface BuyTokenArgs {
    tokenId: string;
    userWalletAddress: string;
    amount: number;
}

export class SmartContract {
    web3: Web3;
    constructor(web3: Web3) {
        this.web3 = web3;
    }
    private async getAccount(): Promise<Web3Account> {
        try {
            const privateKey = process.env.PRIVATE_KEY!;
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            return account;
        } catch (err) {
            console.log("Error getting account", err);
            throw new MyError("Cannot get account");
        }
    }
    async createStockToken(args: CreateStockTokenArgs): Promise<string> {
        try {
            const account = await this.getAccount();
            const block = await web3.eth.getBlock();
            const transaction = {
                from: account.address,
                to: process.env.CONTRACT,
                data: contract.methods.tokenizeStock(
                    args.name,
                    args.symbol,
                    args.identifier,
                    BigInt(args.totalShares),
                    BigInt(args.sharePrice)
                ).encodeABI(),
                maxFeePerGas: block.baseFeePerGas! * 2n,
                maxPriorityFeePerGas: 100000,
            };
            const signedTransaction = await web3.eth.accounts.signTransaction(
                transaction,
                account.privateKey,
            );
            const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
            return receipt.transactionHash.toString();
        } catch (err) {
            console.log("Error creating stock token", err);
            throw new MyError(Errors.NOT_CREATE_STOCK_TOKEN);
        }
    }



}

const smartContract = new SmartContract(web3);
export default smartContract;
