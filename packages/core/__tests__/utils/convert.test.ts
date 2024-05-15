import { convertChain } from '../../src/utils/convert';
import { chains, assets } from 'chain-registry'

describe('convertChain', () => {

  it('should get converted result correctly', () => {
    const chainName = 'osmosis'
    const assetList = assets.find(a => a.chain_name === chainName);
    const signerOptions = {
      stargate: jest.fn().mockReturnValue('stargate'),
      signingStargate: jest.fn().mockReturnValue('signingStargate'),
      signingCosmwasm: jest.fn().mockReturnValue('signingCosmwasm'),
      preferredSignType: jest.fn().mockReturnValue('preferredSignType'),
    };
    const preferredEndpoints = { isLazy: true, rpc: ['http://test.rpc.com'], reset: ['http://test.rest.com'] };
    const isLazy = false;
    const logger = undefined;

    const result = {
      name: chainName,
      chain: void 0,
      assetList,
      clientOptions: {
        stargate: 'stargate',
        signingStargate: 'signingStargate',
        signingCosmwasm: 'signingCosmwasm',
        preferredSignType: 'preferredSignType',
      },
      preferredEndpoints: preferredEndpoints
    }

    expect(convertChain(chainName, assets, signerOptions, preferredEndpoints, isLazy, logger)).toEqual(result);
    expect(signerOptions.stargate).toBeCalledWith(chainName)
    expect(signerOptions.signingStargate).toBeCalledWith(chainName)
    expect(signerOptions.signingCosmwasm).toBeCalledWith(chainName)
    expect(signerOptions.preferredSignType).toBeCalledWith(chainName)
  });
});
