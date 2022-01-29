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
    it("Max parcels are minted on creation", async function () {
      const ownerBalance = await parcelContract.balanceOf(owner.address);
      const maxParcels = await parcelContract.getMaxParcels();
      expect(ownerBalance).to.equal(maxParcels);
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
      expect(addr2Balance).to.equal(0);
      const approvedAddr = await parcelContract.getApproved(0);
      expect(approvedAddr == owner);
    });
    it ("Should emit a Transfer event", async function () {
      const maxParcels = await parcelContract.getMaxParcels();
      const tx = await parcelContract.connect(owner).grant(addr1.address, 1);
      const receipt = await tx.wait();
      const eventDetails = await receipt.events?.filter((x)=>{return x.event == 'Transfer'});

      expect(eventDetails.length).equal(1);
      expect(eventDetails[0].args.from).equals(owner.address);
      expect(eventDetails[0].args.to).equals(addr1.address);
      expect(Number(eventDetails[0].args.tokenId)).lessThan(Number(maxParcels))
          .and.greaterThanOrEqual(0);

      const addr1Balance = await parcelContract.connect(owner).balanceOf(addr1.address);
      expect(addr1Balance).to.equal(1);
    });
  });

  describe("Batch parcel transfer", async function () {
    it ("Should grant 10 tokens", async function () {
       await parcelContract.connect(owner).grant(addr2.address, 10);
       const addr2Balance = await parcelContract.connect(owner).balanceOf(addr2.address);
       expect(addr2Balance).to.equal(10);
    });
  });
});
