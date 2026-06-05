import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumb } from './Breadcrumb';

const items = [
	{ label: 'Home', href: '/' },
	{ label: 'Products', href: '/products' },
	{ label: 'Widget' },
];

describe('Breadcrumb', () => {
	it('renders a navigation landmark with a default label', () => {
		render(<Breadcrumb items={items} />);
		expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
	});

	it('renders links for preceding items with href', () => {
		render(<Breadcrumb items={items} />);

		expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
		expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute(
			'href',
			'/products'
		);
	});

	it('renders the last item as the current page', () => {
		render(<Breadcrumb items={items} />);

		expect(screen.getByText('Widget')).toHaveAttribute('aria-current', 'page');
		expect(screen.queryByRole('link', { name: 'Widget' })).not.toBeInTheDocument();
	});

	it('renders separators between items', () => {
		const { container } = render(<Breadcrumb items={items} />);

		expect(container.querySelectorAll('.breadcrumb__separator')).toHaveLength(2);
	});

	it('renders a single current page without separators', () => {
		const { container } = render(
			<Breadcrumb items={[{ label: 'Dashboard' }]} />
		);

		expect(screen.getByText('Dashboard')).toHaveAttribute('aria-current', 'page');
		expect(container.querySelector('.breadcrumb__separator')).not.toBeInTheDocument();
	});

	it('renders a plain span when a non-last item has no href', () => {
		render(
			<Breadcrumb
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'Archived' },
					{ label: 'Widget' },
				]}
			/>
		);

		expect(screen.queryByRole('link', { name: 'Archived' })).not.toBeInTheDocument();
		expect(screen.getByText('Archived')).toHaveClass('breadcrumb__text');
	});

	it('accepts a custom aria-label', () => {
		render(
			<Breadcrumb items={items} aria-label="Page location" />
		);

		expect(
			screen.getByRole('navigation', { name: 'Page location' })
		).toBeInTheDocument();
	});

	it('merges custom className', () => {
		const { container } = render(
			<Breadcrumb items={items} className="custom" />
		);

		expect(container.querySelector('.custom')).toBeInTheDocument();
	});
});
