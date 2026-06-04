import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

import { Modal } from './Modal';

const defaultProps = {
	isOpen: true,
	onClose: vi.fn(),
	title: 'Confirm action',
	children: <p>Are you sure you want to continue?</p>,
};

describe('Modal', () => {
	it('renders dialog when isOpen is true', () => {
		render(<Modal {...defaultProps} />);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('does not render when isOpen is false', () => {
		render(<Modal {...defaultProps} isOpen={false} />);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders title', () => {
		render(<Modal {...defaultProps} />);
		expect(
			screen.getByRole('heading', { name: 'Confirm action' })
		).toBeInTheDocument();
	});

	it('renders children', () => {
		render(<Modal {...defaultProps} />);
		expect(
			screen.getByText('Are you sure you want to continue?')
		).toBeInTheDocument();
	});

	it('renders footer when provided', () => {
		render(
			<Modal
				{...defaultProps}
				footer={<Button onClick={vi.fn()}>Confirm</Button>}
			/>
		);
		expect(
			screen.getByRole('button', { name: /confirm/i })
		).toBeInTheDocument();
	});

	it('does not render footer section when footer is omitted', () => {
		const { container } = render(<Modal {...defaultProps} footer={undefined} />);
		expect(container.querySelector('.modal__footer')).not.toBeInTheDocument();
	});

	it('calls onClose when the close button is clicked', async () => {
		const onClose = vi.fn();
		render(<Modal {...defaultProps} onClose={onClose} />);

		await userEvent.click(screen.getByRole('button', { name: /close modal/i }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('calls onClose when the overlay is clicked', async () => {
		const onClose = vi.fn();
		render(<Modal {...defaultProps} onClose={onClose} />);

		await userEvent.click(document.querySelector('.modal-overlay')!);
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('does not call onClose when clicking inside the dialog', async () => {
		const onClose = vi.fn();
		render(<Modal {...defaultProps} onClose={onClose} />);

		await userEvent.click(screen.getByRole('dialog'));
		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not call onClose on overlay click when closeOnBackdropClick is false', async () => {
		const onClose = vi.fn();
		render(
			<Modal {...defaultProps} onClose={onClose} closeOnBackdropClick={false} />
		);

		await userEvent.click(document.querySelector('.modal-overlay')!);
		expect(onClose).not.toHaveBeenCalled();
	});

	it('calls onClose when Escape key is pressed', async () => {
		const onClose = vi.fn();
		render(<Modal {...defaultProps} onClose={onClose} />);

		await userEvent.keyboard('{Escape}');
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('has aria-modal="true"', () => {
		render(<Modal {...defaultProps} />);
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
	});

	it('links aria-labelledby to the title heading', () => {
		render(<Modal {...defaultProps} />);
		const dialog = screen.getByRole('dialog');
		const title = screen.getByRole('heading', { name: 'Confirm action' });
		expect(dialog).toHaveAttribute('aria-labelledby', title.id);
	});

	it('does not set aria-labelledby when title is omitted', () => {
		render(<Modal {...defaultProps} title={undefined} />);
		expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
	});

	it('applies the correct size modifier class', () => {
		const { container } = render(<Modal {...defaultProps} size="lg" />);
		expect(container.ownerDocument.querySelector('.modal--lg')).toBeInTheDocument();
	});

	it('renders content into document.body via portal', () => {
		render(<Modal {...defaultProps} />);
		expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
	});

	it('locks body scroll when open', () => {
		render(<Modal {...defaultProps} />);
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body scroll when closed', async () => {
		const { rerender } = render(<Modal {...defaultProps} />);
		rerender(<Modal {...defaultProps} isOpen={false} />);
		expect(document.body.style.overflow).toBe('');
	});
});
