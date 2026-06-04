import { render, screen } from '@testing-library/react';
import { Circle } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Icon } from './Icon';

describe('Icon', () => {
	it('renders an svg element', () => {
		const { container } = render(<Icon icon={Circle} />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('is hidden from assistive technology when no label is provided', () => {
		const { container } = render(<Icon icon={Circle} />);
		expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
	});

	it('is announced by screen readers when label is provided', () => {
		render(<Icon icon={Circle} label="Status indicator" />);
		expect(
			screen.getByRole('img', { name: 'Status indicator' })
		).toBeInTheDocument();
	});

	it('does not set aria-hidden when label is provided', () => {
		render(<Icon icon={Circle} label="Status indicator" />);
		expect(
			screen.getByRole('img', { name: 'Status indicator' })
		).not.toHaveAttribute('aria-hidden');
	});

	it('applies default variant class by default', () => {
		const { container } = render(<Icon icon={Circle} />);
		expect(container.querySelector('.icon--default')).toBeInTheDocument();
	});

	it.each([
		'default', 'muted', 'subtle',
		'primary', 'success', 'warning', 'error', 'info',
	] as const)('applies %s variant class', (variant) => {
		const { container } = render(<Icon icon={Circle} variant={variant} />);
		expect(
			container.querySelector(`.icon--${variant}`)
		).toBeInTheDocument();
	});

	it('renders at sm size (16px)', () => {
		const { container } = render(<Icon icon={Circle} size="sm" />);
		expect(container.querySelector('svg')).toHaveAttribute('width', '16');
	});

	it('renders at md size (20px) by default', () => {
		const { container } = render(<Icon icon={Circle} />);
		expect(container.querySelector('svg')).toHaveAttribute('width', '20');
	});

	it('renders at lg size (24px)', () => {
		const { container } = render(<Icon icon={Circle} size="lg" />);
		expect(container.querySelector('svg')).toHaveAttribute('width', '24');
	});

	it('forwards strokeWidth to the svg element', () => {
		const { container } = render(<Icon icon={Circle} strokeWidth={1} />);
		expect(container.querySelector('svg')).toHaveAttribute(
			'stroke-width',
			'1'
		);
	});

	it('merges custom className onto the wrapper', () => {
		const { container } = render(
			<Icon icon={Circle} className="custom-class" />
		);
		expect(container.querySelector('.custom-class')).toBeInTheDocument();
	});
});
