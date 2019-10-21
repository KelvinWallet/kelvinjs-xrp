import BigNumber from 'bignumber.js';

export function getAccountPath(index: number): number[] {
  return [0x80000000 + index, 0, 0];
}

export type BufferInput = string | number | Buffer | BigNumber | undefined;

export function toSafeBuffer(value: BufferInput): Buffer {
  let result: Buffer;
  if (typeof value === 'string') {
    if (!/^(0x)?([0-9a-fA-F]+)?$/.test(value)) {
      throw Error(`invalid string: "${value}"`);
    }
    if (/^[0-9]+$/.test(value)) {
      const bigNumber = new BigNumber(value);
      result = hexdecode(bigNumber.toString(16));
    } else {
      result = hexdecode(value);
    }
  } else if (typeof value === 'number') {
    if (value < 0 || Math.floor(value) !== value) {
      throw Error(`invalid number: ${value}, only accept uint`);
    }

    const byteLength = Math.max(1, Math.ceil(Math.log2(value) / 8));
    result = Buffer.alloc(byteLength);
    result.writeUIntBE(value, 0, byteLength);
  } else if (value instanceof Buffer) {
    result = value;
  } else if (value instanceof BigNumber) {
    result = hexdecode(value.toString(16));
  } else if (typeof value === 'undefined') {
    result = Buffer.alloc(0);
  } else {
    throw Error(`invalid type ${typeof value}`);
  }

  while (result[0] === 0) {
    result = result.slice(1);
  }

  return result;
}

export function hexencode(
  arr: Uint8Array | number[],
  addHexPrefix: boolean = false,
): string {
  if (!(arr instanceof Uint8Array || arr instanceof Array)) {
    throw new Error('input type error');
  }

  const uint8Array = new Uint8Array(arr);
  const buffer = Buffer.from(uint8Array);

  if (addHexPrefix) {
    return `0x${buffer.toString('hex')}`;
  } else {
    return buffer.toString('hex');
  }
}

export function hexdecode(hexstring: string): Buffer {
  let str = hexstring;
  if (/^0x/.test(hexstring)) {
    str = hexstring.slice(2);
  }

  return Buffer.from(str, 'hex');
}
