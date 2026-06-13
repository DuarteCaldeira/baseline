import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'design-system',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['react', 'react-dom'],

			onwarn(warning, warn) {
				// ajuda a evitar falsos positivos
				if (warning.code === 'UNRESOLVED_IMPORT') return;
				warn(warning);
			},
		},
	},
});
