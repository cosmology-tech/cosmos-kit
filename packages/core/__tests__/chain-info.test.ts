import { getKeplrChainInfo } from '../src/chainInfo';
import { chains, assets } from 'chain-registry'

const testChainData = async (chainName) => {
    const chain = getKeplrChainInfo(chainName, chains, assets);
    expect(chain).toMatchSnapshot();
};

it('osmosis', async () => {
    const chainName = 'osmosis';
    const chainId = 'osmosis-1';
    await testChainData(chainName);
})

it('gravity', async () => {
    const chainName = 'gravitybridge';
    const chainId = 'gravity-bridge-3';
    await testChainData(chainName);
})

it('persistence', async () => {
    const chainName = 'persistence';
    const chainId = 'core-1';
    await testChainData(chainName);
})

it('kava', async () => {
    const chainName = 'kava';
    const chainId = 'kava_2222-10';
    await testChainData(chainName);
})