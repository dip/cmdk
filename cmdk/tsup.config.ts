import { defineConfig } from 'tsup'

export default defineConfig({
  sourcemap: false,
  esbuildOptions(options) {
    // Whitespace minification removes pure annotations needed by downstream bundlers.
    options.minifyIdentifiers = true
    options.minifySyntax = true
  },
  dts: true,
  format: ['esm', 'cjs'],
  loader: {
    '.js': 'jsx',
  },
})
