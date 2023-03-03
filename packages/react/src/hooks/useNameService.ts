import {
  getNameServiceRegistryFromName,
  Mutable,
  NameService,
  NameServiceName,
  State,
} from '@cosmos-kit/core';
import React, { useState } from 'react';
import { useChain } from './useChain';
import { useManager } from './useManager';

export const useNameService = (
  name?: NameServiceName
): Mutable<NameService> => {
  const [state, setState] = useState<State>(State.Pending);
  const [ns, setNs] = useState<NameService>();
  const [msg, setMsg] = useState<string>();

  const { defaultNameService } = useManager();
  const registry = getNameServiceRegistryFromName(name || defaultNameService);
  if (!registry) {
    throw new Error('No such name service: ' + (name || defaultNameService));
  }

  const { getCosmWasmClient } = useChain(registry.chainName);

  getCosmWasmClient()
    .then((client) => {
      setNs(new NameService(client, registry));
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
  return {
    state,
    data: ns,
    message: msg,
  };
};
