import {
  BundleDropModule,
  Proposal,
  TokenModule,
  VoteModule,
} from "@3rdweb/sdk";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import shortenAddress from "../../utils/shortenAddress";
import Container from "../Container";
import Heading from "../Heading";
import GradientText from "../GradientText";
import GradientBorderContainer from "../GradientBorderContainer";
import Button from "../Button";

interface MemberScreenProps {
  address: string;
  bundleDropModule: BundleDropModule;
  tokenModule: TokenModule;
  voteModule: VoteModule;
}

const MemberScreen = ({
  bundleDropModule,
  tokenModule,
  voteModule,
  address,
}: MemberScreenProps) => {
  const [memberAddresses, setMemberAddresses] = useState<string[]>([]);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<
    Record<string, ethers.BigNumber>
  >({});
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // Grab the users who hold our NFT with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresess) => {
        console.log("🚀 Members addresses", addresess);
        setMemberAddresses(addresess);
      })
      .catch((err) => {
        console.error("failed to get member list", err);
      });
  }, [bundleDropModule]);

  useEffect(() => {
    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts", amounts);
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("failed to get token amounts", err);
      });
  }, [tokenModule]);

  // Retreive all our existing proposals from the contract.
  useEffect(() => {
    // A simple call to voteModule.getAll() to grab the proposals.
    voteModule
      .getAll()
      .then((proposals) => {
        // Set state!
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals);
      })
      .catch((err) => {
        console.error("failed to get proposals", err);
      });
  }, [voteModule]);

  // We also need to check if the user already voted.
  useEffect(() => {
    // If we haven't finished retreieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return;
    }

    // Check if the user has already voted on the first proposal.
    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted);
        console.log("🥵 User has already voted");
      })
      .catch((err) => {
        console.error("failed to check if wallet has voted", err);
      });
  }, [proposals, address, voteModule]);

  return (
    <Container>
      <Heading>
        <GradientText>Hunger Fighters DAO</GradientText>
        <br />
        Member Page
      </Heading>
      <p className="mt-4 font-semibold">
        <GradientText variant="tertiary">
          Congratulations on being a member!
        </GradientText>{" "}
        🎉
      </p>
      <section className="mt-8 max-w-3xl mx-auto grid md:grid-cols-2 gap-8 px-4">
        <GradientBorderContainer variant="secondary">
          <h2 className="text-xl font-bold font-title">
            <GradientText variant="secondary">Member List</GradientText>
          </h2>
          <table className="mt-4 w-full text-left">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GradientBorderContainer>
        <GradientBorderContainer variant="secondary">
          <h2 className="text-xl font-bold font-title">
            <GradientText variant="secondary">Active Proposals</GradientText>
          </h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              //before we do async things, we want to disable the button to prevent double clicks
              setIsVoting(true);

              // lets get the votes from the form for the values
              const votes = proposals.map((proposal) => {
                let voteResult = {
                  proposalId: proposal.proposalId,
                  //abstain by default
                  vote: 2,
                };

                proposal.votes.forEach((vote) => {
                  const elem: any = document.getElementById(
                    proposal.proposalId + "-" + vote.type
                  );

                  if (elem?.checked) {
                    voteResult.vote = vote.type;
                    return;
                  }
                });
                return voteResult;
              });

              // first we need to make sure the user delegates their token to vote
              try {
                // we'll check if the wallet still needs to delegate their tokens before they can vote
                const delegation = await tokenModule.getDelegationOf(address);
                // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                if (delegation === ethers.constants.AddressZero) {
                  //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                  await tokenModule.delegateTo(address);
                }
                // then we need to vote on the proposals
                try {
                  await Promise.all(
                    votes.map(async (vote) => {
                      // before voting we first need to check whether the proposal is open for voting
                      // we first need to get the latest state of the proposal
                      const proposal = await voteModule.get(vote.proposalId);
                      // then we check if the proposal is open for voting (state === 1 means it is open)
                      if (proposal.state === 1) {
                        // if it is open for voting, we'll vote on it
                        return voteModule.vote(vote.proposalId, vote.vote);
                      }
                      // if the proposal is not open for voting we just return nothing, letting us continue
                      return;
                    })
                  );
                  try {
                    // if any of the propsals are ready to be executed we'll need to execute them
                    // a proposal is ready to be executed if it is in state 4
                    await Promise.all(
                      votes.map(async (vote) => {
                        // we'll first get the latest state of the proposal again, since we may have just voted before
                        const proposal = await voteModule.get(vote.proposalId);

                        //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                        if (proposal.state === 4) {
                          return voteModule.execute(vote.proposalId);
                        }
                      })
                    );
                    // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                    setHasVoted(true);
                    // and log out a success message
                    console.log("successfully voted");
                  } catch (err) {
                    console.error("failed to execute votes", err);
                  }
                } catch (err) {
                  console.error("failed to vote", err);
                }
              } catch (err) {
                console.error("failed to delegate tokens");
              } finally {
                // in *either* case we need to set the isVoting state to false to enable the button again
                setIsVoting(false);
              }
            }}
          >
            {proposals.map((proposal) => (
              <div key={proposal.proposalId}>
                <h5 className="font-medium">{proposal.description}</h5>
                <div className="mt-1.5 flex space-x-4">
                  {proposal.votes.map((vote) => (
                    <div key={vote.type}>
                      <input
                        type="radio"
                        id={proposal.proposalId + "-" + vote.type}
                        name={proposal.proposalId}
                        value={vote.type}
                        //default the "abstain" vote to checked
                        defaultChecked={vote.type === 2}
                      />
                      <label
                        htmlFor={proposal.proposalId + "-" + vote.type}
                        className="ml-1.5 font-medium"
                      >
                        {vote.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button
              variant="secondary"
              className="w-full px-4 py-2 font-semibold text-sm"
              disabled={isVoting || hasVoted}
              type="submit"
            >
              {isVoting
                ? "Voting..."
                : hasVoted
                ? "You Already Voted"
                : "Submit Votes"}
            </Button>
            <small className="block text-xs text-center">
              This will trigger multiple transactions that you will need to
              sign.
            </small>
          </form>
        </GradientBorderContainer>
      </section>
    </Container>
  );
};

export default MemberScreen;
