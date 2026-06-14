import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	viteFinal: (viteConfig) => {
		if (!viteConfig.resolve) viteConfig.resolve = {};
		viteConfig.resolve.alias = {
			...viteConfig.resolve.alias,
			'@': path.resolve(__dirname, '../src'),
			'next/link': path.resolve(__dirname, '../src/__mocks__/next-link.tsx'),
		};

		if (!viteConfig.css) viteConfig.css = {};
		viteConfig.css.preprocessorOptions = {
			scss: { api: 'modern-compiler' },
		};

		// Stub process.env so any package that references it at runtime
		// (e.g. Next.js internals) does not throw in the browser environment.
		viteConfig.define = {
			...viteConfig.define,
			'process.env': '{}',
		};

		return viteConfig;
	},
};

export default config;
