import {
	colorVarMap,
	shadowVarMap,
	typographyVarMap,
	zIndexVarMap,
} from './ThemeProvider.tokens';
import type { Theme } from './ThemeProvider.types';

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

export const themeToCSSVars = (theme: Theme): Record<string, string> => {
	const vars: Record<string, string> = {};
	applyGroup(theme.colors, colorVarMap, vars);
	applyGroup(theme.shadows, shadowVarMap, vars);
	applyGroup(theme.typography, typographyVarMap, vars);
	applyGroup(theme.zIndex, zIndexVarMap, vars);
	return vars;
};

export const createTheme = (theme: Theme): Theme => theme;

export const extendTheme = (base: Theme, overrides: Theme): Theme => ({
	colors: { ...base.colors, ...overrides.colors },
	shadows: { ...base.shadows, ...overrides.shadows },
	typography: { ...base.typography, ...overrides.typography },
	zIndex: { ...base.zIndex, ...overrides.zIndex },
});
