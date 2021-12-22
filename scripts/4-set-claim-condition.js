import sdk from "./1-initialize-sdk.js";

const bundleDropModule = sdk.getBundleDropModule(
  "0xeAbC04a6Ac8BF5C4eA4668F83DE7602A42529796"
);

(async () => {
  try {
    const claimConditionFactory = bundleDropModule.getClaimConditionFactory();
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 786,
      maxQuantityPerTransaction: 1,
    });

    await bundleDropModule.setClaimCondition(0, claimConditionFactory);
    console.log("✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();
