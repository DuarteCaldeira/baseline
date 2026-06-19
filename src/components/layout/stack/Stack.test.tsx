import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Stack } from './Stack';

describe('Stack', () => {
	it('renders as a div by default', () => {
		render(<Stack>Content</Stack>);
		expect(screen.getByText('Content').tagName).toBe('DIV');
	});

	it('renders as the element specified by as', () => {
		render(<Stack as="nav">Navigation</Stack>);
		expect(screen.getByText('Navigation').tagName).toBe('NAV');
	});

	it('forwards ref to the rendered element', () => {
		const ref = { current: null as HTMLElement | null };
		render(<Stack ref={ref}>Content</Stack>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('applies gap and direction styles', () => {
		const { container } = render(
			<Stack direction="row" gap="sm">
				Content
			</Stack>
		);
		expect(container.firstChild).toHaveClass('stack--gap-sm');
	});

	it('merges custom className', () => {
		const { container } = render(<Stack className="custom">Content</Stack>);
		expect(container.querySelector('.custom')).toBeInTheDocument();
	});

	it('applies padding and margin classes', () => {
		const { container } = render(
			<Stack padding="lg" margin="xl">
				Content
			</Stack>
		);
		const stack = container.firstChild;

		expect(stack).toHaveClass('stack--padding-lg');
		expect(stack).toHaveClass('stack--margin-xl');
	});

	it('applies axis padding and margin classes', () => {
		const { container } = render(
			<Stack padding={{ x: 'sm', y: 'lg' }} margin={{ y: 'xl' }}>
				Content
			</Stack>
		);
		const stack = container.firstChild;

		expect(stack).toHaveClass('stack--padding-x-sm');
		expect(stack).toHaveClass('stack--padding-y-lg');
		expect(stack).toHaveClass('stack--margin-y-xl');
	});
});
