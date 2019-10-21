import elliptic from 'elliptic';
import * as ArmadilloProtob from 'kelvinjs-protob';
import { decodeAccountID } from 'ripple-address-codec';
import { encode } from 'ripple-binary-codec';
import {
  bytesToHex,
  serializeObject,
} from 'ripple-binary-codec/distrib/npm/binary';
import { HashPrefix } from 'ripple-binary-codec/distrib/npm/hash-prefixes';
import { deriveAddress, verify } from 'ripple-keypairs';
import { RippleAPI } from 'ripple-lib';
import { dropsToXrp, xrpToDrops } from 'ripple-lib/dist/npm/common/utils';
import {
  FormattedPayment,
  FormattedTransactionType,
  Instructions,
  TransactionJSON,
} from 'ripple-lib/dist/npm/transaction/types';
import secp256k1 from 'secp256k1';

import {
  IArmadilloCommand,
  IArmadilloResponse,
  ISignTxRequest,
  ITransaction,
  ITransactionSchema,
} from './model/currency';
import { IRippleNetwork, Networks, supportedNetworks } from './model/network';
import { IFullSubmitResponse, IFullTransactionJSON } from './model/transaction';
import * as Utils from './utils';

export function getSupportedNetworks(): string[] {
  return [Networks.MAINNET, Networks.TESTNET];
}

export function getSupportedNetwork(network: string): IRippleNetwork {
  if (!getSupportedNetworks().includes(network)) {
    throw Error(`invalid network: ${network}`);
  }

  return supportedNetworks[network];
}

export function getFeeOptionUnit(): string {
  throw new Error('No fee options available');
}

export function isValidFeeOption(network: string, feeOpt: string): boolean {
  if (!getSupportedNetworks().includes(network)) {
    throw Error(`invalid network: ${network}`);
  }

  throw new Error('No fee options available');
}

export function isValidAddr(network: string, addr: string): boolean {
  if (!getSupportedNetworks().includes(network)) {
    throw Error(`invalid network: ${network}`);
  }

  try {
    const array = decodeAccountID(addr);
    return array instanceof Buffer && array.length === 20;
  } catch (error) {
    return false;
  }
}

export function isValidNormAmount(amount: string): boolean {
  try {
    xrpToDrops(amount);
    return true;
  } catch (error) {
    return false;
  }
}

export function convertNormAmountToBaseAmount(amount: string): string {
  if (isValidNormAmount(amount)) {
    return xrpToDrops(amount);
  } else {
    throw Error('invalid amount');
  }
}

export function convertBaseAmountToNormAmount(amount: string): string {
  try {
    return dropsToXrp(amount);
  } catch (error) {
    throw Error('invalid amount');
  }
}

export function getUrlForAddr(network: string, addr: string): string {
  const xrpNetwork: IRippleNetwork = getSupportedNetwork(network);

  return `${xrpNetwork.addressUrl}${addr}`;
}

export function getUrlForTx(network: string, txid: string): string {
  const xrpNetwork: IRippleNetwork = getSupportedNetwork(network);

  return `${xrpNetwork.txUrl}/tx/${txid}`;
}

export function encodePubkeyToAddr(network: string, pubkey: string): string {
  if (!getSupportedNetworks().includes(network)) {
    throw Error(`invalid network: ${network}`);
  }

  if (!/^04[0-9a-fA-F]{128}$/.test(pubkey)) {
    throw Error('invalid uncompressed public key');
  }

  const publicKey = Utils.hexdecode(pubkey);
  const compressed = secp256k1.publicKeyConvert(publicKey, true);
  const address: string = deriveAddress(
    compressed.toString('hex').toUpperCase(),
  );

  return address;
}

export async function getFeeOptions(network: string): Promise<string[]> {
  throw new Error('No fee options available');
}

export function getHistorySchema(): ITransactionSchema[] {
  return [
    {
      key: 'type',
      format: 'string',
      label: 'Type',
    },
    {
      key: 'date',
      format: 'date',
      label: 'Date',
    },
    {
      key: 'txid',
      format: 'hash',
      label: 'TxHash',
    },
    {
      key: 'to',
      format: 'address',
      label: 'To',
    },
    {
      key: 'value',
      format: 'value',
      label: 'Value',
    },
    {
      key: 'fee',
      format: 'value',
      label: 'Fee',
    },
    // {
    //   key: 'isConfirmed',
    //   label: 'isConfirmed',
    //   format: 'boolean',
    // },
  ];
}

export async function submitTransaction(
  network: string,
  signedTx: string,
): Promise<string> {
  const xrpNetwork: IRippleNetwork = getSupportedNetwork(network);

  const ripple = new RippleAPI({
    server: xrpNetwork.apiUrl,
  });
  await ripple.connect();

  const response: IFullSubmitResponse = (await ripple.submit(signedTx)) as any;
  await ripple.disconnect();

  // console.log(response);
  if (response.resultCode !== 'tesSUCCESS') {
    throw new Error(`${response.resultCode}: ${response.resultMessage}`);
  }

  return response.tx_json.hash;
}

