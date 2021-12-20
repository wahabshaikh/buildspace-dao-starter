import { ethers } from "ethers";
import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0xd14e6D1901f4De7437BC6716A7d7332f51AdA887");

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      name: "GlobalHungerDAO Membership",
      description: "A DAO for people striving to end global hunger.",
      image: readFileSync("scripts/assets/globalhungerdao.png"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });

    console.log(
      "✅ Successfully deployed bundleDrop module, address:",
      bundleDropModule.address
    );
    console.log(
      "✅ bundleDrop metadata:",
      await bundleDropModule.getMetadata()
    );
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})();
