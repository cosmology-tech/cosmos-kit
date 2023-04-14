import { wasmTypes } from '@cosmjs/cosmwasm-stargate/build/modules';
import {
  AccountData,
  DirectSecp256k1Wallet,
  DirectSignResponse,
  OfflineDirectSigner,
} from '@cosmjs/proto-signing';
import { Registry } from '@cosmjs/proto-signing/build/registry';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import { SignDoc, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import { Web3AuthClient } from './client';

const registry = new Registry([...defaultRegistryTypes, ...wasmTypes]);

export class Web3AuthCustomSigner implements OfflineDirectSigner {
  client: Web3AuthClient;
  chainId: string;

  constructor(client: Web3AuthClient, chainId: string) {
    this.client = client;
    this.chainId = chainId;
  }

  async getSigner(chainId: string): Promise<DirectSecp256k1Wallet> {
    if (!this.client.signers[chainId]) {
      await this.client.connect(chainId);
    }

    return this.client.signers[chainId];
  }

  async getAccounts(): Promise<readonly AccountData[]> {
    return (await this.getSigner(this.chainId)).getAccounts();
  }

  async signDirect(
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    if (signDoc.chainId !== this.chainId) {
      throw new Error('Chain ID mismatch');
    }

    const signer = await this.getSigner(signDoc.chainId);

    // TODO: Improve prompt UI.
    const decodedMessages = TxBody.decode(signDoc.bodyBytes).messages.map(
      (message) => ({
        '@type': message.typeUrl,
        ...registry.decode(message),
      })
    );

    return new Promise((resolve, reject) => {
      // Add modal to body.
      const modal = document.createElement('div');
      modal.id = 'web3auth-modal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.zIndex = '999999';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      document.body.appendChild(modal);

      // Add modal content.
      const modalContent = document.createElement('div');
      modalContent.style.backgroundColor = '#fff';
      modalContent.style.padding = '1rem';
      modalContent.style.borderRadius = '0.5rem';
      modalContent.style.maxWidth = '50rem';
      modalContent.style.width = '100%';
      modalContent.style.maxHeight = '50rem';
      modalContent.style.overflow = 'auto';
      modal.appendChild(modalContent);

      // Add modal title.
      const modalTitle = document.createElement('h2');
      modalTitle.innerText = 'Web3Auth';
      modalTitle.style.margin = '0';
      modalTitle.style.padding = '0';
      modalTitle.style.fontSize = '1.5rem';
      modalTitle.style.fontWeight = 'bold';
      modalContent.appendChild(modalTitle);

      // Add modal description.
      const modalDescription = document.createElement('p');
      modalDescription.innerText = 'Sign transaction?';
      modalDescription.style.margin = '0';
      modalDescription.style.padding = '0';
      modalDescription.style.fontSize = '1rem';
      modalDescription.style.fontWeight = 'normal';
      modalContent.appendChild(modalDescription);

      // Add modal JSON.
      const modalJson = document.createElement('pre');
      modalJson.innerText = JSON.stringify(decodedMessages, null, 2);
      modalJson.style.margin = '0';
      modalJson.style.padding = '0';
      modalJson.style.fontSize = '1rem';
      modalJson.style.fontWeight = 'normal';
      modalContent.appendChild(modalJson);

      // Add modal buttons.
      const modalButtons = document.createElement('div');
      modalButtons.style.margin = '0';
      modalButtons.style.padding = '0';
      modalButtons.style.display = 'flex';
      modalButtons.style.justifyContent = 'flex-end';
      modalContent.appendChild(modalButtons);

      // Add modal cancel button.
      const modalCancelButton = document.createElement('button');
      modalCancelButton.innerText = 'Cancel';
      modalCancelButton.style.margin = '0';
      modalCancelButton.style.padding = '0.5rem 1rem';
      modalCancelButton.style.fontSize = '1rem';
      modalCancelButton.style.fontWeight = 'bold';
      modalCancelButton.style.backgroundColor = '#fff';
      modalCancelButton.style.border = '1px solid #000';
      modalCancelButton.style.borderRadius = '0.25rem';
      modalCancelButton.style.cursor = 'pointer';
      modalCancelButton.onclick = () => {
        const modal = document.getElementById('web3auth-modal');
        if (modal) {
          modal.remove();
        }
        reject(new Error('Request rejected'));
      };
      modalButtons.appendChild(modalCancelButton);

      // Add modal confirm button.
      const modalConfirmButton = document.createElement('button');
      modalConfirmButton.innerText = 'Confirm';
      modalConfirmButton.style.margin = '0 0 0 0.5rem';
      modalConfirmButton.style.padding = '0.5rem 1rem';
      modalConfirmButton.style.fontSize = '1rem';
      modalConfirmButton.style.fontWeight = 'bold';
      modalConfirmButton.style.backgroundColor = '#000';
      modalConfirmButton.style.color = '#fff';
      modalConfirmButton.style.border = '1px solid #000';
      modalConfirmButton.style.borderRadius = '0.25rem';
      modalConfirmButton.style.cursor = 'pointer';
      modalConfirmButton.onclick = () => {
        const modal = document.getElementById('web3auth-modal');
        if (modal) {
          modal.remove();
        }
        signer.signDirect(signerAddress, signDoc).then(resolve).catch(reject);
      };
      modalButtons.appendChild(modalConfirmButton);
    });
  }
}
