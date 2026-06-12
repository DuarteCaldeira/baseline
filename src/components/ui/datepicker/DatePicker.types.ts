export type DateFormat = 'DD/MM/YYYY' | 'DD-MM-YYYY' | 'YYYY-MM-DD';

export type DatePickerProps = {
	id?: string;
	value?: Date;
	defaultValue?: Date;
	onChange?: (date: Date) => void;
	/** Controls how the selected date is displayed in the trigger.
	 *  Also used as the default placeholder (e.g. `DD/MM/AAAA`). Defaults to `'DD/MM/YYYY'`. */
	format?: DateFormat;
	label?: string;
	/** Overrides the auto-generated placeholder derived from `format`. */
	placeholder?: string;
	helperText?: string;
	error?: string;
	disabled?: boolean;
	min?: Date;
	max?: Date;
};
