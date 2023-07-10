import { useWalletClient } from "@cosmos-kit/react";

export default function () {
  const { status, client } = useWalletClient("keplr-extension");

  return <>{status}</>;
}
