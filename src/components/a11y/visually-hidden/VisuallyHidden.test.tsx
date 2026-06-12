import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VisuallyHidden, VISUALLY_HIDDEN_CLASS } from './VisuallyHidden';

describe('VisuallyHidden', () => {
	it('renders children', () => {
		render(<VisuallyHidden>Hidden label</VisuallyHidden>);
		expect(screen.getByText('Hidden label')).toBeInTheDocument();
	});

	it('applies the visually-hidden class', () => {
		render(<VisuallyHidden>Hidden label</VisuallyHidden>);
		expect(screen.getByText('Hidden label')).toHaveClass(VISUALLY_HIDDEN_CLASS);
	});

	it('renders as a div when as="div"', () => {
		render(<VisuallyHidden as="div">Hidden block</VisuallyHidden>);
		expect(screen.getByText('Hidden block').tagName).toBe('DIV');
	});

});

describe('VISUALLY_HIDDEN_CLASS', () => {
	it('matches the global utility class name', () => {
		expect(VISUALLY_HIDDEN_CLASS).toBe('visually-hidden');
	});
});
