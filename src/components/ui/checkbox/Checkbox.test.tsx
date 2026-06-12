import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
	it('renders a checkbox input', () => {
		render(<Checkbox />);
		expect(screen.getByRole('checkbox')).toBeInTheDocument();
	});

	it('renders label text when label prop is provided', () => {
		render(<Checkbox label="Accept terms" />);
		expect(screen.getByText('Accept terms')).toBeInTheDocument();
	});

	it('associates label with input via htmlFor and id', () => {
		render(<Checkbox id="terms" label="Accept terms" />);
		expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
	});

	it('calls onChange handler when clicked', async () => {
		const handleChange = vi.fn();
		render(<Checkbox label="Click me" onChange={handleChange} />);

		await userEvent.click(screen.getByRole('checkbox'));
		expect(handleChange).toHaveBeenCalledOnce();
	});

	it('renders as checked when defaultChecked is true', () => {
		render(<Checkbox defaultChecked />);
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('applies disabled attribute when disabled prop is true', () => {
		render(<Checkbox disabled label="Disabled" />);
		expect(screen.getByRole('checkbox')).toBeDisabled();
	});

	it('does not call onChange when disabled', async () => {
		const handleChange = vi.fn();
		render(<Checkbox disabled onChange={handleChange} label="Disabled" />);

		await userEvent.click(screen.getByRole('checkbox'));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('renders helper text when helperText prop is provided', () => {
		render(<Checkbox helperText="You can change this later." />);
		expect(screen.getByText('You can change this later.')).toBeInTheDocument();
	});

	it('sets aria-describedby to helper id when only helperText is provided', () => {
		render(<Checkbox id="terms" helperText="Optional field." />);
		expect(screen.getByRole('checkbox')).toHaveAttribute(
			'aria-describedby',
			'terms-helper'
		);
	});

	it('sets aria-describedby to both helper and error ids when both are provided', () => {
		render(
			<Checkbox id="terms" helperText="Optional field." error="Required" />
		);
		expect(screen.getByRole('checkbox')).toHaveAttribute(
			'aria-describedby',
			'terms-helper terms-error'
		);
	});

	it('renders error message when error prop is provided', () => {
		render(<Checkbox error="This field is required" />);
		expect(screen.getByRole('alert')).toHaveTextContent(
			'This field is required'
		);
	});

	it('sets aria-invalid when error prop is provided', () => {
		render(<Checkbox error="Required" />);
		expect(screen.getByRole('checkbox')).toHaveAttribute(
			'aria-invalid',
			'true'
		);
	});

	it('sets aria-describedby linking to error element', () => {
		render(<Checkbox id="terms" error="Required" />);
		const input = screen.getByRole('checkbox');
		const error = screen.getByRole('alert');

		expect(input).toHaveAttribute('aria-describedby', 'terms-error');
		expect(error).toHaveAttribute('id', 'terms-error');
	});

	it('does not set aria-invalid when no error', () => {
		render(<Checkbox />);
		expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
	});

	it('forwards additional HTML attributes', () => {
		render(<Checkbox data-testid="my-checkbox" />);
		expect(screen.getByTestId('my-checkbox')).toBeInTheDocument();
	});

	it('applies disabled modifier class when disabled', () => {
		const { container } = render(<Checkbox disabled />);
		expect(container.querySelector('.checkbox--disabled')).toBeInTheDocument();
	});

	it('applies error modifier class when error is provided', () => {
		const { container } = render(<Checkbox error="Required" />);
		expect(container.querySelector('.checkbox--error')).toBeInTheDocument();
	});
});
