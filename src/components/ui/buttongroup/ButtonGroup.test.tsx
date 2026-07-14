import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChevronDown } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';
import {
	Menu,
	MenuContent,
	MenuItem,
	MenuTrigger,
} from '@/components/ui/menu';

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

	it('marks the group and buttons for shared border styling', () => {
		render(
			<ButtonGroup aria-label="Actions">
				<Button variant="secondary">First</Button>
				<Button variant="secondary">Middle</Button>
				<Button variant="secondary">Last</Button>
			</ButtonGroup>
		);

		const group = screen.getByRole('group', { name: 'Actions' });

		expect(group).toHaveAttribute('data-button-group', 'horizontal');
		expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute(
			'data-button-group-item',
			'horizontal'
		);
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

	it('marks menu-backed split buttons as group items', () => {
		const { container } = render(
			<ButtonGroup aria-label="Publish options">
				<Button variant="primary">Publish</Button>
				<Menu>
					<MenuTrigger>
						<Button
							variant="primary"
							icon={ChevronDown}
							aria-label="More options"
						/>
					</MenuTrigger>
					<MenuContent align="end">
						<MenuItem>Schedule publish</MenuItem>
					</MenuContent>
				</Menu>
			</ButtonGroup>
		);

		expect(
			container.querySelector('[data-button-group-item="horizontal"] .button')
		).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'More options' })).toHaveAttribute(
			'data-variant',
			'primary'
		);
	});
});
