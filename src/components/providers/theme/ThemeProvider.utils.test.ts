import { describe, expect, it } from 'vitest';

import { extendTheme, themeToCSSVars } from './ThemeProvider.utils';

describe('themeToCSSVars', () => {
	it('maps each token group from the shared token maps', () => {
		expect(
			themeToCSSVars({
				colors: { primary: '#111111' },
				shadows: { lg: '0 0 1rem #000' },
				typography: { fontTitle: '700 1rem/1.2 serif' },
				zIndex: { toast: 9999 },
			})
		).toEqual({
			'--color-primary': '#111111',
			'--shadow-lg': '0 0 1rem #000',
			'--font-title': '700 1rem/1.2 serif',
			'--z-index-toast': '9999',
		});
	});
});

describe('extendTheme', () => {
	it('merges token groups without dropping unspecified values', () => {
		expect(
			extendTheme(
				{
					colors: { primary: '#111111' },
					typography: { fontBase: '400 1rem/1.5 sans-serif' },
				},
				{
					colors: { primaryHover: '#222222' },
				}
			)
		).toEqual({
			colors: { primary: '#111111', primaryHover: '#222222' },
			shadows: {},
			typography: { fontBase: '400 1rem/1.5 sans-serif' },
			zIndex: {},
		});
	});
});
