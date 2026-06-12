import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from './Textarea';

describe('Textarea', () => {
	it('renders a textbox', () => {
		render(<Textarea />);
		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('renders label text when label prop is provided', () => {
		render(<Textarea label="Message" />);
		expect(screen.getByText('Message')).toBeInTheDocument();
	});

	it('associates label with textarea via htmlFor and id', () => {
		render(<Textarea id="message" label="Message" />);
		expect(screen.getByLabelText('Message')).toBeInTheDocument();
	});

	it('does not render a label element when label prop is omitted', () => {
		render(<Textarea />);
		expect(screen.queryByText(/label/i)).not.toBeInTheDocument();
	});

	it('calls onChange handler when typing', async () => {
		const handleChange = vi.fn();
		render(<Textarea onChange={handleChange} />);

		await userEvent.type(screen.getByRole('textbox'), 'hello');
		expect(handleChange).toHaveBeenCalled();
	});

	it('applies disabled attribute when disabled prop is true', () => {
		render(<Textarea disabled />);
		expect(screen.getByRole('textbox')).toBeDisabled();
	});

	it('renders helper text when helperText prop is provided', () => {
		render(<Textarea helperText="Maximum 500 characters." />);
		expect(screen.getByText('Maximum 500 characters.')).toBeInTheDocument();
	});

	it('sets aria-describedby to helper id when only helperText is provided', () => {
		render(<Textarea id="message" helperText="Maximum 500 characters." />);
		expect(screen.getByRole('textbox')).toHaveAttribute(
			'aria-describedby',
			'message-helper'
		);
	});

	it('sets aria-describedby to both helper and error ids when both are provided', () => {
		render(
			<Textarea
				id="message"
				helperText="Maximum 500 characters."
				error="This field is required."
			/>
		);
		expect(screen.getByRole('textbox')).toHaveAttribute(
			'aria-describedby',
			'message-helper message-error'
		);
	});

	it('renders error message when error prop is provided', () => {
		render(<Textarea error="This field is required." />);
		expect(screen.getByRole('alert')).toHaveTextContent(
			'This field is required.'
		);
	});

	it('sets aria-invalid when error prop is provided', () => {
		render(<Textarea error="Required" />);
		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
	});

	it('sets aria-describedby linking to error element', () => {
		render(<Textarea id="message" error="Required" />);
		const textarea = screen.getByRole('textbox');
		const error = screen.getByRole('alert');

		expect(textarea).toHaveAttribute('aria-describedby', 'message-error');
		expect(error).toHaveAttribute('id', 'message-error');
	});

	it('does not set aria-invalid when no error', () => {
		render(<Textarea />);
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
	});

	it('does not set aria-describedby when neither helperText nor error is provided', () => {
		render(<Textarea id="message" />);
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
	});

	it('applies resize-vertical modifier class by default', () => {
		const { container } = render(<Textarea />);
		expect(
			container.querySelector('.textarea--resize-vertical')
		).toBeInTheDocument();
	});

	it('applies resize-none modifier class when resize is none', () => {
		const { container } = render(<Textarea resize="none" />);
		expect(
			container.querySelector('.textarea--resize-none')
		).toBeInTheDocument();
	});

	it('forwards additional HTML attributes', () => {
		render(<Textarea data-testid="my-textarea" />);
		expect(screen.getByTestId('my-textarea')).toBeInTheDocument();
	});

	it('forwards placeholder attribute', () => {
		render(<Textarea placeholder="Write your message here..." />);
		expect(
			screen.getByPlaceholderText('Write your message here...')
		).toBeInTheDocument();
	});

	it('forwards rows attribute', () => {
		render(<Textarea rows={8} />);
		expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
	});

	it('applies error modifier class when error is provided', () => {
		const { container } = render(<Textarea error="Required" />);
		expect(container.querySelector('.textarea--error')).toBeInTheDocument();
	});
});
