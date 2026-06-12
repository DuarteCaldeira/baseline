import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Alert } from './Alert';

describe('Alert', () => {
	it('renders children', () => {
		render(
			<Alert variant="info">
				Your changes have been saved.
			</Alert>
		);
		expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
	});

	it('renders an optional title', () => {
		render(
			<Alert variant="success" title="Payment complete">
				Funds will arrive within 2 business days.
			</Alert>
		);
		expect(screen.getByText('Payment complete')).toBeInTheDocument();
		expect(
			screen.getByText('Funds will arrive within 2 business days.')
		).toBeInTheDocument();
	});

	it.each(['success', 'error', 'warning', 'info'] as const)(
		'applies the %s variant class',
		(variant) => {
			const { container } = render(
				<Alert variant={variant}>Message</Alert>
			);
			expect(
				container.querySelector(`.alert--${variant}`)
			).toBeInTheDocument();
		}
	);

	it.each([
		['error', 'alert'],
		['warning', 'alert'],
		['success', 'status'],
		['info', 'status'],
	] as const)('uses role="%s" for %s variant', (variant, role) => {
		render(<Alert variant={variant}>Message</Alert>);
		expect(screen.getByRole(role)).toBeInTheDocument();
	});

	it('renders a default variant icon in a medallion wrapper', () => {
		const { container } = render(<Alert variant="warning">Message</Alert>);
		expect(container.querySelector('.alert__icon-wrap')).toBeInTheDocument();
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('calls onDismiss when the dismiss button is clicked', async () => {
		const onDismiss = vi.fn();
		render(
			<Alert variant="info" onDismiss={onDismiss}>
				Message
			</Alert>
		);

		await userEvent.click(screen.getByRole('button', { name: /dismiss alert/i }));
		expect(onDismiss).toHaveBeenCalledOnce();
	});

	it('does not render a dismiss button when onDismiss is omitted', () => {
		render(<Alert variant="info">Message</Alert>);
		expect(
			screen.queryByRole('button', { name: /dismiss alert/i })
		).not.toBeInTheDocument();
	});

	it('centers a title-only alert with the icon', () => {
		const { container } = render(
			<Alert variant="success" title="Payment complete" />
		);
		expect(container.querySelector('.alert--compact')).toBeInTheDocument();
		expect(container.querySelector('.alert__message')).not.toBeInTheDocument();
	});

	it('top-aligns when both title and description are present', () => {
		const { container } = render(
			<Alert variant="success" title="Payment complete">
				Funds will arrive within 2 business days.
			</Alert>
		);
		expect(container.querySelector('.alert--compact')).not.toBeInTheDocument();
	});

	it('uses a custom dismiss label', () => {
		render(
			<Alert variant="error" onDismiss={vi.fn()} dismissLabel="Close error">
				Message
			</Alert>
		);
		expect(
			screen.getByRole('button', { name: 'Close error' })
		).toBeInTheDocument();
	});

	it('renders the title as a level-2 heading', () => {
		render(
			<Alert variant="success" title="Payment complete">
				Funds will arrive within 2 business days.
			</Alert>
		);

		expect(
			screen.getByRole('heading', { level: 2, name: 'Payment complete' })
		).toBeInTheDocument();
	});
});
