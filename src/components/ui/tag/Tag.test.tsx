import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hash } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Tag } from './Tag';

describe('Tag', () => {
	it('renders children', () => {
		render(<Tag>Design</Tag>);
		expect(screen.getByText('Design')).toBeInTheDocument();
	});

	it('renders as an inline span', () => {
		render(<Tag>Design</Tag>);
		expect(screen.getByText('Design').closest('.tag')?.tagName).toBe('SPAN');
	});

	it.each(['default', 'primary'] as const)(
		'applies the %s variant class',
		(variant) => {
			const { container } = render(<Tag variant={variant}>Label</Tag>);
			expect(container.querySelector(`.tag--${variant}`)).toBeInTheDocument();
		}
	);

	it.each(['sm', 'md'] as const)('applies the %s size class', (size) => {
		const { container } = render(<Tag size={size}>Label</Tag>);
		expect(container.querySelector(`.tag--${size}`)).toBeInTheDocument();
	});

	it('defaults to the default variant and md size', () => {
		const { container } = render(<Tag>Label</Tag>);
		expect(container.querySelector('.tag--default')).toBeInTheDocument();
		expect(container.querySelector('.tag--md')).toBeInTheDocument();
	});

	it('renders an icon when provided', () => {
		const { container } = render(<Tag icon={Hash}>Label</Tag>);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('does not render an icon when omitted', () => {
		const { container } = render(<Tag>Label</Tag>);
		expect(container.querySelector('svg')).not.toBeInTheDocument();
	});

	it('renders a remove button when onRemove is provided', () => {
		render(<Tag onRemove={() => {}}>Removable</Tag>);
		expect(
			screen.getByRole('button', { name: 'Remove tag' })
		).toBeInTheDocument();
	});

	it('uses a custom remove label', () => {
		render(
			<Tag onRemove={() => {}} removeLabel="Remove Design">
				Design
			</Tag>
		);
		expect(
			screen.getByRole('button', { name: 'Remove Design' })
		).toBeInTheDocument();
	});

	it('calls onRemove when the remove button is clicked', async () => {
		const user = userEvent.setup();
		const onRemove = vi.fn();

		render(<Tag onRemove={onRemove}>Removable</Tag>);
		await user.click(screen.getByRole('button', { name: 'Remove tag' }));

		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	it('does not render a remove button when onRemove is omitted', () => {
		render(<Tag>Static</Tag>);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it.each(['sm', 'md'] as const)(
		'applies the removable modifier for %s removable tags',
		(size) => {
			const { container } = render(
				<Tag size={size} onRemove={() => {}}>
					Label
				</Tag>
			);
			expect(container.querySelector('.tag--removable')).toBeInTheDocument();
		}
	);

	it('does not apply the removable modifier when onRemove is omitted', () => {
		const { container } = render(<Tag size="sm">Label</Tag>);
		expect(container.querySelector('.tag--removable')).not.toBeInTheDocument();
	});

	it('forwards additional HTML attributes', () => {
		render(<Tag data-testid="tag">Label</Tag>);
		expect(screen.getByTestId('tag')).toBeInTheDocument();
	});
});
