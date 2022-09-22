import { ChooseChainRecord } from "../components";
import { chains as chainsBase, assets as chainAssets } from 'chain-registry';

export const chainRecords: ChooseChainRecord[] = chainsBase
    .filter(chain => chain.network_type !== 'testnet')
    .map(chain => {
        const assets = chainAssets.find(
            _chain => _chain.chain_name === chain.chain_name
        )?.assets;
        return {
            chainName: chain.chain_name,
            label: chain.pretty_name,
            value: chain.chain_name,
            icon: assets ? assets[0]?.logo_URIs?.svg || assets[0]?.logo_URIs?.png : undefined,
            disabled: false
        }
    });