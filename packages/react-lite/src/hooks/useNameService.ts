import {
  getNameServiceRegistryFromName,
  Mutable,
  NameService,
  NameServiceName,
  State,
} from '@cosmos-kit/core';
import { useEffect, useMemo, useState } from 'react';

import { useManager } from './useManager';

export const useNameService = (
  name?: NameServiceName
): Mutable<NameService> => {
  const [state, setState] = useState<State>(State.Pending);
  const [ns, setNS] = useState<NameService>();
  const [msg, setMsg] = useState<string>();

  const { defaultNameService, getNameService } = useManager();
  const registry = useMemo(
    () => getNameServiceRegistryFromName(name || defaultNameService),
    [name]
  );

  if (!registry) {
    throw new Error('No such name service: ' + (name || defaultNameService));
  }

  useEffect(() => {
    getNameService()
      .then((ns) => {
        setNS(ns);
        setState(State.Done);
      })
      .catch((e) => {
        setMsg((e as Error).message);
        setState(State.Error);
      })
      .finally(() => {
        if (state === 'Pending') {
          setState(State.Init);
        }
      });
  }, [name]);

  return {
    state,
    data: ns,
    message: msg,
  };
};
