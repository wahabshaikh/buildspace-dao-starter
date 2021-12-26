import { useWeb3 } from "@3rdweb/hooks";
import Button from "../Button";
import Container from "../Container";
import GradientText from "../GradientText";
import Heading from "../Heading";

const LandingScreen = () => {
  const { connectWallet } = useWeb3();

  return (
    <Container>
      <Heading>
        Welcome to <br />
        <GradientText>Hunger Fighters DAO</GradientText>
      </Heading>
      <Button variant="secondary" onClick={() => connectWallet("injected")}>
        Connect your wallet
      </Button>
    </Container>
  );
};

export default LandingScreen;
