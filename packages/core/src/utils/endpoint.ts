import { HttpEndpoint } from '@cosmjs/cosmwasm-stargate';

import { Logger } from './logger';

export const isValidEndpoint = async (
  endpoint: string | HttpEndpoint,
  shouldValidate: boolean,
  logger?: Logger
): Promise<boolean> => {
  if (!shouldValidate) {
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
