var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// ../../node_modules/long/src/long.js
var require_long = __commonJS({
  "../../node_modules/long/src/long.js"(exports, module) {
    module.exports = Long2;
    var wasm = null;
    try {
      wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
        0,
        97,
        115,
        109,
        1,
        0,
        0,
        0,
        1,
        13,
        2,
        96,
        0,
        1,
        127,
        96,
        4,
        127,
        127,
        127,
        127,
        1,
        127,
        3,
        7,
        6,
        0,
        1,
        1,
        1,
        1,
        1,
        6,
        6,
        1,
        127,
        1,
        65,
        0,
        11,
        7,
        50,
        6,
        3,
        109,
        117,
        108,
        0,
        1,
        5,
        100,
        105,
        118,
        95,
        115,
        0,
        2,
        5,
        100,
        105,
        118,
        95,
        117,
        0,
        3,
        5,
        114,
        101,
        109,
        95,
        115,
        0,
        4,
        5,
        114,
        101,
        109,
        95,
        117,
        0,
        5,
        8,
        103,
        101,
        116,
        95,
        104,
        105,
        103,
        104,
        0,
        0,
        10,
        191,
        1,
        6,
        4,
        0,
        35,
        0,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        126,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        127,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        128,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        129,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        130,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11
      ])), {}).exports;
    } catch (e) {
    }
    function Long2(low, high, unsigned) {
      this.low = low | 0;
      this.high = high | 0;
      this.unsigned = !!unsigned;
    }
    Long2.prototype.__isLong__;
    Object.defineProperty(Long2.prototype, "__isLong__", { value: true });
    function isLong(obj) {
      return (obj && obj["__isLong__"]) === true;
    }
    Long2.isLong = isLong;
    var INT_CACHE = {};
    var UINT_CACHE = {};
    function fromInt(value, unsigned) {
      var obj, cachedObj, cache;
      if (unsigned) {
        value >>>= 0;
        if (cache = 0 <= value && value < 256) {
          cachedObj = UINT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
          UINT_CACHE[value] = obj;
        return obj;
      } else {
        value |= 0;
        if (cache = -128 <= value && value < 128) {
          cachedObj = INT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
          INT_CACHE[value] = obj;
        return obj;
      }
    }
    Long2.fromInt = fromInt;
    function fromNumber(value, unsigned) {
      if (isNaN(value))
        return unsigned ? UZERO : ZERO;
      if (unsigned) {
        if (value < 0)
          return UZERO;
        if (value >= TWO_PWR_64_DBL)
          return MAX_UNSIGNED_VALUE;
      } else {
        if (value <= -TWO_PWR_63_DBL)
          return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
          return MAX_VALUE;
      }
      if (value < 0)
        return fromNumber(-value, unsigned).neg();
      return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }
    Long2.fromNumber = fromNumber;
    function fromBits(lowBits, highBits, unsigned) {
      return new Long2(lowBits, highBits, unsigned);
    }
    Long2.fromBits = fromBits;
    var pow_dbl = Math.pow;
    function fromString(str, unsigned, radix) {
      if (str.length === 0)
        throw Error("empty string");
      if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
      if (typeof unsigned === "number") {
        radix = unsigned, unsigned = false;
      } else {
        unsigned = !!unsigned;
      }
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      var p;
      if ((p = str.indexOf("-")) > 0)
        throw Error("interior hyphen");
      else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
      }
      var radixToPower = fromNumber(pow_dbl(radix, 8));
      var result = ZERO;
      for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
          var power = fromNumber(pow_dbl(radix, size));
          result = result.mul(power).add(fromNumber(value));
        } else {
          result = result.mul(radixToPower);
          result = result.add(fromNumber(value));
        }
      }
      result.unsigned = unsigned;
      return result;
    }
    Long2.fromString = fromString;
    function fromValue(val, unsigned) {
      if (typeof val === "number")
        return fromNumber(val, unsigned);
      if (typeof val === "string")
        return fromString(val, unsigned);
      return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
    }
    Long2.fromValue = fromValue;
    var TWO_PWR_16_DBL = 1 << 16;
    var TWO_PWR_24_DBL = 1 << 24;
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
    var ZERO = fromInt(0);
    Long2.ZERO = ZERO;
    var UZERO = fromInt(0, true);
    Long2.UZERO = UZERO;
    var ONE = fromInt(1);
    Long2.ONE = ONE;
    var UONE = fromInt(1, true);
    Long2.UONE = UONE;
    var NEG_ONE = fromInt(-1);
    Long2.NEG_ONE = NEG_ONE;
    var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
    Long2.MAX_VALUE = MAX_VALUE;
    var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
    Long2.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
    var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
    Long2.MIN_VALUE = MIN_VALUE;
    var LongPrototype = Long2.prototype;
    LongPrototype.toInt = function toInt() {
      return this.unsigned ? this.low >>> 0 : this.low;
    };
    LongPrototype.toNumber = function toNumber() {
      if (this.unsigned)
        return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
      return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };
    LongPrototype.toString = function toString(radix) {
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      if (this.isZero())
        return "0";
      if (this.isNegative()) {
        if (this.eq(MIN_VALUE)) {
          var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
          return div.toString(radix) + rem1.toInt().toString(radix);
        } else
          return "-" + this.neg().toString(radix);
      }
      var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
      var result = "";
      while (true) {
        var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
          return digits + result;
        else {
          while (digits.length < 6)
            digits = "0" + digits;
          result = "" + digits + result;
        }
      }
    };
    LongPrototype.getHighBits = function getHighBits() {
      return this.high;
    };
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
      return this.high >>> 0;
    };
    LongPrototype.getLowBits = function getLowBits() {
      return this.low;
    };
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
      return this.low >>> 0;
    };
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
      if (this.isNegative())
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
      var val = this.high != 0 ? this.high : this.low;
      for (var bit = 31; bit > 0; bit--)
        if ((val & 1 << bit) != 0)
          break;
      return this.high != 0 ? bit + 33 : bit + 1;
    };
    LongPrototype.isZero = function isZero() {
      return this.high === 0 && this.low === 0;
    };
    LongPrototype.eqz = LongPrototype.isZero;
    LongPrototype.isNegative = function isNegative() {
      return !this.unsigned && this.high < 0;
    };
    LongPrototype.isPositive = function isPositive() {
      return this.unsigned || this.high >= 0;
    };
    LongPrototype.isOdd = function isOdd() {
      return (this.low & 1) === 1;
    };
    LongPrototype.isEven = function isEven() {
      return (this.low & 1) === 0;
    };
    LongPrototype.equals = function equals(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
        return false;
      return this.high === other.high && this.low === other.low;
    };
    LongPrototype.eq = LongPrototype.equals;
    LongPrototype.notEquals = function notEquals(other) {
      return !this.eq(
        /* validates */
        other
      );
    };
    LongPrototype.neq = LongPrototype.notEquals;
    LongPrototype.ne = LongPrototype.notEquals;
    LongPrototype.lessThan = function lessThan(other) {
      return this.comp(
        /* validates */
        other
      ) < 0;
    };
    LongPrototype.lt = LongPrototype.lessThan;
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) <= 0;
    };
    LongPrototype.lte = LongPrototype.lessThanOrEqual;
    LongPrototype.le = LongPrototype.lessThanOrEqual;
    LongPrototype.greaterThan = function greaterThan(other) {
      return this.comp(
        /* validates */
        other
      ) > 0;
    };
    LongPrototype.gt = LongPrototype.greaterThan;
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) >= 0;
    };
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;
    LongPrototype.ge = LongPrototype.greaterThanOrEqual;
    LongPrototype.compare = function compare(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.eq(other))
        return 0;
      var thisNeg = this.isNegative(), otherNeg = other.isNegative();
      if (thisNeg && !otherNeg)
        return -1;
      if (!thisNeg && otherNeg)
        return 1;
      if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
      return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    };
    LongPrototype.comp = LongPrototype.compare;
    LongPrototype.negate = function negate() {
      if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
      return this.not().add(ONE);
    };
    LongPrototype.neg = LongPrototype.negate;
    LongPrototype.add = function add(addend) {
      if (!isLong(addend))
        addend = fromValue(addend);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = addend.high >>> 16;
      var b32 = addend.high & 65535;
      var b16 = addend.low >>> 16;
      var b00 = addend.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 + b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 + b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 + b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 + b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.subtract = function subtract(subtrahend) {
      if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
      return this.add(subtrahend.neg());
    };
    LongPrototype.sub = LongPrototype.subtract;
    LongPrototype.multiply = function multiply(multiplier) {
      if (this.isZero())
        return ZERO;
      if (!isLong(multiplier))
        multiplier = fromValue(multiplier);
      if (wasm) {
        var low = wasm.mul(
          this.low,
          this.high,
          multiplier.low,
          multiplier.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (multiplier.isZero())
        return ZERO;
      if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
      if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;
      if (this.isNegative()) {
        if (multiplier.isNegative())
          return this.neg().mul(multiplier.neg());
        else
          return this.neg().mul(multiplier).neg();
      } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();
      if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = multiplier.high >>> 16;
      var b32 = multiplier.high & 65535;
      var b16 = multiplier.low >>> 16;
      var b00 = multiplier.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 * b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 * b00;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c16 += a00 * b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 * b00;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a16 * b16;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a00 * b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.mul = LongPrototype.multiply;
    LongPrototype.divide = function divide(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (divisor.isZero())
        throw Error("division by zero");
      if (wasm) {
        if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
          return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
      var approx, rem, res;
      if (!this.unsigned) {
        if (this.eq(MIN_VALUE)) {
          if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
            return MIN_VALUE;
          else if (divisor.eq(MIN_VALUE))
            return ONE;
          else {
            var halfThis = this.shr(1);
            approx = halfThis.div(divisor).shl(1);
            if (approx.eq(ZERO)) {
              return divisor.isNegative() ? ONE : NEG_ONE;
            } else {
              rem = this.sub(divisor.mul(approx));
              res = approx.add(rem.div(divisor));
              return res;
            }
          }
        } else if (divisor.eq(MIN_VALUE))
          return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
          if (divisor.isNegative())
            return this.neg().div(divisor.neg());
          return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
          return this.div(divisor.neg()).neg();
        res = ZERO;
      } else {
        if (!divisor.unsigned)
          divisor = divisor.toUnsigned();
        if (divisor.gt(this))
          return UZERO;
        if (divisor.gt(this.shru(1)))
          return UONE;
        res = UZERO;
      }
      rem = this;
      while (rem.gte(divisor)) {
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
        var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
          approx -= delta;
          approxRes = fromNumber(approx, this.unsigned);
          approxRem = approxRes.mul(divisor);
        }
        if (approxRes.isZero())
          approxRes = ONE;
        res = res.add(approxRes);
        rem = rem.sub(approxRem);
      }
      return res;
    };
    LongPrototype.div = LongPrototype.divide;
    LongPrototype.modulo = function modulo(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      return this.sub(this.div(divisor).mul(divisor));
    };
    LongPrototype.mod = LongPrototype.modulo;
    LongPrototype.rem = LongPrototype.modulo;
    LongPrototype.not = function not() {
      return fromBits(~this.low, ~this.high, this.unsigned);
    };
    LongPrototype.and = function and(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };
    LongPrototype.or = function or(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };
    LongPrototype.xor = function xor(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
      else
        return fromBits(0, this.low << numBits - 32, this.unsigned);
    };
    LongPrototype.shl = LongPrototype.shiftLeft;
    LongPrototype.shiftRight = function shiftRight(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
      else
        return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    };
    LongPrototype.shr = LongPrototype.shiftRight;
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      numBits &= 63;
      if (numBits === 0)
        return this;
      else {
        var high = this.high;
        if (numBits < 32) {
          var low = this.low;
          return fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits, this.unsigned);
        } else if (numBits === 32)
          return fromBits(high, 0, this.unsigned);
        else
          return fromBits(high >>> numBits - 32, 0, this.unsigned);
      }
    };
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;
    LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
    LongPrototype.toSigned = function toSigned() {
      if (!this.unsigned)
        return this;
      return fromBits(this.low, this.high, false);
    };
    LongPrototype.toUnsigned = function toUnsigned() {
      if (this.unsigned)
        return this;
      return fromBits(this.low, this.high, true);
    };
    LongPrototype.toBytes = function toBytes(le) {
      return le ? this.toBytesLE() : this.toBytesBE();
    };
    LongPrototype.toBytesLE = function toBytesLE() {
      var hi = this.high, lo = this.low;
      return [
        lo & 255,
        lo >>> 8 & 255,
        lo >>> 16 & 255,
        lo >>> 24,
        hi & 255,
        hi >>> 8 & 255,
        hi >>> 16 & 255,
        hi >>> 24
      ];
    };
    LongPrototype.toBytesBE = function toBytesBE() {
      var hi = this.high, lo = this.low;
      return [
        hi >>> 24,
        hi >>> 16 & 255,
        hi >>> 8 & 255,
        hi & 255,
        lo >>> 24,
        lo >>> 16 & 255,
        lo >>> 8 & 255,
        lo & 255
      ];
    };
    Long2.fromBytes = function fromBytes(bytes, unsigned, le) {
      return le ? Long2.fromBytesLE(bytes, unsigned) : Long2.fromBytesBE(bytes, unsigned);
    };
    Long2.fromBytesLE = function fromBytesLE(bytes, unsigned) {
      return new Long2(
        bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
        bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
        unsigned
      );
    };
    Long2.fromBytesBE = function fromBytesBE(bytes, unsigned) {
      return new Long2(
        bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
        bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
        unsigned
      );
    };
  }
});

