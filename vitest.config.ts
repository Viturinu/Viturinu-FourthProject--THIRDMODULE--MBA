import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path'; // <-- Adicione esta linha
// import tsConfigPaths from "vite-tsconfig-paths" //Isso aqui permite os testes vitest utilizar os paths que definimos lá no tsconfig.ts

//teste unitario
export default defineConfig({
    test: {
        globals: true, //dessa forma os tipos declarados no tsconfig ficam globalmente disponíveis, logo não há necessidade de ficar importando test, expect, etc
        root: './',
    },
    plugins: [
        // This is required to build the test files with SWC
        swc.vite({//aqui que ele está usando o swc
            // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
            module: { type: 'es6' },
        }),
        // tsConfigPaths(),
    ],
    resolve: {
        alias: {
            // Ensure Vitest correctly resolves TypeScript path aliases
            'src': resolve(__dirname, './src'),
        },
    },
});