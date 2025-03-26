import hre from "hardhat";
import "dotenv/config";
import { AccountId, Client, PrivateKey, TransferTransaction } from "@hashgraph/sdk";
import {HDNode} from "@ethersproject/hdnode";

async function fundGeneratedAccounts() {
    try {
        if (process.env.OPERATOR_ID == null ||
            process.env.OPERATOR_KEY == null ||
            process.env.BIP39_SEED_PHRASE == null) {
            throw new Error(
                "Environment variables OPERATOR_ID, OPERATOR_KEY, and BIP39_SEED_PHRASE are required."
            );
        }

        /**
     * Initialise an "operator" account, by generating one at https://portal.hedera.com/
     */
        const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
        const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
        const client = Client.forTestnet().setOperator(operatorId, operatorKey);

        /**
         * Create multiple ECSDA private keys based on a BIP-39 seed phrase,
         * and the default BIP-32/BIP-44 HD Wallet derivation path used by metamask.
         * At this point, these accounts only exist locally, not visible on the network.
         */
        const hdNodeRoot = HDNode.fromMnemonic(process.env.BIP39_SEED_PHRASE);

        const HD_PATH = "m/44'/60'/0'/0";
        const AMOUNT_PER_ACCOUNT = 100;
        const NUM_ACCOUNTS = 2

        const privateKeys = [];
        for (let accountIdx = 0; accountIdx < NUM_ACCOUNTS; accountIdx++) {
            const accountHdPath = `${HD_PATH}/${accountIdx}`;
            const hdNodeX = hdNodeRoot.derivePath(accountHdPath);

            // convert private key from ethersjs format to hedera sdk format
            const privateKeyX = PrivateKey.fromStringECDSA(hdNodeX.privateKey);
            privateKeys.push(privateKeyX);
            console.log(`EVM account #${accountIdx} generated.`);
            console.log(`#${accountIdx}     HD path: ${accountHdPath}`);
            console.log(`#${accountIdx} Private key: ${privateKeyX.toStringDer()}`);
            console.log(`#${accountIdx}  Public key: ${privateKeyX.publicKey.toStringDer()}`);
            console.log(`#${accountIdx} EVM address: ${privateKeyX.publicKey.toEvmAddress()}`);
        }

        /**
         * Transfer tokens using the `TransferTransaction` to the Etherеum Account Address
         *    - Debit a large amount from the "operator" account
         *    - Credit multiple smaller amounts to each of the new accounts
         * At this point, these accounts exist on the network as well, and are visible on ledger explorers
         */
        let multiTransferTx = new TransferTransaction()
            .addHbarTransfer(operatorId, (0 - AMOUNT_PER_ACCOUNT) * NUM_ACCOUNTS);
        privateKeys.forEach((privateKeyX) => {
            const evmAddressX = privateKeyX.publicKey.toEvmAddress();

            // TransferTransaction's interface allows multiple operations until frozen
            multiTransferTx = multiTransferTx.addHbarTransfer(evmAddressX, AMOUNT_PER_ACCOUNT);
        });
        multiTransferTx = multiTransferTx.freezeWith(client);
        const transferTxSign = await multiTransferTx.sign(operatorKey);
        await transferTxSign.execute(client);
        //@ts-ignore
        const txIdStr = transferTxSign.transactionId.toString();
        console.log('Transfer transaction ID:', txIdStr);
        console.log(`HashScan URL: https://hashscan.io/testnet/transaction/${txIdStr}`);
    } catch (err) {
        console.log("error funding generating accounts", err);
        throw new Error("Could not fund generated accounts");
    }
}

async function main() {
    await hre.run('compile');
    await fundGeneratedAccounts();

    const StockTokenization = await hre.ethers.getContractFactory("StockTokenization");
    const stockTokenization = await StockTokenization.deploy();
    await stockTokenization.waitForDeployment();

    console.log("RealEstateTokenization Contract Address", await stockTokenization.getAddress())
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });