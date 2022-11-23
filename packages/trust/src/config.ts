import { EndpointOptions } from '@cosmos-kit/core';

export const preferredEndpoints: EndpointOptions = {
  osmosis: {
    rpc: ['https://us-osmosis1.twnodes.com'],
    rest: ['https://lcd-osmosis.blockapsis.com'],
  },
  cosmoshub: {
    rpc: ['https://us-cosmos1.twnodes.com/'],
    rest: ['https://us-cosmos2.twnodes.com/'],
  },
  kava: {
    rpc: ['https://api.kava.io'],
    rest: ['https://api.kava.io'],
  },
};
