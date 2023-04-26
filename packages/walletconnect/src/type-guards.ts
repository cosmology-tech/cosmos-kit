import { hasKeyType, isArray } from '@cosmos-kit/core';
import { isAminoDoc } from '@cosmos-kit/cosmos';
import { CosmosDoc, EthereumDoc } from './types';

export const CosmosDocValidator = {
  isDirect(doc: unknown): doc is CosmosDoc.Direct {
    return hasKeyType(doc, {
      chainId: 'string',
      accountNumber: 'string',
      bodyBytes: 'string',
      authInfoBytes: 'string',
    });
  },
  isAmino(doc: unknown): doc is CosmosDoc.Amino {
    return isAminoDoc(doc);
  },
};
