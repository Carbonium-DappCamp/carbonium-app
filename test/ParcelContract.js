const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Parcel Contract", () => {
  let ParcelContract, parcelContract;
  let owner, addr1, addr2;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    ParcelContract = await ethers.getContractFactory("ParcelContract");
      parcelContract = await ParcelContract.deploy();
      await parcelContract.deployed();

      await parcelContract.setBaseURI("http://localhost:3000/item/");
    });

  describe("Contract creation", async function () {
    it("1000 parcels are minted on creation", async function () {
      const ownerBalance = await parcelContract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(100);
    });
    it("A parcel has an URI", async function () {
      const uri = await parcelContract.tokenURI(0);
      expect(uri).to.be.equal("http://localhost:3000/item/0");
    });

  });

  describe("Parcel transfer", async function () {
    it ("Should not have balances with other addresses", async function () {
      const addr1Balance = await parcelContract.connect(owner).balanceOf(addr1.address);
      expect(addr1Balance).to.equal(0);
      const addr2Balance = await parcelContract.connect(owner).balanceOf(addr2.address);
      expect(addr1Balance).to.equal(0);
      const approvedAddr = await parcelContract.getApproved(0);
      expect(approvedAddr == owner);
    });

  });
});
