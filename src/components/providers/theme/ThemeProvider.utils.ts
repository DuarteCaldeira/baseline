import type {
	ColorTokens,
	ShadowTokens,
	Theme,
	TypographyTokens,
	ZIndexTokens,
} from './ThemeProvider.types';

const colorVarMap: Record<keyof ColorTokens, string> = {
	bg: '--color-bg',
	bgSubtle: '--color-bg-subtle',
	bgMuted: '--color-bg-muted',
	surface: '--color-surface',
	surfaceRaised: '--color-surface-raised',
	border: '--color-border',
	borderStrong: '--color-border-strong',
	text: '--color-text',
	textMuted: '--color-text-muted',
	textSubtle: '--color-text-subtle',
	textInverse: '--color-text-inverse',
	primary: '--color-primary',
	primaryHover: '--color-primary-hover',
	primaryActive: '--color-primary-active',
	primarySubtle: '--color-primary-subtle',
	success: '--color-success',
	successWeak: '--color-success-weak',
	successText: '--color-success-text',
	warning: '--color-warning',
	warningWeak: '--color-warning-weak',
	warningText: '--color-warning-text',
	error: '--color-error',
	errorWeak: '--color-error-weak',
	errorText: '--color-error-text',
	errorRing: '--color-error-ring',
	info: '--color-info',
	infoWeak: '--color-info-weak',
	infoText: '--color-info-text',
	overlay: '--color-overlay',
};

const shadowVarMap: Record<keyof ShadowTokens, string> = {
	sm: '--shadow-sm',
	base: '--shadow-base',
	md: '--shadow-md',
	lg: '--shadow-lg',
	xl: '--shadow-xl',
	inner: '--shadow-inner',
	fieldShell: '--shadow-field-shell',
	fieldFocus: '--shadow-field-focus',
	buttonPrimary: '--shadow-button-primary',
	buttonPrimaryHover: '--shadow-button-primary-hover',
	buttonPrimaryActive: '--shadow-button-primary-active',
	buttonSecondaryHover: '--shadow-button-secondary-hover',
};

const typographyVarMap: Record<keyof TypographyTokens, string> = {
	fontFamilySans: '--font-family-sans',
	fontFamilyMono: '--font-family-mono',
	fontCaption: '--font-caption',
	fontSm: '--font-sm',
	fontSmRelaxed: '--font-sm-relaxed',
	fontBase: '--font-base',
	fontLgRelaxed: '--font-lg-relaxed',
	fontLabel: '--font-label',
	fontControl: '--font-control',
	fontControlLg: '--font-control-lg',
	fontStrongSm: '--font-strong-sm',
	fontTitle: '--font-title',
	fontWeightMedium: '--font-weight-medium',
	fontWeightBold: '--font-weight-bold',
	letterSpacingTight: '--letter-spacing-tight',
	letterSpacingSnug: '--letter-spacing-snug',
	letterSpacingNormal: '--letter-spacing-normal',
	letterSpacingWide: '--letter-spacing-wide',
	letterSpacingWider: '--letter-spacing-wider',
	letterSpacingWidest: '--letter-spacing-widest',
};

const zIndexVarMap: Record<keyof ZIndexTokens, string> = {
	overlay: '--z-index-overlay',
	floating: '--z-index-floating',
	toast: '--z-index-toast',
};

const applyGroup = <T extends object>(
	group: T | undefined,
	varMap: Record<keyof T, string>,
	out: Record<string, string>
) => {
	if (!group) return;
	for (const key in group) {
		const value = group[key as keyof T];
		if (value !== undefined) {
			out[varMap[key as keyof T]] = String(value);
		}
	}
};

/**
 * Converts a `Theme` object into a flat `Record<string, string>` of CSS
 * custom property overrides ready to be applied as inline styles or set on
 * an element via `style.setProperty`.
 */
export const themeToCSSVars = (theme: Theme): Record<string, string> => {
	const vars: Record<string, string> = {};
	applyGroup(theme.colors, colorVarMap, vars);
	applyGroup(theme.shadows, shadowVarMap, vars);
	applyGroup(theme.typography, typographyVarMap, vars);
	applyGroup(theme.zIndex, zIndexVarMap, vars);
	return vars;
};

/**
 * Type-safe factory for creating a `Theme` override object.
 *
 * Provides IDE autocomplete and type checking without requiring you to import
 * the `Theme` type separately.
 *
 * ### Referencing existing CSS / SCSS tokens
 *
 * If the consuming project already defines its tokens as CSS custom properties
 * (or compiles SCSS variables into custom properties), pass `var()` references
 * as values.  The browser resolves the chain at paint time, so the consumer's
 * tokens remain the single source of truth — no value duplication needed.
 *
 * ```ts
 * // consumer already has --brand-primary, --brand-font-sans, etc. in CSS/SCSS
 * const brandTheme = createTheme({
 *   colors: {
 *     primary:       'var(--brand-primary)',
 *     primaryHover:  'var(--brand-primary-hover)',
 *     primarySubtle: 'var(--brand-primary-50)',
 *   },
 *   typography: {
 *     fontFamilySans: 'var(--brand-font-sans)',
 *   },
 * });
 * ```
 *
 * ### Pure CSS alternative (no provider needed)
 *
 * For a fully global remap with no React wrapper, override the design system's
 * custom properties directly in the consumer's stylesheet:
 *
 * ```css
 * :root {
 *   --color-primary:       var(--brand-primary);
 *   --color-primary-hover: var(--brand-primary-hover);
 *   --font-family-sans:    var(--brand-font-sans);
 * }
 * ```
 *
 * Both approaches compose: use the CSS override for the global brand remap, then
 * layer a `ThemeProvider` on top for per-section scoping or `mode` switching.
 *
 * @example Literal values
 * ```ts
 * const brandTheme = createTheme({
 *   colors: { primary: '#e11d48', primaryHover: '#be123c' },
 * });
 * ```
 */
export const createTheme = (theme: Theme): Theme => theme;

/**
 * Deep-merges two `Theme` objects.  All groups and keys from `overrides`
 * take precedence over `base`; unspecified keys fall through unchanged.
 *
 * Use this to build theme variants from a shared base without losing
 * customisations made in the base.
 *
 * @example
 * ```ts
 * const brandTheme = createTheme({ colors: { primary: '#e11d48' } });
 * const darkBrandTheme = extendTheme(brandTheme, {
 *   colors: { primary: '#f87171', bg: '#0f0f0f' },
 * });
 * ```
 */
export const extendTheme = (base: Theme, overrides: Theme): Theme => ({
	colors: { ...base.colors, ...overrides.colors },
	shadows: { ...base.shadows, ...overrides.shadows },
	typography: { ...base.typography, ...overrides.typography },
	zIndex: { ...base.zIndex, ...overrides.zIndex },
});
