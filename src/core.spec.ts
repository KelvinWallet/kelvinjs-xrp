import { expect } from 'chai';

import * as Core from './core';
import { Networks } from './model/network';

describe('Offline Test', () => {
  it('getSupportedNetworks()', () => {
    const networks = Core.getSupportedNetworks();

    expect(networks).to.contain(Networks.MAINNET);
    expect(networks).to.contain(Networks.TESTNET);
  });

  it('getFeeOptionUnit()', () => {
    expect(() => Core.getFeeOptionUnit()).to.throw();
  });

  it('isValidFeeOption()', () => {
    expect(() => Core.isValidFeeOption(Networks.MAINNET, '123')).to.throw();
  });

  describe('isValidAddr()', () => {
    it('valid address', () => {
      const result = Core.isValidAddr(
        Networks.MAINNET,
        'rwZiRAZz2d3arorLk3uqWULxGKyo5F2n8L',
      );

      expect(result).to.be.true; // tslint:disable-line
    });

    it('invalid address', () => {
      const result = Core.isValidAddr(
        Networks.MAINNET,
        'rwzirazz2d3arorlk3uqwulxgkyo5f2n8l',
      );

      expect(result).to.be.false; // tslint:disable-line
    });

    it('invalid address, containing trailing spaces', () => {
      const result = Core.isValidAddr(
        Networks.MAINNET,
        ' rwZiRAZz2d3arorLk3uqWULxGKyo5F2n8L',
      );

      expect(result).to.be.false; // tslint:disable-line
    });

    it('invalid network', (done) => {
      try {
        Core.isValidAddr('regtest', 'rwZiRAZz2d3arorLk3uqWULxGKyo5F2n8L');
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid network');
        done();
      }
    });
  });

  describe('isValidNormAmount()', () => {
    it('valid amount', () => {
      const result = Core.isValidNormAmount('23.1');

      expect(result).to.be.true; // tslint:disable-line
    });

    it('valid amount, 1 drop', () => {
      const result = Core.isValidNormAmount('0.000001');

      expect(result).to.be.true; // tslint:disable-line
    });

    it('invalid amount', () => {
      const result = Core.isValidNormAmount('ten');

      expect(result).to.be.false; // tslint:disable-line
    });

    it('too small amount, 0.1 drop', () => {
      const result = Core.isValidNormAmount('0.0000001');

      expect(result).to.be.false; // tslint:disable-line
    });
  });

  describe('convertNormAmountToBaseAmount()', () => {
    it('valid amount: 2.21', () => {
      const baseAmount = Core.convertNormAmountToBaseAmount('2.21');

      expect(baseAmount).to.deep.eq('2210000');
    });

    it('valid amount: 0.05521', () => {
      const baseAmount = Core.convertNormAmountToBaseAmount('0.05521');

      expect(baseAmount).to.deep.eq('55210');
    });

    it('invalid amount: 0.l', (done) => {
      try {
        Core.convertNormAmountToBaseAmount('0.l');
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid amount');
        done();
      }
    });

    it('invalid amount: 0.0000001', (done) => {
      try {
        Core.convertNormAmountToBaseAmount('0.0000001');
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid amount');
        done();
      }
    });

    it('invalid amount: 0.1 (white space)', (done) => {
      try {
        Core.convertNormAmountToBaseAmount('0.1 ');
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid amount');
        done();
      }
    });
  });

  describe('convertBaseAmountToNormAmount()', () => {
    it('valid amount: 71506', () => {
      const normalAmount = Core.convertBaseAmountToNormAmount('71506');

      expect(normalAmount).to.deep.eq('0.071506');
    });

    it('valid amount: 1604900000', () => {
      const normalAmount = Core.convertBaseAmountToNormAmount('1604900000');

      expect(normalAmount).to.deep.eq('1604.9');
    });

    it('invalid amount: l10', (done) => {
      try {
        Core.convertBaseAmountToNormAmount('l10');
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid amount');
        done();
      }
    });

    it('invalid amount: 0.1', (done) => {
      try {
        Core.convertBaseAmountToNormAmount('0.1');
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid amount');
        done();
      }
    });
  });

  describe('getUrlForAddr()', () => {
    it('valid network', () => {
      const url = Core.getUrlForAddr(
        Networks.MAINNET,
        'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
      );

      expect(url).to.be.a('string');
    });

    it('invalid network', (done) => {
      try {
        Core.getUrlForAddr('regtest', 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe');
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid network');
        done();
      }
    });
  });

  describe('getUrlForTx()', () => {
    it('valid network', () => {
      const url = Core.getUrlForTx(
        Networks.MAINNET,
        'F7EC750BBC3681C51202F554C1CEEB7122384C04355BD813DBB66937D150E707',
      );

      expect(url).to.be.a('string');
    });

    it('invalid network', (done) => {
      try {
        Core.getUrlForTx(
          'regtest',
          'F7EC750BBC3681C51202F554C1CEEB7122384C04355BD813DBB66937D150E707',
        );
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid network');
        done();
      }
    });
  });

  describe('encodePubkeyToAddr()', () => {
    /* tslint:disable:max-line-length */
    it('valid network, valid hexstring', () => {
      const address = Core.encodePubkeyToAddr(
        Networks.MAINNET,
        '0498a6363fbcdf9f1de3977a326d37304f62ac8a76f69406ee73ca9462d4256d41c1506c42aede21cb0ea076e172233e564e815a0a4ce82362a142becaa25d846d',
      );

      expect(address).to.be.a('string');
      expect(address).to.deep.eq('rLZGhYNcEF6pUy6UinQKvF24F6wRxjRAHs');
    });

    it('valid network, valid hexstring', () => {
      const address = Core.encodePubkeyToAddr(
        Networks.TESTNET,
        '040813b03f9205debbb4f32a57580b32d702935a10419cf602f94473a59ec91eedef1f52f9a5e89ace2818248b788574f85ed0fc2378e5912c728a94f1e43df68b',
      );

      expect(address).to.be.a('string');
      expect(address).to.deep.eq('rLCF59cHKkTjfZgQJE5qo8ePg4J9w1kZVv');
    });

    it('valid network, invalid hexstring', (done) => {
      try {
        Core.encodePubkeyToAddr(
          Networks.TESTNET,
          '03c0e05396749d9ac24765ed6c5fb48f9c665e524179ce0c46384b74ce00010f8a',
        );
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid uncompressed');
        done();
      }
    });

    it('invalid network', (done) => {
      try {
        Core.encodePubkeyToAddr(
          'regtest',
          '040813b03f9205debbb4f32a57580b32d702935a10419cf602f94473a59ec91eedef1f52f9a5e89ace2818248b788574f85ed0fc2378e5912c728a94f1e43df68b',
        );
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.contains('invalid network');
        done();
      }
    });
    /* tslint:enable:max-line-length */
  });
});
