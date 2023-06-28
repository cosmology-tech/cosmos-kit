"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wallets = void 0;
var _config = require("./config");
var _extension = require("./extension");
var shellExtension = new _extension.ShellExtensionWallet(_extension.shellExtensionInfo, _config.preferredEndpoints);
var wallets = [shellExtension];
exports.wallets = wallets;