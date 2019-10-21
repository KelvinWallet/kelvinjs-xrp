import { FormattedSubmitResponse } from 'ripple-lib/dist/npm/transaction/submit';
import { TransactionJSON } from 'ripple-lib/dist/npm/transaction/types';

export interface IFullTransactionJSON extends TransactionJSON {
  Amount: string;
  Destination: string;
  Fee: string;
  LastLedgerSequence?: number;
  Sequence: number;
  SigningPubKey: string;
  TxnSignature: string;
}

export interface IFullSubmitResponse extends FormattedSubmitResponse {
  tx_json: IFullTransactionJSON & {
    hash: string;
  };
}
