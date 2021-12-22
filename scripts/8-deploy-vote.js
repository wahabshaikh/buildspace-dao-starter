import sdk from "./1-initialize-sdk.js";

const appModule = sdk.getAppModule(
  "0xd14e6D1901f4De7437BC6716A7d7332f51AdA887"
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      name: "GlobalHungerDAO's Epic Proposals",
      votingTokenAddress: "0x4c3A9483c65B4652aeA34EE7c89B8620715165fE",

      // After a proposal is created, when can members start voting?
      // For now, we set this to immediately.
      proposalStartWaitTimeInSeconds: 0,

      // How long do members have to vote on a proposal when it's created?
      // Here, we set it to 24 hours (86400 seconds)
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      // In order for a proposal to pass, a minimum x % of token must be used in the vote
      // 0 means the proposal will pass regardless of what % of token was used on the vote
      votingQuorumFraction: 0,

      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address
    );
  } catch (error) {
    console.log("Failed to deploy vote module", error);
  }
})();