export function prepareCommandGetPubkey(
  network: string,
  accountIndex: number,
): IArmadilloCommand {
  if (!getSupportedNetworks().includes(network)) {
    throw Error(`invalid network: ${network}`);
  }

  const req = new ArmadilloProtob.Ripple.XrpCommand();
  const msg = new ArmadilloProtob.Ripple.XrpCommand.XrpGetPub();
  const pathList: number[] = Utils.getAccountPath(accountIndex);

  if (pathList.length !== 3) {
    throw Error('invalid path');
  }

  msg.setPathList(pathList);
  req.setGetPub(msg);

  return {
    commandId: ArmadilloProtob.RIPPLE_CMDID,
    payload: Buffer.from(req.serializeBinary()),
  };
}

export function parsePubkeyResponse(walletRsp: IArmadilloResponse): string {
  const response = ArmadilloProtob.Ripple.XrpResponse.deserializeBinary(
    walletRsp.payload,
  );
  const data = response.getPk();
  if (!data) {
    throw Error('invalid wallet response');
  }
  const publicKey: Buffer = Buffer.from(data.getPubkey_asU8());
  const uncompressed = secp256k1.publicKeyConvert(publicKey, false);
  return uncompressed.toString('hex');
}

export function prepareCommandShowAddr(
  network: string,
  accountIndex: number,
): IArmadilloCommand {
  if (!getSupportedNetworks().includes(network)) {
    throw Error(`invalid network: ${network}`);
  }

  const req = new ArmadilloProtob.Ripple.XrpCommand();
  const msg = new ArmadilloProtob.Ripple.XrpCommand.XrpShowAddr();
  const pathList: number[] = Utils.getAccountPath(accountIndex);

  if (pathList.length !== 3) {
    throw Error('invalid path');
  }

  msg.setPathList(pathList);
  req.setShowAddr(msg);

  return {
    commandId: ArmadilloProtob.RIPPLE_CMDID,
    payload: Buffer.from(req.serializeBinary()),
  };
}

export async function getBalance(
  network: string,
  addr: string,
): Promise<string> {
  const xrpNetwork: IRippleNetwork = getSupportedNetwork(network);
  const ripple = new RippleAPI({
    server: xrpNetwork.apiUrl,
  });
  await ripple.connect();

  let balance: string = '0';
  try {
    const response = await ripple.getAccountInfo(addr);
    return response.xrpBalance;
  } catch (error) {
    balance = '0';
  } finally {
    await ripple.disconnect();
  }

  return balance;
}

export async function getRecentHistory(
  network: string,
  addr: string,
): Promise<ITransaction[]> {
  const xrpNetwork: IRippleNetwork = getSupportedNetwork(network);
  const ripple = new RippleAPI({
    server: xrpNetwork.apiUrl,
  });
  await ripple.connect();

  let txlist: FormattedTransactionType[];
  try {
    // Note: do not add `types: ['payment']` here.
    // It may crawl to the gensis block until it sees 50 payment transactions,
    // but some addresses may have a lot of other transactions
    txlist = await ripple.getTransactions(addr, {
      limit: 50,
    });
  } catch (error) {
    txlist = [];
  } finally {
    await ripple.disconnect();
  }

  // Instead, filter here
  txlist = txlist.filter(
    (tx) => tx.type === 'payment' && !(tx.specification as FormattedPayment).paths, // rule out path payments
  );

  // const util = require('util');
  // console.log(util.inspect(txlist, false, null, true /* enable colors */));

  return txlist.map<ITransaction>((item) => {
    const payment = item.specification as FormattedPayment;
    const outcome = item.outcome;
    const deliveredAmount = item.outcome.deliveredAmount;
    const amount = deliveredAmount ? deliveredAmount.value : '0';
    const isSelf = item.address === payment.destination.address;
    const isSent = item.address === addr;

    return {
      type: {
        value: isSelf ? 'Self' : isSent ? 'Sent' : 'Received',
      },
      date: {
        value: new Date(outcome.timestamp || 0).toISOString(),
      },
      txid: {
        value: item.id,
        link: getUrlForTx(network, item.id),
      },
      to: {
        value: payment.destination.address,
        link: getUrlForAddr(network, payment.destination.address),
      },
      value: {
        value: amount,
      },
      fee: {
        value: outcome.fee,
      },
      // isConfirmed: {
      //   value: 'true',
      // },
    };
  });
}

export function getPreparedTxSchema(): ITransactionSchema[] {
  return [
    {
      key: 'from',
      format: 'address',
      label: 'From Address',
    },
    {
      key: 'value',
      format: 'value',
      label: 'Value',
    },
    {
      key: 'to',
      format: 'address',
      label: 'To Address',
    },
    {
      key: 'fee',
      format: 'value',
      label: 'Fee',
    },
    {
      key: 'sequence',
      format: 'number',
      label: 'Sequence',
    },
    {
      key: 'lastLedgerSequence',
      format: 'number',
      label: 'LastLedgerSequence',
    },
  ];
}

