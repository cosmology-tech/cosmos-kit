import { getModalFromVersion } from './modal';

export * from './hooks';
export * from './modal';
export { defaultTheme } from './modal/theme';
export * from './provider';
export const DefaultModal = getModalFromVersion('simple_v2');
