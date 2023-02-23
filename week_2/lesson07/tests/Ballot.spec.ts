import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const PROPOSALS = ["Proposal_1", "Proposal_2", "Proposal_3"];

function convertStringArrayToBytes32(array: string[]) {
  return array.map((e) => ethers.utils.formatBytes32String(e));
}

describe("Ballot", () => {
  let ballotContract: Ballot;
  let signers: SignerWithAddress[];
  let chairperson: string;

  beforeEach(async () => {
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotContractFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployTransaction.wait();
    signers = await ethers.getSigners();
    chairperson = await ballotContract.chairperson();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let i = 0; i < PROPOSALS.length; i++) {
        const expectedProposal = await ballotContract.proposals(i);
        expect(ethers.utils.parseBytes32String(expectedProposal.name)).to.eq(
          PROPOSALS[i]
        );
      }
    });

    it("sets the deployer address as the chairperson", async function () {
      const owner = await ballotContract.chairperson();
      expect(owner).to.eq(await signers[0].address);
    });

    it("should have 0 votes for proposals in the beginning", async () => {
      for (let i = 0; i < PROPOSALS.length; i++) {
        const expectedProposal = await ballotContract.proposals(i);
        expect(expectedProposal.voteCount).to.eq(0);
      }
    });

    it("should set the voting weight to 1", async () => {
      const chairperson = await ballotContract.chairperson();
      const chairpersonVoter = await ballotContract.voters(chairperson);
      const votingWeight = await chairpersonVoter.weight;
      expect(votingWeight).to.eq(1);
    });

    describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
      let newVoter: string;

      beforeEach(async () => {
        newVoter = signers[1].address;
      });

      it("gives right to vote for another address", async function () {
        expect((await ballotContract.voters(newVoter)).weight).to.eq(0);

        await ballotContract.giveRightToVote(newVoter);
        expect((await ballotContract.voters(newVoter)).weight).to.eq(1);
      });

      it("can not give right to vote for someone that has voted", async function () {
        expect((await ballotContract.voters(newVoter)).weight).to.eq(0);

        await ballotContract.giveRightToVote(newVoter);
        await ballotContract.connect(signers[1]).vote(0);
        expect((await ballotContract.voters(newVoter)).voted).to.eq(true);

        await expect(
          ballotContract.giveRightToVote(newVoter)
        ).to.be.revertedWith("The voter already voted.");
      });

      it("can not give right to vote for someone that has already voting rights", async function () {
        expect((await ballotContract.voters(newVoter)).weight).to.eq(0);

        await ballotContract.giveRightToVote(newVoter);
        expect((await ballotContract.voters(newVoter)).weight).to.eq(1);

        await expect(ballotContract.giveRightToVote(newVoter)).to.be.reverted;
      });
    });

    describe("when the voter interact with the vote function in the contract", function () {
      it("should register the vote", async () => {
        expect((await ballotContract.voters(chairperson)).voted).to.eq(false);
        expect((await ballotContract.voters(chairperson)).vote).to.eq(0);
        expect((await ballotContract.proposals(1)).voteCount).to.eq(0);

        await ballotContract.vote(1);

        expect((await ballotContract.voters(chairperson)).voted).to.eq(true);
        expect((await ballotContract.voters(chairperson)).vote).to.eq(1);
        expect((await ballotContract.proposals(1)).voteCount).to.eq(1);
      });
    });

    describe("when the voter interact with the delegate function in the contract", function () {
      it("should transfer voting power", async () => {
        const newVoter = signers[1].address;
        expect((await ballotContract.voters(newVoter)).weight).to.eq(0);
        expect((await ballotContract.voters(chairperson)).voted).to.eq(false);

        await ballotContract.giveRightToVote(newVoter);
        await ballotContract.delegate(newVoter);
        expect((await ballotContract.voters(newVoter)).weight).to.eq(2);
        expect((await ballotContract.voters(chairperson)).delegate).to.eq(
          newVoter
        );
        expect((await ballotContract.voters(chairperson)).voted).to.eq(true);
      });
    });

    // describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    //   // TODO
    //   it("should revert", async () => {
    //     throw Error("Not implemented");
    //   });
    // });

    // describe("when the an attacker interact with the vote function in the contract", function () {
    //   // TODO
    //   it("should revert", async () => {
    //     throw Error("Not implemented");
    //   });
    // });

    // describe("when the an attacker interact with the delegate function in the contract", function () {
    //   // TODO
    //   it("should revert", async () => {
    //     throw Error("Not implemented");
    //   });
    // });

    // describe("when someone interact with the winningProposal function before any votes are cast", function () {
    //   // TODO
    //   it("should return 0", async () => {
    //     throw Error("Not implemented");
    //   });
    // });

    // describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    //   // TODO
    //   it("should return 0", async () => {
    //     throw Error("Not implemented");
    //   });
    // });

    // describe("when someone interact with the winnerName function before any votes are cast", function () {
    //   // TODO
    //   it("should return name of proposal 0", async () => {
    //     throw Error("Not implemented");
    //   });
    // });

    // describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    //   // TODO
    //   it("should return name of proposal 0", async () => {
    //     throw Error("Not implemented");
    //   });
    // });

    // describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    //   // TODO
    //   it("should return the name of the winner proposal", async () => {
    //     throw Error("Not implemented");
    //   });
    // });
  });
});