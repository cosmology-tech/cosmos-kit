import { Asset,AssetList } from '@chain-registry/types';
import { Center, Container } from '@chakra-ui/react';
import { StdFee } from '@cosmjs/amino';
import { SigningStargateClient } from '@cosmjs/stargate';
import { WalletStatus } from '@cosmos-kit/core';
import { useWallet } from '@cosmos-kit/react';
import BigNumber from 'bignumber.js';
import { assets } from 'chain-registry';
import { cosmos } from 'juno-network';
import { useState } from 'react';

import { SendTokensCard, TXWalletSection } from '../components';

const chainName = 'juno';

const chainassets: AssetList = assets.find(
    (chain) => chain.chain_name === chainName
) as AssetList;

const coin: Asset = chainassets.assets.find(
    (asset) => asset.base === 'ujuno'
) as Asset;

const library = {
  title: 'Juno Network',
  text: 'Typescript libraries for the Juno ecosystem',
  href: 'https://github.com/CosmosContracts/typescript',
};

const sendTokens = (
  getSigningStargateClient: () => Promise<SigningStargateClient>,
  setResp: (resp: string) => any,
  address: string
) => {
  return async () => {
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !address) {
      console.error('stargateClient undefined or address undefined.');
      return;
    }

    const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;

    const msg = send({
      amount: [
        {
          denom: coin.base,
          amount: '1000',
        },
      ],
      toAddress: address,
      fromAddress: address,
    });

    const fee: StdFee = {
      amount: [
        {
          denom: coin.base,
          amount: '2000',
        },
      ],
      gas: '86364',
    };
    const response = await stargateClient.signAndBroadcast(address, [msg], fee);
    setResp(JSON.stringify(response, null, 2));
  };
};

export default function Home() {
  const { getSigningStargateClient, address, walletStatus, getRpcEndpoint } =
    useWallet();

  const [balance, setBalance] = useState(new BigNumber(0));
  const [isFetchingBalance, setFetchingBalance] = useState(false);
  const [resp, setResp] = useState('');
  const getBalance = async () => {
    if (!address) {
      setBalance(new BigNumber(0));
      setFetchingBalance(false);
      return;
    }

    let rpcEndpoint = await getRpcEndpoint();

    if (!rpcEndpoint) {
      console.log('no rpc endpoint — using a fallback');
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
      <TXWalletSection chainName={chainName}/>

      <Center mb={16}>
        <SendTokensCard
          isConnectWallet={walletStatus === WalletStatus.Connected}
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
