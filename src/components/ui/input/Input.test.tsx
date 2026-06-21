import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
	it('renders a text input', () => {
		render(<Input />);
		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('renders label text when label prop is provided', () => {
		render(<Input label="Email address" required />);
		expect(screen.getByText('Email address')).toBeInTheDocument();
	});

	it('associates label with input via htmlFor and id', () => {
		render(<Input id="email" label="Email address" required />);
		expect(screen.getByLabelText('Email address')).toBeInTheDocument();
	});

	it('does not render a label element when label prop is omitted', () => {
		render(<Input />);
		expect(screen.queryByRole('label')).not.toBeInTheDocument();
	});

	it('calls onChange handler when typing', async () => {
		const handleChange = vi.fn();
		render(<Input onChange={handleChange} />);

		await userEvent.type(screen.getByRole('textbox'), 'hello');
		expect(handleChange).toHaveBeenCalled();
	});

	it('applies disabled attribute when disabled prop is true', () => {
		render(<Input disabled />);
		expect(screen.getByRole('textbox')).toBeDisabled();
	});

	it('renders helper text when helperText prop is provided', () => {
		render(<Input helperText="We will never share your email." />);
		expect(
			screen.getByText('We will never share your email.')
		).toBeInTheDocument();
	});

	it('sets aria-describedby to helper id when only helperText is provided', () => {
		render(<Input id="email" helperText="We will never share your email." />);
		expect(screen.getByRole('textbox')).toHaveAttribute(
			'aria-describedby',
			'email-helper'
		);
	});

	it('sets aria-describedby to both helper and error ids when both are provided', () => {
		render(
			<Input
				id="email"
				helperText="We will never share your email."
				error="This field is required."
			/>
		);
		expect(screen.getByRole('textbox')).toHaveAttribute(
			'aria-describedby',
			'email-helper email-error'
		);
	});

	it('renders error message when error prop is provided', () => {
		render(<Input error="This field is required." />);
		expect(screen.getByRole('alert')).toHaveTextContent(
			'This field is required.'
		);
	});

	it('sets aria-invalid when error prop is provided', () => {
		render(<Input error="Required" />);
		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
	});

	it('sets aria-describedby linking to error element', () => {
		render(<Input id="email" error="Required" />);
		const input = screen.getByRole('textbox');
		const error = screen.getByRole('alert');

		expect(input).toHaveAttribute('aria-describedby', 'email-error');
		expect(error).toHaveAttribute('id', 'email-error');
	});

	it('does not set aria-invalid when no error', () => {
		render(<Input />);
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
	});

	it('does not set aria-describedby when neither helperText nor error is provided', () => {
		render(<Input id="email" />);
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
	});

	it('shows the optional label for optional fields', () => {
		render(<Input id="email" label="Email address" />);
		expect(screen.getByText('(opcional)')).toBeInTheDocument();
	});

	it('hides the optional label for required fields', () => {
		render(<Input id="email" label="Email address" required />);
		expect(screen.queryByText('(opcional)')).not.toBeInTheDocument();
	});

	it('forwards additional HTML attributes', () => {
		render(<Input data-testid="my-input" />);
		expect(screen.getByTestId('my-input')).toBeInTheDocument();
	});

	it('forwards placeholder attribute', () => {
		render(<Input placeholder="Enter your email" />);
		expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
	});

	it('applies error modifier class when error is provided', () => {
		const { container } = render(<Input error="Required" />);
		expect(container.querySelector('.input--error')).toBeInTheDocument();
	});

	it('renders left affix when leftAffix prop is provided', () => {
		render(<Input leftAffix="+351" placeholder="912 345 678" />);
		expect(screen.getByText('+351')).toBeInTheDocument();
	});

	it('renders right affix when rightAffix prop is provided', () => {
		render(<Input rightAffix="%" type="number" />);
		expect(screen.getByText('%')).toBeInTheDocument();
	});

	it('wraps input in affix container when affixes are provided', () => {
		const { container } = render(<Input leftAffix="+351" />);
		expect(container.querySelector('.input__wrapper')).toBeInTheDocument();
	});

	it('applies embedded modifier to input when affixes are provided', () => {
		const { container } = render(<Input leftAffix="+351" />);
		expect(container.querySelector('.input--embedded')).toBeInTheDocument();
		expect(container.querySelector('.input--error')).not.toBeInTheDocument();
	});

	it('applies error modifier to wrapper when affixes and error are provided', () => {
		const { container } = render(<Input leftAffix="+351" error="Required" />);
		expect(
			container.querySelector('.input__wrapper--error')
		).toBeInTheDocument();
		expect(container.querySelector('.input--error')).not.toBeInTheDocument();
	});

	it('does not wrap input when no affixes are provided', () => {
		const { container } = render(<Input />);
		expect(container.querySelector('.input__wrapper')).not.toBeInTheDocument();
	});
});
