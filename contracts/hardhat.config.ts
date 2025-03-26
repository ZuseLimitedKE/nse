import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "hardhat-deploy";
import "dotenv/config";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "api-key";
//const SEPOLIA_ETHERSCAN_API_KEY = process.env.SEPOLIA_ETHERSCAN_API_KEY || "api-key";
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const rpcUrlHederatestnet = process.env.RPC_URL_HEDERATESTNET;
if (!rpcUrlHederatestnet || !rpcUrlHederatestnet.startsWith('http')) {
  throw new Error(
    'Missing RPC URL in RPC_URL_HEDERATESTNET env var',
  );
}

const seedPhrase = process.env.BIP39_SEED_PHRASE;
if (!seedPhrase || seedPhrase.split(' ').length < 12) {
  throw new Error(
    'Missing BIP-39 seed phrase in BIP39_SEED_PHRASE env var',
  );
}

const accounts = {
  mnemonic: seedPhrase,
  // Ref: https://github.com/hashgraph/hedera-sdk-js/blob/1a73f3f1329a48702f2a5170260bd05f186e0ca3/packages/cryptography/src/Mnemonic.js#L34
  path: "m/44'/60'/0'/0",
  // path: "m/44'/3030'/0'/0",
  initialIndex: 0,
  count: 10,
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  // namedAccounts: {
  //   deployer: {
  //     default: 0, // First account in the list
  //   },
  // },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    hederatestnet: {
      chainId: 296,
      url: rpcUrlHederatestnet,
      gasMultiplier: 1.1,
      accounts,
    },
    // "lisk-sepolia": {
    //   url: "https://rpc.sepolia-api.lisk.com",
    //   accounts: [WALLET_PRIVATE_KEY],
    //   gasPrice: 1000000000,
    // },
    // sepolia: {
    //   url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_SEPOLIA}`,
    //   accounts: [WALLET_PRIVATE_KEY],
    // },
  },
  // etherscan: {
  //   apiKey: {
  //     sepolia: ETHERSCAN_API_KEY || "",
  //     "lisk-sepolia": "123",
  //   },
  //   customChains: [
  //     {
  //       network: "lisk-sepolia",
  //       chainId: 4202,
  //       urls: {
  //         apiURL: "https://sepolia-blockscout.lisk.com/api",
  //         browserURL: "https://sepolia-blockscout.lisk.com",
  //       },
  //     },
  //   ],
  // },
  sourcify: {
    enabled: false,
  },
  solidity: "0.8.28",
};

export default config;
