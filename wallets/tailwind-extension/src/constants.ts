import { Wallet } from '@cosmos-kit/core';

export const ICON =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiByeD0iMzYiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xMV8yNikiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xODguNzMzIDE0Mi43NEMyMTUuOTMzIDEyMS4xOTcgMjc5Ljk2NyAxMTkuNDk2IDI3Ni4zODUgMTYzLjU5MkgyNzYuMzk3QzI3My4xNjcgMjAzLjk2OSAyMzIuOTMzIDI0My42NTQgMTkxLjU2NyAyNzJINzJDMTUzLjYgMjQxLjM4NiAyMTQuMjc5IDE4MC40NjQgMTg4LjczMyAxNDIuNzRaTTI4My4zNjcgMjA3LjM3QzI3Mi42IDIzMC4wNDcgMjUxLjkxNyAyNTEuODE3IDIyNSAyNzJIMjg3LjlDMjk1LjgzMyAyNjUuMTk3IDMxMCAyNDguNzU2IDMxMCAyMzMuNDQ5QzMxMCAyMTguNzA5IDMwMC45MzMgMjEwLjIwNSAyODMuMzY3IDIwNy4zN1oiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTFfMjYiIHgxPSIyMDAiIHkxPSIwIiB4Mj0iMjAwIiB5Mj0iNDAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMzODAxQTUiLz4KPHN0b3Agb2Zmc2V0PSIxIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==';

export const tailwind_extension_info: Wallet = {
  name: 'tailwind-extension',
  prettyName: 'TAILWIND',
  mode: 'extension',
  mobileDisabled: true,
  logo: ICON,
  connectEventNamesOnWindow: ['tailwind_wallet_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chromewebstore.google.com/detail/tailwind-wallet/dpnfollacokcbkeiidhplhjpafkbfacj',
    },
    {
      link: 'https://chromewebstore.google.com/detail/tailwind-wallet/dpnfollacokcbkeiidhplhjpafkbfacj',
    },
  ],
};
