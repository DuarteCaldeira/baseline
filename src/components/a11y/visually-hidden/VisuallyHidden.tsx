import type { HTMLAttributes, ReactNode } from 'react';

import { VISUALLY_HIDDEN_CLASS } from '@/styles/utilities/visuallyHidden';
import { cn } from '@/utils/cn';

export type VisuallyHiddenProps = HTMLAttributes<HTMLElement> & {
	children: ReactNode;
	as?: 'span' | 'div';
};

export const VisuallyHidden = ({
	as: Component = 'span',
	className,
	children,
	...rest
}: VisuallyHiddenProps) => (
	<Component
		className={cn(VISUALLY_HIDDEN_CLASS, className)}
		{...rest}
	>
		{children}
	</Component>
);

export { VISUALLY_HIDDEN_CLASS };
