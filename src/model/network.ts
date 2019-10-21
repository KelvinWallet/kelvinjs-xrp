export enum Networks {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export interface IRippleNetwork {
  apiUrl: string;
  addressUrl: string;
  txUrl: string;
}

export const supportedNetworks: { [network: string]: IRippleNetwork } = {
  [Networks.MAINNET]: {
    apiUrl: 'wss://s1.ripple.com',
    addressUrl: 'https://xrpscan.com/account/',
    txUrl: 'https://xrpscan.com/tx/',
  },
  [Networks.TESTNET]: {
    apiUrl: 'wss://s.altnet.rippletest.net:51233',
    addressUrl: 'https://test.bithomp.com/explorer/',
    txUrl: 'https://test.bithomp.com/explorer/',
  },
};
