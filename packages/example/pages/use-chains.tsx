import Link from "next/link";
import { Button } from "components/button";
import { useChains } from "@cosmos-kit/react-lite";
import { useState, MouseEvent } from "react";

const CHAIN_NAMES = ['cosmoshub', 'osmosis', 'juno', 'akash', 'stargaze'];
const CHAIN_BUTTONS = [
  { value: 'mars', label: 'Add Mars Hub' },
  { value: 'migaloo', label: 'Add Migaloo' },
  { value: 'chihuahua', label: 'Add Chihuahua' }
];

export default function () {
  const [names, setNames] = useState(CHAIN_NAMES);
  const chains = useChains(names);
  const connected = Object.values(chains).every(chain => chain.isWalletConnected);
  const { connect, openView } = chains.cosmoshub;

  function onReset() {
    setNames(CHAIN_NAMES);
  }

  function onAddChain(e: MouseEvent) {
    const name = (e.target as HTMLButtonElement).dataset.name || '';
    if (names.includes(name)) return;
    setNames([...names, name]);
  }
  
  return <div className="space-y-4 mx-auto max-w-3xl">
    <div className="flex font-mono space-x-4">
      <p>Chains: </p>
      {names.map((name) => <p key={name} className="font-semibold">{name}</p>)}
    </div>
    <div className="flex space-x-2">
      {CHAIN_BUTTONS.map(({ value, label }) => (
        <Button
          key={value}
          data-name={value}
          onClick={onAddChain}
          disabled={names.includes(value)}
        >
          {label}
        </Button>
      ))}
      <Button onClick={onReset}>Reset</Button>
    </div>
    <hr />
    <Button onClick={() => connected ? openView() : connect() }>
      { connected ? 'Disconnect' : 'Connect' }
    </Button>
    <hr />
    <table className="table-fixed font-mono">
      <thead>
        <tr>
          <th className="w-80">Code</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(chains).map(([name, chain]) =>
          <tr key={name}>
            <td>chains.{name}.address</td>
            <td>{chain.address}</td>
          </tr>
        )}
      </tbody>
    </table>
    <hr />
    <p className="text-center"><Link href="/use-chain">See useChain</Link></p>
  </div>;
}