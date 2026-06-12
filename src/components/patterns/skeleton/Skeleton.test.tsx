import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

describe('Skeleton', () => {
	it('renders a placeholder element', () => {
		const { container } = render(<Skeleton data-testid="skeleton" />);
		expect(container.querySelector('[data-testid="skeleton"]')).toBeInTheDocument();
	});

	it('is hidden from assistive technology by default', () => {
		const { container } = render(<Skeleton />);
		expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
	});

	it('applies the text variant class by default', () => {
		const { container } = render(<Skeleton />);
		expect(container.querySelector('.skeleton--text')).toBeInTheDocument();
	});

	it.each([
		'text',
		'heading',
		'circular',
		'rectangular',
		'button',
	] as const)('applies the %s variant class', (variant) => {
		const { container } = render(<Skeleton variant={variant} />);
		expect(
			container.querySelector(`.skeleton--${variant}`)
		).toBeInTheDocument();
	});

	it.each(['sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
		const { container } = render(<Skeleton size={size} variant="circular" />);
		expect(container.querySelector(`.skeleton--${size}`)).toBeInTheDocument();
	});

	it.each([
		['full', 'skeleton--width-full'],
		['3/4', 'skeleton--width-3/4'],
		['2/3', 'skeleton--width-2/3'],
		['1/2', 'skeleton--width-1/2'],
		['1/3', 'skeleton--width-1/3'],
		['1/4', 'skeleton--width-1/4'],
		['auto', 'skeleton--width-auto'],
	] as const)('applies the %s width class', (width, classKey) => {
		const { container } = render(<Skeleton width={width} />);
		expect(container.firstChild).toHaveClass(
			styles[classKey as keyof typeof styles]
		);
	});

	it('renders multiple lines for paragraph variant', () => {
		const { container } = render(
			<Skeleton variant="paragraph" lines={4} />
		);
		expect(container.querySelectorAll('.skeleton')).toHaveLength(4);
	});

	it('shortens the last paragraph line by default', () => {
		const { container } = render(
			<Skeleton variant="paragraph" lines={3} />
		);
		const lines = container.querySelectorAll(`.${styles.skeleton}`);
		expect(lines[2]).toHaveClass(styles['skeleton--width-2/3']);
	});

	it('disables animation when animate is false', () => {
		const { container } = render(<Skeleton animate={false} />);
		expect(container.querySelector('.skeleton--static')).toBeInTheDocument();
	});

	it('renders as a span when as="span"', () => {
		const { container } = render(<Skeleton as="span" />);
		expect(container.querySelector('span.skeleton')).toBeInTheDocument();
		expect(container.querySelector('.skeleton--inline')).toBeInTheDocument();
	});

	it('forwards HTML attributes', () => {
		render(<Skeleton data-testid="custom-skeleton" />);
		expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
	});
});
