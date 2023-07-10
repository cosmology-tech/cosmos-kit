import { useWalletClient } from "@cosmos-kit/react";

export default function () {
  const { status, client } = useWalletClient("keplr-extension");

  console.log(
    "%cuse-wallet-client.tsx line:6 client",
    "color: #007acc;",
    client
  );
  return <>{status}</>;
}
