import Link from "next/link";
import { useChain } from "@cosmos-kit/react-lite";
import { Button } from "components/button";

export default function () {
  const cosmoshub = useChain('cosmoshub')

  return <div className="space-y-4 mx-auto max-w-3xl">
    <pre>
      <code>const cosmoshub = useChain('cosmoshub');</code>
    </pre>
    <Button onClick={() => cosmoshub.connect() }>
      { cosmoshub.isWalletConnected ? 'Disconnect' : 'Connect' }
    </Button>
    <p>Address: {cosmoshub.address}</p>
    <p className="text-center"><Link href="/use-chains">See useChains</Link></p>
  </div>;
}