import type { StackSpacingValue } from './Stack.types';

export const resolveSpacingClasses = (
	prefix: 'padding' | 'margin',
	value: StackSpacingValue | undefined,
	styles: Record<string, string>
): string[] => {
	if (!value) return [];

	if (typeof value === 'string') {
		const className = styles[`stack--${prefix}-${value}`];
		return className ? [className] : [];
	}

	const classes: string[] = [];

	if (value.x) {
		const className = styles[`stack--${prefix}-x-${value.x}`];
		if (className) classes.push(className);
	}

	if (value.y) {
		const className = styles[`stack--${prefix}-y-${value.y}`];
		if (className) classes.push(className);
	}

	return classes;
};
