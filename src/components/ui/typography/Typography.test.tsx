import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Heading } from './Heading';
import { Text } from './Text';

describe('Text', () => {
	it('renders a paragraph by default', () => {
		render(<Text>Body copy</Text>);
		const text = screen.getByText('Body copy');

		expect(text.tagName).toBe('P');
		expect(text).toHaveClass('text', 'text--body', 'text--tone-default');
	});

	it('renders the requested element and variant classes', () => {
		render(
			<Text as="span" variant="caption" tone="muted">
				Meta
			</Text>
		);
		const text = screen.getByText('Meta');

		expect(text.tagName).toBe('SPAN');
		expect(text).toHaveClass('text--caption', 'text--tone-muted');
	});

	it('merges a custom className', () => {
		render(<Text className="custom">Body copy</Text>);
		expect(screen.getByText('Body copy')).toHaveClass('custom');
	});
});

describe('Heading', () => {
	it('renders an h2 by default', () => {
		render(<Heading>Section title</Heading>);
		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Section title',
		});

		expect(heading).toHaveClass(
			'heading',
			'heading--lg',
			'heading--tone-default'
		);
	});

	it('uses the default size mapped from the heading level', () => {
		render(<Heading as="h4">Minor title</Heading>);
		expect(
			screen.getByRole('heading', { level: 4, name: 'Minor title' })
		).toHaveClass('heading--sm');
	});

	it('allows overriding the heading size and tone', () => {
		render(
			<Heading as="h3" size="xl" tone="muted">
				Hero title
			</Heading>
		);
		expect(
			screen.getByRole('heading', { level: 3, name: 'Hero title' })
		).toHaveClass('heading--xl', 'heading--tone-muted');
	});

	it('merges a custom className', () => {
		render(<Heading className="custom">Section title</Heading>);
		expect(screen.getByText('Section title')).toHaveClass('custom');
	});
});
