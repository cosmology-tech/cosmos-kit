import { getChainInfo } from '../src/chainInfo';

it('osmosis', async () => {
    const chain = await  getChainInfo('osmosis-1');
    expect(chain).toMatchSnapshot();
})

it('gravity', async () => {
    const chain = await  getChainInfo('gravity-bridge-3');
    expect(chain).toMatchSnapshot();
})

it('persistence', async () => {
    const chain = await  getChainInfo('core-1');
    expect(chain).toMatchSnapshot();
})

it('kava', async () => {
    const chain = await  getChainInfo('kava_2222-10');
    expect(chain).toMatchSnapshot();
})