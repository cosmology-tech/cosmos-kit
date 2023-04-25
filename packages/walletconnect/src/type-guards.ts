import { hasKeyType } from '@cosmos-kit/core';
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

export const EthereumDocValidator = {
  isHexBytes(doc: unknown): doc is EthereumDoc.HexBytes {
    return typeof doc == 'string' && doc.startsWith('0x');
  },
};
