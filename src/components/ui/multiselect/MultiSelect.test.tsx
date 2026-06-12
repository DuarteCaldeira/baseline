import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { SelectOption } from '@/components/ui/select';

import { MultiSelect } from './MultiSelect';

const OPTIONS: SelectOption[] = [
	{ value: 'react', label: 'React' },
	{ value: 'typescript', label: 'TypeScript' },
	{ value: 'accessibility', label: 'Accessibility' },
];

describe('MultiSelect', () => {
	it('renders a label when provided', () => {
		render(
			<MultiSelect id="skills" label="Skills" options={OPTIONS} />
		);

		expect(screen.getByText('Skills')).toBeInTheDocument();
	});

	it('shows the placeholder when nothing is selected', () => {
		render(
			<MultiSelect
				id="skills"
				options={OPTIONS}
				placeholder="Pick skills"
			/>
		);

		expect(screen.getByText('Pick skills')).toBeInTheDocument();
	});

	it('renders selected values as tags', () => {
		render(
			<MultiSelect
				id="skills"
				options={OPTIONS}
				defaultValue={['react', 'typescript']}
			/>
		);

		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('TypeScript')).toBeInTheDocument();
	});

	it('opens the listbox when the trigger is clicked', async () => {
		const user = userEvent.setup();

		render(<MultiSelect id="skills" options={OPTIONS} />);

		await user.click(screen.getByRole('combobox'));

		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('selects an option from the listbox', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<MultiSelect id="skills" options={OPTIONS} onChange={onChange} />
		);

		await user.click(screen.getByRole('combobox'));
		await user.click(screen.getByRole('option', { name: /react/i }));

		expect(onChange).toHaveBeenCalledWith(['react']);
	});

	it('removes a value when a tag remove button is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<MultiSelect
				id="skills"
				options={OPTIONS}
				defaultValue={['react', 'typescript']}
				onChange={onChange}
			/>
		);

		await user.click(
			screen.getByRole('button', { name: 'Remove React' })
		);

		expect(onChange).toHaveBeenCalledWith(['typescript']);
	});

	it('removes the last selected value on Backspace when the listbox is closed', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<MultiSelect
				id="skills"
				options={OPTIONS}
				defaultValue={['react', 'typescript']}
				onChange={onChange}
			/>
		);

		screen.getByRole('combobox').focus();
		await user.keyboard('{Backspace}');

		expect(onChange).toHaveBeenCalledWith(['react']);
	});

	it('does not toggle the listbox when removing a tag', async () => {
		const user = userEvent.setup();

		render(
			<MultiSelect
				id="skills"
				options={OPTIONS}
				defaultValue={['react']}
			/>
		);

		await user.click(
			screen.getByRole('button', { name: 'Remove React' })
		);

		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('marks the listbox as multiselectable', async () => {
		const user = userEvent.setup();

		render(<MultiSelect id="skills" options={OPTIONS} />);

		await user.click(screen.getByRole('combobox'));

		expect(screen.getByRole('listbox')).toHaveAttribute(
			'aria-multiselectable',
			'true'
		);
	});

	it('shows an error message when provided', () => {
		render(
			<MultiSelect
				id="skills"
				options={OPTIONS}
				error="Select at least one skill."
			/>
		);

		expect(screen.getByRole('alert')).toHaveTextContent(
			'Select at least one skill.'
		);
	});

	it('sets aria-invalid when error is provided', () => {
		render(<MultiSelect id="skills" options={OPTIONS} error="Required" />);

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
	});

	it('renders helper text when provided', () => {
		render(
			<MultiSelect
				id="skills"
				options={OPTIONS}
				helperText="Pick all skills that apply."
			/>
		);

		expect(
			screen.getByText('Pick all skills that apply.')
		).toBeInTheDocument();
	});

	it('sets aria-describedby to helper and error ids when both are provided', () => {
		render(
			<MultiSelect
				id="skills"
				options={OPTIONS}
				helperText="Pick all skills that apply."
				error="Select at least one skill."
			/>
		);

		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-describedby',
			'skills-helper skills-error'
		);
	});
});
