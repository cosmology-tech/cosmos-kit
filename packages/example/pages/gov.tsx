/* eslint-disable no-alert */
import { Button, Center } from '@chakra-ui/react';
import { useWallet } from '@cosmos-kit/react';
import { useEffect } from 'react';


const Test = () => {
    const walletManager = useWallet();
    const { signAndBroadcast, connect, setCurrentWallet, setCurrentChain, address } = walletManager;

    useEffect(() => {
        const fn = async () => {
            setCurrentWallet('keplr-extension');
            setCurrentChain('osmosis');
            await connect();
        }
        fn();
    }, [connect, setCurrentWallet, setCurrentChain])

    const onClick = async () => {
        const voteMessages = [];

        voteMessages.push({
            typeUrl: '/cosmos.gov.v1beta1.MsgVote',
            value: {
                voter: address,
                proposalId: '360',
                option: 2
            }
        });

        const fee = {
            amount: [{
                denom: 'uosmo',
                amount: '0',
            }],
            gas: '200000',
        }

        const res = await signAndBroadcast(voteMessages, fee);

        if (res) {
            alert('Voted successfully!');
        }
    }

    return (
        <Center mb={16} my={24}>
            <Button onClick={onClick}>Vote</Button>
        </Center>
    )
}

export default Test;