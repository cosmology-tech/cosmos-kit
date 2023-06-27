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

// src/utils/logger.ts
var logger_exports = {};
__export(logger_exports, {
  Logger: () => Logger
});
module.exports = __toCommonJS(logger_exports);
function wrap(logLevel, message) {
  switch (logLevel) {
    case "ERROR":
      return [`%c${logLevel} -`, "color: Red;", message];
    case "WARN":
      return [`%c${logLevel} -`, "color: Orange;", message];
    case "INFO":
      return [`%c${logLevel} -`, "color: Blue;", message];
    case "DEBUG":
      return [`%c${logLevel} -`, "color: Purple;", message];
    case "TRACE":
      return [`%c${logLevel} -`, "color: Brown;", message];
  }
}
var Logger = class {
  constructor(level = "INFO") {
    this.levelOrder = [
      "TRACE",
      "DEBUG",
      "INFO",
      "WARN",
      "ERROR"
    ];
    this.logger = console;
    this.level = level;
  }
  compare(a, b) {
    const aindex = this.levelOrder.indexOf(a);
    const bindex = this.levelOrder.indexOf(b);
    if (aindex > bindex) {
      return 1;
    } else if (aindex < bindex) {
      return -1;
    } else {
      return 0;
    }
  }
  trace(message, ...optionalParams) {
    if (this.compare("TRACE", this.level) >= 0) {
      this.logger.trace(...wrap("TRACE", message), ...optionalParams);
    }
  }
  debug(message, ...optionalParams) {
    if (this.compare("DEBUG", this.level) >= 0) {
      this.logger.debug(...wrap("DEBUG", message), ...optionalParams);
    }
  }
  info(message, ...optionalParams) {
    if (this.compare("INFO", this.level) >= 0) {
      this.logger.info(...wrap("INFO", message), ...optionalParams);
    }
  }
  warn(message, ...optionalParams) {
    if (this.compare("WARN", this.level) >= 0) {
      this.logger.warn(...wrap("WARN", message), ...optionalParams);
    }
  }
  error(message, ...optionalParams) {
    if (this.compare("ERROR", this.level) >= 0) {
      this.logger.error(...wrap("ERROR", message), ...optionalParams);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Logger
});
//# sourceMappingURL=logger.js.map