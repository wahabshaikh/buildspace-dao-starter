import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const voteModule = sdk.getVoteModule(
  "0x28B0dD1F1d4925C6bFA6cF89bBC7f07aA52F522F"
);

const tokenModule = sdk.getTokenModule(
  "0xeb71623Aac588D7113FE7Fc5A5700e1FA92a6bF0"
);

(async () => {
  try {
    // Give our treasury the power to mint additional token if needed.
    await tokenModule.grantRole("minter", voteModule.address);

    console.log(
      "Successfully gave vote module permissions to act on token module"
    );
  } catch (error) {
    console.error(
      "failed to grant vote module permissions on token module",
      error
    );
    process.exit(1);
  }

  try {
    // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Grab 78% of the supply that we hold.
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent78 = ownedAmount.div(100).mul(78);

    // Transfer 78% of the supply to our voting contract.
    await tokenModule.transfer(voteModule.address, percent78);

    console.log("✅ Successfully transferred tokens to vote module");
  } catch (error) {
    console.error("failed to transfer tokens to vote module", error);
  }
})();
