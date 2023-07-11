import { ClipboardCopyText } from "@interchain-ui/react";
import { useChainWallet } from "@cosmos-kit/react";

export default () => {
  const context1 = useChainWallet("cosmoshub", "keplr-extension", false);
  // const context2 = useChainWallet("cosmoshub", "cosmostation-extension", false);
  return (
    <div>
      {[context1].map(({ username, address, connect, wallet }) => (
        <div key={wallet.name}>
          <span>{username || "--"}</span>
          <div>
            <ClipboardCopyText text={address ?? ""} />
          </div>
          <button onClick={connect}>Connect {wallet.prettyName}</button>
        </div>
      ))}
    </div>
  );
};
