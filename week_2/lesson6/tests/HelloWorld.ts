import { expect } from "chai";
import { ethers } from "hardhat"
import { HelloWorld } from "../typechain-types";

describe("Hello World", () => {
  let factory: any;
  let contract: HelloWorld;

  beforeEach( async() => {
    factory = await ethers.getContractFactory("HelloWorld")
    contract = await factory.deploy()
    await contract.deployed()
  })

  it("should return Hello World!", async () => {
    expect(await contract.helloWorld()).to.eql('Hello World!')
  })

  it("should set owner to the deployer account", async() => {
    const signers = await ethers.getSigners()
    const deployerAccount = signers[0]

    expect(await contract.owner()).to.eq(deployerAccount.address)
  })

  it("should not allow anyone other than owner to call transferOwnership", async() =>{
    const signers = await ethers.getSigners()
    await expect(contract.connect(signers[1]).transferOwnership(signers[1].address)).to.be.revertedWith('Caller is not the owner')
  })

  it("should execute transferOwnership correctly", async() =>{
    const signers = await ethers.getSigners()
    const owner = await contract.owner()
    expect(owner).to.eq(await contract.owner())
    const tx = await contract.transferOwnership(signers[1].address)
    await tx.wait()
    expect(owner).to.not.eq(await contract.owner())
  })

  it("Should not allow anyone other than owner to change text", async function () {
    const signers = await ethers.getSigners()
    await expect(contract.connect(signers[1]).setText("new Text")).to.be.revertedWith("Caller is not the owner")
  });

  it("Should change text correctly", async function () {
    expect(await contract.helloWorld()).to.eq("Hello World!")
    await contract.setText("new text")
    expect(await contract.helloWorld()).to.eql("new text")
  });

})