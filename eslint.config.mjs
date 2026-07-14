import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'dist/**',
			'storybook-static/**',
		],
	},

	js.configs.recommended,
	...tseslint.configs.recommended,

	{
		files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',

			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2022,
			},

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		rules: {
			'no-nested-ternary': 'error',
			'no-console': [
				'warn',
				{
					allow: ['warn', 'error'],
				},
			],
		},
	},

	{
		files: ['**/*.{ts,mts,cts,tsx}'],

		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
				},
			],

			'@typescript-eslint/no-explicit-any': 'warn',

			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
				},
			],
		},
	}
);