// src/chain-wallet.ts
import {
  ChainWalletBase,
  State
} from "@cosmos-kit/core";
var ChainWC = class extends ChainWalletBase {
  constructor(walletInfo, chainInfo, WCClient2) {
    super(walletInfo, chainInfo);
    this.clientMutable = { state: State.Init };
    this.WCClient = WCClient2;
  }
  setClientNotExist() {
    this.setState(State.Error);
    this.setMessage(this.clientMutable.message);
  }
};

// src/client.ts
var import_long = __toESM(require_long());
import {
  ExpiredError,
  RejectedError,
  State as State2
} from "@cosmos-kit/core";
import SignClient from "@walletconnect/sign-client";
import { getSdkError } from "@walletconnect/utils";

// src/utils/core.ts
var WALLETCONNECT_DEEPLINK_CHOICE = "WALLETCONNECT_DEEPLINK_CHOICE";
var CoreUtil = {
  isHttpUrl(url) {
    return url.startsWith("http://") || url.startsWith("https://");
  },
  formatNativeUrl(appUrl, wcUri, os, name) {
    if (CoreUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri, name);
    }
    const plainAppUrl = appUrl.replaceAll("/", "").replaceAll(":", "");
    CoreUtil.setWalletConnectDeepLink(plainAppUrl, name);
    const encodedWcUrl = encodeURIComponent(wcUri);
    return `${plainAppUrl}://wc?uri=${encodedWcUrl}`;
  },
  formatUniversalUrl(appUrl, wcUri, name) {
    if (!CoreUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri, name);
    }
    let plainAppUrl = appUrl;
    if (appUrl.endsWith("/")) {
      plainAppUrl = appUrl.slice(0, -1);
    }
    CoreUtil.setWalletConnectDeepLink(plainAppUrl, name);
    const encodedWcUrl = encodeURIComponent(wcUri);
    return `${plainAppUrl}/wc?uri=${encodedWcUrl}`;
  },
  async wait(miliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, miliseconds);
    });
  },
  openHref(href, target = "_self") {
    window.open(href, target, "noreferrer noopener");
  },
  setWalletConnectDeepLink(href, name) {
    localStorage.setItem(
      WALLETCONNECT_DEEPLINK_CHOICE,
      JSON.stringify({ href, name })
    );
  },
  removeWalletConnectDeepLink() {
    localStorage.removeItem(WALLETCONNECT_DEEPLINK_CHOICE);
  }
};

