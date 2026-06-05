import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bold, Italic, Underline } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { ToggleButton } from './ToggleButton';
import { ToggleButtonGroup } from './ToggleButtonGroup';

describe('ToggleButton', () => {
	it('renders with aria-pressed false by default', () => {
		render(<ToggleButton>Bold</ToggleButton>);

		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
			'aria-pressed',
			'false'
		);
	});

	it('renders with aria-pressed true when pressed', () => {
		render(<ToggleButton pressed>Bold</ToggleButton>);

		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
	});

	it('toggles aria-pressed when clicked', async () => {
		render(<ToggleButton>Bold</ToggleButton>);

		const button = screen.getByRole('button', { name: 'Bold' });
		await userEvent.click(button);

		expect(button).toHaveAttribute('aria-pressed', 'true');

		await userEvent.click(button);

		expect(button).toHaveAttribute('aria-pressed', 'false');
	});

	it('calls onPressedChange when toggled', async () => {
		const handleChange = vi.fn();
		render(
			<ToggleButton onPressedChange={handleChange}>Bold</ToggleButton>
		);

		await userEvent.click(screen.getByRole('button', { name: 'Bold' }));

		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it('applies the pressed modifier class', () => {
		render(<ToggleButton pressed>Bold</ToggleButton>);

		expect(screen.getByRole('button', { name: 'Bold' }).className).toMatch(
			/toggle-button--pressed/
		);
	});

	it('supports icon-only buttons', () => {
		render(
			<ToggleButton icon={Bold} aria-label="Bold" pressed />
		);

		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
	});
});

describe('ToggleButtonGroup', () => {
	it('selects one option in single mode', async () => {
		render(
			<ToggleButtonGroup aria-label="Alignment" defaultValue="left">
				<ToggleButton value="left">Left</ToggleButton>
				<ToggleButton value="center">Center</ToggleButton>
				<ToggleButton value="right">Right</ToggleButton>
			</ToggleButtonGroup>
		);

		expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute(
			'aria-pressed',
			'true'
		);

		await userEvent.click(screen.getByRole('button', { name: 'Center' }));

		expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute(
			'aria-pressed',
			'false'
		);
		expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
	});

	it('allows multiple selections in multiple mode', async () => {
		render(
			<ToggleButtonGroup aria-label="Formatting" type="multiple">
				<ToggleButton value="bold" icon={Bold} aria-label="Bold" />
				<ToggleButton value="italic" icon={Italic} aria-label="Italic" />
				<ToggleButton
					value="underline"
					icon={Underline}
					aria-label="Underline"
				/>
			</ToggleButtonGroup>
		);

		await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
		await userEvent.click(screen.getByRole('button', { name: 'Italic' }));

		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
		expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
		expect(screen.getByRole('button', { name: 'Underline' })).toHaveAttribute(
			'aria-pressed',
			'false'
		);
	});

	it('calls onChange when selection changes', async () => {
		const handleChange = vi.fn();

		render(
			<ToggleButtonGroup
				aria-label="Alignment"
				onChange={handleChange}
			>
				<ToggleButton value="left">Left</ToggleButton>
				<ToggleButton value="right">Right</ToggleButton>
			</ToggleButtonGroup>
		);

		await userEvent.click(screen.getByRole('button', { name: 'Right' }));

		expect(handleChange).toHaveBeenCalledWith('right');
	});

	it('applies button group item classes to children', () => {
		render(
			<ToggleButtonGroup aria-label="Alignment">
				<ToggleButton value="left">Left</ToggleButton>
				<ToggleButton value="right">Right</ToggleButton>
			</ToggleButtonGroup>
		);

		expect(screen.getByRole('button', { name: 'Left' }).className).toMatch(
			/button-group__item--horizontal-first/
		);
		expect(screen.getByRole('button', { name: 'Right' }).className).toMatch(
			/button-group__item--horizontal-last/
		);
	});
});
