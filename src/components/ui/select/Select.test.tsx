import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { SelectOption } from './Select.types';
import { Select } from './Select';

const OPTIONS: SelectOption[] = [
	{ value: 'react', label: 'React' },
	{ value: 'typescript', label: 'TypeScript' },
	{ value: 'accessibility', label: 'Accessibility', disabled: true },
];

describe('Select', () => {
	it('renders a label when provided', () => {
		render(<Select id="framework" label="Framework" options={OPTIONS} />);

		expect(screen.getByText('Framework')).toBeInTheDocument();
	});

	it('shows the placeholder when no value is selected', () => {
		render(
			<Select
				id="framework"
				options={OPTIONS}
				placeholder="Pick a framework"
			/>
		);

		expect(screen.getByText('Pick a framework')).toBeInTheDocument();
	});

	it('shows the selected option label', () => {
		render(
			<Select id="framework" options={OPTIONS} value="react" />
		);

		expect(screen.getByRole('combobox')).toHaveTextContent('React');
	});

	it('opens the listbox when the trigger is clicked', async () => {
		const user = userEvent.setup();

		render(<Select id="framework" options={OPTIONS} />);

		await user.click(screen.getByRole('combobox'));

		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('closes the listbox when the trigger is clicked again', async () => {
		const user = userEvent.setup();

		render(<Select id="framework" options={OPTIONS} />);

		await user.click(screen.getByRole('combobox'));
		await user.click(screen.getByRole('combobox'));

		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('calls onChange when an option is selected', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Select id="framework" options={OPTIONS} onChange={onChange} />
		);

		await user.click(screen.getByRole('combobox'));
		await user.click(screen.getByRole('option', { name: /react/i }));

		expect(onChange).toHaveBeenCalledWith('react');
	});

	it('closes the listbox after selecting an option', async () => {
		const user = userEvent.setup();

		render(<Select id="framework" options={OPTIONS} />);

		await user.click(screen.getByRole('combobox'));
		await user.click(screen.getByRole('option', { name: /react/i }));

		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('marks the selected option with aria-selected', async () => {
		const user = userEvent.setup();

		render(
			<Select id="framework" options={OPTIONS} value="typescript" />
		);

		await user.click(screen.getByRole('combobox'));

		expect(
			screen.getByRole('option', { name: /typescript/i })
		).toHaveAttribute('aria-selected', 'true');
	});

	it('disables the trigger when disabled', () => {
		render(<Select id="framework" options={OPTIONS} disabled />);

		expect(screen.getByRole('combobox')).toBeDisabled();
	});

	it('renders helper text when provided', () => {
		render(
			<Select
				id="framework"
				options={OPTIONS}
				helperText="Choose your preferred framework."
			/>
		);

		expect(
			screen.getByText('Choose your preferred framework.')
		).toBeInTheDocument();
	});

	it('sets aria-describedby to helper id when only helperText is provided', () => {
		render(
			<Select
				id="framework"
				options={OPTIONS}
				helperText="Choose your preferred framework."
			/>
		);

		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-describedby',
			'framework-helper'
		);
	});

	it('sets aria-describedby to both helper and error ids when both are provided', () => {
		render(
			<Select
				id="framework"
				options={OPTIONS}
				helperText="Choose your preferred framework."
				error="This field is required."
			/>
		);

		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-describedby',
			'framework-helper framework-error'
		);
	});

	it('shows an error message when provided', () => {
		render(
			<Select
				id="framework"
				options={OPTIONS}
				error="This field is required."
			/>
		);

		expect(screen.getByRole('alert')).toHaveTextContent(
			'This field is required.'
		);
	});

	it('sets aria-invalid when error is provided', () => {
		render(
			<Select id="framework" options={OPTIONS} error="Required" />
		);

		expect(screen.getByRole('combobox')).toHaveAttribute(
			'aria-invalid',
			'true'
		);
	});
});
