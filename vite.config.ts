import react from '@vitejs/plugin-react';
import { promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import type { OutputAsset, OutputBundle, OutputOptions } from 'rollup';
import { type Plugin, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const DESIGN_SYSTEM_CSS_LAYER = 'design-system';

const wrapDesignSystemCssInLayer = (): Plugin => ({
	name: 'wrap-design-system-css-in-layer',
	async writeBundle(options: OutputOptions, bundle: OutputBundle) {
		const outputDir =
			options.dir ?? dirname(options.file ?? resolve(__dirname, 'dist'));

		for (const asset of Object.values(bundle)) {
			if (asset.type !== 'asset' || !asset.fileName.endsWith('.css')) continue;

			const cssAsset = asset as OutputAsset;

			const cssPath = resolve(outputDir, cssAsset.fileName);
			const cssSource = await fs.readFile(cssPath, 'utf8');

			if (cssSource.startsWith(`@layer ${DESIGN_SYSTEM_CSS_LAYER}`)) continue;

			await fs.writeFile(
				cssPath,
				`@layer ${DESIGN_SYSTEM_CSS_LAYER} {\n${cssSource}\n}\n`
			);
		}
	},
});

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
		wrapDesignSystemCssInLayer(),
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
