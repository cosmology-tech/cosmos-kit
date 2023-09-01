import Link from "next/link";
import { useChains } from "@cosmos-kit/react-lite";
import { Button } from "components/button";

export default function () {
  const chains = useChains(['cosmoshub', 'osmosis', 'stargaze', 'juno', 'akash']);
  const connected = Object.values(chains).every(chain => chain.isWalletConnected);
  const { connect, openView } = chains.cosmoshub;
  
  return <div className="space-y-4 mx-auto max-w-3xl">
    <pre>
      <code>const chains = useChains(['cosmoshub', 'osmosis', 'stargaze', 'juno', 'akash']);</code>
    </pre>
    <Button onClick={() => connected ? openView() : connect() }>
      { connected ? 'Disconnect' : 'Connect' }
    </Button>
    <table className="table-fixed font-mono">
      <thead>
        <tr>
          <th className="w-80">Code</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>chains.cosmoshub.address</td>
          <td>{chains.cosmoshub.address}</td>
        </tr>
        <tr>
          <td>chains.osmosis.address</td>
          <td>{chains.osmosis.address}</td>
        </tr>
        <tr>
          <td>chains.stargaze.address</td>
          <td>{chains.stargaze.address}</td>
        </tr>
        <tr>
          <td>chains.juno.address</td>
          <td>{chains.juno.address}</td>
        </tr>
        <tr>
          <td>chains.akash.address</td>
          <td>{chains.akash.address}</td>
        </tr>
      </tbody>
    </table>
    <p className="text-center"><Link href="/use-chain">See useChain</Link></p>
  </div>;
}