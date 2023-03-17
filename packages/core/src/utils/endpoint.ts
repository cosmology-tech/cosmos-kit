import { ExtendedHttpEndpoint } from '../types';
import { Logger } from './logger';

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
      response = await fetch(endpoint);
    } else {
      response = await fetch(endpoint.url, { headers: endpoint.headers });
    }

    if (response.status == 200) {
      logger?.debug('Access successfully.');
      return true;
    }
  } catch (err) {}
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
