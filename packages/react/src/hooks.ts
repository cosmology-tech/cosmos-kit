import { CosmosManager } from '@cosmos-kit/core';
import React from 'react';

import { walletContext } from './provider';

export const useCosmos = (): CosmosManager => {
  const context = React.useContext(walletContext);

  if (!context || !context.cosmosManager) {
    throw new Error('You have forgot to use CosmosProvider');
  }

  return context.cosmosManager;
};
