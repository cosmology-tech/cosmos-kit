import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useCosmos } from "@cosmos-kit/react";


const Test = () => {
    const cosmosManager = useCosmos();
    const { signAndBroadcast, connect, setCurrentWallet, setCurrentChain, address } = cosmosManager;

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
                proposalId: "350",
                option: 1
            }
        });

        // const fee = {
        //     amount: [{
        //         denom: 'uosmo',
        //         amount: '0',
        //     }],
        //     gas: '200000',
        // }

        const res = await signAndBroadcast(voteMessages);
        console.log(111, res)
    }

    return (
        <div>
            <Button onClick={onClick}>Vote</Button>
        </div>
    )
}

export default Test;