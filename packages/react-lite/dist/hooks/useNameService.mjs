// src/hooks/useNameService.ts
import {
  getNameServiceRegistryFromName,
  State as State2
} from "@cosmos-kit/core";
import { useEffect as useEffect2, useMemo as useMemo2, useState as useState2 } from "react";

// src/hooks/useManager.ts
import React2 from "react";

// src/provider.tsx
import {
  Logger,
  State,
  WalletManager
} from "@cosmos-kit/core";
import {
  createContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var walletContext = createContext(null);

// src/hooks/useManager.ts
var useManager = () => {
  const context = React2.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }
  const {
    walletManager: {
      mainWallets,
      chainRecords,
      walletRepos,
      defaultNameService,
      getChainRecord,
      getWalletRepo,
      addChains,
      getChainLogo,
      getNameService,
      on,
      off
    }
  } = context;
  return {
    chainRecords,
    walletRepos,
    mainWallets,
    defaultNameService,
    getChainRecord,
    getWalletRepo,
    addChains,
    getChainLogo,
    getNameService,
    on,
    off
  };
};

// src/hooks/useNameService.ts
var useNameService = (name) => {
  const [state, setState] = useState2(State2.Pending);
  const [ns, setNS] = useState2();
  const [msg, setMsg] = useState2();
  const { defaultNameService, getNameService } = useManager();
  const registry = useMemo2(
    () => getNameServiceRegistryFromName(name || defaultNameService),
    [name]
  );
  if (!registry) {
    throw new Error("No such name service: " + (name || defaultNameService));
  }
  useEffect2(() => {
    getNameService().then((ns2) => {
      setNS(ns2);
      setState(State2.Done);
    }).catch((e) => {
      setMsg(e.message);
      setState(State2.Error);
    }).finally(() => {
      if (state === "Pending") {
        setState(State2.Init);
      }
    });
  }, [name]);
  return {
    state,
    data: ns,
    message: msg
  };
};
export {
  useNameService
};
//# sourceMappingURL=useNameService.mjs.map