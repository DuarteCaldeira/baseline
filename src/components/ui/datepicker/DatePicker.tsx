import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useFloatingPosition } from '@/hooks/useFloatingPosition';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/utils/cn';

import type { DatePickerProps } from './DatePicker.types';
import {
	formatDayLabel,
	formatDisplay,
	formatMonthYear,
	formatPlaceholder,
	getWeekdays,
	isSameDay,
} from './DatePicker.utils';
import { useDatePicker } from './useDatePicker';
import styles from './DatePicker.module.scss';

export const DatePicker = ({
	id,
	value,
	defaultValue,
	onChange,
	format = 'DD/MM/YYYY',
	label,
	placeholder,
	helperText,
	error,
	disabled,
	min,
	max,
}: DatePickerProps) => {
	const mounted = useMounted();
	const resolvedPlaceholder = placeholder ?? formatPlaceholder(format);
	const weekdays = getWeekdays();
	const helperId = helperText && id ? `${id}-helper` : undefined;
	const errorId = error && id ? `${id}-error` : undefined;
	const describedBy =
		[helperId, errorId].filter(Boolean).join(' ') || undefined;

	const {
		isOpen,
		selectedDate,
		viewDate,
		focusedDate,
		days,
		containerRef,
		triggerRef,
		calendarRef,
		open,
		close,
		selectDate,
		navigateMonth,
		handleDayKeyDown,
		handleTriggerKeyDown,
		isDisabled,
		isSelected,
		isToday,
		isCurrentMonth,
	} = useDatePicker({ value, defaultValue, onChange, disabled, min, max });

	const { style, placement } = useFloatingPosition({
		isOpen,
		triggerRef,
		floatingRef: calendarRef,
		align: 'start',
	});

	const handleToggleOpen = () => {
		if (disabled) return;

		if (isOpen) {
			close();
			return;
		}

		open();
	};

	return (
		<Stack
			ref={containerRef}
			gap="2"
			className={styles.datepicker}
		>
			{label && (
				<label className={styles['datepicker__label']} htmlFor={id}>
					{label}
				</label>
			)}

			<button
				ref={triggerRef}
				id={id}
				type="button"
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				disabled={disabled}
				className={cn(
					styles['datepicker__trigger'],
					error && styles['datepicker__trigger--error'],
					isOpen && styles['datepicker__trigger--open']
				)}
				onClick={handleToggleOpen}
				onKeyDown={handleTriggerKeyDown}
			>
				<span
					className={cn(
						styles['datepicker__trigger-text'],
						!selectedDate && styles['datepicker__trigger-text--placeholder']
					)}
				>
					{selectedDate ? formatDisplay(selectedDate, format) : resolvedPlaceholder}
				</span>
				<Icon
					icon={Calendar}
					size="sm"
					variant="subtle"
					className={styles['datepicker__trigger-icon']}
				/>
			</button>

			{mounted &&
				isOpen &&
				createPortal(
					<div
						ref={calendarRef}
						role="dialog"
						aria-modal="true"
						aria-label="Escolher data"
						style={style}
						className={cn(
							styles['datepicker__calendar'],
							styles[`datepicker__calendar--placement-${placement}`]
						)}
					>
					{/* Navigation */}
					<Stack
						as="nav"
						direction="row"
						justify="between"
						align="center"
						className={styles['datepicker__nav']}
					>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							iconOnly
							onClick={() => navigateMonth(-1)}
							aria-label="Mês anterior"
						>
							<Icon icon={ChevronLeft} size="sm" />
						</Button>
						<span
							className={styles['datepicker__nav__title']}
							aria-live="polite"
						>
							{formatMonthYear(viewDate)}
						</span>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							iconOnly
							onClick={() => navigateMonth(1)}
							aria-label="Mês seguinte"
						>
							<Icon icon={ChevronRight} size="sm" />
						</Button>
					</Stack>

					{/* Grid */}
					<div
						role="grid"
						aria-label={formatMonthYear(viewDate)}
						className={styles['datepicker__grid']}
					>
						{/* Weekday headers */}
						<div role="row" className={styles['datepicker__weekdays']}>
							{weekdays.map(({ abbr, label }) => (
								<div
									key={abbr}
									role="columnheader"
									aria-label={label}
									className={styles['datepicker__weekday']}
								>
									{abbr}
								</div>
							))}
						</div>

						{/* Day rows — 6 weeks */}
						{Array.from({ length: 6 }, (_, week) => (
							<div key={week} role="row" className={styles['datepicker__week']}>
								{days.slice(week * 7, week * 7 + 7).map((date) => {
									const outside = !isCurrentMonth(date);
									const disabled = isDisabled(date) || outside;
									const selected = isSelected(date);
									const today = isToday(date);
									const focused = !!focusedDate && isSameDay(date, focusedDate);

									return (
										<div
											key={date.toISOString()}
											role="gridcell"
											aria-selected={selected || undefined}
											aria-disabled={disabled || undefined}
										>
											<button
												type="button"
												tabIndex={focused ? 0 : -1}
												data-date={date.toDateString()}
												aria-label={formatDayLabel(date)}
												className={cn(
													styles['datepicker__day'],
													today && styles['datepicker__day--today'],
													selected && styles['datepicker__day--selected'],
													outside && styles['datepicker__day--outside'],
													disabled && styles['datepicker__day--disabled']
												)}
												aria-current={today ? 'date' : undefined}
												// Prevent trigger blur before onClick fires
												onPointerDown={(e) => e.preventDefault()}
												onClick={() => {
													if (!isDisabled(date) && !outside) selectDate(date);
												}}
												onKeyDown={(e) => handleDayKeyDown(e, date)}
											>
												{date.getDate()}
											</button>
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>,
					document.body
				)}

			{helperText && (
				<span id={helperId} className={styles['datepicker__helper']}>
					{helperText}
				</span>
			)}
			{error && (
				<span id={errorId} className={styles['datepicker__error']} role="alert">
					{error}
				</span>
			)}
		</Stack>
	);
};
