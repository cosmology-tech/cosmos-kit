/// <reference types="node" />
import { SessionOptions } from '../types';
export declare class Session {
    sessionOptions: SessionOptions;
    timeoutId?: string | number | NodeJS.Timeout;
    constructor(sessionOptions: SessionOptions);
    update(): void;
}
