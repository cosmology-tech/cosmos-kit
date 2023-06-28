"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShellExtensionWallet = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _core = require("@cosmos-kit/core");
var _chainWallet = require("./chain-wallet");
var _client = require("./client");
var _utils = require("./utils");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ShellExtensionWallet = /*#__PURE__*/function (_MainWalletBase) {
  (0, _inherits2["default"])(ShellExtensionWallet, _MainWalletBase);
  var _super = _createSuper(ShellExtensionWallet);
  function ShellExtensionWallet(walletInfo, preferredEndpoints) {
    var _this;
    (0, _classCallCheck2["default"])(this, ShellExtensionWallet);
    _this = _super.call(this, walletInfo, _chainWallet.ChainShellExtension);
    _this.preferredEndpoints = preferredEndpoints;
    return _this;
  }
  (0, _createClass2["default"])(ShellExtensionWallet, [{
    key: "initClient",
    value: function () {
      var _initClient = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var shell, _this$logger;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.initingClient();
              _context.prev = 1;
              _context.next = 4;
              return (0, _utils.getShellFromExtension)();
            case 4:
              shell = _context.sent;
              this.initClientDone(shell ? new _client.ShellClient(shell) : undefined);
              _context.next = 12;
              break;
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              (_this$logger = this.logger) === null || _this$logger === void 0 ? void 0 : _this$logger.error(_context.t0);
              this.initClientError(_context.t0);
            case 12:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[1, 8]]);
      }));
      function initClient() {
        return _initClient.apply(this, arguments);
      }
      return initClient;
    }()
  }]);
  return ShellExtensionWallet;
}(_core.MainWalletBase);
exports.ShellExtensionWallet = ShellExtensionWallet;