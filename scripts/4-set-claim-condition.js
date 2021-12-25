import sdk from "./1-initialize-sdk.js";

const bundleDropModule = sdk.getBundleDropModule(
  "0xE27352d1899783c79aE82d819E3a176bCb47a63D"
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
