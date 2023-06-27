var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/@cosmjs/encoding/build/ascii.js
var require_ascii = __commonJS({
  "../../node_modules/@cosmjs/encoding/build/ascii.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromAscii = exports.toAscii = void 0;
    function toAscii(input) {
      const toNums = (str) => str.split("").map((x) => {
        const charCode = x.charCodeAt(0);
        if (charCode < 32 || charCode > 126) {
          throw new Error("Cannot encode character that is out of printable ASCII range: " + charCode);
        }
        return charCode;
      });
      return Uint8Array.from(toNums(input));
    }
    exports.toAscii = toAscii;
    function fromAscii(data) {
      const fromNums = (listOfNumbers) => listOfNumbers.map((x) => {
        if (x < 32 || x > 126) {
          throw new Error("Cannot decode character that is out of printable ASCII range: " + x);
        }
        return String.fromCharCode(x);
      });
      return fromNums(Array.from(data)).join("");
    }
    exports.fromAscii = fromAscii;
  }
});

// ../../node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "../../node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1)
        validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// ../../node_modules/@cosmjs/encoding/build/base64.js
var require_base64 = __commonJS({
  "../../node_modules/@cosmjs/encoding/build/base64.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromBase64 = exports.toBase64 = void 0;
    var base64js = __importStar(require_base64_js());
    function toBase64(data) {
      return base64js.fromByteArray(data);
    }
    exports.toBase64 = toBase64;
    function fromBase642(base64String) {
      if (!base64String.match(/^[a-zA-Z0-9+/]*={0,2}$/)) {
        throw new Error("Invalid base64 string format");
      }
      return base64js.toByteArray(base64String);
    }
    exports.fromBase64 = fromBase642;
  }
});

