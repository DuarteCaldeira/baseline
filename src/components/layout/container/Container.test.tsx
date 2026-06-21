import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Container } from './Container';

describe('Container', () => {
	it('renders children', () => {
		render(<Container>Page content</Container>);
		expect(screen.getByText('Page content')).toBeInTheDocument();
	});

	it.each(['sm', 'md', 'lg', 'xl', 'full'] as const)(
		'applies the %s size class',
		(size) => {
			const { container } = render(<Container size={size}>Content</Container>);
			expect(
				container.querySelector(`.container--${size}`)
			).toBeInTheDocument();
		}
	);

	it('defaults to the lg size class', () => {
		const { container } = render(<Container>Content</Container>);
		expect(container.querySelector('.container--lg')).toBeInTheDocument();
	});

	it('merges a custom className', () => {
		const { container } = render(
			<Container className="page-shell">Content</Container>
		);
		expect(container.querySelector('.page-shell')).toBeInTheDocument();
	});

	it('forwards HTML attributes', () => {
		render(<Container data-testid="page-container">Content</Container>);
		expect(screen.getByTestId('page-container')).toBeInTheDocument();
	});
});
