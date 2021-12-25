import sdk from "./1-initialize-sdk.js";

const appModule = sdk.getAppModule(
  "0xd14e6D1901f4De7437BC6716A7d7332f51AdA887"
);

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await appModule.deployTokenModule({
      name: "HungerFightersDAO Governance Token",
      symbol: "HUNGERFIGHTER",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();
