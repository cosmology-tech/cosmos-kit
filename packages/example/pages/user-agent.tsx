import { ChainWalletBase } from "@cosmos-kit/core";
import { useManager } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

export default () => {
  const [ua, setua] = useState<string | undefined>();
  const [w, setw] = useState<ChainWalletBase | undefined>();
  const { getWalletRepo } = useManager();

  useEffect(() => {
    setua(window.navigator.userAgent);
    setw(getWalletRepo("cosmoshub").wallets[0]);
  }, []);

  return (
    <div>
      <div>user-agent: {ua}</div>
      <div>cosmos-kit device value: {w?.env?.device}</div>
      <div>cosmos-kit os value: {w?.env?.os}</div>
      <div>cosmos-kit browser value: {w?.env?.browser}</div>
      <div>cosmos-kit isMobile value: {w?.isMobile ? "true" : "false"}</div>
    </div>
  );
};
