const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Carbonium Distribution", () => {
    let CarboniumDistribution;
    let carboniumDistribution;
    let CarboniumToken;
	let carboniumToken;
	let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;
    const tokenSupply = 10000000000000;
    
    beforeEach(async () => {
		CarboniumDistribution = await ethers.getContractFactory("CarboniumDistribution");
		CarboniumToken = await ethers.getContractFactory("CarboniumToken");
		[owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

		carboniumToken = await CarboniumToken.deploy();
		carboniumDistribution = await CarboniumDistribution.deploy(carboniumToken.address);

		await carboniumToken.deployed();
		await carboniumDistribution.deployed();

		const approveTx = await carboniumToken.connect(owner).approve(carboniumDistribution.address, tokenSupply);
    	await approveTx.wait();
    });
    
    describe("Deployment", function () {
		it("Should set the right owner", async function () {
		  expect(await carboniumDistribution.owner()).to.equal(owner.address);
		});
    });
    
    describe("Distribute", function () {
        it("Should allow to distribute tokens", async function () {
            let addresses = [addr1.address, addr2.address, addr3.address];
            let amounts = [5, 6, 7];

            expect((await carboniumToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply);
            expect((await carboniumToken.balanceOf(addr1.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr2.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr3.address)).toNumber()).to.equal(0);

            const distributeTx = await carboniumDistribution.connect(owner).distribute(addresses, amounts);
            await distributeTx.wait();

            await expect(distributeTx).to.emit(carboniumDistribution, 'TokenDistributed').withArgs(addresses[0], amounts[0]);
            await expect(distributeTx).to.emit(carboniumDistribution, 'TokenDistributed').withArgs(addresses[1], amounts[1]);
            await expect(distributeTx).to.emit(carboniumDistribution, 'TokenDistributed').withArgs(addresses[2], amounts[2]);

            expect((await carboniumToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply - amounts.reduce((a, b) => a + b, 0));
            expect((await carboniumToken.balanceOf(addr1.address)).toNumber()).to.equal(amounts[0]);
            expect((await carboniumToken.balanceOf(addr2.address)).toNumber()).to.equal(amounts[1]);
            expect((await carboniumToken.balanceOf(addr3.address)).toNumber()).to.equal(amounts[2]);
        });

        it("Should not allow to distribute tokens if lengths are different", async function () {
            let addresses = [addr1.address, addr2.address, addr3.address];
            let amounts = [5, 6, 7, 8];

            expect((await carboniumToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply);
            expect((await carboniumToken.balanceOf(addr1.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr2.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr3.address)).toNumber()).to.equal(0);

            expect(carboniumDistribution.connect(owner).distribute(addresses, amounts)).to.be.revertedWith("Length of addresses is not the same as length of amounts");
            
            expect((await carboniumToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply);
            expect((await carboniumToken.balanceOf(addr1.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr2.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr3.address)).toNumber()).to.equal(0);

        });

        it("Should not allow to distribute tokens from not an owner address", async function () {
            let addresses = [addr1.address, addr2.address, addr3.address];
            let amounts = [5, 6, 7, 8];

            expect((await carboniumToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply);
            expect((await carboniumToken.balanceOf(addr1.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr2.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr3.address)).toNumber()).to.equal(0);

            expect(carboniumDistribution.connect(addr1).distribute(addresses, amounts)).to.be.revertedWith("Ownable: caller is not the owner");
            
            expect((await carboniumToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply);
            expect((await carboniumToken.balanceOf(addr1.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr2.address)).toNumber()).to.equal(0);
            expect((await carboniumToken.balanceOf(addr3.address)).toNumber()).to.equal(0);

        });
    });
});