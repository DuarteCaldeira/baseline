export type DateFormat = 'DD/MM/YYYY' | 'DD-MM-YYYY' | 'YYYY-MM-DD';

type DatePickerA11yProps = {
	/** Accessible name for the calendar dialog. Defaults to `'Choose date'`. */
	calendarLabel?: string;
	/** Accessible name for the previous-month control. Defaults to `'Previous month'`. */
	previousMonthLabel?: string;
	/** Accessible name for the next-month control. Defaults to `'Next month'`. */
	nextMonthLabel?: string;
};

export type DatePickerProps = {
	id?: string;
	value?: Date;
	defaultValue?: Date;
	onChange?: (date: Date) => void;
	format?: DateFormat;
	label?: string;
	placeholder?: string;
	helperText?: string;
	error?: string;
	disabled?: boolean;
	required?: boolean;
	min?: Date;
	max?: Date;
} & DatePickerA11yProps;
