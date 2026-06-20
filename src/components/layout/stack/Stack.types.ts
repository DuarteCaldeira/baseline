export type StackSpacing =
	| 'none'
	| 'xs'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl';

export type StackSpacingValue =
	| StackSpacing
	| {
		x?: StackSpacing;
		y?: StackSpacing;
	};
