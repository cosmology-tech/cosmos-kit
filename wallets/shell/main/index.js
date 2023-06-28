"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wallets = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _shellExtension = require("@cosmos-kit/shell-extension");
var wallets = (0, _toConsumableArray2["default"])(_shellExtension.wallets);
exports.wallets = wallets;