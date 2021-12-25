import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const bundleDropModule = sdk.getBundleDropModule(
  "0xE27352d1899783c79aE82d819E3a176bCb47a63D"
);

(async () => {
  try {
    await bundleDropModule.createBatch([
      {
        name: "Hunger Fighter",
        description: "This NFT will give you access to HungerFightersDAO!",
        image: readFileSync("scripts/assets/hunger-fighter-nft.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
