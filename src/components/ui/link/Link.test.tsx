import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Link } from './Link';

describe('Link', () => {
	it('renders an anchor element', () => {
		render(<Link href="/about">About</Link>);
		expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
	});

	it('renders children', () => {
		render(<Link href="/">Home</Link>);
		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	it('sets the href attribute', () => {
		render(<Link href="/contact">Contact</Link>);
		expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute(
			'href',
			'/contact'
		);
	});

	it('does not set target or rel by default', () => {
		render(<Link href="/">Home</Link>);
		const link = screen.getByRole('link', { name: /home/i });

		expect(link).not.toHaveAttribute('target');
		expect(link).not.toHaveAttribute('rel');
	});

	it('sets target="_blank" when external is true', () => {
		render(
			<Link href="https://example.com" external>
				External
			</Link>
		);
		expect(screen.getByRole('link', { name: /external/i })).toHaveAttribute(
			'target',
			'_blank'
		);
	});

	it('sets rel="noopener noreferrer" when external is true', () => {
		render(
			<Link href="https://example.com" external>
				External
			</Link>
		);
		expect(screen.getByRole('link', { name: /external/i })).toHaveAttribute(
			'rel',
			'noopener noreferrer'
		);
	});

	it('applies default variant class by default', () => {
		const { container } = render(<Link href="/">Home</Link>);
		expect(container.querySelector('.link--default')).toBeInTheDocument();
	});

	it('applies subtle variant class', () => {
		const { container } = render(
			<Link href="/" variant="subtle">
				Home
			</Link>
		);
		expect(container.querySelector('.link--subtle')).toBeInTheDocument();
	});

	it('applies inherit variant class', () => {
		const { container } = render(
			<Link href="/" variant="inherit">
				Home
			</Link>
		);
		expect(container.querySelector('.link--inherit')).toBeInTheDocument();
	});

	it('forwards additional HTML attributes', () => {
		render(
			<Link href="/" data-testid="my-link">
				Home
			</Link>
		);
		expect(screen.getByTestId('my-link')).toBeInTheDocument();
	});
});
