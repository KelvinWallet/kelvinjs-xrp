import * as Core from './core';
import {
  IArmadilloCommand,
  IArmadilloResponse,
  ICurrencyUtil,
  ISignTxRequest,
  ITransaction,
  ITransactionSchema,
} from './model/currency';
import { IFullTransactionJSON } from './model/transaction';

export default class Ripple implements ICurrencyUtil {
  private rawTx: IFullTransactionJSON | false = false;

  public getSupportedNetworks(): string[] {
    return Core.getSupportedNetworks();
  }

  public getFeeOptionUnit(): string {
    return Core.getFeeOptionUnit();
  }

  public isValidFeeOption(network: string, feeOpt: string): boolean {
    return Core.isValidFeeOption(network, feeOpt);
  }

  public isValidAddr(network: string, addr: string): boolean {
    return Core.isValidAddr(network, addr);
  }

  public isValidNormAmount(amount: string): boolean {
    return Core.isValidNormAmount(amount);
  }

  public convertNormAmountToBaseAmount(amount: string): string {
    return Core.convertNormAmountToBaseAmount(amount);
  }

  public convertBaseAmountToNormAmount(amount: string): string {
    return Core.convertBaseAmountToNormAmount(amount);
  }

  public getUrlForAddr(network: string, addr: string): string {
    return Core.getUrlForAddr(network, addr);
  }

  public getUrlForTx(network: string, txid: string): string {
    return Core.getUrlForTx(network, txid);
  }

  public encodePubkeyToAddr(network: string, pubkey: string): string {
    return Core.encodePubkeyToAddr(network, pubkey);
  }

  public getBalance(network: string, addr: string): Promise<string> {
    return Core.getBalance(network, addr);
  }

  public getHistorySchema(): ITransactionSchema[] {
    return Core.getHistorySchema();
  }

  public getRecentHistory(
    network: string,
    addr: string,
  ): Promise<ITransaction[]> {
    return Core.getRecentHistory(network, addr);
  }

  public getFeeOptions(network: string): Promise<string[]> {
    return Core.getFeeOptions(network);
  }

  public getPreparedTxSchema(): ITransactionSchema[] {
    return Core.getPreparedTxSchema();
  }

  public async prepareCommandSignTx(
    req: ISignTxRequest,
  ): Promise<[IArmadilloCommand, ITransaction]> {
    const [command, transaction, rawTx] = await Core.prepareCommandSignTx(req);
    this.rawTx = rawTx;
    return [command, transaction];
  }

  public buildSignedTx(
    req: ISignTxRequest,
    preparedTx: IArmadilloCommand,
    walletRsp: IArmadilloResponse,
  ): string {
    if (!this.rawTx) {
      throw Error('must prepare command to sign tx first');
    }

    const response = Core.buildSignedTx(req, preparedTx, walletRsp, this.rawTx);
    this.rawTx = false;

    return response;
  }

  public submitTransaction(network: string, signedTx: string): Promise<string> {
    return Core.submitTransaction(network, signedTx);
  }

  public prepareCommandGetPubkey(
    network: string,
    accountIndex: number,
  ): IArmadilloCommand {
    return Core.prepareCommandGetPubkey(network, accountIndex);
  }

  public parsePubkeyResponse(walletRsp: IArmadilloResponse): string {
    return Core.parsePubkeyResponse(walletRsp);
  }

  public prepareCommandShowAddr(
    network: string,
    accountIndex: number,
  ): IArmadilloCommand {
    return Core.prepareCommandShowAddr(network, accountIndex);
  }
}
