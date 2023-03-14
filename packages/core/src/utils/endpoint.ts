import { Logger } from './logger';

export const isValidEndpoint = async (
  endpoint: string,
  logger?: Logger
): Promise<boolean> => {
  logger?.debug(`Testing accessibility of ${endpoint}`);
  try {
    const response = await fetch(endpoint);
    if (response.status == 200) {
      logger?.debug('Access successfully.');
      return true;
    }
  } catch (err) {}
  logger?.debug('Access failed.');
  return false;
};
