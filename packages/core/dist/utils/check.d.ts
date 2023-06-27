declare function checkInit(target: unknown, targetName?: string, msg?: string): void;
declare function checkKey(target: Map<unknown, unknown>, key: string, targetName?: string, msg?: string): void;

export { checkInit, checkKey };
