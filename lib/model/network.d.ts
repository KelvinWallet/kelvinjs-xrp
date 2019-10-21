export declare enum Networks {
    MAINNET = "mainnet",
    TESTNET = "testnet"
}
export interface IRippleNetwork {
    apiUrl: string;
    addressUrl: string;
    txUrl: string;
}
export declare const supportedNetworks: {
    [network: string]: IRippleNetwork;
};
