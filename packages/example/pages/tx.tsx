/* eslint-disable no-alert */
import { Asset, AssetList } from "@chain-registry/types";
import { Button, Center, Container } from "@chakra-ui/react";
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
          amount: "1",
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
  const {
    getSigningStargateClient,
    address,
    status,
    getRpcEndpoint,
    client,
  } = useChain(chainName);

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

  const directSignDoc = {
    bodyBytes:
      "0a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d120731323334353637",
    authInfoBytes:
      "0a0a0a0012040a020801180112130a0d0a0575636f736d12043230303010c09a0c",
    chainId: "cosmoshub-4",
    accountNumber: "1",
  };

  const aminoSignDoc = {
    msgs: [],
    fee: { amount: [], gas: "23" },
    chain_id: "foochain",
    memo: "hello, world",
    account_number: "7",
    sequence: "54",
  };
  //   bodyBytes: {
  //     "0": 10,
  //     "1": 141,
  //     "2": 1,
  //     "3": 10,
  //     "4": 28,
  //     "5": 47,
  //     "6": 99,
  //     "7": 111,
  //     "8": 115,
  //     "9": 109,
  //     "10": 111,
  //     "11": 115,
  //     "12": 46,
  //     "13": 98,
  //     "14": 97,
  //     "15": 110,
  //     "16": 107,
  //     "17": 46,
  //     "18": 118,
  //     "19": 49,
  //     "20": 98,
  //     "21": 101,
  //     "22": 116,
  //     "23": 97,
  //     "24": 49,
  //     "25": 46,
  //     "26": 77,
  //     "27": 115,
  //     "28": 103,
  //     "29": 83,
  //     "30": 101,
  //     "31": 110,
  //     "32": 100,
  //     "33": 18,
  //     "34": 109,
  //     "35": 10,
  //     "36": 45,
  //     "37": 99,
  //     "38": 111,
  //     "39": 115,
  //     "40": 109,
  //     "41": 111,
  //     "42": 115,
  //     "43": 49,
  //     "44": 107,
  //     "45": 48,
  //     "46": 99,
  //     "47": 53,
  //     "48": 53,
  //     "49": 108,
  //     "50": 99,
  //     "51": 109,
  //     "52": 115,
  //     "53": 114,
  //     "54": 118,
  //     "55": 114,
  //     "56": 106,
  //     "57": 50,
  //     "58": 106,
  //     "59": 51,
  //     "60": 57,
  //     "61": 116,
  //     "62": 122,
  //     "63": 52,
  //     "64": 100,
  //     "65": 53,
  //     "66": 121,
  //     "67": 101,
  //     "68": 121,
  //     "69": 115,
  //     "70": 118,
  //     "71": 100,
  //     "72": 100,
  //     "73": 50,
  //     "74": 112,
  //     "75": 107,
  //     "76": 50,
  //     "77": 48,
  //     "78": 97,
  //     "79": 101,
  //     "80": 51,
  //     "81": 116,
  //     "82": 18,
  //     "83": 45,
  //     "84": 99,
  //     "85": 111,
  //     "86": 115,
  //     "87": 109,
  //     "88": 111,
  //     "89": 115,
  //     "90": 49,
  //     "91": 107,
  //     "92": 48,
  //     "93": 99,
  //     "94": 53,
  //     "95": 53,
  //     "96": 108,
  //     "97": 99,
  //     "98": 109,
  //     "99": 115,
  //     "100": 114,
  //     "101": 118,
  //     "102": 114,
  //     "103": 106,
  //     "104": 50,
  //     "105": 106,
  //     "106": 51,
  //     "107": 57,
  //     "108": 116,
  //     "109": 122,
  //     "110": 52,
  //     "111": 100,
  //     "112": 53,
  //     "113": 121,
  //     "114": 101,
  //     "115": 121,
  //     "116": 115,
  //     "117": 118,
  //     "118": 100,
  //     "119": 100,
  //     "120": 50,
  //     "121": 112,
  //     "122": 107,
  //     "123": 50,
  //     "124": 48,
  //     "125": 97,
  //     "126": 101,
  //     "127": 51,
  //     "128": 116,
  //     "129": 26,
  //     "130": 13,
  //     "131": 10,
  //     "132": 5,
  //     "133": 117,
  //     "134": 97,
  //     "135": 116,
  //     "136": 111,
  //     "137": 109,
  //     "138": 18,
  //     "139": 4,
  //     "140": 49,
  //     "141": 48,
  //     "142": 48,
  //     "143": 48,
  //   },
  //   authInfoBytes: {
  //     "0": 10,
  //     "1": 78,
  //     "2": 10,
  //     "3": 70,
  //     "4": 10,
  //     "5": 31,
  //     "6": 47,
  //     "7": 99,
  //     "8": 111,
  //     "9": 115,
  //     "10": 109,
  //     "11": 111,
  //     "12": 115,
  //     "13": 46,
  //     "14": 99,
  //     "15": 114,
  //     "16": 121,
  //     "17": 112,
  //     "18": 116,
  //     "19": 111,
  //     "20": 46,
  //     "21": 115,
  //     "22": 101,
  //     "23": 99,
  //     "24": 112,
  //     "25": 50,
  //     "26": 53,
  //     "27": 54,
  //     "28": 107,
  //     "29": 49,
  //     "30": 46,
  //     "31": 80,
  //     "32": 117,
  //     "33": 98,
  //     "34": 75,
  //     "35": 101,
  //     "36": 121,
  //     "37": 18,
  //     "38": 35,
  //     "39": 10,
  //     "40": 33,
  //     "41": 2,
  //     "42": 123,
  //     "43": 95,
  //     "44": 132,
  //     "45": 216,
  //     "46": 243,
  //     "47": 9,
  //     "48": 173,
  //     "49": 101,
  //     "50": 180,
  //     "51": 186,
  //     "52": 195,
  //     "53": 204,
  //     "54": 31,
  //     "55": 112,
  //     "56": 147,
  //     "57": 72,
  //     "58": 68,
  //     "59": 245,
  //     "60": 25,
  //     "61": 250,
  //     "62": 129,
  //     "63": 76,
  //     "64": 159,
  //     "65": 15,
  //     "66": 96,
  //     "67": 138,
  //     "68": 125,
  //     "69": 98,
  //     "70": 53,
  //     "71": 160,
  //     "72": 64,
  //     "73": 216,
  //     "74": 18,
  //     "75": 4,
  //     "76": 10,
  //     "77": 2,
  //     "78": 8,
  //     "79": 1,
  //     "80": 18,
  //     "81": 19,
  //     "82": 10,
  //     "83": 13,
  //     "84": 10,
  //     "85": 5,
  //     "86": 117,
  //     "87": 97,
  //     "88": 116,
  //     "89": 111,
  //     "90": 109,
  //     "91": 18,
  //     "92": 4,
  //     "93": 50,
  //     "94": 48,
  //     "95": 48,
  //     "96": 48,
  //     "97": 16,
  //     "98": 220,
  //     "99": 162,
  //     "100": 5,
  //   },
  //   chainId: "cosmoshub-4",
  //   accountNumber: {
  //     low: 1521109,
  //     high: 0,
  //     unsigned: false,
  //   },
  // };

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
        <Button
          onClick={async () => {
            const r = await (client as any).getAccount("cosmoshub-4");
            console.log(
              "%ctx.tsx line:396 cosmos_getAccounts",
              "color: #007acc;",
              r
            );
          }}
        >
          cosmos_getAccounts
        </Button>
        <Button
          onClick={async () => {
            if (address) {
              const r = await client?.signAmino?.(
                "cosmoshub-4",
                address,
                aminoSignDoc
              );
              console.log(
                "%ctx.tsx line:396 cosmos_signDirect",
                "color: #007acc;",
                r
              );
            }
          }}
        >
          cosmos_signAmino
        </Button>
      </Center>
    </Container>
  );
}
