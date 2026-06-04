import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Radio } from './Radio';

describe('Radio', () => {
	it('renders a radio input', () => {
		render(<Radio />);
		expect(screen.getByRole('radio')).toBeInTheDocument();
	});

	it('renders label text when label prop is provided', () => {
		render(<Radio label="Option A" />);
		expect(screen.getByText('Option A')).toBeInTheDocument();
	});

	it('associates label with input via htmlFor and id', () => {
		render(<Radio id="option-a" label="Option A" />);
		expect(screen.getByLabelText('Option A')).toBeInTheDocument();
	});

	it('calls onChange handler when clicked', async () => {
		const handleChange = vi.fn();
		render(<Radio label="Option A" onChange={handleChange} />);

		await userEvent.click(screen.getByRole('radio'));
		expect(handleChange).toHaveBeenCalledOnce();
	});

	it('renders as checked when defaultChecked is true', () => {
		render(<Radio defaultChecked />);
		expect(screen.getByRole('radio')).toBeChecked();
	});

	it('selects correct option within a group', async () => {
		render(
			<>
				<Radio id="a" name="group" label="Option A" />
				<Radio id="b" name="group" label="Option B" />
			</>
		);

		await userEvent.click(screen.getByLabelText('Option B'));
		expect(screen.getByLabelText('Option B')).toBeChecked();
		expect(screen.getByLabelText('Option A')).not.toBeChecked();
	});

	it('applies disabled attribute when disabled prop is true', () => {
		render(<Radio disabled label="Disabled" />);
		expect(screen.getByRole('radio')).toBeDisabled();
	});

	it('does not call onChange when disabled', async () => {
		const handleChange = vi.fn();
		render(<Radio disabled onChange={handleChange} label="Disabled" />);

		await userEvent.click(screen.getByRole('radio'));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('renders helper text when helperText prop is provided', () => {
		render(<Radio helperText="Choose the option that applies." />);
		expect(
			screen.getByText('Choose the option that applies.')
		).toBeInTheDocument();
	});

	it('sets aria-describedby to helper id when only helperText is provided', () => {
		render(<Radio id="option-a" helperText="Recommended." />);
		expect(screen.getByRole('radio')).toHaveAttribute(
			'aria-describedby',
			'option-a-helper'
		);
	});

	it('sets aria-describedby to both helper and error ids when both are provided', () => {
		render(
			<Radio
				id="option-a"
				helperText="Recommended."
				error="Required"
			/>
		);
		expect(screen.getByRole('radio')).toHaveAttribute(
			'aria-describedby',
			'option-a-helper option-a-error'
		);
	});

	it('renders error message when error prop is provided', () => {
		render(<Radio error="Please select an option" />);
		expect(screen.getByRole('alert')).toHaveTextContent(
			'Please select an option'
		);
	});

	it('sets aria-invalid when error prop is provided', () => {
		render(<Radio error="Required" />);
		expect(screen.getByRole('radio')).toHaveAttribute(
			'aria-invalid',
			'true'
		);
	});

	it('sets aria-describedby linking to error element', () => {
		render(<Radio id="option-a" error="Required" />);
		const input = screen.getByRole('radio');
		const error = screen.getByRole('alert');

		expect(input).toHaveAttribute('aria-describedby', 'option-a-error');
		expect(error).toHaveAttribute('id', 'option-a-error');
	});

	it('does not set aria-invalid when no error', () => {
		render(<Radio />);
		expect(screen.getByRole('radio')).not.toHaveAttribute('aria-invalid');
	});

	it('forwards additional HTML attributes', () => {
		render(<Radio data-testid="my-radio" />);
		expect(screen.getByTestId('my-radio')).toBeInTheDocument();
	});

	it('applies disabled modifier class when disabled', () => {
		const { container } = render(<Radio disabled />);
		expect(container.querySelector('.radio--disabled')).toBeInTheDocument();
	});

	it('applies error modifier class when error is provided', () => {
		const { container } = render(<Radio error="Required" />);
		expect(container.querySelector('.radio--error')).toBeInTheDocument();
	});
});
