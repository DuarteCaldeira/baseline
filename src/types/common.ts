import type { ReactNode } from 'react';

/** Components that accept arbitrary children. */
export interface WithChildren {
	children: ReactNode;
}

/** Components that accept an optional extra className. */
export interface WithClassName {
	className?: string;
}

/** Shared size variants across UI components. */
export type Size = 'sm' | 'md' | 'lg';

/** Shared semantic color variants. */
export type ColorVariant =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'error'
	| 'ghost';
