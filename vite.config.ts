import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { type Plugin, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const DESIGN_SYSTEM_CSS_LAYER = 'design-system';

function wrapDesignSystemCssInLayer(): Plugin {
	return {
		name: 'wrap-design-system-css-in-layer',
		apply: 'build',
		generateBundle(_, bundle) {
			for (const chunk of Object.values(bundle)) {
				if (chunk.type !== 'asset' || !chunk.fileName.endsWith('.css')) {
					continue;
				}

				const originalCss =
					typeof chunk.source === 'string'
						? chunk.source
						: Buffer.from(chunk.source).toString('utf8');

				chunk.source = `@layer ${DESIGN_SYSTEM_CSS_LAYER} {\n${originalCss}\n}\n`;
			}
		},
	};
}

export default defineConfig({
	plugins: [
		react(),
		wrapDesignSystemCssInLayer(),
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
