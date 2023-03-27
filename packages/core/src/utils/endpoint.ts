import { ExtendedHttpEndpoint } from '../types';
import { Logger } from './logger';
import axios from 'axios';

const _getValidEndpoint = async (
  endpoint: string | ExtendedHttpEndpoint,
  logger?: Logger
): Promise<string | ExtendedHttpEndpoint> => {
  const valid = await isValidEndpoint(endpoint, false, logger);
  if (valid === false) {
    return Promise.reject('Invalid endpoint.');
  } else {
    return endpoint;
  }
};

export const getFastestEndpoint = async (
  endpoints: (string | ExtendedHttpEndpoint)[],
  logger?: Logger
): Promise<string | ExtendedHttpEndpoint> => {
  try {
    // Ping ALL rpc providers and go with the one that resolves the fastest
    const fastestEndpoint = await Promise.any(
      endpoints.map((endpoint) => _getValidEndpoint(endpoint, logger))
    );
    logger?.debug('rpcEndpoint won the race:', fastestEndpoint);
    return fastestEndpoint;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const isValidEndpoint = async (
  endpoint: string | ExtendedHttpEndpoint,
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
      response = await axios.get(`${endpoint}/status`);
    } else {
      response = await axios.get(`${endpoint.url}/status`, {
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
