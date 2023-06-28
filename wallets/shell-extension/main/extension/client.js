"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShellClient = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _keplr = require("@chain-registry/keplr");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var ShellClient = /*#__PURE__*/function () {
  function ShellClient(client) {
    (0, _classCallCheck2["default"])(this, ShellClient);
    (0, _defineProperty2["default"])(this, "client", void 0);
    this.client = client;
  }
  (0, _createClass2["default"])(ShellClient, [{
    key: "enable",
    value: function () {
      var _enable = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(chainIds) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.client.enable(chainIds);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function enable(_x) {
        return _enable.apply(this, arguments);
      }
      return enable;
    }()
  }, {
    key: "suggestToken",
    value: function () {
      var _suggestToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref) {
        var chainId, tokens, type, _iterator, _step, _step$value, contractAddress, viewingKey;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              chainId = _ref.chainId, tokens = _ref.tokens, type = _ref.type;
              if (!(type === 'cw20')) {
                _context2.next = 19;
                break;
              }
              _iterator = _createForOfIteratorHelper(tokens);
              _context2.prev = 3;
              _iterator.s();
            case 5:
              if ((_step = _iterator.n()).done) {
                _context2.next = 11;
                break;
              }
              _step$value = _step.value, contractAddress = _step$value.contractAddress, viewingKey = _step$value.viewingKey;
              _context2.next = 9;
              return this.client.suggestToken(chainId, contractAddress, viewingKey);
            case 9:
              _context2.next = 5;
              break;
            case 11:
              _context2.next = 16;
              break;
            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](3);
              _iterator.e(_context2.t0);
            case 16:
              _context2.prev = 16;
              _iterator.f();
              return _context2.finish(16);
            case 19:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[3, 13, 16, 19]]);
      }));
      function suggestToken(_x2) {
        return _suggestToken.apply(this, arguments);
      }
      return suggestToken;
    }()
  }, {
    key: "getSimpleAccount",
    value: function () {
      var _getSimpleAccount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(chainId) {
        var _yield$this$getAccoun, address, username;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.getAccount(chainId);
            case 2:
              _yield$this$getAccoun = _context3.sent;
              address = _yield$this$getAccoun.address;
              username = _yield$this$getAccoun.username;
              return _context3.abrupt("return", {
                namespace: 'cosmos',
                chainId: chainId,
                address: address,
                username: username
              });
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getSimpleAccount(_x3) {
        return _getSimpleAccount.apply(this, arguments);
      }
      return getSimpleAccount;
    }()
  }, {
    key: "getAccount",
    value: function () {
      var _getAccount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(chainId) {
        var key;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.client.getKey(chainId);
            case 2:
              key = _context4.sent;
              return _context4.abrupt("return", {
                username: key.name,
                address: key.bech32Address,
                algo: key.algo,
                pubkey: key.pubKey
              });
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function getAccount(_x4) {
        return _getAccount.apply(this, arguments);
      }
      return getAccount;
    }()
  }, {
    key: "getOfflineSigner",
    value: function getOfflineSigner(chainId, preferredSignType) {
      switch (preferredSignType) {
        case 'amino':
          return this.getOfflineSignerAmino(chainId);
        case 'direct':
          return this.getOfflineSignerDirect(chainId);
        default:
          return this.getOfflineSignerAmino(chainId);
      }
      // return this.client.getOfflineSignerAuto(chainId);
    }
  }, {
    key: "getOfflineSignerAmino",
    value: function getOfflineSignerAmino(chainId) {
      return this.client.getOfflineSignerOnlyAmino(chainId);
    }
  }, {
    key: "getOfflineSignerDirect",
    value: function getOfflineSignerDirect(chainId) {
      return this.client.getOfflineSigner(chainId);
    }
  }, {
    key: "addChain",
    value: function () {
      var _addChain = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(chainInfo) {
        var _chainInfo$preferredE, _chainInfo$preferredE2, _chainInfo$preferredE5, _chainInfo$preferredE6;
        var suggestChain, _chainInfo$preferredE3, _chainInfo$preferredE4, _chainInfo$preferredE7, _chainInfo$preferredE8;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              suggestChain = (0, _keplr.chainRegistryChainToKeplr)(chainInfo.chain, chainInfo.assetList ? [chainInfo.assetList] : []);
              if ((_chainInfo$preferredE = chainInfo.preferredEndpoints) !== null && _chainInfo$preferredE !== void 0 && (_chainInfo$preferredE2 = _chainInfo$preferredE.rest) !== null && _chainInfo$preferredE2 !== void 0 && _chainInfo$preferredE2[0]) {
                suggestChain.rest = (_chainInfo$preferredE3 = chainInfo.preferredEndpoints) === null || _chainInfo$preferredE3 === void 0 ? void 0 : (_chainInfo$preferredE4 = _chainInfo$preferredE3.rest) === null || _chainInfo$preferredE4 === void 0 ? void 0 : _chainInfo$preferredE4[0];
              }
              if ((_chainInfo$preferredE5 = chainInfo.preferredEndpoints) !== null && _chainInfo$preferredE5 !== void 0 && (_chainInfo$preferredE6 = _chainInfo$preferredE5.rpc) !== null && _chainInfo$preferredE6 !== void 0 && _chainInfo$preferredE6[0]) {
                suggestChain.rpc = (_chainInfo$preferredE7 = chainInfo.preferredEndpoints) === null || _chainInfo$preferredE7 === void 0 ? void 0 : (_chainInfo$preferredE8 = _chainInfo$preferredE7.rpc) === null || _chainInfo$preferredE8 === void 0 ? void 0 : _chainInfo$preferredE8[0];
              }
              _context5.next = 5;
              return this.client.experimentalSuggestChain(suggestChain);
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function addChain(_x5) {
        return _addChain.apply(this, arguments);
      }
      return addChain;
    }()
  }, {
    key: "signAmino",
    value: function () {
      var _signAmino = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(chainId, signer, signDoc, signOptions) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this.client.signAmino(chainId, signer, signDoc, signOptions);
            case 2:
              return _context6.abrupt("return", _context6.sent);
            case 3:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function signAmino(_x6, _x7, _x8, _x9) {
        return _signAmino.apply(this, arguments);
      }
      return signAmino;
    }()
  }, {
    key: "signArbitrary",
    value: function () {
      var _signArbitrary = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(chainId, signer, data) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.client.signArbitrary(chainId, signer, data);
            case 2:
              return _context7.abrupt("return", _context7.sent);
            case 3:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function signArbitrary(_x10, _x11, _x12) {
        return _signArbitrary.apply(this, arguments);
      }
      return signArbitrary;
    }()
  }, {
    key: "signDirect",
    value: function () {
      var _signDirect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(chainId, signer, signDoc, signOptions) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return this.client.signDirect(chainId, signer, signDoc, signOptions);
            case 2:
              return _context8.abrupt("return", _context8.sent);
            case 3:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function signDirect(_x13, _x14, _x15, _x16) {
        return _signDirect.apply(this, arguments);
      }
      return signDirect;
    }()
  }, {
    key: "sendTx",
    value: function () {
      var _sendTx = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(chainId, tx, mode) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this.client.sendTx(chainId, tx, mode);
            case 2:
              return _context9.abrupt("return", _context9.sent);
            case 3:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function sendTx(_x17, _x18, _x19) {
        return _sendTx.apply(this, arguments);
      }
      return sendTx;
    }()
  }]);
  return ShellClient;
}();
exports.ShellClient = ShellClient;