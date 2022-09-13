import { ChainRegistry } from "@cosmos-kit/core";
import { WCKeplrWallet } from "@cosmos-kit/keplr";
import { QRCode } from "@cosmos-kit/react/src/modal/ConnectModal";
import { chains as rawChains } from 'chain-registry';
import { useEffect, useState } from "react";
import { convert } from "../utils";

const chains: ChainRegistry[] = rawChains
  .filter((chain) => chain.network_type !== 'testnet')
  .map((chain) => convert(chain));

export default () => {
    const [state, setState] = useState<string | undefined>()
    const [username, setUsername] = useState<string | undefined>()
    const [uri, setUri] = useState<string | undefined>()
    const keplr = new WCKeplrWallet();
    keplr.setSupportedChains(chains);
    useEffect(() => {
        const fn = async () => {
            await keplr.update();
            setState(keplr.state);
            setUsername(keplr.username);
            setUri(keplr.qrUri)
        }
        fn();
    }, [])
    
    return (
        <div>
            {uri && <QRCode link={uri}></QRCode>}
            <div>{state}</div>
        </div>
    )
}