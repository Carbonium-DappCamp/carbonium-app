const { deployContract } = require("ethereum-waffle");
const hre = require("hardhat");


async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const ParcelContract = await hre.ethers.getContractFactory("ParcelContract");
    const parcelContract = await ParcelContract.deploy();

    await parcelContract.deployed();
    console.log("ParcelContract address:", parcelContract.address);

    saveFrontendFiles("ParcelContract");
    
    const CarboniumTokenContract = await hre.ethers.getContractFactory("CarboniumToken");
    const carboniumTokenContract = await CarboniumTokenContract.deploy();

    await carboniumTokenContract.deployed();
    console.log("CarboniumToken Contract address:", carboniumTokenContract.address);

    saveFrontendFiles("CarboniumToken");
    
    const CarboniumDistributionContract = await hre.ethers.getContractFactory("CarboniumDistribution");
    const carboniumDistributionContract = await CarboniumDistributionContract.deploy(carboniumTokenContract.address);

    await carboniumDistributionContract.deployed();
    console.log("CarboniumDistribution Contract address:", carboniumDistributionContract.address);

    saveFrontendFiles("CarboniumDistribution");

    saveAddresses({
        ParcelContract: parcelContract.address,
        CarboniumToken: carboniumTokenContract.address,
        CarboniumDistribution: carboniumDistributionContract.address
    });
}

function saveFrontendFiles(contractName) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    const SampleContractArtifact = artifacts.readArtifactSync(`${contractName}`);

    fs.writeFileSync(
        contractsDir + `/${contractName}.json`,
        JSON.stringify(SampleContractArtifact, null, 2)
    );
}

function saveAddresses(contractAddreses) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify(contractAddreses, undefined, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });