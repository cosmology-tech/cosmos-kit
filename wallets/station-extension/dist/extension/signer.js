var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension/signer.ts
var signer_exports = {};
__export(signer_exports, {
  OfflineSigner: () => OfflineSigner
});
module.exports = __toCommonJS(signer_exports);
var import_feather = require("@terra-money/feather.js");
var OfflineSigner = class {
  constructor(extension, accountInfo) {
    this.extension = extension;
    this.accountInfo = accountInfo;
  }
  async getAccounts() {
    return [
      {
        address: this.accountInfo.address,
        algo: this.accountInfo.algo || "secp256k1",
        pubkey: this.accountInfo.pubkey
      }
    ];
  }
  async signAmino(signerAddress, signDoc) {
    const signDocFee = signDoc.fee;
    const feeAmount = signDocFee.amount[0].amount + signDocFee.amount[0].denom;
    const fakeMsgs = signDoc.msgs.map(
      (msg) => JSON.stringify(import_feather.Msg.fromAmino(msg).toData())
    );
    const signResponse = await this.extension.sign({
      chainID: signDoc.chain_id,
      msgs: fakeMsgs,
      fee: new import_feather.Fee(
        parseInt(signDocFee.gas),
        feeAmount,
        signDocFee.payer,
        signDocFee.granter
      ),
      memo: signDoc.memo,
      signMode: import_feather.SignatureV2.SignMode.SIGN_MODE_LEGACY_AMINO_JSON
    });
    const signature = {
      pub_key: signResponse.payload.result.auth_info.signer_infos[0].public_key.key,
      signature: signResponse.payload.result.signatures[0]
    };
    return {
      signed: signDoc,
      signature
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OfflineSigner
});
//# sourceMappingURL=signer.js.map