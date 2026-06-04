import type { ReactNode } from 'react';

export type WithChildren = {
	children: ReactNode;
};

export type WithClassName = {
	className?: string;
};

export type Size = 'sm' | 'md' | 'lg';

export type ColorVariant =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'error'
	| 'ghost';
