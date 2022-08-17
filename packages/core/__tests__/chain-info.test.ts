import { getChainInfo } from '../src/chainInfo';

it('works', async () => {
    const chain = await  getChainInfo('osmosis-1');
    expect(chain).toMatchSnapshot();
})