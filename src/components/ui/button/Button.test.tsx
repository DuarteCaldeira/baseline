import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Star, X } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
	it('renders button with text', () => {
		render(<Button>Click me</Button>);
		expect(
			screen.getByRole('button', { name: /click me/i })
		).toBeInTheDocument();
	});

	it('calls onClick handler when clicked', async () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		await userEvent.click(screen.getByRole('button', { name: /click me/i }));
		expect(handleClick).toHaveBeenCalledOnce();
	});

	it('applies disabled attribute when disabled prop is true', () => {
		render(<Button disabled>Disabled Button</Button>);
		expect(
			screen.getByRole('button', { name: /disabled button/i })
		).toBeDisabled();
	});

	it('does not call onClick when disabled', async () => {
		const handleClick = vi.fn();
		render(
			<Button disabled onClick={handleClick}>
				Disabled
			</Button>
		);
		await userEvent.click(screen.getByRole('button', { name: /disabled/i }));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('forwards additional HTML attributes', () => {
		render(<Button data-testid="my-btn">Submit</Button>);
		expect(screen.getByTestId('my-btn')).toBeInTheDocument();
	});

	it('does not accept className', () => {
		render(
			// @ts-expect-error className is not part of ButtonProps
			<Button className="custom">Submit</Button>
		);
		expect(screen.getByRole('button', { name: /submit/i })).not.toHaveClass(
			'custom'
		);
	});

	it('applies secondary variant class', () => {
		const { container } = render(
			<Button variant="secondary">Secondary</Button>
		);
		expect(container.querySelector('.button--secondary')).toBeInTheDocument();
	});

	it('applies ghost variant class', () => {
		const { container } = render(<Button variant="ghost">Ghost</Button>);
		expect(container.querySelector('.button--ghost')).toBeInTheDocument();
	});

	it('applies size class', () => {
		const { container } = render(<Button size="lg">Large</Button>);
		expect(container.querySelector('.button--lg')).toBeInTheDocument();
	});

	describe('with icon', () => {
		it('renders an icon alongside text', () => {
			const { container } = render(<Button icon={Star}>Favourite</Button>);
			expect(container.querySelector('svg')).toBeInTheDocument();
			expect(screen.getByText('Favourite')).toBeInTheDocument();
		});

		it('marks the icon as aria-hidden when text is present', () => {
			const { container } = render(<Button icon={Star}>Favourite</Button>);
			expect(container.querySelector('.icon')).toHaveAttribute(
				'aria-hidden',
				'true'
			);
		});

		it('does not apply icon-only class when children are present', () => {
			const { container } = render(<Button icon={Star}>Favourite</Button>);
			expect(
				container.querySelector('.button--icon-only')
			).not.toBeInTheDocument();
		});
	});

	describe('icon-only', () => {
		it('renders an accessible button with aria-label', () => {
			render(<Button icon={X} aria-label="Close" />);
			expect(
				screen.getByRole('button', { name: 'Close' })
			).toBeInTheDocument();
		});

		it('applies the icon-only modifier class', () => {
			const { container } = render(
				<Button icon={X} aria-label="Close" />
			);
			expect(
				container.querySelector('.button--icon-only')
			).toBeInTheDocument();
		});

		it('renders the svg element', () => {
			const { container } = render(
				<Button icon={X} aria-label="Close" />
			);
			expect(container.querySelector('svg')).toBeInTheDocument();
		});
	});

	describe('loading', () => {
		it('applies the loading modifier class', () => {
			const { container } = render(<Button loading>Saving</Button>);
			expect(container.querySelector('.button--loading')).toBeInTheDocument();
		});

		it('disables the button while loading', () => {
			render(<Button loading>Saving</Button>);
			expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
		});

		it('sets aria-busy while loading', () => {
			render(<Button loading>Saving</Button>);
			expect(screen.getByRole('button', { name: /saving/i })).toHaveAttribute(
				'aria-busy',
				'true'
			);
		});

		it('does not call onClick while loading', async () => {
			const handleClick = vi.fn();
			render(
				<Button loading onClick={handleClick}>
					Saving
				</Button>
			);

			await userEvent.click(screen.getByRole('button', { name: /saving/i }));
			expect(handleClick).not.toHaveBeenCalled();
		});

		it('renders a spinner instead of the icon', () => {
			const { container } = render(
				<Button loading icon={Star}>
					Saving
				</Button>
			);

			expect(container.querySelector('.spinner')).toBeInTheDocument();
			expect(container.querySelector('svg')).not.toBeInTheDocument();
		});

		it('keeps the label visible while loading', () => {
			render(<Button loading>Saving</Button>);
			expect(screen.getByText('Saving')).toBeInTheDocument();
		});

		it('renders a spinner for icon-only buttons', () => {
			const { container } = render(
				<Button loading icon={X} aria-label="Close" />
			);

			expect(container.querySelector('.spinner')).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: 'Close' })
			).toBeInTheDocument();
		});
	});
});
