import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

export default [
  // Node.js build
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: 'dist/index.esm.js',
        format: 'es'
      }
    ],
    plugins: [
      typescript({
        rollupCommonJSResolveHack: false,
        clean: true
      })
    ],
    external: ['fs', 'path', 'url', 'vietnam-address-database']
  },
  // Browser build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.browser.js',
      format: 'umd',
      name: 'VietnamAddressConverter',
      globals: {}
    },
    plugins: [
      typescript({
        rollupCommonJSResolveHack: false,
        clean: false
      }),
      copy({
        targets: [
          // Copy data từ vietnam-address-database package cho browser
          { src: 'node_modules/vietnam-address-database/dist/address.json', dest: 'dist/data' }
        ]
      })
    ],
    external: []
  }
];
