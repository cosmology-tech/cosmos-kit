"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _chainWallet = require("./chain-wallet");
Object.keys(_chainWallet).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _chainWallet[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _chainWallet[key];
    }
  });
});
var _mainWallet = require("./main-wallet");
Object.keys(_mainWallet).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _mainWallet[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mainWallet[key];
    }
  });
});
var _registry = require("./registry");
Object.keys(_registry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _registry[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _registry[key];
    }
  });
});