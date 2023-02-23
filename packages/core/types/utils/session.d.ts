/// <reference types="node" />
import { SessionOptions } from '../types';
export declare class Session {
    sesessionOptions: SessionOptions;
    timeoutId?: string | number | NodeJS.Timeout;
    constructor(sessionOptions: SessionOptions);
    update(): void;
}
