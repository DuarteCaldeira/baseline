export const truncate = (str: string, maxLength: number): string => {
	if (str.length <= maxLength) return str;
	return `${str.slice(0, maxLength)}…`;
};

export const capitalize = (str: string): string => {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toKebabCase = (str: string): string =>
	str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase();

export const formatCompact = (n: number): string =>
	new Intl.NumberFormat('en', { notation: 'compact' }).format(n);
