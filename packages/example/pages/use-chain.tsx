import Link from "next/link";
import { useState } from "react";
import { useChain } from "@cosmos-kit/react-lite";
import { Button } from "components/button";

export default function () {
  const [chainName, setChainName] = useState("cosmoshub");
  const chain = useChain(chainName);

  return (
    <div className="space-y-4 mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold">useChain</h1>
      <select
        value={chainName}
        onChange={(e) => setChainName(e.target.value)}
        className="h-9 px-3 mr-4 border rounded-md shadow-sm"
      >
        <option value="juno">Juno</option>
        <option value="osmosis">Osmosis</option>
        <option value="stargaze">Stargaze</option>
        <option value="cosmoshub">Cosmos Hub</option>
      </select>

      <Button onClick={() => chain.connect()}>
        {chain.isWalletConnected ? "Disconnect" : "Connect"}
      </Button>

      <p>Address: {chain.address}</p>
      <p className="text-center">
        <Link href="/use-chains">See useChains</Link>
      </p>
    </div>
  );
}
