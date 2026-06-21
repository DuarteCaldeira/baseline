export type StackSpacing =
	| 'none'
	| 'xs'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl';

export type StackSpacingSides = {
	x?: StackSpacing;
	y?: StackSpacing;
};

export type StackSpacingValue = StackSpacing | StackSpacingSides;
