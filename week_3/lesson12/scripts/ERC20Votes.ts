import { ERC20Votes__factory, MyToken__factory } from "../typechain-types";
import { ethers } from "hardhat";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
  //Deploy contract
  const [deployer, account1, account2] = await ethers.getSigners();
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  const deployTransactionReceipt = await contract.deployTransaction.wait();

  console.log(
    `The Tokenized Votes Contract was deployed at the block ${deployTransactionReceipt.blockNumber}`
  );

  //mint tokens
  const mintTx = await contract.mint(account1.address, MINT_VALUE);
  const mintTxReceipt = await mintTx.wait();

  console.log(
    `Tokens minted for ${account1.address} at block ${mintTxReceipt.blockNumber}`
  );

  const tokenBalanceofAccount1 = await contract.balanceOf(account1.address);

  console.log(
    `Account 1 has a balance of ${ethers.utils.formatEther(
      tokenBalanceofAccount1
    )} Vote Tokens`
  );

  const mintTx2 = await contract.mint(account2.address, MINT_VALUE);
  const mintTxReceipt2 = await mintTx2.wait();

  console.log(
    `Tokens minted for ${account2.address} at block ${mintTxReceipt2.blockNumber}`
  );

  const tokenBalanceofAccount2 = await contract.balanceOf(account2.address);

  console.log(
    `Account 1 has a balance of ${ethers.utils.formatEther(
      tokenBalanceofAccount2
    )} Vote Tokens`
  );

  //check voting power
  let votePowerAccount1 = await contract.getVotes(account1.address);

  console.log(
    `Account 1 has a vote power of ${ethers.utils.formatEther(
      votePowerAccount1
    )}`
  );

  // playing with parsing event logs
  console.log({mintTxReceipt2})
  console.log({logtopic0: mintTxReceipt2.logs[0].topics})
  console.log({logtopic1:mintTxReceipt2.logs[1].topics})
  console.log({log:mintTxReceipt2.logs})

  // emitted events are stored in the topics of the logs
  // multiple events are stored as arrays
  // pick the right one use the event signaure as below
  const signature = ethers.utils.toUtf8Bytes("Minting(address,address,uint256,bytes32)")
  const hash = ethers.utils.keccak256(signature)
  console.log(hash)
  const dataFortheAboveTopicHash = '0x0000000000000000000000000000000000000000000000008ac7230489e80000576520617265206c6f6767696e672061207468696e6700000000000000000000'

  const data = ethers.utils.defaultAbiCoder.decode(['uint256', 'bytes32'], dataFortheAboveTopicHash)
  console.log("DATA", data)
  console.log(ethers.utils.parseBytes32String(data[1]))

  contract.on("Minting", (from, to, amount, message) => {
    console.log(`From: ${from} => To: ${to} : ${amount}, ${message}`)
  })

  const delegateTx = await contract
    .connect(account1)
    .delegate(account1.address);
  const delegateTxReceipt = await delegateTx.wait();

  votePowerAccount1 = await contract.getVotes(account1.address);

  console.log(
    `Account 1 has a vote power of ${ethers.utils.formatEther(
      votePowerAccount1
    )}`
  );
  console.log(
    `Tokens delegated from ${account1.address} for ${
      account1.address
    } at block ${delegateTxReceipt.blockNumber}, for a cost of ${
      delegateTxReceipt.gasUsed
    } gas units, totalling a tx cost of ${delegateTxReceipt.gasUsed.mul(
      delegateTxReceipt.effectiveGasPrice
    )} Wei (${ethers.utils.formatEther(
      delegateTxReceipt.gasUsed.mul(delegateTxReceipt.effectiveGasPrice)
    )} ETH)`
  );
  //what else should happen

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
