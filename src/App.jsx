import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { useEffect, useState } from "react";

const sdk = new ThirdwebSDK("rinkeby");
const bundleDropModule = sdk.getBundleDropModule(
  "0xeAbC04a6Ac8BF5C4eA4668F83DE7602A42529796"
);

const App = () => {
  const { connectWallet, address, provider } = useWeb3();
  console.log("👋 Address:", address);

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to GlobalHungerDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>GlobalHungerDAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  }

  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .catch((err) => {
        console.error("failed to claim", err);
        setIsClaiming(false);
      })
      .finally(() => {
        setIsClaiming(false);
        setHasClaimedNFT(true);
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

export default App;
