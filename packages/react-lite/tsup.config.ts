import { defineConfig } from 'tsup';

export default defineConfig({
  bundle: true,
  skipNodeModulesBundle: true,
  entry: ['src/**/*.{ts,tsx}'],
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  external: ['react'],
});
