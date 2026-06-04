import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Tabs } from './Tabs';

const items = [
	{
		id: 'overview',
		label: 'Overview',
		content: <p>Overview content.</p>,
	},
	{
		id: 'details',
		label: 'Details',
		content: <p>Details content.</p>,
	},
	{
		id: 'settings',
		label: 'Settings',
		content: <p>Settings content.</p>,
	},
];

describe('Tabs', () => {
	it('renders all tab labels', () => {
		render(<Tabs items={items} />);
		expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
	});

	it('shows the first tab panel by default', () => {
		render(<Tabs items={items} />);
		expect(screen.getByText('Overview content.')).toBeVisible();
		expect(screen.getByText('Details content.')).not.toBeVisible();
	});

	it('opens the defaultValue tab on mount', () => {
		render(<Tabs items={items} defaultValue="details" />);
		expect(screen.getByText('Details content.')).toBeVisible();
		expect(
			screen.getByRole('tab', { name: 'Details' })
		).toHaveAttribute('aria-selected', 'true');
	});

	it('switches panels when a tab is clicked', async () => {
		const user = userEvent.setup();
		render(<Tabs items={items} />);

		await user.click(screen.getByRole('tab', { name: 'Details' }));

		expect(screen.getByText('Details content.')).toBeVisible();
		expect(screen.getByText('Overview content.')).not.toBeVisible();
		expect(
			screen.getByRole('tab', { name: 'Details' })
		).toHaveAttribute('aria-selected', 'true');
	});

	it('renders a sliding underline indicator', () => {
		const { container } = render(<Tabs items={items} />);
		const indicator = container.querySelector(
			'.tabs__indicator'
		) as HTMLElement;

		expect(indicator).toBeInTheDocument();
		expect(indicator.style.transform).toMatch(/translateX\(/);
	});

	it('does not activate a disabled tab', async () => {
		const user = userEvent.setup();
		const disabledItems = [
			items[0],
			{ ...items[1], disabled: true },
			items[2],
		];

		render(<Tabs items={disabledItems} />);

		await user.click(screen.getByRole('tab', { name: 'Details' }));

		expect(screen.getByText('Overview content.')).toBeVisible();
		expect(
			screen.getByRole('tab', { name: 'Details' })
		).toHaveAttribute('aria-selected', 'false');
	});

	it('calls onChange in controlled mode', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Tabs items={items} value="overview" onChange={onChange} />
		);

		await user.click(screen.getByRole('tab', { name: 'Settings' }));
		expect(onChange).toHaveBeenCalledWith('settings');
	});

	it('updates when the controlled value changes', async () => {
		const user = userEvent.setup();
		const Controlled = () => {
			const [value, setValue] = useState('overview');
			return (
				<>
					<button onClick={() => setValue('settings')}>go settings</button>
					<Tabs items={items} value={value} onChange={setValue} />
				</>
			);
		};

		render(<Controlled />);
		expect(screen.getByText('Overview content.')).toBeVisible();

		await user.click(screen.getByRole('button', { name: 'go settings' }));
		expect(screen.getByText('Settings content.')).toBeVisible();
	});

	it('links each tab to its panel', () => {
		render(<Tabs items={items} />);
		const tab = screen.getByRole('tab', { name: 'Overview' });
		const panelId = tab.getAttribute('aria-controls')!;
		const panel = document.getElementById(panelId)!;

		expect(panel).toHaveAttribute('role', 'tabpanel');
		expect(panel).toHaveAttribute('aria-labelledby', tab.id);
	});

	describe('keyboard navigation', () => {
		it('moves to the next tab on ArrowRight', async () => {
			const user = userEvent.setup();
			render(<Tabs items={items} />);

			screen.getByRole('tab', { name: 'Overview' }).focus();
			await user.keyboard('{ArrowRight}');

			expect(
				screen.getByRole('tab', { name: 'Details' })
			).toHaveAttribute('aria-selected', 'true');
			expect(screen.getByText('Details content.')).toBeVisible();
		});

		it('moves to the previous tab on ArrowLeft', async () => {
			const user = userEvent.setup();
			render(<Tabs items={items} defaultValue="details" />);

			screen.getByRole('tab', { name: 'Details' }).focus();
			await user.keyboard('{ArrowLeft}');

			expect(
				screen.getByRole('tab', { name: 'Overview' })
			).toHaveAttribute('aria-selected', 'true');
		});

		it('skips disabled tabs when navigating with ArrowRight', async () => {
			const user = userEvent.setup();
			const disabledItems = [
				items[0],
				{ ...items[1], disabled: true },
				items[2],
			];

			render(<Tabs items={disabledItems} />);

			screen.getByRole('tab', { name: 'Overview' }).focus();
			await user.keyboard('{ArrowRight}');

			expect(
				screen.getByRole('tab', { name: 'Settings' })
			).toHaveAttribute('aria-selected', 'true');
		});

		it('moves to the first tab on Home', async () => {
			const user = userEvent.setup();
			render(<Tabs items={items} defaultValue="settings" />);

			screen.getByRole('tab', { name: 'Settings' }).focus();
			await user.keyboard('{Home}');

			expect(
				screen.getByRole('tab', { name: 'Overview' })
			).toHaveAttribute('aria-selected', 'true');
		});

		it('moves to the last enabled tab on End', async () => {
			const user = userEvent.setup();
			render(<Tabs items={items} />);

			screen.getByRole('tab', { name: 'Overview' }).focus();
			await user.keyboard('{End}');

			expect(
				screen.getByRole('tab', { name: 'Settings' })
			).toHaveAttribute('aria-selected', 'true');
		});
	});
});
