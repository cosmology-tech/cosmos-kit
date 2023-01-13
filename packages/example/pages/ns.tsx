import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

const address = "";

export default () => {
  const { getNameService } = useChain("stargaze");
  const [resolvedName, setResolvedName] = useState<any>();

  useEffect(() => {
    const f = async () => {
      const ns = await getNameService();
      const name = await ns.resolveName(address);
      console.log("%cns.tsx line:43 name", "color: #007acc;", name);
      // setResolvedName(name);
    };
    f();
  }, []);

  return <div>{resolvedName}</div>;
};
