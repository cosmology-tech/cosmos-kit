import axios from 'axios';

import { ExtendedHttpEndpoint } from '../types';
import { Logger } from './logger';

type NodeType = 'rest' | 'rpc';

const _getValidEndpoint = async (
  endpoint: string | ExtendedHttpEndpoint,
  nodeType: NodeType,
  logger?: Logger
): Promise<string | ExtendedHttpEndpoint> => {
  const valid = await isValidEndpoint(endpoint, nodeType, false, logger);
  if (valid === false) {
    return Promise.reject('Invalid endpoint.');
  } else {
    return endpoint;
  }
};

export const getFastestEndpoint = async (
  endpoints: (string | ExtendedHttpEndpoint)[],
  nodeType: NodeType,
  logger?: Logger
): Promise<string | ExtendedHttpEndpoint> => {
  try {
    // Ping ALL rpc providers and go with the one that resolves the fastest
    const fastestEndpoint = await Promise.any(
      endpoints.map((endpoint) => _getValidEndpoint(endpoint, nodeType, logger))
    );
    logger?.debug('rpcEndpoint won the race:', fastestEndpoint);
    return fastestEndpoint;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const isValidEndpoint = async (
  endpoint: string | ExtendedHttpEndpoint,
  nodeType: NodeType,
  isLazy?: boolean,
  logger?: Logger
): Promise<boolean> => {
  if (isLazy) {
    logger?.debug('Skipping test of accessibility for', endpoint);
    return true;
  }

  logger?.debug('Testing accessibility of', endpoint);
  try {
    let response: Response;
    if (typeof endpoint === 'string') {
      response =
        nodeType === 'rest'
          ? /**
             * The verification process for the Rest API differs from that of RPC.
             * Rather than checking for JSON-RPC availability, we verify the node
             * information is available.
             */
            await axios.get(
              `${endpoint}/cosmos/base/tendermint/v1beta1/node_info`
            )
          : /**
             * SigningStargate uses JSON-RPC requests to broadcast transactions.
             * To ensure that the node has this capability, conduct a POST request
             * to the endpoint to verify its accessibility in advance. Note that
             * SigningStargate also performs this internal check.
             */
            await axios.post(endpoint);
    } else {
      response =
        nodeType === 'rest'
          ? /**
             * The verification process for the Rest API differs from that of RPC.
             * Rather than checking for JSON-RPC availability, we verify the node
             * information is available.
             */
            await axios.get(
              `${endpoint.url}/cosmos/base/tendermint/v1beta1/node_info`,
              {
                headers: endpoint.headers,
              }
            )
          : /**
             * SigningStargate uses JSON-RPC requests to broadcast transactions.
             * To ensure that the node has this capability, conduct a POST request
             * to the endpoint to verify its accessibility in advance. Note that
             * SigningStargate also performs this internal check.
             */
            await axios.post(endpoint.url, {
              headers: endpoint.headers,
            });
    }
    if (response.status == 200) {
      logger?.debug('Access successfully.');
      return true;
    }
  } catch (err) {
    logger?.debug(`${(err as Error).name}: ${(err as Error).message}`);
  }
  logger?.debug('Access failed.');
  return false;
};

export const getIsLazy = (
  globalIsLazy?: boolean,
  chainIsLazy?: boolean,
  endpointIsLazy?: boolean,
  parameterIsLazy?: boolean,
  logger?: Logger
) => {
  // logger?.debug(
  //   'Value of globalIsLazy, chainIsLazy, endpointIsLazy and parameterIsLazy:',
  //   globalIsLazy,
  //   chainIsLazy,
  //   endpointIsLazy,
  //   parameterIsLazy
  // );
  if (typeof parameterIsLazy !== 'undefined') {
    return parameterIsLazy;
  }
  if (typeof endpointIsLazy !== 'undefined') {
    return endpointIsLazy;
  }
  if (typeof chainIsLazy !== 'undefined') {
    return chainIsLazy;
  }
  if (typeof globalIsLazy !== 'undefined') {
    return globalIsLazy;
  }
  return false;
};
