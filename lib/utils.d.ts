/// <reference types="node" />
import BigNumber from 'bignumber.js';
export declare function getAccountPath(index: number): number[];
export declare type BufferInput = string | number | Buffer | BigNumber | undefined;
export declare function toSafeBuffer(value: BufferInput): Buffer;
export declare function hexencode(arr: Uint8Array | number[], addHexPrefix?: boolean): string;
export declare function hexdecode(hexstring: string): Buffer;
