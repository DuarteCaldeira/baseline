import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
});
