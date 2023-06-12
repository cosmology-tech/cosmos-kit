import { useManager, useWallet } from "@cosmos-kit/react";
import { useEffect } from "react";

export default function Page() {
  const { mainWallets } = useManager();
  const { mainWallet } = useWallet();
  console.log(
    "%cuse-wallet.tsx line:6 mainWallet",
    "color: #007acc;",
    mainWallet
  );
  useEffect(() => {
    mainWallets[0]?.connect();
    // mainWallets[0]?.disconnect();
  }, []);
  return <></>;
}
