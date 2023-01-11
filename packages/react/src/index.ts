import { getModal } from './modal';

export * from './hooks';
export * from './modal/get-modal';
export * from './modal/theme';
export * from './provider';

export const DefaultModal = getModal('simple_v2');
