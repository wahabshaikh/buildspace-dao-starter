import { BundleDropModule } from "@3rdweb/sdk";
import { useEffect, useState } from "react";
import Button from "../Button";
import Container from "../Container";
import GradientText from "../GradientText";
import Heading from "../Heading";

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
  }, [address, bundleDropModule, claimNFT]);

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
    <Container>
      <Heading>
        Mint your free <br />
        <GradientText>Hunger Fighters DAO</GradientText> <br />
        Membership NFT
      </Heading>
      <Button
        variant="secondary"
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your NFT (FREE)"}
      </Button>
    </Container>
  );
};

export default MintScreen;
