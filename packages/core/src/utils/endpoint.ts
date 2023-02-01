/* eslint-disable no-empty */
/* eslint-disable no-console */

export const isValidEndpoint = async (endpoint: string, verbose: boolean): Promise<boolean> => {
  if (verbose) {
    console.info(`Testing accessibility of ${endpoint}`);
  }
  try {
    const response = await fetch(endpoint);
    if (response.status == 200) {
      if (verbose) {
        console.info('Access successfully.');
      }
      return true;
    }
  } catch (err) {}
  if (verbose) {
    console.info('Access failed.');
  }
  return false;
};
