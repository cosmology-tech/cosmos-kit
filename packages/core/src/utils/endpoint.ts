/* eslint-disable no-empty */
/* eslint-disable no-console */

export const isValidEndpoint = async (endpoint: string): Promise<boolean> => {
  console.info(`Testing accessibility of ${endpoint}`);
  try {
    const response = await fetch(endpoint);
    if (response.status == 200) {
      console.info('Access successfully.');
      return true;
    }
  } catch (err) {}
  console.info('Access failed.');
  return false;
};
