import { useChainWallet } from "@cosmos-kit/react";
import { useEffect } from "react";

const Test = () => {
  const { getRpcEndpoint } = useChainWallet("cosmoshub", "keplr-extension");

  useEffect(() => {
    const fn = async () => {
      const rpc = await getRpcEndpoint();
      console.log("%cendpoint.tsx line:10 rpc", "color: #007acc;", rpc);
    };
    fn();
  }, []);

  return (
    <div>
      <button>Vote</button>
    </div>
  );
};

export default Test;
