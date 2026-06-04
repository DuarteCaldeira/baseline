import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Accordion } from './Accordion';

const items = [
	{ id: 'a', title: 'What is Baseline?', content: <p>A minimal React starter.</p> },
	{ id: 'b', title: 'How do I install it?', content: <p>Run pnpm install.</p> },
	{ id: 'c', title: 'Is it free?', content: <p>Yes, fully open source.</p> },
];

describe('Accordion', () => {
	it('renders all item titles', () => {
		render(<Accordion items={items} />);
		expect(screen.getByText('What is Baseline?')).toBeInTheDocument();
		expect(screen.getByText('How do I install it?')).toBeInTheDocument();
		expect(screen.getByText('Is it free?')).toBeInTheDocument();
	});

	it('all panels are closed by default', () => {
		render(<Accordion items={items} />);
		expect(screen.queryByText('A minimal React starter.')).not.toBeVisible();
	});

	it('opens a panel when its trigger is clicked', async () => {
		render(<Accordion items={items} />);
		await userEvent.click(screen.getByRole('button', { name: /what is baseline/i }));
		expect(screen.getByText('A minimal React starter.')).toBeInTheDocument();
	});

	it('sets aria-expanded to true on the open trigger', async () => {
		render(<Accordion items={items} />);
		const trigger = screen.getByRole('button', { name: /what is baseline/i });
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('sets aria-expanded to false on a closed trigger', () => {
		render(<Accordion items={items} />);
		expect(
			screen.getByRole('button', { name: /what is baseline/i })
		).toHaveAttribute('aria-expanded', 'false');
	});

	it('closes an open panel when its trigger is clicked again', async () => {
		render(<Accordion items={items} defaultValue="a" />);
		const trigger = screen.getByRole('button', { name: /what is baseline/i });
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('opens the defaultValue item on mount', () => {
		render(<Accordion items={items} defaultValue="b" />);
		expect(
			screen.getByRole('button', { name: /how do i install/i })
		).toHaveAttribute('aria-expanded', 'true');
	});

	describe('type="single" (default)', () => {
		it('closes the previously open item when a new one is opened', async () => {
			render(<Accordion items={items} defaultValue="a" />);

			await userEvent.click(
				screen.getByRole('button', { name: /how do i install/i })
			);

			expect(
				screen.getByRole('button', { name: /what is baseline/i })
			).toHaveAttribute('aria-expanded', 'false');
			expect(
				screen.getByRole('button', { name: /how do i install/i })
			).toHaveAttribute('aria-expanded', 'true');
		});
	});

	describe('type="multiple"', () => {
		it('allows multiple items to be open simultaneously', async () => {
			render(<Accordion items={items} type="multiple" defaultValue="a" />);

			await userEvent.click(
				screen.getByRole('button', { name: /how do i install/i })
			);

			expect(
				screen.getByRole('button', { name: /what is baseline/i })
			).toHaveAttribute('aria-expanded', 'true');
			expect(
				screen.getByRole('button', { name: /how do i install/i })
			).toHaveAttribute('aria-expanded', 'true');
		});

		it('accepts an array as defaultValue', () => {
			render(<Accordion items={items} type="multiple" defaultValue={['a', 'c']} />);
			expect(
				screen.getByRole('button', { name: /what is baseline/i })
			).toHaveAttribute('aria-expanded', 'true');
			expect(
				screen.getByRole('button', { name: /is it free/i })
			).toHaveAttribute('aria-expanded', 'true');
		});
	});

	describe('disabled items', () => {
		it('does not toggle a disabled item when clicked', async () => {
			const disabledItems = [
				...items.slice(0, 1),
				{ ...items[1], disabled: true },
			];
			render(<Accordion items={disabledItems} />);

			await userEvent.click(
				screen.getByRole('button', { name: /how do i install/i })
			);
			expect(
				screen.getByRole('button', { name: /how do i install/i })
			).toHaveAttribute('aria-expanded', 'false');
		});
	});

	describe('accessibility', () => {
		it('links each trigger to its panel via aria-controls and id', () => {
			render(<Accordion items={items} />);
			const trigger = screen.getByRole('button', { name: /what is baseline/i });
			const panelId = trigger.getAttribute('aria-controls')!;
			expect(document.getElementById(panelId)).toBeInTheDocument();
		});

		it('panels have role="region" and aria-labelledby pointing to their trigger', () => {
			render(<Accordion items={items} />);
			const trigger = screen.getByRole('button', { name: /what is baseline/i });
			const panel = document.getElementById(
				trigger.getAttribute('aria-controls')!
			)!;
			expect(panel).toHaveAttribute('role', 'region');
			expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
		});
	});

	describe('keyboard navigation', () => {
		it('moves focus to the next trigger on ArrowDown', async () => {
			render(<Accordion items={items} />);
			const [first, second] = screen.getAllByRole('button');
			first.focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(second).toHaveFocus();
		});

		it('moves focus to the previous trigger on ArrowUp', async () => {
			render(<Accordion items={items} />);
			const [first, second] = screen.getAllByRole('button');
			second.focus();
			await userEvent.keyboard('{ArrowUp}');
			expect(first).toHaveFocus();
		});

		it('wraps from last to first on ArrowDown', async () => {
			render(<Accordion items={items} />);
			const triggers = screen.getAllByRole('button');
			triggers[triggers.length - 1].focus();
			await userEvent.keyboard('{ArrowDown}');
			expect(triggers[0]).toHaveFocus();
		});

		it('moves focus to the first trigger on Home', async () => {
			render(<Accordion items={items} />);
			const triggers = screen.getAllByRole('button');
			triggers[2].focus();
			await userEvent.keyboard('{Home}');
			expect(triggers[0]).toHaveFocus();
		});

		it('moves focus to the last trigger on End', async () => {
			render(<Accordion items={items} />);
			const triggers = screen.getAllByRole('button');
			triggers[0].focus();
			await userEvent.keyboard('{End}');
			expect(triggers[triggers.length - 1]).toHaveFocus();
		});
	});
});
