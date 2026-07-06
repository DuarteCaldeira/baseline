import type {
	colorVarMap,
	shadowVarMap,
	typographyVarMap,
	zIndexVarMap,
} from './ThemeProvider.tokens';

type TokenGroup<TMap extends Record<string, string>, TValue = string> = Partial<
	Record<keyof TMap, TValue>
>;

/**
 * Structured token groups for the design system theme.
 *
 * Every key maps 1-to-1 to a CSS custom property. The shared token maps are
 * the source of truth for those keys, while these types keep authoring
 * ergonomic in TypeScript.
 */
export type ColorTokens = TokenGroup<typeof colorVarMap>;

export type ShadowTokens = TokenGroup<typeof shadowVarMap>;

export type TypographyTokens = TokenGroup<typeof typographyVarMap>;

export type ZIndexTokens = TokenGroup<typeof zIndexVarMap, string | number>;

/**
 * A structured, nested theme definition. All groups and every key within
 * them are optional - supply only what you want to customise.
 */
export type Theme = {
	colors?: ColorTokens;
	shadows?: ShadowTokens;
	typography?: TypographyTokens;
	zIndex?: ZIndexTokens;
};

export type ThemeMode = 'light' | 'dark' | 'system';

export type ResolvedMode = 'light' | 'dark';

export type ThemeContextValue = {
	mode: ThemeMode;
	resolvedMode: ResolvedMode;
	theme: Theme;
};
