const hre = require("hardhat");

async function main() {
    await hre.run('compile');

    const StockTokenization = await hre.ethers.getContractFactory("StockTokenization");
    const stockTokenization = await StockTokenization.deploy();
    await stockTokenization.waitForDeployment();

    console.log("RealEstateTokenization Contract Address", await stockTokenization.getAddress())
}

main().then( () => process.exit(0))
.catch( (error) => {
    console.error(error);
    process.exit(1);
});