import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

/**
 * Lightweight next/link stand-in used by Vitest (jsdom) and Storybook
 * (@storybook/react-vite). Renders a plain <a> so components that wrap
 * next/link can be tested and documented without a Next.js router context.
 */
const NextLink = forwardRef<
	HTMLAnchorElement,
	ComponentPropsWithoutRef<'a'> & { href?: string }
>(({ href, children, ...rest }, ref) => (
	<a ref={ref} href={href} {...rest}>
		{children}
	</a>
));

NextLink.displayName = 'NextLink';

export default NextLink;
