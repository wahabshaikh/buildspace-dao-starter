import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
  "0xeAbC04a6Ac8BF5C4eA4668F83DE7602A42529796"
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Hunger Fighter",
        description: "This NFT will give you access to GlobalHungerDAO!",
        image: readFileSync("scripts/assets/hungerfighter.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
