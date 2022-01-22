const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Parcel Contract", () => {
  let ParcelContract, parcelContract;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    ParcelContract = await ethers.getContractFactory("ParcelContract");
      parcelContract = await ParcelContract.deploy();
      await parcelContract.deployed();

      await parcelContract.setBaseURI("http://localhost:3000/item/");
    });

  describe("Contract creation", async function () {
    it("10 parcels are minted on creation", async function () {
      const ownerBalance = await parcelContract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(10);
    });
    it("A parcels has an URI", async function () {
      const uri = await parcelContract.tokenURI(0);
      expect(uri).to.be.equal("http://localhost:3000/item/0");
    });

  });

});
