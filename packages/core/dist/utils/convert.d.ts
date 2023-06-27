import { Chain, AssetList } from '@chain-registry/types';
import { c as SignerOptions, f as Endpoints, b as ChainRecord } from '../chain-932d9904.js';
import { Logger } from './logger.js';
import '@cosmjs/cosmwasm-stargate';
import '@cosmjs/stargate';
import '../types/common.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@walletconnect/types';
import 'cosmjs-types/cosmos/tx/v1beta1/tx';
import 'events';

declare function convertChain(chain: Chain, assetLists: AssetList[], signerOptions?: SignerOptions, preferredEndpoints?: Endpoints, isLazy?: boolean, logger?: Logger): ChainRecord;

export { convertChain };
