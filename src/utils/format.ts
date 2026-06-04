/**
 * Truncates a string to a given length, appending an ellipsis if truncated.
 */
export function truncate(str: string, maxLength: number): string {
	if (str.length <= maxLength) return str;
	return `${str.slice(0, maxLength)}…`;
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a camelCase or PascalCase string to kebab-case.
 */
export function toKebabCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase();
}

/**
 * Formats a number as a compact string (e.g. 1200 → "1.2K").
 */
export function formatCompact(n: number): string {
	return new Intl.NumberFormat('en', { notation: 'compact' }).format(n);
}
