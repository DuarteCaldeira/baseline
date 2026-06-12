import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {
	it('renders a spinner element', () => {
		const { container } = render(<Spinner />);
		expect(container.querySelector('.spinner')).toBeInTheDocument();
	});

	it('is hidden from assistive technology when no label is provided', () => {
		const { container } = render(<Spinner />);
		expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
	});

	it('is announced by screen readers when label is provided', () => {
		render(<Spinner label="Loading" />);
		expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
	});

	it('applies size and variant classes', () => {
		const { container } = render(<Spinner size="lg" variant="primary" />);
		expect(container.querySelector('.spinner--lg')).toBeInTheDocument();
		expect(container.querySelector('.spinner--primary')).toBeInTheDocument();
	});
});
