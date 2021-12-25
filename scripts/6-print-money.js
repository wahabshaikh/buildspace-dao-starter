import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0xeb71623Aac588D7113FE7Fc5A5700e1FA92a6bF0"
);

(async () => {
  try {
    const amount = 786_000;
    // We use the util function from "ethers" to convert the amount
    // to have 18 decimals (which is the standard for ERC20 tokens).
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();

    // Print out how many of our token's are out there now!
    console.log(
      "✅ There now is",
      ethers.utils.formatUnits(totalSupply, 18),
      "$HUNGERFIGHTER in circulation"
    );
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
