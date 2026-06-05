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
			<Stack direction="row" gap="2">
				Content
			</Stack>
		);
		expect(container.firstChild).toHaveClass('stack--gap-2');
	});

	it('merges custom className', () => {
		const { container } = render(<Stack className="custom">Content</Stack>);
		expect(container.querySelector('.custom')).toBeInTheDocument();
	});
});
