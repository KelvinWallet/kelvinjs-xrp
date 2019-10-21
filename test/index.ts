import { expect } from 'chai';

import { KelvinWallet } from 'kelvinjs-usbhid';
import Ripple from '../src/index';
import { IArmadilloCommand, ISignTxRequest } from '../src/model/currency';
import { Networks } from '../src/model/network';
import * as Utils from '../src/utils';

function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function send(command: IArmadilloCommand): Promise<string> {
  const device = new KelvinWallet();
  const [status, buffer] = device.send(command.commandId, command.payload);

  device.close();

  if (status !== 0) {
    throw Error(`error status code ${status}`);
  }

  return buffer.toString('hex');
}

const ripple = new Ripple();

let address: string = '';
let toAddress: string = '';
let publicKey: string = '';

describe('Ripple Test', async () => {
  it('prepareCommandGetPubkey(1)', async () => {
    const command = ripple.prepareCommandGetPubkey(Networks.TESTNET, 1);
    const response = await send(command);
    publicKey = ripple.parsePubkeyResponse({
      payload: Utils.hexdecode(response),
    });
    toAddress = ripple.encodePubkeyToAddr(Networks.TESTNET, publicKey);

    expect(publicKey).to.be.a('string');
    expect(ripple.isValidAddr(Networks.TESTNET, toAddress)).to.be.true; // tslint:disable-line

    console.log(toAddress);
  });

  it('prepareCommandGetPubkey()', async () => {
    const command = ripple.prepareCommandGetPubkey(Networks.TESTNET, 0);
    const response = await send(command);
    publicKey = ripple.parsePubkeyResponse({
      payload: Utils.hexdecode(response),
    });
    address = ripple.encodePubkeyToAddr(Networks.TESTNET, publicKey);

    expect(publicKey).to.be.a('string');
    expect(ripple.isValidAddr(Networks.TESTNET, address)).to.be.true; // tslint:disable-line

    console.log(address);
  });

  it('prepareCommandShowAddr()', async () => {
    const command = ripple.prepareCommandShowAddr(Networks.TESTNET, 0);
    const response = await send(command);

    expect(response).to.be.a('string');
    expect(response).to.deep.eq('0800');
  }).timeout(60000);

  it('getBalance()', async () => {
    const balance = await ripple.getBalance(Networks.TESTNET, address);

    expect(balance).to.be.a('string');
    console.log(balance);
  }).timeout(10000);

  it('getRecentHistory()', async () => {
    const schema = ripple.getHistorySchema();
    const txList = await ripple.getRecentHistory(Networks.TESTNET, address);

    expect(txList).to.be.instanceof(Array);

    for (let i = 0; i < txList.length && i < 10; i++) {
      const tx = txList[i];
      for (const field of schema) {
        console.log(field.label, ':', tx[field.key].value);
      }
      console.log();
    }
  }).timeout(10000);

  it('sign & submit tx', async () => {
    const schema = ripple.getPreparedTxSchema();
    const req: ISignTxRequest = {
      network: Networks.TESTNET,
      accountIndex: 0,
      toAddr: toAddress,
      fromPubkey: publicKey,
      amount: '0.123',
    };
    const [command, txinfo] = await ripple.prepareCommandSignTx(req);

    expect(command.commandId).to.be.a('number');
    expect(command.payload).to.be.instanceof(Buffer);
    expect(txinfo).to.be.a('object');
    Object.keys(txinfo).forEach((key) => {
      expect(txinfo[key].value).to.be.a('string');
    });

    for (const field of schema) {
      console.log(field.label, ':', txinfo[field.key].value);
    }
    console.log();

    const walletResp = await send(command);
    expect(walletResp).to.be.a('string');

    const signedTx = ripple.buildSignedTx(req, command, {
      payload: Utils.hexdecode(walletResp),
    });
    expect(signedTx).to.be.a('string');
    expect(signedTx).to.match(/^[0-9a-fA-F]+$/);
    console.log(signedTx);

    const txhash = await ripple.submitTransaction(Networks.TESTNET, signedTx);
    console.log(txhash);
  }).timeout(60000);
});
