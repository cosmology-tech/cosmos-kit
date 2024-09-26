import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      outputDir: 'types',
    }),
  ],
  build: {
    lib: {
      entry: './src/index.ts', // 入口文件
      name: '@cosmos-kit/vue'
    },
    rollupOptions: {
      external: ['vue', '@cosmos-kit/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@cosmos-kit/core': 'CosmosKitCore',
        },
      },
    },
  },
});
