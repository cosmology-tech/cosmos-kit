import { ExtendedHttpEndpoint } from '../../src/types';
import { getFastestEndpoint, isValidEndpoint, getIsLazy } from '../../src/utils/endpoint';
import nock from 'nock'

describe('Endpoint Utils', () => {
  const fastUrl = 'http://fast.com';
  const slowUrl = 'http://slow.com';

  beforeEach(() => {
    nock(fastUrl).get('/cosmos/base/tendermint/v1beta1/node_info').reply(200, 'ok');
    nock(slowUrl).get('/cosmos/base/tendermint/v1beta1/node_info').delayConnection(50).reply(200, 'ok');
    nock(fastUrl).post('/').reply(200, 'ok');
    nock(slowUrl).post('/').delayConnection(50).reply(200, 'ok');
  })

  afterEach(() => {
    nock.cleanAll();
  })

  describe('getFastestEndpoint', () => {
    it('should return the fastest valid endpoint', async () => {
      const endpoints = [fastUrl, slowUrl];
      const nodeType = 'rpc';
      const logger = undefined;

      const result = await getFastestEndpoint(endpoints, nodeType, logger);

      expect(result).toBe(fastUrl)
    });

    it('should reject if no valid endpoint is found', async () => {
      const endpoints = ['http://invalid1.com', 'http://invalid2.com', 'http://invalid3.com'];
      const nodeType = 'rpc';
      const logger = undefined;

      await expect(() => getFastestEndpoint(endpoints, nodeType, logger)).rejects.toThrow()
    });
  });

  describe('isValidEndpoint', () => {
    it('should return true for a valid endpoint', async () => {
      const endpoint = fastUrl;
      const nodeType = 'rest';
      const isLazy = false;
      const logger = undefined;

      const result = await isValidEndpoint(endpoint, nodeType, isLazy, logger);

      expect(result).toBe(true);
    });

    it('should return true for a valid ExtendedHttpEndpoint with rest node type', async () => {
      const extendedEndpoint: ExtendedHttpEndpoint = {
        url: fastUrl,
        isLazy: false,
        headers: { 'Content-Type': 'application/json' },
      };
      const nodeType = 'rest';
      const isLazy = false;
      const logger = undefined;

      const result = await isValidEndpoint(extendedEndpoint, nodeType, isLazy, logger);

      expect(result).toBe(true);
    });

    it('should return true for a valid ExtendedHttpEndpoint with rpc node type', async () => {
      const extendedEndpoint: ExtendedHttpEndpoint = {
        url: fastUrl,
        isLazy: false,
        headers: { 'Content-Type': 'application/json' },
      };
      const nodeType = 'rpc';
      const isLazy = false;
      const logger = undefined;

      const result = await isValidEndpoint(extendedEndpoint, nodeType, isLazy, logger);

      expect(result).toBe(true);
    });

    it('should return false for an invalid endpoint', async () => {
      const endpoint = 'http://invalid-endpoint.com';
      const nodeType = 'rpc';
      const isLazy = false;
      const logger = undefined;

      const result = await isValidEndpoint(endpoint, nodeType, isLazy, logger);

      expect(result).toBe(false);
    });
  });

  describe('getIsLazy', () => {
    it('should return the value of parameterIsLazy if defined', () => {
      const globalIsLazy = undefined;
      const chainIsLazy = undefined;
      const endpointIsLazy = undefined;
      const parameterIsLazy = true;
      const logger = undefined;

      const result = getIsLazy(globalIsLazy, chainIsLazy, endpointIsLazy, parameterIsLazy, logger);

      expect(result).toBe(true);
    });

    it('should return the value of endpointIsLazy if defined', () => {
      const globalIsLazy = undefined;
      const chainIsLazy = undefined;
      const endpointIsLazy = true;
      const parameterIsLazy = undefined;
      const logger = undefined;

      const result = getIsLazy(globalIsLazy, chainIsLazy, endpointIsLazy, parameterIsLazy, logger);

      expect(result).toBe(true);
    });

    it('should return the value of chainIsLazy if defined', () => {
      const globalIsLazy = undefined;
      const chainIsLazy = true;
      const endpointIsLazy = undefined;
      const parameterIsLazy = undefined;
      const logger = undefined;

      const result = getIsLazy(globalIsLazy, chainIsLazy, endpointIsLazy, parameterIsLazy, logger);

      expect(result).toBe(true);
    });

    it('should return the value of globalIsLazy if defined', () => {
      const globalIsLazy = true;
      const chainIsLazy = undefined;
      const endpointIsLazy = undefined;
      const parameterIsLazy = undefined;
      const logger = undefined;

      const result = getIsLazy(globalIsLazy, chainIsLazy, endpointIsLazy, parameterIsLazy, logger);

      expect(result).toBe(true);
    });

    it('should return false if no lazy flag is defined', () => {
      const globalIsLazy = undefined;
      const chainIsLazy = undefined;
      const endpointIsLazy = undefined;
      const parameterIsLazy = undefined;
      const logger = undefined;

      const result = getIsLazy(globalIsLazy, chainIsLazy, endpointIsLazy, parameterIsLazy, logger);

      expect(result).toBe(false);
    });
  });
});
