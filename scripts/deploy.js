const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const ParcelContract = await hre.ethers.getContractFactory("ParcelContract");
    const parcelContract = await ParcelContract.deploy();

    await parcelContract.deployed();
    console.log("Parcel Contract address:", parcelContract.address);

    saveFrontendFiles(parcelContract);

}

function saveFrontendFiles(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({ ParcelContract: contract.address }, undefined, 2)
    );

    const ParcelContractArtifact = artifacts.readArtifactSync("ParcelContract");

    fs.writeFileSync(
        contractsDir + "/ParcelContract.json",
        JSON.stringify(ParcelContractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
