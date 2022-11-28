/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainWalletBase, ModalVersion } from '@cosmos-kit/core';
import { RefObject } from 'react';

import {
  DisplayWalletListType,
  SimpleDisplayWalletList,
  SimpleDisplayWalletListV1,
  SimpleModalHead,
  SimpleModalHeadType,
  SimpleModalHeadV1,
  Wallet,
} from '../components';
import { DisplayType } from '../types';

export const getWalletListView = (
  version: ModalVersion,
  wallets: ChainWalletBase[] = [],
  setOpen: (isOpen: boolean) => void,
  setDisplay: (display: DisplayType | undefined) => void,
  initialFocus: RefObject<any>
) => {
  let ModalHead: (props: SimpleModalHeadType) => JSX.Element,
    DisplayWalletList: (props: DisplayWalletListType) => JSX.Element;
  switch (version) {
    case 'simple_v1':
      DisplayWalletList = SimpleDisplayWalletListV1;
      ModalHead = SimpleModalHeadV1;
      break;
    case 'simple_v2':
      DisplayWalletList = SimpleDisplayWalletList;
      ModalHead = SimpleModalHead;
      break;
  }
  const walletsData = wallets.map(
    (w) =>
      ({
        ...w.walletInfo,
        downloads: void 0,
        onClick: async () => {
          setDisplay('single');
          console.log('%cwallet-list.tsx line:42 w', 'color: #007acc;', w);
          await w.connect();
        },
      } as Wallet)
  );
  return [
    <ModalHead
      title="Select your wallet"
      backButton={false}
      handleClose={() => setOpen(false)}
    />,
    <DisplayWalletList
      initialFocus={initialFocus}
      walletsData={
        version === 'simple_v2'
          ? walletsData.sort((a, b) => {
              if (a.mode === b.mode) {
                return 0;
              } else if (a.mode !== 'wallet-connect') {
                return -1;
              } else {
                return 1;
              }
            })
          : walletsData
      }
    />,
  ];
};
