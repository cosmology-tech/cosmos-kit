/* eslint-disable no-empty */
/* eslint-disable no-console */

import { Logger } from './logger';

export const isValidEndpoint = async (
  endpoint: string,
  logger?: Logger
): Promise<boolean> => {
  logger?.info(`Testing accessibility of ${endpoint}`);
  try {
    const response = await fetch(endpoint);
    if (response.status == 200) {
      logger?.info('Access successfully.');
      return true;
    }
  } catch (err) {}
  logger?.info('Access failed.');
  return false;
};
