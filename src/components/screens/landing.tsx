import { useWeb3 } from "@3rdweb/hooks";

const LandingScreen = () => {
  const { connectWallet } = useWeb3();

  return (
    <div className="landing">
      <h1>Welcome to GlobalHungerDAO</h1>
      <button onClick={() => connectWallet("injected")} className="btn-hero">
        Connect your wallet
      </button>
    </div>
  );
};

export default LandingScreen;
