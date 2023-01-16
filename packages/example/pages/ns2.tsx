import { useNameService } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

const address = "";

export default () => {
  const { state, data: ns } = useNameService();
  const [resolvedName, setResolvedName] = useState<any>();

  useEffect(() => {
    const f = async () => {
      const name = await ns?.resolveName(address);
      setResolvedName(name);
    };
    f();
  }, [ns]);

  return <div>{resolvedName}</div>;
};
