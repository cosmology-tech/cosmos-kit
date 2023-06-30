import { useManager } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

const address = "";

export default () => {
  // const { getNameService } = useChain("stargaze");
  const { getNameService } = useManager();
  const [resolvedName, setResolvedName] = useState<any>();

  useEffect(() => {
    const f = async () => {
      const ns = await getNameService();
      const name = await ns.resolveName(address);
      setResolvedName(name);
    };
    f();
  }, []);

  return <div>{resolvedName}</div>;
};
