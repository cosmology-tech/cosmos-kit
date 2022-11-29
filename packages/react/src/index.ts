import { getModal, getModalV2 } from './modal';

export * from './hooks';
export * from './modal/get-modal';
export * from './modal/theme';
export * from './provider';
export * from './provider-v2';

export const DefaultModal = getModal('simple_v2');
export const DefaultModalV2 = getModalV2('simple_v2');