export async function prepareCommandSignTx(
  req: ISignTxRequest,
): Promise<[IArmadilloCommand, ITransaction, IFullTransactionJSON]> {
  const xrpNetwork = getSupportedNetwork(req.network);

  if (req.accountIndex < 0) {
    throw Error('invalid account index');
  }

  if (!isValidAddr(req.network, req.toAddr)) {
    throw Error('invalid to address');
  }

  if (!isValidNormAmount(req.amount)) {
    throw Error('invalid amount');
  }

  if (typeof req.feeOpt !== 'undefined') {
    throw new Error('No fee options available');
  }

  const ripple = new RippleAPI({
    server: xrpNetwork.apiUrl,
  });
  await ripple.connect();

  const from = encodePubkeyToAddr(req.network, req.fromPubkey);
  const to = req.toAddr;

  if (from === to) {
    throw new Error(`Should not send to self: ${from}`);
  }

  const value = convertNormAmountToBaseAmount(req.amount);
  const publicKey = Buffer.from(req.fromPubkey, 'hex');

  const account = await ripple.getAccountInfo(from);
  const fee = await ripple.getFee();

  const transactionJSON: TransactionJSON = {
    TransactionType: 'Payment',
    Account: from,
    Amount: value,
    Destination: to,
  };

  const instructions: Instructions = {
    fee,
    sequence: account.sequence,
    maxLedgerVersionOffset: 300, // ~ 20 min
  };

  const preparedTx = await ripple.prepareTransaction(
    transactionJSON,
    instructions,
  );
  await ripple.disconnect();

  const rawTx: IFullTransactionJSON = JSON.parse(preparedTx.txJSON);
  rawTx.SigningPubKey = secp256k1
    .publicKeyConvert(publicKey, true)
    .toString('hex')
    .toUpperCase();

  const command = new ArmadilloProtob.Ripple.XrpCommand();
  const msg = new ArmadilloProtob.Ripple.XrpCommand.XrpSignTx();
  const pathList: number[] = Utils.getAccountPath(req.accountIndex);

  msg.setPathList(pathList);
  msg.setAccount(decodeAccountID(from));
  msg.setAmount(parseInt(rawTx.Amount, 10));
  msg.setFee(parseInt(rawTx.Fee, 10));
  msg.setDestination(decodeAccountID(to));
  msg.setSequence(rawTx.Sequence);
  if (!!rawTx.LastLedgerSequence) {
    msg.setLastLedgerSequence(rawTx.LastLedgerSequence);
  }

  command.setSignTx(msg);

  const armadillCommand: IArmadilloCommand = {
    commandId: ArmadilloProtob.RIPPLE_CMDID,
    payload: Buffer.from(command.serializeBinary()),
  };

  const transaction: ITransaction = {
    from: {
      value: from,
      link: getUrlForAddr(req.network, from),
    },
    to: {
      value: to,
      link: getUrlForAddr(req.network, to),
    },
    value: {
      value: convertBaseAmountToNormAmount(rawTx.Amount),
    },
    fee: {
      value: convertBaseAmountToNormAmount(rawTx.Fee),
    },
    sequence: {
      value: `${rawTx.Sequence}`,
    },
    lastLedgerSequence: {
      value: `${rawTx.LastLedgerSequence}`,
    },
  };

  return [armadillCommand, transaction, rawTx];
}

export function buildSignedTx(
  req: ISignTxRequest,
  preparedTx: IArmadilloCommand,
  walletRsp: IArmadilloResponse,
  rawTx: IFullTransactionJSON,
): string {
  const response = ArmadilloProtob.Ripple.XrpResponse.deserializeBinary(
    walletRsp.payload,
  );

  const data = response.getSig();
  if (!data) {
    throw Error('invalid wallet response');
  }

  const sigBuffer = Buffer.from(data.getSig_asU8());
  const r = sigBuffer.slice(0, 32);
  const s = sigBuffer.slice(32);

  const ECSignature: typeof elliptic.ec.Signature = require('elliptic/lib/elliptic/ec/signature');
  const ecSignature = new ECSignature({
    r: r.toString('hex'),
    s: s.toString('hex'),
  });

  rawTx.TxnSignature = ecSignature.toDER('hex').toUpperCase();
  const signedTx = encode(rawTx);

  if (
    verify(
      bytesToHex(
        serializeObject(rawTx, {
          prefix: HashPrefix.transactionSig,
          signingFieldsOnly: true,
        }),
      ),
      rawTx.TxnSignature,
      rawTx.SigningPubKey,
    )
  ) {
    return signedTx;
  } else {
    throw Error('invalid tx');
  }
}
