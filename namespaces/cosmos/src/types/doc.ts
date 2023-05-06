import { StdSignDoc } from '@cosmjs/amino';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export namespace GenericCosmosDoc {
  export type Message = string;
  export type Amino = StdSignDoc;
  export type Direct = SignDoc;
}
