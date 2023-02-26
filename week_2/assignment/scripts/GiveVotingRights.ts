// Add your script for giving voting rights

import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic || mnemonic?.length <= 0)
    throw new Error("Missing env: Menomic seed");

  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.ETHERSCAN_API_KEY
  );

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  console.log(`Connected to the wallet address ${wallet}`);

  const signer = wallet.connect(provider);

  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);

  ballotContract = ballotContractFactory.attach(process.env.CONTRACT_ADDRESS as string)
  // pick the contract address from the spreadsheet and add it to your .env file

  // Now give the voting rights here

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});