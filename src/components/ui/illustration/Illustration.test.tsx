import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Illustration } from './Illustration';

const TestSvg = () => (
	<svg data-testid="test-svg" viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="10" />
	</svg>
);

describe('Illustration', () => {
	it('renders svg content', () => {
		render(
			<Illustration>
				<TestSvg />
			</Illustration>
		);

		expect(screen.getByTestId('test-svg')).toBeInTheDocument();
	});

	it('is hidden from assistive technology when no label is provided', () => {
		const { container } = render(
			<Illustration>
				<TestSvg />
			</Illustration>
		);

		expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
	});

	it('applies size modifier class', () => {
		const { container } = render(
			<Illustration size="lg">
				<TestSvg />
			</Illustration>
		);

		expect(container.querySelector('.illustration--lg')).toBeInTheDocument();
	});

	it('marks the root element for EmptyState icon slot styling', () => {
		const { container } = render(
			<Illustration>
				<TestSvg />
			</Illustration>
		);

		expect(container.firstChild).toHaveAttribute('data-illustration');
	});
});
