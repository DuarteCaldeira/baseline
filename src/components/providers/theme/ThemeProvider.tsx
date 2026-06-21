'use client';

import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useSyncExternalStore,
} from 'react';
import type { CSSProperties, ReactNode } from 'react';

import type {
	ResolvedMode,
	Theme,
	ThemeContextValue,
	ThemeMode,
} from './ThemeProvider.types';
import { themeToCSSVars } from './ThemeProvider.utils';

export const ThemeContext = createContext<ThemeContextValue>({
	mode: 'light',
	resolvedMode: 'light',
	theme: {},
});

const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)';

const getPrefersDarkSnapshot = (): boolean => {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia(PREFERS_DARK_QUERY).matches;
};

const subscribeToPrefersDark = (onStoreChange: () => void) => {
	if (typeof window === 'undefined' || !window.matchMedia) return () => {};

	const media = window.matchMedia(PREFERS_DARK_QUERY);
	media.addEventListener('change', onStoreChange);
	return () => media.removeEventListener('change', onStoreChange);
};

type ThemeProviderProps = {
	/**
	 * Colour scheme to apply to the subtree.
	 * - `'light'` / `'dark'` — explicit override
	 * - `'system'` — follows the OS `prefers-color-scheme` preference
	 * @default 'light'
	 */
	mode?: ThemeMode;
	/**
	 * Token overrides.  Build this with `createTheme` or `extendTheme` for
	 * full IDE autocomplete.  Only the keys you provide are overridden; all
	 * other tokens fall back to the active theme defaults via CSS cascade.
	 *
	 * @example
	 * ```tsx
	 * import { createTheme } from '@dlcaldeira/design-system';
	 * const brand = createTheme({ colors: { primary: '#e11d48' } });
	 * <ThemeProvider theme={brand}>…</ThemeProvider>
	 * ```
	 */
	theme?: Theme;
	/**
	 * When `true`, applies the mode attribute and token overrides directly to
	 * `document.documentElement` instead of injecting a wrapper `<div>`.
	 * Use this at the application root when you don't want an extra DOM node.
	 * @default false
	 */
	applyToRoot?: boolean;
	children: ReactNode;
};

/**
 * Applies a colour-scheme mode and optional token overrides to its subtree.
 *
 * Wrap your entire application (or a scoped section) to control the active
 * theme and customise design tokens without touching SCSS.
 *
 * @example Dark mode
 * ```tsx
 * <ThemeProvider mode="dark"><App /></ThemeProvider>
 * ```
 *
 * @example Custom brand colours
 * ```tsx
 * const brand = createTheme({ colors: { primary: '#e11d48', primaryHover: '#be123c' } });
 * <ThemeProvider theme={brand}><App /></ThemeProvider>
 * ```
 *
 * @example Apply to document root (no wrapper div)
 * ```tsx
 * <ThemeProvider mode="system" theme={brand} applyToRoot>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider = ({
	mode = 'light',
	theme = {},
	applyToRoot = false,
	children,
}: ThemeProviderProps) => {
	const prefersDark = useSyncExternalStore(
		subscribeToPrefersDark,
		getPrefersDarkSnapshot,
		() => false
	);

	const resolvedMode: ResolvedMode = (() => {
		if (mode === 'system') {
			if (prefersDark) return 'dark';
			return 'light';
		}
		return mode;
	})();

	const cssVars = useMemo(() => themeToCSSVars(theme), [theme]);

	const contextValue = useMemo<ThemeContextValue>(
		() => ({ mode, resolvedMode, theme }),
		[mode, resolvedMode, theme]
	);

	useEffect(() => {
		if (!applyToRoot) return;

		const root = document.documentElement;
		const prevMode = root.getAttribute('data-theme');

		root.setAttribute('data-theme', resolvedMode);
		for (const [prop, value] of Object.entries(cssVars)) {
			root.style.setProperty(prop, value);
		}

		return () => {
			if (prevMode) {
				root.setAttribute('data-theme', prevMode);
			} else {
				root.removeAttribute('data-theme');
			}
			for (const prop of Object.keys(cssVars)) {
				root.style.removeProperty(prop);
			}
		};
	}, [applyToRoot, resolvedMode, cssVars]);

	if (applyToRoot) {
		return (
			<ThemeContext.Provider value={contextValue}>
				{children}
			</ThemeContext.Provider>
		);
	}

	return (
		<ThemeContext.Provider value={contextValue}>
			<div data-theme={resolvedMode} style={cssVars as CSSProperties}>
				{children}
			</div>
		</ThemeContext.Provider>
	);
};

/**
 * Returns the theme state from the nearest `ThemeProvider` ancestor.
 *
 * | Field | Description |
 * |---|---|
 * | `mode` | The raw mode prop (`'light'`, `'dark'`, `'system'`) |
 * | `resolvedMode` | The actual applied mode (`'light'` or `'dark'`) |
 * | `theme` | The active token overrides object |
 *
 * Falls back to `{ mode: 'light', resolvedMode: 'light', theme: {} }` when
 * rendered outside a `ThemeProvider`.
 */
export const useTheme = (): ThemeContextValue => useContext(ThemeContext);
