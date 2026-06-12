import type { HTMLAttributes, ReactNode } from 'react';

import { VISUALLY_HIDDEN_CLASS } from '@/styles/utilities/visuallyHidden';

export type VisuallyHiddenProps = Omit<HTMLAttributes<HTMLElement>, 'className'> & {
	children: ReactNode;
	as?: 'span' | 'div';
};

export const VisuallyHidden = ({
	as: Component = 'span',
	children,
	...rest
}: VisuallyHiddenProps) => (
	<Component
		className={VISUALLY_HIDDEN_CLASS}
		{...rest}
	>
		{children}
	</Component>
);

export { VISUALLY_HIDDEN_CLASS };
