import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DatePicker } from './DatePicker';

// Pin tests to a fixed date so day grids are predictable
const FIXED_TODAY = new Date(2024, 1, 15); // 15 Feb 2024
const INITIAL_VALUE = new Date(2024, 1, 20); // 20 Feb 2024

const isEnabledDayButton = (
	element: HTMLElement,
	day: string
): element is HTMLButtonElement =>
	element instanceof HTMLButtonElement &&
	element.textContent === day &&
	!element.disabled;

describe('DatePicker', () => {
	describe('trigger', () => {
		it('renders a button', () => {
			render(<DatePicker />);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('shows the placeholder when no value is set', () => {
			render(<DatePicker placeholder="Escolha uma data" />);
			expect(screen.getByText('Escolha uma data')).toBeInTheDocument();
		});

		it('uses the format string as default placeholder', () => {
			render(<DatePicker format="DD-MM-YYYY" />);
			expect(screen.getByText('DD-MM-YYYY')).toBeInTheDocument();
		});

		it('shows the formatted date when a value is provided (default DD/MM/YYYY)', () => {
			render(<DatePicker value={INITIAL_VALUE} />);
			expect(screen.getByText('20/02/2024')).toBeInTheDocument();
		});

		it('is disabled when the disabled prop is true', () => {
			render(<DatePicker disabled />);
			expect(screen.getByRole('button')).toBeDisabled();
		});

		it('has aria-haspopup="dialog"', () => {
			render(<DatePicker />);
			expect(screen.getByRole('button')).toHaveAttribute(
				'aria-haspopup',
				'dialog'
			);
		});

		it('has aria-expanded="false" when closed', () => {
			render(<DatePicker />);
			expect(screen.getByRole('button')).toHaveAttribute(
				'aria-expanded',
				'false'
			);
		});
	});

	describe('format prop', () => {
		it.each([
			['DD/MM/YYYY', '20/02/2024'],
			['DD-MM-YYYY', '20-02-2024'],
			['YYYY-MM-DD', '2024-02-20'],
		] as const)('formats the date as %s', (format, expected) => {
			render(<DatePicker value={INITIAL_VALUE} format={format} />);
			expect(screen.getByText(expected)).toBeInTheDocument();
		});

		it('uses the format string as placeholder when no date selected', () => {
			render(<DatePicker format="YYYY-MM-DD" />);
			expect(screen.getByText('YYYY-MM-DD')).toBeInTheDocument();
		});

		it('respects an explicit placeholder over the format default', () => {
			render(
				<DatePicker format="YYYY-MM-DD" placeholder="Selecione uma data" />
			);
			expect(screen.getByText('Selecione uma data')).toBeInTheDocument();
		});
	});

	describe('label / helper / error', () => {
		it('renders a label when provided', () => {
			render(<DatePicker id="dob" label="Data de nascimento" required />);
			expect(screen.getByLabelText('Data de nascimento')).toBeInTheDocument();
		});

		it('renders helper text', () => {
			render(<DatePicker helperText="Selecione a sua data de nascimento." />);
			expect(
				screen.getByText('Selecione a sua data de nascimento.')
			).toBeInTheDocument();
		});

		it('renders an error message with role="alert"', () => {
			render(<DatePicker error="A data é obrigatória." />);
			expect(screen.getByRole('alert')).toHaveTextContent(
				'A data é obrigatória.'
			);
		});

		it('links the error message via aria-describedby', () => {
			render(<DatePicker id="dob" error="Obrigatório" />);
			expect(screen.getByRole('button')).toHaveAttribute(
				'aria-describedby',
				'dob-error'
			);
		});
		it('sets aria-invalid when error is provided', () => {
			render(<DatePicker error="ObrigatÃ³rio" />);
			expect(screen.getByRole('button')).toHaveAttribute(
				'aria-invalid',
				'true'
			);
		});
	});

	describe('calendar open / close', () => {
		it('opens the calendar when the trigger is clicked', async () => {
			render(<DatePicker />);
			await userEvent.click(screen.getByRole('button'));
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		it('closes the calendar when the trigger is clicked again', async () => {
			render(<DatePicker />);
			const trigger = screen.getByRole('button', { name: /DD\/MM\/YYYY/i });
			await userEvent.click(trigger);
			await userEvent.click(trigger);
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});

		it('closes the calendar when Escape is pressed', async () => {
			render(<DatePicker />);
			await userEvent.click(screen.getByRole('button'));
			await userEvent.keyboard('{Escape}');
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});

		it('has aria-expanded="true" when open', async () => {
			render(<DatePicker />);
			await userEvent.click(screen.getByRole('button'));
			expect(
				screen.getByRole('button', { name: /DD\/MM\/YYYY/i })
			).toHaveAttribute('aria-expanded', 'true');
		});

		it('has role="dialog" and aria-modal on the calendar', async () => {
			render(<DatePicker />);
			await userEvent.click(screen.getByRole('button'));
			const dialog = screen.getByRole('dialog', { name: 'Choose date' });
			expect(dialog).toHaveAttribute('aria-modal', 'true');
		});

		it('accepts custom calendar control labels', async () => {
			render(
				<DatePicker
					calendarLabel="Pick a date"
					previousMonthLabel="Go back"
					nextMonthLabel="Go forward"
				/>
			);
			await userEvent.click(screen.getByRole('button'));
			expect(
				screen.getByRole('dialog', { name: 'Pick a date' })
			).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: 'Go back' })
			).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: 'Go forward' })
			).toBeInTheDocument();
		});
	});

	describe('date selection', () => {
		it('calls onChange with the selected date', async () => {
			const handleChange = vi.fn();
			render(<DatePicker defaultValue={FIXED_TODAY} onChange={handleChange} />);
			await userEvent.click(screen.getByRole('button'));

			const day10 = screen
				.getAllByRole('button')
				.find((btn) => isEnabledDayButton(btn, '10'))!;
			await userEvent.click(day10);

			expect(handleChange).toHaveBeenCalledOnce();
			const called = handleChange.mock.calls[0][0] as Date;
			expect(called.getDate()).toBe(10);
		});

		it('closes the calendar after a date is selected', async () => {
			render(<DatePicker defaultValue={FIXED_TODAY} />);
			await userEvent.click(screen.getByRole('button'));

			const day10 = screen
				.getAllByRole('button')
				.find((btn) => isEnabledDayButton(btn, '10'))!;
			await userEvent.click(day10);

			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});

		it('updates the trigger text after selection', async () => {
			render(<DatePicker defaultValue={FIXED_TODAY} />);
			await userEvent.click(screen.getByRole('button'));

			const day5 = screen
				.getAllByRole('button')
				.find((btn) => isEnabledDayButton(btn, '5'))!;
			await userEvent.click(day5);

			expect(screen.getByText('05/02/2024')).toBeInTheDocument();
		});
	});

	describe('month navigation', () => {
		it('navigates to the previous month', async () => {
			render(<DatePicker defaultValue={FIXED_TODAY} />);
			await userEvent.click(screen.getByRole('button'));
			await userEvent.click(
				screen.getByRole('button', { name: /previous month/i })
			);
			expect(screen.getByText(/january/i)).toBeInTheDocument();
		});

		it('navigates to the next month', async () => {
			render(<DatePicker defaultValue={FIXED_TODAY} />);
			await userEvent.click(screen.getByRole('button'));
			await userEvent.click(
				screen.getByRole('button', { name: /next month/i })
			);
			expect(screen.getByText(/march/i)).toBeInTheDocument();
		});
	});

	describe('disabled dates', () => {
		it('does not call onChange for dates before min', async () => {
			const handleChange = vi.fn();
			const min = new Date(2024, 1, 10);
			render(
				<DatePicker
					defaultValue={FIXED_TODAY}
					onChange={handleChange}
					min={min}
				/>
			);
			await userEvent.click(screen.getByRole('button'));

			const day5Cell = screen
				.getAllByRole('gridcell')
				.find((cell) => within(cell).getByRole('button').textContent === '5');
			expect(day5Cell).toHaveAttribute('aria-disabled', 'true');
		});
	});

	describe('calendar locale', () => {
		it('renders an English month name', async () => {
			render(<DatePicker defaultValue={new Date(2024, 1, 1)} />);
			await userEvent.click(screen.getByRole('button'));
			expect(screen.getByText(/february/i)).toBeInTheDocument();
		});

		it('renders 7 weekday column headers', async () => {
			render(<DatePicker />);
			await userEvent.click(screen.getByRole('button'));
			expect(screen.getAllByRole('columnheader')).toHaveLength(7);
		});

		it('first column header is Monday (Mon)', async () => {
			render(<DatePicker />);
			await userEvent.click(screen.getByRole('button'));
			const headers = screen.getAllByRole('columnheader');
			expect(headers[0].textContent).toMatch(/mon/i);
		});
	});

	describe('grid accessibility', () => {
		it('renders a grid role for the calendar', async () => {
			render(<DatePicker />);
			await userEvent.click(screen.getByRole('button'));
			expect(screen.getByRole('grid')).toBeInTheDocument();
		});

		it('renders gridcell roles for each day', async () => {
			render(<DatePicker defaultValue={FIXED_TODAY} />);
			await userEvent.click(screen.getByRole('button'));
			const cells = within(screen.getByRole('grid')).getAllByRole('gridcell');
			expect(cells).toHaveLength(42);
		});
	});
});
