import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

import { Drawer } from './Drawer';

const defaultProps = {
	isOpen: true,
	onClose: vi.fn(),
	title: 'Drawer title',
	children: <p>Drawer content goes here.</p>,
};

describe('Drawer', () => {
	it('renders dialog when isOpen is true', () => {
		render(<Drawer {...defaultProps} />);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('does not render when isOpen is false', () => {
		render(<Drawer {...defaultProps} isOpen={false} />);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders title and children', () => {
		render(<Drawer {...defaultProps} />);
		expect(
			screen.getByRole('heading', { name: 'Drawer title' })
		).toBeInTheDocument();
		expect(screen.getByText('Drawer content goes here.')).toBeInTheDocument();
	});

	it('renders footer when provided', () => {
		render(
			<Drawer
				{...defaultProps}
				footer={<Button onClick={vi.fn()}>Save</Button>}
			/>
		);
		expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
	});

	it('calls onClose when the close button is clicked', async () => {
		const onClose = vi.fn();
		render(<Drawer {...defaultProps} onClose={onClose} />);

		await userEvent.click(
			screen.getByRole('button', { name: /close drawer/i })
		);
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('calls onClose when Escape is pressed', async () => {
		const onClose = vi.fn();
		render(<Drawer {...defaultProps} onClose={onClose} />);

		await userEvent.keyboard('{Escape}');
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('applies side and size modifier classes', () => {
		render(<Drawer {...defaultProps} side="left" size="lg" />);
		const dialog = screen.getByRole('dialog');
		expect(dialog.className).toMatch(/drawer--left/);
		expect(dialog.className).toMatch(/drawer--lg/);
	});

	it('renders content into document.body via portal', () => {
		render(<Drawer {...defaultProps} />);
		expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
	});

	it('stays mounted with closing class during exit animation', () => {
		const { rerender } = render(<Drawer {...defaultProps} />);
		rerender(<Drawer {...defaultProps} isOpen={false} />);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByRole('dialog').className).toMatch(/drawer--closing/);
	});

	it('unmounts after exit animation completes', async () => {
		const { rerender } = render(<Drawer {...defaultProps} />);
		rerender(<Drawer {...defaultProps} isOpen={false} />);

		const panel = screen.getByRole('dialog');
		// React falls back to the prefixed event in jsdom because AnimationEvent is missing.
		fireEvent(panel, new Event('webkitAnimationEnd', { bubbles: true }));

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it('locks body scroll when open', () => {
		render(<Drawer {...defaultProps} />);
		expect(document.body.style.overflow).toBe('hidden');
	});
});
