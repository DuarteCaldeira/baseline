import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
	it('renders a section by default', () => {
		render(<Card>Content</Card>);
		const card = screen.getByText('Content');

		expect(card.tagName).toBe('SECTION');
		expect(card).toHaveClass('card');
	});

	it('supports rendering as a different element', () => {
		render(<Card as="article">Content</Card>);
		expect(screen.getByText('Content').tagName).toBe('ARTICLE');
	});

	it('applies the fill class', () => {
		render(<Card fill>Content</Card>);
		expect(screen.getByText('Content')).toHaveClass('card--fill');
	});

	it('applies the overflow hidden class', () => {
		render(<Card overflowHidden>Content</Card>);
		expect(screen.getByText('Content')).toHaveClass('card--overflow-hidden');
	});

	it('merges a custom className', () => {
		render(<Card className="custom">Content</Card>);
		expect(screen.getByText('Content')).toHaveClass('custom');
	});
});
