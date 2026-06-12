import type { DateFormat } from './DatePicker.types';

const LOCALE = 'en-GB';

/** Portugal uses Monday as the first day of the week (ISO 8601). */
export const WEEK_STARTS_ON = 1 as const;

export const isSameDay = (a: Date, b: Date): boolean =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date): boolean =>
	a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const startOfDay = (date: Date): Date =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, n: number): Date => {
	const d = new Date(date);
	d.setDate(d.getDate() + n);
	return d;
};

export const addMonths = (date: Date, n: number): Date => {
	const d = new Date(date);
	const targetMonth = d.getMonth() + n;
	d.setMonth(targetMonth);
	if (d.getMonth() !== ((targetMonth % 12) + 12) % 12) {
		d.setDate(0);
	}
	return d;
};

/** Returns exactly 42 dates (6 weeks) for the calendar grid. */
export const getCalendarDays = (
	viewDate: Date,
	weekStartsOn: 0 | 1 = WEEK_STARTS_ON
): Date[] => {
	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const leadingDays = (firstDayOfMonth - weekStartsOn + 7) % 7;
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const daysInPrevMonth = new Date(year, month, 0).getDate();

	const days: Date[] = [];

	for (let i = leadingDays - 1; i >= 0; i--) {
		days.push(new Date(year, month - 1, daysInPrevMonth - i));
	}
	for (let i = 1; i <= daysInMonth; i++) {
		days.push(new Date(year, month, i));
	}
	const trailingDays = 42 - days.length;
	for (let i = 1; i <= trailingDays; i++) {
		days.push(new Date(year, month + 1, i));
	}

	return days;
};

/** English weekday abbreviations (Monday-first). */
const WEEKDAY_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** Returns 7 weekday labels, ordered from Monday. */
export const getWeekdays = (): Array<{ abbr: string; label: string }> => {
	const longFmt = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' });

	return WEEKDAY_ABBR.map((abbr, i) => {
		const day = (i + WEEK_STARTS_ON) % 7;
		const date = new Date(2024, 0, 7 + day);
		return { abbr, label: longFmt.format(date) };
	});
};

export const formatDisplay = (
	date: Date,
	format: DateFormat = 'DD/MM/YYYY'
): string => {
	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const yyyy = String(date.getFullYear());

	switch (format) {
		case 'DD/MM/YYYY':
			return `${dd}/${mm}/${yyyy}`;
		case 'DD-MM-YYYY':
			return `${dd}-${mm}-${yyyy}`;
		case 'YYYY-MM-DD':
			return `${yyyy}-${mm}-${dd}`;
	}
};

export const formatPlaceholder = (format: DateFormat): string => {
	switch (format) {
		case 'DD/MM/YYYY':
			return 'DD/MM/YYYY';
		case 'DD-MM-YYYY':
			return 'DD-MM-YYYY';
		case 'YYYY-MM-DD':
			return 'YYYY-MM-DD';
	}
};

export const formatDayLabel = (date: Date): string =>
	new Intl.DateTimeFormat(LOCALE, {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(date);

export const formatMonthYear = (date: Date): string =>
	new Intl.DateTimeFormat(LOCALE, {
		month: 'long',
		year: 'numeric',
	}).format(date);
