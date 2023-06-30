"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShellFromExtension = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _core = require("@cosmos-kit/core");
// import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

var getShellFromExtension = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var shell;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(typeof window === 'undefined')) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", void 0);
        case 2:
          shell = window.shellwallet;
          if (!shell) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", shell);
        case 5:
          if (!(document.readyState === 'complete')) {
            _context.next = 11;
            break;
          }
          if (!shell) {
            _context.next = 10;
            break;
          }
          return _context.abrupt("return", shell);
        case 10:
          throw _core.ClientNotExistError;
        case 11:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            var documentStateChange = function documentStateChange(event) {
              if (event.target && event.target.readyState === 'complete') {
                if (shell) {
                  resolve(shell);
                } else {
                  reject(_core.ClientNotExistError.message);
                }
                document.removeEventListener('readystatechange', documentStateChange);
              }
            };
            document.addEventListener('readystatechange', documentStateChange);
          }));
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getShellFromExtension() {
    return _ref.apply(this, arguments);
  };
}();
exports.getShellFromExtension = getShellFromExtension;