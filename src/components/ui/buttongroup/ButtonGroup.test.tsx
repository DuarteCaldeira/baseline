import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

import { ButtonGroup } from './ButtonGroup';

describe('ButtonGroup', () => {
	it('renders a group with an accessible label', () => {
		render(
			<ButtonGroup aria-label="Text alignment">
				<Button variant="secondary">Left</Button>
				<Button variant="secondary">Center</Button>
				<Button variant="secondary">Right</Button>
			</ButtonGroup>
		);

		expect(
			screen.getByRole('group', { name: 'Text alignment' })
		).toBeInTheDocument();
	});

	it('renders all child buttons', () => {
		render(
			<ButtonGroup aria-label="Actions">
				<Button variant="secondary">Undo</Button>
				<Button variant="secondary">Redo</Button>
			</ButtonGroup>
		);

		expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Redo' })).toBeInTheDocument();
	});

	it('calls individual button handlers', async () => {
		const handleUndo = vi.fn();
		const handleRedo = vi.fn();

		render(
			<ButtonGroup aria-label="History">
				<Button variant="secondary" onClick={handleUndo}>
					Undo
				</Button>
				<Button variant="secondary" onClick={handleRedo}>
					Redo
				</Button>
			</ButtonGroup>
		);

		await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
		await userEvent.click(screen.getByRole('button', { name: 'Redo' }));

		expect(handleUndo).toHaveBeenCalledOnce();
		expect(handleRedo).toHaveBeenCalledOnce();
	});

	it('applies the horizontal orientation class by default', () => {
		const { container } = render(
			<ButtonGroup aria-label="Actions">
				<Button variant="secondary">One</Button>
			</ButtonGroup>
		);

		expect(
			container.querySelector('.button-group--horizontal')
		).toBeInTheDocument();
	});

	it('applies the vertical orientation class', () => {
		const { container } = render(
			<ButtonGroup aria-label="Actions" orientation="vertical">
				<Button variant="secondary">One</Button>
			</ButtonGroup>
		);

		expect(
			container.querySelector('.button-group--vertical')
		).toBeInTheDocument();
	});

	it('renders buttons as direct children for group border styling', () => {
		const { container } = render(
			<ButtonGroup aria-label="Actions">
				<Button variant="secondary">First</Button>
				<Button variant="secondary">Middle</Button>
				<Button variant="secondary">Last</Button>
			</ButtonGroup>
		);

		const group = container.querySelector('.button-group--horizontal');

		expect(group?.children).toHaveLength(3);
		expect(group?.children[0].tagName).toBe('BUTTON');
		expect(group?.children[1].tagName).toBe('BUTTON');
		expect(group?.children[2].tagName).toBe('BUTTON');
	});

	it('applies the full-width modifier class', () => {
		const { container } = render(
			<ButtonGroup aria-label="Actions" fullWidth>
				<Button variant="secondary">One</Button>
				<Button variant="secondary">Two</Button>
			</ButtonGroup>
		);

		expect(
			container.querySelector('.button-group--full-width')
		).toBeInTheDocument();
	});

	it('merges custom className on the group', () => {
		const { container } = render(
			<ButtonGroup aria-label="Actions" className="custom-group">
				<Button variant="secondary">One</Button>
			</ButtonGroup>
		);

		expect(container.querySelector('.custom-group')).toBeInTheDocument();
	});
});
