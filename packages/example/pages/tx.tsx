/* eslint-disable no-alert */
import { Asset, AssetList } from "@chain-registry/types";
import { Center, Container } from "@chakra-ui/react";
import { StdFee } from "@cosmjs/amino";
import { SigningStargateClient } from "@cosmjs/stargate";
import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import { assets } from "chain-registry";
import { cosmos } from "juno-network";
import { useState } from "react";

import { ChainsTXWalletSection, SendTokensCard } from "../components";

const chainName = "cosmoshub";

const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;

const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === "uatom"
) as Asset;

const sendTokens = (
  getSigningStargateClient: () => Promise<SigningStargateClient>,
  setResp: (resp: string) => any,
  address: string
) => {
  return async () => {
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !address) {
      console.error("stargateClient undefined or address undefined.");
      return;
    }

    const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;

    const msg = send({
      amount: [
        {
          denom: coin.base,
          amount: "1000",
        },
      ],
      toAddress: address,
      fromAddress: address,
    });

    const fee: StdFee = {
      amount: [
        {
          denom: coin.base,
          amount: "2000",
        },
      ],
      gas: "86364",
    };
    try {
      const response = await stargateClient.signAndBroadcast(
        address,
        [msg],
        fee
      );
      setResp(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error(error);
    }
  };
};

export default function Home() {
  const { getSigningStargateClient, address, status, getRpcEndpoint } =
    useChain(chainName);

  const [balance, setBalance] = useState(new BigNumber(0));
  const [isFetchingBalance, setFetchingBalance] = useState(false);
  const [resp, setResp] = useState("");
  const getBalance = async () => {
    if (!address) {
      setBalance(new BigNumber(0));
      setFetchingBalance(false);
      return;
    }

    let rpcEndpoint = await getRpcEndpoint();

    if (!rpcEndpoint) {
      console.info("no rpc endpoint — using a fallback");
      rpcEndpoint = `https://rpc.cosmos.directory/${chainName}`;
    }

    // get RPC client
    const client = await cosmos.ClientFactory.createRPCQueryClient({
      rpcEndpoint,
    });

    // fetch balance
    const balance = await client.cosmos.bank.v1beta1.balance({
      address,
      denom: chainassets?.assets[0].base as string,
    });

    // Get the display exponent
    // we can get the exponent from chain registry asset denom_units
    const exp = coin.denom_units.find((unit) => unit.denom === coin.display)
      ?.exponent as number;

    // show balance in display values by exponentiating it
    const a = new BigNumber(balance.balance?.amount || 0);
    const amount = a.multipliedBy(10 ** -exp);
    setBalance(amount);
    setFetchingBalance(false);
  };

  return (
    <Container maxW="5xl" py={10}>
      <ChainsTXWalletSection chainName={chainName} />

      <Center mb={16}>
        <SendTokensCard
          isConnectWallet={status === "Connected"}
          balance={balance.toNumber()}
          isFetchingBalance={isFetchingBalance}
          response={resp}
          sendTokensButtonText="Send Tokens"
          handleClickSendTokens={sendTokens(
            getSigningStargateClient as () => Promise<SigningStargateClient>,
            setResp as () => any,
            address as string
          )}
          handleClickGetBalance={() => {
            setFetchingBalance(true);
            getBalance();
          }}
        />
      </Center>
    </Container>
  );
}
