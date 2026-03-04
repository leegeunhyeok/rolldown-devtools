import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    node: 'src/index.ts',
    cli: 'src/cli.ts',
  },
  target: 'esnext',
  exports: true,
  dts: true,
  clean: false,
  inputOptions: {
    experimental: {
      resolveNewUrlToAsset: false,
    },
  },
  inlineOnly: false,
});
