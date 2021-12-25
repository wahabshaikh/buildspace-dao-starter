import { BundleDropModule } from "@3rdweb/sdk";
import { useEffect, useState } from "react";

interface MintScreenProps {
  address: string;
  bundleDropModule: BundleDropModule;
  claimNFT: () => void;
}
const MintScreen = ({
  address,
  bundleDropModule,
  claimNFT,
}: MintScreenProps) => {
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // Check if the user has the NFT by using bundleDropModule.balanceOf
    bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          claimNFT();
          console.log("🌟 this user has a membership NFT!");
        } else {
          console.log("😭 this user doesn't have a membership NFT.");
        }
      })
      .catch((error) => {
        console.error("failed to nft balance", error);
      });
  }, [address]);

  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .catch((error) => {
        console.error("failed to claim", error);
        setIsClaiming(false);
      })
      .finally(() => {
        setIsClaiming(false);
        claimNFT();
        console.log(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
      });
  };

  return (
    <div className="mint-nft">
      <h1>Mint your free GlobalHungerDAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default MintScreen;
