import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { useEffect, useState } from "react";
import MintScreen from "./components/screens/mint";
import MemberScreen from "./components/screens/member";
import LandingScreen from "./components/screens/landing";

const sdk = new ThirdwebSDK("rinkeby");
const bundleDropModule = sdk.getBundleDropModule(
  "0xE27352d1899783c79aE82d819E3a176bCb47a63D"
);
const tokenModule = sdk.getTokenModule(
  "0xeb71623Aac588D7113FE7Fc5A5700e1FA92a6bF0"
);
const voteModule = sdk.getVoteModule(
  "0x28B0dD1F1d4925C6bFA6cF89bBC7f07aA52F522F"
);

const App = () => {
  const { address, provider } = useWeb3();
  console.log("👋 Address:", address);

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    if (!signer) return;
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  if (!address) return <LandingScreen />;

  if (!hasClaimedNFT)
    return (
      <MintScreen
        address={address}
        bundleDropModule={bundleDropModule}
        claimNFT={() => setHasClaimedNFT(true)}
      />
    );

  return (
    <MemberScreen
      address={address}
      bundleDropModule={bundleDropModule}
      tokenModule={tokenModule}
      voteModule={voteModule}
    />
  );
};

export default App;
