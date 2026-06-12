import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormField } from './FormField';

describe('FormField', () => {
	it('renders children', () => {
		render(
			<FormField>
				<input aria-label="Name" />
			</FormField>
		);

		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('renders label, helper, and error messages', () => {
		render(
			<FormField
				fieldId="email"
				label="Email"
				helperText="We will never share your email."
				error="Required"
			>
				<input id="email" />
			</FormField>
		);

		const label = screen.getByText('Email');

		expect(label).toHaveAttribute('for', 'email');
		expect(label).toHaveAttribute('id', 'email-label');
		expect(
			screen.getByText('We will never share your email.')
		).toBeInTheDocument();
		expect(screen.getByRole('alert')).toHaveTextContent('Required');
		expect(screen.getByText('We will never share your email.')).toHaveAttribute(
			'id',
			'email-helper'
		);
		expect(screen.getByRole('alert')).toHaveAttribute('id', 'email-error');
	});

	it('does not render a label when label prop is omitted', () => {
		render(
			<FormField fieldId="email">
				<input id="email" />
			</FormField>
		);

		expect(screen.queryByRole('label')).not.toBeInTheDocument();
	});
});
