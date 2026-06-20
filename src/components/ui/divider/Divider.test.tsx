import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Divider } from './Divider';

describe('Divider', () => {
	it('renders a horizontal rule by default', () => {
		render(<Divider />);
		const divider = screen.getByRole('separator', { hidden: true });
		expect(divider.tagName).toBe('HR');
	});

	it('renders a vertical separator', () => {
		render(<Divider orientation="vertical" />);
		const divider = screen.getByRole('separator');
		expect(divider.tagName).toBe('DIV');
		expect(divider).toHaveAttribute('aria-orientation', 'vertical');
	});

	it.each(['horizontal', 'vertical'] as const)(
		'applies the %s orientation class',
		(orientation) => {
			const { container } = render(<Divider orientation={orientation} />);
			expect(
				container.querySelector(`.divider--${orientation}`)
			).toBeInTheDocument();
		}
	);

	it('applies the strong variant class', () => {
		const { container } = render(<Divider variant="strong" />);
		expect(container.querySelector('.divider--strong')).toBeInTheDocument();
	});

	it('applies the contained width class', () => {
		const { container } = render(<Divider width="contained" />);
		expect(container.querySelector('.divider--contained')).toBeInTheDocument();
	});

	it('merges a custom className', () => {
		const { container } = render(<Divider className="custom" />);
		expect(container.querySelector('.custom')).toBeInTheDocument();
	});
});
