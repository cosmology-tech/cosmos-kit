"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _extension = require("./extension");
Object.keys(_extension).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _extension[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _extension[key];
    }
  });
});
var _client = require("./extension/client");
Object.keys(_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _client[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _client[key];
    }
  });
});
var _shell = require("./shell");
Object.keys(_shell).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _shell[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _shell[key];
    }
  });
});