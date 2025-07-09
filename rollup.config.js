import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

export default {
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
};
