var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/hooks/useModalTheme.ts
var useModalTheme_exports = {};
__export(useModalTheme_exports, {
  useModalTheme: () => useModalTheme
});
module.exports = __toCommonJS(useModalTheme_exports);
var import_react = require("@cosmology-ui/react");
var import_react2 = __toESM(require("react"));
var useModalTheme = () => {
  const context = import_react2.default.useContext(import_react.ThemeContext);
  if (!context) {
    throw new Error("You have forgot to use ThemeProvider.");
  }
  return {
    modalTheme: context.theme.toString(),
    setModalTheme: (theme) => {
      switch (theme) {
        case "dark":
          context.setTheme(import_react.Themes.Dark);
          break;
        case "light":
          context.setTheme(import_react.Themes.Light);
          break;
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useModalTheme
});
//# sourceMappingURL=useModalTheme.js.map