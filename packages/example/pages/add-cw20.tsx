import { useChain } from "@cosmos-kit/react";
import { useMemo } from "react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";

const chainName = "juno";

export default () => {
  const {
    username,
    chain,
    connect,
    disconnect,
    wallet,
    status,
    assets,
    suggestToken,
  } = useChain(chainName);

  /**
   * Retrieve the first CW20 to provide an example
   */
  const cw20Tokens = useMemo(() => {
    if (assets) {
      return assets.assets
        .filter((asset) => asset.type_asset === "cw20")
        .slice(0, 1);
    }

    return [];
  }, [assets]);

  const getConnectbutton = () => {
    if (status === "Connecting") {
      return <button>{`Connecting ${wallet?.prettyName}`}</button>;
    }

    if (status === "Connected") {
      return (
        <div>
          <button>{wallet?.prettyName}</button>
          <button>{username}</button>
          <button
            onClick={async () => {
              await disconnect();
            }}
          >
            Disconnect
          </button>
          <button
            disabled={cw20Tokens.length === 0 || !chain}
            onClick={() => {
              if (chain) {
                suggestToken({
                  chainId: chain.chain_id,
                  chainName: chain.chain_name,
                  type: "cw20",
                  tokens: cw20Tokens.map((token) => ({
                    contractAddress: token.address ?? "",
                  })),
                });
              }
            }}
          >
            Suggest Tokens
          </button>
        </div>
      );
    }

    return <button onClick={() => connect()}>Connect Wallet</button>;
  };

  return (
    <div>
      <div>
        <h5>{chainName}</h5>
        {getConnectbutton()}
      </div>
    </div>
  );
};
