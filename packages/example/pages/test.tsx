import { useChainWallet, useChain } from "@cosmos-kit/react";
import { useEffect } from "react";

export default function TestPage() {
  const { getStargateClient } = useChain("cosmoshub");
  //   const { getStargateClient } = useChainWallet("cosmoshub", "keplr-extension");

  useEffect(() => {
    getStargateClient().then((client) => {
      console.log("%ctest.tsx line:9 client", "color: #007acc;", client);
    });
  }, []);

  return <div></div>;
}
