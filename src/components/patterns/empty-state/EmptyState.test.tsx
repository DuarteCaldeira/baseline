import { render, screen } from '@testing-library/react';
import { Inbox, Plus } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Button } from '@/components/ui/button';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
	it('renders the title', () => {
		render(<EmptyState title="No items yet" />);
		expect(
			screen.getByRole('heading', { name: 'No items yet' })
		).toBeInTheDocument();
	});

	it('renders the description when provided', () => {
		render(
			<EmptyState
				title="No items yet"
				description="Add your first item to get started."
			/>
		);
		expect(
			screen.getByText('Add your first item to get started.')
		).toBeInTheDocument();
	});

	it('does not render a description when omitted', () => {
		render(<EmptyState title="No items yet" />);
		expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
	});

	it('renders an icon when provided', () => {
		const { container } = render(
			<EmptyState title="No items yet" icon={Inbox} />
		);
		expect(container.querySelector('svg')).toBeInTheDocument();
		expect(container.querySelector('.empty-state__icon')).toBeInTheDocument();
	});

	it('does not render an icon wrapper when icon is omitted', () => {
		const { container } = render(<EmptyState title="No items yet" />);
		expect(container.querySelector('.empty-state__icon')).not.toBeInTheDocument();
	});

	it('renders the action slot when provided', () => {
		render(
			<EmptyState
				title="No items yet"
				action={<Button icon={Plus}>Add item</Button>}
			/>
		);
		expect(
			screen.getByRole('button', { name: 'Add item' })
		).toBeInTheDocument();
	});

	it('does not render the action slot when omitted', () => {
		const { container } = render(<EmptyState title="No items yet" />);
		expect(
			container.querySelector('.empty-state__action')
		).not.toBeInTheDocument();
	});

	it('links the section to the title and description for accessibility', () => {
		render(
			<EmptyState
				title="No results"
				description="Try adjusting your filters."
			/>
		);

		const section = screen.getByRole('region', { name: 'No results' });
		expect(section).toHaveAttribute(
			'aria-describedby',
			expect.stringMatching(/.+/)
		);
	});

});
