import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path'; // <-- Adicione esta linha
// import tsConfigPaths from "vite-tsconfig-paths" //Isso aqui permite os testes vitest utilizar os paths que definimos lá no tsconfig.ts

//teste e2e - as config padrão que o vistest vai buscar são do vitest.config.ts, no entanto no páckage.json estamos especificando este config com uma flag
export default defineConfig({
    test: {
        include: ['**/*.e2e-spec.ts'],
        globals: true, //aqui faz os tipos declarados no tsconfig ficarem globalmente acessiveis nos testes que contemplam este arquivo de configuração (include: ['**/*.e2e-spec.ts'],)
        root: './',
        setupFiles: ["./test/setup-e2e.ts"] //aqui é como se fosse um middleware, pois antes de executar qualquer coisa ele executa isso aqui
    },
    plugins: [
        // This is required to build the test files with SWC
        swc.vite({
            // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
            module: { type: 'es6' },
        }),
        // tsConfigPaths(), //adicionando o plugin para ficar possivel usar os paths nos tests
    ],
    resolve: {
        alias: {
            // Ensure Vitest correctly resolves TypeScript path aliases
            'src': resolve(__dirname, './src'),
        },
    },
});