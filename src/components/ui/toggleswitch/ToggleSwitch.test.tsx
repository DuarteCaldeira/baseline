import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ToggleSwitch } from './ToggleSwitch';

describe('ToggleSwitch', () => {
	it('renders a switch input', () => {
		render(<ToggleSwitch />);
		expect(screen.getByRole('switch')).toBeInTheDocument();
	});

	it('renders label text when label prop is provided', () => {
		render(<ToggleSwitch label="Enable notifications" />);
		expect(screen.getByText('Enable notifications')).toBeInTheDocument();
	});

	it('associates label with input via htmlFor and id', () => {
		render(<ToggleSwitch id="notifications" label="Enable notifications" />);
		expect(screen.getByLabelText('Enable notifications')).toBeInTheDocument();
	});

	it('calls onChange handler when clicked', async () => {
		const handleChange = vi.fn();
		render(
			<ToggleSwitch label="Enable notifications" onChange={handleChange} />
		);

		await userEvent.click(screen.getByRole('switch'));
		expect(handleChange).toHaveBeenCalledOnce();
	});

	it('renders as checked when defaultChecked is true', () => {
		render(<ToggleSwitch defaultChecked />);
		expect(screen.getByRole('switch')).toBeChecked();
	});

	it('applies disabled attribute when disabled prop is true', () => {
		render(<ToggleSwitch disabled label="Disabled" />);
		expect(screen.getByRole('switch')).toBeDisabled();
	});

	it('does not call onChange when disabled', async () => {
		const handleChange = vi.fn();
		render(
			<ToggleSwitch disabled onChange={handleChange} label="Disabled" />
		);

		await userEvent.click(screen.getByRole('switch'));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('renders helper text when helperText prop is provided', () => {
		render(<ToggleSwitch helperText="You can change this later." />);
		expect(
			screen.getByText('You can change this later.')
		).toBeInTheDocument();
	});

	it('sets aria-describedby to helper id when only helperText is provided', () => {
		render(<ToggleSwitch id="notifications" helperText="Optional field." />);
		expect(screen.getByRole('switch')).toHaveAttribute(
			'aria-describedby',
			'notifications-helper'
		);
	});

	it('sets aria-describedby to both helper and error ids when both are provided', () => {
		render(
			<ToggleSwitch id="notifications" helperText="Optional field." error="Required" />
		);
		expect(screen.getByRole('switch')).toHaveAttribute(
			'aria-describedby',
			'notifications-helper notifications-error'
		);
	});

	it('sets aria-describedby linking to error element', () => {
		render(<ToggleSwitch id="notifications" error="Required" />);
		const input = screen.getByRole('switch');
		const error = screen.getByRole('alert');

		expect(input).toHaveAttribute('aria-describedby', 'notifications-error');
		expect(error).toHaveAttribute('id', 'notifications-error');
	});

	it('does not set aria-describedby when neither helperText nor error is provided', () => {
		render(<ToggleSwitch id="notifications" />);
		expect(screen.getByRole('switch')).not.toHaveAttribute('aria-describedby');
	});

	it('renders error message when error prop is provided', () => {
		render(<ToggleSwitch error="This field is required" />);
		expect(screen.getByRole('alert')).toHaveTextContent(
			'This field is required'
		);
	});

	it('sets aria-invalid when error prop is provided', () => {
		render(<ToggleSwitch error="Required" />);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
	});

	it('forwards additional HTML attributes', () => {
		render(<ToggleSwitch data-testid="my-switch" />);
		expect(screen.getByTestId('my-switch')).toBeInTheDocument();
	});

	it('applies disabled modifier class when disabled', () => {
		const { container } = render(<ToggleSwitch disabled />);
		expect(
			container.querySelector('.toggle-switch--disabled')
		).toBeInTheDocument();
	});

	it('applies error modifier class when error is provided', () => {
		const { container } = render(<ToggleSwitch error="Required" />);
		expect(
			container.querySelector('.toggle-switch--error')
		).toBeInTheDocument();
	});

	it('renders the track and thumb elements', () => {
		const { container } = render(<ToggleSwitch label="Notifications" />);
		expect(container.querySelector('.toggle-switch__track')).toBeInTheDocument();
		expect(container.querySelector('.toggle-switch__thumb')).toBeInTheDocument();
	});

	it('applies the visually-hidden class to the input', () => {
		render(<ToggleSwitch id="notifications" label="Notifications" />);
		expect(screen.getByRole('switch')).toHaveClass('visually-hidden');
	});
});
