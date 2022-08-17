import { getKeplrChainInfoLegacy } from '../src/keplrChainInfo';
import { getKeplrChainInfo } from '../src/chainInfo';
import { chains, assets } from 'chain-registry'

const testChainData = async (chainName, chainId) => {
    const old = await getKeplrChainInfoLegacy(chainId);
    expect(old).toMatchSnapshot();
    const chain = await getKeplrChainInfo(chainName, chains, assets);
    expect(chain).toMatchSnapshot();
};

it('osmosis', async () => {
    const chainName = 'osmosis';
    const chainId = 'osmosis-1';
    await testChainData(chainName, chainId);
})

it('gravity', async () => {
    const chainName = 'gravitybridge';
    const chainId = 'gravity-bridge-3';
    await testChainData(chainName, chainId);
})

it('persistence', async () => {
    const chainName = 'persistence';
    const chainId = 'core-1';
    await testChainData(chainName, chainId);
})

it('kava', async () => {
    const chainName = 'kava';
    const chainId = 'kava_2222-10';
    await testChainData(chainName, chainId);
})