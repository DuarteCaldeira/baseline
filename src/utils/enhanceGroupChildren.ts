import {
	Children,
	cloneElement,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from 'react';

import { cn } from '@/utils/cn';

export const enhanceGroupChildren = (
	children: ReactNode,
	getItemClassName: (index: number, total: number) => string | undefined
): ReactElement[] => {
	const items = Children.toArray(children).filter(isValidElement);
	const total = items.length;

	return items.map((child, index) =>
		cloneElement(child as ReactElement<{ className?: string }>, {
			className: cn(
				(child as ReactElement<{ className?: string }>).props.className,
				getItemClassName(index, total)
			),
		})
	);
};