// ../../node_modules/bech32/index.js
var require_bech32 = __commonJS({
  "../../node_modules/bech32/index.js"(exports, module2) {
    "use strict";
    var ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    var ALPHABET_MAP = {};
    for (z = 0; z < ALPHABET.length; z++) {
      x = ALPHABET.charAt(z);
      if (ALPHABET_MAP[x] !== void 0)
        throw new TypeError(x + " is ambiguous");
      ALPHABET_MAP[x] = z;
    }
    var x;
    var z;
    function polymodStep(pre) {
      var b = pre >> 25;
      return (pre & 33554431) << 5 ^ -(b >> 0 & 1) & 996825010 ^ -(b >> 1 & 1) & 642813549 ^ -(b >> 2 & 1) & 513874426 ^ -(b >> 3 & 1) & 1027748829 ^ -(b >> 4 & 1) & 705979059;
    }
    function prefixChk(prefix) {
      var chk = 1;
      for (var i = 0; i < prefix.length; ++i) {
        var c = prefix.charCodeAt(i);
        if (c < 33 || c > 126)
          return "Invalid prefix (" + prefix + ")";
        chk = polymodStep(chk) ^ c >> 5;
      }
      chk = polymodStep(chk);
      for (i = 0; i < prefix.length; ++i) {
        var v = prefix.charCodeAt(i);
        chk = polymodStep(chk) ^ v & 31;
      }
      return chk;
    }
    function encode(prefix, words, LIMIT) {
      LIMIT = LIMIT || 90;
      if (prefix.length + 7 + words.length > LIMIT)
        throw new TypeError("Exceeds length limit");
      prefix = prefix.toLowerCase();
      var chk = prefixChk(prefix);
      if (typeof chk === "string")
        throw new Error(chk);
      var result = prefix + "1";
      for (var i = 0; i < words.length; ++i) {
        var x2 = words[i];
        if (x2 >> 5 !== 0)
          throw new Error("Non 5-bit word");
        chk = polymodStep(chk) ^ x2;
        result += ALPHABET.charAt(x2);
      }
      for (i = 0; i < 6; ++i) {
        chk = polymodStep(chk);
      }
      chk ^= 1;
      for (i = 0; i < 6; ++i) {
        var v = chk >> (5 - i) * 5 & 31;
        result += ALPHABET.charAt(v);
      }
      return result;
    }
    function __decode(str, LIMIT) {
      LIMIT = LIMIT || 90;
      if (str.length < 8)
        return str + " too short";
      if (str.length > LIMIT)
        return "Exceeds length limit";
      var lowered = str.toLowerCase();
      var uppered = str.toUpperCase();
      if (str !== lowered && str !== uppered)
        return "Mixed-case string " + str;
      str = lowered;
      var split = str.lastIndexOf("1");
      if (split === -1)
        return "No separator character for " + str;
      if (split === 0)
        return "Missing prefix for " + str;
      var prefix = str.slice(0, split);
      var wordChars = str.slice(split + 1);
      if (wordChars.length < 6)
        return "Data too short";
      var chk = prefixChk(prefix);
      if (typeof chk === "string")
        return chk;
      var words = [];
      for (var i = 0; i < wordChars.length; ++i) {
        var c = wordChars.charAt(i);
        var v = ALPHABET_MAP[c];
        if (v === void 0)
          return "Unknown character " + c;
        chk = polymodStep(chk) ^ v;
        if (i + 6 >= wordChars.length)
          continue;
        words.push(v);
      }
      if (chk !== 1)
        return "Invalid checksum for " + str;
      return { prefix, words };
    }
    function decodeUnsafe() {
      var res = __decode.apply(null, arguments);
      if (typeof res === "object")
        return res;
    }
    function decode(str) {
      var res = __decode.apply(null, arguments);
      if (typeof res === "object")
        return res;
      throw new Error(res);
    }
    function convert(data, inBits, outBits, pad) {
      var value = 0;
      var bits = 0;
      var maxV = (1 << outBits) - 1;
      var result = [];
      for (var i = 0; i < data.length; ++i) {
        value = value << inBits | data[i];
        bits += inBits;
        while (bits >= outBits) {
          bits -= outBits;
          result.push(value >> bits & maxV);
        }
      }
      if (pad) {
        if (bits > 0) {
          result.push(value << outBits - bits & maxV);
        }
      } else {
        if (bits >= inBits)
          return "Excess padding";
        if (value << outBits - bits & maxV)
          return "Non-zero padding";
      }
      return result;
    }
    function toWordsUnsafe(bytes) {
      var res = convert(bytes, 8, 5, true);
      if (Array.isArray(res))
        return res;
    }
    function toWords(bytes) {
      var res = convert(bytes, 8, 5, true);
      if (Array.isArray(res))
        return res;
      throw new Error(res);
    }
    function fromWordsUnsafe(words) {
      var res = convert(words, 5, 8, false);
      if (Array.isArray(res))
        return res;
    }
    function fromWords(words) {
      var res = convert(words, 5, 8, false);
      if (Array.isArray(res))
        return res;
      throw new Error(res);
    }
    module2.exports = {
      decodeUnsafe,
      decode,
      encode,
      toWordsUnsafe,
      toWords,
      fromWordsUnsafe,
      fromWords
    };
  }
});

// ../../node_modules/@cosmjs/encoding/build/bech32.js
var require_bech322 = __commonJS({
  "../../node_modules/@cosmjs/encoding/build/bech32.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bech32 = exports.normalizeBech32 = exports.fromBech32 = exports.toBech32 = void 0;
    var bech32 = __importStar(require_bech32());
    function toBech32(prefix, data, limit) {
      const address = bech32.encode(prefix, bech32.toWords(data), limit);
      return address;
    }
    exports.toBech32 = toBech32;
    function fromBech32(address, limit = Infinity) {
      const decodedAddress = bech32.decode(address, limit);
      return {
        prefix: decodedAddress.prefix,
        data: new Uint8Array(bech32.fromWords(decodedAddress.words))
      };
    }
    exports.fromBech32 = fromBech32;
    function normalizeBech32(address) {
      const { prefix, data } = fromBech32(address);
      return toBech32(prefix, data);
    }
    exports.normalizeBech32 = normalizeBech32;
    var Bech32 = class {
      /**
       * @deprecated This class is deprecated and will be removed soon. Please use fromBech32() and toBech32() instead. For more details please refer to https://github.com/cosmos/cosmjs/issues/1053.
       */
      static encode(prefix, data, limit) {
        return toBech32(prefix, data, limit);
      }
      /**
       * @deprecated This class is deprecated and will be removed soon. Please use fromBech32() and toBech32() instead. For more details please refer to https://github.com/cosmos/cosmjs/issues/1053.
       */
      static decode(address, limit = Infinity) {
        return fromBech32(address, limit);
      }
    };
    exports.Bech32 = Bech32;
  }
});

