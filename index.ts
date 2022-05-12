// Fix Safari's nonexistent browser.storage https://github.com/chainapsis/keplr-wallet/blob/4726a96b9663f17b91c5d6b0448bf85ebb4a678a/packages/common/src/kv-store/extension.ts

declare namespace browser.storage {
  const local: {
    get: undefined;
    set: undefined;
  };
}

if (
  typeof window !== "undefined" &&
  typeof browser !== "undefined" &&
  typeof browser.storage === "undefined"
) {
  browser.storage = { local: { get: undefined, set: undefined } };
}

export * from "./components";
export * from "./providers";
