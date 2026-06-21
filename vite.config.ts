import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ['src/index.ts', 'src/**/*.ts', 'src/**/*.tsx'],
			exclude: [
				'**/*.test.tsx',
				'**/*.test.ts',
				'**/*.stories.tsx',
				'src/app/**',
				'src/storybook/**',
				'src/test-utils/**',
				'src/**/__mocks__/**',
			],
			bundleTypes: true,
			insertTypesEntry: true,
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'DesignSystem',
			formats: ['es', 'cjs'],
			fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.js'),
		},
		rollupOptions: {
			external: [
				'react',
				'react-dom',
				'react/jsx-runtime',
				'next',
				'next/link',
				'lucide-react',
			],

			onwarn(warning, warn) {
				if (warning.code === 'UNRESOLVED_IMPORT') return;
				warn(warning);
			},
		},
	},
});