// ../../node_modules/@cosmjs/encoding/build/hex.js
var require_hex = __commonJS({
  "../../node_modules/@cosmjs/encoding/build/hex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromHex = exports.toHex = void 0;
    function toHex(data) {
      let out = "";
      for (const byte of data) {
        out += ("0" + byte.toString(16)).slice(-2);
      }
      return out;
    }
    exports.toHex = toHex;
    function fromHex(hexstring) {
      if (hexstring.length % 2 !== 0) {
        throw new Error("hex string length must be a multiple of 2");
      }
      const out = new Uint8Array(hexstring.length / 2);
      for (let i = 0; i < out.length; i++) {
        const j = 2 * i;
        const hexByteAsString = hexstring.slice(j, j + 2);
        if (!hexByteAsString.match(/[0-9a-f]{2}/i)) {
          throw new Error("hex string contains invalid characters");
        }
        out[i] = parseInt(hexByteAsString, 16);
      }
      return out;
    }
    exports.fromHex = fromHex;
  }
});

// ../../node_modules/@cosmjs/encoding/build/rfc3339.js
var require_rfc3339 = __commonJS({
  "../../node_modules/@cosmjs/encoding/build/rfc3339.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toRfc3339 = exports.fromRfc3339 = void 0;
    var rfc3339Matcher = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(\.\d{1,9})?((?:[+-]\d{2}:\d{2})|Z)$/;
    function padded(integer, length = 2) {
      return integer.toString().padStart(length, "0");
    }
    function fromRfc3339(str) {
      const matches = rfc3339Matcher.exec(str);
      if (!matches) {
        throw new Error("Date string is not in RFC3339 format");
      }
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      const hour = +matches[4];
      const minute = +matches[5];
      const second = +matches[6];
      const milliSeconds = matches[7] ? Math.floor(+matches[7] * 1e3) : 0;
      let tzOffsetSign;
      let tzOffsetHours;
      let tzOffsetMinutes;
      if (matches[8] === "Z") {
        tzOffsetSign = 1;
        tzOffsetHours = 0;
        tzOffsetMinutes = 0;
      } else {
        tzOffsetSign = matches[8].substring(0, 1) === "-" ? -1 : 1;
        tzOffsetHours = +matches[8].substring(1, 3);
        tzOffsetMinutes = +matches[8].substring(4, 6);
      }
      const tzOffset = tzOffsetSign * (tzOffsetHours * 60 + tzOffsetMinutes) * 60;
      const timestamp = Date.UTC(year, month - 1, day, hour, minute, second, milliSeconds) - tzOffset * 1e3;
      return new Date(timestamp);
    }
    exports.fromRfc3339 = fromRfc3339;
    function toRfc3339(date) {
      const year = date.getUTCFullYear();
      const month = padded(date.getUTCMonth() + 1);
      const day = padded(date.getUTCDate());
      const hour = padded(date.getUTCHours());
      const minute = padded(date.getUTCMinutes());
      const second = padded(date.getUTCSeconds());
      const ms = padded(date.getUTCMilliseconds(), 3);
      return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}Z`;
    }
    exports.toRfc3339 = toRfc3339;
  }
});

// ../../node_modules/@cosmjs/encoding/build/utf8.js
var require_utf8 = __commonJS({
  "../../node_modules/@cosmjs/encoding/build/utf8.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromUtf8 = exports.toUtf8 = void 0;
    function toUtf8(str) {
      return new TextEncoder().encode(str);
    }
    exports.toUtf8 = toUtf8;
    function fromUtf8(data, lossy = false) {
      const fatal = !lossy;
      return new TextDecoder("utf-8", { fatal }).decode(data);
    }
    exports.fromUtf8 = fromUtf8;
  }
});

// ../../node_modules/@cosmjs/encoding/build/index.js
var require_build = __commonJS({
  "../../node_modules/@cosmjs/encoding/build/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toUtf8 = exports.fromUtf8 = exports.toRfc3339 = exports.fromRfc3339 = exports.toHex = exports.fromHex = exports.toBech32 = exports.normalizeBech32 = exports.fromBech32 = exports.Bech32 = exports.toBase64 = exports.fromBase64 = exports.toAscii = exports.fromAscii = void 0;
    var ascii_1 = require_ascii();
    Object.defineProperty(exports, "fromAscii", { enumerable: true, get: function() {
      return ascii_1.fromAscii;
    } });
    Object.defineProperty(exports, "toAscii", { enumerable: true, get: function() {
      return ascii_1.toAscii;
    } });
    var base64_1 = require_base64();
    Object.defineProperty(exports, "fromBase64", { enumerable: true, get: function() {
      return base64_1.fromBase64;
    } });
    Object.defineProperty(exports, "toBase64", { enumerable: true, get: function() {
      return base64_1.toBase64;
    } });
    var bech32_1 = require_bech322();
    Object.defineProperty(exports, "Bech32", { enumerable: true, get: function() {
      return bech32_1.Bech32;
    } });
    Object.defineProperty(exports, "fromBech32", { enumerable: true, get: function() {
      return bech32_1.fromBech32;
    } });
    Object.defineProperty(exports, "normalizeBech32", { enumerable: true, get: function() {
      return bech32_1.normalizeBech32;
    } });
    Object.defineProperty(exports, "toBech32", { enumerable: true, get: function() {
      return bech32_1.toBech32;
    } });
    var hex_1 = require_hex();
    Object.defineProperty(exports, "fromHex", { enumerable: true, get: function() {
      return hex_1.fromHex;
    } });
    Object.defineProperty(exports, "toHex", { enumerable: true, get: function() {
      return hex_1.toHex;
    } });
    var rfc3339_1 = require_rfc3339();
    Object.defineProperty(exports, "fromRfc3339", { enumerable: true, get: function() {
      return rfc3339_1.fromRfc3339;
    } });
    Object.defineProperty(exports, "toRfc3339", { enumerable: true, get: function() {
      return rfc3339_1.toRfc3339;
    } });
    var utf8_1 = require_utf8();
    Object.defineProperty(exports, "fromUtf8", { enumerable: true, get: function() {
      return utf8_1.fromUtf8;
    } });
    Object.defineProperty(exports, "toUtf8", { enumerable: true, get: function() {
      return utf8_1.toUtf8;
    } });
  }
});

// src/extension/main-wallet.ts
var main_wallet_exports = {};
__export(main_wallet_exports, {
  StationExtensionWallet: () => StationExtensionWallet
});
module.exports = __toCommonJS(main_wallet_exports);
var import_core3 = require("@cosmos-kit/core");

// src/extension/chain-wallet.ts
var import_core = require("@cosmos-kit/core");
var ChainStationExtension = class extends import_core.ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/signer.ts
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

// src/extension/client.ts
var import_encoding = __toESM(require_build());
var StationClient = class {
  constructor(client) {
    this.client = client;
  }
  async disconnect() {
    this.client.disconnect();
  }
  async getSimpleAccount(chainId) {
    const account = await this.getAccount(chainId);
    return {
      namespace: "cosmos",
      chainId,
      address: account.address
    };
  }
  async getAccount(chainId) {
    let account = await this.client.connect();
    const infos = await this.client.info();
    const networkInfo = infos[chainId];
    if (!networkInfo) {
      return Promise.reject(
        `Unsupported chainId: ${chainId}. Please swap to ${chainId} network in Station Wallet.`
      );
    }
    const coinTypeByChainId = networkInfo.coinType;
    if (!account.pubkey) {
      account = await this.client.getPubKey();
      if (!account?.pubkey) {
        return Promise.reject(
          `Cannot find account public key.`
        );
      }
    }
    const accountPubkey = account.pubkey[coinTypeByChainId];
    return {
      address: account.addresses[chainId],
      algo: "secp256k1",
      pubkey: (0, import_encoding.fromBase64)(accountPubkey)
    };
  }
  async getOfflineSigner(chainId) {
    const accountInfo = await this.getAccount(chainId);
    return new OfflineSigner(this.client, accountInfo);
  }
};

// src/extension/utils.ts
var import_core2 = require("@cosmos-kit/core");

// src/extension/extension.ts
var import_feather2 = require("@terra-money/feather.js");
function isValidResult({ error, ...payload }) {
  if (typeof payload.success !== "boolean") {
    return false;
  } else if (typeof payload.result === "undefined" && typeof error === "undefined") {
    return false;
  }
  return true;
}
var StationExtension = class {
  constructor() {
    this.identifier = "station";
    this._inTransactionProgress = false;
    // resolvers
    this.connectResolvers = /* @__PURE__ */ new Set();
    this.infoResolvers = /* @__PURE__ */ new Set();
    this.pubkeyResolvers = /* @__PURE__ */ new Set();
    this.signResolvers = /* @__PURE__ */ new Map();
  }
  get isAvailable() {
    return this.extension.isAvailable;
  }
  async init() {
    this.extension = new import_feather2.Extension();
    this.onResponse();
  }
  async connect() {
    return new Promise((...resolver) => {
      this.connectResolvers.add(resolver);
      this.extension.connect();
    });
  }
  async info() {
    return new Promise((...resolver) => {
      this.infoResolvers.add(resolver);
      this.extension.info();
    });
  }
  async getPubKey() {
    return new Promise((...resolver) => {
      this.pubkeyResolvers.add(resolver);
      this.extension.pubkey();
    });
  }
  disconnect() {
    this.connectResolvers.clear();
    this.infoResolvers.clear();
    this.signResolvers.clear();
  }
  async sign({ purgeQueue = true, ...data }) {
    return new Promise((...resolver) => {
      this._inTransactionProgress = true;
      const id = this.extension.sign({
        ...data,
        purgeQueue
      });
      this.signResolvers.set(id, resolver);
      setTimeout(() => {
        if (this.signResolvers.has(id)) {
          this.signResolvers.delete(id);
          if (this.signResolvers.size === 0) {
            this._inTransactionProgress = false;
          }
        }
      }, 1e3 * 120);
    });
  }
  onResponse() {
    this.extension.on("onConnect", (result) => {
      if (!result)
        return;
      const { error, ...payload } = result;
      for (const [resolve, reject] of this.connectResolvers) {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      }
      this.connectResolvers.clear();
    });
    this.extension.on("onGetPubkey", (result) => {
      if (!result)
        return;
      const { error, ...payload } = result;
      for (const [resolve, reject] of this.pubkeyResolvers) {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      }
      this.pubkeyResolvers.clear();
    });
    this.extension.on("onInterchainInfo", (result) => {
      if (!result)
        return;
      const { error, ...payload } = result;
      for (const [resolve, reject] of this.infoResolvers) {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      }
      this.infoResolvers.clear();
    });
    this.extension.on("onSign", (result) => {
      if (!result || !isValidResult(result)) {
        return;
      }
      const { error, ...payload } = result;
      if (this.signResolvers.has(payload.id)) {
        const [resolve, reject] = this.signResolvers.get(payload.id);
        if (!payload.success) {
          reject(error);
        } else if (resolve) {
          resolve({ name: "onSign", payload });
        }
        this.signResolvers.delete(payload.id);
        if (this.signResolvers.size === 0) {
          this._inTransactionProgress = false;
        }
      }
    });
  }
};

// src/extension/utils.ts
var getStationFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  if (!window.isStationExtensionAvailable) {
    throw import_core2.ClientNotExistError;
  }
  const stationExtension = new StationExtension();
  await stationExtension.init();
  return stationExtension;
};

// src/extension/main-wallet.ts
var StationExtensionWallet = class extends import_core3.MainWalletBase {
  constructor(walletInfo) {
    super(walletInfo, ChainStationExtension);
  }
  async initClient() {
    this.initingClient();
    try {
      const terra = await getStationFromExtension();
      this.initClientDone(terra ? new StationClient(terra) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StationExtensionWallet
});
//# sourceMappingURL=main-wallet.js.map