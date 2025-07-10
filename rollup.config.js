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
      }),
      copy({
        targets: [
          { src: 'src/data', dest: 'dist' }
        ]
      })
    ],
    external: ['fs', 'path', 'url']
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
          { src: 'src/data', dest: 'dist' }
        ]
      })
    ],
    external: []
  }
];
