import esbuild from 'esbuild'

esbuild.buildSync({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/solana.js',
    format: 'cjs',
    bundle: true,
    platform: "node"
})
