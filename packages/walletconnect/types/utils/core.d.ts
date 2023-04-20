import { OS } from '@cosmos-kit/core';
export declare const CoreUtil: {
    isHttpUrl(url: string): boolean;
    formatNativeUrl(appUrl: string, wcUri: string, os: OS, name: string): string;
    formatUniversalUrl(appUrl: string, wcUri: string, name: string): string;
    wait(miliseconds: number): Promise<unknown>;
    openHref(href: string, target?: string): void;
    setWalletConnectDeepLink(href: string, name: string): void;
    removeWalletConnectDeepLink(): void;
};
