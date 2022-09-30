import { BroadcastMode } from '@cosmjs/launchpad';
import { Buffer } from 'buffer/';

export async function sendTx(
  chainId: string,
  tx: Uint8Array,
  mode: BroadcastMode
): Promise<Uint8Array> {
  const params = {
    tx_bytes: Buffer.from(tx as any).toString('base64'),
    mode: (() => {
      switch (mode) {
        case 'async':
          return 'BROADCAST_MODE_ASYNC';
        case 'block':
          return 'BROADCAST_MODE_BLOCK';
        case 'sync':
          return 'BROADCAST_MODE_SYNC';
        default:
          return 'BROADCAST_MODE_UNSPECIFIED';
      }
    })(),
  };

  // const restInstance = Axios.create({
  //   baseURL: chains.find((chainRecord) => chainRecord.chain_id === chainId)!.apis
  //     ?.rest?.[0].address,
  // });

  // const result = await restInstance.post('/cosmos/tx/v1beta1/txs', params);

  // return Buffer.from(result.data['tx_response'].txhash, 'hex');
  return Buffer.from('asdfsdfsdf', 'hex');
}
