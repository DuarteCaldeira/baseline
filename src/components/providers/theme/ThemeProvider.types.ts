/**
 * Structured token groups for the design system theme.
 *
 * Every key maps 1-to-1 to a CSS custom property.  Names use camelCase so
 * they are ergonomic in TypeScript; `themeToCSSVars` converts them back to
 * their `--kebab-case` counterparts at runtime.
 */

export type ColorTokens = {
	/** Page background (`--color-bg`) */
	bg?: string;
	/** Slightly tinted page background (`--color-bg-subtle`) */
	bgSubtle?: string;
	/** Muted panel background (`--color-bg-muted`) */
	bgMuted?: string;
	/** Card / panel surface (`--color-surface`) */
	surface?: string;
	/** Elevated card surface (`--color-surface-raised`) */
	surfaceRaised?: string;
	/** Default border (`--color-border`) */
	border?: string;
	/** Emphasised border (`--color-border-strong`) */
	borderStrong?: string;
	/** Body text (`--color-text`) */
	text?: string;
	/** Secondary / placeholder text (`--color-text-muted`) */
	textMuted?: string;
	/** Tertiary / disabled text (`--color-text-subtle`) */
	textSubtle?: string;
	/** Text on filled/primary backgrounds (`--color-text-inverse`) */
	textInverse?: string;
	/** Brand primary (`--color-primary`) */
	primary?: string;
	/** Brand primary hover state (`--color-primary-hover`) */
	primaryHover?: string;
	/** Brand primary active/pressed state (`--color-primary-active`) */
	primaryActive?: string;
	/** Brand primary subtle tint background (`--color-primary-subtle`) */
	primarySubtle?: string;
	/** Success accent (`--color-success`) */
	success?: string;
	/** Success tint background (`--color-success-weak`) */
	successWeak?: string;
	/** Success text on weak background (`--color-success-text`) */
	successText?: string;
	/** Warning accent (`--color-warning`) */
	warning?: string;
	/** Warning tint background (`--color-warning-weak`) */
	warningWeak?: string;
	/** Warning text on weak background (`--color-warning-text`) */
	warningText?: string;
	/** Error / destructive accent (`--color-error`) */
	error?: string;
	/** Error tint background (`--color-error-weak`) */
	errorWeak?: string;
	/** Error text on weak background (`--color-error-text`) */
	errorText?: string;
	/** Error focus ring (`--color-error-ring`) */
	errorRing?: string;
	/** Informational accent (`--color-info`) */
	info?: string;
	/** Info tint background (`--color-info-weak`) */
	infoWeak?: string;
	/** Info text on weak background (`--color-info-text`) */
	infoText?: string;
	/** Modal / overlay scrim (`--color-overlay`) */
	overlay?: string;
};

export type ShadowTokens = {
	/** Tiny lift (`--shadow-sm`) */
	sm?: string;
	/** Default card shadow (`--shadow-base`) */
	base?: string;
	/** Medium elevation (`--shadow-md`) */
	md?: string;
	/** Large elevation (`--shadow-lg`) */
	lg?: string;
	/** Extra-large elevation (`--shadow-xl`) */
	xl?: string;
	/** Inset shadow (`--shadow-inner`) */
	inner?: string;
	/** Form field shell (`--shadow-field-shell`) */
	fieldShell?: string;
	/** Form field focus ring (`--shadow-field-focus`) */
	fieldFocus?: string;
	/** Primary button resting shadow (`--shadow-button-primary`) */
	buttonPrimary?: string;
	/** Primary button hover shadow (`--shadow-button-primary-hover`) */
	buttonPrimaryHover?: string;
	/** Primary button active shadow (`--shadow-button-primary-active`) */
	buttonPrimaryActive?: string;
	/** Secondary button hover shadow (`--shadow-button-secondary-hover`) */
	buttonSecondaryHover?: string;
};

export type TypographyTokens = {
	/** Sans-serif font stack (`--font-family-sans`) */
	fontFamilySans?: string;
	/** Monospace font stack (`--font-family-mono`) */
	fontFamilyMono?: string;
	/** Caption / helper text preset (`--font-caption`) */
	fontCaption?: string;
	/** Small text preset (`--font-sm`) */
	fontSm?: string;
	/** Small relaxed-leading text preset (`--font-sm-relaxed`) */
	fontSmRelaxed?: string;
	/** Base body text preset (`--font-base`) */
	fontBase?: string;
	/** Large relaxed-leading text preset (`--font-lg-relaxed`) */
	fontLgRelaxed?: string;
	/** Form label preset (`--font-label`) */
	fontLabel?: string;
	/** Control / button label preset (`--font-control`) */
	fontControl?: string;
	/** Large control label preset (`--font-control-lg`) */
	fontControlLg?: string;
	/** Small semibold text preset (`--font-strong-sm`) */
	fontStrongSm?: string;
	/** Dialog / panel title preset (`--font-title`) */
	fontTitle?: string;
	/** Medium font-weight value (`--font-weight-medium`) */
	fontWeightMedium?: string;
	/** Bold font-weight value (`--font-weight-bold`) */
	fontWeightBold?: string;
	/** Tight letter-spacing (`--letter-spacing-tight`) */
	letterSpacingTight?: string;
	/** Snug letter-spacing (`--letter-spacing-snug`) */
	letterSpacingSnug?: string;
	/** Normal letter-spacing (`--letter-spacing-normal`) */
	letterSpacingNormal?: string;
	/** Wide letter-spacing (`--letter-spacing-wide`) */
	letterSpacingWide?: string;
	/** Wider letter-spacing (`--letter-spacing-wider`) */
	letterSpacingWider?: string;
	/** Widest letter-spacing (`--letter-spacing-widest`) */
	letterSpacingWidest?: string;
};

export type ZIndexTokens = {
	/** Overlay / backdrop z-index (`--z-index-overlay`) */
	overlay?: string | number;
	/** Floating panels (dropdowns, tooltips) z-index (`--z-index-floating`) */
	floating?: string | number;
	/** Toast notifications z-index (`--z-index-toast`) */
	toast?: string | number;
};

/**
 * A structured, nested theme definition.  All groups and every key within
 * them are optional — supply only what you want to customise.
 *
 * @example
 * ```ts
 * const brandTheme = createTheme({
 *   colors: { primary: '#e11d48', primaryHover: '#be123c' },
 * });
 * ```
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
	/** The mode passed to the nearest `ThemeProvider`. */
	mode: ThemeMode;
	/** The actual applied mode after resolving `'system'` via `prefers-color-scheme`. */
	resolvedMode: ResolvedMode;
	/** The token overrides currently active in this provider scope. */
	theme: Theme;
};
