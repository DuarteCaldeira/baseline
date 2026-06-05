import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type KeyboardEvent,
	type RefObject,
} from 'react';

import {
	addDays,
	addMonths,
	getCalendarDays,
	isSameDay,
	isSameMonth,
	startOfDay,
	WEEK_STARTS_ON,
} from './DatePicker.utils';

type UseDatePickerOptions = {
	value?: Date;
	defaultValue?: Date;
	onChange?: (date: Date) => void;
	disabled?: boolean;
	min?: Date;
	max?: Date;
};

export type UseDatePickerReturn = {
	isOpen: boolean;
	selectedDate: Date | undefined;
	viewDate: Date;
	focusedDate: Date | null;
	days: Date[];
	containerRef: RefObject<HTMLDivElement | null>;
	triggerRef: RefObject<HTMLButtonElement | null>;
	calendarRef: RefObject<HTMLDivElement | null>;
	open: () => void;
	close: () => void;
	selectDate: (date: Date) => void;
	navigateMonth: (delta: number) => void;
	handleDayKeyDown: (e: KeyboardEvent<HTMLButtonElement>, date: Date) => void;
	handleTriggerKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
	isDisabled: (date: Date) => boolean;
	isSelected: (date: Date) => boolean;
	isToday: (date: Date) => boolean;
	isCurrentMonth: (date: Date) => boolean;
};

export const useDatePicker = ({
	value,
	defaultValue,
	onChange,
	disabled,
	min,
	max,
}: UseDatePickerOptions): UseDatePickerReturn => {
	const isControlled = value !== undefined;
	const today = useMemo(() => startOfDay(new Date()), []);

	const [internalDate, setInternalDate] = useState<Date | undefined>(
		defaultValue ? startOfDay(defaultValue) : undefined
	);
	const [viewDate, setViewDate] = useState<Date>(() => {
		const base = value ?? defaultValue ?? new Date();
		return new Date(base.getFullYear(), base.getMonth(), 1);
	});
	const [isOpen, setIsOpen] = useState(false);
	const [focusedDate, setFocusedDate] = useState<Date | null>(null);

	const containerRef = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const calendarRef = useRef<HTMLDivElement | null>(null);

	const selectedDate = (() => {
		if (!isControlled) return internalDate;
		if (!value) return undefined;
		return startOfDay(value);
	})();

	// Sync viewDate when controlled value changes externally
	useEffect(() => {
		if (value) {
			setViewDate(new Date(value.getFullYear(), value.getMonth(), 1));
		}
	}, [value]);

	// Focus the correct day button whenever focusedDate changes while open
	useEffect(() => {
		if (!isOpen || !focusedDate) return;
		const btn = calendarRef.current?.querySelector<HTMLButtonElement>(
			`[data-date="${focusedDate.toDateString()}"]`
		);
		btn?.focus();
	}, [focusedDate, isOpen]);

	// Close on pointer-down outside the component
	useEffect(() => {
		if (!isOpen) return;
		const handlePointerDown = (e: PointerEvent) => {
			if (!containerRef.current?.contains(e.target as Node)) close();
		};
		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	}, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

	const isDisabled = useCallback(
		(date: Date): boolean => {
			const d = startOfDay(date);
			if (min && d < startOfDay(min)) return true;
			if (max && d > startOfDay(max)) return true;
			return false;
		},
		[min, max]
	);

	const isSelected = useCallback(
		(date: Date) => !!selectedDate && isSameDay(date, selectedDate),
		[selectedDate]
	);

	const isToday = useCallback((date: Date) => isSameDay(date, today), [today]);

	const isCurrentMonth = useCallback(
		(date: Date) => isSameMonth(date, viewDate),
		[viewDate]
	);

	const close = useCallback(() => {
		setIsOpen(false);
		setFocusedDate(null);
		triggerRef.current?.focus();
	}, []);

	const open = useCallback(() => {
		if (disabled) return;
		const initial = selectedDate ?? today;
		setViewDate(new Date(initial.getFullYear(), initial.getMonth(), 1));
		setFocusedDate(initial);
		setIsOpen(true);
	}, [disabled, selectedDate, today]);

	const selectDate = useCallback(
		(date: Date) => {
			const d = startOfDay(date);
			if (!isControlled) setInternalDate(d);
			onChange?.(d);
			setIsOpen(false);
			setFocusedDate(null);
			triggerRef.current?.focus();
		},
		[isControlled, onChange]
	);

	const navigateMonth = useCallback((delta: number) => {
		setViewDate((prev) => addMonths(prev, delta));
		setFocusedDate((prev) => (prev ? addMonths(prev, delta) : null));
	}, []);

	const moveFocus = useCallback(
		(from: Date, delta: number | ((d: Date) => Date)) => {
			const next = typeof delta === 'function' ? delta(from) : addDays(from, delta);
			setFocusedDate(next);
			if (!isSameMonth(next, viewDate)) {
				setViewDate(new Date(next.getFullYear(), next.getMonth(), 1));
			}
		},
		[viewDate]
	);

	const handleDayKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>, date: Date) => {
			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					moveFocus(date, -1);
					break;
				case 'ArrowRight':
					e.preventDefault();
					moveFocus(date, 1);
					break;
				case 'ArrowUp':
					e.preventDefault();
					moveFocus(date, -7);
					break;
				case 'ArrowDown':
					e.preventDefault();
					moveFocus(date, 7);
					break;
				case 'Home':
					e.preventDefault();
					moveFocus(date, (d) => {
						const offset = (d.getDay() - WEEK_STARTS_ON + 7) % 7;
						return addDays(d, -offset);
					});
					break;
				case 'End':
					e.preventDefault();
					moveFocus(date, (d) => {
						const offset = 6 - ((d.getDay() - WEEK_STARTS_ON + 7) % 7);
						return addDays(d, offset);
					});
					break;
				case 'PageUp':
					e.preventDefault();
					moveFocus(date, (d) => addMonths(d, -1));
					break;
				case 'PageDown':
					e.preventDefault();
					moveFocus(date, (d) => addMonths(d, 1));
					break;
				case 'Enter':
				case ' ':
					e.preventDefault();
					if (!isDisabled(date) && isCurrentMonth(date)) selectDate(date);
					break;
				case 'Escape':
				case 'Tab':
					close();
					break;
			}
		},
		[moveFocus, isDisabled, isCurrentMonth, selectDate, close]
	);

	const handleTriggerKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>) => {
			switch (e.key) {
				case 'Enter':
				case ' ':
				case 'ArrowDown':
					e.preventDefault();
					if (!isOpen) open();
					break;
				case 'Escape':
					if (isOpen) close();
					break;
			}
		},
		[isOpen, open, close]
	);

	const days = useMemo(
		() => getCalendarDays(viewDate, WEEK_STARTS_ON),
		[viewDate]
	);

	return {
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
	};
};
