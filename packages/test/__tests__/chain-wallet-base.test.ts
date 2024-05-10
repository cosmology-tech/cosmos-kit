import { ChainWalletBase, ChainRecord } from "@cosmos-kit/core";
import { chains } from "chain-registry";
import { mockExtensionInfo as walletInfo } from '../src/mock-extension/extension/registry';

// Mock global window object
global.window = {
    // @ts-ignore
    localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    }
};


const chainRecord: ChainRecord = {
    name: 'cosmoshub',
    chain: chains.find(c => c.chain_name === 'cosmoshub'),
    clientOptions: {
        preferredSignType: 'direct'
    },
};

const chainWallet = new ChainWalletBase(walletInfo, chainRecord);

async function connectAndFetchAccount() {
    try {
        await chainWallet.update({ connect: true });
        console.log('Connected and account data fetched:', chainWallet.data);
    } catch (error) {
        console.error('Failed to connect or fetch account data:', error);
    }
}

connectAndFetchAccount();

describe('ChainWalletBase', () => {
    let chainWallet;
    beforeEach(() => {
        chainWallet = new ChainWalletBase(walletInfo, chainRecord);
        // Mocking necessary methods and properties
        // jest.spyOn(chainWallet, 'connectChains').mockResolvedValue(undefined);
        jest.spyOn(chainWallet.client, 'getSimpleAccount').mockResolvedValue({
            namespace: 'cosmos',
            chainId: 'cosmoshub-4',
            address: 'cosmos1...'
        });
    });

    it('should update and fetch account data', async () => {
        await expect(chainWallet.update({ connect: true })).resolves.not.toThrow();
        expect(chainWallet.data.address).toBe('cosmos1...');
    });
});
