const { expect } = require("chai");
const { ethers } = require("hardhat");

// tutorial: https://www.youtube.com/watch?v=kWUDTZhxKZI

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe("Mars",  function () {
    describe("Initialize",  function () {
        it("Should revert for not called within initializer", async function () {
            const Mars = await ethers.getContractFactory("Mars");
    
            const marsv1 = await hre.upgrades.deployProxy(Mars, ['Mars'], {kind: 'uups'});
            await expect(marsv1.__TestContract_init()).to.be.revertedWith("Initializable: contract is not initializing");
        });

        it("Should upgrade and initialize", async function () {
            const Mars = await ethers.getContractFactory("Mars");
            const MarsV2 = await ethers.getContractFactory("MarsV2");
    
            const marsv1 = await hre.upgrades.deployProxy(Mars, ['Mars'], {kind: 'uups'});
            await expect(marsv1.__TestContract_init()).to.be.revertedWith("Initializable: contract is not initializing");

            const currentTimestamp = (new Date()).getTime();
            const marsv2 = await hre.upgrades.upgradeProxy(marsv1, MarsV2, { call: { fn: "initializev2", args: [currentTimestamp]} });
            expect(await marsv2.version()).to.equal(currentTimestamp);
        });

        it("Should revert for not called within initializer", async function () {
            const Mars = await ethers.getContractFactory("Mars");
            const MarsV2 = await ethers.getContractFactory("MarsV2");

            const marsv1 = await hre.upgrades.deployProxy(Mars, ['Mars'], {kind: 'uups'});
            const marsv2 = await hre.upgrades.upgradeProxy(marsv1, MarsV2, { call: { fn: "initializev2", args: [2]} });

            await expect(marsv2.__TestContract_init()).to.be.revertedWith("Initializable: contract is not initializing");
            await expect(marsv2.__V2_init(2)).to.be.revertedWith("Initializable: contract is not initializing");
        });
    });
});