// src/client.ts
var EXPLORER_API = "https://explorer-api.walletconnect.com";
var WCClient = class {
  constructor(walletInfo) {
    this.pairings = [];
    this.sessions = [];
    if (!walletInfo.walletconnect) {
      throw new Error(
        `'walletconnect' info for wallet ${walletInfo.prettyName} is not provided in wallet registry.`
      );
    }
    this.walletInfo = walletInfo;
    this.qrUrl = { state: State2.Init };
    this.appUrl = { state: State2.Init };
  }
  get isMobile() {
    return this.env?.device === "mobile";
  }
  // walletconnect wallet name
  get wcName() {
    return this.walletInfo.walletconnect.name;
  }
  // wallet defined bytes encoding
  get wcEncoding() {
    return this.walletInfo.walletconnect.encoding || "hex";
  }
  // walletconnect wallet project id
  get wcProjectId() {
    return this.walletInfo.walletconnect.projectId;
  }
  // walletconnect wallet mobile link
  get wcMobile() {
    return this.walletInfo.walletconnect.mobile;
  }
  get accounts() {
    const accounts = [];
    this.sessions.forEach((s) => {
      Object.entries(s.namespaces).forEach(([, nsValue]) => {
        nsValue.accounts.forEach((account) => {
          const [namespace, chainId, address] = account.split(":");
          accounts.push({
            namespace,
            chainId,
            address
          });
        });
      });
    });
    return accounts;
  }
  deleteSession(topic) {
    const chainIds = [];
    this.sessions = this.sessions.filter((s) => {
      if (s.topic === topic) {
        s.namespaces.cosmos.accounts.forEach((account) => {
          const [, chainId] = account.split(":");
          chainIds.push(chainId);
        });
        return false;
      } else {
        return true;
      }
    });
    this.emitter?.emit("reset", chainIds);
    this.logger?.debug("[WALLET EVENT] Emit `reset`");
  }
  subscribeToEvents() {
    if (typeof this.signClient === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    this.signClient.on("session_ping", (args) => {
      this.logger?.debug("EVENT", "session_ping", args);
    });
    this.signClient.on("session_event", async (args) => {
      this.logger?.debug("EVENT", "session_event", args);
    });
    this.signClient.on("session_update", ({ topic, params }) => {
      this.logger?.debug("EVENT", "session_update", { topic, params });
    });
    this.signClient.on("session_delete", (args) => {
      this.logger?.debug("EVENT", "session_delete", args);
      this.deleteSession(args.topic);
    });
    this.signClient.on("session_expire", (args) => {
      this.logger?.debug("EVENT", "session_expire", args);
      this.deleteSession(args.topic);
    });
    this.signClient.on("session_proposal", (args) => {
      this.logger?.debug("EVENT", "session_proposal", args);
    });
    this.signClient.on("session_request", (args) => {
      this.logger?.debug("EVENT", "session_request", args);
    });
    this.signClient.on("proposal_expire", (args) => {
      this.logger?.debug("EVENT", "proposal_expire", args);
    });
  }
  async deleteInactivePairings() {
    if (typeof this.signClient === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    for (const pairing of this.signClient.pairing.getAll({ active: false })) {
      await this.signClient.pairing.delete(pairing.topic, {
        code: 7001,
        message: "Clear inactive pairings."
      });
      this.logger?.debug("Delete inactive pairing:", pairing.topic);
    }
  }
  restorePairings() {
    if (typeof this.signClient === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    this.pairings = this.signClient.pairing.getAll({ active: true }).filter(
      (p) => p.peerMetadata?.name === this.wcName && p.expiry * 1e3 > Date.now() + 1e3
    );
    this.logger?.debug("RESTORED PAIRINGS: ", this.pairings);
  }
  get pairing() {
    return this.pairings[0];
  }
  restoreSessions() {
    if (typeof this.signClient === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    this.sessions = this.signClient.session.getAll().filter(
      (s) => s.peer.metadata.name === this.wcName && s.expiry * 1e3 > Date.now() + 1e3
    );
    this.logger?.debug("RESTORED SESSIONS: ", this.sessions);
  }
  getSession(namespace, chainId) {
    return this.sessions.find(
      (s) => s.namespaces[namespace]?.accounts?.find(
        (account) => account.startsWith(`${namespace}:${chainId}`)
      )
    );
  }
  get walletName() {
    return this.walletInfo.name;
  }
  get dappProjectId() {
    return this.options?.signClient.projectId;
  }
  setActions(actions) {
    this.actions = actions;
  }
  setQRState(state) {
    this.qrUrl.state = state;
    this.actions?.qrUrl?.state(state);
  }
  setQRError(e) {
    this.setQRState(State2.Error);
    this.qrUrl.message = typeof e === "string" ? e : e?.message;
    this.actions?.qrUrl?.message?.(this.qrUrl.message);
    if (typeof e !== "string" && e?.stack) {
      this.logger?.error(e.stack);
    }
  }
  async init() {
    await this.initSignClient();
    if (this.isMobile) {
      await this.initAppUrl();
    }
  }
  async initSignClient() {
    if (this.signClient && this.relayUrl === this.options?.signClient.relayUrl) {
      return;
    }
    this.signClient = await SignClient.init(this.options?.signClient);
    this.relayUrl = this.options?.signClient.relayUrl;
    this.logger?.debug("CREATED CLIENT: ", this.signClient);
    this.logger?.debug("relayerRegion ", this.options?.signClient.relayUrl);
    this.subscribeToEvents();
    this.restorePairings();
    this.restoreSessions();
  }
  async initWCCloudInfo() {
    const fetcUrl = `${EXPLORER_API}/v3/wallets?projectId=${this.dappProjectId}&sdks=sign_v2&search=${this.wcName}`;
    const fetched = await (await fetch(fetcUrl)).json();
    this.wcCloudInfo = fetched.listings[this.walletInfo.walletconnect?.projectId];
    this.logger?.debug("WalletConnect Info:", this.wcCloudInfo);
  }
  async initAppUrl() {
    this.appUrl.state = State2.Pending;
    if (!this.wcCloudInfo)
      await this.initWCCloudInfo();
    const native = this.wcCloudInfo.mobile.native || this.wcMobile?.native;
    const universal = this.wcCloudInfo.mobile.universal || this.wcMobile?.universal;
    this.appUrl.data = { native, universal };
    this.appUrl.state = State2.Done;
  }
  get nativeUrl() {
    const native = this.appUrl.data?.native;
    if (typeof native === "string" || typeof native === "undefined") {
      return native;
    } else {
      const { android, ios, macos, windows } = native;
      switch (this.env?.os) {
        case "android":
          return android;
        case "ios":
          return ios;
        case "macos":
          return macos;
        case "windows":
          return windows;
        default:
          throw new Error(`Unknown os: ${this.env?.os}.`);
      }
    }
  }
  get universalUrl() {
    return this.appUrl.data?.universal;
  }
  get redirectHref() {
    return this.nativeUrl || this.universalUrl;
  }
  get redirectHrefWithWCUri() {
    let href;
    if (this.nativeUrl) {
      href = (this.walletInfo.walletconnect.formatNativeUrl || CoreUtil.formatNativeUrl)(this.nativeUrl, this.qrUrl.data, this.env?.os, this.walletName);
    } else if (this.universalUrl) {
      href = (this.walletInfo.walletconnect.formatUniversalUrl || CoreUtil.formatUniversalUrl)(this.universalUrl, this.qrUrl.data, this.walletName);
    }
    return href;
  }
  get displayQRCode() {
    if (this.pairing || this.redirect) {
      return false;
    } else {
      return true;
    }
  }
  get redirect() {
    return Boolean(this.isMobile && (this.nativeUrl || this.universalUrl));
  }
  openApp(withWCUri = true) {
    const href = withWCUri ? this.redirectHrefWithWCUri : this.redirectHref;
    if (href) {
      this.logger?.debug("Redirecting:", href);
      CoreUtil.openHref(href);
    } else {
      this.logger?.error("No redirecting href.");
    }
  }
  async connect(chainIds) {
    if (typeof this.signClient === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (this.qrUrl.state !== "Init") {
      this.setQRState(State2.Init);
    }
    const chainIdsWithNS = typeof chainIds === "string" ? [`cosmos:${chainIds}`] : chainIds.map((chainId) => `cosmos:${chainId}`);
    this.restorePairings();
    const pairing = this.pairing;
    this.logger?.debug("Restored active pairing topic is:", pairing?.topic);
    if (this.displayQRCode)
      this.setQRState(State2.Pending);
    const requiredNamespaces = {
      cosmos: {
        methods: [
          "cosmos_getAccounts",
          "cosmos_signAmino",
          "cosmos_signDirect"
        ],
        chains: chainIdsWithNS,
        events: ["chainChanged", "accountsChanged"]
      }
    };
    let connectResp;
    try {
      this.logger?.debug("Connecting chains:", chainIdsWithNS);
      connectResp = await this.signClient.connect({
        pairingTopic: pairing?.topic,
        requiredNamespaces
      });
      this.qrUrl.data = connectResp.uri;
      this.logger?.debug("Using QR URI:", connectResp.uri);
      if (this.displayQRCode)
        this.setQRState(State2.Done);
    } catch (error) {
      this.logger?.error("Client connect error: ", error);
      if (this.displayQRCode)
        this.setQRError(error);
      return;
    }
    if (this.redirect)
      this.openApp();
    try {
      const session = await connectResp.approval();
      this.logger?.debug("Established session:", session);
      this.sessions.push(session);
      this.restorePairings();
    } catch (error) {
      this.logger?.error("Session approval error: ", error);
      await this.deleteInactivePairings();
      if (!error) {
        if (this.displayQRCode)
          this.setQRError(ExpiredError);
        throw new Error("Proposal Expired");
      } else if (error.code == 5001) {
        throw RejectedError;
      } else {
        throw error;
      }
    } finally {
      if (!pairing && this.qrUrl.message !== ExpiredError.message) {
        this.setQRState(State2.Init);
      }
    }
  }
  async disconnect() {
    if (typeof this.signClient === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (this.sessions.length === 0) {
      return;
    }
    for (const session of this.sessions) {
      try {
        this.logger?.debug("Delete session:", session);
        await this.signClient.disconnect({
          topic: session.topic,
          reason: getSdkError("USER_DISCONNECTED")
        });
      } catch (error) {
        this.logger?.error(
          `SignClient.disconnect session ${session.topic} failed:`,
          error
        );
      }
    }
    this.sessions = [];
    this.emitter?.emit("sync_disconnect");
    this.logger?.debug("[WALLET EVENT] Emit `sync_disconnect`");
  }
  async getSimpleAccount(chainId) {
    const account = this.accounts.find(({ chainId: id }) => id === chainId);
    if (!account) {
      throw new Error(
        `Chain ${chainId} is not connected yet, please check the session approval namespaces`
      );
    }
    return account;
  }
  getOfflineSignerAmino(chainId) {
    return {
      getAccounts: async () => [await this.getAccount(chainId)],
      signAmino: (signerAddress, signDoc) => this.signAmino(chainId, signerAddress, signDoc)
    };
  }
  getOfflineSignerDirect(chainId) {
    return {
      getAccounts: async () => [await this.getAccount(chainId)],
      signDirect: (signerAddress, signDoc) => this.signDirect(chainId, signerAddress, signDoc)
    };
  }
  async getOfflineSigner(chainId, preferredSignType) {
    if (preferredSignType === "amino" && this.getOfflineSignerAmino) {
      return this.getOfflineSignerAmino(chainId);
    }
    if (preferredSignType === "direct" && this.getOfflineSignerDirect) {
      return this.getOfflineSignerDirect(chainId);
    }
    return this.getOfflineSignerAmino ? this.getOfflineSignerAmino?.(chainId) : this.getOfflineSignerDirect(chainId);
  }
  async _getAccount(chainId) {
    const session = this.getSession("cosmos", chainId);
    if (!session) {
      throw new Error(`Session for ${chainId} not established yet.`);
    }
    const resp = await this.signClient.request({
      topic: session.topic,
      chainId: `cosmos:${chainId}`,
      request: {
        method: "cosmos_getAccounts",
        params: {}
      }
    });
    this.logger?.debug(`Response of cosmos_getAccounts`, resp);
    return resp;
  }
  async getAccount(chainId) {
    const { address, algo, pubkey } = (await this._getAccount(chainId))[0];
    return {
      address,
      algo,
      pubkey: new Uint8Array(Buffer.from(pubkey, this.wcEncoding))
    };
  }
  async _signAmino(chainId, signer, signDoc, signOptions) {
    const session = this.getSession("cosmos", chainId);
    if (!session) {
      throw new Error(`Session for ${chainId} not established yet.`);
    }
    if (this.redirect)
      this.openApp();
    const resp = await this.signClient.request({
      topic: session.topic,
      chainId: `cosmos:${chainId}`,
      request: {
        method: "cosmos_signAmino",
        params: {
          signerAddress: signer,
          signDoc
        }
      }
    });
    this.logger?.debug(`Response of cosmos_signAmino`, resp);
    return resp;
  }
  async signAmino(chainId, signer, signDoc, signOptions) {
    const result = await this._signAmino(
      chainId,
      signer,
      signDoc,
      signOptions
    );
    return result;
  }
  async _signDirect(chainId, signer, signDoc, signOptions) {
    const session = this.getSession("cosmos", chainId);
    if (!session) {
      throw new Error(`Session for ${chainId} not established yet.`);
    }
    const signDocValue = {
      signerAddress: signer,
      signDoc: {
        chainId: signDoc.chainId,
        bodyBytes: Buffer.from(signDoc.bodyBytes).toString(this.wcEncoding),
        authInfoBytes: Buffer.from(signDoc.authInfoBytes).toString(
          this.wcEncoding
        ),
        accountNumber: signDoc.accountNumber.toString()
      }
    };
    if (this.redirect)
      this.openApp();
    const resp = await this.signClient.request({
      topic: session.topic,
      chainId: `cosmos:${chainId}`,
      request: {
        method: "cosmos_signDirect",
        params: signDocValue
      }
    });
    this.logger?.debug(`Response of cosmos_signDirect`, resp);
    return resp;
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    const { signed, signature } = await this._signDirect(
      chainId,
      signer,
      signDoc,
      signOptions
    );
    return {
      signed: {
        chainId: signed.chainId,
        accountNumber: import_long.default.fromString(signed.accountNumber, false),
        authInfoBytes: new Uint8Array(
          Buffer.from(signed.authInfoBytes, this.wcEncoding)
        ),
        bodyBytes: new Uint8Array(
          Buffer.from(signed.bodyBytes, this.wcEncoding)
        )
      },
      signature
    };
  }
  // restoreLatestSession() {
  //   if (typeof this.signClient === 'undefined') {
  //     throw new Error('WalletConnect is not initialized');
  //   }
  //   if (typeof this.session !== 'undefined') return;
  //   const targetKey = this.signClient.session.keys.reverse().find((key) => {
  //     const session = this.signClient.session.get(key);
  //     return (
  //       session.peer.metadata.name === this.walletWCName &&
  //       session.expiry * 1000 > Date.now() + 1000
  //     );
  //   });
  //   if (targetKey) {
  //     this.session = this.signClient.session.get(targetKey);
  //     this.logger?.debug('RESTORED LATEST SESSION:', this.session);
  //   }
  // }
};

// src/main-wallet.ts
import { State as State3 } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";
var WCWallet = class extends MainWalletBase {
  constructor(walletInfo, ChainWC2, WCClient2) {
    if (!walletInfo.walletconnect) {
      throw new Error(
        `'walletconnect' info for wallet ${walletInfo.prettyName} is not provided in wallet registry.`
      );
    }
    super(walletInfo, ChainWC2);
    this.clientMutable = { state: State3.Init };
    this.WCClient = WCClient2;
  }
  async initClient(options) {
    if (!options) {
      this.initClientError(
        new Error("`walletconnectOptions` is not provided.")
      );
      return;
    }
    if (!options.signClient.projectId) {
      this.initClientError(
        new Error("`projectId` is not provided in `walletconnectOptions`.")
      );
      return;
    }
    this.initingClient();
    try {
      const client = new this.WCClient(this.walletInfo);
      client.logger = this.logger;
      client.emitter = this.emitter;
      client.env = this.env;
      client.options = options;
      await client.init();
      this.initClientDone(client);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
export {
  ChainWC,
  WCClient,
  WCWallet
};
//# sourceMappingURL=index.mjs.map